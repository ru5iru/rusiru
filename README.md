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
| All wording: hero, about, experience, education, projects, blog posts, contact, footer, 404 | `src/locales/en.json` |
| Images (profile photo, logos, icons) | `public/media/` |
| Favicons | `public/*.png`, `public/favicon.ico` |

## Add a language
Copy `src/locales/en.json` to e.g. `si.json`, translate the values, and set `language.name`/`language.code`. It appears in the language menu automatically. In About paragraphs, `**text**` is bold and `==text==` is highlighted.

## Generated files
`sitemap.xml`, `robots.txt`, `site.webmanifest`, and `llms.txt` are regenerated from settings and English copy. Vite injects matching metadata, JSON-LD and full readable no-JavaScript section content into the served HTML; do not hand-edit generated content. This is static content generation, not React server rendering or hydration. Settings and English edits also regenerate files during development. Sitemap lastmod is omitted because a reliable publication timestamp is not configured.

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

The profile photo is optimized at 448px. Keep the eager hero image small when replacing it. Fonts and adding new section types still require code changes; project/blog links currently remain in the English locale. Those broader historical template promises are not implemented.

## Release and maintenance

Publish from this project's Lovable Publish dialog. Public site URL comes from `site.json`. This change does not publish automatically. After publishing, verify the homepage, an unknown URL, resume/blog links and generated search files on the public origin. Use Lovable version history to review a previous version before republishing a rollback; a production rollback has not been exercised.

CI runs a frozen installation, lint, behavioral tests and production compilation. Ownership, DNS/TLS access, response contacts, cache/security-header policy and production monitoring require the project owner's decisions. No analytics or contact form is added without a product decision.

Repository documentation: [setup, architecture, code guide, and operations](docs/README.md). The audit's remediation section supersedes older baseline findings.
