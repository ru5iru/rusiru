# Getting started

Purpose: run and check the website locally. Intended reader: a developer with a fresh checkout.

Last verified against commit `0d6ea67e368badc5e2d52b7c601ea167c6be6208` on 2026-10-17.

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
| Content and outbound URLs | [en.json](../src/locales/en.json) | Most visible copy, resume, project/blog/contact links |
| Canonical origin | [index.html](../index.html), [Index](../src/pages/Index.tsx), [NotFound](../src/pages/NotFound.tsx), [robots](../public/robots.txt), [sitemap](../public/sitemap.xml) | Hardcoded public origin; not an env switch |
| Language persistence | [i18n](../src/i18n/i18n.tsx):52 | Browser storage key `lang` |
| Theme default | [App](../src/App.tsx):16 | System theme, class-based styling |

## Commands and checks

**[Verified]** Scripts below exist in [package.json](../package.json). Run each separately from the repo root. Build, the single placeholder test, and both TypeScript checks passed after the unlocked local install; lint has three existing errors and eight warnings. Details and limitations are recorded in the [changelog](CHANGELOG.md).

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

**[Verified]** `tsconfig.node.json` includes only `vite.config.ts`, not `vitest.config.ts`. The browser config has `strict: false`; tooling has `strict: true`. The root config uses project references ([root](../tsconfig.json), [app](../tsconfig.app.json), [tooling](../tsconfig.node.json)). No coverage, end-to-end, or deployment script is declared. The only checked-in test asserts `true` ([example test](../src/test/example.test.ts)).

## Debug and smoke-check

Recommended manual procedure, derived from the [page](../src/pages/Index.tsx) and section handlers:

1. Load `/`; confirm the hero, then all seven lower sections appear as you scroll.
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
| New education entry has no logo | Logo lookup is a fixed map | Add the matching ID/import to Education as part of the feature |

Sources: [i18n](../src/i18n/i18n.tsx), [Education](../src/components/sections/Education.tsx), [scroll hook](../src/hooks/useScrollAnimation.ts), [App](../src/App.tsx).

Next: [Architecture](03-architecture.md).
