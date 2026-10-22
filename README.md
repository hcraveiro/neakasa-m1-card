# Neakasa M1 Card

One JavaScript resource registers **two independent Home Assistant Lovelace cards**.

The device photograph and all six original Neakasa icons are embedded directly into `neakasa-m1-card.js`. No image files or icon paths are required for the device card.

> Development preview: test in a separate dashboard before replacing existing cards. The JavaScript passes a syntax check, but device actions and responsive layout have not yet been validated in the Home Assistant frontend.

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

## Installation for testing

1. Download `neakasa-m1-card.js` from this branch, or install the repository as a custom **Dashboard** repository in HACS after a suitable test release.
2. For a manual installation, save the file to `/config/www/neakasa-m1-card.js`.
3. In **Settings → Dashboards → Resources**, register `/local/neakasa-m1-card.js?v=0.1.0-dev2` as a **JavaScript module**.
4. Add both cards to a **test view** using the YAML examples above.
5. When replacing the old activity card, **remove the old `neakasa-activity-card.js` resource**, because both scripts register the same custom element.
6. Keep the original cards in place until you verify the new cards.

## HACS

`hacs.json` describes the root-level dashboard file. The repository is intended to be released as a HACS dashboard card after frontend testing.

## License

MIT.
