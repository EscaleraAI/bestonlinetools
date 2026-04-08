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
    en: 'tools', de: 'tools', fr: 'outils', es: 'herramientas', it: 'strumenti',
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
  'images-to-pdf': {
    en: 'images-to-pdf', de: 'bilder-zu-pdf', fr: 'images-en-pdf', es: 'imagenes-a-pdf', it: 'immagini-in-pdf',
    nl: 'afbeeldingen-naar-pdf', pt: 'imagens-para-pdf', pl: 'obrazy-do-pdf', sv: 'bilder-till-pdf', ja: 'images-to-pdf',
  },
  'watermark': {
    en: 'watermark', de: 'wasserzeichen', fr: 'filigrane', es: 'marca-de-agua', it: 'filigrana',
    nl: 'watermerk', pt: 'marca-dagua', pl: 'znak-wodny', sv: 'vattenstampel', ja: 'watermark',
  },
  'page-numbers': {
    en: 'page-numbers', de: 'seitenzahlen', fr: 'numeros-de-page', es: 'numeros-de-pagina', it: 'numeri-di-pagina',
    nl: 'paginanummers', pt: 'numeros-de-pagina', pl: 'numery-stron', sv: 'sidnummer', ja: 'page-numbers',
  },
  'resize': {
    en: 'resize', de: 'groesse-aendern', fr: 'redimensionner', es: 'redimensionar', it: 'ridimensionare',
    nl: 'formaat-wijzigen', pt: 'redimensionar', pl: 'zmien-rozmiar', sv: 'andra-storlek', ja: 'resize',
  },
  'base64': {
    en: 'base64', de: 'base64', fr: 'base64', es: 'base64', it: 'base64',
    nl: 'base64', pt: 'base64', pl: 'base64', sv: 'base64', ja: 'base64',
  },
  'video-to-gif': {
    en: 'video-to-gif', de: 'video-zu-gif', fr: 'video-en-gif', es: 'video-a-gif', it: 'video-in-gif',
    nl: 'video-naar-gif', pt: 'video-para-gif', pl: 'wideo-do-gif', sv: 'video-till-gif', ja: 'video-to-gif',
  },
  'sign': {
    en: 'sign', de: 'unterschreiben', fr: 'signer', es: 'firmar', it: 'firmare',
    nl: 'ondertekenen', pt: 'assinar', pl: 'podpisz', sv: 'signera', ja: 'sign',
  },
  'fill-form': {
    en: 'fill-form', de: 'formular-ausfuellen', fr: 'remplir-formulaire', es: 'rellenar-formulario', it: 'compilare-modulo',
    nl: 'formulier-invullen', pt: 'preencher-formulario', pl: 'wypelnij-formularz', sv: 'fylla-i-formular', ja: 'fill-form',
  },
  'to-images': {
    en: 'to-images', de: 'zu-bildern', fr: 'en-images', es: 'a-imagenes', it: 'in-immagini',
    nl: 'naar-afbeeldingen', pt: 'para-imagens', pl: 'do-obrazow', sv: 'till-bilder', ja: 'to-images',
  },
  'ocr': {
    en: 'ocr', de: 'ocr', fr: 'ocr', es: 'ocr', it: 'ocr',
    nl: 'ocr', pt: 'ocr', pl: 'ocr', sv: 'ocr', ja: 'ocr',
  },
  'rotate': {
    en: 'rotate', de: 'drehen', fr: 'pivoter', es: 'rotar', it: 'ruotare',
    nl: 'draaien', pt: 'girar', pl: 'obrocic', sv: 'rotera', ja: 'rotate',
  },
  // /tools/* category slugs
  'qr-code-generator': {
    en: 'qr-code-generator', de: 'qr-code-generator', fr: 'generateur-qr-code', es: 'generador-qr', it: 'generatore-qr',
    nl: 'qr-code-generator', pt: 'gerador-qr', pl: 'generator-qr', sv: 'qr-kod-generator', ja: 'qr-code-generator',
  },
  'word-counter': {
    en: 'word-counter', de: 'woerter-zaehler', fr: 'compteur-mots', es: 'contador-palabras', it: 'conta-parole',
    nl: 'woorden-teller', pt: 'contador-palavras', pl: 'licznik-slow', sv: 'ordraknare', ja: 'word-counter',
  },
  'case-converter': {
    en: 'case-converter', de: 'gross-kleinschreibung', fr: 'convertisseur-casse', es: 'conversor-mayusculas', it: 'convertitore-maiuscole',
    nl: 'hoofdletters-converter', pt: 'conversor-caixa', pl: 'konwerter-wielkosci', sv: 'versalomvandlare', ja: 'case-converter',
  },
  'lorem-ipsum': {
    en: 'lorem-ipsum', de: 'lorem-ipsum', fr: 'lorem-ipsum', es: 'lorem-ipsum', it: 'lorem-ipsum',
    nl: 'lorem-ipsum', pt: 'lorem-ipsum', pl: 'lorem-ipsum', sv: 'lorem-ipsum', ja: 'lorem-ipsum',
  },
  'text-to-pdf': {
    en: 'text-to-pdf', de: 'text-zu-pdf', fr: 'texte-en-pdf', es: 'texto-a-pdf', it: 'testo-in-pdf',
    nl: 'tekst-naar-pdf', pt: 'texto-para-pdf', pl: 'tekst-do-pdf', sv: 'text-till-pdf', ja: 'text-to-pdf',
  },
  'json-formatter': {
    en: 'json-formatter', de: 'json-formatierer', fr: 'json-formateur', es: 'json-formateador', it: 'json-formattatore',
    nl: 'json-formatter', pt: 'json-formatador', pl: 'json-formatter', sv: 'json-formaterare', ja: 'json-formatter',
  },
  'color-picker': {
    en: 'color-picker', de: 'farbwaehler', fr: 'selecteur-couleur', es: 'selector-color', it: 'selettore-colore',
    nl: 'kleurkiezer', pt: 'seletor-cor', pl: 'wybor-koloru', sv: 'fargvaljare', ja: 'color-picker',
  },
  'url-encoder': {
    en: 'url-encoder', de: 'url-kodierer', fr: 'encodeur-url', es: 'codificador-url', it: 'codificatore-url',
    nl: 'url-encoder', pt: 'codificador-url', pl: 'kodowanie-url', sv: 'url-kodare', ja: 'url-encoder',
  },
  'base64-text': {
    en: 'base64-text', de: 'base64-text', fr: 'base64-texte', es: 'base64-texto', it: 'base64-testo',
    nl: 'base64-tekst', pt: 'base64-texto', pl: 'base64-tekst', sv: 'base64-text', ja: 'base64-text',
  },
  'password-generator': {
    en: 'password-generator', de: 'passwort-generator', fr: 'generateur-mot-de-passe', es: 'generador-contrasena', it: 'generatore-password',
    nl: 'wachtwoord-generator', pt: 'gerador-senha', pl: 'generator-hasel', sv: 'losenordsgenerator', ja: 'password-generator',
  },
  'diff-checker': {
    en: 'diff-checker', de: 'diff-pruefer', fr: 'comparateur-texte', es: 'comparador-texto', it: 'confronta-testo',
    nl: 'tekst-vergelijker', pt: 'comparador-texto', pl: 'porownanie-tekstu', sv: 'diff-kontroll', ja: 'diff-checker',
  },
  'hash-generator': {
    en: 'hash-generator', de: 'hash-generator', fr: 'generateur-hash', es: 'generador-hash', it: 'generatore-hash',
    nl: 'hash-generator', pt: 'gerador-hash', pl: 'generator-hash', sv: 'hash-generator', ja: 'hash-generator',
  },
  'regex-tester': {
    en: 'regex-tester', de: 'regex-tester', fr: 'testeur-regex', es: 'probador-regex', it: 'tester-regex',
    nl: 'regex-tester', pt: 'testador-regex', pl: 'tester-regex', sv: 'regex-testare', ja: 'regex-tester',
  },
  'csv-json': {
    en: 'csv-json', de: 'csv-json', fr: 'csv-json', es: 'csv-json', it: 'csv-json',
    nl: 'csv-json', pt: 'csv-json', pl: 'csv-json', sv: 'csv-json', ja: 'csv-json',
  },
  'markdown-html': {
    en: 'markdown-html', de: 'markdown-html', fr: 'markdown-html', es: 'markdown-html', it: 'markdown-html',
    nl: 'markdown-html', pt: 'markdown-html', pl: 'markdown-html', sv: 'markdown-html', ja: 'markdown-html',
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

/**
 * Translate a full English path to its localized equivalent.
 * Handles:
 *   '/' → '/de/'
 *   '/#tools' → '/de/#tools'
 *   '/image/png-to-svg' → '/de/bild/png-zu-svg'
 *   '/tools/convert-logo-to-svg' → '/de/tools/convert-logo-to-svg'
 *   '/pricing' → '/de/pricing' (static pages — no slug translation)
 *   '/privacy' → '/de/privacy'
 */
export function localizedHrefFromPath(enPath: string, locale: Locale): string {
  if (locale === i18n.defaultLocale) return enPath;

  // Handle hash fragments
  const [pathPart, hash] = enPath.split('#');
  const hashSuffix = hash ? `#${hash}` : '';

  // Root path
  if (pathPart === '/' || pathPart === '') {
    return `/${locale}/${hashSuffix}`;
  }

  // Parse path segments
  const segments = pathPart.split('/').filter(Boolean);

  if (segments.length === 0) {
    return `/${locale}/${hashSuffix}`;
  }

  // Two-segment paths: /category/tool-slug
  if (segments.length === 2) {
    const category = segments[0];
    const toolSlug = segments[1];

    // Check if first segment is a known category
    if (categorySlugs[category]) {
      return getLocalizedPath(locale, category, toolSlug) + hashSuffix;
    }
  }

  // Single-segment static pages (/pricing, /privacy)
  if (segments.length === 1) {
    return `/${locale}/${segments[0]}${hashSuffix}`;
  }

  // Fallback: prefix with locale, translate category if possible
  const category = segments[0];
  const catSlug = categorySlugs[category]?.[locale] || category;
  const rest = segments.slice(1).join('/');
  return `/${locale}/${catSlug}/${rest}${hashSuffix}`;
}

