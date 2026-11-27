# Contributing

Thanks for helping improve this portfolio template. Keep changes focused and
preserve existing behavior unless the change explicitly requires otherwise.

## Before starting

- Read [README.md](README.md) and the relevant [guide](docs/README.md), and
  [AGENTS.md](AGENTS.md) for architecture rules.
- For visual work, read [DESIGN.md](DESIGN.md), [SKILL.md](SKILL.md), and the
  [canonical prototype](docs/prototype/broadsheet-prototype.html).
- Search existing issues and pull requests before opening a duplicate. Discuss
  major structural or design changes in an issue first.
- Use [SECURITY.md](SECURITY.md), not a public issue, for vulnerabilities.

## Local setup

Fork the repository, clone your fork, and keep the original as `upstream`:

```sh
git clone https://github.com/<your-name>/<repo>.git
cd <repo>
git remote add upstream https://github.com/<original-owner>/<repo>.git
```

Use Node 22 and Bun 1.3.3, matching the existing CI workflow.

```sh
bun install --frozen-lockfile
bun run dev
```

Use Bun only and commit `bun.lock` when dependencies change. Do not add npm,
Yarn, pnpm, or binary Bun lockfiles. This static portfolio does not require a
database or private API keys for local development.

## Making changes

- Identity, shared links, media paths, skills, and section order belong in
  `src/config/site.json`; theme colors belong in `src/config/theme.json`.
- Site wording and publication/placement flags belong in locale section files.
  Keep record IDs stable; translations inherit missing English values.
- Keep schema validation and shared generators aligned with configuration
  changes. Do not manually edit generated HTML/search/manifest files.
- Keep imagery under `public/media/`. Use the existing image optimization
  command when changing profile or education imagery.
- Preserve keyboard navigation, disclosure behavior, reduced-motion support,
  both themes, and narrow-screen layouts.
- Add behavioral regression tests for changed rules or bugs. Do not substitute
  styling snapshots for behavior tests.
- Do not commit credentials, personal browser sessions, dependencies, temporary
  files, build output, or test reports. Replace personal content when reusing
  the template; do not invent facts about the portfolio owner.

## Validation

```sh
bun run lint
bun run test
bun run build
```

CI runs a frozen install and these checks. For UI changes, also exercise the
affected flow in a browser on desktop and mobile, with keyboard input and both
themes. For publication changes, check that hidden content is absent from the
page, navigation, and generated search content. Document anything not verified.
In Lovable's managed workspace, review automatic compilation and type checks
instead of manually running a build or typecheck.

## Pull requests

- Describe the problem, scope, and result; link an issue when relevant.
- Include test results and screenshots for visual changes. Redact personal or
  confidential information.
- Update [CHANGELOG.md](CHANGELOG.md) under Unreleased for notable changes and
  update the relevant guide in `docs/`. Keep the README concise and describe
  current use rather than retaining audit histories or verification reports.
  Record new structural rules in `AGENTS.md`; update `SKILL.md` if the maintenance
  workflow changes.
- Use Conventional Commit subjects, for example `fix: preserve archived role
  navigation` or `docs: clarify template setup`.
- Include `Co-Authored-By: ru5iru <92708089+ru5iru@users.noreply.github.com>`
  in commit trailers.
- Keep contributions respectful and constructive. Review is not a guarantee
  of acceptance or a release date.

## Licence

By submitting a contribution, you agree that your contribution may be
distributed under the project's [MIT licence](LICENCE). Submit only material
you have permission to contribute and retain applicable third-party notices.