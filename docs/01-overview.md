# Project overview

Purpose: explain what this repository contains. Intended reader: any new contributor.

Last verified against commit `e7f95698811156a1fa4a1807fdd6cc2c6e5a5e76` on 2026-10-18.

## Purpose and audience

**[Verified]** The website is a reusable portfolio template currently introducing Rusiru Rathmina and linking to his work, resume, articles, and professional profiles. Visitors can read expandable entries, reveal additional projects, change theme, and follow contact links. Authors configure identity, section order, shared skill data, links, and media in [site.json](../src/config/site.json), with colors in [theme.json](../src/config/theme.json). See [Index](../src/pages/Index.tsx), [Projects](../src/components/sections/Projects.tsx), and [Contact](../src/components/sections/Contact.tsx).

**[Inferred]** Likely readers include recruiters, prospective collaborators, and engineers evaluating prior work, based on the resume, project, and contact calls to action. These are audiences, not authenticated roles. **[Verified]** No login or access-control implementation is present in [App](../src/App.tsx).

## Stack and boundaries

**[Verified]** The following are declared version ranges, not claims about latest releases. [package-lock.json](../package-lock.json) records resolutions for part of the dependency graph but is out of sync with the manifest; see the [install limitation](02-getting-started.md).

| Area | Technology | Evidence |
| --- | --- | --- |
| UI | React `^18.3.1`, TypeScript `^5.8.3` | [package.json](../package.json) |
| Build | Vite `^5.4.19`, React SWC plugin | [Vite config](../vite.config.ts) |
| Routing | React Router `^6.30.1` | [App](../src/App.tsx) |
| Styling | Tailwind CSS `^3.4.17`, CSS variables, shadcn/Radix primitives | [Tailwind](../tailwind.config.ts), [components config](../components.json) |
| Theme | next-themes `^0.3.0` | [theme wrapper](../src/components/ThemeProvider.tsx) |
| Metadata | react-helmet-async `^3.0.0`, static HTML/JSON-LD | [main](../src/main.tsx), [HTML](../index.html) |
| Content/language | Custom React context, eager JSON discovery | [i18n](../src/i18n/i18n.tsx) |
| Template configuration | JSON imports, config helpers, injected CSS variables | [config module](../src/config/index.ts) |
| Public-file generation | Vite `buildStart` plugin; writes sitemap, robots, manifest | [site-files.ts](../scripts/site-files.ts) |
| Tests | Vitest `^3.2.4`, jsdom, Testing Library | [test config](../vitest.config.ts) |
| Query infrastructure | TanStack Query provider, no active query consumers found | [App](../src/App.tsx) |

**[Verified]** Java, Drupal, Spring Boot, AWS, Jira APIs, and databases appear in portfolio descriptions and skill lists. This repository does not implement those showcased systems. Blog cards are static links, not an article feed or publishing backend ([locale content](../src/locales/en.json), [Blog](../src/components/sections/Blog.tsx)).

## Annotated repository map

**[Verified]** This map groups repetitive primitives and generated lock data; it is not a complete file listing.

```text
rusiru/
├── AGENTS.md                    Architecture rules for contributors
├── .lovable/plan/               Current template roadmap; partly implemented
├── scripts/site-files.ts        Dev/build generator for three public files
├── public/                     Files copied to the built site's root
│   ├── llms.txt                Public portfolio summary for automated readers
│   ├── robots.txt              Generated crawler rules and sitemap location
│   ├── sitemap.xml             Generated canonical URL and UTC build date
│   ├── site.webmanifest        Generated names, colors, and icon references
│   ├── media/                  Config-referenced profile, logos, and icons
│   └── favicon*, *icon*, *.png  Icons and site verification material
├── src/
│   ├── main.tsx                Apply theme; clear static root; mount providers
│   ├── App.tsx                 Providers and / plus catch-all routes
│   ├── pages/                  Index and NotFound
│   ├── components/
│   │   ├── sections/           Eight portfolio sections
│   │   ├── ui/                 Reusable shadcn/Radix-oriented primitives
│   │   ├── icons/              Config-keyed brand SVG map
│   │   └── *.tsx               Navigation, theme, language, footer, helpers
│   ├── i18n/i18n.tsx           Locale discovery, lookup, persistence
│   ├── locales/en.json         English content and content arrays
│   ├── hooks/                  Scroll reveal, mobile detection, toast state
│   ├── config/                 site.json, theme.json, helpers and exported types
│   ├── lib/utils.ts            cn: merge conditional Tailwind classes
│   ├── test/                  jsdom setup and placeholder test
│   ├── index.css               Imported theme and animation stylesheet
│   └── App.css                 Starter stylesheet; not imported by entry graph
├── docs/                       This onboarding/reference set
├── index.html                  Metadata, JSON-LD, static fallback portfolio
├── package.json                Scripts and dependency ranges
├── package-lock.json           npm dependency resolutions
├── bun.lock / bun.lockb         Additional Bun lock artifacts
├── vite.config.ts              Dev host/port, SWC, alias, development tagging
├── vitest.config.ts            jsdom tests and alias
├── tsconfig*.json              Root references, browser and tooling TS options
└── tailwind.config.ts          Design tokens, typography, animations
```

## History that affects onboarding

**[Verified]** `2bec1dc` ("Expanded i18n to all sections") moved section content into locale JSON and added `RichText`; `a672181` changed fonts, headers, icons, and the marquee; `396df29` and `1af50bb` added or revised static SEO content. The template work merged through `57ada4b` and `e7f9569` introduces config, shared skills, public media, and the generator. The README now includes a template guide. See [current architecture rules](../AGENTS.md) and [documentation audit](CHANGELOG.md). **[Unknown]** Many commit subjects say only "Changes", limiting recoverable rationale.

Next: [Getting started](02-getting-started.md).
