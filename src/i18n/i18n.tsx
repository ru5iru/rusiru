import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { mergeLocale, resolveRaw, readLanguage, storeLanguage, type Dict } from './locale';
import { localeSchema } from './schema';

// Auto-discover every locale file in src/locales. To add a new language,
// drop a JSON file named with its language prefix (e.g. si.json, ta.json)
// next to en.json — it will be picked up automatically, no code changes needed.
const modules = import.meta.glob('../locales/*.json', { eager: true }) as Record<
  string,
  { default: Record<string, unknown> }
>;

const translations: Record<string, Dict> = {};
for (const path in modules) {
  const filename = path.split('/').pop();
  if (!filename) continue;
  const code = filename.replace('.json', '');
  translations[code] = modules[path].default;
}

const DEFAULT_LANG = 'en';
if (!translations.en) throw new Error('The English fallback locale is required');
localeSchema.parse(translations.en);
for (const code of Object.keys(translations)) translations[code] = mergeLocale(translations.en, translations[code]) as Dict;

export interface LanguageOption {
  code: string;
  name: string;
  label: string;
}

interface I18nContextValue {
  lang: string;
  setLang: (lang: string) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
  tr: <T = unknown>(key: string) => T;
  languages: LanguageOption[];
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

function resolve(dict: Dict, key: string): string {
  const value = resolveRaw(dict, key);
  return typeof value === 'string' ? value : key;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<string>(() => readLanguage(DEFAULT_LANG, translations));

  const setLang = (next: string) => {
    if (translations[next]) {
      setLangState(next);
      storeLanguage(next);
    }
  };

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const dict = translations[lang] ?? translations[DEFAULT_LANG] ?? {};
  const t = (key: string, vars?: Record<string, string | number>) => {
    let s = resolve(dict, key);
    if (vars) for (const k in vars) s = s.split(`{${k}}`).join(String(vars[k]));
    return s;
  };
  const tr = <T,>(key: string) => resolveRaw(dict, key) as T;

  const languages: LanguageOption[] = Object.keys(translations).map((code) => {
    const meta = (translations[code].language ?? {}) as { name?: string; code?: string };
    return {
      code,
      name: meta.name ?? code,
      label: meta.code ?? code.toUpperCase(),
    };
  });

  return (
    <I18nContext.Provider value={{ lang, setLang, t, tr, languages }}>
      {children}
    </I18nContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTranslation() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useTranslation must be used within I18nProvider');
  return ctx;
}
