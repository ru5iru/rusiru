# Risks and recommendations

Purpose: prioritize evidence-backed follow-up work. Intended reader: maintainers, product owners, and operators.

Last verified against commit `0d6ea67e368badc5e2d52b7c601ea167c6be6208` on 2026-10-17.

**[Verified]** Findings below identify inspected code or observed command behavior. Impacts and effort are **[Inferred]** estimates for this small frontend; H/M/L mean high/medium/low. Recommendations are not implemented by this docs-only change. Browser/production failures are not claimed unless explicitly observed.

## Quick wins

| ID | Finding | Evidence (file:line) | Perspective | Impact | Effort | Recommended action |
| --- | --- | --- | --- | --- | --- | --- |
| R1 | Clean npm installation fails: lockfile and manifest disagree | [package.json:8](../package.json#L8), [lockfile](../package-lock.json); observed `npm ci` EUSAGE | Dev | H | L | Choose authoritative package manager; regenerate and review its lockfile, then verify clean install |
| R2 | Published summaries omit one of seven current projects | [en.json:135](../src/locales/en.json#L135), [index.html:251](../index.html#L251), [llms.txt](../public/llms.txt) | Product | M | L | Reconcile Jira Worklog Manager and counts across visible/SEO content |
| R3 | Original onboarding links contain placeholder project IDs | [README.md:7](../README.md#L7); original edit/deploy links | Dev | M | L | Confirm actual project and replace legacy instructions when ownership is known |
| R4 | Navbar observes section IDs only on mount while targets load lazily | [Navbar.tsx:34](../src/components/Navbar.tsx#L34), [Index.tsx:10](../src/pages/Index.tsx#L10) | Dev/Product | M | L | Register observers after targets exist; test cold loading and early clicks |
| R5 | Language storage calls can throw despite existence checks | [i18n.tsx:51](../src/i18n/i18n.tsx#L51), [i18n.tsx:61](../src/i18n/i18n.tsx#L61) | Arch | M | L | Handle denied/unavailable storage and retain in-memory fallback |
| R6 | First theme click compares `theme`, not resolved system appearance | [ThemeToggle.tsx:26](../src/components/ThemeToggle.tsx#L26), [App.tsx:16](../src/App.tsx#L16) | Product | L | L | Test system-dark default and toggle from resolved appearance |
| R7 | Content/editorial labels and static copy can drift | [Skills.tsx:13](../src/components/sections/Skills.tsx#L13), [en.json](../src/locales/en.json), [site.webmanifest](../public/site.webmanifest) | Product | L | L | Review 24 skill entries vs "25+", authored dates/statistics, manifest naming; ask owner for intended copy |
| R19 | Eager high-priority hero image is 1,115.15 kB in the build | [Hero.tsx:95](../src/components/sections/Hero.tsx#L95), [profile image](../src/assets/profile/profile-photo.webp); observed build output | Arch/Product | M | L | Generate an appropriately sized optimized asset; measure loading before/after |
| R20 | Lint baseline fails with three errors and eight warnings | [command.tsx:24](../src/components/ui/command.tsx#L24), [textarea.tsx:5](../src/components/ui/textarea.tsx#L5), [tailwind.config.ts:111](../tailwind.config.ts#L111), [check record](CHANGELOG.md) | Dev | M | L | Resolve errors and review Fast Refresh/ref-cleanup warnings separately from documentation |

## Medium-term

| ID | Finding | Evidence (file:line) | Perspective | Impact | Effort | Recommended action |
| --- | --- | --- | --- | --- | --- | --- |
| R8 | Nested project anchors/buttons and incomplete accordion/menu semantics | [Projects.tsx:66](../src/components/sections/Projects.tsx#L66), [Experience.tsx:66](../src/components/sections/Experience.tsx#L66), [Navbar.tsx:120](../src/components/Navbar.tsx#L120) | Product/Dev | H | M | Separate interactive elements; expose expanded/control relationships, manage hidden content and mobile focus; keyboard/screen-reader review |
| R9 | Fixed max-heights can clip long/translated descriptions | [Projects.tsx:101](../src/components/sections/Projects.tsx#L101), [Projects.tsx:118](../src/components/sections/Projects.tsx#L118), [Education.tsx:104](../src/components/sections/Education.tsx#L104) | Product | M | M | Use content-aware expansion and test longest copy at narrow widths |
| R10 | No locale schema checks or per-key fallback; only one locale shipped | [i18n.tsx:44](../src/i18n/i18n.tsx#L44), [i18n.tsx:75](../src/i18n/i18n.tsx#L75), [LanguageSelector.tsx:16](../src/components/LanguageSelector.tsx#L16) | Dev/Product | M | M | Define locale contract and missing-key policy; validate arrays/URLs/placeholders before shipping translations |
| R11 | Test suite has no behavioral coverage | [example.test.ts:5](../src/test/example.test.ts#L5), [setup.ts](../src/test/setup.ts) | Dev | H | M | Add meaningful tests for project visibility, navigation, preference restoration, and failure cases |
| R12 | Source content and SEO are maintained independently | [main.tsx:8](../src/main.tsx#L8), [index.html:407](../index.html#L407), [Index.tsx:21](../src/pages/Index.tsx#L21), [llms.txt](../public/llms.txt) | Arch/Dev | M | M | Generate public summaries from one reviewed content source; retain useful no-JS content |
| R13 | Lazy sections have null loading fallback and no custom error boundary | [Index.tsx:49](../src/pages/Index.tsx#L49), [App.tsx:18](../src/App.tsx#L18) | Arch/Product | M | M | Add deliberate loading/error recovery and test unavailable chunks |
| R14 | Duplicate accordions/project branches and Hero/Skills lists | [Projects.tsx:56](../src/components/sections/Projects.tsx#L56), [Projects.tsx:121](../src/components/sections/Projects.tsx#L121), [Hero.tsx:16](../src/components/sections/Hero.tsx#L16), [Skills.tsx:13](../src/components/sections/Skills.tsx#L13) | Dev | M | M | Share stable data/rendering boundaries after behavior tests exist |
| R15 | Reduced-motion behavior covers marquee only in imported CSS | [index.css:124](../src/index.css#L124), [Hero.tsx:51](../src/components/sections/Hero.tsx#L51), [Navbar.tsx:61](../src/components/Navbar.tsx#L61) | Product | M | M | Honor motion preferences across scroll, reveals, and transitions |

## Strategic

| ID | Finding | Evidence (file:line) | Perspective | Impact | Effort | Recommended action |
| --- | --- | --- | --- | --- | --- | --- |
| R16 | Hosting, release/rollback ownership, CI and observability are undocumented/unconfigured in repo | [README.md](../README.md), [package.json](../package.json), [Vite](../vite.config.ts); tracked-file inventory in audit | Arch/Dev | M | M | Identify actual host and owners; record tested release/rollback and failure reporting policy |
| R17 | Design plan promises a contact form and effects not delivered by current code | [plan.md:55](../.lovable/plan.md#L55), [Contact.tsx:10](../src/components/sections/Contact.tsx#L10), [About.tsx:66](../src/components/sections/About.tsx#L66) | Product | M | M | Decide which plan items remain requirements; update product status with owner input |
| R18 | Documentation had no architecture/setup/operations baseline before this change | [original README](../README.md), [original plan](../.lovable/plan.md), [audit](CHANGELOG.md) | Dev | M | L | Keep this index authoritative; assign review ownership and resolve unknown hosting/version policies |

## Open questions

For the original author:

- Which of npm, `bun.lock`, or `bun.lockb` is authoritative, and which runtime versions should CI support?
- Is the broad unused UI/query/toast infrastructure intentional scaffolding?
- Is eager locale bundling a deliberate size trade-off? Should missing locale data fall back or fail validation?

For the product/content owner:

- Are multiple languages and an actual contact form required, or should the older plan be revised?
- Which job title, technology count, project summaries, and resume wording should be canonical?
- Which interactions matter enough to measure, if any? No app analytics implementation is currently present.

For operations:

- What project/account hosts the public site, who controls DNS/TLS, and how are releases/rollbacks performed?
- What host fallback/status, cache retention, and security header rules are active?
- Who responds to broken resume/blog/demo links and client errors?

These are **[Unknown]** decisions; the questions deliberately avoid inventing answers.

## First-week onboarding checklist

- Read the overview, architecture, and audit; distinguish portfolio copy from this site's implementation.
- Follow setup, record the lockfile blocker/workaround, and run the baseline checks.
- Trace one project from JSON through `tr()` to the rendered accordion and outbound link.
- Smoke-check mobile navigation, keyboard focus, a system-dark theme, and an unmatched URL.
- Propose a small content change with all SEO copies reviewed; keep runtime changes separate from this docs baseline.
- Meet the content and hosting owners to resolve the questions above before release work.

## Keeping docs fresh

**[Recommendation]** Add a lightweight CI link checker and Mermaid parser check, a PR-template question about documentation/content/SEO impact, and `/docs` ownership in CODEOWNERS once maintainers choose owners. Revisit these guides on changes to routes, providers, locale schema, package scripts, or hosting, with a quarterly source comparison as a backstop. Update commit/date metadata and record drift in the changelog. These are suggestions only; no CI or ownership configuration is added here.

Next: [Glossary](10-glossary.md).
