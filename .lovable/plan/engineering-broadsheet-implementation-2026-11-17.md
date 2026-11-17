# Engineering Broadsheet implementation

1. Extend validated site, theme, and locale data with newsprint tokens, newspaper wording, five Continuing Education records, and adaptability-first skill notes; remove legacy stat content and About emojis.
2. Replace legacy visual treatments with the canonical typography, desk/newsprint surfaces, print rules, engraving portrait, coupon, and dossier-flash primitives.
3. Rebuild the masthead, utility/index navigation, front-page newspaper grid, and all configured sections while preserving lazy loading and configuration-driven section order.
4. Add coordinated disclosure state, section/global unfold controls, project filtering, and lazy-safe jump-and-unfold events.
5. Synchronize generated search fallback and `llms.txt`, expand behavioral tests, and verify tests, lint, production build, and desktop/mobile interactions.
6. Update the roadmap and project memory, then commit the completed redesign with Conventional Commit messages.

## Technical notes

- Keep all wording in locale JSON and all personal links/assets in site configuration.
- Use semantic HSL tokens, including extended desk/faint colors, without hardcoded component colors.
- Keep generated SEO outputs owned by the existing generator pipeline.
- Preserve accessible Radix Collapsible and Dialog behavior with independent outbound links.
