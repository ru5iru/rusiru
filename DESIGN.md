# Design System & Visual Architecture — The Engineering Broadsheet

Canonical visual reference: [docs/prototype/broadsheet-prototype.html](docs/prototype/broadsheet-prototype.html)

This document defines the visual language, typographic hierarchy, color tokens, print rules, and section-by-section layout specifications for the **Engineering Broadsheet** redesign of `rusiru.cc`. Every visual element is strictly driven by configuration ([src/config/site.json](src/config/site.json), [src/config/theme.json](src/config/theme.json)) and locale dictionaries ([src/locales/en/](src/locales/en/)) in accordance with [AGENTS.md](AGENTS.md).

---

## 1. Design Philosophy & Anti-Goals

### Core Aesthetic
- **Classical Broadsheet Print Craft**: The portfolio is framed as a tactile, multi-column physical broadsheet newspaper resting on an architectural desk surface.
- **Hierarchy Through Ink & Rules**: Visual structure relies on typographic scale, `1px` column hairlines, `2.5px` heavy section rules, `4px` double print rules, and subtle paper-tint tonal shifts—never neon gradients or heavy drop shadows.
- **Adaptability-First Engineering Authority**: The design foregrounds full-lifecycle problem solving, architectural breadth, and verbatim project/experience logs rather than rigid "tool counter" badges.

### Explicit Anti-Goals (Never Reintroduce)
- **No AI Neon Gradients or Glows**: Do not use blue-to-cyan `.gradient-text`, `.gradient-bg`, `.gradient-border`, `.glow`, or floating blurred background blobs (`.blob-1/2/3`, `blur-3xl`).
- **No Fixed Navy Honeycomb Hero**: Do not use `.hero-hex` or embed the profile image inside a headline character (`S[O]LUTIONS`).
- **No Stat Counter Boxes**: Do not render `2+ Years Exp.`, `24 Technologies`, or `100% Code Quality` counter cards, and do not hardcode technology counts (`"24 Technologies"`) in headings.
- **No Redundant Availability Ears or Red-Pen Overlays**: Do not place an "Availability Bulletin" box in the masthead or repeat location/availability notices across multiple headers; mention work arrangements once in the Contact/Correspondence section.

---

## 2. Color Palette & Configurable Theme Tokens

Colors are defined as HSL triplets (`H S% L%`) in [src/index.css](src/index.css) and remain fully overridable via [src/config/theme.json](src/config/theme.json) and `applyTheme()` in [src/config/index.ts](src/config/index.ts).

### Day Newsprint Edition (`:root` / Light Mode)

| Semantic Token | Prototype Variable | Hex Reference | HSL Value (`theme.json` / `index.css`) | Usage |
| :--- | :--- | :--- | :--- | :--- |
| `--background` | `--paper` | `#EFE8D8` | `42 36% 89%` | Primary broadsheet newsprint surface |
| `--foreground` | `--ink` | `#181614` | `30 9% 9%` | Primary carbon ink for headlines, rules & body copy |
| `--card` | `--paper-tint` | `#F5EFE2` | `41 46% 92%` | Elevated dossier, dispatch, and article card surface |
| `--card-foreground` | `--ink` | `#181614` | `30 9% 9%` | Card text ink |
| `--secondary` | `--paper-dark` | `#E4DBC7` | `39 30% 84%` | Darker newsprint well for subheaders, tags & sidebars |
| `--secondary-foreground` | `--ink` | `#181614` | `30 9% 9%` | Secondary surface ink |
| `--muted` | `--paper-dark` | `#E4DBC7` | `39 30% 84%` | Muted background boxes & inactive filter pills |
| `--muted-foreground` | `--ink-soft` | `#48433C` | `35 9% 26%` | Secondary editorial prose & bullet descriptions |
| `--primary` | `--red` | `#B52B20` | `4 70% 42%` | Editorial crimson ink for kickers, stamps & primary CTAs |
| `--primary-foreground` | — | `#FFFFFF` | `0 0% 100%` | Text on crimson primary buttons |
| `--accent` | `--red-soft` | `#EEDAD6` | `8 42% 89%` | Soft crimson highlight tint (`==highlight==` in `RichText`) |
| `--accent-foreground` | `--red` | `#B52B20` | `4 70% 42%` | Highlighted text foreground |
| `--border` | `--rule` | `#C7BFA9` | `38 22% 74%` | `1px` column hairlines and box borders |
| `--ring` | `--red` | `#B52B20` | `4 70% 42%` | Keyboard focus ring |
| `--desk` *(extended)* | `--desk` | `#23201C` | `34 11% 12%` | Outer desk background framing the broadsheet page |
| `--faint` *(extended)* | `--ink-faint` | `#787064` | `36 9% 43%` | Datelines, timestamps & subtle captions |

