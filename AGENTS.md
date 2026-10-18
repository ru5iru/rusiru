# Architecture rules

- Personal facts, links, images, skills, section order live in `src/config/site.json`; colors in `src/config/theme.json` — keeps the site a reusable template.
- All user-visible wording lives in `src/locales/<lang>.json` (auto-discovered) — new languages need no code changes.
- Media is served from `public/media/` and referenced by path in config — swapping images needs no imports.
- Social icons resolve via `src/components/icons/BrandIcons.tsx` keyed by platform id — config stays data-only.
- `scripts/site-files.ts` Vite plugin regenerates sitemap/robots/manifest from config — never hand-edit those three files.
