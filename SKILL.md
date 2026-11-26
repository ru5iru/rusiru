---
name: broadsheet-portfolio-redesign
description: Step-by-step workflow and architectural blueprint for implementing and maintaining The Engineering Broadsheet portfolio redesign while keeping all data, colors, sections, and locales 100% configurable.
---

# Broadsheet Portfolio Redesign & Maintenance Skill

Use this skill whenever implementing, updating, or extending the **Engineering Broadsheet** design on this repository. Always read [AGENTS.md](AGENTS.md), [DESIGN.md](DESIGN.md), and the reference prototype at [docs/prototype/broadsheet-prototype.html](docs/prototype/broadsheet-prototype.html) before modifying runtime code.

---

## 1. Core Architectural Invariants

1. **Zero Hardcoded Content or Personal Facts in Components**:
   - Every personal fact, URL, image path, skill list, certification URL, and section ordering lives in [src/config/site.json](src/config/site.json).
   - Every color override lives in [src/config/theme.json](src/config/theme.json).
   - Every user-visible string, section kicker, button label, domain note, and record array (`experience.items`, `education.items`, `education.certifications`, `projects.items`, `blog.posts`) lives in [src/locales/en/](src/locales/en/) (and any additional `src/locales/<lang>/` files).
2. **Schema-First Validation**:
   - Validate all new config fields in [src/config/schema.ts](src/config/schema.ts) and all new locale keys in [src/i18n/schema.ts](src/i18n/schema.ts) before runtime and build-time generation.
3. **Shared Generator Pipeline**:
   - [scripts/site-files.ts](scripts/site-files.ts) and [scripts/search-content.ts](scripts/search-content.ts) own `public/sitemap.xml`, `public/robots.txt`, `public/site.webmanifest`, `public/llms.txt`, and the static HTML/JSON-LD injection in [index.html](index.html). Never hand-edit generated outputs.
4. **Accessible Radix Primitives**:
   - Expandable dispatches (`Experience`) and dossiers (`Projects`) must use the shared `@radix-ui/react-collapsible` wrapper in [src/components/DisclosureRow.tsx](src/components/DisclosureRow.tsx), keeping outbound links (`Visit`, `GitHub`) outside `<Collapsible.Trigger>` to prevent nested interactive controls.
   - Mobile navigation must use `@radix-ui/react-dialog` in [src/components/Navbar.tsx](src/components/Navbar.tsx) for focus management and keyboard accessibility.

---

## 2. Configuration & Locale Schema Extensions

When implementing the Broadsheet prototype features, extend the configuration and locale files cleanly as follows:

### 2.1 `src/config/site.json` & `src/config/schema.ts`
- Retain all existing fields (`siteUrl`, `person`, `seo`, `theme`, `sections`, `contact`, `blogUrl`, `social`, `educationLogos`, `skills`).
- Update `seo.themeColor` to match the newsprint/desk tone (`#efe8d8` or `#23201c`).
- Add optional/validated `continuingEducationUrl` (or `certificationsUrl`: `webUrl`) in `site.json` pointing to `https://www.linkedin.com/in/ru5iru/details/certifications/` so the Continuing Education ledger link is config-driven.

### 2.2 `src/config/theme.json` & `src/index.css`
- Update `src/config/theme.json` with the Broadsheet HSL overrides:
  ```json
  {
    "$comment": "Optional color overrides as HSL values ('H S% L%'). Any CSS variable from src/index.css can be set here; leave empty to use defaults.",
    "light": {
      "background": "42 36% 89%",
      "foreground": "30 9% 9%",
      "card": "41 46% 92%",
      "card-foreground": "30 9% 9%",
      "primary": "4 70% 42%",
      "primary-foreground": "0 0% 100%",
      "secondary": "39 30% 84%",
      "secondary-foreground": "30 9% 9%",
      "muted": "39 30% 84%",
      "muted-foreground": "35 9% 26%",
      "accent": "8 42% 89%",
      "accent-foreground": "4 70% 42%",
      "border": "38 22% 74%",
      "input": "38 22% 74%",
      "ring": "4 70% 42%"
    },
    "dark": {
      "background": "45 11% 7%",
      "foreground": "42 36% 88%",
      "card": "36 11% 9%",
      "card-foreground": "42 36% 88%",
      "primary": "5 72% 57%",
      "primary-foreground": "0 0% 100%",
      "secondary": "40 12% 10%",
      "secondary-foreground": "42 36% 88%",
      "muted": "40 12% 10%",
      "muted-foreground": "40 12% 61%",
      "accent": "7 36% 15%",
      "accent-foreground": "5 72% 57%",
      "border": "36 10% 20%",
      "input": "36 10% 20%",
      "ring": "5 72% 57%"
    }
  }
  ```

### 2.3 `src/locales/en/*.json` & `src/i18n/schema.ts`
Preserve all existing required keys in `src/i18n/schema.ts` and extend the locale sections with the Broadsheet editorial copy:
- **`education.certifications`**:
  Add a validated array of Continuing Education credentials:
  ```json
  "certificationsTitle": "II. Continuing Education — Licenses & Certifications",
  "certificationsSubtitle": "PROFESSIONAL DEVELOPMENT",
  "showCredential": "Show Credential",
  "viewAllCertifications": "View Full License & Certification Ledger on LinkedIn",
  "moreCertificationsNote": "ADDITIONAL CERTIFICATES (CYBERSECURITY RISK MANAGEMENT & MORE) ON FILE",
  "certifications": [
    {
      "issuer": "KONG",
      "date": "Issued Oct 2026",
      "title": "Microservices Foundations Professional Certificate by Kong",
      "skills": "Software Design Patterns · Software Architecture",
      "url": "https://www.linkedin.com/in/ru5iru/details/certifications/"
    }
  ]
  ```
