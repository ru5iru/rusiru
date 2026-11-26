# Development

## Setup and commands

Use Node 22 and Bun 1.3.3, matching [CI](../.github/workflows/quality.yml). Bun and the text `bun.lock` are authoritative; do not add other package-manager lockfiles.

```sh
bun install --frozen-lockfile
bun run dev
```

The development URL is `http://localhost:8080`, unless Vite prints another port. The static application needs no environment variables, database, authentication service, or API keys.

| Command | Purpose |
| --- | --- |
| `bun run dev` | Start Vite with automatic updates |
| `bun run lint` | Check code conventions |
| `bun run test` | Run behavioral tests once |
| `bun run test:watch` | Re-run tests during development |
| `bun run optimize:images` | Generate optimized education logos and the social card |
| `bun run build` | Optimize images and produce the production site in `dist/` |
| `bun run preview` | Serve an existing production build locally |
| `bun run build:dev` | Produce a development-mode bundle; not for production deployment |

Vite compilation is not a complete TypeScript check. In Lovable's managed workspace, compilation and type checks run automatically; inspect their results rather than manually running them. Local contributors can use the commands above. CI runs a frozen install, lint, tests, and a production build.

## Code map

| Location | Responsibility |
| --- | --- |
| `src/main.tsx`, `src/App.tsx` | Apply theme, replace static fallback, mount providers and routes |
| `src/pages/Index.tsx` | Page shell and configured lazy sections with loading/error boundaries |
| `src/pages/NotFound.tsx`, `src/components/Seo.tsx` | Error view and shared runtime metadata |
| `src/components/Navbar.tsx` | Masthead, section index, lazy-target observation, and accessible mobile menu |
| `src/components/sections/` | Editorial banner, About front-page puzzle, and lower sections |
| `src/components/DisclosureRow.tsx`, `ViewMoreButton.tsx` | Accessible work-log disclosures and archive controls |
| `src/lib/navigation.ts` | Lazy-safe navigation, targeted unfolding, and global work-log events |
| `src/config/` | Validated site settings, theme tokens, and supported icon helpers |
| `src/i18n/build.ts`, `locale.ts`, `schema.ts` | Assemble locales, merge English fallback, validate, and filter publication |
| `src/i18n/i18n.tsx`, `locales.ts`, `publish.ts` | Language context/discovery, visible sections, archives, and expansion defaults |
| `src/components/icons/BrandIcons.tsx` | Social icon registry keyed by platform |
| `src/index.css`, `tailwind.config.ts` | Semantic tokens, Broadsheet typography, print rules, and motion |
| `scripts/site-files.ts`, `search-content.ts` | Public search/404/manifest generation and HTML metadata/static content |
| `scripts/optimize-images.ts`, `media-src/` | Repeatable image generation and original logos |
| `src/test/` | Behavioral, configuration, publication, navigation, and search regression tests |

## Content-to-page flow

1. Site and theme schemas validate settings before use.
2. Locale files are assembled by folder and section name. Translations merge with raw English by record ID or point position.
3. Locale validation removes unpublished records, points, and labels. Section visibility also considers whether its records/groups remain published.
4. Components consume the selected published locale; generators consume published English and the same shared settings.
5. HTML initially includes readable static content. Startup replaces it with the React application; this is not server rendering or hydration.

Language and theme preferences persist in browser storage. Disclosure, filter, and archive state are temporary UI state. There is no server API, account system, contact submission, article feed, or analytics integration. Contact actions open email or external profiles.

## Changing the template

Read [AGENTS.md](../AGENTS.md) before implementation. Visual work follows [DESIGN.md](../DESIGN.md), [SKILL.md](../SKILL.md), and the [canonical prototype](prototype/broadsheet-prototype.html).

- Put shared settings in site config and wording/publication flags in locale files. Extend validation with new fields before consuming them.
- Keep stable record IDs. Preserve English fallback, per-language flags, optional archives, affiliations, and front-page jumps.
- Use semantic CSS tokens and existing design-system controls. Keep outbound links outside disclosure triggers.
- When adding a section type, update supported section IDs, locale schema and English file, lazy section map, navigation wording, and search generation together.
- Keep generated-output markers in `index.html`. Change generator inputs or generators, never generated outputs by hand.
- Add behavioral tests for changed rules and regressions. Exercise affected interactions on desktop/mobile and with keyboard input, both themes, and reduced motion where relevant.
- Preserve original logos, custom favicons, prototype assets, and platform-managed files. Disabled template features are not dead code.
- Update the relevant guide and Unreleased changelog for notable changes. Add or revise architecture rules in AGENTS only when the structure changes.

Follow [CONTRIBUTING.md](../CONTRIBUTING.md) for pull requests. Keep screenshots, reports, temporary scanners, build output, and test results outside tracked source. Documentation describes current use, not a history of verification runs.
