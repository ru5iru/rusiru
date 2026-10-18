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
`public/sitemap.xml`, `public/robots.txt` and `public/site.webmanifest` are regenerated from `site.json` on every start/build. Also review the static SEO text in `index.html` and `public/llms.txt`.
