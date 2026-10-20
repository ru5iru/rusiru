# Risks and recommendations

Purpose: prioritize evidence-backed follow-up work. Intended reader: maintainers, product owners, and operators.

Original baseline: commit `e7f95698811156a1fa4a1807fdd6cc2c6e5a5e76`, 2026-10-18. Remediation verification: working tree, 2026-10-19 UTC.

**[Verified]** The original findings below are retained as historical evidence. The remediation table supersedes their current status; old line citations refer to the baseline, not the edited files. Production failures or deployment changes are not claimed.

## Remediation status — 2026-10-19

| IDs | Status | Implemented correction / remaining limitation |
| --- | --- | --- |
| R1 | Fixed | Bun 1.3.3 and text `bun.lock` are authoritative; removed stale npm/binary Bun locks. Frozen install passed in a clean temporary directory. |
| R2 | Fixed | Seven projects, including Jira Worklog Manager, feed generated HTML, JSON-LD and llms from current locale data. |
| R3 | Fixed | Removed starter placeholder URLs and duplicate README onboarding; documented actual workflow and template limits. |
| R4 | Fixed | Navbar observes late-inserted lazy targets; early navigation waits for targets. Cold-load Projects click verified. |
| R5 | Fixed | Denied language storage reads/writes retain in-memory operation and English fallback; tested both failure paths. |
| R6 | Fixed | Theme toggle uses resolved system appearance; first click under system dark visibly switched to light. |
| R7 | Partially resolved; editorial decision needed | Corrected technology count to 24 configured entries. Job title/role prose, claimed experience, authored dates, and “100% Code Quality” require content-owner confirmation; no new career facts invented. |
| R8 | Fixed | Shared Radix collapsible rows expose expanded/control relationships and remove hidden panels from interaction. Project outbound links are separate controls. Mobile modal traps focus, closes on Escape and restores focus. |
| R9 | Fixed | Content-aware panel heights replace fixed caps. Jira mobile panel measured 823px with equal scroll/client height; no clipping or horizontal overflow. |
| R10 | Fixed within documented locale contract | English schema validates required shapes, URLs and arrays; recursive per-key/array-position fallback handles missing/malformed translations and lost placeholders. New locales must retain English array order; real translated-language editorial QA remains unavailable because only English is supplied. |
| R11 | Fixed | Added regression tests for settings, storage failure, locale fallback, project visibility, first theme click, lazy targets and search generation. |
| R12 | Fixed | Vite injects generated metadata, JSON-LD and full readable static section HTML; llms is generated from the same settings/copy. It is not React SSR/hydration. |
| R13 | Fixed | Independent lazy-section loading states and error boundaries provide a reload action; 404 chunk also has recovery. |
| R14 | Fixed | Experience, Education and both project groups use one shared disclosure rendering boundary. |
| R15 | Fixed | Scroll behavior, reveals, marquee and transitions honor reduced motion; missing observer fallback shows content and stagger timers clean up. |
| R16 | Partially resolved; external decisions needed | Added frozen-install/lint/test/build CI and a release/rollback checklist. Actual account/DNS ownership, production rollback, caching/security headers and monitoring contacts are not available from repository evidence. |
| R17 | Scope reconciled; product decisions needed | README explicitly distinguishes static generation from SSR and notes remaining font configuration, neutral content.json separation and record links in locales. No contact form or additional languages added without product content/decision. |
| R18 | Partially resolved; owner needed | README, architecture rules and this audit now document remediation. Older guides/changelog preserve the baseline; assign documentation ownership and refresh those wider guides after release policies are chosen. |
| R19 | Fixed asset size; performance measurement open | Existing profile reduced from 1,115,145 bytes to 10,282 bytes, 448×448 WebP. Browser confirmed it renders. Production LCP before/after is not measured. |
| R20 | Fixed | Lint has zero errors/warnings. Empty-interface/require errors corrected, ref cleanup repaired, intentional shared helper exports documented. Brand icon components exported explicitly. |
| R21 | Fixed | Settings reject duplicate/unsupported section IDs; skip link targets real main; View Work is hidden if projects is disabled. Empty section configuration tested. |
| R22 | Fixed | Secondary contact button resolves configured brand icon and locale label; unsupported platforms fail validation. LinkedIn retains its existing action wording. |
| R23 | Fixed | Site/theme/English schemas fail early on missing nested fields, unsafe URLs, malformed HSL and invalid references. Generator validates education logo and skill-label references. |
| R24 | Fixed | Sitemap no longer falsely uses build day as lastmod. Content-compared output and input watcher regenerate after config/English changes. |

### Verification evidence

- Frozen installation succeeded both in the project and a fresh temporary directory.
- Regression suite passed (23 tests); lint passed without errors or warnings. Preview's latest automatic compilation reported `build OK`.
- Browser checks at 1280×1800 desktop and 390×844 mobile: seven project rows, independent accordion/link controls, early navigation, current-section highlighting, theme switching, mobile Escape/focus, reduced motion and 404.
- No runtime page errors, broken loaded images or nested interactive controls in the desktop run. Mobile had no horizontal overflow; longest expanded panel was not clipped.
- Raw served HTML contains Jira and seven-item structured data. Sitemap, robots, manifest and llms returned HTTP 200 locally.
- No publishing, production settings change, actual hosted rollback or production page-speed audit was performed.

### Remaining owner decisions

1. Confirm canonical job title, experience/statistics and authored dates (R7).
2. Identify release/DNS/security/monitoring contacts and approve production runbooks (R16/R18).
3. Decide whether remaining historical template promises, a contact form or translated content are required (R17).

## Historical baseline findings

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
