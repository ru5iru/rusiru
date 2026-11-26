# Per-locale publish flags and split locale files

## Goal
Hide or show any section, item, or single bullet point by flipping one flag, without deleting its text, and allow each language to make its own choice (e.g. hide a role in English but keep it in Sinhala).

## 1. Split each language into a folder (chosen approach)
```text
src/locales/
  en/
    _meta.json        language name/code, seo, common, notFound
    nav.json
    hero.json
    about.json
    experience.json
    education.json
    projects.json
    skills.json
    blog.json
    contact.json
    footer.json
  si/                 (future) same file names, any subset
```
- File name = section name. A translation folder can contain only the files it changes; everything missing falls back to English.
- Why a folder over `en-education.json`: one folder per language keeps languages separated, the file names stay identical across languages (easy to diff), and new languages are still added by copying a folder - no code changes.
- Content is not changed, only moved. A one-off script splits the current `en.json` and checks the merged result is identical before deleting the old file.

## 2. The flags
One consistent flag name everywhere: `"published"`. Default is `true`, so it can be left out — only write `"published": false` when hiding something. This keeps files small.

Section level (top of e.g. `experience.json`):
```json
{ "published": true, "title": "...", "items": [ ... ] }
```
Item level:
```json
{ "id": "omobio-se", "published": false, "role": "Software Engineer", ... }
```
Point level - a point can stay a plain sentence, or become an object when it needs a flag:
```json
"description": [
  "Built the billing pipeline...",
  { "text": "Led migration to ...", "published": false }
]
```
Applies to: experience roles + points, education items + detail lines, Continuing Education entries, projects + points + tech tags, blog posts, skill categories/notes, contact/footer social labels, and sections (about, experience, education, projects, skills, blog, contact). Also groups inside a section (Formal Education / Continuing Education) get their own `published`.

## 3. Extra per-item placement flags (optional, same place)
Kept next to the item, defaulting to today's behavior:
- `frontPage`: show in the front-page briefs.
- `featured`: show in the main list, or only after "View More".
- `expanded`: open by default.
- `affiliation` (projects): key into an `affiliations` map in `projects.json`, e.g. `"omobio": "Omobio"`, `"personal": "Personal Project"`, `"ucsc": "UCSC"` - shown as a badge.

## 4. Language-by-language behavior
- Each language's flags win; a missing flag inherits the English value.
- Items are matched across languages by `id` instead of list position, so hiding or reordering in one language never shifts another language's items.
- Points are matched by position (they have no ids); a translation that hides a point writes `{ "published": false }` at that position.
- Search assets (static fallback, JSON-LD, llms.txt, sitemap) are generated from English, so they follow English flags.

## 5. Additional improvements included
- Validation fails early with a clear message for: duplicate item ids, unknown affiliation keys, a translation file with a name English doesn't have, or unknown keys (catches typos like `"publised"`).
- Navigation, section index, front-page briefs, "Unfold All" counts, and jump links skip anything unpublished; a section with every item hidden disappears entirely.
- Dev-only console note listing what is currently hidden per language, so nothing is forgotten.
- README "Publishing content" section with the three examples above.

## Technical details
- `i18n.tsx`: glob `../locales/*/*.json`, assemble `{[file]: content}` per language (`_meta.json` spread at root); `scripts/` load the same way via a shared `loadLocales()` helper.
- `mergeLocale`: arrays of objects with `id` merge by id; others by position; string-or-object points normalized to `{text, published}` before merge.
- New `src/i18n/publish.ts`: `isPublished`, `publishedItems(list)`, `publishedPoints(list)`, `sectionPublished(dict, id)` - used by all section components and `scripts/search-content.ts`.
- `src/i18n/schema.ts` gains optional `published`/`frontPage`/`featured`/`expanded`/`affiliation`; strict objects for flag typos.
- `site.json` keeps only personal facts, links, media, section order.
- Tests: hidden section, hidden item, hidden point, per-locale override vs English, id-based merge, front-page/featured placement, validation errors, search output excludes hidden content. Then lint, build, desktop/mobile browser check that the default site looks unchanged.
- Update `AGENTS.md` locale rule, roadmap, README; commit with the co-author trailer.
