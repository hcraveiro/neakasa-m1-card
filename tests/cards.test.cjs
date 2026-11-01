'use strict';

const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

function loadCards() {
  const registry = new Map();
  class HTMLElement {}
  const context = {
    HTMLElement,
    customElements: {
      get: (name) => registry.get(name),
      define: (name, element) => registry.set(name, element),
    },
    window: {},
    console,
    setInterval,
    clearInterval,
    URLSearchParams,
  };
  const source = readFileSync(join(__dirname, '..', 'neakasa-m1-card.js'), 'utf8');
  vm.runInNewContext(source, context, { filename: 'neakasa-m1-card.js' });
  return Object.fromEntries(registry);
}

const classes = loadCards();

function sensor(state, unit) {
  return { state: String(state), attributes: { unit_of_measurement: unit } };
}

test('all three Lovelace custom cards are registered', () => {
  for (const name of ['neakasa-m1-card', 'neakasa-cats-card', 'neakasa-activity-card']) {
    assert.equal(typeof classes[name], 'function');
  }
});

test('device card calls official button.press services', async () => {
  const card = new classes['neakasa-m1-card']();
  const calls = [];
  card.config = {
    confirm_actions: false,
    entities: {
      clean: 'button.neakasa_m1_clean_now',
      level: 'button.neakasa_m1_level_now',
    },
  };
  card._hass = { callService: async (domain, service, data) => { calls.push({ domain, service, data }); } };
  card.action('clean');
  card.action('level');
  assert.equal(calls.length, 2);
  assert.equal(calls[0].domain, 'button');
  assert.equal(calls[0].service, 'press');
  assert.equal(calls[0].data.entity_id, 'button.neakasa_m1_clean_now');
  assert.equal(calls[1].domain, 'button');
  assert.equal(calls[1].service, 'press');
  assert.equal(calls[1].data.entity_id, 'button.neakasa_m1_level_now');
});

test('Our Cats prefers official minute-based time sensor and converts duration', () => {
  const card = new classes['neakasa-cats-card']();
  const cat = { name: 'Cleo', stay: 'sensor.cats_room_cleo_stay_today' };
  card.config = { cats: [cat] };
  card._hass = { states: {
    'sensor.cats_room_cleo_stay_today': sensor(894, 's'),
    'sensor.cats_room_cleo_time_in_box_today': sensor(14.9, 'min'),
  } };
  assert.equal(card.formatStay(cat), '14m 54s');
  assert.equal(card.nativeStaySensor(cat).state, '14.9');
});

test('Our Cats falls back to legacy seconds and rejects unavailable official sensor', () => {
  const card = new classes['neakasa-cats-card']();
  const cat = { name: 'Neffy', stay: 'sensor.cats_room_neffy_stay_today' };
  card.config = { cats: [cat] };
  card._hass = { states: {
    'sensor.cats_room_neffy_stay_today': sensor(231, 's'),
    'sensor.cats_room_neffy_time_in_box_today': sensor('unavailable', 'min'),
  } };
  assert.equal(card.formatStay(cat), '3m 51s');
  card._hass.states['sensor.cats_room_neffy_time_in_box_today'] = sensor(3.85, 'min');
  assert.equal(card.formatStay(cat), '3m 51s');
});

test('Recent Activity prefers official event entity during legacy migration', () => {
  const card = new classes['neakasa-activity-card']();
  card.config = { entity: 'sensor.cats_room_neakasa_m1_recent_activity' };
  card._hass = { states: {
    'sensor.cats_room_neakasa_m1_recent_activity': { attributes: { events: [] } },
    'event.neakasa_m1_activity': { attributes: { event_type: 'cat_visit' } },
  } };
  assert.equal(card.activitySource().mode, 'event');
  delete card._hass.states['event.neakasa_m1_activity'];
  assert.equal(card.activitySource().mode, 'legacy');
});

