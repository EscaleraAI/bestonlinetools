/**
 * i18n configuration for BestOnline.Tools
 *
 * Defines supported locales, default locale, and
 * category/slug translations used by middleware and catch-all route.
 */

export const i18n = {
  defaultLocale: 'en',
  locales: ['en', 'de', 'fr', 'es', 'it', 'nl', 'pt', 'pl', 'sv', 'ja'] as const,
} as const;

export type Locale = (typeof i18n.locales)[number];

/**
 * Category slug translations.
 * English slugs are the canonical form (no locale prefix).
 */
export const categorySlugs: Record<string, Record<Locale, string>> = {
  image: {
    en: 'image', de: 'bild', fr: 'image', es: 'imagen', it: 'immagine',
    nl: 'afbeelding', pt: 'imagem', pl: 'obraz', sv: 'bild', ja: 'image',
  },
  pdf: {
    en: 'pdf', de: 'pdf', fr: 'pdf', es: 'pdf', it: 'pdf',
    nl: 'pdf', pt: 'pdf', pl: 'pdf', sv: 'pdf', ja: 'pdf',
  },
  audio: {
    en: 'audio', de: 'audio', fr: 'audio', es: 'audio', it: 'audio',
    nl: 'audio', pt: 'audio', pl: 'audio', sv: 'ljud', ja: 'audio',
  },
  video: {
    en: 'video', de: 'video', fr: 'video', es: 'video', it: 'video',
    nl: 'video', pt: 'video', pl: 'wideo', sv: 'video', ja: 'video',
  },
  tools: {
    en: 'tools', de: 'werkzeuge', fr: 'outils', es: 'herramientas', it: 'strumenti',
    nl: 'gereedschappen', pt: 'ferramentas', pl: 'narzedzia', sv: 'verktyg', ja: 'tools',
  },
  alternatives: {
    en: 'alternatives', de: 'alternativen', fr: 'alternatives', es: 'alternativas', it: 'alternative',
    nl: 'alternatieven', pt: 'alternativas', pl: 'alternatywy', sv: 'alternativ', ja: 'alternatives',
  },
};

/**
 * Reverse lookup: given a localized category slug, find the canonical category.
 * e.g. 'bild' → 'image', 'werkzeuge' → 'tools'
 */
export function resolveCategory(localizedSlug: string): string | null {
  for (const [canonical, translations] of Object.entries(categorySlugs)) {
    for (const translated of Object.values(translations)) {
      if (translated === localizedSlug) return canonical;
    }
  }
  return null;
}

/**
 * Tool page slug translations (HUB pages only).
 * Key = canonical English slug (after category), value = translations.
 */
