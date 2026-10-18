# Documentation changelog and audit

Purpose: preserve the documentation inventory, drift evidence, and verification history. Intended reader: reviewers and future maintainers.

Last verified against commit `e7f95698811156a1fa4a1807fdd6cc2c6e5a5e76` on 2026-10-18.

## 2026-10-18 — template configuration update

**[Verified]** Mode: **Update**, against `e7f95698811156a1fa4a1807fdd6cc2c6e5a5e76`. The previous guides described `0d6ea67`, before the template work merged through `57ada4b`/`e7f9569`. The audit used `git diff 0a5fd15..HEAD`, source/config reads, tracked Markdown inventory, and each document's `git log -1 --format=%cs`. Commit ranges matter here: some incoming code commits predate the documentation commit but entered this branch afterward.

Updated all 12 guide pages in place. Added config/theme/icon API coverage, public-media ownership, section settings and limitations, generator behavior, a fourth end-to-end sequence, current data relationships, roadmap gaps, and refreshed source citations. Preserved the historical audit below and restored the deleted original plan as an archived snapshot. No source, generated public files, manifests, or lockfiles were edited.

### Current inventory and path actions

**[Verified]** Dates below are Git modification dates before this uncommitted documentation update. Existing structure works; there are no moves or deletions in this update. The action column is the complete migration map; no separate `MIGRATION.md` is needed.

| Path | Topic | Audience | Last Git modification | Audit verdict | Action |
| --- | --- | --- | --- | --- | --- |
| [Root README](../README.md) | Template guide plus legacy Lovable workflow | Contributor | 2026-10-18 | Mostly accurate template paths; placeholder project links and broad config-only wording need qualification | Keep; qualify limits in guides |
| [AGENTS.md](../AGENTS.md) | Config/media/generator ownership rules | Developer | 2026-10-03 | Applicable architecture rules; wording/fact separation is not fully achieved | Keep; link and document implementation exceptions |
| [Template plan](../.lovable/plan/make-the-portfolio-a-fully-configurable-template-2026-10-02.md) | Template and quality roadmap | Author/product | 2026-10-02 | Partly implemented; content.json, full generation, pre-rendering and validation/tests remain planned | Keep as intent; audit each gap below |
| [docs/README.md](README.md) | Reading order and status | All roles | 2026-10-18 | Stale ownership summary and deleted plan link | Update index, scope and archive link |
| [01-overview.md](01-overview.md) | Stack/tree/history | New developer | 2026-10-18 | Stale media tree; missing config/scripts | Update in place |
| [02-getting-started.md](02-getting-started.md) | Setup/config/checks | Developer | 2026-10-18 | Stale settings ownership and logo recipe | Update config table, generator caveats and current check evidence |
| [03-architecture.md](03-architecture.md) | Boundaries and flows | Architect/developer | 2026-10-18 | Missing config/theme/generator; fixed section description | Update component/initial-flow diagrams; add generator sequence |
| [04-code-guide.md](04-code-guide.md) | Modules and change recipes | Developer | 2026-10-18 | Stale media/icon/skills/404 conventions | Update modules, customization steps and remaining debt |
| [05-product-guide.md](05-product-guide.md) | Features/journeys/gaps | Product/editor | 2026-10-18 | Missing template-author capabilities and roadmap status | Add template inventory and implementation limits |
| [06-data-model.md](06-data-model.md) | Records and lifecycle | Developer/editor | 2026-10-18 | Contact/social/skill shapes moved; missing site/theme ownership | Update fields, ER diagram and lifecycle |
| [07-api-and-integrations.md](07-api-and-integrations.md) | Routes/local APIs/handoffs | Developer/operator | 2026-10-18 | Missing config/plugin APIs; generated files called manual | Update APIs, public media and file contracts |
| [08-operations.md](08-operations.md) | Build/release/diagnosis | Operator | 2026-10-18 | Missing generator; origin/logging claims stale | Update generator diagram, ownership and triage |
| [09-risks-and-recommendations.md](09-risks-and-recommendations.md) | Follow-up priorities | Maintainer/product | 2026-10-18 | Some risks partly resolved; new config/generator edge cases | Retain IDs, distinguish resolved portions, add R21–R24 |
| [10-glossary.md](10-glossary.md) | Terms | All roles | 2026-10-18 | Missing config and generator terminology | Update in place |
| [CHANGELOG.md](CHANGELOG.md) | Audit/change evidence | Reviewer | 2026-10-18 | Historical baseline needs separation from current behavior | Append this update before retained history; repair deleted links |
| [public/llms.txt](../public/llms.txt) | Public automated-reader summary | Automated readers | 2026-05-13 | Still manually authored and omits one project | Keep runtime asset unchanged; retain risk |
| Original `.lovable/plan.md` | Historical portfolio intent | Product/maintainer | Deleted by incoming template history | Prior docs pointed to an absent file | Restore `0d6ea67` snapshot as [docs/_archive/original-portfolio-plan.md](_archive/original-portfolio-plan.md); link from index |

