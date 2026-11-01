# Neakasa M1 Cards v1.3.0b2 — live activity refresh fix

**Beta update for official Neakasa Litterbox 1.6.0.**

## Fixed
- Recent Activity now rechecks Recorder every 15 seconds while the card is open, so newly completed visits, cleanings and leveling events appear without a manual browser refresh.
- History queries received while a previous query is still running are queued and replayed instead of being dropped.
- Refresh timer stops when the card is disconnected, avoiding unnecessary background work.
- Added automated regression tests for concurrent events and timer lifecycle.

## Retained from v1.3.0b1
- Official `event.*_activity` Recorder support, including `cat_visit`, `cleaning_completed`, `leveling_completed`.
- Official per-cat time-in-box duration sensors, legacy fallback, weight and visits charts.
- Device controls and sand calibration.
- All three cards in the single `neakasa-m1-card.js` resource.

## Hardware findings
- Official `event.cats_room_neakasa_m1_activity` generated a 900-second cleaning event (18:15–18:30, while the machine was blocked) and a 38-second leveling event (18:30–18:31).
- The Recorder correctly stored both events. Manual Ctrl+R displayed them; this beta addresses the missing automatic refresh.

**Test:** Install `v1.3.0b2` from HACS, refresh the dashboard once to load the new JavaScript, then perform a new level/clean and leave the dashboard open. The new event should appear automatically shortly after the integration reports it, typically within about 15 seconds. No HA restart required.

The stable `V1.2.2` release is unchanged.
