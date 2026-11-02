# Neakasa M1 Cards v1.4.0 — Automatic cat photos

Stable release tested on a Home Assistant development installation.

## Improvements

- **Our Cats and Recent Activity:** automatically use the matching Neakasa `image.*_<cat_name>_photo` entity and its `entity_picture`; no photo upload to `www` is needed.
- Recent Activity can discover photos directly from the cat names in visit events, without a configured cats list.
- Existing `image:` URLs remain supported as a fallback. Use `image_entity:` in a cat's configuration to select an entity explicitly, for example if multiple entities match the same name.
- Photo changes are reflected when Home Assistant updates the image entity.

## Validation

- 13 automated compatibility tests passed.
- Cat photos were visually verified in the Home Assistant development dashboard.

## Upgrading

Install **v1.4.0** from HACS → Neakasa M1 Card and reload the dashboard. No Home Assistant restart is needed. Existing card configurations and local photo URLs can be kept; the integration's photo entity is preferred when available.
