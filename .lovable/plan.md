# Deep cleanup without functionality changes

## Goal

Remove genuinely unused configuration, code, styles, dependencies, and files while keeping the current site and supported template features working exactly as before. Use **Compact code** principles: remove dead paths and duplication, not readable code merely to save lines.

No application changes or deletions have been made during planning. The first inspection covered source inventory, locale schemas, configuration, consumer references, generators, assets, tooling, and existing tests. The complete audit and removal inventory come first after approval; candidate counts are not yet final.

## Initial findings

| Area | Evidence so far | Treatment |
| --- | --- | --- |
| Legacy hero wording | `headlineBefore`, `headlineAfter`, and `headlineLine2` remain required by the locale schema despite no current source/generator consumer found. `scrollPrev`, `scrollNext`, and `techStackLabel` also have no current consumer found. | High-confidence candidates; independently recheck all locale files, tests, and indirect consumers before coordinated removal. |
| Other locale leftovers | `nav.darkMode` and `projects.morePoints` have no current consumer found. `about._formatHint` describes an obsolete gradient highlight, but is editorial guidance rather than UI content. | Review individually; remove dead wording, move useful editing guidance into documentation rather than deleting its purpose. |
| Hero fields that are still active | About consumes profile captions, résumé/work actions, career briefs, project briefs, and CE labels. Search fallback consumes `srHeading` and résumé wording. | Keep. A field is not dead just because `Hero.tsx` does not read it. |
| Shared dropdown wrapper | The language selector currently imports four dropdown exports; the wrapper also contains submenus, radio/checkbox items, and other exports. | Audit internal dead branches, but preserve supported shared component interfaces. Do not replace the accessible language menu or remove multi-language support. |
| Skill icons/helpers | Current Skills renders names rather than icons, while config/schema, `resolveIcon`, `allSkills`, and README still describe icon support. | Trace actual internal consumers and distinguish stale implementation from documented template/public interfaces. Do not silently remove a supported interface or its required data. |
| Previous profile image | `profile-photo.webp` exists while the configured portrait is `illustrated-portrait.jpg`. | Candidate only: check generators, HTML, docs, and supported replacement workflows before deletion. |
| Dependencies | Every application dependency has a source/config reference in the initial scan. Some tooling packages have no literal import. | No package is approved for removal yet. Check type discovery, command usage, plugin loading, and dependency chains. |
| Platform files | Two Lovable Vite packages and `src/tailwind.config.lov.json` lack an established ownership/removal verdict. | Preserve unless platform ownership and safe removal are established; a missing import is insufficient evidence. |

## Safety rules: verify twice before each removal

**Pass 1 — structural evidence:** trace reachability from runtime entry points, lazy imports, locale discovery, generators, tests, build/lint configs, package scripts, CI, and deployment configuration. Trace exported symbols separately from whole files. Inventory CSS selectors, animation names, theme tokens, and config/media references.

**Pass 2 — independent confirmation:** inspect each proposed deletion with a targeted repository-wide search and consumer review, including dynamic keys, generated output, conditional branches, no-JavaScript content, documentation, and feature-enabled scenarios. Record both evidence sources for each candidate or closely related group.

- Classify entries as **remove**, **keep**, or **uncertain**. Only remove entries with both passes satisfied. Retain uncertain items with a concrete reason.
- Do not confuse hidden, archived, unpublished, optional, or currently disabled features with dead code/data.
- Preserve public routes, exported interfaces, content identities, links, visual appearance, and data. Remove obsolete locale keys only together with their obsolete schema requirements and affected tests/docs.
- Preserve configured section order/visibility, independent language publication, stable-ID translation merging and fallback, affiliation labels, front-page placement, expansion, and optional View More for Experience/Education/CE.
- Keep the canonical prototype, design specifications, licence/community files, useful repository guides/history, tests, source logos used for optimization, favicons, search/verification files, and configured media.
- Do not hand-edit generated outputs. Regenerate them through their existing owners when necessary.
- Do not change personal facts, introduce analytics, redesign the site, upgrade packages, or add features.

## Ordered work and small commits

### 1. Baseline and full audit