- **`skills` Adaptability Framing**:
  Add localized philosophy copy and per-category domain notes (`skills.notes.<categoryId>`) plus `skills.relatedEcosystem` (`"& related ecosystem"`) so the understated horizontal print ledger in `Skills.tsx` remains 100% localized.
- **Clean `about.paragraphs`**:
  Remove AI-style leading emojis (`👋`, `🚀`) from `about.paragraphs` so the drop-cap lead paragraph (`.lead-dropcap`) renders cleanly in print typography.

---

## 3. Component Implementation Workflow

When converting the React components to match [docs/prototype/broadsheet-prototype.html](docs/prototype/broadsheet-prototype.html):

1. **Fonts & Print CSS (`index.html`, `tailwind.config.ts`, `src/index.css`)**:
   - Load `Fraunces`, `Newsreader`, and `IBM Plex Mono` in `index.html`.
   - Map `fontFamily.display` to `'Fraunces'`, `fontFamily.sans` / `fontFamily.serif` to `'Newsreader'`, and `fontFamily.mono` to `'IBM Plex Mono'` in `tailwind.config.ts`.
   - Define `.broadsheet-page`, `.r-t`, `.r-b`, `.r-l`, `.r-r`, `.r-box`, `.r-heavy-t`, `.r-heavy-b`, `.r-double-t`, `.r-double-b`, `.lead-dropcap`, `.engraving-photo`, `.scissor-coupon`, and `.dossier-flash` in `src/index.css`.
2. **Page Shell (`src/pages/Index.tsx` & `src/components/Navbar.tsx`)**:
   - Wrap the page in the outer `--desk` surface and center `.broadsheet-page`.
   - Render the Top Desk Utility Bar (`Navbar.tsx`) and the Centered Broadsheet Masthead + Section Index Bar.
   - Maintain per-section `<LoadBoundary><Suspense fallback={<LoadingState />}>` wrappers for all configured sections in `siteConfig.sections`.
3. **Cross-Section Jump & Unfold Coordination (`src/lib/navigation.ts`)**:
   - Support jumping from Front Page brief cards (`Read full dispatch in Sec A2 →` / `Unfold full dossier in Sec B2 →`) to the lazy-loaded `#experience` or `#projects` section, automatically opening the targeted `DisclosureRow` item and triggering `.dossier-flash`, plus supporting the global **"Unfold All Dispatches & Logs"** action via a lightweight custom event or shared context.
4. **Section Components (`src/components/sections/*.tsx`)**:
   - **`Hero.tsx` + `About.tsx`**: Implement the Front-Page 12-Column Newspaper Puzzle (Left: Career Progression brief with jump links; Center: `.engraving-photo` portrait plate + CTAs + 2-column `.lead-dropcap` `about.paragraphs` with `RichText`; Right: Featured Dispatches & CE brief cards). Do **not** render stat counter boxes (`2+`, `24`, `100%`) or availability ears in the masthead.
   - **`DisclosureRow.tsx`**: Restyle the Radix Collapsible row into the Broadsheet Dispatch / Dossier card (`DISPATCH 01` / `DOSSIER 01`, headline, metadata, `+ Unfold (N Points)` / `− Fold`, and 1-line collapsed lead summary preview).
   - **`Experience.tsx`**: Render all `experience.items` verbatim using `DisclosureRow` with an "Unfold All Roles" button in the section header.
   - **`Education.tsx`**: Render the 12-column split with Formal Education (`education.items` + `siteConfig.educationLogos`) in the left 5 columns and Continuing Education (`education.certifications`) in the right 7 columns.
   - **`Projects.tsx`**: Render `projects.items` using `DisclosureRow` with `Featured` / `All Works` filter tabs, an "Unfold All Project Logs" button, and the bottom `View More Projects` / `Show Less` toggle.
   - **`Skills.tsx`**: Render the 12-column adaptability-first Technical Foundation section (Left 4 cols: adaptability thesis & note; Right 8 cols: horizontal domain rows iterating over `siteConfig.skills` without rigid icon boxes or tool counts).
   - **`Blog.tsx`**: Render the 3-column syndicated essay cards from `blog.posts`.
   - **`Contact.tsx` & `Footer.tsx`**: Render the 12-column Correspondence section (Left 5 cols: Direct Channels & `siteConfig.social` directory; Right 7 cols: `.scissor-coupon` dispatch box) and the double-ruled Colophon footer.

---

## 4. Verification Checklist

Before completing any implementation task:
- [ ] Run `bun test` (or `vitest run`) and update/add behavioral tests in `src/test/` for any new interactions (e.g., Continuing Education rendering, Unfold All toggle, Front-Page jump links).
- [ ] Run `bun run lint` and ensure zero ESLint or Fast Refresh violations.
- [ ] Run `bun run build` so `siteFilesPlugin` validates `site.json`, `theme.json`, and the `src/locales/en/` files against their Zod schemas and regenerates `public/sitemap.xml`, `public/robots.txt`, `public/site.webmanifest`, `public/llms.txt`, and `index.html`.
- [ ] Commit all changes using **Conventional Commit** messages (`feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`, `chore:`).