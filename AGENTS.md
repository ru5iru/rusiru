# Architecture rules

- Personal facts, links, images, skills, section order live in `src/config/site.json`; colors in `src/config/theme.json` — keeps the site a reusable template.
- All user-visible wording lives in `src/locales/<lang>.json` (auto-discovered) — new languages need no code changes.
- Media is served from `public/media/` and referenced by path in config — swapping images needs no imports.
- Social icons resolve via `src/components/icons/BrandIcons.tsx` keyed by platform id — config stays data-only.
- `scripts/site-files.ts` owns sitemap/robots/manifest/llms generation and HTML metadata/static fallback injection via `scripts/search-content.ts` — a shared input prevents visible/search content drift; never hand-edit outputs.
- Validate settings with `src/config/schema.ts` before runtime and generation; invalid section IDs/URLs must fail early instead of yielding broken links.
- Locale fallback merges each key and array position with English; translations retain English array order to keep content identities stable.
- Expandable section rows use the shared Radix Collapsible wrapper; measured content height and separate outbound links prevent clipping and nested controls.
- Navigation waits for lazy section targets and observes their insertion; mobile navigation uses a Radix modal to manage keyboard focus.
- Bun and the text `bun.lock` are authoritative; frozen installs prevent multiple package managers from drifting.
- Shared shadcn variant/helper exports and the brand icon registry are intentional lint Fast Refresh exemptions; keep other feature modules component-only.
- Each lazy section has its own loading state/error boundary; unused query/toast providers are not mounted on this static portfolio.
