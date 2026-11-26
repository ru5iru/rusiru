export type Dict = Record<string, unknown>;
export const record = (value: unknown): value is Dict => value !== null && typeof value === 'object' && !Array.isArray(value);
const FLAGS: Record<string, string> = { published: 'boolean', expanded: 'boolean', frontPage: 'boolean', featured: 'boolean', affiliation: 'string' };
const identified = (list: unknown[]) => list.length > 0 && list.every(item => record(item) && typeof item.id === 'string');

/**
 * Missing or malformed entries fall back to English recursively. Lists of records with an `id`
 * merge by id; other lists merge by position. Flags a translation sets always win.
 */
export function mergeLocale(base: unknown, translated: unknown): unknown {
  if (Array.isArray(base)) {
    const source = Array.isArray(translated) ? translated : [];
    if (identified(base)) {
      const byId = new Map(source.filter(record).map(item => [item.id, item]));
      return base.map(item => mergeLocale(item, byId.get((item as Dict).id)));
    }
    return base.map((item, index) => mergeLocale(item, source[index]));
  }
  // Points: a plain sentence on one side and `{ text, published }` on the other.
  if (typeof base === 'string' && record(translated)) {
    return { text: mergeLocale(base, translated.text), ...(typeof translated.published === 'boolean' ? { published: translated.published } : {}) };
  }
  if (record(base) && typeof base.text === 'string' && typeof translated === 'string') return { ...base, text: mergeLocale(base.text, translated) };
  if (record(base)) {
    const source = record(translated) ? translated : {};
    const merged: Dict = Object.fromEntries(Object.entries(base).map(([key, value]) => [key, key === 'id' ? value : mergeLocale(value, source[key])]));
    for (const [key, type] of Object.entries(FLAGS)) if (!(key in base) && typeof source[key] === type) merged[key] = source[key];
    return merged;
  }
  if (typeof base !== typeof translated) return base;
  if (typeof base === 'string' && typeof translated === 'string') {
    if (!translated.trim()) return base;
    const placeholders = base.match(/\{\w+\}/g) ?? [];
    if (placeholders.some((key) => !translated.includes(key))) return base;
    if (/^https?:\/\//.test(base)) {
      try { if (!['http:', 'https:'].includes(new URL(translated).protocol)) return base; }
      catch { return base; }
    }
  }
  return translated;
}

export function resolveRaw(dict: Dict, key: string): unknown {
  return key.split('.').reduce<unknown>((acc, part) => record(acc) ? acc[part] : undefined, dict);
}

export function readLanguage(fallback: string, available: Record<string, unknown>): string {
  try { const stored = localStorage.getItem('lang'); return stored && available[stored] ? stored : fallback; }
  catch { return fallback; }
}

export function storeLanguage(lang: string): void {
  try { localStorage.setItem('lang', lang); } catch { /* Session remains usable without storage. */ }
}
