export type Dict = Record<string, unknown>;
const record = (value: unknown): value is Dict => value !== null && typeof value === 'object' && !Array.isArray(value);

/** Missing or malformed entries fall back recursively; arrays merge by stable position. */
export function mergeLocale(base: unknown, translated: unknown): unknown {
  if (Array.isArray(base)) {
    return base.map((item, index) => mergeLocale(item, Array.isArray(translated) ? translated[index] : undefined));
  }
  if (record(base)) {
    const source = record(translated) ? translated : {};
    return Object.fromEntries(Object.entries(base).map(([key, value]) => [key, mergeLocale(value, source[key])]));
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