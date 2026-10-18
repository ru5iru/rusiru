# Glossary

Purpose: define the repository's terms without confusing showcased projects with this website. Intended reader: all contributors.

Last verified against commit `e7f95698811156a1fa4a1807fdd6cc2c6e5a5e76` on 2026-10-18.

**[Verified]** Definitions describe usage in the linked source. Product audiences and architectural rationale remain inferences where marked elsewhere.

| Term | Meaning here | Evidence |
| --- | --- | --- |
| SPA | Single-page application: React selects the page in the browser | [App](../src/App.tsx) |
| Portfolio project | A record describing prior work, not an independently runnable package in this repo | [locale](../src/locales/en.json) |
| Featured | Boolean selecting the initially visible project group | [Projects](../src/components/sections/Projects.tsx) |
| Additional projects | `featured: false` group revealed by View More | [Projects](../src/components/sections/Projects.tsx) |
| Accordion | A list whose local `openIndex` determines one open row, or none | [Experience](../src/components/sections/Experience.tsx) |
| Locale | JSON dictionary discovered from its language-code filename | [i18n](../src/i18n/i18n.tsx) |
| `t` / `tr` | String lookup with interpolation / unchecked raw value lookup | [i18n](../src/i18n/i18n.tsx) |
| RichText | Small renderer for `**emphasis**` and `==gradient==`, not a Markdown parser | [RichText](../src/components/RichText.tsx) |
| GEO summary | Author's hidden `data-geo-summary` text intended for generative-engine readers; effectiveness not established | [Hero](../src/components/sections/Hero.tsx) |
| SEO | Search-engine-facing metadata and content maintained in HTML and React | [HTML](../index.html), [Index](../src/pages/Index.tsx) |
| JSON-LD | Structured-data script blocks in the HTML head | [HTML](../index.html) |
| Canonical origin | `siteConfig.siteUrl` supplies runtime/generator URLs; authored HTML/llms copies remain | [site config](../src/config/site.json), [generator](../scripts/site-files.ts) |
| Static fallback / pre-rendered content | Hand-maintained portfolio HTML in `#root`, cleared by React startup; not evidence of server rendering or hydration | [main](../src/main.tsx), [HTML](../index.html) |
| Suspense | React boundary showing a fallback while lazy components load; current fallbacks are null | [Index](../src/pages/Index.tsx) |
| IntersectionObserver | Browser API used for one-time reveals and active-section detection | [scroll hook](../src/hooks/useScrollAnimation.ts), [Navbar](../src/components/Navbar.tsx) |
| HMR | Hot module replacement in development; error overlay disabled here | [Vite](../vite.config.ts) |
| SWC | React source transform provided by Vite's React SWC plugin | [Vite](../vite.config.ts) |
| shadcn / Radix | Local UI wrappers and underlying accessible interaction primitives; usage still requires correct composition | [components config](../components.json), [button](../src/components/ui/button.tsx) |
| `cn` | Helper combining conditional class lists and resolving Tailwind class conflicts | [utils](../src/lib/utils.ts) |
| Helmet | React metadata management, wrapped by HelmetProvider | [main](../src/main.tsx) |
| Lovable tagger | Development-only component annotation plugin | [Vite](../vite.config.ts) |
| Site config | Language-neutral identity, links, media, sections, skills and social data | [site.json](../src/config/site.json) |
| Theme config | Light/dark CSS variable overrides injected before React mounts | [theme.json](../src/config/theme.json), [applyTheme](../src/config/index.ts) |
| `devicon:` | Icon reference prefix resolved to a jsDelivr URL; other strings pass through | [resolveIcon](../src/config/index.ts) |
| Brand icon map | Social platform ID → SVG component/hover class, with Footer image/text fallbacks | [BrandIcons](../src/components/icons/BrandIcons.tsx), [Footer](../src/components/Footer.tsx) |
| Site-files plugin | Vite `buildStart` hook generating sitemap, robots and manifest from site config | [site-files.ts](../scripts/site-files.ts) |
| `sections` | Ordered list of lower-section keys; Navbar maps all keys, Index skips unknown keys | [Index](../src/pages/Index.tsx), [Navbar](../src/components/Navbar.tsx) |
| `content.json` | Proposed roadmap file, not present in this checkout; record arrays still live in locales | [template plan](../.lovable/plan/make-the-portfolio-a-fully-configurable-template-2026-10-02.md) |
| UCSC / MCG | Education logo lookup IDs for University of Colombo School of Computing / Mahinda College | [Education](../src/components/sections/Education.tsx), [locale](../src/locales/en.json) |
| OWASP, SonarQube, L3 | Terms in portfolio employment/project descriptions, not proof this repo has a security scanner or support service | [locale](../src/locales/en.json) |
| ADR | Architecture decision record; none found in the tracked documentation | [audit](CHANGELOG.md) |

Next: [Documentation audit and changelog](CHANGELOG.md).
