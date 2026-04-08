/**
 * Server-side translation helper.
 * Use this in server components that cannot use the useLocale() hook.
 */
import { en } from './translations/en';
import { de } from './translations/de';
import type { TranslationKey } from './translations/en';
import type { Locale } from '../i18n';

const dictionaries: Record<string, Record<TranslationKey, string>> = { en, de };

export function getTranslator(locale: Locale) {
  const dict = dictionaries[locale] ?? en;

  return function t(key: TranslationKey, params?: Record<string, string>): string {
    let str = dict[key] ?? en[key] ?? key;
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        str = str.replace(`{${k}}`, v);
      }
    }
    return str;
  };
}
