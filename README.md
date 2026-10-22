# Neakasa M1 Card

One JavaScript resource registers **three independent Home Assistant Lovelace cards**.

The device photograph and all six original Neakasa icons are embedded directly into `neakasa-m1-card.js`. No image files or icon paths are required for the device card.

> Version 1.0.0: the device card has been tested in Home Assistant, including the original artwork, More info, control actions and confirmation dialogs. The Activity card is bundled in the same resource; verify its cat image paths for your installation.

## Device card

```yaml
type: custom:neakasa-m1-card
name: Cat's Toilet
entities:
  status: sensor.neakasa_m1_status
  litter: sensor.neakasa_m1_sand_level
  waste: binary_sensor.neakasa_m1_waste_bucket_full
  visits: sensor.neakasa_m1_visits_today
  clean: button.neakasa_m1_clean_now
  level: button.neakasa_m1_level_now
  calibrate: number.neakasa_m1_sand_calibration
calibration:
  options: [50, 60, 70, 80, 90, 100]
  default: 90
confirm_actions: true
```

The status and indicators open More info. Clean and Level have confirmation by default. Calibrate opens an in-card dialog to select the percentage and calls `number.set_value`.

## Recent Activity card

```yaml
type: custom:neakasa-activity-card
entity: sensor.cats_room_neakasa_m1_recent_activity
limit: 10
days: 7
cats:
  - name: Cleo
    image: /local/neakasa/cleo.jpg
  - name: Neffy
    image: /local/neakasa/neffy.jpg
  - name: Penny
    image: /local/neakasa/penny.jpg
```

The `title` is optional and hidden by default. Cat names and avatar paths are user-configurable; missing avatars fall back to an icon. The timeline queries Recorder history, groups entries by day, emphasizes only the matched cat name, and strips final occurrence markers such as `(2)` from the UI without changing the recorded event.

## Our Cats card

The optional `custom:neakasa-cats-card` combines a horizontally scrollable, two-visible-cat carousel, today's visits and stay duration, last visit, and touch-swipe chart switching (Weight and Daily visits, 7 days). The two-across cat carousel has no outer card background. It reads existing Home Assistant entities and Recorder history, without requiring ApexCharts, Swipe Card, Button Card, or Stack in Card.

```yaml
type: custom:neakasa-cats-card
days: 7
cats:
  - name: Cleo
    image: /local/neakasa/cleo.jpg
    weight: sensor.cleo_weight
    visits: sensor.cleo_visits_today
    stay: sensor.cats_room_cleo_stay_today
    last_visit: sensor.cleo_last_visit
  - name: Neffy
    image: /local/neakasa/neffy.jpg
    weight: sensor.neffy_weight
    visits: sensor.neffy_visits_today
    stay: sensor.cats_room_neffy_stay_today
    last_visit: sensor.neffy_last_visit
  - name: Penny
    image: /local/neakasa/penny.jpg
    weight: sensor.penny_weight
    visits: sensor.penny_visits_today
    stay: sensor.cats_room_penny_stay_today
    last_visit: sensor.penny_last_visit
```

The selection is local to this card instance: no cat is selected on initial load, and tapping a selected cat deselects it. No helper is required. The selection resets after reloading the dashboard. The selected cat's detail panel includes a tappable Last visit row and touch swipes or the dots to switch between Weight and Daily visits charts. Cat photos remain local user-configurable assets.

**Version 1.1.0:** The card has been tested in Home Assistant. Use the HACS-managed resource after installing the release, or `/local/neakasa-m1-card.js?v=1.1.0` for manual installations. Do not register duplicate versions of the same resource.

## Integration dependency — no YAML package

All three cards use **native entities** from [Neakasa Litterbox (native history)](https://github.com/hcraveiro/ha-neakasa-litterbox), starting with version **v1.4.4b1** (leveling activity requires **v1.4.4b2**). The **Our Cats** and **Recent Activity** cards do not use external logging packages, input helpers, or automations.

| Card | Source |
| --- | --- |
| `custom:neakasa-m1-card` | Existing litter box integration entities |
| `custom:neakasa-cats-card` | Cat weight, visits and integration-native `*_stay_today` sensors, measured in seconds |
| `custom:neakasa-activity-card` | Integration-native `*_recent_activity` sensor with structured `events` attribute |

**Recent Activity:** set `entity: sensor.your_litterbox_recent_activity` (or `activity_entity:`) to your actual sensor. If no entity is specified, the card discovers the first matching native activity sensor automatically. It never calls the Home Assistant history/Recorder API.

**Our Cats:** use `stay: sensor.your_cat_stay_today` or `stay_native: sensor.your_cat_stay_today`. The card formats native seconds as minutes/seconds and can discover a sensor ending in `_<cat_name>_stay_today` if the configured `stay` sensor uses a previous entity ID; it does not read that previous sensor's value.

**Leveling events:** Neakasa Litterbox v1.4.4b2+ records leveling completions observed through MQTT, preserves them across HA restarts and includes them in `events`. Previous leveling events cannot be reconstructed retroactively. The SDK does not reliably distinguish manual from automatic leveling, so the card uses the neutral label **Leveling completed**. Daily durations use the device's cloud records and may differ from time measured by older HA automations.

The obsolete example package has been removed from this repository. **No package, logging helpers or logging automations are required.**


## Installation

1. Recommended: install `hcraveiro/neakasa-m1-card` as a custom **Dashboard** repository in HACS, select the latest release, and reload the browser. HACS manages the resource automatically.
2. Alternatively, for a manual installation save `neakasa-m1-card.js` to `/config/www/neakasa-m1-card.js`.
3. For manual installations only: in **Settings → Dashboards → Resources**, register `/local/neakasa-m1-card.js?v=1.1.0` as a **JavaScript module**. For HACS installs, do not add a duplicate manual resource.
4. Add any of the three cards using the YAML examples above. See the Dependencies section before configuring Recent Activity or the daily stay metrics.
5. When replacing the old activity card, **remove the old `neakasa-activity-card.js` resource**, because both scripts register the same custom element.
6. After verifying the new cards, remove the old dashboard cards (not the Neakasa integration/entities).

## HACS

`hacs.json` points HACS at the root-level `neakasa-m1-card.js`. All three custom elements are registered by this single resource. Install via HACS as a Dashboard repository. Keep the old `neakasa-activity-card.js` resource disabled when using the unified card to avoid duplicate custom-element registration.

## License

MIT.

## Versioning

Version 1.0.0 is the initial stable release. Version 1.1.0 adds the Our Cats card, including local cat selection and touch-swipable charts. The original six icons and device photo are embedded in the JavaScript; only cat avatar images remain user-configured.
