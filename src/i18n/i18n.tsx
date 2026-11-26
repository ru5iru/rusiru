import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { resolveRaw, readLanguage, storeLanguage, type Dict } from './locale';
import { locales } from './locales';
import { publishedSections } from './publish';
import { siteConfig } from '@/config';

const translations = locales as unknown as Record<string, Dict>;
const DEFAULT_LANG = 'en';

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
  /** Configured sections this language publishes, in order. */
  sections: string[];
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
  const sections = publishedSections(locales[lang] ?? locales[DEFAULT_LANG], siteConfig.sections);
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
    <I18nContext.Provider value={{ lang, setLang, t, tr, languages, sections }}>
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
