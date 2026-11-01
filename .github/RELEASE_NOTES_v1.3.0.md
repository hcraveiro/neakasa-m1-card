# Neakasa M1 Cards v1.3.0 — Official integration compatibility

Stable release validated with Neakasa Litterbox official integration **v1.6.0** on Home Assistant.

## Improvements

- **Recent Activity:** uses the official `event.*_activity` entity and Home Assistant Recorder to show cat visits, completed cleanings and leveling cycles, while preserving the previous appearance and cat photos. New activities update without manual browser refresh through state-change updates and periodic reconciliation.
- **Our Cats:** prefers official `*_time_in_box_today` duration sensors, correctly formatting seconds/minutes/hours; retains support for legacy `*_stay_today` sensors. Weight and visits charts remain unchanged.
- **Device card:** maintains status, sand level, waste-bucket indicator, visits, Clean and Level actions and calibration using official services and entities.
- All three cards remain in one HACS-managed `neakasa-m1-card.js` resource.

## Validation

- Automated JavaScript syntax verification and 12 compatibility tests, including card lifecycle and queued Recorder updates.
- Tested on Home Assistant Android app with official integration v1.6.0: cat visits, cleaning and leveling events displayed; new leveling activity appeared automatically without refreshing the application.
- The integration may report completed activities later than the physical machine returns to Idle; this cloud delay is expected and independent of the card.

## Upgrading

Install **v1.3.0** from HACS → Neakasa M1 Card. Reload the dashboard once to load the updated JS resource. No Home Assistant restart is needed for a card-only update.

The activity event entity for the validated installation is `event.cats_room_neakasa_m1_activity`. Existing YAML using the legacy activity sensor can auto-detect this official entity when it is the matching litter box. Activity history for the official integration starts accumulating after its first installation; previously stored cloud activities are not replayed.

This version supersedes beta `v1.3.0b2`.
