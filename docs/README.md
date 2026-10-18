# Repository documentation

Purpose: orient a new contributor. Intended reader: developers, reviewers, product owners, and operators.

Last verified against commit `0d6ea67e368badc5e2d52b7c601ea167c6be6208` on 2026-10-17.

**[Verified]** This repository implements Rusiru Rathmina's public portfolio as a React single-page application. It presents biography, employment, education, projects, skills, blog previews, and contact links. Content comes primarily from bundled locale JSON; there is no application server or database implementation here. The technologies described in portfolio entries are not necessarily dependencies of this website. Sources: [application routes](../src/App.tsx), [page composition](../src/pages/Index.tsx), [content](../src/locales/en.json).

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
| [03 Architecture](03-architecture.md) | Boundaries, diagrams, three end-to-end flows | Source verified |
| [04 Code guide](04-code-guide.md) | Modules, feature recipe, tests, conventions | Source verified |
| [05 Product guide](05-product-guide.md) | Features, journeys, accessibility, gaps | Code verified; browser usability review pending |
| [06 Data model](06-data-model.md) | Locale entities, browser state, lifecycle | Source verified; conceptual ER diagram |
| [07 API and integrations](07-api-and-integrations.md) | Routes, internal interfaces, external links | Source verified; live external availability unknown |
| [08 Operations](08-operations.md) | Build/release procedure, diagnosis, security | Source verified; hosting configuration unknown |
| [09 Risks and recommendations](09-risks-and-recommendations.md) | Priorities, questions, onboarding checklist | Evidence linked; proposed actions |
| [10 Glossary](10-glossary.md) | Project terminology | Source verified |
| [Changelog and audit](CHANGELOG.md) | Existing-doc inventory, drift, migration actions, verification | Audit baseline |

## Existing material and scope

**[Verified]** [Root README](../README.md) retains its original Lovable workflow. [.lovable/plan.md](../.lovable/plan.md) retains original design intent. [public/llms.txt](../public/llms.txt) is published site content for automated readers, not an onboarding guide. Their disagreements with implementation are recorded in the [audit](CHANGELOG.md).

**[Verified]** All applicable guide topics are included. No files were moved, archived, or deleted. `MIGRATION.md` and `_archive/` are omitted because this is an Update, with no reorganization. SQL migrations, server API examples, queue lifecycles, and an infrastructure deployment diagram do not apply to the checked-in static application. The data model explicitly covers JSON and browser state instead. A release-artifact diagram appears in operations; deployed infrastructure remains **[Unknown]**.

Next: [Overview](01-overview.md).
