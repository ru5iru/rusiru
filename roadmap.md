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
