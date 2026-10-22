# Neakasa M1 Card

Two Lovelace cards delivered by a **single JavaScript resource**.

> **Development preview:** Original Neakasa image and six original icons still need to be embedded. This is not a production release. Test in a separate view before replacing existing cards.

## Device card

```yaml
type: custom:neakasa-m1-card
name: Cat's Toilet
image: /local/neakasa/neakasa.webp
entities:
  status: sensor.neakasa_m1_status
  litter: sensor.neakasa_m1_sand_level
  waste: binary_sensor.neakasa_m1_waste_bucket_full
  visits: sensor.neakasa_m1_visits_today
  clean: button.neakasa_m1_clean_now
  level: button.neakasa_m1_level_now
  calibrate: number.neakasa_m1_sand_calibration
icons:
  litter: /local/neakasa/sand.png
  waste: /local/neakasa/waste.png
  visits: /local/neakasa/visits.png
  clean: /local/neakasa/clean.png
  level: /local/neakasa/level.png
  calibrate: /local/neakasa/calibrate.png
calibration:
  options: [50, 60, 70, 80, 90, 100]
  default: 90
confirm_actions: true
```

The image and icon paths above are temporary for the development preview. The final release is intended to embed all Neakasa artwork into the JavaScript, without requiring any icon configuration.

Indicators open Home Assistant More info. Clean and Level require confirmation by default. Calibrate displays a selector and calls `number.set_value`.

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

The title is optional. Cat names and avatars are configurable; if an avatar is missing, an icon is used. The card reads Recorder history, orders events newest first, highlights the cat name, groups events by day and removes final event occurrence counters such as `(2)` from the displayed text. The history itself is unchanged.

## Manual development installation

1. Copy `neakasa-m1-card.js` to `/config/www/`.
2. In Settings → Dashboards → Resources, add `/local/neakasa-m1-card.js?v=0.1.0-dev` as a JavaScript module.
3. Add either card to a **test view**.
4. Remove the previous `neakasa-activity-card.js` resource when migrating, because the old and new resources define the same custom element.

## HACS

The repository includes `hacs.json` for a dashboard plugin installation. Do **not** create a public release until the original artwork is embedded, code is tested on desktop and mobile, and resource installation is verified.

## License

MIT.
