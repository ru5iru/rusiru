# Template usage guide

This guide explains how to turn the Engineering Broadsheet into your own portfolio. You can personalize the site by editing JSON files and replacing images; most changes require no component edits.

For code structure and contributor commands, see [Development](development.md). For hosting and release checks, see [Deployment](deployment.md).

## Contents

1. [Fork the repository and run it](#1-fork-the-repository-and-run-it)
2. [Know where each setting belongs](#2-know-where-each-setting-belongs)
3. [Configure identity, links, SEO, and section order](#3-configure-identity-links-seo-and-section-order)
4. [Edit wording and portfolio records](#4-edit-wording-and-portfolio-records)
5. [Publish, hide, and place content](#5-publish-hide-and-place-content)
6. [Configure each section](#6-configure-each-section)
7. [Add or translate a language](#7-add-or-translate-a-language)
8. [Change colors and typography](#8-change-colors-and-typography)
9. [Replace images, icons, and verification files](#9-replace-images-icons-and-verification-files)
10. [Understand generated files](#10-understand-generated-files)
11. [Check your changes](#11-check-your-changes)
12. [Troubleshooting and release checklist](#12-troubleshooting-and-release-checklist)

## 1. Fork the repository and run it

Begin with your own copy of the template. A fork leaves the original untouched, gives you a place to push your edits, and lets you pull later template changes.

### Fork it

1. On the repository's GitHub page, select **Fork** (top right) and choose your own account as the owner. Keep the default option that copies only the main branch.
2. Clone your fork, replacing `<your-name>` with your GitHub account and `<repo>` with the repository name:

```sh
git clone https://github.com/<your-name>/<repo>.git
cd <repo>
```

Or fork and clone in one step with the GitHub CLI:

```sh
gh repo fork <original-owner>/<repo> --clone
```

3. Point `upstream` at the original repository so you can bring its later changes into your fork:

```sh
git remote add upstream https://github.com/<original-owner>/<repo>.git
git remote -v
```

`origin` is your fork, which you push to. `upstream` is the original, which you pull from.

4. Before each work session, sync your fork with the original:

```sh
git switch main
git fetch upstream
git merge --ff-only upstream/main
git push origin main
```

If you are not using GitHub, download the repository archive or copy its folder instead. Everything below is the same, except you will not receive upstream updates automatically.

Forking keeps the [MIT licence](../LICENCE) intact. It does not grant rights to the included biography, photographs, logos, or trademarks, so replace that material as you work; see [section 9](#9-replace-images-icons-and-verification-files).

### Install and run

Use **Node 22** and **Bun 1.3.3**. From the repository root:

```sh
bun install --frozen-lockfile
bun run dev
```

Open `http://localhost:8080`, or the URL printed by Vite. The template needs no environment variables, database, account system, API keys, or paid service.

Edit files while the development server runs and review the page after each change. Invalid JSON, missing required fields, malformed URLs, duplicate IDs, and invalid theme values are rejected early; read the terminal or browser error message before continuing.

### A practical first setup

Work through these changes in order:

1. Set `siteUrl`, `person`, and `seo` in `src/config/site.json`.
2. Replace shared résumé, blog, certification, contact, and social links in the same file.
3. Replace the biography and portfolio records under `src/locales/en/`.
4. Choose section order and initial item placement.
5. Replace the portrait, education logos, favicons, and inherited search-verification material.
6. Review every external link and all wording, including summaries used by search engines.
7. Commit your work to your fork (`git push origin main`) so it is recoverable before you deploy.
8. Run the checks in [section 11](#11-check-your-changes), then follow the [deployment guide](deployment.md).

## 2. Know where each setting belongs

| What you want to change | Where to edit |
| --- | --- |
| Public site URL, name, job title, email, location, résumé | `src/config/site.json` |
| Search title/descriptions, social card path, browser theme color | `src/config/site.json` → `seo` |
| Default theme and lower-section order | `src/config/site.json` |
| Blog home, certification ledger, contact button, social destinations | `src/config/site.json` |
| Skill names and domain IDs | `src/config/site.json` → `skills` |
| School logo paths | `src/config/site.json` → `educationLogos` |
| Light and dark colors | `src/config/theme.json` |
| Navigation, headings, buttons, accessibility labels, summaries | `src/locales/en/<section>.json` |
| Experience, education, credentials, projects, and blog cards | The matching file under `src/locales/en/` |
| Publication and placement flags | Beside the relevant content in each language's files |
| Portrait, logos, local icons, social card | `public/media/`; original logos also in `media-src/` |
| Favicons and provider-issued verification material | `public/` and, for meta verification, `index.html` |

Use this division consistently:

- **Site config** holds language-neutral facts, URLs, media paths, skills, and global ordering.
- **Locale files** hold everything visitors read, plus per-language publication and placement choices.
- **Theme config** holds color values only.
- **Generators** own generated HTML metadata, static fallback content, and public search files. Do not hand-edit their outputs.

All configuration and locale content is bundled into a public static website. Publication flags are not a privacy mechanism: hidden text can remain in source files and browser bundles.

## 3. Configure identity, links, SEO, and section order

Edit [`src/config/site.json`](../src/config/site.json).

### Public URL and personal details

| Field | Purpose |
| --- | --- |
| `siteUrl` | Canonical public HTTP(S) origin, such as `https://example.com`; used by metadata and generated search files |
| `person.name` | Display name and structured identity |
| `person.jobTitle` | Professional title used in metadata |
| `person.email` | Address used by the contact email action |
| `person.profileImage` | Local `/...` asset path or HTTP(S) portrait URL |
| `person.resumeUrl` | HTTP(S) résumé destination opened by the front-page button |
| `person.location.city`, `country` | Human-readable location used in generated identity content |
| `person.location.countryCode` | Two-letter country code |
| `person.location.lat`, `lng` | Geographic coordinates; latitude must be -90…90 and longitude -180…180 |

Use your own factual details throughout the locale files too. Changing `person.name` does not rewrite a biography or project description that mentions another person.

### Search and social metadata

| Field | Purpose |
| --- | --- |
| `seo.title` | Homepage browser/search title |
| `seo.description` | Homepage search description |
| `seo.ogDescription` | Social-sharing description |
| `seo.shareImage` | Social card path or URL; the image generator writes the configured local path |
| `seo.themeColor` | Six-digit browser UI color, for example `#efe8d8` |
| `_meta.json` → `seo.shareImageAlt` | Social image alternative text; `{name}` is replaced with the configured name |
| `_meta.json` → `notFound` | Localized error-page title, descriptions, message, and return-home label |

The error page uses its own noindex metadata. Homepage and error-page metadata are generated from these shared inputs rather than maintained as separate copies.

### Shared destinations

| Field | Used for |
| --- | --- |
| `blogUrl` | “Visit blog” destination |
| `continuingEducationUrl` | Full certification ledger links |
| `contact.secondaryButton.url` | Secondary contact destination |
| `contact.secondaryButton.platform` | Icon and label lookup: `linkedin`, `github`, `discord`, `facebook`, `x`, `twitter`, `reddit`, `blog`, or `spotify` |
| `social` | Profile destinations available to Contact's direct-channel links |

Each social entry has this shape:

```json
{
  "platform": "github",
  "url": "https://github.com/your-name"
}
```

Add a matching label in `footer.social`. Built-in brand icons are keyed by platform; unknown platforms use a generic external-link icon. The schema also accepts an optional `icon` path for alternative layouts, but the current Contact section uses the platform registry rather than that custom path.

The primary contact button opens the visitor's email client with `mailto:`. The template does not contain a contact form, send email itself, or confirm delivery.

### Choose and reorder sections

`sections` controls which lower sections exist globally and their order:

```json
"sections": [
  "about",
  "experience",
  "education",
  "projects",
  "skills",
  "blog",
  "contact"
]
```

Supported IDs are `about`, `experience`, `education`, `projects`, `skills`, `blog`, and `contact`. IDs must be unique; unknown IDs are rejected. An empty array is valid.

- Remove an ID from `sections` to disable that section in **every language**.
- Keep the ID and use `"published": false` in a locale file to hide it only in that language.
- The masthead, editorial banner, front-page shell, and footer are not entries in this list.

After changing section availability, check navigation and front-page actions that point to the affected content.

## 4. Edit wording and portfolio records

English content is split into small files under [`src/locales/en/`](../src/locales/en/):

| File | What it controls |
| --- | --- |
| `_meta.json` | Language name/code, social image alt text, common accessibility/action labels, and 404 wording |
| `nav.json` | Navigation labels, masthead, edition labels, section index, theme/language controls |
| `hero.json` | Editorial banner, portrait captions, front-page actions, career/project brief labels, CE brief |
| `about.json` | About heading, biography paragraphs, accessibility label, summary |
| `experience.json` | Work roles, descriptions, expansion/archive controls, labels |
| `education.json` | Schools, degrees, details, credentials, group visibility, labels |
| `projects.json` | Project records, links, affiliations, filters, expansion labels |
| `skills.json` | Domain labels and notes, adaptability statement, summary |
| `blog.json` | Static article cards and external article links |
| `contact.json` | Contact heading, availability, coupon, and action wording |
| `footer.json` | Brand mark, copyright, social labels and accessible link wording |

The portrait, career briefs, featured project briefs, and CE brief appear in the About/front-page puzzle, but their wording intentionally lives in `hero.json`.

### Text conventions

- `ariaLabel` values name sections for assistive technology.
- `geoSummary` values provide concise machine-readable summaries. Update them when facts change; they are not automatic summaries of the records.
- Placeholders such as `{name}`, `{year}`, `{count}`, `{number}`, and `{title}` must remain in translated strings.
- About paragraphs support `**bold**` and `==highlight==` through the local rich-text renderer. They do not support arbitrary HTML or full Markdown.
- Blog cards are manually authored previews, not a synchronized feed.

### Add or edit a record

Copy an existing record of the same type, change its content, and give it a unique, stable `id`. Do not reuse an ID for unrelated content. Preserve IDs in every translation so fallback and per-language overrides attach to the correct record.

Record-specific dates and URLs belong beside the record in its locale file. Add new records to English first; translations cannot introduce IDs that English does not contain.

## 5. Publish, hide, and place content

### Hide content with `published`

`published` defaults to `true`. Add `"published": false` beside the content you want to hide; you do not need to add `"published": true` to visible content.

| Scope | Where the flag goes | Result |
| --- | --- | --- |
| Lower section | Top level of its locale section file | Removes that section and its navigation entry for that language |
| Role, school, credential, project, article | On the record | Removes only that record |
| Formal Education | `education.formalEducation.published` | Hides the formal education group |
| Continuing Education | `education.continuingEducation.published` | Hides the CE group and its front-page brief |
| Paragraph, bullet, education detail, technology tag | Replace the string with `{ "text": "…", "published": false }` | Hides only that point |
| Skill domain or social profile | Replace its label with `{ "text": "…", "published": false }` | Hides that domain/profile without deleting shared config |

Hide one work role:

```json
{
  "id": "software-engineer",
  "published": false,
  "company": "Example Company",
  "role": "Software Engineer",
  "period": "2024 - Present",
  "dateTime": "2024-01",
  "description": ["Kept in source for later."]
}
```

Hide one description point while keeping the others:

```json
"description": [
  "A visible contribution.",
  { "text": "A contribution kept for later.", "published": false }
]
```

Hide a social profile without removing its shared URL:

```json
"social": {
  "github": "GitHub",
  "spotify": { "text": "Spotify", "published": false }
}
```

A record-backed section also disappears when all of its usable content is hidden. Formal Education and Continuing Education are evaluated independently. Unpublished English content is excluded from generated search content; archived content remains published and searchable.

### Control initial expansion and front-page placement

| Flag or field | Applies to | Behavior |
| --- | --- | --- |
| `expanded` | Experience and project records | `true` selects rows that start unfolded; if none is true, the first row opens |
| `frontPage` | Experience | `false` omits the role from career briefs; omitted/true includes it |
| `frontPage` | Projects | Explicit `true` records supply up to two briefs; if none is selected, up to two featured projects are used |
| `summary` | Experience and projects | Optional short front-page text; otherwise the first description point is used |
| `frontPageKicker` | Projects | Optional short category label in the front-page brief |
| `featured` | Projects; required | `true` shows the project initially; `false` places it behind View More / All Works |
| `archived` | Experience, schools, credentials | `true` places a published item behind that list's optional View More button |
| `affiliation` | Projects | Selects a label from `projects.affiliations` |

Experience and project front-page jumps reveal an archived/non-featured target before unfolding it. Global unfolding also reveals archived roles and additional projects.

### Enable optional View More lists

View More support is built in but stays invisible until a list contains an archived item:

```json
{
  "id": "earlier-role",
  "archived": true
}
```

- Experience, formal Education, and Continuing Education have independent View More state.
- No archive button appears when that list has no archived item.
- Projects use `featured: false`, not `archived`.
- Archived items remain published, included in search content, and accessible through front-page jumps.

Customize button wording with `experience.viewMore` / `showLess` and `education.viewMoreEducation` / `viewMoreCertifications` / `showLess`.

## 6. Configure each section

### Navigation, editorial banner, and front page

- Edit `nav.json` for masthead and section-index wording. Navigation entries are generated from visible configured sections; keep `nav.links` keys aligned with supported section IDs.
- Edit `hero.json` for the editorial banner, portrait alt/captions, résumé and work buttons, and front-page brief labels.
- The actual résumé URL comes from `site.json`, not `hero.json`.
- The front-page portrait comes from `person.profileImage`; its alt text and caption come from `hero.json`.

### About

Edit `about.json`:

- `titleBefore` and `titleHighlight` form the heading.
- `paragraphs` is an ordered array. The layout divides published paragraphs into two columns.
- Use the supported emphasis markers rather than HTML.
- Hide the entire section with top-level `"published": false`, or one paragraph with a point object.

### Work Experience

Each `experience.items` record supports:

| Field | Required | Meaning |
| --- | --- | --- |
| `id` | Yes | Stable record identity |
| `company`, `role` | Yes | Employer and role heading |
| `period` | Yes | Displayed date range |
| `dateTime` | Yes | Machine-readable date value for the `<time>` element |
| `description` | Yes | Ordered contribution points |
| `summary` | No | Short front-page summary |
| `frontPage` | No | Include/exclude from career briefs |
| `expanded` | No | Initially unfolded selection |
| `archived` | No | Move behind Experience View More |
| `published` | No | Set false to hide |

Minimal new role:

```json
{
  "id": "platform-engineer",
  "company": "Example Company",
  "role": "Platform Engineer",
  "period": "January 2025 - Present",
  "dateTime": "2025-01",
  "summary": "Platform reliability, deployment automation, and developer tooling.",
  "description": [
    "Owned deployment workflows and production reliability.",
    "Built internal tooling for engineering teams."
  ],
  "expanded": false
}
```

Use a consistent chronological order; English order is authoritative for every language.

### Formal Education and Continuing Education

A school in `education.items` requires `id`, `institution`, `degree`, `period`, and `details`. It also accepts `published` and `archived`.

```json
{
  "id": "example-university",
  "institution": "Example University",
  "degree": "B.Sc. in Computer Science",
  "period": "2020 - 2024",
  "details": ["GPA: 3.8"]
}
```

Every English school ID needs a matching entry in `site.json` → `educationLogos`, including unpublished schools:

```json
"educationLogos": {
  "example-university": "/media/logos/example-university.png"
}
```

A credential in `education.certifications` requires `id`, `issuer`, `date`, `title`, `skills`, and an HTTP(S) `url`:

```json
{
  "id": "cloud-foundations",
  "issuer": "Example Provider",
  "date": "Issued Jan 2026",
  "title": "Cloud Foundations",
  "skills": "Cloud Architecture · Infrastructure",
  "url": "https://example.com/credential"
}
```

Use `formalEducation.published` and `continuingEducation.published` to control the groups independently. The shared full-ledger destination is `continuingEducationUrl` in site config.

### Projects

Each `projects.items` record requires `id`, `title`, `description`, `tech`, and `featured`. Optional fields are `link`, `github`, `period`, `frontPage`, `frontPageKicker`, `summary`, `expanded`, `affiliation`, `published`, and the placement flags described above.

```json
{
  "id": "example-project",
  "title": "Example Project",
  "period": "2026",
  "link": "https://example.com",
  "github": "https://github.com/your-name/example-project",
  "description": [
    "Built a useful product for a clearly defined audience.",
    "Designed the architecture and automated its regression checks."
  ],
  "tech": ["React", "TypeScript", "PostgreSQL"],
  "featured": true,
  "frontPage": true,
  "frontPageKicker": "WEB PLATFORM",
  "summary": "A concise front-page description.",
  "affiliation": "personal",
  "expanded": false
}
```

Omit `link` or `github` when no real destination exists; the corresponding button disappears. Do not invent repository or demo URLs.

Define affiliation labels once, then reference their keys:

```json
"affiliations": {
  "personal": "Personal Project",
  "omobio": "Omobio",
  "ucsc": "UCSC"
}
```

Set `"affiliation": "personal"` on a project. Unknown affiliation keys fail validation. Labels and assignments can be translated independently.

### Skills

Skills combine two files:

- `site.json` → `skills` supplies ordered domain IDs and representative items.
- `skills.json` → `categories` supplies visible domain labels; `notes` supplies optional domain notes.

Each configured category has a unique `id` and an `items` array. A skill item contains `name` and `icon`; `invertInDark` is optional for dark-mode artwork. The current design displays **names, not icons**. Icon references and helpers remain available for alternative layouts.

Add a matching category label when adding a domain. Hide a domain by hiding its category label; hide only its explanatory note by hiding the corresponding `notes` entry. Update `philosophy`, `note`, and `relatedEcosystem` in `skills.json` for the surrounding copy.

### Blog

Each `blog.posts` record requires:

- `id`, `title`, and `excerpt`
- `date` in `YYYY-MM-DD` format
- `dateLabel` for display
- `readTime` for display
- `link` as an HTTP(S) article URL

Set `published: false` to hide a card. Change the blog home URL in `site.json`; change button and heading wording in `blog.json`.

### Contact and footer

- Contact facts and URLs come from `site.json`; wording comes from `contact.json` and `footer.json`.
- `footer.social` controls labels and which configured social profiles appear in Contact's direct channels. The footer itself contains the brand/copyright and Back to top action.
- `footer.copyright` supports `{year}`; `footer.socialAria` supports `{label}`.
- Contact availability and coupon wording are ordinary authored text, not live availability status.

## 7. Add or translate a language

Each immediate folder under `src/locales/` is discovered automatically as a language. English is required and supplies fallback content and record ordering.

### Create the language

Create `src/locales/si/_meta.json`:

```json
{
  "language": {
    "name": "සිංහල",
    "code": "SI"
  }
}
```

The folder name (`si`) is the actual language identifier. `language.name` and `language.code` are menu labels. With one language, the selector shows its code; with multiple languages, it becomes a menu.

Add only files and keys you want to translate. For example, `src/locales/si/experience.json` can contain just:

```json
{
  "title": "අත්දැකීම්",
  "items": [
    {
      "id": "software-engineer",
      "role": "මෘදුකාංග ඉංජිනේරු"
    }
  ]
}
```

Everything omitted inherits English.

### Translation rules

- Records merge by stable `id`, not array position. English record order remains authoritative.
- Paragraphs, bullets, technology tags, and other non-ID arrays merge by position. Keep their order and length aligned with English.
- A translation cannot introduce a record ID, section file, or key that English does not contain. This catches typos and stale translations early.
- Empty strings fall back to English. Translated strings must preserve English placeholders; otherwise that value falls back.
- URLs may be localized, but must remain valid HTTP(S) URLs.
- Generated static metadata, no-JavaScript content, sitemap, robots, manifest, and `llms.txt` use published English content, not the visitor's selected language.

### Different visibility per language

Flags inherit English unless the translation explicitly overrides them. Hide one role only in Sinhala:

```json
{
  "items": [
    { "id": "software-engineer", "published": false }
  ]
}
```

Hide an English section but restore it in another language by setting the section's `"published": true` there. Its parent group and records must also be published for content to appear.

To hide one translated point while retaining English text fallback:

```json
{
  "items": [
    {
      "id": "software-engineer",
      "description": [
        { "published": false }
      ]
    }
  ]
}
```

Because point arrays merge by position, this hides the first description point for that language only. You can also supply `{ "text": "Translated point", "published": false }`.

During development, the console lists explicitly unpublished paths per language to help diagnose inherited or accidental hiding.

## 8. Change colors and typography

Edit [`src/config/theme.json`](../src/config/theme.json). It contains `light` (Day Newsprint) and `dark` (Night Press) token maps.

Values use raw HSL components:

```json
"primary": "4 70% 42%"
```

Do not wrap values in `hsl()` or use hex colors in this file. Hue must be at most 360; saturation and lightness must be percentages from 0 to 100. `seo.themeColor` in site config is separate and does use a six-digit hex value.

| Tokens | Typical use |
| --- | --- |
| `background`, `foreground` | Page paper and primary ink |
| `card`, `card-foreground` | Raised paper surfaces and their text |
| `popover`, `popover-foreground` | Menus and overlays |
| `primary`, `primary-foreground` | Crimson accents and text on those accents |
| `secondary`, `secondary-foreground` | Secondary paper surfaces |
| `muted`, `muted-foreground` | Subtle surfaces and secondary text |
| `accent`, `accent-foreground` | Highlighted badges and accents |
| `destructive`, `destructive-foreground` | Error/destructive styling |
| `border`, `input`, `ring` | Rules, form outlines, keyboard focus |
| `desk`, `desk-foreground` | Dark surrounding desk and its text |
| `faint` | Quiet metadata and tertiary text |

Set `theme.default` in `site.json` to `system`, `light`, or `dark`. `system` follows the browser/operating-system preference; visitors can still toggle editions.

Fraunces, Newsreader, and IBM Plex Mono are loaded in `index.html`. Typography, layout, print behavior, and the Broadsheet visual rules require code changes and must follow [DESIGN.md](../DESIGN.md) and the [canonical prototype](prototype/broadsheet-prototype.html). Do not replace semantic tokens with hardcoded component colors.

## 9. Replace images, icons, and verification files

### Portrait

1. Add an optimized square portrait under `public/media/profile/`.
2. Set `person.profileImage` to its root-relative path, for example `/media/profile/portrait.jpg`. Use a local portrait with the built-in social-card generator.
3. Update `hero.profileAlt` and profile captions.
4. Keep the image reasonably small; the front-page portrait loads eagerly and is important to initial rendering.

The image optimizer does not resize or replace the portrait itself.

### Education logos

For a configured path such as `/media/logos/school.png`:

- Original source: `media-src/logos/school.png`
- Generated public output: `public/media/logos/school.png`
- Config mapping: `educationLogos.<school-id>`

Keep original sources in `media-src/`; do not treat them as duplicate temporary files. Local logos are resized to fit within 132×132 pixels without enlargement. Remote HTTP(S) logo paths are allowed by config but are not processed by the local image optimizer.

### Social card and image generation

Run:

```sh
bun run optimize:images
```

This command:

- regenerates configured local education logos;
- creates a 1200×630 social card at `seo.shareImage`;
- uses the configured portrait, light theme colors, and `public/favicon.svg` as social-card inputs.

It also runs automatically before production builds. If you need different social artwork, change `scripts/optimize-images.ts` or its inputs rather than repeatedly hand-editing generated output.

### Skill and social icons

- Local assets belong under `public/media/icons/` and use root-relative paths.
- Skill icon config accepts `devicon:<path>`, a local path, or an HTTP(S) URL. The current Skills layout displays names only.
- Social brand icons are selected by `platform` through the internal brand registry. Adding a new built-in platform requires a code/registry change and schema support where applicable.

### Favicons and verification material

Replace `public/favicon.svg`, `public/favicon.ico`, and the raster icon variants together when rebranding. Preserve their paths, or update `index.html` and relevant generators together.

Replace inherited search-engine verification tags and the IndexNow key with your own provider-issued material. Do not copy another site's verification token. Keep generated robots, sitemap, manifest, `llms.txt`, and `404.html`; they are production assets, not temporary output.

## 10. Understand generated files

`scripts/site-files.ts` and `scripts/search-content.ts` use site settings and published English locale content to generate:

| Output | Purpose |
| --- | --- |
| Served/built `index.html` | Canonical/search/social metadata, JSON-LD, and readable no-JavaScript fallback |
| `public/sitemap.xml` | Canonical homepage entry |
| `public/robots.txt` | Crawler rules and sitemap location |
| `public/site.webmanifest` | Site names, colors, and icon references |
| `public/llms.txt` | Concise portfolio summary and links |
| `public/404.html` | Localized noindex static error document |

The comments `generated:metadata` and `generated:content` in `index.html` are generation markers; preserve them.

During development and production builds, change config/locale inputs or generator code and let the generator update outputs. Never hand-edit generated HTML fallback or public search files. The initial readable HTML is replaced by React at startup; this is static fallback injection, not server-side rendering or hydration.

The manifest does not add offline support. Metadata, sitemap submission, and crawler permissions help discovery but do not guarantee indexing or ranking.

## 11. Check your changes

Run these commands from the repository root:

```sh
bun run lint
bun run test
bun run build
```

Use `bun run test:watch` while developing. Use `bun run preview` only after a production build to inspect that build locally. In Lovable's managed workspace, automatic compilation/type-check results are available instead of manually invoking those checks.

### Content review checklist

- [ ] The configured name, title, email, location, résumé, site URL, and social links are yours.
- [ ] Biography, roles, schools, credentials, projects, articles, and summaries contain no leftover sample facts.
- [ ] Every record ID is unique and every school ID has a logo mapping.
- [ ] Every project/credential/article URL is real and intentionally published.
- [ ] Section order, hidden content, front-page briefs, initial expansion, and View More behavior match your choices.
- [ ] Every additional language has the intended translations and independent flags.
- [ ] Placeholders remain intact and positional point arrays stay aligned.
- [ ] Portrait, logos, favicons, social card, and verification material have been replaced.
- [ ] Desktop, mobile, light, and dark editions remain readable.
- [ ] Generated metadata and search files reflect published English content.

Also exercise navigation, mobile menu, individual and global fold/unfold controls, project filters, View More/Show Less, front-page jumps, contact actions, and the error page. See [Deployment](deployment.md) for production HTTP and indexing checks.

## 12. Troubleshooting and release checklist

### Common problems

| Symptom | What to check |
| --- | --- |
| A locale/configuration error stops the page | JSON syntax, required fields, URLs, HSL format/ranges, unique IDs, and the exact validation path in the message |
| A translation key or ID is rejected | Add the key/record to English first; translations may only override existing English structure |
| Translated text unexpectedly remains English | Missing/empty value, changed placeholders, invalid URL, wrong record ID, or misaligned positional array |
| Content is hidden in only one language | That language's flags and inherited English section/group/item flags; check the development console's hidden-path list |
| A whole section disappeared | Its top-level `published` flag, membership in `site.json` → `sections`, group flags, and whether any records remain visible |
| A school logo is missing | Matching school ID in `educationLogos`, configured `/media/` path, and original file under `media-src/` |
| A View More button is absent | Experience/Education/CE require at least one `archived: true`; Projects require at least one `featured: false` |
| A project is missing from the front page | Explicit `frontPage: true` selections take priority; otherwise only up to two featured projects are chosen |
| A project affiliation fails validation | Add its key to `projects.affiliations` or correct the record's `affiliation` value |
| A social profile still appears | Check both `site.json` → `social` and the matching visible `footer.social` label |
| Generated content looks stale | Edit inputs rather than outputs, regenerate through dev/build, then check the deployed release and host cache |
| Email does not send from the site | Expected: the button opens an email client; there is no server-side email submission |
| Unknown deployed URLs return HTTP 200 | Fix host rewrites/fallbacks so unmatched paths return a real 404; see the deployment guide |

### Before publishing

1. Complete the content review above and run lint, tests, and a production build.
2. Preview the built site and test the important interactions on desktop and mobile.
3. Set the production `siteUrl` and confirm canonical/social URLs.
4. Deploy using your hosting workflow and verify the actual production origin.
5. Check `/`, `/index.html`, an unknown path, generated public files, images, and outbound links.
6. Submit the sitemap through your own search-engine accounts if desired.

For contribution rules, see [CONTRIBUTING.md](../CONTRIBUTING.md). For security reporting and private-data guidance, see [SECURITY.md](../SECURITY.md).
