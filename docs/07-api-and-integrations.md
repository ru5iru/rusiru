# API and integrations

Purpose: describe routes, internal interfaces, and external handoffs. Intended reader: developers and operators.

Last verified against commit `0d6ea67e368badc5e2d52b7c601ea167c6be6208` on 2026-10-17.

## Application routes and public resources

**[Verified]** This repository exposes no application REST/GraphQL endpoints, webhook handlers, authentication API, event bus, or backend CLI. The routes below are browser views or static assets, not server controllers. Sources: [App:24](../src/App.tsx#L24), [public resources](../public/robots.txt), [scripts](../package.json).

| Path / action | Implementation | Contract |
| --- | --- | --- |
| `/` | Index page | Public portfolio |
| `/#about`, `/#experience`, `/#education`, `/#projects`, `/#skills`, `/#blog`, `/#contact` | DOM IDs on one page | Anchor targets, not separate pages; navbar intercepts clicks for smooth scrolling |
| Any unmatched pathname | NotFound | noindex metadata, logs path, home link; does not set an HTTP status |
| `/robots.txt` | Static file | Allows listed/general crawlers; points to canonical sitemap |
| `/sitemap.xml` | Static file | One URL, manually authored last-modified date |
| `/llms.txt` | Static file | Authored portfolio summary and links |
| `/site.webmanifest` and icons | Static files | Manifest with icon references; not evidence of offline support |

**[Verified]** A host must decide HTTP status/fallback behavior. No proxy rules or server API rewrites are configured in [Vite](../vite.config.ts). A browser NotFound view is not proof that a deployed request returns HTTP 404.

## Internal developer API

**[Verified]** [useTranslation](../src/i18n/i18n.tsx) returns `lang`, `setLang`, `t`, `tr`, and `languages`:

```tsx
const { t, tr, lang, setLang, languages } = useTranslation();
const heading = t('projects.title');
const visitLabel = t('projects.visit', { title: 'Example' });
const items = tr<ProjectItem[]>('projects.items') ?? [];
```

This is an illustrative usage excerpt; `ProjectItem` must be in scope. `t()` resolves dot-separated paths, returns the key if the value is not a string, and replaces all `{variable}` occurrences provided by the caller. `tr<T>()` returns a cast raw value with no runtime validation. `setLang` accepts only discovered codes. `useTranslation` throws when used outside `I18nProvider`. See `i18n.tsx:37`, `:58`, `:70`, and `:93`.

**[Verified]** `useScrollAnimation(threshold=0.1)` returns `{ref,isVisible}` and reveals once; attach its ref to a div. `RichText({text})` renders only the two custom emphasis markers. These are local component APIs, not network contracts ([hooks](../src/hooks/useScrollAnimation.ts), [RichText](../src/components/RichText.tsx)).

## External dependencies and failure behavior

**[Verified]** URLs below are configured in source. Their live reachability, service ownership, account settings, and actual delivery behavior are **[Unknown]**; no production integration test was performed.

| Service / destination | What flows | Credentials in this app | Failure behavior in code | Evidence |
| --- | --- | --- | --- | --- |
| Google Fonts | Stylesheet/font requests for Archivo | None | System font fallbacks configured; no app error message | [HTML](../index.html), [Tailwind](../tailwind.config.ts) |
| jsDelivr / devicons | External SVG image requests | None | No custom image `onError`; labels remain in Skills | [Hero](../src/components/sections/Hero.tsx), [Skills](../src/components/sections/Skills.tsx) |
| Google Drive resume | Browser opens authored file viewer URL | No app API credential | Provider/browser owns availability; no download guarantee or feedback | [locale](../src/locales/en.json), [Hero](../src/components/sections/Hero.tsx) |
| External blog | Browser navigation to articles or blog home | None | No fetch, cache, retry, or in-app article fallback | [Blog](../src/components/sections/Blog.tsx) |
| Project demos and GitHub | Browser navigation from optional link fields | None | Missing optional URLs omit icons; broken destination not detected | [Projects](../src/components/sections/Projects.tsx) |
| Email handler | `mailto:` with authored email address | None | No app submission, delivery acknowledgment, or recovery UI | [Contact](../src/components/sections/Contact.tsx) |
| LinkedIn/social profiles | Browser navigation; footer has eight links | None | No profile API calls or availability handling | [Contact](../src/components/sections/Contact.tsx), [Footer](../src/components/Footer.tsx) |
| Google-hosted social image | Metadata references external image | None | Preview consumers depend on external asset availability | [HTML](../index.html) |
| Lovable tagging | Development build-time plugin | No app credential configured | Included only in development mode; deployment account unknown | [Vite](../vite.config.ts) |

**[Verified]** "Jira REST API", Kafka, Amazon SES, Keycloak, and similar names inside project descriptions are claims about showcased work. They do not create integrations for this portfolio ([en.json](../src/locales/en.json)). The Google-hosted social-image URL is metadata, not an application data API.

## Events, trust, and authentication

**[Verified]** User actions trigger local React state updates, DOM scrolling, or browser navigation. There are no published domain events or authenticated requests. External new-tab links in the inspected sections generally use `rel="noopener noreferrer"`; Footer also uses `me`. Content authors control URLs. A new content-editing/import path would need a deliberate URL validation policy rather than relying on the existing trusted-source assumption.

Next: [Operations](08-operations.md).
