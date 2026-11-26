# Portfolio template

Make it yours by editing config files only — no code changes needed.

| What | Where |
|------|-------|
| Name, email, site URL, location, resume link, page title/description | `src/config/site.json` |
| Social links (`platform`: linkedin, github, discord, facebook, x, reddit, blog, spotify — or add `icon` path for others) | `site.json` → `social` |
| Which sections show and in what order | `site.json` → `sections` |
| Skills + icons (`devicon:<path>` or `/media/...` or any URL; `invertInDark` for dark logos) | `site.json` → `skills` |
| Education logos (keyed by education item `id`) | `site.json` → `educationLogos` |
| Brand colors (HSL) for light/dark | `src/config/theme.json` |
| All wording: hero, about, experience, education, projects, blog posts, contact, footer, 404 | `src/locales/en/<section>.json` |
| Images (profile photo, logos, icons) and social card path | `public/media/` and `site.json` → `seo.shareImage` |
| Social image alternative text | `src/locales/en/_meta.json` → `seo.shareImageAlt` |
| Favicons | `public/favicon.svg` is the custom vector icon; `public/*.png` and `public/favicon.ico` provide raster fallbacks |

## Add a language
Create a folder next to `src/locales/en/` (e.g. `src/locales/si/`) with `_meta.json` setting `language.name`/`language.code`, plus only the section files you translate. Anything missing falls back to English, and records are matched by `id`. It appears in the language menu automatically. In About paragraphs, `**text**` is bold and `==text==` is highlighted.

## Publishing content

Hide anything without deleting it by adding `"published": false` (default is `true`, so leave it out otherwise). Flags live in each language's files, so English and another language can differ; a translation that does not set a flag inherits the English one.

| Hide | Where | Example |
| --- | --- | --- |
| A section | top of the section file | `experience.json`: `"published": false` |
| Formal / Continuing Education | `education.json` | `"continuingEducation": { "published": false }` |
| A role, project, school, course, post | the item | `{ "id": "software-engineer", "published": false, ... }` |
| One bullet point or tech tag | replace the sentence | `{ "text": "Led the migration…", "published": false }` |
| A skill category or social link | label map | `"reddit": { "text": "Reddit", "published": false }` |

Other item flags: `expanded` (open by default), `frontPage` (appears in the front-page briefs), `featured` (projects: main list vs "View More"), and `affiliation` (projects: a key of `projects.affiliations`, e.g. `"omobio"`, `"personal"`, `"ucsc"`, shown as a badge). A section whose items are all hidden disappears from the page and navigation. Misspelled flags, duplicate ids, unknown affiliations, and translation ids English lacks stop the build with a clear message. In development the browser console lists what each language currently hides.

Hide a role only in Sinhala (`src/locales/si/experience.json`):

```json
{ "items": [{ "id": "software-engineer", "published": false }] }
```

## Generated files
`sitemap.xml`, `robots.txt`, `site.webmanifest`, `llms.txt`, and the localized `404.html` are regenerated from settings and English copy. Vite injects matching metadata, JSON-LD, social image tags, and full readable no-JavaScript section content into the served HTML; do not hand-edit generated content. This is static content generation, not React server rendering or hydration. Settings and English edits also regenerate files during development. Sitemap lastmod and ProfilePage dateCreated are omitted because reliable publication timestamps are not configured. Netlify serves `404.html` with an actual HTTP 404 for unknown paths and permanently redirects `/index.html` to the canonical root.

## Development

Bun 1.3.3 is the authoritative package manager; commit `bun.lock`. Node 22 is supported for tooling. Do not reintroduce competing npm/binary Bun lockfiles.

```sh
bun install --frozen-lockfile
bun run dev
bun run lint
bun run test
bun run build
```

Settings reject invalid required fields, unsafe URLs, duplicate/unsupported section IDs and malformed HSL values. Use supported IDs from the current section list. An empty section list is supported. Incomplete translations fall back to English, including malformed values and missing placeholders; keep arrays in the same order and length as English.

The profile photo is optimized at 448px. Keep the eager hero image small when replacing it. Put original education logos at `media-src/logos/` using the same filenames configured under `site.json` → `educationLogos`; `bun run optimize:images` resizes them to at most 132px for high-density 44px display and regenerates the 1200×630 social card from the configured portrait, theme, and custom monogram. This command also runs automatically before production builds. Fonts and adding new section types still require code changes; project/blog links currently remain in the English locale. Those broader historical template promises are not implemented.

## Release and maintenance

Publish from this project's Lovable Publish dialog. Public site URL comes from `site.json`. This change does not publish automatically. After publishing, verify the homepage, an unknown URL, resume/blog links and generated search files on the public origin. Use Lovable version history to review a previous version before republishing a rollback; a production rollback has not been exercised.

CI runs a frozen installation, lint, behavioral tests and production compilation. Ownership, DNS/TLS access, response contacts, cache/security-header policy and production monitoring require the project owner's decisions. No analytics or contact form is added without a product decision.

Repository documentation: [setup, architecture, code guide, and operations](docs/README.md). The audit's remediation section supersedes older baseline findings.

### View More (optional)

Experience roles, formal education, and Continuing Education credentials support `"archived": true` on any item. Archived items stay published (and in search output) but sit behind a "View More" button; the button only appears when at least one item in that list is archived. Labels: `experience.viewMore`/`showLess`, `education.viewMoreEducation`/`viewMoreCertifications`/`showLess`. Projects keep using `featured`.