**[Verified]** No CONTRIBUTING, ADR/wiki directory, OpenAPI document, CI workflow, or alternative guide set was found. The archive is a restored source snapshot, not a replacement for the new template roadmap. It preserves original rationale and planned features without treating them as current requirements.

### Corrected drift and roadmap disagreements

| Previous claim / plan promise | Source evidence at this commit | Correction |
| --- | --- | --- |
| Resume/contact/blog-home URLs, skills and logos belong to locales/TSX | [site.json](../src/config/site.json), [config](../src/config/index.ts) | Distinguish language-neutral settings from locale record arrays and per-record URLs |
| Hero and Skills maintain duplicate lists | Both use config skills; Hero calls `allSkills()` | Mark data duplication resolved; rendering duplication remains |
| Personal media must be imported from src/assets | Config uses public/media paths | Repair links/tree and document config-only media swaps |
| Lower sections and Navbar are fixed | Both consume `sections`; Index skips unknown keys | Explain visibility/order plus invalid/empty/removed-target limits |
| Canonical metadata and 404 copy are hardcoded | Index/NotFound use config; NotFound uses locale keys | Correct metadata/404 descriptions; English theme/back-to-top labels remain |
| Sitemap is manual and manifest has blank names | [site-files.ts](../scripts/site-files.ts) derives three files from config | Document generated ownership, fixed icon paths, UTC date and dev/build lifecycle |
| Only NotFound logs errors | Config logs missing siteUrl/name/email/title | Explain logging checks do not stop execution or validate a schema |
| New plan's content.json separates all facts from wording | File absent; locale arrays/prose retain facts/URLs/dates | Mark planned, not implemented |
| New plan generates HTML/JSON-LD/llms and pre-renders via react-dom/server | Generator writes sitemap/robots/manifest only; main still clears root and calls createRoot | Keep static SEO copy/replacement explanation and remaining generation risk |
| New plan guarantees full locale fallback, validation and tests | i18n still returns missing string keys; only placeholder test exists | Keep missing-key/schema/coverage risks; no claimed full localization |
| New plan optimizes media and removes unused UI | Profile remains 1,115,145 bytes; broad UI kit remains | Separate file relocation from optimization/removal |
| Old original-plan links are valid | `.lovable/plan.md` deleted upstream | Point to restored historical archive and distinguish newer roadmap |
| Prior lint baseline is current | Rerun reports three errors and sixteen warnings, including eight new BrandIcons warnings | Refresh current status; retain earlier eight-warning record as history |

### Verification for this update

**[Verified]** The production build, existing one-test suite, and both TypeScript checks passed on the merged source during the preceding merge verification in this same session. Source has not changed since; those checks were not repeated for documentation-only edits. The imported generator is covered through `vite.config.ts`'s dependency even though the tooling config explicitly includes only that config file. The npm manifest/lockfiles are unchanged, and direct entries for react-helmet-async, Testing Library, jsdom and Vitest remain missing from the lockfile; the earlier clean-install blocker remains.

**[Verified]** A fresh `npm run lint` reports **3 errors and 16 warnings**: the same two empty interfaces and Tailwind require-style import errors; seven UI Fast Refresh warnings, one ref-cleanup warning, and eight Fast Refresh warnings in [BrandIcons](../src/components/icons/BrandIcons.tsx). No source fixes were made. The merged build reported main JavaScript at 380.02 kB (125.98 kB gzip); public media is no longer an imported hashed asset, so its absence from that asset summary does not mean the profile image was optimized.

**[Verified]** Final checks cover 13 documentation files (12 guides plus the restored archive): 449 local links/source paths resolve, cited source lines are in bounds, every guide/archive is indexed, and required metadata/Next links are present. All ten Mermaid diagrams parse with Mermaid 11.17.2; `git diff --check` passes. The historical plan text matches the Git snapshot verbatim. Only `/docs` files changed.

