# Architecture and traced flows

Purpose: explain runtime boundaries and data movement. Intended reader: developers and architecture reviewers.

Last verified against commit `e7f95698811156a1fa4a1807fdd6cc2c6e5a5e76` on 2026-10-18.

## System context

**[Verified]** A browser runs a static portfolio application. Fonts/icons are fetched as resources, while resume, blog, project, and social URLs are ordinary navigation links. No application API client or server is implemented. Evidence: [Hero](../src/components/sections/Hero.tsx), [Blog](../src/components/sections/Blog.tsx), [Contact](../src/components/sections/Contact.tsx), [Footer](../src/components/Footer.tsx).

```mermaid
flowchart LR
    Visitor[Visitor] -->|HTTPS page request| Host[Static site host]
    Host -->|HTML CSS JavaScript images| App[Browser portfolio]
    App -->|font and icon requests| Resources[Google Fonts and jsDelivr]
    App -->|resume blog project social navigation| External[External sites]
    App -->|mailto link| Mail[Visitor mail application]
    App <-->|language and theme preferences| Storage[Browser local storage]
```

Caption: the portfolio serves content and hands off outbound actions. How to read: resource-fetch edges differ from links that leave the application; the host's actual configuration is **[Unknown]**.

## Containers and component boundaries

**[Verified]** Vite bundles the browser app; it is not a production backend. [main.tsx:8](../src/main.tsx#L8) calls `applyTheme()`, then clears `#root` at line 12 and calls `createRoot`. Static HTML is replaced rather than hydrated, despite the source comment. Config imports supply identity/URLs, theme defaults, section order, media paths, and skill data. [Config](../src/config/index.ts), [HTML](../index.html), [App](../src/App.tsx).

```mermaid
flowchart TD
    Html[index.html static fallback] -->|module script| Main[main.tsx]
    Main -->|mount inside Helmet and I18n| App[App providers]
    App -->|route matching| Router[BrowserRouter]
    Router -->|root path| Index[Index page]
    Router -->|other paths lazy import| Missing[NotFound page]
    Index -->|eager imports| Shell[Navbar Hero Footer BackToTop]
    Index -->|configured order under Suspense| Sections[Lower section components]
    Config[site.json and config helpers] -->|identity links skills section order| Index
    Config -->|profile skills social links| Shell
    Config -->|skills contact education data| Sections
    Theme[theme.json overrides] -->|applyTheme injects CSS variables| Main
    Locale[Locale JSON files] -->|eager glob import| I18n[I18n context]
    I18n -->|t and tr| Shell
    I18n -->|t and tr| Sections
    Hooks[Scroll animation hooks] -->|visibility state| Sections
    UI[UI primitives and CSS tokens] -->|presentation| Shell
    UI -->|presentation| Sections
```

Caption: provider, routing, content, and presentation responsibilities are separate files. How to read: arrows label runtime composition/data dependencies; `App` also wraps theme, query, tooltip, and two lazy toast providers.

**[Verified]** Section components depend on i18n, UI primitives, scroll hooks, and (where needed) config. Config imports JSON without importing components; Footer resolves platform IDs through [BrandIcons](../src/components/icons/BrandIcons.tsx). Hero and Skills share `siteConfig.skills` via `allSkills()`/`resolveIcon()`. i18n remains independent of section components. No circular import was found in the inspected runtime path; this was not a formal whole-repository cycle analysis. [Config](../src/config/index.ts), [i18n](../src/i18n/i18n.tsx), [utils](../src/lib/utils.ts).

## Flow 1: initial visit to rendered content

**[Verified]** The HTML contains metadata, JSON-LD, and portfolio markup. Startup injects theme overrides, clears the static root, restores a valid language or chooses English, mounts the root route, and renders known lower sections in config order under one null Suspense boundary. Unknown section IDs are skipped by Index but still become navbar links. Hero/Footer remain outside this section list. Evidence: [main:8](../src/main.tsx#L8), [i18n:50](../src/i18n/i18n.tsx#L50), [Index:19](../src/pages/Index.tsx#L19), [Navbar:10](../src/components/Navbar.tsx#L10).

```mermaid
sequenceDiagram
    actor Visitor
    participant Host as Static host
    participant Browser
    participant React as main and App
    participant Config as Site and theme config
    participant I18n
    participant Data as Bundled locale JSON
    participant Page as Index and sections
    Visitor->>Host: GET root page
    Host-->>Browser: Static HTML and asset references
    Browser->>React: Execute entry module
    React->>Config: applyTheme and read site settings
    Config-->>Browser: Inject light and dark CSS variable overrides
    React->>Browser: Clear static root
    React->>I18n: Initialize provider
    I18n->>Browser: Read localStorage lang
    I18n->>Data: Select saved valid locale or default
    Data-->>I18n: Dictionary
    React->>Page: Mount root route with configured sections
    Page->>I18n: t strings and tr arrays
    I18n-->>Page: Content values
    Page-->>Visitor: Hero then lazy sections and scroll reveals
```

Caption: config and locale content are bundled; local media is served by public paths. How to read: storage restores only preferences; section chunks load asynchronously, and failures have no custom error boundary.

## Flow 2: reveal projects and inspect an entry

**[Verified]** `Projects.tsx:20` reads `projects.items`; lines 24–25 partition by `featured`. Initial state is `showAll=false`, `openIndex=0`. A row click selects that index or closes it. Show More/Less toggles the additional group and resets the open index to zero (`Projects.tsx:189`). External link clicks stop propagation and open a new tab. No write reaches persistent storage.

```mermaid
sequenceDiagram
    actor Visitor
    participant Projects
    participant I18n
    participant Data as Locale project array
    participant State as React component state
    Projects->>I18n: tr projects.items
    I18n->>Data: Resolve nested array
    Data-->>Projects: Seven project records via tr
    Projects->>State: showAll false and openIndex zero
    Projects-->>Visitor: Featured group with first entry open
    Visitor->>Projects: Click View More Projects
    Projects->>State: Flip showAll and reset openIndex
    State-->>Projects: Updated values
    Projects-->>Visitor: Reveal additional group
    Visitor->>Projects: Click project row
    Projects->>State: Select index or set null
    Projects-->>Visitor: Expand or collapse details
```

Caption: this journey reads bundled records and writes only ephemeral UI state. How to read: a reload/remount resets state; source is [Projects](../src/components/sections/Projects.tsx).

```mermaid
stateDiagram-v2
    [*] --> Projects
    state Projects {
        state GroupVisibility {
            [*] --> FeaturedOnly
            FeaturedOnly --> AllProjects: View More and reset openIndex to zero
            AllProjects --> FeaturedOnly: Show Less and reset openIndex to zero
        }
        --
        state Accordion {
            [*] --> FirstOpen
            FirstOpen --> NoneOpen: Click current row
            FirstOpen --> RowOpen: Click another row
            NoneOpen --> RowOpen: Click any row
            RowOpen --> NoneOpen: Click current row
            RowOpen --> RowOpen: Click another row
        }
    }
```

Caption: group visibility and accordion selection are concurrent state dimensions. How to read: the two regions summarize `showAll` and `openIndex`; visibility-toggle actions also reset the accordion to its first row. Neither dimension persists across remounts.

## Flow 3: choose and restore a language

**[Verified]** This path becomes user-accessible when a second locale file is added. Currently [en.json](../src/locales/en.json) is the only locale, and [LanguageSelector:16](../src/components/LanguageSelector.tsx#L16) renders a label instead of a menu. `setLang` rejects unknown codes, writes the `lang` preference, and triggers an HTML `lang` update. A valid locale missing an individual key does not fall back to English ([i18n:58](../src/i18n/i18n.tsx#L58)).

```mermaid
sequenceDiagram
    actor Visitor
    participant Selector as LanguageSelector
    participant I18n
    participant Storage as localStorage
    participant DOM as Document and consumers
    Visitor->>Selector: Select discovered locale when menu exists
    Selector->>I18n: setLang code
    alt Code is known
        I18n->>I18n: Update React language state
        I18n->>Storage: setItem lang
        I18n->>DOM: Effect updates HTML lang and consumers rerender
        DOM-->>Visitor: Translated content
        Visitor->>I18n: Reload and initialize
        I18n->>Storage: getItem lang
        Storage-->>I18n: Saved code
        I18n-->>DOM: Restore if code is still available
    else Code is unknown
        I18n-->>Selector: Ignore selection
    end
```

Caption: language is the app-owned persistent preference flow. How to read: storage access has no try/catch; unavailable/denied storage is an unresolved failure case, not a handled branch.

## State, async behavior, reliability, and security

**[Verified]** UI state is local React state; language uses context/localStorage. Theme behavior is delegated to next-themes with `siteConfig.theme.default`; `applyTheme()` adds authored token overrides. The query client has no portfolio `useQuery`/`useMutation` consumers. There are no queues, database transactions, or N+1 queries. Lazy imports, observers, animations, and toast timers are the relevant asynchronous mechanisms ([App](../src/App.tsx), [config](../src/config/index.ts), [scroll hook](../src/hooks/useScrollAnimation.ts), [toast hook](../src/hooks/use-toast.ts)).

**[Inferred]** Static assets can be distributed through a cache/CDN without per-user server computation because all content is bundled. Main reliability concerns are failed JavaScript/chunk loads, missing third-party resources, and content drift across JSON/HTML. All locales are eagerly bundled, so adding large dictionaries increases client payload. No explicit asset caching policy, service worker, runtime error reporting, or custom React error boundary is checked in.

**[Verified]** The portfolio is public. There is no authentication, authorization, contact-input submission, or server-secret requirement. `RichText` renders React nodes. Config and locale URLs/CSS token values are trusted authored input without general URL/CSS/schema validation. Config's four required-field checks only log to the browser console; they do not throw or stop startup, despite the "Fail fast" comment. See [config:31](../src/config/index.ts#L31), [RichText](../src/components/RichText.tsx), [Contact](../src/components/sections/Contact.tsx). Host TLS/security headers remain **[Unknown]**.

## Flow 4: config to generated public files

**[Verified]** [Vite](../vite.config.ts) registers `siteFilesPlugin()` in every mode. Its `buildStart` hook reads site JSON from the current working directory and writes changed sitemap, robots, and manifest content into `public/`. The sitemap uses the current UTC day, not a source-content modification timestamp. The plugin has no custom config-file watch hook or error recovery; run a new dev/build cycle to regenerate after config changes. It does not generate `index.html`, JSON-LD, or `llms.txt` ([site-files.ts:10](../scripts/site-files.ts#L10)).

```mermaid
sequenceDiagram
    actor Author
    participant Vite
    participant Plugin as siteFilesPlugin
    participant Config as site.json on disk
    participant Public as Public output files
    participant Artifact as Static artifact
    Author->>Config: Edit identity origin or SEO settings
    Author->>Vite: Start dev server or build
    Vite->>Plugin: buildStart
    Plugin->>Config: Read and parse JSON
    Config-->>Plugin: siteUrl person and seo
    Plugin->>Plugin: Compute sitemap date and file contents
    Plugin->>Public: Write changed sitemap robots manifest
    Vite->>Artifact: Include public files in production build
    Artifact-->>Author: Ready-to-publish files
```

Caption: the generator runs in Node during dev/build, separately from browser rendering. How to read: malformed JSON/filesystem errors fail this path; there is no backend write by a visitor, and preview does not perform a new build.

## Decisions and trade-offs

| Observation | Likely rationale and consequence |
| --- | --- |
| [Verified] Static JSON instead of CMS | [Inferred] Simple publishing and no service credentials; editing content requires rebuilding |
| [Verified] Site/theme config separated from locales | [Inferred] Easier reuse of identity/media/style settings; record arrays, prose facts, static HTML and llms content still need coordinated editing |
| [Verified] Three files generated by a Vite plugin | [Inferred] Reduces drift for crawler/manifest fields; writes tracked outputs and uses build date, while the larger SEO surfaces remain manual |
| [Verified] Custom i18n context and eager glob | [Inferred] Adding files is simple; schema validation and per-key fallback must be supplied separately |
| [Verified] Static root plus React replacement | [Inferred] Provides initial machine-readable content; duplicates maintenance and is not SSR hydration |
| [Verified] Lazy lower sections with null fallback | [Inferred] Reduces initial module work; offers no loading feedback and can delay navigation targets |
| [Verified] Broad UI kit, Query provider, two toaster systems | [Unknown] Intended future consumers; assess usage before removing |

Evidence: [i18n](../src/i18n/i18n.tsx), [config](../src/config/index.ts), [generator](../scripts/site-files.ts), [Index](../src/pages/Index.tsx). **[Verified]** No ADR directory was found. [AGENTS.md](../AGENTS.md) records architecture rules and the [template plan](../.lovable/plan/make-the-portfolio-a-fully-configurable-template-2026-10-02.md) records goals; neither establishes that every planned feature shipped. The [original portfolio plan](_archive/original-portfolio-plan.md) remains historical intent.

Next: [Code guide](04-code-guide.md).
