const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const source = fs.readFileSync('neakasa-m1-card.js', 'utf8');
const start = source.indexOf('nativeStaySensor(cat){');
const end = source.indexOf('\n formatStay(cat){', start);
assert.ok(start >= 0 && end > start, 'Native stay sensor method must exist');
const methodBody = source.slice(start + 'nativeStaySensor(cat){'.length, end).trim().replace(/}\s*$/, '');
const nativeStaySensor = new Function('cat', methodBody);

function resolve(cat, states) {
  return nativeStaySensor.call({ _hass: { states } }, cat);
}

const duration = (state) => ({ state: String(state), attributes: { unit_of_measurement: 's' } });

test('configured legacy sensor retains priority', () => {
  const legacy = duration(41);
  const official = duration(43);
  assert.equal(resolve({ name: 'Cleo', stay: 'sensor.cleo_old' }, {
    'sensor.cleo_old': legacy,
    'sensor.cats_room_cleo_time_in_box_today': official,
  }), legacy);
});

test('official upstream entity resolves automatically without YAML changes', () => {
  const official = duration(193);
  assert.equal(resolve({ name: 'Cleo', stay: 'sensor.cleo_old' }, {
    'sensor.cats_room_cleo_time_in_box_today': official,
  }), official);
});

test('legacy native stay today autodiscovery still works', () => {
  const legacy = duration(109);
  assert.equal(resolve({ name: 'Neffy' }, {
    'sensor.cats_room_neffy_stay_today': legacy,
  }), legacy);
});

test('non-second sensors are never mistaken for durations', () => {
  assert.equal(resolve({ name: 'Penny' }, {
    'sensor.cats_room_penny_time_in_box_today': {
      state: '5',
      attributes: { unit_of_measurement: 'min' },
    },
  }), null);
});
