# Neakasa M1 Card

One JavaScript resource registers **two independent Home Assistant Lovelace cards**.

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
entity: input_text.neakasa_last_event
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

## Installation

1. Recommended: install `hcraveiro/neakasa-m1-card` as a custom **Dashboard** repository in HACS, select the latest release, and reload the browser. HACS manages the resource automatically.
2. Alternatively, for a manual installation save `neakasa-m1-card.js` to `/config/www/neakasa-m1-card.js`.
3. For manual installations only: in **Settings → Dashboards → Resources**, register `/local/neakasa-m1-card.js?v=1.0.0` as a **JavaScript module**. For HACS installs, do not add a duplicate manual resource.
4. Add either or both cards using the YAML examples above.
5. When replacing the old activity card, **remove the old `neakasa-activity-card.js` resource**, because both scripts register the same custom element.
6. After verifying the new cards, remove the old dashboard cards (not the Neakasa integration/entities).

## HACS

`hacs.json` points HACS at the root-level `neakasa-m1-card.js`. Both custom elements are registered by this single resource. Install via HACS as a Dashboard repository. Keep the old `neakasa-activity-card.js` resource disabled when using the unified card to avoid duplicate custom-element registration.

## License

MIT.

## Versioning

Version 1.0.0 is the initial stable release. Future additions (such as an Our Cats card) will be developed separately. The original six icons and device photo are embedded in the JavaScript; only cat avatar images remain user-configured.