### Night Press Edition (`.dark` / Dark Mode)

| Semantic Token | Prototype Variable | Hex Reference | HSL Value (`theme.json` / `index.css`) | Usage |
| :--- | :--- | :--- | :--- | :--- |
| `--background` | `--paper` | `#151411` | `45 11% 7%` | Dark microfilm broadsheet surface |
| `--foreground` | `--ink` | `#ECE5D5` | `42 36% 88%` | Warm parchment ink for headlines & body |
| `--card` | `--paper-tint` | `#1A1815` | `36 11% 9%` | Elevated dark dispatch/dossier card |
| `--card-foreground` | `--ink` | `#ECE5D5` | `42 36% 88%` | Card text ink |
| `--secondary` | `--paper-dark` | `#1D1B17` | `40 12% 10%` | Secondary dark well for headers & pills |
| `--secondary-foreground` | `--ink` | `#ECE5D5` | `42 36% 88%` | Secondary surface text |
| `--muted` | `--paper-dark` | `#1D1B17` | `40 12% 10%` | Muted dark surface |
| `--muted-foreground` | `--ink-soft` | `#A8A090` | `40 12% 61%` | Secondary editorial prose in dark mode |
| `--primary` | `--red` | `#E05245` | `5 72% 57%` | Luminous vermilion-crimson for dark mode contrast |
| `--primary-foreground` | — | `#FFFFFF` | `0 0% 100%` | Text on primary actions |
| `--accent` | `--red-soft` | `#331B18` | `7 36% 15%` | Soft crimson highlight tint in dark mode |
| `--accent-foreground` | `--red` | `#E05245` | `5 72% 57%` | Highlighted text in dark mode |
| `--border` | `--rule` | `#38342E` | `36 10% 20%` | `1px` dark print hairline |
| `--ring` | `--red` | `#E05245` | `5 72% 57%` | Keyboard focus ring |
| `--desk` *(extended)* | `--desk` | `#090908` | `60 6% 3%` | Outer dark desk background |
| `--faint` *(extended)* | `--ink-faint` | `#6C665B` | `39 9% 39%` | Subtle metadata in dark mode |

---

## 3. Typography & Print Hierarchy

Load the three Google Fonts non-render-blockingly in [index.html](index.html) and register them in [tailwind.config.ts](tailwind.config.ts):

1. **Display / Masthead & Headlines (`font-display`)**:
   - `'Fraunces', Georgia, serif` (weights `400, 600, 700, 800, 900`, normal & italic).
   - Used for the masthead (`RUSIRU RATHMINA`), front-page banner headline, section titles (`Work Experience`, `Education & Continuing Education`, `Featured Projects`, etc.), role titles, project titles, and drop caps.
2. **Editorial Body Copy (`font-sans` / `font-serif` body default)**:
   - `'Newsreader', Georgia, serif` (weights `400, 500, 600`, normal & italic).
   - Used for lead paragraphs, multi-column biography prose, and expandable experience/project descriptions.
3. **Technical Metadata & Kickers (`font-mono`)**:
   - `'IBM Plex Mono', ui-monospace, monospace` (weights `400, 500, 600`).
   - Used for top utility bars, section kickers (`SECTION A2 · CAREER CHRONICLE`), dispatch badges (`DISPATCH 01`, `DOSSIER 01`), dates, tech tags, and navigation pills.

---

## 4. Broadsheet Surface & Rule Primitives

Define reusable component classes in [src/index.css](src/index.css):

- **`.broadsheet-page`**:
  - Max-width `72rem` (`max-w-6xl`), centered on the `--desk` outer background with subtle center-fold linear gradient, fine dot grain (`18px × 18px`), `1px solid hsl(var(--foreground))` outer border, and stacked-page offset shadow (`8px 8px 0 hsl(var(--secondary)), 9px 9px 0 hsl(var(--foreground))`).
- **Print Rules**:
  - `.r-t`, `.r-b`, `.r-r`, `.r-box`: `1px solid hsl(var(--border))`; use token-based border utilities for other edges.
  - `.r-heavy-t`, `.r-heavy-b`: `2.5px solid hsl(var(--foreground))`
  - `.r-double-t`, `.r-double-b`: `4px double hsl(var(--foreground))`
