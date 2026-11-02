# Neakasa M1 Cards v1.4.1 — Respect configured cat photos

Stable release validated on a Home Assistant development installation.

## Fix

- **Our Cats and Recent Activity:** an explicitly configured `image:` URL now takes priority over both `image_entity:` and automatically discovered Neakasa photo entities.
- Without `image:`, an explicit `image_entity:` is used when configured; otherwise the card discovers the matching photo entity automatically.
- Existing configurations can keep using local photos, such as `image: /local/neakasa/cleo.jpg`. Remove `image:` to use the integration photo instead. Configure each card separately when using both.

## Validation

- 13 automated compatibility tests passed, including URL priority and entity discovery.
- Local image URLs and automatically discovered integration photos were visually verified together in the Home Assistant development dashboard.

## Upgrading

Install **v1.4.1** from HACS → Neakasa M1 Card and reload the dashboard. No Home Assistant restart is needed. Existing configured image URLs will take precedence again after updating.
