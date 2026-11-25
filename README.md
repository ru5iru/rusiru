# Portfolio template

Make it yours by editing config files only — no code changes needed.

| What | Where |
|------|-------|
| Name, email, site URL, location, resume link, page title/description | `src/config/site.json` |
| Social links (`platform`: linkedin, github, discord, facebook, x, reddit, blog, spotify — or add `icon` path for others) | `site.json` → `social` |
| Which sections show and in what order | `site.json` → `sections` |
| Section visibility, entry visibility/placement/expansion, page controls | `site.json` → `display` |
| Project association labels | `en.json` → `projects.affiliations`; assigned in `site.json` → `display.items.projects.<id>.affiliation` |
| Skills + icons (`devicon:<path>` or `/media/...` or any URL; `invertInDark` for dark logos) | `site.json` → `skills` |
| Education logos (keyed by education item `id`) | `site.json` → `educationLogos` |
| Brand colors (HSL) for light/dark | `src/config/theme.json` |
| All wording: hero, about, experience, education, projects, blog posts, contact, footer, 404 | `src/locales/en.json` |
| Images (profile photo, logos, icons) and social card path | `public/media/` and `site.json` → `seo.shareImage` |
| Social image alternative text | `src/locales/en.json` → `seo.shareImageAlt` |
| Favicons | `public/favicon.svg` is the custom vector icon; `public/*.png` and `public/favicon.ico` provide raster fallbacks |

## Add a language
Copy `src/locales/en.json` to e.g. `si.json`, translate the values, and set `language.name`/`language.code`. It appears in the language menu automatically. In About paragraphs, `**text**` is bold and `==text==` is highlighted.

## Publication controls

Keep `sections` as the ordered list of sections. Set `display.sections.projects` (or another section ID) to `false` to hide that section, its navigation link, and any front-page references. Removing an ID from `sections` also hides it. Formal Education and CE can be switched independently under `display.groups`.

Every experience, education, CE, project, and blog record has a stable `id` in the locale. Matching settings live in `display.items.experience`, `.education`, `.certifications`, `.projects`, or `.blog`:

```json
"jira": {
  "visible": true,
  "featured": true,
  "frontPage": true,
  "expanded": true,
  "affiliation": ""
}
```

- `visible: false` excludes the record from section lists, front-page entries, archive controls, generated readable HTML, structured record data, and `llms.txt`.
- `featured: true` displays it in the initial section list; `false` puts it behind **View More** / **All Works**. Archive entries remain available to search engines because visitors can reveal them.
- `frontPage: true` adds a brief to the front-page index, independently of `featured`. Selecting an archived brief reveals the correct full entry. There is no hardcoded two-project limit.
- `expanded` controls the initial and global-reset fold state for Experience and Projects; it has no effect on non-collapsible entries. Section Fold restores the first configured expanded entry; global Fold restores all configured defaults.
- `affiliation` is a label key for Projects, not a fixed category. Set it to `omobio`, `personal`, `ucsc`, or add another key to `projects.affiliations` in the locale. Empty means no affiliation label. Current affiliations are deliberately unassigned rather than guessed.

`display.frontPage` controls career/projects/education/CE/blog briefs, portrait, biography, View Work, and Resume independently. Blog briefs are disabled by default. A parent section/group switch always wins over item switches. CE retains its summary card and can also show individually selected credentials. Columns expand when sidebars are hidden.

`display.chrome` controls the banner, footer, Back to Top, theme/language selectors, and global unfolding. Individual skill domains, skill entries, and social profiles each have a `visible` switch in their existing config arrays. Wording, links, dates, images, colours, and section/record order remain editable in the existing config/locale files.

To add a record, add its locale entry with a unique `id` and matching publication settings. Remove both when deleting it. Missing/unknown/duplicate IDs, unknown affiliation keys, unsafe URLs, and malformed switches fail validation. Preserve IDs and array order in translations. Visibility is publication control, **not secrecy**: bundled locale data can still be inspected, and manually authored biography/summary prose must be edited separately if it mentions a hidden item.

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