- **`.lead-dropcap::first-letter`**:
  - `float: left; font-family: 'Fraunces', serif; font-weight: 900; font-size: 3.8rem; line-height: 0.82; padding: 4px 10px 2px 0; color: hsl(var(--foreground));`
- **`.engraving-photo`**:
  - `filter: grayscale(100%) contrast(1.18) sepia(18%); transition: filter 0.35s ease;`
  - Hover state restores full color: `filter: grayscale(0%) contrast(1.03) sepia(0%);`
- **`.scissor-coupon`**:
  - `border: 2px dashed hsl(var(--foreground)); background-color: hsl(var(--card));`
- **`.dossier-flash`**:
  - 1.6-second highlight pulse triggered when a user clicks a front-page jump link (`Read full dispatch in Sec A2 →` or `Unfold full dossier in Sec B2 →`) to draw attention to the target expanded card.

---

## 5. Section-by-Section Layout Architecture

### 5.1 Top Desk Utility Bar & Masthead (`Navbar.tsx` + `Hero.tsx`)
- **Top Desk Utility Bar** (outside `.broadsheet-page`):
  - Left: Edition badge & subtitle (localized via `nav`).
  - Right: **"Unfold All Dispatches & Logs"** global toggle button, **Theme Toggle** (`☾ Night Press Edition` / `☀ Day Newsprint Edition`), and **Language Selector** (`LanguageSelector.tsx`).
- **Masthead (`header#front-page`)**:
  - **Top Print Registration Strip**: 3 metadata items (`PORTFOLIO EDITION`, `SOFTWARE ENGINEERING · ARCHITECTURE · CLOUD & DEVOPS`, `ISSUE NO. III`) driven by locale keys.
  - **Centered Masthead Block**: Kicker (`The Engineering Portfolio & Systems Chronicle of`), giant `Fraunces` `h1` (`siteConfig.person.name` in uppercase), and italic subtitle (`hero.srHeading` / `hero.description` summary). **No left-side Availability Bulletin ear.**
  - **Section Index Bar**: Renders links for all configured `siteConfig.sections` (`A1. About`, `A2. Experience`, `B1. Education & CE`, `B2. Projects`, `C1. Capabilities`, `C2. Blog`, `C3. Contact`) on desktop, and preserves the accessible Radix Dialog modal menu on mobile (`Navbar.tsx`).

### 5.2 Section A1: Front-Page 12-Column Puzzle (`Hero.tsx` + `About.tsx`)
- **Banner Headline Block**:
  - Kicker + commanding `Fraunces` banner headline + lead deck (`hero.description`).
- **3-Column Interlocking Newspaper Grid (`lg:grid-cols-12`)**:
  1. **Left Column (`lg:col-span-3`) — Career Progression Brief**:
     - Summarizes the roles from `experience.items` (`role`, `period`, first sentence/summary) with interactive **"Read full dispatch in Sec A2 →"** jump buttons that scroll smoothly to `#experience` and open that role's collapsible row.
     - **No stat counter boxes (`2+`, `24`, `100%`).**
  2. **Center Column (`lg:col-span-6`) — Portrait Plate & Verbatim About Copy**:
     - Framed 1:1 press portrait (`siteConfig.person.profileImage` with `.engraving-photo` filter), centered and capped at `15rem` below the `sm` breakpoint; wider layouts use the portrait column width. Caption block (`person.name`, `person.jobTitle`) and primary CTAs (`View Work ↓` scrolling to `#projects`, and `Resume (PDF) ↗` linking to `siteConfig.person.resumeUrl`).
     - Below the portrait: renders `about.paragraphs` in a **2-column print layout** (`sm:grid-cols-2 text-justify`), with `.lead-dropcap` on the first paragraph and `RichText` (`**bold**` and `==crimson highlight==`) preserved.
  3. **Right Column (`lg:col-span-3`) — Featured Dispatches Index**:
     - Highlights key featured items from `projects.items` and a summary card for `Continuing Education`, each with an interactive **"Unfold full dossier in Sec B2 →"** / **"Inspect CE Registry in Sec B1 →"** jump action.

