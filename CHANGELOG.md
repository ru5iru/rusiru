# Changelog

Notable template changes are recorded here. This project has no tagged release
series yet; entries below describe the current development line, not a published
release. Git history is the source for individual commits. Older documentation
audits remain in [docs/CHANGELOG.md](docs/CHANGELOG.md).

## Unreleased

### Added
- MIT licence, contribution and security reporting guidance.
- GitHub bug report, feature request, and pull request templates.
- Optional View More support for Experience, formal Education, and Continuing
  Education through per-item `archived` flags. No items are archived by default.
- Per-language publication controls for sections, groups, records, points, and
  labels, plus configurable expansion, front-page placement, and project affiliations.

### Changed
- Locales are split into `src/locales/<lang>/<section>.json`, with `_meta.json`
  for shared root wording. Translated records merge by stable `id` and inherit
  omitted English values.

## Earlier development

The existing template includes the Engineering Broadsheet design, configurable
identity/theme/content, generated search metadata and static fallback content,
optimized imagery, accessible disclosures, and automated quality checks.
See the [documentation audit](docs/CHANGELOG.md) and [roadmap](roadmap.md) for
historical evidence and remaining owner-dependent work.