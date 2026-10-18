# Risks and recommendations

Purpose: prioritize evidence-backed follow-up work. Intended reader: maintainers, product owners, and operators.

Last verified against commit `e7f95698811156a1fa4a1807fdd6cc2c6e5a5e76` on 2026-10-18.

**[Verified]** Findings below identify inspected code or observed command behavior. Impacts and effort are **[Inferred]** estimates for this small frontend; H/M/L mean high/medium/low. Recommendations are not implemented by this docs-only change. Browser/production failures are not claimed unless explicitly observed.

## Quick wins

| ID | Finding | Evidence (file:line) | Perspective | Impact | Effort | Recommended action |
| --- | --- | --- | --- | --- | --- | --- |
| R1 | Clean npm installation fails: lockfile and manifest disagree | [package.json:8](../package.json#L8), [lockfile](../package-lock.json); observed `npm ci` EUSAGE | Dev | H | L | Choose authoritative package manager; regenerate and review its lockfile, then verify clean install |
| R2 | Published summaries omit one of seven current projects | [en.json:129](../src/locales/en.json#L129), [index.html:251](../index.html#L251), [llms.txt](../public/llms.txt) | Product | M | L | Reconcile Jira Worklog Manager and counts across visible/SEO content |
| R3 | Legacy Lovable onboarding links retain placeholder project IDs | [README.md:28](../README.md#L28); new template instructions coexist above them | Dev | M | L | Confirm actual project and revise legacy workflow when ownership is known |
| R4 | Navbar observes configured section IDs only on mount while targets load lazily | [Navbar.tsx:28](../src/components/Navbar.tsx#L28), [Index.tsx:55](../src/pages/Index.tsx#L55) | Dev/Product | M | L | Register observers after targets exist; test cold loading and early clicks |
| R5 | Language storage calls can throw despite existence checks | [i18n.tsx:51](../src/i18n/i18n.tsx#L51), [i18n.tsx:61](../src/i18n/i18n.tsx#L61) | Arch | M | L | Handle denied/unavailable storage and retain in-memory fallback |
| R6 | First theme click compares `theme`, not resolved system appearance | [ThemeToggle.tsx:26](../src/components/ThemeToggle.tsx#L26), [App.tsx:17](../src/App.tsx#L17) | Product | L | L | Test system-dark default and toggle from resolved appearance |
| R7 | Content/editorial labels and static copy can drift | [site skills](../src/config/site.json), [en.json](../src/locales/en.json), [HTML](../index.html) | Product | L | L | Review 24 configured skill entries vs "25+" and authored dates/statistics; manifest naming is now generated |
| R19 | Eager high-priority hero image remains 1,115,145 bytes | [Hero.tsx:49](../src/components/sections/Hero.tsx#L49), [public profile image](../public/media/profile/profile-photo.webp); inspected file size | Arch/Product | M | L | Generate an appropriately sized optimized asset; measure loading before/after; relocation did not optimize it |
| R20 | Current lint fails with three errors and sixteen warnings | [command.tsx:24](../src/components/ui/command.tsx#L24), [textarea.tsx:5](../src/components/ui/textarea.tsx#L5), [tailwind.config.ts:111](../tailwind.config.ts#L111), [check record](CHANGELOG.md) | Dev | M | L | Resolve errors and review UI/BrandIcons Fast Refresh and ref-cleanup warnings separately from documentation |
| R21 | Section settings accept unsupported/duplicate keys; empty/removed targets break navigation | [Index.tsx:45](../src/pages/Index.tsx#L45), [Index.tsx:56](../src/pages/Index.tsx#L56), [Navbar.tsx:10](../src/components/Navbar.tsx#L10), [Hero.tsx:11](../src/components/sections/Hero.tsx#L11) | Product/Dev | M | L | Validate supported unique IDs; provide a real skip fallback and handle missing projects target |
| R22 | Contact secondary platform setting does not change its LinkedIn icon/label | [Contact.tsx:62](../src/components/sections/Contact.tsx#L62), [site config](../src/config/site.json) | Product | L | L | Resolve presentation from platform or constrain the setting to LinkedIn |

## Medium-term

| ID | Finding | Evidence (file:line) | Perspective | Impact | Effort | Recommended action |
| --- | --- | --- | --- | --- | --- | --- |
| R8 | Nested project anchors/buttons and incomplete accordion/menu semantics | [Projects.tsx:66](../src/components/sections/Projects.tsx#L66), [Experience.tsx:66](../src/components/sections/Experience.tsx#L66), [Navbar.tsx:120](../src/components/Navbar.tsx#L120) | Product/Dev | H | M | Separate interactive elements; expose expanded/control relationships, manage hidden content and mobile focus; keyboard/screen-reader review |
| R9 | Fixed max-heights can clip long/translated descriptions | [Projects.tsx:101](../src/components/sections/Projects.tsx#L101), [Projects.tsx:118](../src/components/sections/Projects.tsx#L118), [Education.tsx:103](../src/components/sections/Education.tsx#L103) | Product | M | M | Use content-aware expansion and test longest copy at narrow widths |
| R10 | No locale schema checks or per-key fallback; only one locale shipped | [i18n.tsx:44](../src/i18n/i18n.tsx#L44), [i18n.tsx:75](../src/i18n/i18n.tsx#L75), [LanguageSelector.tsx:16](../src/components/LanguageSelector.tsx#L16) | Dev/Product | M | M | Define locale contract and missing-key policy; validate arrays/URLs/placeholders before shipping translations |
| R11 | Test suite has no behavioral coverage | [example.test.ts:5](../src/test/example.test.ts#L5), [setup.ts](../src/test/setup.ts) | Dev | H | M | Add meaningful tests for project visibility, navigation, preference restoration, and failure cases |
| R12 | Static HTML/JSON-LD/llms content remains independent of config and locales | [main.tsx:12](../src/main.tsx#L12), [HTML](../index.html), [llms.txt](../public/llms.txt), [generator](../scripts/site-files.ts) | Arch/Dev | M | M | Extend reviewed content generation while retaining useful no-JS output; three generated files do not solve the remaining copies |
| R13 | Lazy sections have null loading fallback and no custom error boundary | [Index.tsx:55](../src/pages/Index.tsx#L55), [App.tsx:19](../src/App.tsx#L19) | Arch/Product | M | M | Add deliberate loading/error recovery and test unavailable chunks |
| R14 | Duplicate accordions/project branches remain; duplicate Hero/Skills data is resolved | [Projects.tsx:56](../src/components/sections/Projects.tsx#L56), [Projects.tsx:121](../src/components/sections/Projects.tsx#L121), [allSkills](../src/config/index.ts) | Dev | M | M | Share remaining stable rendering boundaries after behavior tests; retain shared config data |
| R15 | Reduced-motion behavior covers marquee only in imported CSS | [index.css:124](../src/index.css#L124), [Hero.tsx:11](../src/components/sections/Hero.tsx#L11), [Navbar.tsx:55](../src/components/Navbar.tsx#L55) | Product | M | M | Honor motion preferences across scroll, reveals, and transitions |
| R23 | Config required-field checks only log; nested fields, URLs and theme tokens lack schemas | [config.ts:31](../src/config/index.ts#L31), [site-files.ts:12](../scripts/site-files.ts#L12) | Arch/Dev | M | M | Validate shapes and references before use; align error behavior with the "fail fast" comment |
| R24 | Generator uses build day as content lastmod and has no custom config watch hook | [site-files.ts:14](../scripts/site-files.ts#L14), [site-files.ts:48](../scripts/site-files.ts#L48) | Dev/Product | L | M | Define timestamp semantics and regeneration policy; inspect tracked output diffs after builds |

## Strategic

| ID | Finding | Evidence (file:line) | Perspective | Impact | Effort | Recommended action |
| --- | --- | --- | --- | --- | --- | --- |
| R16 | Hosting, release/rollback ownership, CI and observability are undocumented/unconfigured in repo | [README.md](../README.md), [package.json](../package.json), [Vite](../vite.config.ts); tracked-file inventory in audit | Arch/Dev | M | M | Identify actual host and owners; record tested release/rollback and failure reporting policy |
| R17 | Plans contain unimplemented features and broader template guarantees | [historical plan](_archive/original-portfolio-plan.md), [template plan](../.lovable/plan/make-the-portfolio-a-fully-configurable-template-2026-10-02.md), [generator](../scripts/site-files.ts) | Product | M | M | Confirm remaining scope: content.json, full SEO generation, pre-rendering, schema/fallback tests and old contact-form intent |
| R18 | Documentation drift after template merge is corrected here; ownership/runbook gaps remain | [audit](CHANGELOG.md), [operations](08-operations.md), [AGENTS.md](../AGENTS.md) | Dev | M | L | Assign doc owners and resolve hosting/runtime policies; maintain the updated config/generator guides |

## Open questions

**[Verified]** Resolved since the first audit: media paths now belong to site config/public media; Hero and Skills share one skill list; section order is configurable; 404 wording is localized; manifest names are generated. R7/R12/R14/R18 above distinguish remaining work from those completed changes. The generator still does not render HTML or enforce schemas.

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
