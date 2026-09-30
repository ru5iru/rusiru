import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

// Auto-discover every locale file in src/locales. To add a new language,
// drop a JSON file named with its language prefix (e.g. si.json, ta.json)
// next to en.json — it will be picked up automatically, no code changes needed.
const modules = import.meta.glob('../locales/*.json', { eager: true }) as Record<
  string,
  { default: Record<string, unknown> }
>;

type Dict = Record<string, unknown>;

const translations: Record<string, Dict> = {};
for (const path in modules) {
  const code = path.split('/').pop()!.replace('.json', '');
  translations[code] = modules[path].default;
}

const DEFAULT_LANG = translations.en ? 'en' : Object.keys(translations)[0];

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

function resolveRaw(dict: Dict, key: string): unknown {
  return key.split('.').reduce<unknown>((acc, part) => {
    if (acc && typeof acc === 'object') return (acc as Dict)[part];
    return undefined;
  }, dict);
}

function resolve(dict: Dict, key: string): string {
  const value = resolveRaw(dict, key);
  return typeof value === 'string' ? value : key;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<string>(() => {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('lang');
      if (stored && translations[stored]) return stored;
    }
    return DEFAULT_LANG;
  });

  const setLang = (next: string) => {
    if (translations[next]) {
      setLangState(next);
      if (typeof localStorage !== 'undefined') localStorage.setItem('lang', next);
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
