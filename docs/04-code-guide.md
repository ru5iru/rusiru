# Code guide

Purpose: identify where to make changes and how to verify them. Intended reader: frontend contributors.

Last verified against commit `e7f95698811156a1fa4a1807fdd6cc2c6e5a5e76` on 2026-10-18.

## Module map

**[Verified]** Paths and interfaces below were inspected. Section exports are named exports; Index adapts them to lazy default imports.

| Module | Responsibility and interface | Dependencies / gotchas |
| --- | --- | --- |
| [main.tsx](../src/main.tsx) | Entry; applies theme overrides, then creates root inside HelmetProvider and I18nProvider | Clears fallback HTML before mounting |
| [App.tsx](../src/App.tsx) | Query/theme/tooltip/toast providers; routes | Query infrastructure is not evidence of network fetching |
| [Index](../src/pages/Index.tsx) | Config-backed metadata, skip link, section composition | Hero/shell eager; known configured sections lazy under one null fallback |
| [NotFound](../src/pages/NotFound.tsx) | Unmatched routes, noindex, home link | Origin/name from config, 404 copy from locale; console error on path change |
| [i18n](../src/i18n/i18n.tsx) | `I18nProvider`, `useTranslation`, `LanguageOption` | Eager locale discovery; unchecked generic `tr<T>()` |
| [Navbar](../src/components/Navbar.tsx) | Config-derived anchor targets, menu and active-section state | Observer setup runs once; sections may not yet be mounted |
| [Hero](../src/components/sections/Hero.tsx) | Headline/photo, resume, View Work, technology marquee | Headline split assumes a last word; shared skill list from config |
| [About](../src/components/sections/About.tsx) | Paragraphs and stat cards | `RichText` formatting; three icons cycle across stats |
| [Experience](../src/components/sections/Experience.tsx) | Employment accordion | First entry initially open; max-height limits long copy |
| [Education](../src/components/sections/Education.tsx) | Education accordion and logos | `id` must match `siteConfig.educationLogos` |
| [Projects](../src/components/sections/Projects.tsx) | Featured/additional groups, accordion, outbound links | Two similar render branches; initial first featured item open |
| [Skills](../src/components/sections/Skills.tsx) | Configured categories and icon chips | Names/icons in site JSON; category labels in locale JSON |
| [Blog](../src/components/sections/Blog.tsx) | Locale-backed preview cards | Dates/read times are authored; no feed fetching |
| [Contact](../src/components/sections/Contact.tsx) | Email/LinkedIn actions | No form, delivery status, or backend |
| [Footer](../src/components/Footer.tsx) | Social links, brand, current-year copyright | Social URLs from config; icons resolve by platform; labels localized with platform fallback |
| [LanguageSelector](../src/components/LanguageSelector.tsx) | Label for one locale; dropdown for multiple | Derives menu options from files and locale metadata |
| [ThemeToggle](../src/components/ThemeToggle.tsx), [ThemeProvider](../src/components/ThemeProvider.tsx) | next-themes adapter and explicit dark/light action | Default from config; toggle compares `theme`, not resolved system appearance |
| [BackToTop](../src/components/BackToTop.tsx) | Show control after 400px scroll | Hidden with CSS rather than unmounted |
| [RichText](../src/components/RichText.tsx) | `{text: string}` → React fragments/spans | Only `**emphasis**` and `==gradient==`; not Markdown or HTML |
| [scroll hooks](../src/hooks/useScrollAnimation.ts) | `useScrollAnimation(threshold?)` and multiple/staggered variant | Observer reveals once; multi variant schedules timeouts |
| [mobile hook](../src/hooks/use-mobile.tsx) | `useIsMobile()` | 768px breakpoint; used by reusable UI, not navbar CSS logic |
| [toast hook](../src/hooks/use-toast.ts), [UI toast bridge](../src/components/ui/use-toast.ts) | In-memory toast API and re-export | Separate from Sonner; one visible toast in hook store |
| [UI directory](../src/components/ui/button.tsx) | Reusable button/dialog/form/menu/chart/etc. primitives | Not every primitive is used by the portfolio |
| [NavLink](../src/components/NavLink.tsx) | Router link adapter with active/pending class props | Navbar uses ordinary anchors instead |
| [utils](../src/lib/utils.ts) | `cn(...ClassValue[])` | `clsx` plus Tailwind conflict merging |
| [config](../src/config/index.ts) | `siteConfig`, `themeConfig`, `resolveIcon`, `allSkills`, `applyTheme`; skill/social types | JSON casts and four logging checks; no runtime schema enforcement |
| [site JSON](../src/config/site.json) | Identity/URLs, sections, skills, logos, social configuration | Data-only; not all personal facts in locale/HTML are replaced automatically |
| [theme JSON](../src/config/theme.json) | Light/dark CSS variable overrides | Existing semantic tokens; not a general font/layout configuration system |
| [BrandIcons](../src/components/icons/BrandIcons.tsx) | Platform → SVG component and hover class | Footer custom icon wins; unknown platform falls back to text |
| [site-files plugin](../scripts/site-files.ts) | `siteFilesPlugin(): Plugin`, `buildStart` hook | Reads config from repo CWD; owns three generated public files |

