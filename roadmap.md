# Audit remediation

- [x] Validate settings and locale fallback; handle denied storage.
- [x] Fix delayed navigation, theme switching, section targets and mobile focus.
- [x] Fix accordion semantics, clipping and duplicated project rendering; respect reduced motion.
- [x] Generate search content from settings; optimize profile imagery; repair installation/lint.
- [x] Add behavioral tests and verify real desktop/mobile flows.
- [x] Update audit statuses and document external ownership/content blockers.
- [ ] R7: Confirm career/statistical/date wording — blocked on content-owner confirmation.
- [ ] R16/R18: Establish hosting/security/release/monitoring ownership — blocked on owner's operating decisions and access.
- [ ] R17: Decide remaining historical template/contact/language scope — blocked on product-owner decision/content.

# Broadsheet newspaper redesign

- [x] Finalize and commit the interactive Broadsheet HTML prototype (`docs/prototype/broadsheet-prototype.html`).
- [x] Author `DESIGN.md`, `SKILL.md`, `AGENTS.md`, and `docs/11-broadsheet-redesign-spec.md` preserving full config/locale driven architecture.
- [x] Extend `src/config/site.json`, `src/config/theme.json`, `src/config/schema.ts`, `src/locales/en.json`, and `src/i18n/schema.ts` with Broadsheet tokens, Continuing Education records, and adaptability-first skill domain notes.
- [x] Update typography (`Fraunces`, `Newsreader`, `IBM Plex Mono`), print rules, and surfaces in `index.html`, `tailwind.config.ts`, and `src/index.css`.
- [x] Implement the Broadsheet layout across `Index.tsx`, `Navbar.tsx`, `DisclosureRow.tsx`, `Hero.tsx`, `About.tsx`, `Experience.tsx`, `Education.tsx`, `Projects.tsx`, `Skills.tsx`, `Blog.tsx`, `Contact.tsx`, and `Footer.tsx`.
- [x] Update `scripts/search-content.ts` and behavioral tests (`src/test/`), and verify tests, lint, production build, and desktop/mobile interactions.

# SEO audit remediation — 2026-11-22

- [x] Serve a generated, localized static 404 with an actual HTTP 404 for unknown paths; force `/index.html` to redirect permanently to `/`.
- [x] Establish one owner for homepage and error-page metadata; browser checks confirm one canonical, description, and robots directive per page.
- [x] Add repeatable education-logo optimization and serve 132px high-density variants.
- [x] Add a configured 1200×630 social preview image through the asset/metadata generators.
- [x] Remove unnecessary startup work and enlarge undersized text-action targets without changing the Broadsheet design; only the intentionally hidden skip link remains below 24px.
- [x] Align the confirmed current job title and remove the unverified profile creation date; retain 2023-11-27 only as the professional journey start.
- [x] Correct three verified blog article URLs and the renamed Jira repository; remove two unavailable repository links rather than invent replacements.
- [x] Pass 35 tests, lint, production build, Chromium desktop/mobile checks, corrected outbound links, and Netlify-equivalent HTTP checks.
- [ ] Verify the deployed rusiru.cc responses, social crawlers, and comparative cold-load performance after publication; field Core Web Vitals require real-user production data.
- [ ] Complete account/hosting-owner items: Search Console and Bing inspections, sitemap submission, domain/redirect configuration, backlink and AI-visibility research. No analytics was added.

# SEO verification recheck — 2026-11-22 preview

- [x] Triage the new reviewed findings against current source and distinguish confirmed defects from external or advisory items.
- [x] Use the localized error description for rendered Open Graph and Twitter metadata without changing the Broadsheet design.
- [x] Confirm the reported em-dash mojibake is absent from all six captured social descriptions and current source; leave valid UTF-8 copy unchanged.
- [x] Pass 36 tests, lint, automatic production builds, and Chromium homepage/error-page metadata checks with no browser errors.
- [x] Commit the verified corrections with the requested ru5iru co-author trailer.
- [ ] Recheck unknown-path HTTP status and `/index.html` redirection on rusiru.cc after deployment; the Lovable preview host still uses its own SPA fallback.

# Second preview SEO verification — 2026-11-22

- [x] Confirm the f258fab preview retains deduplicated metadata, corrected direct/client 404 social descriptions, the confirmed job title, optimized logos, social card, robots.txt, and sitemap.
- [x] Disprove the repeated punctuation finding: source, raw HTML, and every captured homepage social description contain the correct em dash (U+2014), with no mojibake; the audit detector is a false positive.
- [x] Confirm the remaining preview unknown-path 200 response is Lovable host fallback behavior, not a regression in the Netlify rules already verified locally.
- [x] Deploy the current build to rusiru.cc: production now serves `index-0pHDVQ0C.js`, real static 404 responses, the `/index.html` permanent redirect, and the advertised PNG social card.
- [ ] Repeat controlled production performance, social-crawler, structured-data, Search Console, and Bing checks; laboratory LCP samples are not field-Core-Web-Vitals verdicts.

# Production SEO verification — 2026-11-23

- [x] Verify production 404s, canonical/index.html redirects, deduplicated metadata, error-page social descriptions, structured identity, optimized logos, social image, robots.txt, and sitemap.
- [x] Disprove the repeated homepage punctuation finding: source, raw UTF-8 HTML, and all captured homepage OG/Twitter descriptions contain the correct em dash (U+2014), not mojibake.
- [x] Check all 19 configured external destinations: 16 return HTTP 200; LinkedIn returns 999 and Reddit returns 403 to automated requests, so those three require manual browser review rather than destructive link changes.
- [ ] If the DNS/hosting provider permits it, redirect HTTP www directly to HTTPS apex instead of through HTTPS www; canonicalization already works and no loop exists.
- [ ] Obtain Search Console/Bing indexing evidence and field LCP/INP/CLS data; current unthrottled desktop LCP samples vary from 1.100s to 6.036s and cannot establish a code regression or field-CWV failure.

# Codebase cleanup — 2026-11-23

- [x] Remove generated audit output, local caches, unused source/UI/hooks, dead styles, and orphaned packages without behavior changes.
- [x] Update documentation, verify tests/lint/build/browser flows, and commit with the ru5iru co-author trailer.
