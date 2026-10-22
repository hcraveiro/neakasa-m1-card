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
    stay: sensor.neakasa_cleo_stay_today
    last_visit: sensor.cleo_last_visit
  - name: Neffy
    image: /local/neakasa/neffy.jpg
    weight: sensor.neffy_weight
    visits: sensor.neffy_visits_today
    stay: sensor.neakasa_neffy_stay_today
    last_visit: sensor.neffy_last_visit
  - name: Penny
    image: /local/neakasa/penny.jpg
    weight: sensor.penny_weight
    visits: sensor.penny_visits_today
    stay: sensor.neakasa_penny_stay_today
    last_visit: sensor.penny_last_visit
```

The selection is local to this card instance: no cat is selected on initial load, and tapping a selected cat deselects it. No helper is required. The selection resets after reloading the dashboard. The selected cat's detail panel includes a tappable Last visit row and touch swipes or the dots to switch between Weight and Daily visits charts. Cat photos remain local user-configurable assets.

**Version 1.1.0:** The card has been tested in Home Assistant. Use the HACS-managed resource after installing the release, or `/local/neakasa-m1-card.js?v=1.1.0` for manual installations. Do not register duplicate versions of the same resource.

## Dependencies and optional example package

**Important:** installing this repository through HACS installs only the JavaScript cards. It does **not** install Home Assistant helpers, automations, packages, or the Neakasa integration.

| Card | Integration entities | Extra package required? |
| --- | --- | --- |
| `custom:neakasa-m1-card` | Neakasa status, controls and metrics | **No** |
| `custom:neakasa-cats-card` | Each cat's weight, last visit and visits today | **Only for the displayed daily stay duration**, unless you provide your own `stay` sensors |
| `custom:neakasa-activity-card` | `input_text.neakasa_last_event` and its Recorder history | **Yes**, or an equivalent automation/event source that writes that helper |

A **complete reference package** is available at [`examples/neakasa_log.yaml`](examples/neakasa_log.yaml). It includes the event-producing automations, intermediate helpers, the daily stay counters and template sensors. This is **not a universal plug-and-play package**: the example is based on one Neakasa installation with **Cleo, Neffy and Penny**. Adapt the three cat names and entity IDs (last-visit and weight sensors, duration helpers) to your own cats, and confirm the exact states exposed by your integration.

### Installing the example package

1. Check that Home Assistant **packages** are enabled under your `homeassistant:` configuration. For example, `packages: !include_dir_named packages` inside `homeassistant:` in `configuration.yaml`.
2. Download [`examples/neakasa_log.yaml`](examples/neakasa_log.yaml), adapt its entity IDs and copy it to `/config/packages/neakasa_log.yaml`.
3. Ensure Recorder tracks `input_text.neakasa_last_event` for at least the number of days configured in the Activity card. **Do not exclude that entity from Recorder.**
4. Run Home Assistant configuration validation and restart Home Assistant. Check the three automations and the new helpers.
5. Configure `custom:neakasa-activity-card` with `entity: input_text.neakasa_last_event`. Configure `custom:neakasa-cats-card` with your stay sensor entity IDs.

**Do not install this example over an existing working `neakasa_log.yaml` or duplicate its helpers and automations.** Users who only want the main device card do not need the package. The example is a convenience for reproducing the custom enriched activity timeline; it is not part of, nor automatically configured by, the Neakasa integration.

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