Browser usability, deployed hosting/account settings, live external URL availability, and actual page-speed measurements remain **[Unknown]**. The external links in the retained root README were not represented as verified workflows. Server/database guides and infrastructure-specific deployment diagrams remain inapplicable to the checked-in static application; no guide was removed or reorganized.

## 2026-10-17 — onboarding baseline (historical)

The record below describes source `0d6ea67` and the initial documentation commit `0a5fd15`, before the template merge. Its inventory dates, findings and execution counts are historical; the current inventory above supersedes them. Deleted plan links now lead to the preserved snapshot.

**[Verified]** Mode: **Update**. Existing documentation was limited to a structured Lovable starter README and a portfolio design plan. This change adds missing guides rather than reorganizing either. Source code, configs, dependency manifests, lockfiles, and published site content are outside the edit scope.

Added `docs/README.md`, `01-overview.md` through `10-glossary.md`, and this changelog. Added only an index link to the existing root README. Coverage includes source-backed setup, runtime boundaries, three flow sequences, conceptual data relationships, product status, integrations, operations, and prioritized risks.

## Existing-document inventory and migration actions

**[Verified]** Inventory used `git ls-files`, Markdown discovery including hidden tracked paths, source/config reads, and per-file `git log -1 --format=%cs`. No CONTRIBUTING, ARCHITECTURE, CHANGELOG, ADR/wiki directory, OpenAPI spec, CI workflow, or existing `/docs` set was found. Inline comments/docstrings were reviewed in the application path; none form a separate generated documentation system.

| Original path | Topic | Audience | Last modified in Git | Verdict and evidence | Action / migration map |
| --- | --- | --- | --- | --- | --- |
| [README.md](../README.md) | Lovable editing, local setup, stack, publishing/domain instructions | Contributor | 2025-01-01 | Stale/incomplete: stack/scripts match; project links are placeholders; external account/workflow claims unverified; no architecture/tests | Keep human guidance in place; add docs link; onboarding details now in docs |
| [.lovable/plan.md](_archive/original-portfolio-plan.md) | Original visual/feature plan | Product/designer | 2026-02-04 | Stale as behavior reference, useful historical intent; planned form/counters/effects differ from code; not linked from old README | Keep unchanged, link from index, qualify in audit/product guide |
| [public/llms.txt](../public/llms.txt) | Published portfolio summary and navigation | Automated readers | 2026-05-13 | Overlaps site copy; stale project list omits Jira Worklog Manager | Keep unchanged as runtime asset; record drift and proposed repair |

**[Verified]** No old document was deleted, moved, merged, split, or archived. The preceding table is the complete old-path action map. An archive and separate migration file are not needed in Update mode without moves. Runtime files such as [HTML](../index.html), [robots](../public/robots.txt), and [sitemap](../public/sitemap.xml) were audited as evidence, not relocated into onboarding documentation.

## Claim-by-claim disagreements