test('Recent Activity reads and deduplicates all three official event types', async () => {
  const card = new classes['neakasa-activity-card']();
  card.config = { entity: 'event.neakasa_m1_activity', days: 7, limit: 10, cats: [] };
  card.draw = () => {};
  const timestamp = (secondsAgo) => new Date(Date.now() - secondsAgo * 1000).toISOString();
  const attrs = (recordId, eventType, endedAgo, catName = null) => ({
    record_id: recordId,
    event_type: eventType,
    started_at: timestamp(endedAgo + 40),
    ended_at: timestamp(endedAgo),
    duration_seconds: 40,
    cat_name: catName,
    weight: 3.8,
    weight_unit: 'kg',
  });
  const states = [
    { a: attrs(1, 'cat_visit', 180, 'Cleo') },
    { a: attrs(2, 'cleaning_completed', 120) },
    { a: attrs(3, 'leveling_completed', 60) },
    { a: attrs(1, 'cat_visit', 180, 'Cleo') },
  ];
  card._hass = {
    states: { 'event.neakasa_m1_activity': { attributes: {} } },
    callWS: async () => ({ 'event.neakasa_m1_activity': states }),
  };
  await card.loadHistory('event.neakasa_m1_activity');
  assert.equal(card.records.length, 3);
  assert.match(card.records[0].message, /Leveling completed in 40 s/);
  assert.match(card.records[1].message, /Smart Cleanup completed in 40 s/);
  assert.equal(card.records[2].catName, 'Cleo');
});

test('activity history handles array-form websocket responses', async () => {
  const card = new classes['neakasa-activity-card']();
  card.config = { entity: 'event.neakasa_m1_activity', days: 7, limit: 10, cats: [] };
  card.draw = () => {};
  const date = new Date(Date.now() - 50000).toISOString();
  card._hass = {
    states: { 'event.neakasa_m1_activity': { attributes: {} } },
    callWS: async () => [[{ a: { record_id: 8, event_type: 'cleaning_completed', started_at: date, ended_at: date, duration_seconds: 10 } }]],
  };
  await card.loadHistory('event.neakasa_m1_activity');
  assert.equal(card.records.length, 1);
});

test('device card calls official number.set_value for sand calibration', async () => {
  const card = new classes['neakasa-m1-card']();
  const calls = [];
  card.config = {
    entities: { calibrate: 'number.neakasa_m1_sand_calibration' },
    calibration: { options: [50, 60, 70, 80, 90, 100] },
  };
  card._hass = { callService: async (domain, service, data) => { calls.push({ domain, service, data }); } };
  card.dialog = (title, choices, callback) => callback(90);
  card.action('calibrate');
  assert.equal(calls.length, 1);
  assert.equal(calls[0].domain, 'number');
  assert.equal(calls[0].service, 'set_value');
  assert.equal(calls[0].data.entity_id, 'number.neakasa_m1_sand_calibration');
  assert.equal(calls[0].data.value, 90);
});

test('Our Cats keeps Recorder history for weight and daily visits', async () => {
  const card = new classes['neakasa-cats-card']();
  card.config = { days: 7, cats: [
    { name: 'Cleo', weight: 'sensor.cleo_weight', visits: 'sensor.cleo_visits_today' },
  ] };
  card._history = new Map();
  card.drawChart = () => {};
  let requestedPath = '';
  card._hass = { callApi: async (method, path) => {
    assert.equal(method, 'GET');
    requestedPath = path;
    return [
      [{ entity_id: 'sensor.cleo_weight', state: '3.8', last_changed: new Date().toISOString() }],
      [{ entity_id: 'sensor.cleo_visits_today', state: '8', last_changed: new Date().toISOString() }],
    ];
  } };
  await card.loadHistory();
  assert.match(requestedPath, /sensor.cleo_weight/);
  assert.match(requestedPath, /sensor.cleo_visits_today/);
  assert.equal(card._history.get('sensor.cleo_weight')[0].state, '3.8');
  assert.equal(card._history.get('sensor.cleo_visits_today')[0].state, '8');
});

test('Our Cats editor stub uses the official duration entity', () => {
  const example = classes['neakasa-cats-card'].getStubConfig();
  assert.match(example.cats[0].stay, /_time_in_box_today$/);
});

test('Recent Activity starts and stops its background refresh with card lifecycle', () => {
  const card = new classes['neakasa-activity-card']();
  card.config = { entity: 'event.neakasa_m1_activity', days: 7, limit: 10, cats: [] };
  card.draw = () => {};
  card._hass = { states: {} };
  card.connectedCallback();
  assert.ok(card._refreshTimer);
  card.disconnectedCallback();
  assert.equal(card._refreshTimer, null);
});

test('Recent Activity marks in-flight updates for retry', async () => {
  const card = new classes['neakasa-activity-card']();
  const entityId = 'event.neakasa_m1_activity';
  card.config = { entity: entityId, days: 7, limit: 10, cats: [] };
  card.draw = () => {};
  card._loading = true;
  card._hass = { states: { [entityId]: { attributes: {} } }, callWS: async () => ({}) };
  await card.loadHistory(entityId);
  assert.equal(card._queuedEntityId, entityId);
});
