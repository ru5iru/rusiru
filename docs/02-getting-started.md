# Getting started

Purpose: run and check the website locally. Intended reader: a developer with a fresh checkout.

Last verified against commit `e7f95698811156a1fa4a1807fdd6cc2c6e5a5e76` on 2026-10-18.

## Prerequisites and installation

**[Verified]** You need Git, Node.js, npm, and a browser. The repo has no `engines` declaration, Node version file, or required environment sample. Node `v22.22.1` and npm `11.11.1` are the verification environment; this is an observed baseline, not a declared support range. Evidence: [package manifest](../package.json), [lockfile](../package-lock.json).

**[Verified]** `npm ci` currently fails because the npm lockfile is out of sync with the manifest. For local exploration from this repository's root, use this workaround, which leaves tracked lockfiles unchanged:

```powershell
npm install --no-package-lock
npm run dev
```

**[Verified]** The dev server is configured for port `8080` and host `::`; open `http://localhost:8080` and use the actual URL printed by Vite if the port is occupied. Binding to `::` may expose the server beyond loopback, depending on the host. HMR means hot module replacement: source edits update the running page. Its error overlay is disabled, so inspect the terminal and browser console ([vite.config.ts](../vite.config.ts):8).

**[Verified]** This workaround resolves manifest ranges and is not a reproducible locked install. Once maintainers repair the lockfile, use `npm ci` for clean installs. Bun lockfiles also exist; the intended package-manager policy is **[Unknown]**. Do not update all lockfiles incidentally while editing content.

## Environment and configuration

**[Verified]** There are no application `import.meta.env`/`process.env` reads or required API credentials in the inspected source. No `.env` file is needed for the checked-in behavior.

| Setting | Current location | Meaning |
| --- | --- | --- |
| Required environment variables | None found | Static content needs no service credentials |
| Dev port/host | [vite.config.ts](../vite.config.ts) | `8080`, `::` |
| Identity, common URLs, media, skills, section order | [site.json](../src/config/site.json) | Language-neutral config, including resume, contact and blog home |
| Wording and section arrays | [en.json](../src/locales/en.json) | Copy, experience, education, project records and article records/links |
| Canonical origin | [site.json](../src/config/site.json), consumed by [Index](../src/pages/Index.tsx), [NotFound](../src/pages/NotFound.tsx) and [generator](../scripts/site-files.ts) | Runtime metadata and generated files; static HTML/llms text remain separate |
| Color overrides | [theme.json](../src/config/theme.json) | Injected CSS variables for light and dark classes |
| Language persistence | [i18n](../src/i18n/i18n.tsx):52 | Browser storage key `lang` |
| Theme default | [site.json](../src/config/site.json) → `theme.default` | Currently system theme; class-based styling |

**[Verified]** `npm run dev` and both build modes run [siteFilesPlugin](../scripts/site-files.ts), which rewrites `public/sitemap.xml`, `public/robots.txt`, and `public/site.webmanifest` from config. Do not hand-edit those outputs ([AGENTS.md](../AGENTS.md)); change config or the generator. `index.html` and `public/llms.txt` are not generated. Profile/logo/icon replacements go in `public/media/`, referenced by path from config.

## Commands and checks

**[Verified]** Scripts below exist in [package.json](../package.json). Run each separately from the repo root. Build, the single placeholder test, and both TypeScript checks passed on the merged `e7f9569` tree in this session. Lint's previous baseline and any current rerun are distinguished in the [changelog](CHANGELOG.md); local dependencies were installed without updating the stale lockfile.

| Command | Purpose / limit |
| --- | --- |
| `npm run dev` | Interactive development server |
| `npm run build` | Production Vite bundle into `dist/`; not a TypeScript typecheck |
| `npm run build:dev` | Build with development mode and the component tagger |
| `npm run preview` | Serve an already-built bundle locally; use Vite's printed URL |
| `npm test` | Run matching Vitest files once |
| `npm run test:watch` | Keep Vitest running while tests change |
| `npm run lint` | Run ESLint; existing findings are documented |
| `npx --no-install tsc -p tsconfig.app.json` | Check browser source types with installed TypeScript |
| `npx --no-install tsc -p tsconfig.node.json` | Check Vite tooling types |

**[Verified]** `tsconfig.node.json` explicitly includes only `vite.config.ts`; its imported `scripts/site-files.ts` is also checked through that dependency. `vitest.config.ts` is not included. Browser source has `strict: false`; tooling has `strict: true`. The root uses project references ([root](../tsconfig.json), [app](../tsconfig.app.json), [tooling](../tsconfig.node.json)). No coverage, end-to-end, or deployment script is declared. The only checked-in test asserts `true` ([example test](../src/test/example.test.ts)).

## Debug and smoke-check

Recommended manual procedure, derived from the [page](../src/pages/Index.tsx) and section handlers:

1. Load `/`; confirm Hero and the configured lower sections appear in `siteConfig.sections` order (currently all seven).
2. Use View Work, navbar links, and Back to top. Repeat in a narrow viewport with the mobile menu.
3. Expand/collapse experience, education, and projects. Show additional projects, then hide them.
4. Toggle theme and reload. Current content includes only English, so the language control displays EN rather than a language menu.
5. Follow resume/blog/project links only when you intend to leave the local site; Get in Touch invokes the local mail client.
6. Open an arbitrary unmatched path; the app should show its NotFound page and log the path in the console. On a deployed server this requires the SPA fallback described in [operations](08-operations.md).
7. Build and preview; inspect console/network failures, especially lazy chunks and third-party icons/fonts.

## Common problems

| Symptom | Evidence / diagnosis | Action |
| --- | --- | --- |
| Install cannot reach registry or reports `ENOTCACHED` | Dependency fetch fails before app execution | Allow registry access or use a complete approved cache, then retry the install command |
| `npm ci` reports `EUSAGE` and missing dependencies | Manifest/lockfile mismatch observed in this checkout | Use the local workaround above; maintainers should repair the chosen lockfile separately |
| Port 8080 already in use | Vite server port setting | Use printed fallback URL or `npm run dev -- --port 8081` |
| Error appears only in console/terminal | Vite has `hmr.overlay: false` | Read both; do not assume the page has no error |
| Translation key appears literally | `t()` returns the key when no string exists | Fix key and dictionary shape; there is no per-key English fallback |
| A translated list disappears | `tr()` returns an unchecked value; consumers often use `?? []` | Compare new locale against English, including arrays |
| Lower content appears blank | Null Suspense fallback or scroll-reveal opacity | Check failed chunk requests, IntersectionObserver support, and console errors |
| Deep URL works locally but fails after deployment | Client routing needs host fallback | Configure host to serve the app shell for app paths |
| New education entry has no logo | Locale item ID must match `educationLogos` config | Add the ID/path to `site.json` and the file under `public/media/` |
| Config warning appears, followed by rendering failures | Required-field checks only log; JSON casts do not validate runtime shape | Compare config against current fields before use; do not rely on the "fail fast" comment |
| Removed section still has a navigation/skip target | Invalid/empty section config, or Hero's fixed projects target | Use supported section IDs; check all anchors after changing the list |
| Manual sitemap/manifest change disappears | Dev/build generator owns these files | Edit `site.json` or generator behavior instead |

Sources: [i18n](../src/i18n/i18n.tsx), [Education](../src/components/sections/Education.tsx), [scroll hook](../src/hooks/useScrollAnimation.ts), [App](../src/App.tsx).

Next: [Architecture](03-architecture.md).
