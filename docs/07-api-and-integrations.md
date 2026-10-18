# API and integrations

Purpose: describe routes, internal interfaces, and external handoffs. Intended reader: developers and operators.

Last verified against commit `e7f95698811156a1fa4a1807fdd6cc2c6e5a5e76` on 2026-10-18.

## Application routes and public resources

**[Verified]** This repository exposes no application REST/GraphQL endpoints, webhook handlers, authentication API, event bus, or backend CLI. The routes below are browser views or static assets, not server controllers. Sources: [App:24](../src/App.tsx#L24), [public resources](../public/robots.txt), [scripts](../package.json).

| Path / action | Implementation | Contract |
| --- | --- | --- |
| `/` | Index page | Public portfolio |
| `/#about`, `/#experience`, `/#education`, `/#projects`, `/#skills`, `/#blog`, `/#contact` | DOM IDs of enabled sections | Current configured targets, not separate pages; Navbar derives list/order from site config |
| Any unmatched pathname | NotFound | noindex metadata, logs path, home link; does not set an HTTP status |
| `/robots.txt` | Generated static file | Allows listed/general crawlers; points to config-origin sitemap |
| `/sitemap.xml` | Generated static file | One config-origin URL; current UTC day as last-modified date |
| `/llms.txt` | Static file | Authored portfolio summary and links |
| `/site.webmanifest` and icons | Generated manifest, authored icon files | Config-backed names/colors; fixed root icon paths; not evidence of offline support |
| `/media/...` | Public files referenced by config | Profile, education logos and local technology icons; no import-based fingerprinting |

**[Verified]** A host must decide HTTP status/fallback behavior. No proxy rules or server API rewrites are configured in [Vite](../vite.config.ts). A browser NotFound view is not proof that a deployed request returns HTTP 404.

## Internal developer API

**[Verified]** [config/index.ts](../src/config/index.ts) exports `siteConfig`, `themeConfig`, `SkillItem`, `SkillCategory`, `SocialLink`, `resolveIcon(ref)`, `allSkills()`, and `applyTheme()`. `resolveIcon('devicon:...')` prepends the jsDelivr Devicon path; other strings pass through unchanged. `allSkills()` flattens category `items` in order. `applyTheme()` appends a `style#theme-config` element for light/dark variables, filtering `$`-prefixed keys; it is not an idempotent replace operation. Config typing uses assertions and required checks log only. This is a local source API, not a server endpoint.

**[Verified]** [siteFilesPlugin()](../scripts/site-files.ts) is a Vite plugin registered in [vite.config.ts](../vite.config.ts). Its `buildStart` reads `src/config/site.json` and writes three public files only when content differs. It adds no CLI script, preview regeneration, network service, custom watch hook, or HTML/llms generator.

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
| Google Drive resume | Browser opens configured file viewer URL | No app API credential | Provider/browser owns availability; no download guarantee or feedback | [site config](../src/config/site.json), [Hero](../src/components/sections/Hero.tsx) |
| External blog | Browser navigation to articles or blog home | None | No fetch, cache, retry, or in-app article fallback | [Blog](../src/components/sections/Blog.tsx) |
| Project demos and GitHub | Browser navigation from optional link fields | None | Missing optional URLs omit icons; broken destination not detected | [Projects](../src/components/sections/Projects.tsx) |
| Email handler | `mailto:` with configured person email | None | No app submission, delivery acknowledgment, or recovery UI | [Contact](../src/components/sections/Contact.tsx), [site config](../src/config/site.json) |
| LinkedIn/social profiles | Browser navigation; footer has eight links | None | No profile API calls or availability handling | [Contact](../src/components/sections/Contact.tsx), [Footer](../src/components/Footer.tsx) |
| Google-hosted social image | Metadata references external image | None | Preview consumers depend on external asset availability | [HTML](../index.html) |
| Lovable tagging | Development build-time plugin | No app credential configured | Included only in development mode; deployment account unknown | [Vite](../vite.config.ts) |

**[Verified]** "Jira REST API", Kafka, Amazon SES, Keycloak, and similar names inside project descriptions are claims about showcased work. They do not create integrations for this portfolio ([en.json](../src/locales/en.json)). The Google-hosted social-image URL is metadata, not an application data API.

## Events, trust, and authentication

**[Verified]** User actions trigger local state updates, scrolling, or navigation. There are no published domain events or authenticated requests. New-tab links generally use `noopener noreferrer`; Footer also uses `me`. Config/locale authors control URLs and icon paths without a general scheme validator. Footer's custom image/icon/text fallback handles unknown social platforms, but Contact's configurable secondary URL still renders a LinkedIn icon/label regardless of its `platform` field. Any future untrusted editing/import path needs a deliberate validation policy ([Footer](../src/components/Footer.tsx), [Contact](../src/components/sections/Contact.tsx)).

Next: [Operations](08-operations.md).
