# Engineering Broadsheet portfolio

A configurable portfolio template with a newspaper-inspired layout, light/dark editions, expandable work logs, and per-language content controls. Built with React, TypeScript, Vite, and Tailwind CSS.

## Quick start

Use **Bun 1.3.3** and **Node 22**.

```sh
bun install --frozen-lockfile
bun run dev
```

Open `http://localhost:8080` (or the URL printed by Vite). No API keys or database are required.

## Make it yours

| Change | Edit |
| --- | --- |
| Identity, shared links, section order, skills, and image paths | `src/config/site.json` |
| Light/dark colors | `src/config/theme.json` |
| Wording, work history, education, projects, and blog entries | `src/locales/en/<section>.json` |
| Hide content or change item placement | Flags beside the content in each locale file |
| Portrait, logos, social image, and favicons | `public/media/`, `media-src/`, and `public/favicon*` |

Set `"published": false` to hide a section, record, or point without deleting it. Use `"archived": true` for optional View More in Experience, Education, and Continuing Education; projects use `"featured": false`. Each language can make its own choices.

See the **[full template guide](docs/customization.md)** for setup, configuration references, examples, languages, publishing controls, front-page placement, themes, and media.

## Check your changes

```sh
bun run lint
bun run test
bun run build
```

Search files and readable HTML fallback content are generated from settings and English content; do not edit generated outputs manually.

## Guides and contribution

- [Documentation](docs/README.md) — customization, development, and deployment.
- [Contributing](CONTRIBUTING.md) · [Security](SECURITY.md) · [Changelog](CHANGELOG.md)
- [Architecture rules](AGENTS.md) · [Design system](DESIGN.md) · [Maintenance workflow](SKILL.md)

## Licence

[MIT](LICENCE). Replace the included biography, images, links, and site-verification material when reusing the template. The licence does not grant rights to third-party images, logos, or trademarks; check permissions and retain applicable notices. Dependencies keep their own licences.
