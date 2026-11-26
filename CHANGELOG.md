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
- Expanded the customization guide into a complete template usage guide with configuration references, record examples, per-language controls, media workflows, validation, and troubleshooting.
- Started the template guide from forking the repository: fork, clone, keep the original as `upstream`, sync before working, then install and run.
- Project dossier rows list only the dossier number, affiliation, and period (period last); the `featured` flag stays logic-only, so no Featured/Archive label is rendered.
