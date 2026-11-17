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
- [ ] Extend `src/config/site.json`, `src/config/theme.json`, `src/config/schema.ts`, `src/locales/en.json`, and `src/i18n/schema.ts` with Broadsheet tokens, Continuing Education records, and adaptability-first skill domain notes.
- [ ] Update typography (`Fraunces`, `Newsreader`, `IBM Plex Mono`), print rules, and surfaces in `index.html`, `tailwind.config.ts`, and `src/index.css`.
- [ ] Implement the Broadsheet layout across `Index.tsx`, `Navbar.tsx`, `DisclosureRow.tsx`, `Hero.tsx`, `About.tsx`, `Experience.tsx`, `Education.tsx`, `Projects.tsx`, `Skills.tsx`, `Blog.tsx`, `Contact.tsx`, and `Footer.tsx`.
- [ ] Update `scripts/search-content.ts` and behavioral tests (`src/test/`), and verify `bun test`, `bun run lint`, and `bun run build`.