export const toolSlugs: Record<string, Record<Locale, string>> = {
  'png-to-svg': {
    en: 'png-to-svg', de: 'png-zu-svg', fr: 'png-en-svg', es: 'png-a-svg', it: 'png-in-svg',
    nl: 'png-naar-svg', pt: 'png-para-svg', pl: 'png-na-svg', sv: 'png-till-svg', ja: 'png-to-svg',
  },
  'remove-background': {
    en: 'remove-background', de: 'hintergrund-entfernen', fr: 'supprimer-arriere-plan', es: 'eliminar-fondo', it: 'rimuovere-sfondo',
    nl: 'achtergrond-verwijderen', pt: 'remover-fundo', pl: 'usun-tlo', sv: 'ta-bort-bakgrund', ja: 'remove-background',
  },
  'compress-image': {
    en: 'compress-image', de: 'bild-komprimieren', fr: 'compresser-image', es: 'comprimir-imagen', it: 'comprimi-immagine',
    nl: 'afbeelding-comprimeren', pt: 'comprimir-imagem', pl: 'kompresuj-obraz', sv: 'komprimera-bild', ja: 'compress-image',
  },
  'photo-to-coloring-page': {
    en: 'photo-to-coloring-page', de: 'foto-als-ausmalbild', fr: 'photo-en-coloriage', es: 'foto-para-colorear', it: 'foto-da-colorare',
    nl: 'foto-naar-kleurplaat', pt: 'foto-para-colorir', pl: 'zdjecie-do-kolorowania', sv: 'foto-till-malarbok', ja: 'photo-to-coloring-page',
  },
  'convert-audio': {
    en: 'convert-audio', de: 'audio-konvertieren', fr: 'convertir-audio', es: 'convertir-audio', it: 'convertire-audio',
    nl: 'audio-converteren', pt: 'converter-audio', pl: 'konwertuj-audio', sv: 'konvertera-ljud', ja: 'convert-audio',
  },
  'speech-to-text': {
    en: 'speech-to-text', de: 'sprache-zu-text', fr: 'transcription-audio', es: 'voz-a-texto', it: 'trascrizione-audio',
    nl: 'spraak-naar-tekst', pt: 'voz-para-texto', pl: 'mowa-na-tekst', sv: 'tal-till-text', ja: 'speech-to-text',
  },
  'format-converter': {
    en: 'format-converter', de: 'format-konverter', fr: 'convertisseur-format', es: 'conversor-formato', it: 'convertitore-formato',
    nl: 'formaat-converter', pt: 'conversor-formato', pl: 'konwerter-formatu', sv: 'format-konverterare', ja: 'format-converter',
  },
  'merge-pdf': {
    en: 'merge-pdf', de: 'zusammenfuehren', fr: 'fusionner-pdf', es: 'unir-pdf', it: 'unisci-pdf',
    nl: 'pdf-samenvoegen', pt: 'juntar-pdf', pl: 'polacz-pdf', sv: 'sla-ihop-pdf', ja: 'merge-pdf',
  },
  'split-pdf': {
    en: 'split-pdf', de: 'teilen', fr: 'diviser-pdf', es: 'dividir-pdf', it: 'dividi-pdf',
    nl: 'pdf-splitsen', pt: 'dividir-pdf', pl: 'podziel-pdf', sv: 'dela-pdf', ja: 'split-pdf',
  },
  'password-protect': {
    en: 'password-protect', de: 'passwort-schuetzen', fr: 'proteger-pdf', es: 'proteger-pdf', it: 'proteggere-pdf',
    nl: 'pdf-beveiligen', pt: 'proteger-pdf', pl: 'chron-pdf', sv: 'skydda-pdf', ja: 'password-protect',
  },
  // Legacy slugs for backward compat
  'compress': {
    en: 'compress', de: 'komprimieren', fr: 'compresser', es: 'comprimir', it: 'comprimi',
    nl: 'comprimeren', pt: 'comprimir', pl: 'kompresuj', sv: 'komprimera', ja: 'compress',
  },
  'merge': {
    en: 'merge', de: 'zusammenfuehren', fr: 'fusionner', es: 'unir', it: 'unisci',
    nl: 'samenvoegen', pt: 'juntar', pl: 'polacz', sv: 'sla-ihop', ja: 'merge',
  },
  'split': {
    en: 'split', de: 'teilen', fr: 'diviser', es: 'dividir', it: 'dividi',
    nl: 'splitsen', pt: 'dividir', pl: 'podziel', sv: 'dela', ja: 'split',
  },
};

/**
 * Resolve a localized tool slug back to canonical English.
 * e.g. 'png-zu-svg' → 'png-to-svg'
 */
export function resolveToolSlug(localizedSlug: string): string | null {
  for (const [canonical, translations] of Object.entries(toolSlugs)) {
    for (const translated of Object.values(translations)) {
      if (translated === localizedSlug) return canonical;
    }
  }
  return null;
}

/**
 * Get the full translated path for a given locale.
 * e.g. getLocalizedPath('de', 'image', 'png-to-svg') → '/de/bild/png-zu-svg'
 */
export function getLocalizedPath(locale: Locale, category: string, toolSlug: string): string {
  const catSlug = categorySlugs[category]?.[locale] || category;
  const tSlug = toolSlugs[toolSlug]?.[locale] || toolSlug;

  if (locale === i18n.defaultLocale) {
    return `/${catSlug}/${tSlug}`;
  }
  return `/${locale}/${catSlug}/${tSlug}`;
}
