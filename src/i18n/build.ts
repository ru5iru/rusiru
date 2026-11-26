import { mergeLocale, record, type Dict } from './locale';
import { localeSchema, type Locale } from './schema';

/**
 * Turn `<lang>/<section>.json` files into one dictionary per language.
 * `_meta.json` is spread at the root; every other file becomes the key named after it.
 */
export function assembleLocales(files: Record<string, unknown>): Record<string, Dict> {
  const out: Record<string, Dict> = {};
  for (const [file, content] of Object.entries(files)) {
    const match = file.match(/([^/\\]+)[/\\]([^/\\]+)\.json$/);
    if (!match) continue;
    const [, code, name] = match;
    if (!record(content)) throw new Error(`Locale file ${file} must contain a JSON object`);
    const dict = (out[code] ??= {});
    if (name === '_meta') Object.assign(dict, content); else dict[name] = content;
  }
  return out;
}

/** Reject translation keys, files, or record ids that English does not have (typos would otherwise be ignored silently). */
function checkAgainstEnglish(base: unknown, translated: unknown, path: string, errors: string[]) {
  if (Array.isArray(base) && Array.isArray(translated)) {
    const ids = new Set(base.filter(record).map(item => item.id).filter(id => typeof id === 'string'));
    if (!ids.size) { translated.forEach((item, index) => checkAgainstEnglish(base[index], item, `${path}[${index}]`, errors)); return; }
    for (const item of translated) {
      if (!record(item) || typeof item.id !== 'string') { errors.push(`${path}: translated records need an "id"`); continue; }
      if (!ids.has(item.id)) { errors.push(`${path}: unknown id "${item.id}"`); continue; }
      checkAgainstEnglish(base.find(entry => record(entry) && entry.id === item.id), item, `${path}.${item.id}`, errors);
    }
    return;
  }
  if (!record(base) || !record(translated)) return;
  if (typeof base.text === 'string') return;
  for (const key of Object.keys(translated)) {
    if (key in base) checkAgainstEnglish(base[key], translated[key], path ? `${path}.${key}` : key, errors);
    else if (!['published', 'expanded', 'frontPage', 'featured', 'affiliation'].includes(key)) errors.push(`${path || 'root'}: unknown key "${key}"`);
  }
}

/** Validate every language, apply English fallback, and remove unpublished entries. */
export function buildLocales(raw: Record<string, Dict>): Record<string, Locale> {
  if (!raw.en) throw new Error('The English locale folder (src/locales/en) is required');
  const out: Record<string, Locale> = {};
  for (const [code, dict] of Object.entries(raw)) {
    const errors: string[] = [];
    if (code !== 'en') checkAgainstEnglish(raw.en, dict, '', errors);
    const parsed = localeSchema.safeParse(code === 'en' ? dict : mergeLocale(raw.en, dict));
    if (!parsed.success) errors.push(...parsed.error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`));
    if (errors.length) throw new Error(`Invalid locale "${code}":\n- ${errors.join('\n- ')}`);
    out[code] = parsed.data as Locale;
  }
  return out;
}

/** Paths of everything marked `"published": false` in one language's own files. */
export function hiddenEntries(value: unknown, path = ''): string[] {
  if (Array.isArray(value)) return value.flatMap((item, index) => hiddenEntries(item, `${path}[${record(item) && typeof item.id === 'string' ? item.id : index}]`));
  if (!record(value)) return [];
  const own = value.published === false ? [path || 'root'] : [];
  return [...own, ...Object.entries(value).flatMap(([key, item]) => hiddenEntries(item, path ? `${path}.${key}` : key))];
}