### 5.3 Section A2: Work Experience Chronicle (`Experience.tsx` + `DisclosureRow.tsx`)
- **Header**: Section kicker + `experience.title` + **"Unfold All Roles / Fold Roles"** toggle button.
- **Rows**: Uses the shared Radix Collapsible wrapper (`DisclosureRow.tsx`) styled as a newspaper dispatch card (`DISPATCH 01`, `role`, `company`, `period`, and `+ Unfold (N Points)` / `− Fold Dispatch`).
- **Collapsed State**: Shows a 1-line lead preview (`item.description[0]`) so the page remains scannable when folded.
- **Expanded State**: Renders **100% of `item.description` bullets verbatim** with `§1.1`, `§1.2` legal/editorial section markers. First role is open by default.

### 5.4 Section B1: Education & Continuing Education Gazette (`Education.tsx`)
- **Header**: Section kicker + title + outbound link to `siteConfig.continuingEducationUrl` (`View Full License & Certification Ledger on LinkedIn ↗`).
- **2-Column Asymmetric Split (`lg:grid-cols-12`)**:
  - **Left Column (`lg:col-span-5`) — I. Academic Degrees & Schooling**:
    - Renders `education.items` (`UCSC`, `Mahinda College, Galle`) with their configured `siteConfig.educationLogos[item.id]`, `period`, `institution`, `degree`, and all `details` bullets (`GPA: 3.01`, `A/L Results`, `O/L Results`).
  - **Right Column (`lg:col-span-7`) — II. Continuing Education — Licenses & Certifications**:
    - Renders the configured `education.certifications` array (issuer badge, issue date, certificate title, skills list, and `Show Credential ↗` link) plus the bottom summary bar linking to LinkedIn certifications.

### 5.5 Section B2: Featured Projects & Archive Dossiers (`Projects.tsx` + `DisclosureRow.tsx`)
- **Header**: Section kicker + `projects.title` + filter buttons (`Featured (N)` / `All Works (Total)`) + **"Unfold All Project Logs"** button.
- **Rows**: Uses the shared Radix Collapsible pattern (`DOSSIER 01`, `period`, `Featured`/`Archive` badge, `title`, `tech` tags, separate outbound `Visit ↗` and `GitHub ↗` buttons outside the trigger to avoid nested interactive controls, and `+ Read Full Log (N)` / `− Fold Log`).
- **Expanded State**: Renders **100% of `project.description` bullets verbatim** numbered `[01]`, `[02]`, etc.
- **Footer Toggle**: Retains the accessible `View More Projects ↓` / `Show Less ↑` button (`aria-expanded={showAll}`).

### 5.6 Section C1: Adaptability-First Technical Foundation (`Skills.tsx`)
- **Philosophy**: Avoids displaying a rigid wall of 24 icon cards or claiming a fixed number of tools.
- **Layout (`lg:grid-cols-12`)**:
  - **Left Column (`lg:col-span-4`)**: Section kicker, heading (`Core Domains & Representative Stack`), adaptability thesis paragraph, and a callout note explaining that languages/frameworks are treated as interchangeable instruments.
  - **Right Column (`lg:col-span-8`)**: Iterates over `siteConfig.skills` (`languages`, `frameworks`, `databases`, `devops`, `tools`), rendering each category as a compact horizontal print row with its localized domain title, domain subtitle/note, and inline middot-separated item names (`Java · JavaScript · PHP · C++ & related ecosystem`).

### 5.7 Section C2: Latest Blog Posts (`Blog.tsx`)
- **Header**: Section kicker + title + `Visit My Blog ↗` (`siteConfig.blogUrl`).
- **3-Column Print Grid (`md:grid-cols-3`)**: Renders `blog.posts` with `dateLabel`, `readTime`, `Fraunces` headline link, `excerpt`, and `Read full post ↗` footer.

### 5.8 Section C3: Correspondence, Dispatch Coupon & Colophon (`Contact.tsx` + `Footer.tsx`)
- **2-Column Layout (`lg:grid-cols-12`)**:
  - **Left Column (`lg:col-span-5`)**: Direct Channels & Profiles box stating availability for onsite/hybrid (Sri Lanka) and remote opportunities worldwide, plus all configured `siteConfig.social` links resolved via `BrandIcons.tsx` and localized labels.
  - **Right Column (`lg:col-span-7`)**: `.scissor-coupon` dashed dispatch card (`✂ DIRECT DISPATCH COUPON`) with `contact.description`, primary `mailto:` button (`siteConfig.person.email`), and secondary platform button (`siteConfig.contact.secondaryButton`).
- **Colophon Footer (`Footer.tsx`)**: Double top rule (`.r-double-t`), brand monogram (`RR.`), copyright notice, and `↑ Back to Top` link.
