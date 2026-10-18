# Project overview

Purpose: explain what this repository contains. Intended reader: any new contributor.

Last verified against commit `0d6ea67e368badc5e2d52b7c601ea167c6be6208` on 2026-10-17.

## Purpose and audience

**[Verified]** The website introduces Rusiru Rathmina and links to his work, resume, articles, and professional profiles. Visitors can read expandable employment, education, and project entries, reveal additional projects, change color theme, and follow email or social links. See [Index](../src/pages/Index.tsx), [sections](../src/components/sections/Projects.tsx), and [Contact](../src/components/sections/Contact.tsx).

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
| Tests | Vitest `^3.2.4`, jsdom, Testing Library | [test config](../vitest.config.ts) |
| Query infrastructure | TanStack Query provider, no active query consumers found | [App](../src/App.tsx) |

**[Verified]** Java, Drupal, Spring Boot, AWS, Jira APIs, and databases appear in portfolio descriptions and skill lists. This repository does not implement those showcased systems. Blog cards are static links, not an article feed or publishing backend ([locale content](../src/locales/en.json), [Blog](../src/components/sections/Blog.tsx)).

## Annotated repository map

**[Verified]** This map groups repetitive primitives and generated lock data; it is not a complete file listing.

```text
rusiru/
├── .lovable/plan.md             Original design intent; not current behavior
├── public/                     Files copied to the built site's root
│   ├── llms.txt                Public portfolio summary for automated readers
│   ├── robots.txt              Crawler rules and sitemap location
│   ├── sitemap.xml             One canonical page URL
│   ├── site.webmanifest        Icon manifest; empty name fields
│   └── favicon*, *icon*, *.png  Icons and site verification material
├── src/
│   ├── main.tsx                Clear static root; mount React/providers
│   ├── App.tsx                 Providers and / plus catch-all routes
│   ├── pages/                  Index and NotFound
│   ├── components/
│   │   ├── sections/           Eight portfolio sections
│   │   ├── ui/                 Reusable shadcn/Radix-oriented primitives
│   │   └── *.tsx               Navigation, theme, language, footer, helpers
│   ├── i18n/i18n.tsx           Locale discovery, lookup, persistence
│   ├── locales/en.json         English content and content arrays
│   ├── hooks/                  Scroll reveal, mobile detection, toast state
│   ├── assets/                 Profile images, institution logos, local icons
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

**[Verified]** `2bec1dc` ("Expanded i18n to all sections") moved section content into locale JSON and added `RichText`; `a672181` changed fonts, headers, icons, and the marquee; `396df29` and `1af50bb` added or revised static SEO content. These commits were inspected with `git log` and `git show --stat`. The root README was last changed on 2025-01-01 and does not describe these changes. **[Unknown]** Most commit subjects say only "Changes", so the rationale is not recoverable from the subjects alone.

Next: [Getting started](02-getting-started.md).