- Read remaining applicable design specifications and runtime/test/tooling files.
- Produce `docs/cleanup-audit.md`: deletion groups, both checks, retained uncertainties, and scope. Ignore repository metadata and installed dependencies as deletion targets; inspect dependencies only for usage evidence.
- Record baseline test/lint results and automatic compilation status. Capture desktop and mobile appearance, section/content counts, generated metadata, and key interaction states before changing runtime code.
- Review tracked files separately from ignored caches/build artifacts. Local generated artifacts are not source functionality and may be recreated automatically.

Commit: `docs: record deep cleanup audit and baseline`.

### 2. Dead locale/configuration cleanup

- Remove confirmed obsolete keys across all existing locales, obsolete schema fields, and genuinely dead internal configuration logic together.
- Preserve active accessibility wording, fallback content, template controls, and identity/media settings.
- Update editing guidance and affected behavioral tests. Compare generated content and visible content against baseline; removing unused settings must not remove published content.

Commit: `refactor: remove verified legacy configuration`.

### 3. Unreachable code and styles

- Remove confirmed unused internal modules, imports, variables, branches, and private helpers. Consolidate duplication only when it improves clarity and equivalence can be verified.
- Prune unused CSS/keyframes only after checking responsive variants, state selectors, print rules, programmatically added classes, and shared UI consumers.
- Preserve intentionally supported shared exports and dormant template features; retain modules required only when a second locale or an archive flag is enabled.
- Update architecture guidance only if a real structural rule changes.

Commit: `refactor: prune verified dead code and styles`.

### 4. Assets, dependencies, and repository hygiene

- Remove assets only when no current UI, generator, deployment, documentation, or supported template path requires them.
- Remove direct packages only after tracing toolchain/transitive requirements and confirming the replacement-free path works. Use Bun and keep `bun.lock` authoritative. Skip this part if no dependency is genuinely unused.
- Remove confirmed unwanted tracked output/temp files; add narrowly scoped ignore rules where appropriate. Do not remove reproducible media sources or platform-managed artifacts.
- Correct current documentation that points to removed things; preserve explicitly historical audit evidence rather than rewriting history.

Commit: `chore: remove verified unused assets and dependencies` (only if applicable).

### 5. Final verification and reconciliation

- Re-run the independent reference scan and ensure every removal has two pre-change checks and post-change evidence.
- Run the complete behavioral test suite and lint; inspect automatic production compilation results. Verify frozen dependency installation if packages changed. Do not manually invoke builds or typechecks in this workspace; the platform performs them automatically.
- Repeat desktop/mobile browser flows and compare with baseline; report what was checked and any remaining uncertainty.
- Update audit, relevant guides, Unreleased changelog, and roadmap with actual removals and protected items. Keep audit output concise and human-readable; do not commit screenshots, temporary scanners, or test reports.

Commit: `docs: finalize cleanup verification`.

Every implementation commit uses a Conventional Commit subject and:

```text
Co-Authored-By: ru5iru <92708089+ru5iru@users.noreply.github.com>
```

## Behavior verification matrix

| Flow | Required checks |
| --- | --- |
| Default site | All sections, published records, captions, media, outbound links, and first-open states match baseline; desktop/mobile and both themes. |
| Navigation | Direct hashes, delayed lazy sections, mobile menu open/close and keyboard focus, back-to-top. |
| Disclosures | Experience/Project single toggle, section/global fold/unfold, filters, View More/Show Less, front-page jump-and-unfold. |
| Optional template controls | Temporarily enable archiving separately for Experience, Education, and CE; confirm expansion, reveal/hide, and front-page jumps. Restore settings afterward. |
| Languages/publication | Test hidden sections/items/points/labels, English flag inheritance, translation overrides, stable-ID merging; temporarily add a second locale to exercise the actual menu and fallback. Restore test fixtures afterward. |
| Accessibility and styles | Keyboard controls, reduced motion, print behavior, responsive wrapping, focus states, and image loading. |
| Search/generation | Homepage/error-page metadata, canonical/social/JSON-LD, no-JavaScript fallback, sitemap, robots, manifest, llms, favicon and verification files; hidden content excluded and archived content retained. |
| Toolchain | Existing tests, lint, automatic compilation, generation/optimization, and dependency lock consistency. |

## Completion criteria

The audit spans the whole repository, every actual deletion passes both checks, the supported behavior matrix remains intact, and small reviewed commits capture the work. Final output states removal totals and anything deliberately retained—not a promise that zero unused bytes remain. Owner-dependent production/account items already on the roadmap remain outside this cleanup.