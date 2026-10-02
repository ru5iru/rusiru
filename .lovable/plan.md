# Make the portfolio a fully configurable template

Goal: anyone can copy the project, edit a few config files, and get their own portfolio — no code changes needed. Then polish quality across the board.

## 1. Config structure

```text
src/config/
  site.json        identity: name, initials, email, site URL, location, social links, SEO keywords, theme default
  content.json     language-neutral data: experience, education, projects, skills (with icon refs), blog posts (urls, dates)
  theme.json       brand colors (light/dark), fonts, radius — mapped into CSS variables at startup
src/locales/
  en.json          all wording only (headings, labels, descriptions, bullets) keyed to IDs in content.json
public/media/      profile photo, logos, skill icons, favicons, og image — referenced by path from config
```

- Wording lives in locale files; facts (URLs, dates, image paths, tech names) live in `site.json`/`content.json`. Adding `si.json` translates everything.
- Images: move all imported assets to `public/media/` and reference them by path in config, so swapping a photo = replacing a file or changing a path.
- Sections can be toggled and reordered from `site.json` (`sections: ["about","experience",...]`).
- Social links: list of `{ platform, url }`; icons resolved from a built-in brand icon set, with optional custom icon path.
- Skill icons: either local path or remote URL in config.

## 2. Generated SEO files
A build-time script reads `site.json` + `content.json` + `en.json` and generates: `index.html` meta/JSON-LD/static fallback content, `sitemap.xml`, `robots.txt`, `llms.txt`, `site.webmanifest`. Removes the 30 KB of hand-written duplicated content in `index.html` and fixes the incomplete prerender issue by rendering the actual section HTML into the page at build time.

## 3. Quality improvements
- Performance: profile photo and logos converted to WebP at correct sizes; keep lazy loading.
- Type-safe config with validation (clear error if a field is missing).
- Accessibility: consistent alt text from config, contrast check on hero/light mode, focus states.
- Remove unused UI components and dead code; small tests for config loading and locale fallback (missing key falls back to English).
- `README.md` "Use this template" guide: which file to edit for what, how to add a language, how to change photo/colors.

## 4. Verification
Build check, browser screenshots desktop/mobile in light/dark, confirm no hardcoded personal data remains (search for name/email/URLs outside config).

## Technical notes
- Theme tokens injected as CSS variables from `theme.json`; Tailwind keeps using semantic tokens.
- Prerender via a Vite plugin using `react-dom/server` on the home page at build time.
- Your current content and look stay identical; only where it's stored changes.
