# Deep cleanup audit — 2026-11-26

Scope: tracked source, locales/configuration, schemas, generators, tooling/CI,
deployment rules, styles, public assets, media sources, documentation, and tests.
The approved plan requires two independent checks before every removal.

## Baseline

- 53 behavioral tests pass; lint passes.
- 51 tracked TypeScript/TSX files: 50 reached from runtime, lazy section imports,
  test/tooling entry points, or generation. The remaining `src/vite-env.d.ts` is
  ambient Vite type discovery, not dead code.
- Every direct application dependency has a source or tooling consumer.
- No tracked build directories, dependency directories, log files, or
  TypeScript build-cache files were found.
- Chromium checks passed at 1280×1800, 950×663, and 390×844: seven sections,
  three roles, two schools, five credentials, five initial/eight total projects;
  individual/global disclosure controls, project archive, front-page jumps,
  themes, mobile menu/Escape, print shadow removal, and no horizontal overflow.
- Readable no-JavaScript homepage captured. Baseline screenshots, semantic
  states, scanners, and test output are temporary files outside the repository.

## Two-pass removal ledger

Pass 1 traces runtime/generator/tooling consumers. Pass 2 searches the tracked
repository independently and reviews schemas, dynamic lookup, tests, and docs.

| Candidate | Pass 1 | Pass 2 | Verdict |
| --- | --- | --- | --- |
| Hero `headlineBefore`, `headlineAfter`, `headlineLine2` | No translation or generator lookup; banner uses `bannerTitle` | Only hero JSON and obsolete schema declarations reference them | Remove three keys and requirements |
| Hero `scrollPrev`, `scrollNext`, `techStackLabel` | No carousel or technology list exists in Hero | Only hero JSON references the keys | Remove three keys |
| Nav `brand`, `darkMode` | Masthead uses configured name; edition toggle uses `toggleTheme`, `nightEdition`, `dayEdition` | No exact nav-key consumers; Tailwind's unrelated `darkMode` setting stays | Remove two keys and obsolete brand requirement |
| Projects `morePoints` | Full descriptions are displayed by shared DisclosureRow; toggle labels use `unfoldItem`/`foldItem` | Only JSON and schema reference the key | Remove key and requirement |
| Project item `isExternal` (two occurrences) | Every project outbound link already sets target/rel without consulting flag | JSON/schema plus two outdated guides; no conditional consumer or test | Remove values and obsolete schema field; update guide notices |
| About `_formatHint` | No component or generator reads it | Only locale JSON; README already documents `**bold**` and `==highlight==` | Remove obsolete gradient hint; preserve README guidance |
| About optional `stats` schema | About displays biography/briefs, no counter tiles; no stats data exists | Only schema and historical documentation; design explicitly forbids stat tiles | Remove obsolete declaration |
| Blog `geoSummary` | Blog and search generator use actual posts; neither reads this summary | No literal or dynamic consumer; inherited schema requirement only | Remove key and inherited requirement for Blog only |
| Theme `$`-key filtering | Parsed theme keys must match `^[a-z][a-z0-9-]*$` | All `applyTheme` inputs come from validated `themeConfig`; `$` keys cannot reach this filter | Remove always-true filter, retain validation and public function |
| Generated 404 `.meta` selector | Generated markup uses `kicker`, `number`, `message`, `description`, and links, never `meta` | Full generator/document review confirms no `.meta` class is emitted | Remove unused selector from generator; regenerate output |

## Kept deliberately

- **Portrait WebP:** the canonical HTML prototype references
  `public/media/profile/profile-photo.webp`, so it is not an orphan.
- **Original education logos:** optimization reads `media-src/logos/` before
  production builds; the optimized public logos are not redundant copies.
- **Configured skill icon assets, `resolveIcon`, `allSkills`, exported UI
  variants/dropdown helpers and brand registry fields:** documented/shared
  public interfaces or template configuration. Current rendering alone is not
  sufficient grounds to break those interfaces. Skills currently renders names,
  not icon grids; current documentation should say so.
- **Locale fallback, publication/archiving flags and dormant language menu:**
  supported features, even when the current English/default setup hides controls.
- **All global CSS classes/keyframes:** active literal, responsive, print,
  theme, or programmatically-added consumers were found.
- **Direct dependencies:** all runtime packages are used. Type packages are
  discovered by TypeScript; PostCSS/Tailwind tooling is used by configuration,
  and `tailwindcss-animate` supplies the live dropdown animations.
- **Lovable Vite bridge/HMR packages and `src/tailwind.config.lov.json`:**
  platform ownership/removal safety is unresolved; preserve rather than guess.
- **`.oj-cache`, installed dependencies, and `dist`:** platform/workspace/build
  artifacts, not tracked dead source. Do not interfere with platform operations.
- **Favicons, IndexNow key, generated search/404/manifest files, docs/specs,
  historical plans/audits, MIT/community files and CI:** useful or required.
- **Location coordinates and other personal facts:** preserve data and supported
  configuration rather than removing facts just because one renderer ignores them.

## Verification after implementation

Pending: complete test/lint rerun, automatic compilation, exact default-state
and generated-content comparisons, archived Experience/Education/CE and
multi-language browser checks, final reference scan, and clean commits.

This is an unused-code audit, not a dependency vulnerability audit or a
production-hosting certification. Owner/account tasks on the roadmap remain
outside this change.