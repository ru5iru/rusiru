---
name: broadsheet-portfolio-redesign
description: Maintain the Engineering Broadsheet portfolio while preserving configurable content, localized publication, accessible interactions, and shared generation.
---

# Broadsheet maintenance workflow

Before changing runtime code, read [AGENTS.md](AGENTS.md), [DESIGN.md](DESIGN.md), and the [canonical prototype](docs/prototype/broadsheet-prototype.html). Use [docs/](docs/README.md) for current customization, development, and deployment guidance.

## Preserve the architecture

- Shared identity, links, skill data, media paths, and section order belong in `src/config/site.json`; color overrides belong in `src/config/theme.json`.
- Wording, record-specific content, publication flags, and placement controls belong in `src/locales/<lang>/<section>.json`; `_meta.json` holds root wording and language metadata.
- Extend `src/config/schema.ts` or `src/i18n/schema.ts` before introducing new settings or content. Do not invent personal facts or duplicate them in components.
- Preserve English fallback, stable-ID record merging, positional point merging, and per-language publication overrides. Hidden content must not leak into the rendered sections or English search output.
- Keep optional `archived` support for Experience, formal Education, and Continuing Education; projects use `featured`. Preserve `expanded`, front-page brief selection, and project affiliation labels.
- `scripts/site-files.ts` and `scripts/search-content.ts` own public search files, the static 404, and served/built HTML metadata and fallback. Preserve generation markers and change inputs/generators rather than outputs.
- `scripts/optimize-images.ts` consumes original education logos and generates the social card from the configured portrait, theme, and custom favicon. It does not optimize the portrait itself.

## Preserve design and interactions

- Keep Fraunces headlines, Newsreader body copy, IBM Plex Mono metadata, semantic newsprint/ink/crimson tokens, print rules, and both editions.
- Keep the masthead and index, About's front-page puzzle, the education/credential split, horizontal skill ledger, article previews, correspondence coupon, and colophon.
- Never reintroduce neon gradients, blur blobs, availability ears, tool-count grids, or stat counters.
- Use shared Radix `DisclosureRow` controls for Experience and Projects. Keep outbound links separate from triggers and preserve measured content height.
- Preserve individual, section, and global unfolding, project filtering, View More, lazy-safe front-page jumps, and target highlighting.
- Keep mobile navigation's Radix Dialog focus handling, delayed section observation, independent loading/error boundaries, and reduced-motion behavior.

## Validate and document

- Run behavioral tests and lint. Add tests when changing rules or fixing a regression; do not use copy, styling, or snapshots as rule tests.
- Local contributors run `bun run build`; in Lovable's managed workspace, inspect automatic compilation/type-check results instead of manually invoking them.
- For affected UI, exercise the real flow on desktop and mobile, including keyboard interaction and both themes. For publication changes, also check navigation, front-page briefs, language overrides, archives, and generated English content.
- Keep useful instructions current: short essentials in README, details in the relevant guide under docs. Update AGENTS for structural changes, this workflow for maintenance changes, and the Unreleased changelog for notable changes.
- Do not retain obsolete plans, audit histories, verification reports, screenshots, temporary tools, or test output as repository documentation. Preserve the canonical prototype, active guides, community files, source tests, original media, and platform-managed files.
- Use Conventional Commits with the trailer:

```text
Co-Authored-By: ru5iru <92708089+ru5iru@users.noreply.github.com>
```