## Conventions and configuration

**[Verified]** Components use PascalCase files, hooks use `use...`, and source imports commonly use `@/` mapped in Vite, Vitest, and TypeScript. Styling uses utility classes plus tokens in [index.css](../src/index.css) and [Tailwind](../tailwind.config.ts). Quote style varies. No dependency-injection container exists; React context supplies cross-cutting state, and config is imported directly.

**[Verified]** Error handling is limited: `useTranslation` throws outside its provider, NotFound logs unmatched paths, and list readers often default missing values to `[]`. Config required-field checks also log to the console without throwing. There is no central logger, error boundary, locale/config schema enforcement, or catch for storage failures. The TypeScript browser configuration is permissive, while ESLint still reports certain type/style errors ([configs](../tsconfig.app.json), [ESLint](../eslint.config.js)). Do not infer runtime validation from a `tr<ProjectItem[]>()` cast.

## Worked change: add a project

**[Verified]** Project records remain in locales; the proposed `content.json` from the template plan does not exist. Identity/media/skills go in site config instead ([site.json](../src/config/site.json), [locale](../src/locales/en.json)).

Recommended procedure based on [Projects](../src/components/sections/Projects.tsx):

1. Add a record to `projects.items` in [en.json](../src/locales/en.json), using the shape below. `featured` determines its group, not an external service flag.
2. Keep `title` unique within the list because React uses it as a key. Descriptions are arrays of plain strings; tech names are badge labels.
3. Use `link` and/or `github` only when a real destination exists. Both are optional; a record without either still renders. `isExternal` exists in the interface/content but does not control rendering: every rendered project link opens a new tab.
4. Update equivalent content in every shipped locale. Update `projects.geoSummary`, the project ItemList and fallback HTML in [index.html](../index.html), and [llms.txt](../public/llms.txt) so crawler summaries agree.
5. Run build, lint, and tests; inspect long descriptions at mobile and desktop widths. Fixed `max-h` values can clip text. Follow the additional-group and accordion smoke checks in [setup](02-getting-started.md).

```json
{
  "title": "Example project",
  "description": ["What the project does and your contribution."],
  "tech": ["React", "TypeScript"],
  "featured": false
}
```

This is a proposed content record, not a checked-in feature.

## Add a language or section

For template customization, first read [AGENTS.md](../AGENTS.md). Recommended config-driven changes, grounded in [config helpers](../src/config/index.ts):

