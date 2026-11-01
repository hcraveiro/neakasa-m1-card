# Neakasa M1 Cards v1.3.0b1 — official integration 1.6.0 compatibility

**Pre-release for testing against [Neakasa Litterbox v1.6.0](https://github.com/roquerodrigo/ha-neakasa-litterbox/releases/tag/v1.6.0).** Contains all three cards in the same JavaScript resource.

## What's new

- **Recent Activity**: reads the official `event.*_activity` entity using Home Assistant Recorder's WebSocket history API. Supports `cat_visit`, `cleaning_completed`, and `leveling_completed`, with record timestamps, durations, cat names and weights. Deduplicates repeated records.
- **Our Cats**: prefers the upstream `*_time_in_box_today` entities, handling Home Assistant duration units (`s`, `min`, `h`) correctly and preserving minute/second display. The former `*_stay_today` sensors remain supported as a fallback. Weight and visits Recorder graphs remain unchanged.
- **Device card**: preserves sand level, waste bucket, visits, operating state, clean/level controls, and sand calibration using the official entity/service contract.
- Existing customizations, cat portraits, visual layout, and existing Lovelace configurations are retained.
- CI now checks JavaScript syntax and runs ten Node.js compatibility tests.

## Testing and migration

1. In HACS, select the **beta version** of `hcraveiro/neakasa-m1-card` and install `v1.3.0b1`. Refresh the dashboard and confirm all three cards still render with the existing integration.
2. Update your Neakasa integration to the official [v1.6.0](https://github.com/roquerodrigo/ha-neakasa-litterbox/releases/tag/v1.6.0). Avoid removing the Home Assistant configuration entry unless necessary; check entities and keep a backup.
3. The Recent Activity card will automatically prefer the official event entity when it becomes available. For explicit configuration, use `entity: event.neakasa_m1_activity` (actual entity ID may differ).
4. In Our Cats, `stay: sensor.<cat>_time_in_box_today` is preferred, but the previous `stay_today` configuration continues to work by auto-discovering official entities.
5. Verify cat visits, cleaning, leveling, historical charts and dashboard reloads/restarts before considering this beta stable.

**Notes:** The official integration seeds activity cursors when first installed, so older cloud activity is not replayed as new events. The card uses the Home Assistant Recorder retention period. Event history will build up as new activity occurs.

## Validation

- GitHub Actions: JavaScript syntax check and 10 compatibility tests passing.
- Live hardware/Recorder test with the official 1.6.0 integration is pending.

This pre-release does **not** change the stable `V1.2.2` release.
