# Repository documentation

Purpose: orient a new contributor. Intended reader: developers, reviewers, product owners, and operators.

Last verified against commit `e7f95698811156a1fa4a1807fdd6cc2c6e5a5e76` on 2026-10-18.

**[Verified]** This repository implements a configurable React portfolio template, currently populated with Rusiru Rathmina's biography, employment, education, projects, skills, blog previews, and contact links. Identity, common URLs, section order, skill data, and media paths live in [site.json](../src/config/site.json); color overrides live in [theme.json](../src/config/theme.json); wording and section content arrays live in [locale JSON](../src/locales/en.json). Three public crawler/manifest files are generated during dev/build. There is no application server or database here. The technologies described in portfolio entries are not necessarily dependencies of this website. Sources: [routes](../src/App.tsx), [page composition](../src/pages/Index.tsx), [generator](../scripts/site-files.ts).

## How to read these docs

- New developer: overview → getting started → code guide → architecture → risks.
- Architect/reviewer: architecture → data model → integrations → risks.
- Product/content owner: product guide → data model → glossary.
- Operator: getting started → operations → integrations.

**Evidence convention:** **[Verified]** means inspected in this checkout or observed in a command result, not a production guarantee. **[Inferred]** identifies a conclusion and its basis. **[Unknown]** identifies missing evidence. **[Unverified, from original doc]** preserves historical guidance that the repository cannot establish. Source links point to files at this commit; `file:line` references identify important logic. Recommendations are proposed work, not existing features.

## Documentation status

| Guide | Coverage | Status |
| --- | --- | --- |
| [01 Overview](01-overview.md) | Scope, stack, repository map | Source verified |
| [02 Getting started](02-getting-started.md) | Install, commands, debugging, troubleshooting | Source verified; execution results in changelog |
| [03 Architecture](03-architecture.md) | Config/runtime boundaries, generated files, four end-to-end flows | Source verified |
| [04 Code guide](04-code-guide.md) | Modules, feature recipe, tests, conventions | Source verified |
| [05 Product guide](05-product-guide.md) | Features, journeys, accessibility, gaps | Code verified; browser usability review pending |
| [06 Data model](06-data-model.md) | Locale entities, browser state, lifecycle | Source verified; conceptual ER diagram |
| [07 API and integrations](07-api-and-integrations.md) | Routes, internal interfaces, external links | Source verified; live external availability unknown |
| [08 Operations](08-operations.md) | Build/release procedure, diagnosis, security | Source verified; hosting configuration unknown |
| [09 Risks and recommendations](09-risks-and-recommendations.md) | Priorities, questions, onboarding checklist | Evidence linked; proposed actions |
| [10 Glossary](10-glossary.md) | Project terminology | Source verified |
| [Changelog and audit](CHANGELOG.md) | Existing-doc inventory, drift, migration actions, verification | Audit baseline |
| [Original portfolio plan](_archive/original-portfolio-plan.md) | Restored historical design intent | Historical snapshot; not current behavior |

## Existing material and scope

**[Verified]** [Root README](../README.md) combines the new template guide with older Lovable instructions. [AGENTS.md](../AGENTS.md) defines architecture rules; read it before changing runtime code. The [new template plan](../.lovable/plan/make-the-portfolio-a-fully-configurable-template-2026-10-02.md) includes future work not yet implemented. The deleted original plan is preserved as a [historical snapshot](_archive/original-portfolio-plan.md). [public/llms.txt](../public/llms.txt) remains authored site content for automated readers. Disagreements are recorded in the [audit](CHANGELOG.md).

**[Verified]** All applicable guide topics are included. This Update changes existing guides in place and restores one historical snapshot; no existing document is deleted or moved. `MIGRATION.md` is omitted because there is no reorganization; the changelog records every path action. SQL migrations, server API examples, queue lifecycles, and an infrastructure deployment diagram do not apply to this static application. The data model covers config, locales, and browser state. Operations includes the generator and release-artifact path; deployed infrastructure remains **[Unknown]**.

Next: [Overview](01-overview.md).