- Replace identity/contact/resume/blog-home fields in `site.json`; revise biographical prose and record arrays in each locale too.
- Put media under `public/media/` and change config paths; no source image import is needed. An education record's `id` must have a matching `educationLogos` key.
- Edit `skills[].items` once for both Hero and Skills. `devicon:<path>` resolves to jsDelivr; other values pass through. `invertInDark` is applied by Skills, not Hero.
- Edit `social[]` with unique platform IDs, URLs, and optional custom image paths. Footer uses custom image → built-in brand icon → text label. Add `footer.social.<platform>` for a translated label; otherwise Footer uses the platform ID.
- Reorder/remove supported keys in `sections`; this controls lower sections and Navbar together. Hero/Footer stay visible. Do not use unknown or duplicate keys. Removing `projects` leaves Hero's fixed View Work target absent; an empty list leaves the skip link pointing at a missing `#main` target.
- Change light/dark CSS variable values in `theme.json`. `applyTheme()` injects `:root`/`.dark` overrides before React mounts; `$`-prefixed metadata keys are excluded. Values are not validated. `theme.default` lives in site config, not theme JSON.

**[Verified]** Dev/build regenerates sitemap, robots, and manifest. Do not edit those outputs manually. For a new site origin, also review authored `index.html` and `public/llms.txt`, plus locale summaries and per-project/article links. The template plan's broader generation, full localization, and schema-validation goals remain incomplete ([generator](../scripts/site-files.ts), [template plan](../.lovable/plan/make-the-portfolio-a-fully-configurable-template-2026-10-02.md)).

**[Verified]** A new `src/locales/<language-code>.json` is auto-discovered at build/dev time. Copy the full English structure, preserve interpolation placeholders (`{title}`, `{year}`, `{label}`), provide `language.name` and `language.code`, and translate arrays as well as strings. There is no per-key fallback or runtime schema enforcement ([i18n:6](../src/i18n/i18n.tsx#L6), [i18n:70](../src/i18n/i18n.tsx#L70)).

**[Verified]** Runtime SEO text and skill names are language-neutral config; theme/back-to-top labels and static HTML are not all driven by `t()`. The 404 copy now is localized. A new locale alone therefore does not translate every surface. **[Recommendation]** Check both visible and assistive text and define localized SEO before calling a language complete.

**[Recommendation]** For a new section, follow Blog's named export, content lookup, and reveal hook. Add its lazy import and `sectionMap` entry in Index, a matching section DOM ID, navigation key in locales, and static HTML/metadata if applicable. Add the key to `site.json.sections`; Navbar derives its links from that list automatically. Its mount-only observation of lazy targets needs consideration; see [risk R4](09-risks-and-recommendations.md).

## Tests and maintainability

**[Verified]** [Vitest config](../vitest.config.ts) runs `src/**/*.{test,spec}.{ts,tsx}` with jsdom and [setup](../src/test/setup.ts), which installs jest-dom assertions and a `matchMedia` mock. Only [example.test.ts](../src/test/example.test.ts) exists; it does not render components or exercise user behavior. No coverage threshold or browser test suite is configured.

**[Recommendation]** Add behavior tests beside the feature, such as `src/components/sections/Projects.test.tsx`, wrapping consumers in `I18nProvider`. Stub `IntersectionObserver` and `scrollIntoView` when a render needs them; the current setup does not provide either. Test user-visible changes: additional projects reveal, current row closes, absent links do not render, and language persists or rejects invalid codes. Run `npm test` or `npm run test:watch`; do not mistake a passing placeholder test for feature coverage.

**[Verified]** Main maintenance hotspots are duplicated project render branches, three similar accordions, unchecked config/locale shapes, and parallel manual SEO copy. Hero/Skills technology data is now shared through config. Starter CSS is unreferenced by the current entry graph. A source scan found no `TODO`, `FIXME`, or `HACK` markers; absence of markers does not imply absence of debt. Dependency age/vulnerability status has not been audited; declared versions alone do not establish that a package is unsafe or outdated. See [risks](09-risks-and-recommendations.md).

Next: [Product guide](05-product-guide.md).
