# Customize the portfolio

## Identity and section order

Edit [src/config/site.json](../src/config/site.json) for:

- `siteUrl`: your public HTTPS origin, used for canonical URLs and search files.
- `person`: name, job title, email, location, portrait path, and résumé URL.
- `seo`: page title, descriptions, theme color, and social image path.
- `theme.default`: `system`, `light`, or `dark`.
- `blogUrl`, `continuingEducationUrl`, and `contact.secondaryButton`: shared destinations.
- `social`: profile URLs, platform IDs, and optional custom icon paths.
- `skills`: domain IDs and representative skill names.
- `educationLogos`: image paths keyed by school record ID.

`sections` controls the order and inclusion of the lower sections. Supported IDs are `about`, `experience`, `education`, `projects`, `skills`, `blog`, and `contact`; duplicates and unknown IDs are rejected. An empty list is supported. The masthead, editorial banner, and footer remain part of the page shell.

## Content files

English content lives in [src/locales/en/](../src/locales/en/), with one file per section:

| File | Content |
| --- | --- |
| `_meta.json` | Language metadata, social image alt text, common labels, and error-page wording |
| `nav.json` | Masthead, navigation, edition labels, and global controls |
| `hero.json` | Editorial banner, portrait captions, actions, and front-page brief labels |
| `about.json` | Biography paragraphs |
| `experience.json` | Work roles and descriptions |
| `education.json` | Schools, degrees, Continuing Education, and credentials |
| `projects.json` | Project records, affiliations, and filter labels |
| `skills.json` | Domain labels, notes, and adaptability copy |
| `blog.json` | Static article previews and their external links |
| `contact.json`, `footer.json` | Contact copy and social labels |

The portrait and briefs render in About but use wording from `hero.json`; these keys are not unused. About paragraphs support `**bold**` and `==highlight==`, not arbitrary HTML or full Markdown.

Copy an existing record when adding a role, school, credential, project, or article. Give it a unique, stable `id`; preserve that ID in translations. Record-specific URLs and dates belong beside their locale records. Blog previews are authored content, not an automatic feed.

## Hide content without deleting it

`published` defaults to `true`. Put `"published": false` beside the content you want to hide.

| Scope | Location |
| --- | --- |
| Lower section | Top-level property in its section file |
| Work role, school, credential, project, or article | Property on the record |
| Formal Education or Continuing Education | `education.formalEducation.published` or `education.continuingEducation.published` |
| Paragraph, description bullet, education detail, or project tech tag | Replace the string with `{ "text": "…", "published": false }` |
| Skill domain or social profile | Replace its label with `{ "text": "…", "published": false }` in the relevant label map |

For example, in `experience.json`, keep the role's other fields and add:

```json
"published": false
```

Hide one description point while keeping the others:

```json
"description": [
  "A visible contribution.",
  { "text": "A contribution kept for later.", "published": false }
]
```

Social labels live in `footer.social`; domain labels and notes live in `skills.categories` and `skills.notes`. Hiding a category label removes that domain; hiding a note removes only its note. Hiding all records in a record-backed section also removes that section from the page and navigation. Unpublished content is excluded from English-generated search content. These flags control publication, not confidentiality: authored data remains in the repository and bundled locale files.

## Item placement and View More

| Flag | Applies to | Effect |
| --- | --- | --- |
| `expanded` | Experience and Projects | `true` selects initially unfolded rows; if none is `true`, the first row opens (even if all flags are `false`) |
| `frontPage` | Experience | `false` excludes a role from the career briefs |
| `frontPage` | Projects | Explicit `true` selections supply up to two briefs; if none are selected, up to two featured projects are used |
| `frontPageKicker`, `summary` | Projects; `summary` also on Experience | Optional brief wording |
| `featured` | Projects (required) | `true` keeps a project in the initial list; `false` places it behind View More / All Works |
| `archived` | Experience, schools, credentials | `true` places a published item behind its list's View More button |
| `affiliation` | Projects | Displays a label from `projects.affiliations` |

For example, add `"archived": true` to a school to enable Education's View More. Formal Education and Continuing Education have independent buttons. No archive button appears unless that list contains an archived item. Archived records stay published and searchable. Front-page jumps reveal archived roles or additional projects before opening them; global unfolding reveals the work logs.

Button wording is configurable through `experience.viewMore` / `showLess` and `education.viewMoreEducation` / `viewMoreCertifications` / `showLess`.

Define project affiliations in `projects.json`:

```json
"affiliations": {
  "personal": "Personal Project",
  "employer": "Employer",
  "university": "University"
}
```

Then set `"affiliation": "personal"` on a project. Every referenced affiliation must exist. Labels and assignments can differ by language.

## Add a language

Create `src/locales/<code>/`, for example `src/locales/si/`. Add `_meta.json`:

```json
{
  "language": { "name": "සිංහල", "code": "SI" }
}
```

Add only the section files and keys you translate. The folder name is the language identifier; the metadata supplies the menu labels. Languages are discovered automatically, and the selector becomes a menu when more than one exists.

Missing values inherit English. Records merge by `id` and retain English order; paragraph, bullet, and tag arrays merge by position. Keep positional arrays aligned and preserve placeholders such as `{count}`. Unknown record IDs, keys, and file names are rejected. Add new records to English first.

Flags inherit English unless the translation explicitly overrides them. To hide a role only in the new language, put this in its `experience.json`:

```json
{
  "items": [{ "id": "software-engineer", "published": false }]
}
```

Use the actual ID from English. A translation can set `"published": true` to restore a record hidden in English; its section and group must also be published. Generated static search files use English, not the visitor's selected language.

## Colors and media

Edit [src/config/theme.json](../src/config/theme.json) for light/dark HSL values in `H S% L%` format. Token defaults, typography, print rules, and layout are described in [DESIGN.md](../DESIGN.md). Font or layout changes require code changes.

- Put your portrait in `public/media/` and set `person.profileImage`. Use a small, optimized image; the front-page portrait loads eagerly.
- Keep original education logos in `media-src/`, mirroring the configured `/media/` path. For `/media/logos/school.png`, the original is `media-src/logos/school.png`. Every English school ID needs an `educationLogos` entry, including unpublished records.
- Run `bun run optimize:images` after replacing imagery. It resizes education logos to at most 132px and generates a 1200×630 social card from the configured portrait, light theme, and `public/favicon.svg`. It does not optimize or replace the portrait itself.
- The image command runs before production builds. To preserve different social artwork, change the image generator rather than editing its output repeatedly.
- Replace `public/favicon.svg`, `public/favicon.ico`, and the raster icon variants when rebranding. Keep their referenced paths or update the generator and HTML references together.
- Skills currently display names, not icons. Icon configuration (`devicon:<path>`, local path, or HTTP(S) URL) and helpers remain available for alternative layouts.
- Replace inherited site-verification tags and the IndexNow key with your own provider-issued material. Do not delete generated `robots.txt`, sitemap, manifest, `llms.txt`, or `404.html` as temporary files.

Before publishing, follow the [deployment checklist](deployment.md).
