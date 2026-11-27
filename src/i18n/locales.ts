import { assembleLocales, buildLocales, hiddenEntries } from './build';

// Every folder in src/locales is a language (e.g. en/, si/) holding one JSON file per section.
// A translation folder may contain only the files and keys it changes; the rest falls back to English.
const files = import.meta.glob('../locales/*/*.json', { eager: true, import: 'default' });

export const rawLocales = assembleLocales(files);
export const locales = buildLocales(rawLocales);
export const english = locales.en;

if (import.meta.env.DEV && import.meta.env.MODE !== 'test') {
  for (const [code, dict] of Object.entries(rawLocales)) {
    const hidden = hiddenEntries(dict);
    if (hidden.length) console.info(`[locales] ${code}: ${hidden.length} unpublished — ${hidden.join(', ')}`);
  }
}
