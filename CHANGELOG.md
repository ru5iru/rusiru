# Changelog

Notable template changes. Entries under Unreleased are not a published release.

## Unreleased

### Added
- Per-language publication controls for sections, groups, records, points, and labels.
- Configurable work-log expansion, front-page placement, and project affiliation labels.
- Optional View More for Experience, formal Education, and Continuing Education through per-item `archived` flags.
- MIT licence, contribution/security guidance, and GitHub issue/pull-request templates.

### Changed
- Locales use `src/locales/<lang>/<section>.json`, with `_meta.json` for root wording. Translated records merge by stable ID and inherit omitted English values.
- Removed obsolete settings, unused schema declarations, unreachable theme logic, and unused error-page styling while retaining supported template features.
- Simplified the README and consolidated practical guidance into customization, development, and deployment guides. Removed obsolete plans, audit reports, and duplicate documentation; refreshed agent and maintenance instructions.
