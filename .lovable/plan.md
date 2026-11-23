# Codebase cleanup plan

## Goal

Remove generated audit evidence, temporary files, unused template code, orphaned dependencies, and dead styles without changing the portfolio’s content, appearance, behavior, routes, or generated search assets.

The import trace found **177 tracked deletion candidates**. The confirmed `output/` cleanup accounts for 124 files (4.28 MiB); 47 of 49 `src/components/ui/` files are unused.

## 1. Establish a behavior baseline

- Run the existing 36-test suite and lint before editing.
- Capture desktop and mobile browser references for the homepage and error page.
- Exercise theme switching, desktop/mobile navigation, section jumps, Experience and Projects fold/unfold controls, project filters/View More, direct and client-side 404 navigation, and outbound-link rendering.
- Record current generated-file status so cleanup can be distinguished from generator output changes.

## 2. Remove generated evidence and local temporary artifacts

- Delete the entire confirmed `output/` directory: audit scripts, CSV/JSON/HTML reports, ZIP archives, captured HTML, screenshots, and evidence.
- Remove ignored local caches: `.oj-cache/`, `tsconfig.app.tsbuildinfo`, and `tsconfig.node.tsbuildinfo`.
- Do not delete source regression tests, canonical documentation, or generated production assets.
- Keep future verification artifacts outside the repository; do not modify the platform-managed `.gitignore`.

## 3. Prune unreachable source files

Delete files absent from both the application and meaningful test import graphs:

- `src/App.css` — unimported Vite starter stylesheet.
- `src/components/NavLink.tsx` — unused router adapter; Navbar uses section anchors.
- `src/hooks/use-mobile.tsx`, `src/hooks/use-toast.ts`, and `src/hooks/useScrollAnimation.ts` — no application consumers.
- 47 unused files under `src/components/ui/`; retain only `button.tsx` and `dropdown-menu.tsx`.
- `src/test/example.test.ts` — placeholder assertion only.
- Remove the sole `useScrollAnimation` test block and import from `src/test/audit.test.tsx`; preserve all tests covering live application behavior.

Keep `src/vite-env.d.ts`, `components.json`, all section components, all other tests, and the direct Radix Dialog/Collapsible implementations.

## 4. Remove dead styling without visual changes

- Delete unused `r-l`, `scrollbar-none`, and custom `text-balance` rules from `src/index.css` after an exact-reference recheck.
- Remove unused legacy keyframes/animation utilities from `tailwind.config.ts` (`accordion`, `fade`, `slide`, `scale`, `bounce-subtle`, and `spin-slow`).
- Reduce Tailwind content scanning to the actual `src` tree; preserve every color token, Broadsheet primitive, disclosure animation, print rule, and used animation.
- Prune deleted component names from ESLint’s Fast Refresh export exceptions, retaining `buttonVariants` and `brandIcons`.

## 5. Remove orphaned packages through Bun

Use `bun remove` so `package.json` and `bun.lock` stay synchronized; never edit the lockfile directly.

- Remove 23 unused Radix packages: accordion, alert-dialog, aspect-ratio, avatar, checkbox, context-menu, hover-card, label, menubar, navigation-menu, popover, progress, radio-group, scroll-area, select, separator, slider, switch, tabs, toast, toggle, toggle-group, and tooltip.
- Remove 12 other unused runtime packages: `@hookform/resolvers`, `react-hook-form`, `@tanstack/react-query`, `cmdk`, `date-fns`, `embla-carousel-react`, `input-otp`, `react-day-picker`, `react-resizable-panels`, `recharts`, `sonner`, and `vaul`.
- Remove unused `@tailwindcss/typography`.
- Preserve the four used Radix packages (Collapsible, Dialog, Dropdown Menu, Slot), all application libraries, test tooling, image tooling, and Lovable platform packages—even where platform packages are loaded externally rather than imported locally.

## 6. Repair documentation references

- Update current architecture, setup, code-guide, data-model, API, glossary, and overview documentation so it no longer describes deleted hooks, UI primitives, the starter stylesheet, or the placeholder test as present.
- Preserve dated audit/history meaning in `docs/CHANGELOG.md` and `docs/09-risks-and-recommendations.md`, but replace links to deleted files with plain historical references.
- Update `roadmap.md` with the completed cleanup and verification results; retain unrelated external hosting/account/field-performance follow-ups.

## Explicitly retained

- `docs/prototype/broadsheet-prototype.html`, `DESIGN.md`, `SKILL.md`, `AGENTS.md`, and archived plans.
- `public/media/profile/profile-photo.webp`, because the canonical prototype references it.
- `media-src/` originals and `scripts/optimize-images.ts`, because prebuild consumes them.
- Generated `public/404.html`, sitemap, robots, manifest, `llms.txt`, favicons, social card, and IndexNow key.
- All configuration, locale content, assets used by the app, CI, deployment settings, and meaningful behavioral/SEO tests.

## Verification and delivery

1. Re-run import/reference scans to prove no retained source imports a deleted module or package.
2. Run lint and the revised suite; expected count is **34 passing tests** after removing only the placeholder and deleted-hook tests.
3. Check the automatic production build result and confirm generated files under `public/` have no unintended differences.
4. Repeat the baseline Chromium flows at desktop and mobile sizes; compare screenshots and computed Broadsheet styling, and confirm no horizontal overflow, browser exceptions, failed assets, or changed metadata.
5. Verify generated sitemap, robots, manifest, `llms.txt`, static 404, social image, and canonical `/index.html` behavior remain intact.
6. Commit in focused Conventional Commit steps (`chore:` for artifacts/dependencies, `refactor:` for dead source/styles, `docs:` for documentation), with the required `Co-Authored-By: ru5iru <92708089+ru5iru@users.noreply.github.com>` trailer on every commit.

No feature, content, design, SEO-generator, hosting, or dependency-upgrade work is included.