| Original claim / apparent implication | Current implementation | Documentation treatment |
| --- | --- | --- |
| README project URL identifies this Lovable project | `REPLACE_WITH_PROJECT_ID` remains in links | Mark unusable as project identity; ask maintainer; preserve original text |
| README requires only Node/npm, then `npm i` | No required app env vars found, but no version pin and clean npm lock install fails | Provide observed runtime baseline and explicit install limitation/workaround |
| README Git pushes synchronize to Lovable; Share → Publish / domain workflow | Account settings and deployment integration not checked in | Preserve as **[Unverified, from original doc]**; do not claim live automation |
| Plan: all six named projects; published llms list has same six | [locale](../src/locales/en.json) has seven, including Jira Worklog Manager; four featured and three additional | Record seven current entries and SEO drift |
| Plan: visual contact form with name/email/message | [Contact](../src/components/sections/Contact.tsx) has email and LinkedIn links only | Mark form planned/not implemented |
| Plan: animated stats/counters | [About](../src/components/sections/About.tsx) renders literal strings with reveal/hover effects | Describe static values, not counting animation |
| Plan: experience vertical timeline/animated markers | [Experience](../src/components/sections/Experience.tsx) renders accordion rows | Describe actual row interaction; keep plan as design history |
| Plan: parallax and smooth scroll indicator | [Hero](../src/components/sections/Hero.tsx) renders CSS animations/marquee without a scroll indicator or parallax handler | Do not present them as delivered features |
| Plan: project technology icons and skill tooltips | [Projects](../src/components/sections/Projects.tsx) renders text badges; [Skills](../src/components/sections/Skills.tsx) renders labeled chips without tooltip primitives | Describe actual badges/chips; Hero images separately have native title text |
| Plan/older copy: Blogger destination | [Blog](../src/components/sections/Blog.tsx) uses locale URLs on `iamrusiru.lovable.app` | Describe external blog without asserting a Blogger backend |
| Source comments imply hydration | [main.tsx:8](../src/main.tsx#L8) clears root and calls `createRoot`, not `hydrateRoot` | Explain replacement of static HTML |
| Locale/metadata summaries represent the live project list | `projects.geoSummary` and [index.html:251](../index.html#L251) still say six | Flag stale copies; documentation does not silently treat them as canonical |

**[Verified]** Other retained design directions include bold gradients, theme support, responsiveness, animation, education logos, and navigation/social links; the source contains corresponding structures. **[Unknown]** Visual fidelity, production performance, and whether every plan item remains desired require product/browser review. No original rationale or runbook has been discarded.

## History and missing topics

**[Verified]** History since the README/plan dates includes i18n expansion (`2bec1dc`), design changes (`a672181`), static HTML SEO work (`396df29`, `1af50bb`), and project/content edits. All areas lacked a newcomer-oriented explanation before this change. The added guides fill architecture, setup/tests, module boundaries, product status, data/reference, operations, risks, and terminology. Unresolved doc debt is host ownership, real publishing/rollback procedure, runtime/package-manager policy, and production checks.

## Verification record

**[Verified]** Source and documentation checks are recorded here to avoid implying source review is runtime certification.

| Check | Outcome |
| --- | --- |
| Initial worktree | Clean before documentation edits |
| Runtime observed | Node v22.22.1 / npm 11.11.1 |
| `npm ci --no-audit --no-fund` | Failed: EUSAGE, manifest/lockfile mismatch after registry access; initial offline attempt also hit ENOTCACHED |
| Local dependency workaround | `npm install --no-package-lock --no-audit --no-fund` succeeded; tracked manifests/lockfiles unchanged |
| Documentation links and cited paths | All 12 guide pages indexed; 342 local links/source paths validated, including source line bounds |
| Mermaid parsing | Nine diagrams passed Mermaid 11.17.2 parsing, including the revised concurrent state diagram |
| `npm run build` | Passed with Vite 5.4.21; output written to ignored `dist/` |
| `npm test` | Passed: one test in one file with Vitest 3.2.7; this is the placeholder assertion only |
| `npm run lint` | Failed: three errors and eight warnings in existing source/config |
| `npx --no-install tsc -p tsconfig.app.json` | Passed |
| `npx --no-install tsc -p tsconfig.node.json` | Passed; covers Vite config only |
| `git diff --check` | Passed; only README link and new docs are tracked changes |
| Production hosting / external account workflows / browser usability | Not verified; explicitly unknown |

**[Verified]** Build and test initially hit sandbox `spawn EPERM` while loading Vite/esbuild configuration, then passed when rerun with permission to spawn compiler processes. The successful dependency install resolved manifest ranges without using/updating the stale npm lockfile; these execution results therefore describe that local resolution, not a clean locked build.

**[Verified]** Lint errors: empty interfaces in [command.tsx:24](../src/components/ui/command.tsx#L24) and [textarea.tsx:5](../src/components/ui/textarea.tsx#L5), plus a forbidden require-style import in [tailwind.config.ts:111](../tailwind.config.ts#L111). Warnings: seven Fast Refresh export warnings in UI files (`badge`, `button`, `form`, `navigation-menu`, `sidebar`, `sonner`, `toggle`) and one ref-cleanup warning in [useScrollAnimation.ts:66](../src/hooks/useScrollAnimation.ts#L66). No source fixes were made.

**[Verified]** The build reports a 1,115.15 kB WebP profile asset and a 404.74 kB main JavaScript asset (135.67 kB gzip). These are artifact sizes from the observed build, not measured page speed or a performance budget. [Hero](../src/components/sections/Hero.tsx) loads that profile image eagerly with high fetch priority; image sizing is a useful follow-up.

Next: [Documentation index](README.md).
