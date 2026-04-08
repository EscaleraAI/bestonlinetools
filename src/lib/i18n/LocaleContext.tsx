'use client';

import { createContext, useContext, useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { en } from './translations/en';
import { de } from './translations/de';
import { i18n, localizedHrefFromPath } from '../i18n';
import type { TranslationKey } from './translations/en';
import type { Locale } from '../i18n';

const dictionaries: Record<string, Record<TranslationKey, string>> = { en, de };

interface LocaleContextValue {
  locale: Locale;
  t: (key: TranslationKey, params?: Record<string, string>) => string;
  localizedHref: (enPath: string) => string;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: 'en',
  t: (key) => en[key] ?? key,
  localizedHref: (path) => path,
});

export function useLocale() {
  return useContext(LocaleContext);
}

/**
 * Detects locale from the current pathname.
 * /de/bild/... → 'de'
 * /image/... → 'en'
 */
function detectLocale(pathname: string): Locale {
  const firstSegment = pathname.split('/').filter(Boolean)[0];
  if (firstSegment && i18n.locales.includes(firstSegment as Locale) && firstSegment !== i18n.defaultLocale) {
    return firstSegment as Locale;
  }
  return i18n.defaultLocale;
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const locale = detectLocale(pathname);

  // Keep <html lang="…"> in sync with the detected locale
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo<LocaleContextValue>(() => {
    const dict = dictionaries[locale] ?? en;

    const t = (key: TranslationKey, params?: Record<string, string>): string => {
      let str = dict[key] ?? en[key] ?? key;
      if (params) {
        for (const [k, v] of Object.entries(params)) {
          str = str.replace(`{${k}}`, v);
        }
      }
      return str;
    };

    const localizedHref = (enPath: string): string => {
      if (locale === i18n.defaultLocale) return enPath;
      return localizedHrefFromPath(enPath, locale);
    };

    return { locale, t, localizedHref };
  }, [locale]);

  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  );
}
