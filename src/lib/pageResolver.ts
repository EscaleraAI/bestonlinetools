/**
 * Page resolver: maps localized slugs to page data.
 *
 * This is a JSON-based implementation for Sprint 1.
 * Will be replaced by Neon DB queries in Sprint 2.
 */

import { type Locale, resolveCategory, resolveToolSlug } from './i18n';
import { getDb } from './db';

export interface PageData {
  toolId: string;
  pageType: 'HUB' | 'SPOKE' | 'ALTERNATIVE' | 'GUIDE';
  h1: string;
  metaTitle: string;
  metaDesc: string;
  faqJson: Array<{ q: string; a: string }>;
  defaultConfig: Record<string, unknown>;
  introText?: string;  // Unique intro paragraph for SPOKE differentiation
  locale: Locale;
  canonicalSlug: string; // English slug for hreflang
}

/**
 * Static page data for Sprint 1 MVP.
 * Key format: "{locale}:{category}/{tool-slug}"
 */
const pages: Record<string, PageData> = {
  'en:image/png-to-svg': {
    toolId: 'svg_vectorizer',
    pageType: 'HUB',
    h1: 'Convert PNG to SVG — Free Online Vectorizer',
    metaTitle: 'PNG to SVG Converter | Free, Private, Instant',
    metaDesc: 'Convert any PNG, JPG, or WebP image to SVG vector format. Runs locally in your browser — your files never leave your device.',
    faqJson: [
      { q: 'Is it really free?', a: 'Yes, 100% free with no limits. The tool runs entirely in your browser.' },
      { q: 'Are my files private?', a: 'Yes. Your images never leave your device — all processing happens locally using WebAssembly.' },
    ],
    defaultConfig: {},
    locale: 'en',
    canonicalSlug: 'image/png-to-svg',
  },
  'de:bild/png-zu-svg': {
    toolId: 'svg_vectorizer',
    pageType: 'HUB',
    h1: 'PNG in SVG umwandeln — Kostenloser Online-Vektorisierer',
    metaTitle: 'PNG zu SVG Konverter | Kostenlos, Privat, Sofort',
    metaDesc: 'Konvertieren Sie jedes PNG-, JPG- oder WebP-Bild in das SVG-Vektorformat. Läuft lokal in Ihrem Browser.',
    faqJson: [
      { q: 'Ist es wirklich kostenlos?', a: 'Ja, 100% kostenlos ohne Limits. Das Tool läuft vollständig in Ihrem Browser.' },
      { q: 'Sind meine Dateien privat?', a: 'Ja. Ihre Bilder verlassen niemals Ihr Gerät — die gesamte Verarbeitung erfolgt lokal.' },
    ],
    defaultConfig: {},
    locale: 'de',
    canonicalSlug: 'image/png-to-svg',
  },

  // ---- SPOKES: Vectorizer long-tail (EN) ----
  'en:tools/convert-logo-to-svg': {
    toolId: 'svg_vectorizer',
    pageType: 'SPOKE',
    h1: 'Convert Logo to SVG — Free Logo Vectorizer',
    metaTitle: 'Convert Logo to SVG | Free Online Logo Vectorizer',
    metaDesc: 'Turn any logo PNG or JPG into a clean, scalable SVG vector. Perfect for business cards, signage, and web use. 100% free and private.',
    faqJson: [
      { q: 'What logo formats can I convert?', a: 'PNG, JPG, WebP, and BMP logos are all supported.' },
      { q: 'Will the SVG be high quality?', a: 'Yes. Use the "Logo" preset for optimal edge detection and clean curves.' },
    ],
    defaultConfig: { preset: 'logo' },
    introText: 'Need your company logo in vector format? Logos require especially clean path tracing to maintain brand consistency at any size — from tiny app icons to massive billboard signage. Our Logo preset is tuned for high-contrast graphics with crisp edges and minimal noise.',
    locale: 'en',
    canonicalSlug: 'tools/convert-logo-to-svg',
  },
  'en:tools/convert-signature-to-svg': {
    toolId: 'svg_vectorizer',
    pageType: 'SPOKE',
    h1: 'Convert Signature to SVG — Free Signature Vectorizer',
    metaTitle: 'Convert Signature to SVG | Free Online',
    metaDesc: 'Vectorize your handwritten signature into a crisp SVG. Perfect for digital documents and email signatures. Free and private.',
    faqJson: [
      { q: 'Can I use this for legal signatures?', a: 'Yes. The SVG output preserves your signature strokes at any resolution.' },
    ],
    defaultConfig: { preset: 'logo' },
    introText: 'Digitize your handwritten signature into a resolution-independent SVG for use in email signatures, PDF documents, contracts, and letterheads. The vectorized result scales perfectly from business cards to posters without any pixelation.',
    locale: 'en',
    canonicalSlug: 'tools/convert-signature-to-svg',
  },
  'en:tools/convert-sketch-to-svg': {
    toolId: 'svg_vectorizer',
    pageType: 'SPOKE',
    h1: 'Convert Sketch to SVG — Free Sketch Vectorizer',
    metaTitle: 'Free Sketch to SVG Converter',
    metaDesc: 'Turn hand-drawn sketches and illustrations into scalable SVG vectors. Preserves artistic detail. Free, local, private.',
    faqJson: [],
    defaultConfig: { preset: 'illustration' },
    introText: 'Turn your pencil sketches, ink drawings, or architectural illustrations into clean scalable vectors. The Illustration preset preserves artistic line weight and detail while producing smooth, editable SVG paths — perfect for digitizing hand-drawn artwork.',
    locale: 'en',
    canonicalSlug: 'tools/convert-sketch-to-svg',
  },
  'en:tools/convert-photo-to-svg': {
    toolId: 'svg_vectorizer',
    pageType: 'SPOKE',
    h1: 'Convert Photo to SVG — Free Photo Vectorizer',
    metaTitle: 'Convert Photo to SVG | Free Online Photo to Vector',
    metaDesc: 'Transform photographs into SVG vector art. Uses advanced color tracing for detailed results. Free and runs locally.',
    faqJson: [],
    defaultConfig: { preset: 'photo', colorMode: 'color' },
    introText: 'Transform photographs into stylized SVG vector art using advanced color tracing. Unlike simple logos, photos require multi-color path analysis to capture gradients and shading. The result is a resolution-independent illustration you can scale, edit, or use in design projects.',
    locale: 'en',
    canonicalSlug: 'tools/convert-photo-to-svg',
  },

  // ---- SPOKES: Vectorizer long-tail (DE) ----
  'de:werkzeuge/logo-in-svg-umwandeln': {
    toolId: 'svg_vectorizer',
    pageType: 'SPOKE',
    h1: 'Logo in SVG umwandeln — Kostenloser Logo-Vektorisierer',
    metaTitle: 'Logo in SVG umwandeln | Kostenlos',
    metaDesc: 'Verwandeln Sie jedes Logo-PNG oder JPG in ein sauberes, skalierbares SVG. Perfekt für Visitenkarten und Web. 100% kostenlos.',
    faqJson: [
      { q: 'Welche Logo-Formate kann ich konvertieren?', a: 'PNG, JPG, WebP und BMP Logos werden unterstützt.' },
    ],
    defaultConfig: { preset: 'logo' },
    locale: 'de',
    canonicalSlug: 'tools/convert-logo-to-svg',
  },
  'de:werkzeuge/unterschrift-in-svg-umwandeln': {
    toolId: 'svg_vectorizer',
    pageType: 'SPOKE',
    h1: 'Unterschrift in SVG umwandeln — Kostenloser Signatur-Vektorisierer',
    metaTitle: 'Unterschrift in SVG umwandeln | Kostenlos',
    metaDesc: 'Vektorisieren Sie Ihre handschriftliche Unterschrift in ein gestochen scharfes SVG. Kostenlos und privat.',
    faqJson: [],
    defaultConfig: { preset: 'logo' },
    locale: 'de',
    canonicalSlug: 'tools/convert-signature-to-svg',
  },
  'de:werkzeuge/skizze-in-svg-umwandeln': {
    toolId: 'svg_vectorizer',
    pageType: 'SPOKE',
    h1: 'Skizze in SVG umwandeln — Kostenloser Skizzen-Vektorisierer',
    metaTitle: 'Skizze in SVG umwandeln | Kostenlos',
    metaDesc: 'Verwandeln Sie handgezeichnete Skizzen in skalierbare SVG-Vektoren. Bewahrt künstlerische Details.',
    faqJson: [],
    defaultConfig: { preset: 'illustration' },
    locale: 'de',
    canonicalSlug: 'tools/convert-sketch-to-svg',
  },
  'de:werkzeuge/foto-in-svg-umwandeln': {
    toolId: 'svg_vectorizer',
    pageType: 'SPOKE',
    h1: 'Foto in SVG umwandeln — Kostenloser Foto-Vektorisierer',
    metaTitle: 'Foto in SVG umwandeln | Kostenlos',
    metaDesc: 'Verwandeln Sie Fotos in SVG-Vektorkunst. Erweiterte Farbverfolgung für detaillierte Ergebnisse. Kostenlos und lokal.',
    faqJson: [],
    defaultConfig: { preset: 'photo', colorMode: 'color' },
    locale: 'de',
    canonicalSlug: 'tools/convert-photo-to-svg',
  },

  // ---- ALTERNATIVE: Competitor hijack (EN) ----
  'en:alternatives/vectorizer-ai-free-alternative': {
    toolId: 'svg_vectorizer',
    pageType: 'ALTERNATIVE',
    h1: 'Free Vectorizer.ai Alternative — Convert Images to SVG Online',
    metaTitle: 'Vectorizer.ai Free Alternative | No Signup',
    metaDesc: 'Looking for a free alternative to Vectorizer.ai? BestOnline.Tools runs 100% locally in your browser. No signup, no limits, no upload to servers.',
    introText: 'Vectorizer.ai is a popular cloud-based image tracing tool — but it requires an account, uploads your files to remote servers, and limits free users. BestOnline.Tools offers a completely free, privacy-first alternative that runs entirely in your browser with no sign-up, no usage caps, and no server uploads.',
    faqJson: [
      { q: 'How is this different from Vectorizer.ai?', a: 'Unlike Vectorizer.ai, our tool runs entirely in your browser. Your images never leave your device. No account required, no usage limits.' },
      { q: 'Is the quality comparable?', a: 'For B&W vectorization, quality is very similar. We also offer color vectorization for photos and detailed images.' },
      { q: 'Does Vectorizer.ai offer a free plan?', a: 'Vectorizer.ai offers limited free credits that expire. Our tool has no credits, no limits, and no expiration — it is free forever.' },
      { q: 'What file formats are supported?', a: 'We accept PNG, JPG, WebP, BMP, and GIF as input and output clean, standards-compliant SVG files — the same formats Vectorizer.ai supports.' },
      { q: 'Is my data private with Vectorizer.ai?', a: 'Vectorizer.ai uploads your images to their cloud servers for processing. Our tool processes everything locally in your browser — your files never leave your device.' },
    ],
    defaultConfig: {},
    locale: 'en',
    canonicalSlug: 'alternatives/vectorizer-ai-free-alternative',
  },
  'de:alternativen/vectorizer-ai-kostenlose-alternative': {
    toolId: 'svg_vectorizer',
    pageType: 'ALTERNATIVE',
    h1: 'Kostenlose Vectorizer.ai Alternative — Bilder online in SVG umwandeln',
    metaTitle: 'Vectorizer.ai Alternative | Kostenlos',
    metaDesc: 'Suchen Sie eine kostenlose Alternative zu Vectorizer.ai? BestOnline.Tools läuft 100% lokal in Ihrem Browser. Ohne Anmeldung, ohne Limits.',
    faqJson: [
      { q: 'Wie unterscheidet sich das von Vectorizer.ai?', a: 'Im Gegensatz zu Vectorizer.ai läuft unser Tool vollständig in Ihrem Browser. Ihre Bilder verlassen niemals Ihr Gerät.' },
    ],
    defaultConfig: {},
    locale: 'de',
    canonicalSlug: 'alternatives/vectorizer-ai-free-alternative',
  },

  // ===========================================================
  // BACKGROUND REMOVER
  // ===========================================================

  // ---- HUBS ----
  'en:image/remove-background': {
    toolId: 'remove_bg',
    pageType: 'HUB',
    h1: 'Remove Background from Image — Free & Private',
    metaTitle: 'Free Background Remover | AI-Powered, No Upload',
    metaDesc: 'Remove backgrounds from any image instantly. Runs 100% locally on your device using AI — your photos never leave your browser. Free, unlimited, no watermark.',
    faqJson: [
      { q: 'Is it really free and unlimited?', a: 'Yes. No credits, no limits, no account required. The AI model runs entirely in your browser.' },
      { q: 'Are my photos uploaded to a server?', a: 'No. All processing happens locally on your device using WebGPU. Your images never leave your browser.' },
      { q: 'How long does it take?', a: 'The first time takes ~10 seconds to download the AI model. After that, each image takes under 5 seconds.' },
    ],
    defaultConfig: {},
    locale: 'en',
    canonicalSlug: 'image/remove-background',
  },
  'de:bild/hintergrund-entfernen': {
    toolId: 'remove_bg',
    pageType: 'HUB',
    h1: 'Hintergrund entfernen — Kostenlos & Privat',
    metaTitle: 'Hintergrund Entfernen | Kostenlos, KI',
    metaDesc: 'Entfernen Sie Hintergründe aus Bildern sofort. Läuft 100% lokal auf Ihrem Gerät mit KI — Ihre Fotos verlassen niemals Ihren Browser.',
    faqJson: [
      { q: 'Ist es wirklich kostenlos?', a: 'Ja. Keine Credits, keine Limits, keine Anmeldung erforderlich.' },
      { q: 'Werden meine Fotos hochgeladen?', a: 'Nein. Die gesamte Verarbeitung erfolgt lokal auf Ihrem Gerät.' },
    ],
    defaultConfig: {},
    locale: 'de',
    canonicalSlug: 'image/remove-background',
  },

  // ---- SPOKES: BG Remover long-tail (EN) ----
  'en:tools/remove-background-from-portrait': {
    toolId: 'remove_bg',
    pageType: 'SPOKE',
    h1: 'Remove Background from Portrait — Free Portrait Cutout',
    metaTitle: 'Remove Portrait Background | Free AI Tool',
    metaDesc: 'Remove the background from portrait photos instantly. Perfect for headshots, profile pictures, and professional photos. Free and private.',
    faqJson: [],
    defaultConfig: {},
    introText: 'Perfect for headshots, LinkedIn photos, and passport images. Our AI is specifically trained to handle the fine details around hair, glasses, and fabric edges that make portrait cutouts look professional and natural.',
    locale: 'en',
    canonicalSlug: 'tools/remove-background-from-portrait',
  },
  'en:tools/remove-background-from-product-photo': {
    toolId: 'remove_bg',
    pageType: 'SPOKE',
    h1: 'Remove Background from Product Photo — Free for E-commerce',
    metaTitle: 'Remove Product Photo Background | Free',
    metaDesc: 'Create clean product images with transparent backgrounds. Perfect for Amazon, Shopify, and eBay listings. Free, unlimited, no watermark.',
    faqJson: [],
    defaultConfig: {},
    introText: 'Clean product photos sell better. Remove distracting backgrounds from your inventory shots and create the clean white or transparent backgrounds that Amazon, Shopify, eBay, and Etsy require for professional listings.',
    locale: 'en',
    canonicalSlug: 'tools/remove-background-from-product-photo',
  },
  'en:tools/make-image-transparent': {
    toolId: 'remove_bg',
    pageType: 'SPOKE',
    h1: 'Make Image Transparent — Free Background Eraser',
    metaTitle: 'Make Image Transparent Online | Free',
    metaDesc: 'Make any image background transparent with one click. Download a high-quality PNG with transparency. Free, private, no signup.',
    faqJson: [],
    defaultConfig: {},
    introText: 'Need a transparent PNG for use in presentations, designs, or overlays? This tool uses AI to precisely isolate the subject and remove the background, giving you a clean image with full alpha transparency that you can layer on any backdrop.',
    locale: 'en',
    canonicalSlug: 'tools/make-image-transparent',
  },

  // ---- SPOKES: BG Remover long-tail (DE) ----
  'de:werkzeuge/hintergrund-von-portrait-entfernen': {
    toolId: 'remove_bg',
    pageType: 'SPOKE',
    h1: 'Hintergrund von Portrait entfernen — Kostenloser Portrait-Ausschnitt',
    metaTitle: 'Portrait Hintergrund entfernen | Kostenlos',
    metaDesc: 'Entfernen Sie den Hintergrund von Porträtfotos sofort. Perfekt für Bewerbungsfotos und Profilbilder. Kostenlos und privat.',
    faqJson: [],
    defaultConfig: {},
    locale: 'de',
    canonicalSlug: 'tools/remove-background-from-portrait',
  },
  'de:werkzeuge/hintergrund-von-produktfoto-entfernen': {
    toolId: 'remove_bg',
    pageType: 'SPOKE',
    h1: 'Hintergrund von Produktfoto entfernen — Kostenlos für E-Commerce',
    metaTitle: 'Produktfoto Hintergrund entfernen | Kostenlos',
    metaDesc: 'Erstellen Sie saubere Produktbilder mit transparentem Hintergrund. Perfekt für Amazon und Shopify.',
    faqJson: [],
    defaultConfig: {},
    locale: 'de',
    canonicalSlug: 'tools/remove-background-from-product-photo',
  },
  'de:werkzeuge/bild-transparent-machen': {
    toolId: 'remove_bg',
    pageType: 'SPOKE',
    h1: 'Bild transparent machen — Kostenloser Hintergrund-Radierer',
    metaTitle: 'Bild transparent machen | Kostenlos',
    metaDesc: 'Machen Sie jeden Bildhintergrund mit einem Klick transparent. Laden Sie ein hochwertiges PNG mit Transparenz herunter.',
    faqJson: [],
    defaultConfig: {},
    locale: 'de',
    canonicalSlug: 'tools/make-image-transparent',
  },

  // ---- ALTERNATIVES: BG Remover ----
  'en:alternatives/remove-bg-free-alternative': {
    toolId: 'remove_bg',
    pageType: 'ALTERNATIVE',
    h1: 'Free remove.bg Alternative — No Signup, Unlimited',
    metaTitle: 'remove.bg Free Alternative | No Credits, No Limits',
    metaDesc: 'Looking for a free alternative to remove.bg? Our tool runs locally in your browser. No credits, no watermarks, no 50-image limit. Unlimited and free forever.',
    introText: 'remove.bg is one of the most popular background removal tools — but it limits free users to 50 low-resolution images per month, adds watermarks, and requires an account. Our AI-powered alternative removes backgrounds with comparable quality while running 100% locally. No credits, no watermarks, no resolution limits, no account.',
    faqJson: [
      { q: 'How does this compare to remove.bg?', a: 'remove.bg limits free users to 50 low-res images/month and adds watermarks. Our tool is unlimited, full-resolution, watermark-free, and runs locally.' },
      { q: 'Do I need to create an account?', a: 'No. No signup, no email, no credit card. Just drop your image and go.' },
      { q: 'Is the quality as good as remove.bg?', a: 'Yes — our AI model handles hair, fur, and complex edges with comparable accuracy. For most photos the results are virtually identical.' },
      { q: 'Does remove.bg keep my photos?', a: 'remove.bg uploads your images to their servers for processing. Our tool never uploads anything — all AI processing happens locally in your browser using WebGPU.' },
      { q: 'Can I use this for commercial projects?', a: 'Yes. There are no restrictions on how you use the output images. Remove backgrounds for e-commerce, marketing, social media, or any other purpose.' },
    ],
    defaultConfig: {},
    locale: 'en',
    canonicalSlug: 'alternatives/remove-bg-free-alternative',
  },
  'de:alternativen/remove-bg-kostenlose-alternative': {
    toolId: 'remove_bg',
    pageType: 'ALTERNATIVE',
    h1: 'Kostenlose remove.bg Alternative — Ohne Anmeldung, Unbegrenzt',
    metaTitle: 'remove.bg kostenlose Alternative | Ohne Limits',
    metaDesc: 'Suchen Sie eine kostenlose Alternative zu remove.bg? Unser Tool läuft lokal in Ihrem Browser. Keine Credits, keine Wasserzeichen, unbegrenzt.',
    faqJson: [
      { q: 'Wie unterscheidet sich das von remove.bg?', a: 'remove.bg beschränkt kostenlose Nutzer auf 50 Bilder/Monat in niedriger Auflösung. Unser Tool ist unbegrenzt und läuft lokal.' },
    ],
    defaultConfig: {},
    locale: 'de',
    canonicalSlug: 'alternatives/remove-bg-free-alternative',
  },

  // ---- SPOKES: BG Remover additional long-tail (EN) ----
  'en:tools/remove-background-from-photo': {
    toolId: 'remove_bg',
    pageType: 'SPOKE',
    h1: 'Remove Background from Photo — Free AI Tool',
    metaTitle: 'Remove Background from Photo | Free, AI-Powered',
    metaDesc: 'Remove the background from any photo instantly using AI. Get a transparent PNG in seconds. Free, private, no signup.',
    faqJson: [
      { q: 'Does it work with selfies and portraits?', a: 'Yes — the AI model excels at portraits, including precise edge detection around hair and clothing.' },
    ],
    defaultConfig: {},
    introText: 'Whether it\'s a vacation snapshot, a family portrait, or a pet photo — our AI instantly removes the background and gives you a transparent PNG. No manual selection, no fiddly lasso tools. Just drop your photo and download the result.',
    locale: 'en',
    canonicalSlug: 'tools/remove-background-from-photo',
  },
  'en:tools/transparent-background-maker': {
    toolId: 'remove_bg',
    pageType: 'SPOKE',
    h1: 'Transparent Background Maker — Free Online',
    metaTitle: 'Transparent Background Maker | Free AI Tool',
    metaDesc: 'Create transparent backgrounds for any image. AI removes the background and outputs a clean PNG with alpha transparency.',
    faqJson: [
      { q: 'What format supports transparency?', a: 'The output is a PNG file with full alpha transparency. JPG does not support transparency.' },
    ],
    defaultConfig: {},
    introText: 'Create clean transparent backgrounds in seconds. Unlike manual editing in Photoshop, this AI-powered tool handles complex edges like hair, fur, and semi-transparent objects automatically. The output is a high-quality PNG with alpha transparency.',
    locale: 'en',
    canonicalSlug: 'tools/transparent-background-maker',
  },
  'en:tools/ecommerce-background-remover': {
    toolId: 'remove_bg',
    pageType: 'SPOKE',
    h1: 'E-Commerce Background Remover — Product Photo Cleanup',
    metaTitle: 'Free Product Photo Background Remover',
    metaDesc: 'Remove backgrounds from product photos for e-commerce listings. Create clean, professional product images with AI. Free and private.',
    faqJson: [
      { q: 'Is this suitable for Amazon or Shopify listings?', a: 'Yes — the tool creates transparent PNGs perfect for marketplace listings that require white or transparent backgrounds.' },
    ],
    defaultConfig: {},
    introText: 'Built for sellers and marketers who need to process dozens of product photos. Remove cluttered backgrounds from inventory shots and replace them with clean white or transparent backdrops that meet marketplace image requirements.',
    locale: 'en',
    canonicalSlug: 'tools/ecommerce-background-remover',
  },

  // ===========================================================
  // PDF MERGE
  // ===========================================================

  // ---- HUBS ----
  'en:pdf/merge': {
    toolId: 'pdf_merge',
    pageType: 'HUB',
    h1: 'Merge PDF Files — Free & Private',
    metaTitle: 'Free PDF Merger | No Upload, No Signup',
    metaDesc: 'Combine multiple PDFs into one file instantly. Runs 100% in your browser — files never leave your device. Drag & drop reorder. Free, unlimited.',
    faqJson: [
      { q: 'Is it really free and unlimited?', a: 'Yes. No credits, no limits, no account required. All processing happens in your browser.' },
      { q: 'Are my PDFs uploaded to a server?', a: 'No. All merging happens locally using pdf-lib.js. Your documents never leave your browser.' },
    ],
    defaultConfig: {},
    locale: 'en',
    canonicalSlug: 'pdf/merge',
  },
  'de:pdf/zusammenfuehren': {
    toolId: 'pdf_merge',
    pageType: 'HUB',
    h1: 'PDF zusammenführen — Kostenlos & Privat',
    metaTitle: 'PDF zusammenführen | Kostenlos, Unbegrenzt',
    metaDesc: 'Mehrere PDFs zu einer Datei kombinieren. Läuft 100% in Ihrem Browser — Dateien verlassen niemals Ihr Gerät.',
    faqJson: [
      { q: 'Ist es wirklich kostenlos?', a: 'Ja. Keine Credits, keine Limits, keine Anmeldung.' },
    ],
    defaultConfig: {},
    locale: 'de',
    canonicalSlug: 'pdf/merge',
  },

  // ===========================================================
  // PDF SPLIT
  // ===========================================================

  'en:pdf/split': {
    toolId: 'pdf_split',
    pageType: 'HUB',
    h1: 'Split PDF — Free & Private',
    metaTitle: 'Split PDF Online | Free, Unlimited',
    metaDesc: 'Split PDF files by page range, every N pages, or into equal parts. 100% client-side — your documents never leave your browser.',
    faqJson: [
      { q: 'How does the split work?', a: 'Choose extract mode (specific pages), every-N mode (chunks), or equal-parts mode. Processing is instant for most files.' },
      { q: 'Can I split a large PDF?', a: 'Yes. Files up to 200MB+ are handled by your browser. Very large files may be limited by your device memory.' },
    ],
    defaultConfig: {},
    locale: 'en',
    canonicalSlug: 'pdf/split',
  },
  'de:pdf/teilen': {
    toolId: 'pdf_split',
    pageType: 'HUB',
    h1: 'PDF teilen — Kostenlos & Privat',
    metaTitle: 'PDF teilen | Kostenlos, Unbegrenzt',
    metaDesc: 'PDF-Dateien nach Seitenbereich, alle N Seiten oder in gleiche Teile aufteilen. 100% lokal in Ihrem Browser.',
    faqJson: [],
    defaultConfig: {},
    locale: 'de',
    canonicalSlug: 'pdf/split',
  },

  // ---- SPOKES: PDF long-tail (EN) ----
  'en:tools/combine-pdf-files': {
    toolId: 'pdf_merge',
    pageType: 'SPOKE',
    h1: 'Combine PDF Files Into One — Free Online',
    metaTitle: 'Combine PDF Files | Free, No Upload',
    metaDesc: 'Combine multiple PDF files into a single document. Drag and drop to reorder. Free, private, no signup required.',
    faqJson: [],
    defaultConfig: {},
    introText: 'Have multiple PDF files that belong together? Drop them all here and the tool will combine them into a single, seamless document. Drag to reorder before merging — your files stay on your device the entire time.',
    locale: 'en',
    canonicalSlug: 'tools/combine-pdf-files',
  },
  'en:tools/extract-pages-from-pdf': {
    toolId: 'pdf_split',
    pageType: 'SPOKE',
    h1: 'Extract Pages from PDF — Free Page Extractor',
    metaTitle: 'Extract PDF Pages | Free Online',
    metaDesc: 'Extract specific pages from any PDF. Select page ranges like 1-5, 8, 12-15. Free and runs entirely in your browser.',
    faqJson: [],
    defaultConfig: {},
    introText: 'Need just a few pages from a large PDF? Enter specific page numbers or ranges (like 1-5, 8, 12-15) and the tool will extract only those pages into a new, smaller PDF. Perfect for pulling relevant sections from reports or contracts.',
    locale: 'en',
    canonicalSlug: 'tools/extract-pages-from-pdf',
  },
  'en:tools/split-pdf-by-pages': {
    toolId: 'pdf_split',
    pageType: 'SPOKE',
    h1: 'Split PDF by Pages — Free PDF Splitter',
    metaTitle: 'Split PDF by Pages | Free Online',
    metaDesc: 'Split a PDF into multiple files by page number. Choose every N pages or split into equal parts. Unlimited and free.',
    faqJson: [],
    defaultConfig: {},
    introText: 'Split a large PDF into smaller files by specifying page numbers. Choose to split every N pages, into equal parts, or by custom ranges. Each resulting file is a standalone PDF that preserves the original formatting.',
    locale: 'en',
    canonicalSlug: 'tools/split-pdf-by-pages',
  },

  // ---- SPOKES: PDF Merge additional long-tail (EN) ----
  'en:tools/merge-pdf-files-online': {
    toolId: 'pdf_merge',
    pageType: 'SPOKE',
    h1: 'Merge PDF Files Online — Free PDF Merger',
    metaTitle: 'Merge PDF Files Online | Free, Private',
    metaDesc: 'Merge PDF files online for free. No upload, no signup — combine documents instantly in your browser. Unlimited use.',
    faqJson: [
      { q: 'Can I merge PDFs without uploading them?', a: 'Yes. This tool runs entirely in your browser. Your PDF files never touch a server.' },
    ],
    defaultConfig: {},
    introText: 'Merging PDFs online usually means uploading sensitive documents to someone else\'s server. Not here. This merger runs entirely in your browser — your files never leave your device, and there are no daily limits or file size restrictions.',
    locale: 'en',
    canonicalSlug: 'tools/merge-pdf-files-online',
  },
  'en:tools/join-pdf-documents': {
    toolId: 'pdf_merge',
    pageType: 'SPOKE',
    h1: 'Join PDF Documents — Free PDF Joiner',
    metaTitle: 'Join PDF Documents | Free Online PDF Joiner',
    metaDesc: 'Join multiple PDF documents into one file. Drag and drop to reorder pages. 100% free and private — no files uploaded.',
    faqJson: [
      { q: 'What does "join PDFs" mean?', a: 'Joining PDFs combines multiple separate PDF files into a single continuous document, preserving all original content.' },
    ],
    defaultConfig: {},
    introText: 'Joining PDFs means appending one document after another into a single file. This is ideal for combining chapters, report sections, or scanned pages into one organized document while preserving all formatting and bookmarks.',
    locale: 'en',
    canonicalSlug: 'tools/join-pdf-documents',
  },
  'en:tools/merge-two-pdfs': {
    toolId: 'pdf_merge',
    pageType: 'SPOKE',
    h1: 'Merge Two PDFs Into One — Quick & Free',
    metaTitle: 'Merge Two PDFs | Free, Instant',
    metaDesc: 'Need to merge just two PDF files? Drop them here and combine them into one document instantly. Free and private.',
    faqJson: [
      { q: 'Can I merge exactly two PDFs?', a: 'Yes — drop your two files and click Merge. You can also add more files if needed.' },
    ],
    defaultConfig: {},
    introText: 'Sometimes you just need to combine two PDFs — a cover letter and a resume, or a form and its attachment. Drop your two files, arrange the order, and download one combined PDF in seconds.',
    locale: 'en',
    canonicalSlug: 'tools/merge-two-pdfs',
  },
  'en:tools/pdf-joiner': {
    toolId: 'pdf_merge',
    pageType: 'SPOKE',
    h1: 'PDF Joiner — Combine PDFs Instantly',
    metaTitle: 'PDF Joiner | Free Online Tool',
    metaDesc: 'Free PDF joiner that combines multiple files into one document. Works offline in your browser. No limits, no account.',
    faqJson: [],
    defaultConfig: {},
    introText: 'A fast, lightweight PDF joiner for when you need to combine files without installing software. Works offline after the page loads — perfect for combining documents on the go, even without an internet connection.',
    locale: 'en',
    canonicalSlug: 'tools/pdf-joiner',
  },
  'en:tools/merge-pdf-free': {
    toolId: 'pdf_merge',
    pageType: 'SPOKE',
    h1: 'Merge PDF Free — No Limits, No Signup',
    metaTitle: 'Merge PDF Free | No Limits, No Upload',
    metaDesc: 'Merge PDFs for free with no restrictions. No daily limits, no file size caps, no account needed. 100% browser-based.',
    faqJson: [
      { q: 'Are there any hidden limits?', a: 'No. The tool is completely free with no daily limits, no file size restrictions, and no account requirement.' },
    ],
    defaultConfig: {},
    introText: 'Most "free" PDF tools impose daily limits, watermarks, or require an account. This tool has none of that. Merge unlimited PDFs of any size, as many times as you want. No catches, no upsells — genuinely free.',
    locale: 'en',
    canonicalSlug: 'tools/merge-pdf-free',
  },
  'en:tools/combine-pdfs-into-one': {
    toolId: 'pdf_merge',
    pageType: 'SPOKE',
    h1: 'Combine PDFs Into One Document — Free Tool',
    metaTitle: 'Combine PDFs Into One | Free Online',
    metaDesc: 'Combine multiple PDFs into one single document online for free. Reorder, merge, and download instantly. No server upload.',
    faqJson: [],
    defaultConfig: {},
    introText: 'Combine multiple PDFs into one organized document. Ideal for assembling reports from separate sections, consolidating invoices, or packaging application materials into a single file for submission.',
    locale: 'en',
    canonicalSlug: 'tools/combine-pdfs-into-one',
  },

  // ---- SPOKES: PDF Split additional long-tail (EN) ----
  'en:tools/split-pdf-online-free': {
    toolId: 'pdf_split',
    pageType: 'SPOKE',
    h1: 'Split PDF Online Free — No Upload Required',
    metaTitle: 'Split PDF Online Free | No Upload',
    metaDesc: 'Split PDF files online for free without uploading. Extract pages, split by range, or divide equally. 100% browser-based.',
    faqJson: [
      { q: 'Do I need to upload my PDF?', a: 'No. The tool processes your PDF entirely in your browser. Nothing is uploaded to any server.' },
    ],
    defaultConfig: {},
    introText: 'Split your PDFs without uploading them to any server. Unlike most online PDF splitters, this tool processes files entirely in your browser — ensuring complete privacy for sensitive documents like contracts, medical records, or financial statements.',
    locale: 'en',
    canonicalSlug: 'tools/split-pdf-online-free',
  },
  'en:tools/divide-pdf-into-pages': {
    toolId: 'pdf_split',
    pageType: 'SPOKE',
    h1: 'Divide PDF Into Individual Pages — Free',
    metaTitle: 'Divide PDF Into Pages | Free Online',
    metaDesc: 'Divide a PDF into individual pages. Each page becomes a separate PDF file. Free, instant, no signup needed.',
    faqJson: [
      { q: 'Can I split a PDF into single pages?', a: 'Yes — use the "Every 1 Page" mode to create a separate PDF for each page in your document.' },
    ],
    defaultConfig: {},
    introText: 'Turn a multi-page PDF into individual single-page files. Use the "Every 1 Page" mode to automatically create a separate PDF for each page — ideal for distributing handouts, archiving individual forms, or organizing scanned documents.',
    locale: 'en',
    canonicalSlug: 'tools/divide-pdf-into-pages',
  },
  'en:tools/separate-pdf-pages': {
    toolId: 'pdf_split',
    pageType: 'SPOKE',
    h1: 'Separate PDF Pages — Free PDF Page Separator',
    metaTitle: 'Separate PDF Pages | Free Online Tool',
    metaDesc: 'Separate specific pages from a PDF document. Select pages by number or range, then download. Free and private.',
    faqJson: [],
    defaultConfig: {},
    introText: 'Separate specific pages from a PDF into their own file. Whether you need to remove a cover page, extract an appendix, or isolate a few pages for sharing — select the pages you want and download them as a clean, standalone PDF.',
    locale: 'en',
    canonicalSlug: 'tools/separate-pdf-pages',
  },
  'en:tools/pdf-page-extractor': {
    toolId: 'pdf_split',
    pageType: 'SPOKE',
    h1: 'PDF Page Extractor — Extract Specific Pages',
    metaTitle: 'PDF Page Extractor | Free Online',
    metaDesc: 'Extract specific pages from any PDF file. Enter page numbers like 1, 3-5, 8 and download the extracted pages. Free tool.',
    faqJson: [
      { q: 'How do I select which pages to extract?', a: 'Enter page numbers or ranges separated by commas, like "1, 3-5, 8-12". The tool creates a new PDF with only those pages.' },
    ],
    defaultConfig: {},
    introText: 'A precision page extractor for when you know exactly which pages you need. Enter page numbers and ranges (e.g., "1, 3-5, 8-12") and the tool builds a new PDF containing only those pages — perfect for cherry-picking content from long documents.',
    locale: 'en',
    canonicalSlug: 'tools/pdf-page-extractor',
  },

  'de:werkzeuge/pdf-dateien-zusammenfuehren': {
    toolId: 'pdf_merge',
    pageType: 'SPOKE',
    h1: 'PDF-Dateien zusammenführen — Kostenlos',
    metaTitle: 'PDF-Dateien zusammenführen | Kostenlos',
    metaDesc: 'Mehrere PDF-Dateien zu einem Dokument zusammenführen. Per Drag-and-Drop umordnen. Kostenlos und privat.',
    faqJson: [],
    defaultConfig: {},
    locale: 'de',
    canonicalSlug: 'tools/combine-pdf-files',
  },
  'de:werkzeuge/seiten-aus-pdf-extrahieren': {
    toolId: 'pdf_split',
    pageType: 'SPOKE',
    h1: 'Seiten aus PDF extrahieren — Kostenloser Seitenextraktor',
    metaTitle: 'PDF-Seiten extrahieren | Kostenlos',
    metaDesc: 'Bestimmte Seiten aus einer PDF extrahieren. Wählen Sie Seitenbereiche wie 1-5, 8, 12-15. Kostenlos.',
    faqJson: [],
    defaultConfig: {},
    locale: 'de',
    canonicalSlug: 'tools/extract-pages-from-pdf',
  },
  'de:werkzeuge/pdf-nach-seiten-teilen': {
    toolId: 'pdf_split',
    pageType: 'SPOKE',
    h1: 'PDF nach Seiten teilen — Kostenloser PDF-Splitter',
    metaTitle: 'PDF nach Seiten teilen | Kostenlos',
    metaDesc: 'Eine PDF in mehrere Dateien nach Seitenzahl aufteilen. Alle N Seiten oder in gleiche Teile. Unbegrenzt und kostenlos.',
    faqJson: [],
    defaultConfig: {},
    locale: 'de',
    canonicalSlug: 'tools/split-pdf-by-pages',
  },

  // ---- ALTERNATIVES: PDF ----
  'en:alternatives/ilovepdf-free-alternative': {
    toolId: 'pdf_merge',
    pageType: 'ALTERNATIVE',
    h1: 'Free iLovePDF Alternative — No Upload, Unlimited',
    metaTitle: 'iLovePDF Free Alternative | No Limits',
    metaDesc: 'Free iLovePDF alternative that merges, splits, and processes PDFs without uploading files to any server. No ads, no file size limits, no daily restrictions.',
    introText: 'iLovePDF is one of the most popular online PDF tools — but it uploads your files to their servers, limits free users to 25MB files, shows ads, and restricts daily usage. Our privacy-first alternative processes PDFs entirely in your browser. No uploads, no ads, no file size limits, no daily caps.',
    faqJson: [
      { q: 'How does this compare to iLovePDF?', a: 'iLovePDF uploads your files to their servers and limits free users to 25MB per file with ads. Our tool runs locally — your files never leave your browser.' },
      { q: 'Does iLovePDF have file size limits?', a: 'Yes — iLovePDF free plan limits files to 25MB. Our tool handles PDFs of any size, limited only by your device memory.' },
      { q: 'Are there daily usage limits?', a: 'No. Unlike iLovePDF which restricts free users to a handful of tasks per day, our tool has zero daily limits. Use it as much as you need.' },
      { q: 'Is my data safe with iLovePDF?', a: 'iLovePDF processes files on remote servers. While they claim to delete files after processing, your documents do leave your device. Our tool never uploads anything.' },
      { q: 'Which PDF tools are available?', a: 'We offer merge, split, password protection, watermark, page numbering, signing, and form filling — covering the most-used iLovePDF features, all running locally.' },
    ],
    defaultConfig: {},
    locale: 'en',
    canonicalSlug: 'alternatives/ilovepdf-free-alternative',
  },
  'de:alternativen/ilovepdf-kostenlose-alternative': {
    toolId: 'pdf_merge',
    pageType: 'ALTERNATIVE',
    h1: 'Kostenlose iLovePDF Alternative — Ohne Upload, Unbegrenzt',
    metaTitle: 'iLovePDF kostenlose Alternative | Ohne Limits',
    metaDesc: 'Suchen Sie eine kostenlose Alternative zu iLovePDF? PDFs zusammenführen und teilen ohne Dateien hochzuladen.',
    faqJson: [],
    defaultConfig: {},
    locale: 'de',
    canonicalSlug: 'alternatives/ilovepdf-free-alternative',
  },
  'en:alternatives/smallpdf-free-alternative': {
    toolId: 'pdf_split',
    pageType: 'ALTERNATIVE',
    h1: 'Free Smallpdf Alternative — No Daily Limits',
    metaTitle: 'Smallpdf Free Alternative | Unlimited',
    metaDesc: 'Free Smallpdf alternative with no 5MB file limit and no daily task restrictions. Split, merge, and process PDFs locally in your browser. Unlimited and private.',
    introText: 'Smallpdf is a well-known PDF suite — but its free tier is severely limited: 5MB file cap, 2 tasks per day, watermarks on some outputs, and mandatory cloud uploads. Our alternative lifts all those restrictions: unlimited file sizes, unlimited tasks, no watermarks, and complete privacy since everything runs in your browser.',
    faqJson: [
      { q: 'How does this compare to Smallpdf?', a: 'Smallpdf limits free users to 5MB files and 2 tasks per day. Our tool is unlimited in both file size and usage, with no daily restrictions.' },
      { q: 'Does Smallpdf upload my files?', a: 'Yes — Smallpdf processes everything in the cloud. Your PDFs are uploaded to their servers. Our tool processes files locally in your browser.' },
      { q: 'Is Smallpdf really free?', a: 'Smallpdf heavily restricts free users to push upgrades ($12/month). Our tool is genuinely free with no premium tier, no upsells, and no feature gating.' },
      { q: 'Which Smallpdf features are available here?', a: 'We cover merge, split, password protection, watermark, page numbering, signing, and form filling — the core Smallpdf features, all running locally.' },
      { q: 'Can I process large PDFs?', a: 'Yes. Unlike Smallpdf\'s 5MB limit, our tool handles PDFs of any size. Processing speed depends on your device but there is no artificial file size cap.' },
    ],
    defaultConfig: {},
    locale: 'en',
    canonicalSlug: 'alternatives/smallpdf-free-alternative',
  },
  'de:alternativen/smallpdf-kostenlose-alternative': {
    toolId: 'pdf_split',
    pageType: 'ALTERNATIVE',
    h1: 'Kostenlose Smallpdf Alternative — Ohne tägliche Limits',
    metaTitle: 'Smallpdf kostenlose Alternative | Unbegrenzt',
    metaDesc: 'Suchen Sie eine kostenlose Alternative zu Smallpdf? Keine 5MB-Begrenzung, keine täglichen Aufgabenlimits.',
    faqJson: [],
    defaultConfig: {},
    locale: 'de',
    canonicalSlug: 'alternatives/smallpdf-free-alternative',
  },

  // ===========================================================
  // IMAGE COMPRESSOR
  // ===========================================================

  // ---- HUBS ----
  'en:image/compress-image': {
    toolId: 'image_compressor',
    pageType: 'HUB',
    h1: 'Compress Images — Free & Private',
    metaTitle: 'Free Image Compressor | No Upload',
    metaDesc: 'Reduce image file sizes instantly — PNG, JPG, WebP. Runs 100% in your browser. No upload to servers, no quality loss, no limits.',
    faqJson: [
      { q: 'Is it really free and unlimited?', a: 'Yes. No credits, no limits, no account required. All compression happens in your browser using Canvas API.' },
      { q: 'Are my images uploaded to a server?', a: 'No. All processing happens locally on your device. Your images never leave your browser.' },
      { q: 'What formats are supported?', a: 'PNG, JPEG, and WebP. You can also convert between formats while compressing.' },
      { q: 'How much can I reduce file size?', a: 'Typically 40–80% for JPEG/WebP, depending on quality settings. PNG compression is lossless and varies by image content.' },
    ],
    defaultConfig: {},
    locale: 'en',
    canonicalSlug: 'image/compress-image',
  },
  'de:bild/bild-komprimieren': {
    toolId: 'image_compressor',
    pageType: 'HUB',
    h1: 'Bilder komprimieren — Kostenlos & Privat',
    metaTitle: 'Bilder komprimieren | Kostenlos, Unbegrenzt',
    metaDesc: 'Bildgrößen sofort reduzieren — PNG, JPG, WebP. 100% im Browser. Kein Upload, kein Qualitätsverlust, keine Limits.',
    faqJson: [
      { q: 'Ist es wirklich kostenlos?', a: 'Ja. Keine Credits, keine Limits, keine Anmeldung. Alles passiert lokal in Ihrem Browser.' },
      { q: 'Werden meine Bilder hochgeladen?', a: 'Nein. Die gesamte Verarbeitung erfolgt lokal auf Ihrem Gerät.' },
    ],
    defaultConfig: {},
    locale: 'de',
    canonicalSlug: 'image/compress-image',
  },

  // ---- SPOKES: Image Compressor long-tail (EN) ----
  'en:tools/compress-png-online': {
    toolId: 'image_compressor',
    pageType: 'SPOKE',
    h1: 'Compress PNG Online — Free PNG Optimizer',
    metaTitle: 'Compress PNG Online | Free, No Upload',
    metaDesc: 'Reduce PNG file sizes without losing quality. Convert to WebP for even smaller files. Free, private, runs in your browser.',
    faqJson: [
      { q: 'Does compressing a PNG reduce quality?', a: 'If you output as PNG, the compression is lossless. For maximum savings, convert to WebP or JPEG.' },
    ],
    defaultConfig: { outputFormat: 'png' },
    introText: 'PNG files are lossless but can be surprisingly large. This optimizer reduces PNG file sizes while preserving every pixel of quality. For even smaller files, convert to WebP format which typically achieves 30% better compression than PNG.',
    locale: 'en',
    canonicalSlug: 'tools/compress-png-online',
  },
  'en:tools/compress-jpg-online': {
    toolId: 'image_compressor',
    pageType: 'SPOKE',
    h1: 'Compress JPG Online — Free JPEG Optimizer',
    metaTitle: 'Compress JPG Online | Free, Unlimited',
    metaDesc: 'Reduce JPG file sizes by up to 80%. Adjustable quality slider for the perfect size/quality balance. Free and private.',
    faqJson: [
      { q: 'How much can I compress a JPG?', a: 'Typically 50–80% reduction at quality 70–80. Use the slider to find the right balance for your needs.' },
    ],
    defaultConfig: { outputFormat: 'jpeg', quality: 75 },
    introText: 'JPG is the most common photo format, but camera files are often much larger than necessary. Use the quality slider to find the perfect balance — most photos look identical at 75% quality but are 50-80% smaller. Ideal for web, email, and social media.',
    locale: 'en',
    canonicalSlug: 'tools/compress-jpg-online',
  },
  'en:tools/reduce-image-file-size': {
    toolId: 'image_compressor',
    pageType: 'SPOKE',
    h1: 'Reduce Image File Size — Free Online',
    metaTitle: 'Reduce Image File Size | Free, No Upload',
    metaDesc: 'Make images smaller for email, websites, and social media. Batch compress multiple images at once. Free, private, no signup.',
    faqJson: [],
    defaultConfig: {},
    introText: 'Need smaller images for email attachments, website uploads, or social media? This tool reduces file sizes dramatically while keeping images looking sharp. Supports batch processing — drop multiple images and compress them all at once.',
    locale: 'en',
    canonicalSlug: 'tools/reduce-image-file-size',
  },

  // ---- SPOKES: Image Compressor long-tail (DE) ----
  'de:werkzeuge/png-komprimieren': {
    toolId: 'image_compressor',
    pageType: 'SPOKE',
    h1: 'PNG komprimieren — Kostenloser PNG-Optimierer',
    metaTitle: 'PNG komprimieren | Kostenlos',
    metaDesc: 'PNG-Dateigrößen reduzieren ohne Qualitätsverlust. Für noch kleinere Dateien in WebP konvertieren. Kostenlos und privat.',
    faqJson: [],
    defaultConfig: { outputFormat: 'png' },
    locale: 'de',
    canonicalSlug: 'tools/compress-png-online',
  },
  'de:werkzeuge/jpg-komprimieren': {
    toolId: 'image_compressor',
    pageType: 'SPOKE',
    h1: 'JPG komprimieren — Kostenloser JPEG-Optimierer',
    metaTitle: 'JPG komprimieren | Kostenlos',
    metaDesc: 'JPG-Dateigrößen um bis zu 80% reduzieren. Einstellbarer Qualitätsregler. Kostenlos und privat.',
    faqJson: [],
    defaultConfig: { outputFormat: 'jpeg', quality: 75 },
    locale: 'de',
    canonicalSlug: 'tools/compress-jpg-online',
  },
  'de:werkzeuge/bilddateigroesse-reduzieren': {
    toolId: 'image_compressor',
    pageType: 'SPOKE',
    h1: 'Bilddateigröße reduzieren — Kostenlos',
    metaTitle: 'Bilddateigröße reduzieren | Kostenlos',
    metaDesc: 'Bilder für E-Mail, Websites und Social Media verkleinern. Mehrere Bilder gleichzeitig komprimieren. Kostenlos.',
    faqJson: [],
    defaultConfig: {},
    locale: 'de',
    canonicalSlug: 'tools/reduce-image-file-size',
  },

  // ---- ALTERNATIVES: Image Compressor ----
  'en:alternatives/tinypng-free-alternative': {
    toolId: 'image_compressor',
    pageType: 'ALTERNATIVE',
    h1: 'Free TinyPNG Alternative — No Upload, Unlimited',
    metaTitle: 'TinyPNG Free Alternative | No Limits',
    metaDesc: 'Free TinyPNG alternative that compresses images without uploading to servers. No 500-image monthly limit, no API key needed. Full quality control.',
    introText: 'TinyPNG is a popular image compression service — but it uploads your images to remote servers, limits free users to 500 images per month, and restricts file sizes to 5MB. Our alternative compresses images locally in your browser with no uploads, no monthly limits, and full control over the quality slider.',
    faqJson: [
      { q: 'How does this compare to TinyPNG?', a: 'TinyPNG uploads your files to their servers and limits free users to 500 images/month. Our tool runs locally — unlimited, instant, private.' },
      { q: 'Is the quality comparable?', a: 'Yes. Both use lossy compression for JPEG/WebP. Our tool gives you full control over the quality slider so you can find the perfect size/quality balance.' },
      { q: 'Does TinyPNG have file size limits?', a: 'Yes — TinyPNG free plan limits files to 5MB. Our tool has no file size restrictions.' },
      { q: 'Can I compress PNG files losslessly?', a: 'Yes. When you output as PNG, compression is lossless — no quality loss at all. TinyPNG uses lossy PNG compression which does reduce quality slightly.' },
      { q: 'Does TinyPNG keep my images?', a: 'TinyPNG uploads your images to their cloud servers. Our tool never uploads anything — all compression happens locally in your browser.' },
    ],
    defaultConfig: {},
    locale: 'en',
    canonicalSlug: 'alternatives/tinypng-free-alternative',
  },
  'de:alternativen/tinypng-kostenlose-alternative': {
    toolId: 'image_compressor',
    pageType: 'ALTERNATIVE',
    h1: 'Kostenlose TinyPNG Alternative — Ohne Upload, Unbegrenzt',
    metaTitle: 'TinyPNG kostenlose Alternative | Ohne Limits',
    metaDesc: 'Suchen Sie eine kostenlose Alternative zu TinyPNG? Bilder komprimieren ohne Dateien hochzuladen. Keine monatlichen Limits.',
    faqJson: [
      { q: 'Wie unterscheidet sich das von TinyPNG?', a: 'TinyPNG lädt Ihre Dateien auf deren Server und limitiert kostenlose Nutzer auf 500 Bilder/Monat. Unser Tool läuft lokal — unbegrenzt, sofort, privat.' },
    ],
    defaultConfig: {},
    locale: 'de',
    canonicalSlug: 'alternatives/tinypng-free-alternative',
  },
  'en:alternatives/squoosh-free-alternative': {
    toolId: 'image_compressor',
    pageType: 'ALTERNATIVE',
    h1: 'Free Squoosh Alternative — Batch Compress Images',
    metaTitle: 'Free Squoosh Alternative | Batch Support',
    metaDesc: 'Love Squoosh but need batch compression? Our tool compresses multiple images at once with format conversion support. Free, private, runs in your browser.',
    introText: 'Squoosh (by Google Chrome Labs) is an excellent single-image compression tool — but it only processes one image at a time with no batch support. Our alternative adds batch processing, format conversion between PNG/JPG/WebP, and the same in-browser privacy. Process dozens of images at once instead of one by one.',
    faqJson: [
      { q: 'How does this compare to Squoosh?', a: 'Squoosh only handles one image at a time. Our tool supports batch compression of multiple images while keeping the same in-browser privacy.' },
      { q: 'Does Squoosh support batch processing?', a: 'No. Squoosh can only compress one image at a time. Our tool lets you drop dozens of images and compress them all simultaneously.' },
      { q: 'Which formats does this support?', a: 'Input: PNG, JPG, WebP, BMP, GIF, AVIF. Output: PNG, JPG, or WebP. Squoosh supports similar formats but one file at a time.' },
      { q: 'Is Squoosh still maintained?', a: 'Squoosh is an open-source project by Google Chrome Labs. While functional, development has slowed. Our tool is actively maintained and updated.' },
      { q: 'Can I adjust quality like in Squoosh?', a: 'Yes — we provide the same quality slider control. Drag to find the perfect balance between file size and visual quality.' },
    ],
    defaultConfig: {},
    locale: 'en',
    canonicalSlug: 'alternatives/squoosh-free-alternative',
  },
  'de:alternativen/squoosh-kostenlose-alternative': {
    toolId: 'image_compressor',
    pageType: 'ALTERNATIVE',
    h1: 'Kostenlose Squoosh Alternative — Mehrere Bilder komprimieren',
    metaTitle: 'Squoosh Alternative | Kostenlos, Batch',
    metaDesc: 'Squoosh kann nur ein Bild gleichzeitig. Unser Tool komprimiert mehrere Bilder gleichzeitig, alles im Browser.',
    faqJson: [],
    defaultConfig: {},
    locale: 'de',
    canonicalSlug: 'alternatives/squoosh-free-alternative',
  },

  // ===========================================================
  // PHOTO TO COLORING PAGE
  // ===========================================================

  // ---- HUBS ----
  'en:image/photo-to-coloring-page': {
    toolId: 'coloring_page',
    pageType: 'HUB',
    h1: 'Photo to Coloring Page — Free & Private',
    metaTitle: 'Photo to Coloring Page | Free Online Converter',
    metaDesc: 'Turn any photo into a printable coloring page instantly. Adjust edge sensitivity, line thickness, and smoothing. Runs 100% in your browser — no upload required.',
    faqJson: [
      { q: 'Is it really free?', a: 'Yes. No limits, no account required. The tool runs entirely in your browser using Canvas API.' },
      { q: 'Are my photos uploaded?', a: 'No. All processing happens locally on your device. Your photos never leave your browser.' },
      { q: 'What photos work best?', a: 'Photos with clear subjects and good contrast work best. Portraits, animals, and simple objects produce the cleanest coloring pages.' },
      { q: 'Can I print the result?', a: 'Yes! The output is a high-resolution PNG with clean black lines on white background — perfect for printing.' },
    ],
    defaultConfig: {},
    locale: 'en',
    canonicalSlug: 'image/photo-to-coloring-page',
  },
  'de:bild/foto-als-ausmalbild': {
    toolId: 'coloring_page',
    pageType: 'HUB',
    h1: 'Foto als Ausmalbild — Kostenlos & Privat',
    metaTitle: 'Foto als Ausmalbild | Kostenlos, Ohne Upload',
    metaDesc: 'Verwandeln Sie jedes Foto in ein druckbares Ausmalbild. Empfindlichkeit, Linienstärke und Glättung einstellen. 100% im Browser.',
    faqJson: [
      { q: 'Ist es wirklich kostenlos?', a: 'Ja. Keine Limits, keine Anmeldung. Alles passiert lokal in Ihrem Browser.' },
      { q: 'Werden meine Fotos hochgeladen?', a: 'Nein. Die gesamte Verarbeitung erfolgt lokal auf Ihrem Gerät.' },
    ],
    defaultConfig: {},
    locale: 'de',
    canonicalSlug: 'image/photo-to-coloring-page',
  },

  // ---- SPOKES: Coloring Page long-tail (EN) ----
  'en:tools/turn-photo-into-coloring-page': {
    toolId: 'coloring_page',
    pageType: 'SPOKE',
    h1: 'Turn Photo Into Coloring Page — Free for Parents & Teachers',
    metaTitle: 'Turn Photo Into Coloring Page | Free for Kids',
    metaDesc: 'Transform family photos, pet pictures, and nature shots into printable coloring pages. Perfect for kids, classrooms, and rainy days. Free and private.',
    faqJson: [
      { q: 'Is this safe for my kids\' photos?', a: 'Absolutely. Your photos never leave your device — all processing happens locally in your browser.' },
    ],
    defaultConfig: {},
    introText: 'Turn your family photos, pet pictures, and favorite snapshots into printable coloring pages your kids will love. Great for rainy day activities, classroom worksheets, or personalized party favors — all created privately on your device.',
    locale: 'en',
    canonicalSlug: 'tools/turn-photo-into-coloring-page',
  },
  'en:tools/photo-to-line-art': {
    toolId: 'coloring_page',
    pageType: 'SPOKE',
    h1: 'Photo to Line Art — Free Line Drawing Converter',
    metaTitle: 'Photo to Line Art | Free Online Converter',
    metaDesc: 'Convert photos to clean line art drawings. Uses edge detection to extract outlines. Perfect for illustration reference, tattoo design, and art projects.',
    faqJson: [],
    defaultConfig: { sensitivity: 60 },
    introText: 'Extract clean line drawings from photographs using edge detection algorithms. The result is a black-and-white line art rendition perfect for illustration reference, tattoo stencils, embroidery patterns, or digital art base layers.',
    locale: 'en',
    canonicalSlug: 'tools/photo-to-line-art',
  },
  'en:tools/create-coloring-book-pages-for-kdp': {
    toolId: 'coloring_page',
    pageType: 'SPOKE',
    h1: 'Create Coloring Book Pages for Amazon KDP — Free Tool',
    metaTitle: 'Coloring Book Pages for KDP | Free Generator',
    metaDesc: 'Create printable coloring book pages from photos for Amazon KDP publishing. High-resolution PNG output. Free, unlimited, no watermarks.',
    faqJson: [
      { q: 'Can I use these pages for commercial KDP publishing?', a: 'Yes. You own the output. However, make sure you have rights to the source photos.' },
      { q: 'What resolution should I use for KDP?', a: 'Use high-resolution source photos (at least 2400×3000px). Our tool preserves the input resolution for print-quality output.' },
    ],
    defaultConfig: { sensitivity: 45, lineThickness: 3 },
    introText: 'Turn photographs into print-ready coloring book pages sized for Amazon KDP publishing. The tool generates high-resolution PNG output with clean line work — no hand-drawing skills needed. Create entire coloring books from your photo library.',
    locale: 'en',
    canonicalSlug: 'tools/create-coloring-book-pages-for-kdp',
  },

  // ---- SPOKES: Coloring Page long-tail (DE) ----
  'de:werkzeuge/foto-in-ausmalbild-verwandeln': {
    toolId: 'coloring_page',
    pageType: 'SPOKE',
    h1: 'Foto in Ausmalbild verwandeln — Kostenlos für Eltern & Lehrer',
    metaTitle: 'Foto in Ausmalbild | Kostenlos',
    metaDesc: 'Familienfotos, Haustierbilder und Naturaufnahmen in druckbare Ausmalbilder verwandeln. Perfekt für Kinder und Klassenzimmer.',
    faqJson: [],
    defaultConfig: {},
    locale: 'de',
    canonicalSlug: 'tools/turn-photo-into-coloring-page',
  },
  'de:werkzeuge/foto-zu-strichzeichnung': {
    toolId: 'coloring_page',
    pageType: 'SPOKE',
    h1: 'Foto zu Strichzeichnung — Kostenloser Konverter',
    metaTitle: 'Foto zu Strichzeichnung | Kostenlos',
    metaDesc: 'Fotos in saubere Strichzeichnungen umwandeln. Kantenerkennung extrahiert Umrisse. Perfekt für Illustration und Kunstprojekte.',
    faqJson: [],
    defaultConfig: { sensitivity: 60 },
    locale: 'de',
    canonicalSlug: 'tools/photo-to-line-art',
  },
  'de:werkzeuge/ausmalbuch-seiten-erstellen': {
    toolId: 'coloring_page',
    pageType: 'SPOKE',
    h1: 'Ausmalbuch-Seiten erstellen — Kostenloses Tool',
    metaTitle: 'Ausmalbuch-Seiten erstellen | Kostenlos',
    metaDesc: 'Druckbare Ausmalbuch-Seiten aus Fotos erstellen. Hochauflösende PNG-Ausgabe. Kostenlos, unbegrenzt, ohne Wasserzeichen.',
    faqJson: [],
    defaultConfig: { sensitivity: 45, lineThickness: 3 },
    locale: 'de',
    canonicalSlug: 'tools/create-coloring-book-pages-for-kdp',
  },

  // ---- ALTERNATIVES: Coloring Page ----
  'en:alternatives/colorbliss-free-alternative': {
    toolId: 'coloring_page',
    pageType: 'ALTERNATIVE',
    h1: 'Free ColorBliss Alternative — No Account, Unlimited',
    metaTitle: 'ColorBliss Free Alternative | No Limits',
    metaDesc: 'Free ColorBliss alternative: create coloring pages from your own photos with no account, no limits, and no uploads. Runs 100% in your browser.',
    introText: 'ColorBliss offers pre-made coloring pages and requires an account. Our tool takes a completely different approach: upload your own photos and convert them into custom coloring pages instantly. No account needed, no limits, and your photos never leave your device.',
    faqJson: [
      { q: 'How does this compare to ColorBliss?', a: 'ColorBliss provides pre-made coloring pages and requires an account. Our tool lets you create custom coloring pages from your own photos — unlimited and private.' },
      { q: 'Can I use my own photos?', a: 'Yes — that is the core feature. Upload any photo (family, pets, nature) and convert it into a printable coloring page with adjustable edge sensitivity.' },
      { q: 'Is an account required?', a: 'No. No signup, no email, no payment. Just drop a photo and download your coloring page.' },
      { q: 'Can I print the coloring pages?', a: 'Yes. The output is a high-resolution PNG with clean black lines on a white background — perfect for home or classroom printing.' },
      { q: 'Can I adjust the line style?', a: 'Yes. You can control edge sensitivity, line thickness, and smoothing to get exactly the look you want — from simple outlines to detailed sketches.' },
    ],
    defaultConfig: {},
    locale: 'en',
    canonicalSlug: 'alternatives/colorbliss-free-alternative',
  },
  'de:alternativen/colorbliss-kostenlose-alternative': {
    toolId: 'coloring_page',
    pageType: 'ALTERNATIVE',
    h1: 'Kostenlose ColorBliss Alternative — Ohne Konto, Unbegrenzt',
    metaTitle: 'ColorBliss kostenlose Alternative | Ohne Limits',
    metaDesc: 'Suchen Sie eine kostenlose Alternative zu ColorBliss? Ausmalbilder aus Fotos erstellen, unbegrenzt, ohne Anmeldung.',
    faqJson: [],
    defaultConfig: {},
    locale: 'de',
    canonicalSlug: 'alternatives/colorbliss-free-alternative',
  },
  'en:alternatives/crayola-coloring-page-free-alternative': {
    toolId: 'coloring_page',
    pageType: 'ALTERNATIVE',
    h1: 'Free Crayola Coloring Page Maker Alternative',
    metaTitle: 'Crayola Coloring Page Alternative | Free',
    metaDesc: 'Create custom coloring pages from your own photos — no app download, no signup. A free, browser-based alternative to Crayola\'s coloring page maker.',
    introText: 'Crayola\'s coloring page maker requires downloading a mobile app, and its customization options are limited to pre-built templates. Our browser-based alternative lets you turn any photo into a coloring page with full control over edge sensitivity, line thickness, and smoothing — no app needed.',
    faqJson: [
      { q: 'How does this compare to Crayola?', a: 'Crayola\'s tool requires a mobile app and uses pre-built templates. Our tool works in any browser, uses your own photos, and gives you full control over line style.' },
      { q: 'Do I need to download an app?', a: 'No. Our tool runs entirely in your web browser — desktop, tablet, or phone. No app installation required.' },
      { q: 'Can I use my own photos?', a: 'Yes. Unlike Crayola which primarily offers templates, our tool converts any photo you upload into a unique coloring page.' },
      { q: 'Is this safe for children\'s photos?', a: 'Absolutely. Your photos are processed locally in your browser and never uploaded to any server. Complete privacy for your family photos.' },
      { q: 'Can I create pages for KDP publishing?', a: 'Yes. Our tool produces high-resolution output suitable for Amazon KDP coloring book publishing. You own full rights to the output.' },
    ],
    defaultConfig: {},
    locale: 'en',
    canonicalSlug: 'alternatives/crayola-coloring-page-free-alternative',
  },
  'de:alternativen/crayola-ausmalbild-kostenlose-alternative': {
    toolId: 'coloring_page',
    pageType: 'ALTERNATIVE',
    h1: 'Kostenlose Crayola Ausmalbild-Alternative',
    metaTitle: 'Crayola Ausmalbild Alternative | Kostenlos',
    metaDesc: 'Eigene Ausmalbilder aus Fotos erstellen — kein App-Download, keine Anmeldung. Kostenlose Alternative zum Crayola Ausmalbild-Maker.',
    faqJson: [],
    defaultConfig: {},
    locale: 'de',
    canonicalSlug: 'alternatives/crayola-coloring-page-free-alternative',
  },

  // ===========================================================
  // AUDIO CONVERTER
  // ===========================================================

  // ---- HUBS ----
  'en:audio/convert-audio': {
    toolId: 'audio_converter',
    pageType: 'HUB',
    h1: 'Convert Audio — Free & Private',
    metaTitle: 'Free Audio Converter | MP3, WAV, FLAC',
    metaDesc: 'Convert audio files between MP3, WAV, OGG, FLAC, AAC. Trim and adjust bitrate. Runs 100% in your browser using FFmpeg WASM — files never leave your device.',
    faqJson: [
      { q: 'Is it really free?', a: 'Yes. No credits, no limits, no account. The FFmpeg engine runs entirely in your browser.' },
      { q: 'Are my audio files uploaded?', a: 'No. All processing happens locally using WebAssembly. Your files never leave your device.' },
      { q: 'How long does conversion take?', a: 'The FFmpeg engine loads once (~30MB). After that, most conversions take a few seconds depending on file size.' },
      { q: 'Can I trim audio?', a: 'Yes. Enter start and end times in seconds to trim your audio while converting.' },
    ],
    defaultConfig: {},
    locale: 'en',
    canonicalSlug: 'audio/convert-audio',
  },
  'de:audio/audio-konvertieren': {
    toolId: 'audio_converter',
    pageType: 'HUB',
    h1: 'Audio konvertieren — Kostenlos & Privat',
    metaTitle: 'Audio Konverter | Kostenlos, Unbegrenzt',
    metaDesc: 'Audiodateien zwischen MP3, WAV, OGG, FLAC, AAC konvertieren. Trimmen und Bitrate anpassen. 100% im Browser mit FFmpeg WASM.',
    faqJson: [
      { q: 'Ist es wirklich kostenlos?', a: 'Ja. Keine Credits, keine Limits, keine Anmeldung. Die FFmpeg-Engine läuft vollständig in Ihrem Browser.' },
      { q: 'Werden meine Dateien hochgeladen?', a: 'Nein. Die gesamte Verarbeitung erfolgt lokal mit WebAssembly.' },
    ],
    defaultConfig: {},
    locale: 'de',
    canonicalSlug: 'audio/convert-audio',
  },

  // ---- SPOKES ----
  'en:tools/convert-wav-to-mp3': {
    toolId: 'audio_converter',
    pageType: 'SPOKE',
    h1: 'Convert WAV to MP3 — Free Online',
    metaTitle: 'Convert WAV to MP3 | Free, No Upload',
    metaDesc: 'Convert WAV audio files to MP3 format instantly. Choose bitrate from 64 to 320 kbps. Free, private, runs in your browser.',
    faqJson: [
      { q: 'Does converting WAV to MP3 reduce quality?', a: 'MP3 is lossy, but at 192+ kbps the difference is virtually imperceptible.' },
    ],
    defaultConfig: { outputFormat: 'mp3' },
    introText: 'WAV files sound great but are massive — a 3-minute song can be 30MB. Converting to MP3 shrinks files by 90% while keeping audio quality that\'s indistinguishable to most listeners. Choose 192+ kbps for near-CD quality.',
    locale: 'en',
    canonicalSlug: 'tools/convert-wav-to-mp3',
  },
  'en:tools/convert-mp3-to-wav': {
    toolId: 'audio_converter',
    pageType: 'SPOKE',
    h1: 'Convert MP3 to WAV — Free Online',
    metaTitle: 'Convert MP3 to WAV | Free, Unlimited',
    metaDesc: 'Convert MP3 files to uncompressed WAV format. Perfect for audio editing and production. Free, local.',
    faqJson: [],
    defaultConfig: { outputFormat: 'wav' },
    introText: 'Converting MP3 to WAV is essential for audio editing, music production, and software that requires uncompressed input. While it won\'t restore compressed data, WAV format is universally compatible with all DAWs, video editors, and professional audio tools.',
    locale: 'en',
    canonicalSlug: 'tools/convert-mp3-to-wav',
  },
  'en:tools/convert-flac-to-mp3': {
    toolId: 'audio_converter',
    pageType: 'SPOKE',
    h1: 'Convert FLAC to MP3 — Free Lossless to MP3',
    metaTitle: 'Convert FLAC to MP3 | Free',
    metaDesc: 'Convert FLAC lossless audio files to compact MP3 format. Choose bitrate from 128 to 320 kbps. Free, private, no signup — runs 100% in your browser.',
    faqJson: [],
    defaultConfig: { outputFormat: 'mp3', bitrate: 256 },
    introText: 'FLAC is audiophile-grade lossless audio, but most devices and streaming services don\'t support it. Convert your FLAC collection to universally compatible MP3 at 256 kbps or 320 kbps for transparent quality that works everywhere.',
    locale: 'en',
    canonicalSlug: 'tools/convert-flac-to-mp3',
  },
  'de:werkzeuge/wav-in-mp3-umwandeln': {
    toolId: 'audio_converter',
    pageType: 'SPOKE',
    h1: 'WAV in MP3 umwandeln — Kostenlos',
    metaTitle: 'WAV in MP3 umwandeln | Kostenlos',
    metaDesc: 'WAV-Audiodateien sofort in MP3 umwandeln. Bitrate von 64 bis 320 kbps. Kostenlos und privat.',
    faqJson: [],
    defaultConfig: { outputFormat: 'mp3' },
    locale: 'de',
    canonicalSlug: 'tools/convert-wav-to-mp3',
  },
  'de:werkzeuge/mp3-in-wav-umwandeln': {
    toolId: 'audio_converter',
    pageType: 'SPOKE',
    h1: 'MP3 in WAV umwandeln — Kostenlos',
    metaTitle: 'MP3 in WAV umwandeln | Kostenlos',
    metaDesc: 'MP3-Dateien in unkomprimiertes WAV umwandeln. Perfekt für Audiobearbeitung.',
    faqJson: [],
    defaultConfig: { outputFormat: 'wav' },
    locale: 'de',
    canonicalSlug: 'tools/convert-mp3-to-wav',
  },
  'de:werkzeuge/flac-in-mp3-umwandeln': {
    toolId: 'audio_converter',
    pageType: 'SPOKE',
    h1: 'FLAC in MP3 umwandeln — Kostenlos',
    metaTitle: 'FLAC in MP3 umwandeln | Kostenlos',
    metaDesc: 'FLAC verlustfreies Audio in MP3 umwandeln. Einstellbare Bitrate. Kostenlos.',
    faqJson: [],
    defaultConfig: { outputFormat: 'mp3', bitrate: 256 },
    locale: 'de',
    canonicalSlug: 'tools/convert-flac-to-mp3',
  },

  // ---- ALTERNATIVES ----
  'en:alternatives/cloudconvert-free-alternative': {
    toolId: 'audio_converter',
    pageType: 'ALTERNATIVE',
    h1: 'Free CloudConvert Alternative — No Upload, Unlimited',
    metaTitle: 'CloudConvert Free Alternative | No Limits',
    metaDesc: 'Free CloudConvert alternative for audio conversion. Convert files locally in your browser with no daily limits, no uploads, and no account required.',
    introText: 'CloudConvert is a versatile cloud-based conversion platform — but it uploads your files to their servers, limits free users to 25 conversions per day, and requires registration for larger files. Our audio converter runs entirely in your browser with zero uploads, unlimited conversions, and no account.',
    faqJson: [
      { q: 'How does this compare to CloudConvert?', a: 'CloudConvert uploads files to remote servers and limits free users to 25 conversions/day. Our tool runs locally — unlimited, instant, private.' },
      { q: 'Does CloudConvert keep my files?', a: 'CloudConvert processes files on their servers and stores them temporarily. Our tool never uploads anything — your files stay on your device.' },
      { q: 'Are there daily limits?', a: 'No. CloudConvert caps free users at 25 conversions per day. Our tool has no daily limits whatsoever.' },
      { q: 'Which audio formats are supported?', a: 'We support MP3, WAV, OGG, FLAC, AAC, and WebM — covering the most common audio conversion needs. All conversions happen instantly in your browser.' },
      { q: 'Do I need to create an account?', a: 'No. No signup, no API key, no email. CloudConvert requires registration for files over 100MB. Our tool has no such restriction.' },
    ],
    defaultConfig: {},
    locale: 'en',
    canonicalSlug: 'alternatives/cloudconvert-free-alternative',
  },
  'de:alternativen/cloudconvert-kostenlose-alternative': {
    toolId: 'audio_converter',
    pageType: 'ALTERNATIVE',
    h1: 'Kostenlose CloudConvert Alternative — Ohne Upload',
    metaTitle: 'CloudConvert kostenlose Alternative',
    metaDesc: 'Kostenlose Alternative zu CloudConvert. Audiodateien konvertieren ohne hochzuladen.',
    faqJson: [],
    defaultConfig: {},
    locale: 'de',
    canonicalSlug: 'alternatives/cloudconvert-free-alternative',
  },
  'en:alternatives/zamzar-free-alternative': {
    toolId: 'audio_converter',
    pageType: 'ALTERNATIVE',
    h1: 'Free Zamzar Alternative — No Email, No File Limit',
    metaTitle: 'Zamzar Free Alternative | No Email',
    metaDesc: 'Free Zamzar alternative for audio conversion. No email required, no file size limits, no waiting. Convert audio files instantly in your browser.',
    introText: 'Zamzar is one of the oldest online conversion services — but it requires your email to deliver converted files, limits free users to 50MB files, and adds waiting times. Our alternative converts audio instantly in your browser with no email, no file limits, and no waiting.',
    faqJson: [
      { q: 'How does this compare to Zamzar?', a: 'Zamzar requires your email address and limits free files to 50MB. Our tool is instant, unlimited, and local — no email needed.' },
      { q: 'Does Zamzar require my email?', a: 'Yes — Zamzar emails your converted file to you. Our tool converts files instantly in your browser and downloads them directly. No email required.' },
      { q: 'Are there file size limits?', a: 'No. Zamzar limits free users to 50MB files. Our tool has no artificial file size restrictions.' },
      { q: 'Is it really instant?', a: 'Yes. Zamzar\'s free tier includes a wait time before processing. Our tool starts converting immediately — most files are done in seconds.' },
      { q: 'Does Zamzar keep my files?', a: 'Zamzar stores your files on their servers. Our tool processes everything locally in your browser — your files never leave your device.' },
    ],
    defaultConfig: {},
    locale: 'en',
    canonicalSlug: 'alternatives/zamzar-free-alternative',
  },
  'de:alternativen/zamzar-kostenlose-alternative': {
    toolId: 'audio_converter',
    pageType: 'ALTERNATIVE',
    h1: 'Kostenlose Zamzar Alternative — Ohne E-Mail',
    metaTitle: 'Zamzar kostenlose Alternative',
    metaDesc: 'Kostenlose Alternative zu Zamzar. Audiodateien sofort konvertieren ohne E-Mail oder Dateigrößenlimits.',
    faqJson: [],
    defaultConfig: {},
    locale: 'de',
    canonicalSlug: 'alternatives/zamzar-free-alternative',
  },

  // ===========================================================
  // SPEECH TO TEXT
  // ===========================================================

  // ---- HUBS ----
  'en:audio/speech-to-text': {
    toolId: 'speech_to_text',
    pageType: 'HUB',
    h1: 'Speech to Text — Free & Private',
    metaTitle: 'Speech to Text | Free AI Transcription',
    metaDesc: 'Transcribe audio to text with Whisper AI — 100% in your browser. Timestamps included. Download as TXT or SRT subtitles. No upload, no signup.',
    faqJson: [
      { q: 'Is it really free?', a: 'Yes. No credits, no limits, no account. Whisper AI runs entirely in your browser via WebGPU.' },
      { q: 'Are my audio files uploaded?', a: 'No. The AI model runs locally on your device. Your audio never leaves your browser.' },
      { q: 'How accurate is it?', a: 'Whisper Tiny is optimized for speed. For most English audio with clear speech, accuracy is very good. Noisy or accented audio may have lower accuracy.' },
      { q: 'Can I get subtitles?', a: 'Yes. Timestamps are generated automatically. Download as .SRT subtitle files for use in video editing.' },
    ],
    defaultConfig: {},
    locale: 'en',
    canonicalSlug: 'audio/speech-to-text',
  },
  'de:audio/sprache-zu-text': {
    toolId: 'speech_to_text',
    pageType: 'HUB',
    h1: 'Sprache zu Text — Kostenlos & Privat',
    metaTitle: 'Sprache zu Text | Kostenlose KI-Transkription',
    metaDesc: 'Audio mit Whisper AI transkribieren — 100% im Browser. Zeitstempel inklusive. Als TXT oder SRT herunterladen. Kein Upload.',
    faqJson: [
      { q: 'Ist es wirklich kostenlos?', a: 'Ja. Keine Credits, keine Limits. Whisper AI läuft vollständig in Ihrem Browser.' },
      { q: 'Werden meine Dateien hochgeladen?', a: 'Nein. Das KI-Modell läuft lokal auf Ihrem Gerät.' },
    ],
    defaultConfig: {},
    locale: 'de',
    canonicalSlug: 'audio/speech-to-text',
  },

  // ---- SPOKES ----
  'en:tools/transcribe-audio-to-text': {
    toolId: 'speech_to_text',
    pageType: 'SPOKE',
    h1: 'Transcribe Audio to Text — Free Online',
    metaTitle: 'Transcribe Audio to Text | Free, No Upload',
    metaDesc: 'Convert audio recordings to text transcripts. Supports MP3, WAV, OGG, FLAC. Powered by Whisper AI, runs locally in your browser.',
    faqJson: [],
    defaultConfig: {},
    introText: 'Turn audio recordings into accurate text transcripts using Whisper AI. Upload interviews, lectures, meetings, or voice memos and get a full text transcription — all processed locally in your browser for complete privacy.',
    locale: 'en',
    canonicalSlug: 'tools/transcribe-audio-to-text',
  },
  'en:tools/audio-to-srt-subtitles': {
    toolId: 'speech_to_text',
    pageType: 'SPOKE',
    h1: 'Audio to SRT Subtitles — Free Subtitle Generator',
    metaTitle: 'Audio to SRT Subtitles | Free Generator',
    metaDesc: 'Generate SRT subtitle files from audio. Automatic timestamps with Whisper AI. Perfect for YouTube, TikTok, and video editing. Free and private.',
    faqJson: [
      { q: 'What subtitle format is generated?', a: 'SRT (SubRip Text), the most widely supported subtitle format. Works with YouTube, Premiere Pro, DaVinci Resolve, and more.' },
    ],
    defaultConfig: {},
    introText: 'Generate ready-to-use SRT subtitle files from any audio recording. The AI automatically detects speech timing and creates properly formatted subtitles you can import directly into YouTube, Premiere Pro, DaVinci Resolve, or any video editor.',
    locale: 'en',
    canonicalSlug: 'tools/audio-to-srt-subtitles',
  },
  'en:tools/transcribe-podcast-free': {
    toolId: 'speech_to_text',
    pageType: 'SPOKE',
    h1: 'Transcribe Podcast for Free — AI-Powered',
    metaTitle: 'Transcribe Podcast Free | Whisper AI',
    metaDesc: 'Transcribe podcast episodes to text for show notes, SEO, and accessibility. Free, unlimited, powered by Whisper AI running locally.',
    faqJson: [],
    defaultConfig: {},
    introText: 'Transcribe entire podcast episodes into searchable text for show notes, blog posts, and SEO. Whisper AI handles multiple speakers, accents, and background music — and everything runs locally so your unreleased content stays private.',
    locale: 'en',
    canonicalSlug: 'tools/transcribe-podcast-free',
  },
  'de:werkzeuge/audio-transkribieren': {
    toolId: 'speech_to_text',
    pageType: 'SPOKE',
    h1: 'Audio transkribieren — Kostenlos',
    metaTitle: 'Audio transkribieren | Kostenlos',
    metaDesc: 'Audioaufnahmen in Text umwandeln. MP3, WAV, OGG, FLAC. Whisper AI, lokal im Browser.',
    faqJson: [],
    defaultConfig: {},
    locale: 'de',
    canonicalSlug: 'tools/transcribe-audio-to-text',
  },
  'de:werkzeuge/audio-zu-srt-untertitel': {
    toolId: 'speech_to_text',
    pageType: 'SPOKE',
    h1: 'Audio zu SRT-Untertiteln — Kostenloser Generator',
    metaTitle: 'Audio zu SRT-Untertiteln | Kostenlos',
    metaDesc: 'SRT-Untertitel aus Audio generieren. Automatische Zeitstempel mit Whisper AI. Kostenlos und privat.',
    faqJson: [],
    defaultConfig: {},
    locale: 'de',
    canonicalSlug: 'tools/audio-to-srt-subtitles',
  },
  'de:werkzeuge/podcast-transkribieren': {
    toolId: 'speech_to_text',
    pageType: 'SPOKE',
    h1: 'Podcast transkribieren — Kostenlos mit KI',
    metaTitle: 'Podcast transkribieren | Kostenlos',
    metaDesc: 'Podcast-Episoden in Text transkribieren. Kostenlos, unbegrenzt, mit Whisper AI lokal im Browser.',
    faqJson: [],
    defaultConfig: {},
    locale: 'de',
    canonicalSlug: 'tools/transcribe-podcast-free',
  },

  // ---- ALTERNATIVES ----
  'en:alternatives/otter-ai-free-alternative': {
    toolId: 'speech_to_text',
    pageType: 'ALTERNATIVE',
    h1: 'Free Otter.ai Alternative — No Upload, Unlimited',
    metaTitle: 'Otter.ai Free Alternative | No Limits',
    metaDesc: 'Free Otter.ai alternative for audio transcription. No 300-minute monthly limit, no cloud uploads. Whisper AI runs privately in your browser.',
    introText: 'Otter.ai is a popular AI transcription tool — but it uploads all your audio to their cloud, limits free users to 300 minutes per month, and only stores transcripts in their proprietary app. Our alternative uses Whisper AI running locally in your browser: unlimited minutes, complete privacy, and downloadable TXT/SRT output.',
    faqJson: [
      { q: 'How does this compare to Otter.ai?', a: 'Otter.ai uploads audio to their cloud servers and limits free users to 300 min/month. Our tool runs 100% locally with no limits.' },
      { q: 'Does Otter.ai store my recordings?', a: 'Yes — Otter.ai keeps your audio and transcripts on their servers. Our tool processes everything locally and never stores or uploads anything.' },
      { q: 'Is there a monthly minute limit?', a: 'No. Otter.ai caps free users at 300 minutes/month. Our tool has no time limits — transcribe as much audio as you need.' },
      { q: 'Can I get subtitle files?', a: 'Yes. Download your transcription as a .SRT subtitle file with timestamps, or as plain .TXT. Otter.ai locks SRT export behind their paid plan.' },
      { q: 'Which AI model is used?', a: 'We use OpenAI\'s Whisper AI running locally in your browser via WebGPU. It handles English and many other languages with strong accuracy.' },
    ],
    defaultConfig: {},
    locale: 'en',
    canonicalSlug: 'alternatives/otter-ai-free-alternative',
  },
  'de:alternativen/otter-ai-kostenlose-alternative': {
    toolId: 'speech_to_text',
    pageType: 'ALTERNATIVE',
    h1: 'Kostenlose Otter.ai Alternative — Ohne Upload',
    metaTitle: 'Otter.ai kostenlose Alternative',
    metaDesc: 'Kostenlose Alternative zu Otter.ai. Audio transkribieren ohne hochzuladen. Keine monatlichen Minutenlimits.',
    faqJson: [],
    defaultConfig: {},
    locale: 'de',
    canonicalSlug: 'alternatives/otter-ai-free-alternative',
  },
  'en:alternatives/rev-free-alternative': {
    toolId: 'speech_to_text',
    pageType: 'ALTERNATIVE',
    h1: 'Free Rev Alternative — No Per-Minute Fee',
    metaTitle: 'Rev Free Alternative | No Fees',
    metaDesc: 'Free Rev transcription alternative. No per-minute charges ($1.50+/min), no file uploads. Whisper AI transcribes audio locally in your browser for free.',
    introText: 'Rev is a popular transcription service charging $1.50 or more per minute for AI transcription and even more for human transcription. Our free alternative uses the same Whisper AI technology but runs it locally in your browser — no per-minute fees, no uploads, and no word limits.',
    faqJson: [
      { q: 'How does this compare to Rev?', a: 'Rev charges $1.50+/minute for AI transcription and uploads your audio to their servers. Our tool is completely free, unlimited, and runs locally.' },
      { q: 'Is the quality comparable?', a: 'Both use advanced AI models. Rev uses proprietary models while we use OpenAI\'s Whisper. For clear English audio, accuracy is very comparable.' },
      { q: 'Does Rev upload my audio?', a: 'Yes — Rev processes audio on their servers and may use it for quality improvement. Our tool never uploads anything.' },
      { q: 'Can I transcribe long recordings?', a: 'Yes. Rev\'s costs add up quickly for long recordings ($90 for 1 hour of AI transcription). Our tool is free regardless of length.' },
      { q: 'Do I get timestamps?', a: 'Yes. Every transcription includes automatic timestamps, and you can download as .SRT subtitle files for video editing. Rev charges extra for timestamps on their cheapest tier.' },
    ],
    defaultConfig: {},
    locale: 'en',
    canonicalSlug: 'alternatives/rev-free-alternative',
  },
  'de:alternativen/rev-kostenlose-alternative': {
    toolId: 'speech_to_text',
    pageType: 'ALTERNATIVE',
    h1: 'Kostenlose Rev Alternative — Keine Minutengebühren',
    metaTitle: 'Rev kostenlose Alternative',
    metaDesc: 'Kostenlose Alternative zu Rev. Keine Minutengebühren, kein Upload. Whisper AI lokal im Browser.',
    faqJson: [],
    defaultConfig: {},
    locale: 'de',
    canonicalSlug: 'alternatives/rev-free-alternative',
  },

  // ─── PDF Password: HUB ───
  'en:pdf/password-protect': {
    toolId: 'pdf_password',
    pageType: 'HUB',
    h1: 'PDF Password Protect — Free & Private',
    metaTitle: 'PDF Password Protect | Free, No Upload',
    metaDesc: 'Add password protection to any PDF. Encrypt files locally in your browser — no upload, no signup, unlimited.',
    faqJson: [
      { q: 'How does the encryption work?', a: 'Your PDF is encrypted using industry-standard AES-128 encryption directly in your browser. The file never leaves your device.' },
      { q: 'Can I remove the password later?', a: 'Yes, open the PDF in any reader with your password and re-save it without protection.' },
      { q: 'Is there a file size limit?', a: 'You can protect PDFs up to 200MB. Processing happens locally, so speed depends on your device.' },
    ],
    defaultConfig: {},
    locale: 'en',
    canonicalSlug: 'pdf/password-protect',
  },
  'de:pdf/passwort-schuetzen': {
    toolId: 'pdf_password',
    pageType: 'HUB',
    h1: 'PDF Passwortschutz — Kostenlos & Privat',
    metaTitle: 'PDF Passwortschutz | Kostenlos, Kein Upload',
    metaDesc: 'Schützen Sie jede PDF-Datei mit einem Passwort. Verschlüsselung direkt im Browser — kein Upload, keine Registrierung.',
    faqJson: [
      { q: 'Wie funktioniert die Verschlüsselung?', a: 'Ihre PDF wird mit AES-128 direkt in Ihrem Browser verschlüsselt. Die Datei verlässt niemals Ihr Gerät.' },
      { q: 'Gibt es eine Dateigrößenbeschränkung?', a: 'Sie können PDFs bis 200MB schützen. Die Verarbeitung erfolgt lokal.' },
    ],
    defaultConfig: {},
    locale: 'de',
    canonicalSlug: 'pdf/password-protect',
  },

  // ─── PDF Password: SPOKEs ───
  'en:tools/encrypt-pdf': {
    toolId: 'pdf_password',
    pageType: 'SPOKE',
    h1: 'Encrypt PDF — Free Online',
    metaTitle: 'Encrypt PDF | Free, Private, No Upload',
    metaDesc: 'Encrypt any PDF file with AES password protection in your browser. No upload to any server, no signup needed. 100% free and completely private.',
    faqJson: [],
    defaultConfig: {},
    introText: 'Encrypt your PDF with industry-standard AES encryption to prevent unauthorized access. Unlike most online tools, the encryption happens entirely in your browser — your password and file data never leave your device.',
    locale: 'en',
    canonicalSlug: 'tools/encrypt-pdf',
  },
  'de:werkzeuge/pdf-verschluesseln': {
    toolId: 'pdf_password',
    pageType: 'SPOKE',
    h1: 'PDF verschlüsseln — Kostenlos Online',
    metaTitle: 'PDF verschlüsseln | Kostenlos, Privat',
    metaDesc: 'Verschlüsseln Sie jede PDF-Datei mit einem Passwort. 100% kostenlos, direkt im Browser.',
    faqJson: [],
    defaultConfig: {},
    locale: 'de',
    canonicalSlug: 'tools/encrypt-pdf',
  },
  'en:tools/lock-pdf': {
    toolId: 'pdf_password',
    pageType: 'SPOKE',
    h1: 'Lock PDF with Password — Free Online',
    metaTitle: 'Lock PDF | Free Password Protection',
    metaDesc: 'Lock your PDF with a password so only authorized people can open it. No upload, no signup — encryption runs completely in your browser. Free and private.',
    faqJson: [],
    defaultConfig: {},
    introText: 'Lock your PDF so only people with the password can open it. Perfect for protecting contracts, tax documents, medical records, or any sensitive information you need to share securely via email or file transfer.',
    locale: 'en',
    canonicalSlug: 'tools/lock-pdf',
  },
  'de:werkzeuge/pdf-sperren': {
    toolId: 'pdf_password',
    pageType: 'SPOKE',
    h1: 'PDF mit Passwort sperren — Kostenlos Online',
    metaTitle: 'PDF sperren | Kostenloser Passwortschutz',
    metaDesc: 'Sperren Sie Ihre PDF mit einem Passwort. Kein Upload, keine Registrierung — direkt im Browser.',
    faqJson: [],
    defaultConfig: {},
    locale: 'de',
    canonicalSlug: 'tools/lock-pdf',
  },

  // ---- SPOKES: PDF Password additional long-tail (EN) ----
  'en:tools/password-protect-pdf-free': {
    toolId: 'pdf_password',
    pageType: 'SPOKE',
    h1: 'Password Protect PDF Free — No Upload Required',
    metaTitle: 'Password Protect PDF Free | No Upload',
    metaDesc: 'Add password protection to your PDF for free. AES-256 encryption runs in your browser — nothing uploaded to any server.',
    faqJson: [
      { q: 'Is the password protection secure?', a: 'Yes — the tool uses AES-256 encryption, the same standard used by banks and governments worldwide.' },
    ],
    defaultConfig: {},
    introText: 'Add military-grade AES-256 password protection to your PDFs without paying for Adobe Acrobat or uploading files to a third-party server. The encryption runs locally in your browser with zero-knowledge privacy — even we can\'t see your files.',
    locale: 'en',
    canonicalSlug: 'tools/password-protect-pdf-free',
  },
  'en:tools/secure-pdf-online': {
    toolId: 'pdf_password',
    pageType: 'SPOKE',
    h1: 'Secure PDF Online — Add Encryption for Free',
    metaTitle: 'Secure PDF Online | Free Encryption',
    metaDesc: 'Secure your PDF files with password encryption online. No account, no upload — all processing happens locally in your browser.',
    faqJson: [],
    defaultConfig: {},
    introText: 'Secure confidential PDFs before sending them over email or cloud storage. Add encryption that requires a password to open, ensuring only intended recipients can access the document contents.',
    locale: 'en',
    canonicalSlug: 'tools/secure-pdf-online',
  },
  'en:tools/add-password-to-pdf': {
    toolId: 'pdf_password',
    pageType: 'SPOKE',
    h1: 'Add Password to PDF — Free Online Tool',
    metaTitle: 'Add Password to PDF | Free, Private',
    metaDesc: 'Add a password to any PDF file online for free. Your files and passwords stay private — zero-knowledge encryption in your browser.',
    faqJson: [
      { q: 'Will recipients be able to open the PDF?', a: 'Yes — anyone with the password you set can open and view the PDF in any standard PDF reader.' },
    ],
    defaultConfig: {},
    introText: 'Set a password on any PDF file in seconds. Recipients will be prompted for the password before they can view the document. Choose a strong password and share it separately from the file for maximum security.',
    locale: 'en',
    canonicalSlug: 'tools/add-password-to-pdf',
  },
  'en:tools/pdf-encryptor': {
    toolId: 'pdf_password',
    pageType: 'SPOKE',
    h1: 'PDF Encryptor — Encrypt PDF Files Instantly',
    metaTitle: 'PDF Encryptor | Free Online',
    metaDesc: 'Free PDF encryptor that adds AES-256 password protection. Works offline in your browser. No limits, no account needed.',
    faqJson: [],
    defaultConfig: {},
    introText: 'A dedicated PDF encryption tool that adds AES-256 password protection with a single click. Works offline after the page loads — ideal for protecting sensitive documents when you don\'t have access to Adobe Acrobat or other desktop software.',
    locale: 'en',
    canonicalSlug: 'tools/pdf-encryptor',
  },

  // ─── Images to PDF: HUB ───
  'en:pdf/images-to-pdf': {
    toolId: 'images_to_pdf',
    pageType: 'HUB',
    h1: 'Convert Images to PDF — Free & Private',
    metaTitle: 'Images to PDF | Free, No Upload',
    metaDesc: 'Convert JPG, PNG, and WebP images to a multi-page PDF. Drag, drop, reorder — 100% in your browser. No upload, no signup.',
    faqJson: [
      { q: 'Is it really free?', a: 'Yes, 100% free with no limits. The tool runs entirely in your browser.' },
      { q: 'Are my images private?', a: 'Absolutely. Your images are processed locally and never uploaded to any server.' },
    ],
    defaultConfig: {},
    locale: 'en',
    canonicalSlug: 'pdf/images-to-pdf',
  },
  'de:pdf/bilder-zu-pdf': {
    toolId: 'images_to_pdf',
    pageType: 'HUB',
    h1: 'Bilder in PDF umwandeln — Kostenlos & Privat',
    metaTitle: 'Bilder zu PDF | Kostenlos, Kein Upload',
    metaDesc: 'Konvertieren Sie JPG, PNG und WebP Bilder in ein mehrseitiges PDF. Drag & Drop — 100% im Browser.',
    faqJson: [
      { q: 'Ist das wirklich kostenlos?', a: 'Ja, 100% kostenlos und ohne Limits. Das Tool läuft vollständig in Ihrem Browser.' },
      { q: 'Sind meine Bilder privat?', a: 'Ja. Ihre Bilder werden lokal verarbeitet und nie auf einen Server hochgeladen.' },
    ],
    defaultConfig: {},
    locale: 'de',
    canonicalSlug: 'pdf/images-to-pdf',
  },

  // ─── Images to PDF: SPOKEs ───
  'en:tools/jpg-to-pdf': {
    toolId: 'images_to_pdf',
    pageType: 'SPOKE',
    h1: 'JPG to PDF — Convert JPEG Images to PDF',
    metaTitle: 'JPG to PDF Converter | Free Online',
    metaDesc: 'Convert JPG and JPEG images to PDF instantly. Combine multiple photos into one document — free, private, no upload.',
    faqJson: [
      { q: 'Can I convert multiple JPGs at once?', a: 'Yes — drop as many JPG files as you need. Each image becomes a page in the output PDF, and you can reorder them before converting.' },
    ],
    defaultConfig: {},
    introText: 'The most common image-to-PDF conversion. Drop your JPEG photos and the tool creates a clean PDF with each image on its own page. Perfect for submitting photo IDs, receipts, or scanned documents as a single PDF file.',
    locale: 'en',
    canonicalSlug: 'tools/jpg-to-pdf',
  },
  'en:tools/png-to-pdf': {
    toolId: 'images_to_pdf',
    pageType: 'SPOKE',
    h1: 'PNG to PDF — Convert PNG Images to PDF',
    metaTitle: 'PNG to PDF Converter | Free Online',
    metaDesc: 'Convert PNG images to PDF while preserving transparency and quality. Free, private, no signup required.',
    faqJson: [
      { q: 'Is PNG transparency preserved?', a: 'PNG images are embedded directly into the PDF with their full quality. Transparent areas will appear as white on the PDF page.' },
    ],
    defaultConfig: {},
    introText: 'Convert PNG images — including screenshots, diagrams, and design mockups — into a professional PDF document. PNG quality is fully preserved, making this ideal for technical documentation and design presentations.',
    locale: 'en',
    canonicalSlug: 'tools/png-to-pdf',
  },
  'en:tools/photos-to-pdf': {
    toolId: 'images_to_pdf',
    pageType: 'SPOKE',
    h1: 'Photos to PDF — Create a PDF from Photos',
    metaTitle: 'Photos to PDF | Free Photo Album Creator',
    metaDesc: 'Turn your photos into a multi-page PDF document. Perfect for photo albums, portfolios, and document archives. Free and private.',
    faqJson: [
      { q: 'Can I create a photo album PDF?', a: 'Yes — add all your photos, arrange them in order by dragging, then choose A4 or Letter size for a printable album layout.' },
    ],
    defaultConfig: {},
    introText: 'Create a multi-page PDF photo album from your image collection. Drag to arrange photos in your preferred order, then download a single PDF that\'s easy to share, print, or archive. Supports JPG, PNG, and WebP.',
    locale: 'en',
    canonicalSlug: 'tools/photos-to-pdf',
  },
  'en:tools/combine-images-into-pdf': {
    toolId: 'images_to_pdf',
    pageType: 'SPOKE',
    h1: 'Combine Images into PDF — Merge Multiple Images',
    metaTitle: 'Combine Images into PDF | Free Online',
    metaDesc: 'Combine multiple images into a single PDF document. Supports JPG, PNG, WebP. Drag to reorder — 100% browser-based.',
    faqJson: [
      { q: 'How many images can I combine?', a: 'There is no hard limit. The tool handles dozens of images. Processing speed depends on your device.' },
    ],
    defaultConfig: {},
    introText: 'Merge any number of images into one organized PDF. Whether it\'s receipts for expense reports, scanned pages for a document, or photos for a portfolio — combine them all into a single file that\'s easy to email or upload.',
    locale: 'en',
    canonicalSlug: 'tools/combine-images-into-pdf',
  },

  // ─── PDF Watermark: HUB ───
  'en:pdf/watermark': {
    toolId: 'pdf_watermark',
    pageType: 'HUB',
    h1: 'Add Watermark to PDF — Free & Private',
    metaTitle: 'PDF Watermark | Free, No Upload',
    metaDesc: 'Add text watermarks to any PDF. Customize text, opacity, size, rotation — 100% in your browser. No upload, no signup.',
    faqJson: [
      { q: 'Is it free?', a: 'Yes, 100% free with no limits. The tool runs entirely in your browser.' },
      { q: 'Are my files private?', a: 'Yes. Your PDF is processed locally and never uploaded to any server.' },
    ],
    defaultConfig: {},
    locale: 'en',
    canonicalSlug: 'pdf/watermark',
  },
  'de:pdf/wasserzeichen': {
    toolId: 'pdf_watermark',
    pageType: 'HUB',
    h1: 'Wasserzeichen zu PDF hinzufügen — Kostenlos',
    metaTitle: 'PDF Wasserzeichen | Kostenlos',
    metaDesc: 'Fügen Sie Wasserzeichen zu jeder PDF hinzu. Text, Deckkraft, Größe anpassen — 100% im Browser.',
    faqJson: [],
    defaultConfig: {},
    locale: 'de',
    canonicalSlug: 'pdf/watermark',
  },

  // ─── PDF Watermark: SPOKEs ───
  'en:tools/stamp-pdf': {
    toolId: 'pdf_watermark',
    pageType: 'SPOKE',
    h1: 'Stamp PDF — Add a Stamp to Any PDF',
    metaTitle: 'Stamp PDF Free | Add Stamps Online',
    metaDesc: 'Add a CONFIDENTIAL, DRAFT, or custom text stamp to every page of your PDF. Customize font, opacity, and position. Free, private, 100% browser-based.',
    faqJson: [],
    defaultConfig: {},
    introText: 'Add a text stamp to your PDF pages for branding, confidentiality notices, or draft markings. Position the watermark text anywhere on the page with customizable font size and opacity — all processed locally in your browser.',
    locale: 'en',
    canonicalSlug: 'tools/stamp-pdf',
  },
  'en:tools/add-watermark-to-pdf': {
    toolId: 'pdf_watermark',
    pageType: 'SPOKE',
    h1: 'Add Watermark to PDF — Free Online Tool',
    metaTitle: 'Add Watermark to PDF | Free',
    metaDesc: 'Add a text watermark to every page of your PDF. Customize opacity, rotation, and position. 100% free and private.',
    faqJson: [],
    defaultConfig: {},
    introText: 'Protect your PDF documents with visible watermark text. Add "CONFIDENTIAL", "DRAFT", company names, or copyright notices across every page. Customize the angle, opacity, and position to suit your needs.',
    locale: 'en',
    canonicalSlug: 'tools/add-watermark-to-pdf',
  },

  // ─── PDF Page Numbers: HUB ───
  'en:pdf/page-numbers': {
    toolId: 'pdf_page_numbers',
    pageType: 'HUB',
    h1: 'Add Page Numbers to PDF — Free & Private',
    metaTitle: 'PDF Page Numbers | Free, No Upload',
    metaDesc: 'Add page numbers to any PDF. Choose position, format, and starting number — 100% in your browser.',
    faqJson: [
      { q: 'Is it free?', a: 'Yes, 100% free with no limits.' },
      { q: 'Can I choose the number format?', a: 'Yes — plain numbers, Page X of Y, dashed, or Roman numerals.' },
    ],
    defaultConfig: {},
    locale: 'en',
    canonicalSlug: 'pdf/page-numbers',
  },
  'de:pdf/seitenzahlen': {
    toolId: 'pdf_page_numbers',
    pageType: 'HUB',
    h1: 'Seitenzahlen zu PDF hinzufügen — Kostenlos',
    metaTitle: 'PDF Seitenzahlen | Kostenlos',
    metaDesc: 'Fügen Sie Seitenzahlen zu jeder PDF hinzu. Position und Format wählen — 100% im Browser.',
    faqJson: [],
    defaultConfig: {},
    locale: 'de',
    canonicalSlug: 'pdf/page-numbers',
  },

  // ─── PDF Page Numbers: SPOKEs ───
  'en:tools/number-pdf-pages': {
    toolId: 'pdf_page_numbers',
    pageType: 'SPOKE',
    h1: 'Number PDF Pages — Add Page Numbers Online',
    metaTitle: 'Number PDF Pages | Free Online',
    metaDesc: 'Number every page in your PDF. Choose bottom-center, top-right, or any position. Free and private.',
    faqJson: [],
    defaultConfig: {},
    introText: 'Automatically add page numbers to every page of your PDF. Choose the position (top, bottom, left, right, center), starting number, and formatting style. Essential for legal documents, manuscripts, and multi-page reports.',
    locale: 'en',
    canonicalSlug: 'tools/number-pdf-pages',
  },

  // ─── Image Converter: HUB ───
  'en:image/format-converter': {
    toolId: 'image_converter',
    pageType: 'HUB',
    h1: 'Image Format Converter — Free & Private',
    metaTitle: 'Free Image Converter | HEIC, WebP to JPG, PNG',
    metaDesc: 'Convert HEIC, WebP, AVIF, BMP, GIF, and TIFF to JPG, PNG, or WebP. 100% free, runs in your browser — no file upload required.',
    faqJson: [
      { q: 'What formats can I convert?', a: 'You can convert HEIC, HEIF, WebP, AVIF, BMP, GIF, TIFF, PNG, and JPG to JPG, PNG, or WebP output formats.' },
      { q: 'Is my data private?', a: 'Yes. All conversion happens locally in your browser using the Canvas API. No files are ever uploaded to a server.' },
      { q: 'Is there a file size limit?', a: 'You can convert images up to 100MB. Since processing is local, the limit depends on your device.' },
    ],
    defaultConfig: {},
    locale: 'en',
    canonicalSlug: 'image/format-converter',
  },
  'de:bild/format-konverter': {
    toolId: 'image_converter',
    pageType: 'HUB',
    h1: 'Bildformat-Konverter — Kostenlos & Privat',
    metaTitle: 'Kostenloser Bildkonverter | HEIC, WebP zu JPG',
    metaDesc: 'Konvertieren Sie HEIC, WebP, AVIF, BMP, GIF und TIFF in JPG, PNG oder WebP. 100% kostenlos, direkt im Browser.',
    faqJson: [
      { q: 'Welche Formate kann ich konvertieren?', a: 'Sie können HEIC, HEIF, WebP, AVIF, BMP, GIF, TIFF, PNG und JPG in JPG, PNG oder WebP umwandeln.' },
      { q: 'Sind meine Daten privat?', a: 'Ja. Die gesamte Konvertierung findet lokal in Ihrem Browser statt. Es werden keine Dateien hochgeladen.' },
    ],
    defaultConfig: {},
    locale: 'de',
    canonicalSlug: 'image/format-converter',
  },

  // ─── Image Converter: SPOKEs ───
  'en:tools/convert-heic-to-jpg': {
    toolId: 'image_converter',
    pageType: 'SPOKE',
    h1: 'Convert HEIC to JPG — Free Online',
    metaTitle: 'HEIC to JPG Converter | Free, Private, No Upload',
    metaDesc: 'Convert Apple HEIC photos to JPG format instantly. No upload, no signup — runs 100% in your browser.',
    faqJson: [
      { q: 'Why are my iPhone photos in HEIC format?', a: 'Apple uses HEIC (High Efficiency Image Container) by default because it produces smaller files than JPG while maintaining quality.' },
      { q: 'Will I lose quality converting HEIC to JPG?', a: 'Minimal quality loss. You can adjust the quality slider up to 100% for near-lossless conversion.' },
    ],
    defaultConfig: { outputFormat: 'jpeg' },
    introText: 'iPhone and iPad photos are saved as HEIC files by default — a format that many apps, websites, and Windows PCs still cannot open. This converter instantly transforms your HEIC photos into universally compatible JPG format, right in your browser. No upload needed — your photos stay on your device.',
    locale: 'en',
    canonicalSlug: 'tools/convert-heic-to-jpg',
  },
  'de:werkzeuge/heic-zu-jpg-konvertieren': {
    toolId: 'image_converter',
    pageType: 'SPOKE',
    h1: 'HEIC in JPG umwandeln — Kostenlos Online',
    metaTitle: 'HEIC zu JPG Konverter | Kostenlos, Privat',
    metaDesc: 'Konvertieren Sie Apple HEIC-Fotos sofort in das JPG-Format. Kein Upload, keine Registrierung — läuft 100% im Browser.',
    faqJson: [],
    defaultConfig: { outputFormat: 'jpeg' },
    locale: 'de',
    canonicalSlug: 'tools/convert-heic-to-jpg',
  },
  'en:tools/convert-webp-to-jpg': {
    toolId: 'image_converter',
    pageType: 'SPOKE',
    h1: 'Convert WebP to JPG — Free Online',
    metaTitle: 'WebP to JPG Converter | Free, Private, No Upload',
    metaDesc: 'Convert Google WebP images to universal JPG format. No upload, no signup — runs 100% in your browser.',
    faqJson: [
      { q: 'Why would I convert WebP to JPG?', a: 'Some older software and websites still don\'t support WebP. Converting to JPG ensures compatibility across all platforms.' },
    ],
    defaultConfig: { outputFormat: 'jpeg' },
    introText: 'WebP is Google\'s modern image format used across the web — but many desktop apps, email clients, and social platforms still require JPG. Convert your WebP images to widely compatible JPG instantly, with adjustable quality. Perfect for sharing photos or uploading to platforms that don\'t accept WebP.',
    locale: 'en',
    canonicalSlug: 'tools/convert-webp-to-jpg',
  },
  'de:werkzeuge/webp-zu-jpg-konvertieren': {
    toolId: 'image_converter',
    pageType: 'SPOKE',
    h1: 'WebP in JPG umwandeln — Kostenlos Online',
    metaTitle: 'WebP zu JPG Konverter | Kostenlos, Privat',
    metaDesc: 'Konvertieren Sie Google WebP-Bilder in das universelle JPG-Format. Ohne Upload, direkt im Browser.',
    faqJson: [],
    defaultConfig: { outputFormat: 'jpeg' },
    locale: 'de',
    canonicalSlug: 'tools/convert-webp-to-jpg',
  },
  'en:tools/convert-webp-to-png': {
    toolId: 'image_converter',
    pageType: 'SPOKE',
    h1: 'Convert WebP to PNG — Free Online',
    metaTitle: 'WebP to PNG Converter | Free, Lossless, Private',
    metaDesc: 'Convert WebP images to lossless PNG format with transparency preserved. No upload, no signup — runs in your browser.',
    faqJson: [
      { q: 'Does WebP to PNG preserve transparency?', a: 'Yes. PNG supports alpha transparency, so transparent areas in your WebP images are preserved perfectly.' },
    ],
    defaultConfig: { outputFormat: 'png' },
    introText: 'Need lossless quality or transparent backgrounds? Converting WebP to PNG preserves every pixel and supports full alpha transparency — ideal for logos, icons, screenshots, and design assets where quality cannot be compromised.',
    locale: 'en',
    canonicalSlug: 'tools/convert-webp-to-png',
  },
  'de:werkzeuge/webp-zu-png-konvertieren': {
    toolId: 'image_converter',
    pageType: 'SPOKE',
    h1: 'WebP in PNG umwandeln — Kostenlos Online',
    metaTitle: 'WebP zu PNG Konverter | Kostenlos, Verlustfrei',
    metaDesc: 'Konvertieren Sie WebP-Bilder in das verlustfreie PNG-Format mit Transparenz. Direkt im Browser.',
    faqJson: [],
    defaultConfig: { outputFormat: 'png' },
    locale: 'de',
    canonicalSlug: 'tools/convert-webp-to-png',
  },
  'en:tools/convert-avif-to-jpg': {
    toolId: 'image_converter',
    pageType: 'SPOKE',
    h1: 'Convert AVIF to JPG — Free Online',
    metaTitle: 'AVIF to JPG Converter | Free, Private, No Upload',
    metaDesc: 'Convert AVIF images to widely compatible JPG format. No upload, no signup — runs 100% in your browser.',
    faqJson: [],
    defaultConfig: { outputFormat: 'jpeg' },
    introText: 'AVIF is a next-generation image format with excellent compression, but browser and software support is still catching up. This converter transforms AVIF images into universally compatible JPG — perfect for sharing, printing, or uploading to platforms that don\'t yet support AVIF.',
    locale: 'en',
    canonicalSlug: 'tools/convert-avif-to-jpg',
  },
  'de:werkzeuge/avif-zu-jpg-konvertieren': {
    toolId: 'image_converter',
    pageType: 'SPOKE',
    h1: 'AVIF in JPG umwandeln — Kostenlos Online',
    metaTitle: 'AVIF zu JPG Konverter | Kostenlos, Privat',
    metaDesc: 'Konvertieren Sie AVIF-Bilder in das universelle JPG-Format. Direkt im Browser, ohne Upload.',
    faqJson: [],
    defaultConfig: { outputFormat: 'jpeg' },
    locale: 'de',
    canonicalSlug: 'tools/convert-avif-to-jpg',
  },

  // ─── Image Converter: ALTERNATIVEs ───
  'en:alternatives/convertio-free-alternative': {
    toolId: 'image_converter',
    pageType: 'ALTERNATIVE',
    h1: 'Free Convertio Alternative — Convert Images Locally',
    metaTitle: 'Convertio Free Alternative | No Upload, No Limits',
    metaDesc: 'Free Convertio alternative that converts HEIC, WebP, and AVIF images to JPG/PNG locally in your browser. No file uploads, no daily limits, complete privacy.',
    introText: 'Convertio is a popular cloud converter — but it uploads your files to their servers, limits free users to 100MB per day, and adds waiting times for large files. Our browser-based alternative converts images instantly with no uploads, no daily limits, and no waiting. Your files never leave your device.',
    faqJson: [
      { q: 'How is this different from Convertio?', a: 'Convertio uploads your files to their servers and limits free users to 100MB/day. BestOnline.Tools processes everything locally — unlimited conversions, complete privacy.' },
      { q: 'Does Convertio have daily limits?', a: 'Yes — Convertio limits free users to 100MB of conversions per day. Our tool has no daily, weekly, or monthly limits.' },
      { q: 'Which image formats are supported?', a: 'We support HEIC, WebP, AVIF, PNG, JPG, BMP, GIF, and TIFF. Convert between any of these formats instantly.' },
      { q: 'Does Convertio keep my files?', a: 'Convertio temporarily stores your files on their servers. Our tool processes everything locally — your images never leave your browser.' },
      { q: 'Can I convert multiple images at once?', a: 'Yes. Drop multiple images and batch-convert them all to your target format. Convertio\'s free tier has strict batch limits.' },
    ],
    defaultConfig: {},
    locale: 'en',
    canonicalSlug: 'alternatives/convertio-free-alternative',
  },
  'de:alternativen/convertio-kostenlose-alternative': {
    toolId: 'image_converter',
    pageType: 'ALTERNATIVE',
    h1: 'Kostenlose Convertio Alternative — Bilder lokal konvertieren',
    metaTitle: 'Convertio kostenlose Alternative | Ohne Upload',
    metaDesc: 'Kostenlose Alternative zu Convertio. HEIC, WebP, AVIF zu JPG/PNG direkt im Browser. Ohne Upload, ohne Limits.',
    faqJson: [],
    defaultConfig: {},
    locale: 'de',
    canonicalSlug: 'alternatives/convertio-free-alternative',
  },
  'en:alternatives/iloveimg-free-alternative': {
    toolId: 'image_converter',
    pageType: 'ALTERNATIVE',
    h1: 'Free iLoveIMG Alternative — Convert Images Without Upload',
    metaTitle: 'Free iLoveIMG Alternative | Private',
    metaDesc: 'Free iLoveIMG alternative that converts, compresses, and resizes images locally in your browser. No uploads, no batch limits, no email required.',
    introText: 'iLoveIMG is a popular online image tool suite — but it uploads your files to their servers, limits batch sizes for free users, and shows ads. Our alternative processes images entirely in your browser: no uploads, no batch limits, no ads, and complete privacy.',
    faqJson: [
      { q: 'How is this different from iLoveIMG?', a: 'iLoveIMG requires file uploads and has batch limits. BestOnline.Tools converts instantly in your browser with no upload and no file count restrictions.' },
      { q: 'Does iLoveIMG upload my images?', a: 'Yes — iLoveIMG uploads your images to their cloud servers for processing. Our tool never uploads anything.' },
      { q: 'Are there batch limits?', a: 'No. iLoveIMG restricts free users to a limited number of files per operation. Our tool lets you process as many images as your device can handle.' },
      { q: 'Does iLoveIMG show ads?', a: 'Yes — the free version includes ads and promotional banners. Our tool is completely ad-free.' },
      { q: 'Which features are available?', a: 'We offer image conversion (HEIC, WebP, AVIF, PNG, JPG), compression, resizing, cropping, and background removal — covering the core iLoveIMG features.' },
    ],
    defaultConfig: {},
    locale: 'en',
    canonicalSlug: 'alternatives/iloveimg-free-alternative',
  },
  'de:alternativen/iloveimg-kostenlose-alternative': {
    toolId: 'image_converter',
    pageType: 'ALTERNATIVE',
    h1: 'Kostenlose iLoveIMG Alternative — Bilder ohne Upload konvertieren',
    metaTitle: 'iLoveIMG Alternative | Kostenlos, Privat',
    metaDesc: 'Kostenlose Alternative zu iLoveIMG. Bilder sofort im Browser konvertieren — kein Upload, keine E-Mail.',
    faqJson: [],
    defaultConfig: {},
    locale: 'de',
    canonicalSlug: 'alternatives/iloveimg-free-alternative',
  },

  // ─── Image Resize: HUB ───
  'en:image/resize': {
    toolId: 'image_resize',
    pageType: 'HUB',
    h1: 'Resize Image Online — Free & Private',
    metaTitle: 'Image Resizer | Free, No Upload',
    metaDesc: 'Resize images to any dimensions, percentages, or social media presets. Export as PNG, JPG, or WebP — 100% in your browser.',
    faqJson: [
      { q: 'Is it free?', a: 'Yes, 100% free with no limits.' },
      { q: 'Are my images private?', a: 'Yes. All resizing happens locally in your browser.' },
    ],
    defaultConfig: {},
    locale: 'en',
    canonicalSlug: 'image/resize',
  },
  'de:bild/groesse-aendern': {
    toolId: 'image_resize',
    pageType: 'HUB',
    h1: 'Bildgröße ändern — Kostenlos & Privat',
    metaTitle: 'Bild verkleinern | Kostenlos',
    metaDesc: 'Ändern Sie die Größe von Bildern auf beliebige Abmessungen. Export als PNG, JPG oder WebP — 100% im Browser.',
    faqJson: [],
    defaultConfig: {},
    locale: 'de',
    canonicalSlug: 'image/resize',
  },

  // ─── Image Resize: SPOKEs ───
  'en:tools/resize-image-for-instagram': {
    toolId: 'image_resize',
    pageType: 'SPOKE',
    h1: 'Resize Image for Instagram — Perfect Dimensions',
    metaTitle: 'Resize for Instagram | Free',
    metaDesc: 'Resize images to Instagram post (1080×1080), story (1080×1920), or reel dimensions. Free and instant.',
    faqJson: [],
    defaultConfig: {},
    introText: 'Resize your photos to Instagram\'s exact dimensions — 1080×1080 for square posts, 1080×1350 for portrait, or 1080×566 for landscape. Avoid cropping surprises and blurry uploads by getting the size right before posting.',
    locale: 'en',
    canonicalSlug: 'tools/resize-image-for-instagram',
  },
  'en:tools/crop-image-online': {
    toolId: 'image_resize',
    pageType: 'SPOKE',
    h1: 'Crop Image Online — Free Photo Cropper',
    metaTitle: 'Crop Image Online | Free',
    metaDesc: 'Crop and resize any image to custom dimensions or specific aspect ratios. Supports JPG, PNG, and WebP. Free, private, no signup — runs in your browser.',
    faqJson: [],
    defaultConfig: {},
    introText: 'Crop images to exact dimensions or aspect ratios right in your browser. Perfect for removing unwanted edges, framing subjects, or preparing images for specific platform requirements like social media headers and profile photos.',
    locale: 'en',
    canonicalSlug: 'tools/crop-image-online',
  },
  'en:tools/photo-resizer': {
    toolId: 'image_resize',
    pageType: 'SPOKE',
    h1: 'Photo Resizer — Resize Photos in Seconds',
    metaTitle: 'Photo Resizer | Free Online',
    metaDesc: 'Resize photos to any size. Use presets for social media or enter custom dimensions. Free, private, no signup.',
    faqJson: [],
    defaultConfig: {},
    introText: 'Resize photos to any custom dimension while maintaining aspect ratio. Whether you need passport photos, product images for your online store, or thumbnails for your website — set the exact width and height you need.',
    locale: 'en',
    canonicalSlug: 'tools/photo-resizer',
  },

  // ─── Image Base64: HUB ───
  'en:image/base64': {
    toolId: 'image_base64',
    pageType: 'HUB',
    h1: 'Image to Base64 Converter — Free & Instant',
    metaTitle: 'Image to Base64 | Free, No Upload',
    metaDesc: 'Convert images to Base64 data URIs for embedding in HTML/CSS. Also decode Base64 back to images. 100% in your browser.',
    faqJson: [
      { q: 'What is Base64?', a: 'Base64 is a text encoding that represents binary data (like images) as a string of ASCII characters.' },
      { q: 'Is it free?', a: 'Yes, 100% free with no limits.' },
    ],
    defaultConfig: {},
    locale: 'en',
    canonicalSlug: 'image/base64',
  },
  'de:bild/base64': {
    toolId: 'image_base64',
    pageType: 'HUB',
    h1: 'Bild zu Base64 Konverter — Kostenlos',
    metaTitle: 'Bild zu Base64 | Kostenlos',
    metaDesc: 'Konvertieren Sie Bilder in Base64 Data URIs zum Einbetten in HTML/CSS. 100% im Browser.',
    faqJson: [],
    defaultConfig: {},
    locale: 'de',
    canonicalSlug: 'image/base64',
  },

  // ─── Image Base64: SPOKEs ───
  'en:tools/base64-to-image': {
    toolId: 'image_base64',
    pageType: 'SPOKE',
    h1: 'Base64 to Image — Decode Base64 Strings',
    metaTitle: 'Base64 to Image Decoder | Free',
    metaDesc: 'Decode Base64 strings back to images. Paste your Base64 data and download the decoded image. Free and instant.',
    faqJson: [],
    defaultConfig: {},
    introText: 'Decode a Base64-encoded string back into a viewable image file. Paste the Base64 data and instantly see the image, then download it as PNG, JPG, or WebP. Common when extracting embedded images from HTML, CSS, or API responses.',
    locale: 'en',
    canonicalSlug: 'tools/base64-to-image',
  },
  'en:tools/image-data-uri-converter': {
    toolId: 'image_base64',
    pageType: 'SPOKE',
    h1: 'Image Data URI Converter — For Developers',
    metaTitle: 'Data URI Converter | Free',
    metaDesc: 'Convert images to data URIs for embedding inline in HTML, CSS, or JSON. No server upload required.',
    faqJson: [],
    defaultConfig: {},
    introText: 'Convert images to data URIs for embedding directly in HTML and CSS. Data URIs eliminate extra HTTP requests by inlining image data as Base64 — useful for small icons, logos, and email templates where external image hosting isn\'t available.',
    locale: 'en',
    canonicalSlug: 'tools/image-data-uri-converter',
  },

  // ─── Video to GIF: HUB ───
  'en:image/video-to-gif': {
    toolId: 'video_to_gif',
    pageType: 'HUB',
    h1: 'Video to GIF Converter — Free & Private',
    metaTitle: 'Video to GIF | Free, No Upload',
    metaDesc: 'Convert MP4, WebM, or MOV videos to high-quality animated GIFs. Trim, set FPS, choose size — 100% in your browser.',
    faqJson: [
      { q: 'Is it free?', a: 'Yes, 100% free with no limits.' },
      { q: 'Are my videos private?', a: 'Yes. All processing happens locally using FFmpeg.wasm.' },
    ],
    defaultConfig: {},
    locale: 'en',
    canonicalSlug: 'image/video-to-gif',
  },
  'de:bild/video-zu-gif': {
    toolId: 'video_to_gif',
    pageType: 'HUB',
    h1: 'Video in GIF umwandeln — Kostenlos',
    metaTitle: 'Video zu GIF | Kostenlos',
    metaDesc: 'Konvertieren Sie MP4 oder WebM Videos in animierte GIFs. Zuschneiden, FPS einstellen — 100% im Browser.',
    faqJson: [],
    defaultConfig: {},
    locale: 'de',
    canonicalSlug: 'image/video-to-gif',
  },

  // ─── Video to GIF: SPOKEs ───
  'en:tools/mp4-to-gif': {
    toolId: 'video_to_gif',
    pageType: 'SPOKE',
    h1: 'MP4 to GIF — Convert MP4 Videos to Animated GIFs',
    metaTitle: 'MP4 to GIF Converter | Free Online',
    metaDesc: 'Convert MP4 video clips to animated GIF images. Trim start and end, adjust frame rate and quality. Free, private — runs completely in your browser.',
    faqJson: [],
    defaultConfig: {},
    introText: 'Convert video clips into lightweight GIF animations perfect for social media, Slack reactions, presentations, and tutorials. Choose the start time, duration, and frame rate to create the perfect looping animation from any MP4 video.',
    locale: 'en',
    canonicalSlug: 'tools/mp4-to-gif',
  },
  'en:tools/gif-maker': {
    toolId: 'video_to_gif',
    pageType: 'SPOKE',
    h1: 'GIF Maker — Create Animated GIFs from Video',
    metaTitle: 'GIF Maker | Free Online',
    metaDesc: 'Free GIF maker. Convert any video clip to a high-quality animated GIF. No upload, no signup required.',
    faqJson: [],
    defaultConfig: {},
    introText: 'Create animated GIFs from video clips or sequential images. Our GIF maker gives you control over frame rate, dimensions, and loop count — perfect for memes, how-to demonstrations, product showcases, and sharable reactions.',
    locale: 'en',
    canonicalSlug: 'tools/gif-maker',
  },

  // ─── QR Code Generator: HUB ───
  'en:tools/qr-code-generator': {
    toolId: 'qr_code',
    pageType: 'HUB',
    h1: 'QR Code Generator — Free & Instant',
    metaTitle: 'QR Code Generator | Free, No Upload',
    metaDesc: 'Generate QR codes for URLs, text, and WiFi. Customize colors, download as PNG or SVG — 100% in your browser.',
    faqJson: [
      { q: 'Can I make WiFi QR codes?', a: 'Yes — enter your WiFi SSID and password to generate a QR code that auto-connects devices.' },
      { q: 'Is it free?', a: 'Yes, 100% free with no limits.' },
    ],
    defaultConfig: {},
    locale: 'en',
    canonicalSlug: 'tools/qr-code-generator',
  },
  'de:werkzeuge/qr-code-erstellen': {
    toolId: 'qr_code',
    pageType: 'HUB',
    h1: 'QR-Code Generator — Kostenlos',
    metaTitle: 'QR-Code Generator | Kostenlos',
    metaDesc: 'Erstellen Sie QR-Codes für URLs, Text und WLAN. Farben anpassen, als PNG oder SVG herunterladen — 100% im Browser.',
    faqJson: [],
    defaultConfig: {},
    locale: 'de',
    canonicalSlug: 'tools/qr-code-generator',
  },

  // ─── QR Code Generator: SPOKEs ───
  'en:tools/qr-code-for-wifi': {
    toolId: 'qr_code',
    pageType: 'SPOKE',
    h1: 'WiFi QR Code Generator — Share Your WiFi',
    metaTitle: 'WiFi QR Code Generator | Free',
    metaDesc: 'Generate a QR code for your WiFi network. Guests scan to connect instantly — no typing passwords.',
    faqJson: [],
    defaultConfig: {},
    introText: 'Generate a QR code that lets anyone join your WiFi network instantly — no need to spell out the password. Perfect for restaurants, Airbnbs, offices, and events. Just scan and connect. The QR code is generated entirely on your device.',
    locale: 'en',
    canonicalSlug: 'tools/qr-code-for-wifi',
  },
  'en:tools/qr-code-for-link': {
    toolId: 'qr_code',
    pageType: 'SPOKE',
    h1: 'QR Code for Link — Turn URLs into QR Codes',
    metaTitle: 'QR Code for URL | Free',
    metaDesc: 'Convert any URL into a scannable QR code. Download as PNG or SVG for print. Free and instant.',
    faqJson: [],
    defaultConfig: {},
    introText: 'Create a scannable QR code for any URL — your website, social media profile, app download link, or portfolio. Download as PNG or SVG for use on business cards, flyers, product packaging, or digital displays.',
    locale: 'en',
    canonicalSlug: 'tools/qr-code-for-link',
  },

  // ─── Sign PDF: HUB ───
  'en:pdf/sign': {
    toolId: 'sign_pdf',
    pageType: 'HUB',
    h1: 'Sign PDF Online — Free & Private',
    metaTitle: 'Sign PDF | Free, No Upload',
    metaDesc: 'Draw your signature and add it to any PDF. Position on any page — 100% in your browser. No upload, no signup.',
    faqJson: [
      { q: 'Is it free?', a: 'Yes, 100% free with no limits.' },
      { q: 'Is my document private?', a: 'Yes. Your PDF is processed locally and never uploaded.' },
    ],
    defaultConfig: {},
    locale: 'en',
    canonicalSlug: 'pdf/sign',
  },
  'de:pdf/unterschreiben': {
    toolId: 'sign_pdf',
    pageType: 'HUB',
    h1: 'PDF Online Unterschreiben — Kostenlos',
    metaTitle: 'PDF Unterschreiben | Kostenlos',
    metaDesc: 'Zeichnen Sie Ihre Unterschrift und fügen Sie sie in jede PDF ein — 100% im Browser.',
    faqJson: [],
    defaultConfig: {},
    locale: 'de',
    canonicalSlug: 'pdf/sign',
  },

  // ─── Sign PDF: SPOKEs ───
  'en:tools/sign-pdf-online-free': {
    toolId: 'sign_pdf',
    pageType: 'SPOKE',
    h1: 'Sign PDF Online Free — No Account Required',
    metaTitle: 'Sign PDF Online Free',
    metaDesc: 'Sign any PDF document for free. Draw your signature directly on the page, position it precisely, and download — no account, no watermarks, fully private.',
    faqJson: [],
    defaultConfig: {},
    introText: 'Sign PDF documents electronically without printing. Draw or type your signature directly on the page, position it precisely, then download the signed PDF. Perfect for contracts, agreements, and forms that need a quick signature.',
    locale: 'en',
    canonicalSlug: 'tools/sign-pdf-online-free',
  },
  'en:tools/add-signature-to-pdf': {
    toolId: 'sign_pdf',
    pageType: 'SPOKE',
    h1: 'Add Signature to PDF — E-Sign Documents',
    metaTitle: 'Add Signature to PDF | Free',
    metaDesc: 'Add your handwritten signature to PDF documents. Works on desktop and mobile. Free and private.',
    faqJson: [],
    defaultConfig: {},
    introText: 'Place your digital signature on any page of a PDF document. Choose from drawing, typing, or uploading an image of your signature. Position and resize it freely before saving. No printing, scanning, or Adobe Acrobat needed.',
    locale: 'en',
    canonicalSlug: 'tools/add-signature-to-pdf',
  },

  // ─── PDF Form Filler: HUB ───
  'en:pdf/fill-form': {
    toolId: 'pdf_form_filler',
    pageType: 'HUB',
    h1: 'Fill PDF Form Online — Free & Private',
    metaTitle: 'PDF Form Filler | Free, No Upload',
    metaDesc: 'Fill out PDF forms online. Auto-detects text fields, checkboxes, and dropdowns — 100% in your browser.',
    faqJson: [
      { q: 'What PDFs work with this?', a: 'PDFs with interactive form fields (text, checkbox, dropdown, radio).' },
      { q: 'Is it free?', a: 'Yes, 100% free with no limits.' },
    ],
    defaultConfig: {},
    locale: 'en',
    canonicalSlug: 'pdf/fill-form',
  },
  'de:pdf/formular-ausfuellen': {
    toolId: 'pdf_form_filler',
    pageType: 'HUB',
    h1: 'PDF Formular online ausfüllen — Kostenlos',
    metaTitle: 'PDF Formular Ausfüllen | Kostenlos',
    metaDesc: 'Füllen Sie PDF Formulare online aus. Textfelder, Checkboxen und Dropdowns — 100% im Browser.',
    faqJson: [],
    defaultConfig: {},
    locale: 'de',
    canonicalSlug: 'pdf/fill-form',
  },

  // ─── PDF Form Filler: SPOKEs ───
  'en:tools/fill-pdf-form-online': {
    toolId: 'pdf_form_filler',
    pageType: 'SPOKE',
    h1: 'Fill PDF Form Online — Free Form Editor',
    metaTitle: 'Fill PDF Form Online | Free',
    metaDesc: 'Fill out any PDF form online. Detect and edit text fields, checkboxes, dropdowns. Free and private.',
    faqJson: [],
    defaultConfig: {},
    introText: 'Fill out interactive PDF forms directly in your browser — no software installation needed. The tool detects text fields, checkboxes, and dropdowns in your PDF so you can complete and save the form digitally.',
    locale: 'en',
    canonicalSlug: 'tools/fill-pdf-form-online',
  },

  // ─── PDF to Images: HUB ───
  'en:pdf/to-images': {
    toolId: 'pdf_to_images',
    pageType: 'HUB',
    h1: 'PDF to Image Converter — Free & Private',
    metaTitle: 'PDF to Image | Free, No Upload',
    metaDesc: 'Convert PDF pages to PNG or JPG images. Choose DPI quality — 100% in your browser. No upload, no signup.',
    faqJson: [
      { q: 'Is it free?', a: 'Yes, 100% free with no limits.' },
      { q: 'Are my files private?', a: 'Yes. Your PDF is rendered locally using PDF.js.' },
    ],
    defaultConfig: {},
    locale: 'en',
    canonicalSlug: 'pdf/to-images',
  },
  'de:pdf/in-bilder': {
    toolId: 'pdf_to_images',
    pageType: 'HUB',
    h1: 'PDF in Bilder umwandeln — Kostenlos',
    metaTitle: 'PDF zu Bild | Kostenlos',
    metaDesc: 'Konvertieren Sie PDF-Seiten zu PNG oder JPG. DPI-Qualität wählen — 100% im Browser.',
    faqJson: [],
    defaultConfig: {},
    locale: 'de',
    canonicalSlug: 'pdf/to-images',
  },

  // ─── PDF to Images: SPOKEs ───
  'en:tools/pdf-to-png': {
    toolId: 'pdf_to_images',
    pageType: 'SPOKE',
    h1: 'PDF to PNG — Convert PDF Pages to PNG Images',
    metaTitle: 'PDF to PNG Converter | Free Online',
    metaDesc: 'Convert every page of your PDF to high-quality PNG images with customizable DPI. Free, private, 100% browser-based — your files never leave your device.',
    faqJson: [],
    defaultConfig: {},
    introText: 'Extract every page of a PDF as a high-resolution PNG image. Perfect for sharing individual pages on social media, embedding in presentations, or archiving documents as images. Choose the DPI for print-quality or web-optimized output.',
    locale: 'en',
    canonicalSlug: 'tools/pdf-to-png',
  },
  'en:tools/pdf-to-jpg': {
    toolId: 'pdf_to_images',
    pageType: 'SPOKE',
    h1: 'PDF to JPG — Convert PDF Pages to JPG Images',
    metaTitle: 'PDF to JPG Converter | Free Online',
    metaDesc: 'Convert PDF pages to compressed JPG images. Choose quality and download all pages. Free and instant.',
    faqJson: [],
    defaultConfig: {},
    introText: 'Convert PDF pages to JPG images for easy sharing, embedding, and archiving. JPG is universally supported across all devices and platforms, making it ideal for social media posts, email attachments, and website content.',
    locale: 'en',
    canonicalSlug: 'tools/pdf-to-jpg',
  },

  // ─── OCR: HUB ───
  'en:image/ocr': {
    toolId: 'ocr',
    pageType: 'HUB',
    h1: 'OCR — Extract Text from Images',
    metaTitle: 'OCR Image to Text | Free, No Upload',
    metaDesc: 'Extract text from photos, screenshots, and scanned documents. Supports 10 languages — 100% in your browser.',
    faqJson: [
      { q: 'How many languages are supported?', a: '10 languages including English, German, French, Spanish, Japanese, Chinese, and Korean.' },
      { q: 'Is it free?', a: 'Yes, 100% free with no limits.' },
    ],
    defaultConfig: {},
    locale: 'en',
    canonicalSlug: 'image/ocr',
  },
  'de:bild/texterkennung': {
    toolId: 'ocr',
    pageType: 'HUB',
    h1: 'Texterkennung (OCR) — Text aus Bildern extrahieren',
    metaTitle: 'OCR Texterkennung | Kostenlos',
    metaDesc: 'Extrahieren Sie Text aus Fotos und gescannten Dokumenten. 10 Sprachen unterstützt — 100% im Browser.',
    faqJson: [],
    defaultConfig: {},
    locale: 'de',
    canonicalSlug: 'image/ocr',
  },

  // ─── OCR: SPOKEs ───
  'en:tools/image-to-text': {
    toolId: 'ocr',
    pageType: 'SPOKE',
    h1: 'Image to Text — Extract Text from Any Image',
    metaTitle: 'Image to Text | Free OCR Online',
    metaDesc: 'Convert images to text using OCR. Upload a photo or screenshot and extract all readable text. Free and private.',
    faqJson: [],
    defaultConfig: {},
    introText: 'Extract text from any image using optical character recognition (OCR). Upload photos of documents, receipts, whiteboards, or screenshots and get editable, searchable text — all processed privately in your browser.',
    locale: 'en',
    canonicalSlug: 'tools/image-to-text',
  },
  'en:tools/photo-to-text': {
    toolId: 'ocr',
    pageType: 'SPOKE',
    h1: 'Photo to Text — Read Text from Photos',
    metaTitle: 'Photo to Text | Free',
    metaDesc: 'Extract text from photos. Take a picture of any text and convert it to editable text. Supports 10 languages.',
    faqJson: [],
    defaultConfig: {},
    introText: 'Turn photos of printed text into editable digital text. Perfect for digitizing book pages, handwritten notes, business cards, or any photograph containing text you need to copy, edit, or translate.',
    locale: 'en',
    canonicalSlug: 'tools/photo-to-text',
  },
  'en:tools/screenshot-to-text': {
    toolId: 'ocr',
    pageType: 'SPOKE',
    h1: 'Screenshot to Text — Extract Text from Screenshots',
    metaTitle: 'Screenshot to Text | Free',
    metaDesc: 'Copy text from screenshots using OCR. Paste a screenshot and extract all text instantly. Free and private.',
    faqJson: [],
    defaultConfig: {},
    introText: 'Extract text from screenshots instantly. Copy text from error messages, chat conversations, social media posts, or any screen capture where you can\'t select the text directly. The OCR engine handles any font and background.',
    locale: 'en',
    canonicalSlug: 'tools/screenshot-to-text',
  },

  // ─── Word Counter: HUB ───
  'en:tools/word-counter': {
    toolId: 'word_counter', pageType: 'HUB',
    h1: 'Word Counter — Count Words, Characters & More',
    metaTitle: 'Word Counter | Free Online',
    metaDesc: 'Free word counter. Count words, characters, sentences, paragraphs. Estimate reading and speaking time — instantly.',
    faqJson: [{ q: 'Is it free?', a: 'Yes, 100% free.' }],
    defaultConfig: {}, locale: 'en', canonicalSlug: 'tools/word-counter',
  },
  'en:tools/character-counter': {
    toolId: 'word_counter', pageType: 'SPOKE',
    h1: 'Character Counter — Count Letters & Characters Online',
    metaTitle: 'Character Counter | Free',
    metaDesc: 'Free character counter. Count characters with and without spaces. Track words, sentences, and paragraphs.',
    faqJson: [], defaultConfig: {}, locale: 'en', canonicalSlug: 'tools/character-counter',
  },

  // ─── Case Converter: HUB ───
  'en:tools/case-converter': {
    toolId: 'case_converter', pageType: 'HUB',
    h1: 'Case Converter — Change Text Case Online',
    metaTitle: 'Case Converter | Free Online',
    metaDesc: 'Free case converter. Change text to uppercase, lowercase, title case, sentence case — instantly in your browser.',
    faqJson: [{ q: 'Is it free?', a: 'Yes, 100% free.' }],
    defaultConfig: {}, locale: 'en', canonicalSlug: 'tools/case-converter',
  },
  'en:tools/uppercase-converter': {
    toolId: 'case_converter', pageType: 'SPOKE',
    h1: 'Uppercase Converter — Convert Text to UPPER CASE',
    metaTitle: 'Uppercase Converter | Free',
    metaDesc: 'Convert any text to uppercase instantly. Free online tool, no signup required.',
    faqJson: [], defaultConfig: {}, locale: 'en', canonicalSlug: 'tools/uppercase-converter',
  },

  // ─── Lorem Ipsum: HUB ───
  'en:tools/lorem-ipsum': {
    toolId: 'lorem_ipsum', pageType: 'HUB',
    h1: 'Lorem Ipsum Generator — Placeholder Text',
    metaTitle: 'Lorem Ipsum Generator | Free',
    metaDesc: 'Free Lorem Ipsum generator. Generate paragraphs, sentences, or words of placeholder text for designs.',
    faqJson: [{ q: 'Is it free?', a: 'Yes, 100% free.' }],
    defaultConfig: {}, locale: 'en', canonicalSlug: 'tools/lorem-ipsum',
  },

  // ─── Text to PDF: HUB ───
  'en:tools/text-to-pdf': {
    toolId: 'text_to_pdf', pageType: 'HUB',
    h1: 'Text to PDF — Convert Text to PDF Online',
    metaTitle: 'Text to PDF | Free, No Upload',
    metaDesc: 'Free text to PDF converter. Type or paste text, choose font and size, download as PDF — 100% in your browser.',
    faqJson: [{ q: 'Is it free?', a: 'Yes, 100% free.' }],
    defaultConfig: {}, locale: 'en', canonicalSlug: 'tools/text-to-pdf',
  },
  'en:tools/txt-to-pdf': {
    toolId: 'text_to_pdf', pageType: 'SPOKE',
    h1: 'TXT to PDF — Convert Text Files to PDF',
    metaTitle: 'TXT to PDF Converter | Free',
    metaDesc: 'Convert plain text to formatted PDF documents. Choose font and size. Free and instant.',
    faqJson: [], defaultConfig: {}, locale: 'en', canonicalSlug: 'tools/txt-to-pdf',
  },

  // ─── DE HUBs for Text & Dev Tools ───
  'de:werkzeuge/wort-zaehler': {
    toolId: 'word_counter', pageType: 'HUB',
    h1: 'Wortzähler — Wörter, Zeichen & Mehr zählen',
    metaTitle: 'Wortzähler | Kostenlos Online',
    metaDesc: 'Kostenloser Wortzähler. Wörter, Zeichen, Sätze, Absätze zählen. Lese- und Sprechzeit schätzen — sofort.',
    faqJson: [{ q: 'Ist es kostenlos?', a: 'Ja, 100% kostenlos. Keine Anmeldung erforderlich.' }],
    defaultConfig: {}, locale: 'de', canonicalSlug: 'tools/word-counter',
  },
  'de:werkzeuge/gross-kleinschreibung': {
    toolId: 'case_converter', pageType: 'HUB',
    h1: 'Groß-/Kleinschreibung ändern — Kostenlos Online',
    metaTitle: 'Text Groß-/Kleinschreibung | Kostenlos',
    metaDesc: 'Kostenloser Text-Konverter. Großbuchstaben, Kleinbuchstaben, Titelschreibweise, Satzschreibweise — sofort im Browser.',
    faqJson: [{ q: 'Ist es kostenlos?', a: 'Ja, 100% kostenlos.' }],
    defaultConfig: {}, locale: 'de', canonicalSlug: 'tools/case-converter',
  },
  'de:werkzeuge/lorem-ipsum': {
    toolId: 'lorem_ipsum', pageType: 'HUB',
    h1: 'Lorem Ipsum Generator — Platzhaltertext',
    metaTitle: 'Lorem Ipsum Generator | Kostenlos',
    metaDesc: 'Kostenloser Lorem Ipsum Generator. Absätze, Sätze oder Wörter als Platzhaltertext für Designs generieren.',
    faqJson: [{ q: 'Ist es kostenlos?', a: 'Ja, 100% kostenlos.' }],
    defaultConfig: {}, locale: 'de', canonicalSlug: 'tools/lorem-ipsum',
  },
  'de:werkzeuge/text-zu-pdf': {
    toolId: 'text_to_pdf', pageType: 'HUB',
    h1: 'Text zu PDF — Text in PDF umwandeln',
    metaTitle: 'Text zu PDF | Kostenlos, Ohne Upload',
    metaDesc: 'Kostenloser Text-zu-PDF-Konverter. Text eingeben, Schriftart und Größe wählen, als PDF herunterladen — 100% im Browser.',
    faqJson: [{ q: 'Ist es kostenlos?', a: 'Ja, 100% kostenlos.' }],
    defaultConfig: {}, locale: 'de', canonicalSlug: 'tools/text-to-pdf',
  },
  'de:werkzeuge/json-formatierer': {
    toolId: 'json_formatter', pageType: 'HUB',
    h1: 'JSON Formatierer & Validator — Kostenlos Online',
    metaTitle: 'JSON Formatierer | Kostenlos',
    metaDesc: 'Kostenloser JSON-Formatierer, Beautifier und Validator. JSON-Daten formatieren oder minifizieren — sofort.',
    faqJson: [{ q: 'Validiert es auch?', a: 'Ja — ungültiges JSON zeigt eine detaillierte Fehlermeldung.' }],
    defaultConfig: {}, locale: 'de', canonicalSlug: 'tools/json-formatter',
  },

  'en:tools/json-formatter': {
    toolId: 'json_formatter', pageType: 'HUB',
    h1: 'JSON Formatter & Validator — Free Online',
    metaTitle: 'JSON Formatter | Free Online',
    metaDesc: 'Free JSON formatter, beautifier, and validator. Pretty-print or minify JSON data instantly.',
    faqJson: [{ q: 'Does it validate?', a: 'Yes — invalid JSON shows a detailed error message.' }],
    defaultConfig: {}, locale: 'en', canonicalSlug: 'tools/json-formatter',
  },
  'en:tools/json-validator': {
    toolId: 'json_formatter', pageType: 'SPOKE',
    h1: 'JSON Validator — Check if JSON is Valid',
    metaTitle: 'JSON Validator | Free',
    metaDesc: 'Validate JSON syntax online. Paste your JSON and see if it is valid — detailed error messages for invalid data.',
    introText: 'Paste your JSON and instantly see whether it is valid. Invalid JSON gets a detailed error message pinpointing the exact line and character where the syntax breaks — making debugging API responses and config files much faster.',
    faqJson: [
      { q: 'What errors does it detect?', a: 'Missing commas, trailing commas, unquoted keys, mismatched brackets, invalid escape sequences, and more. Each error includes the line number and position.' },
    ],
    defaultConfig: {}, locale: 'en', canonicalSlug: 'tools/json-validator',
  },
  'en:tools/json-beautifier': {
    toolId: 'json_formatter', pageType: 'SPOKE',
    h1: 'JSON Beautifier — Pretty-Print JSON Online',
    metaTitle: 'JSON Beautifier | Free',
    metaDesc: 'Beautify and pretty-print minified JSON with proper indentation. Make compressed API responses readable. Free online JSON beautifier.',
    introText: 'Turn unreadable minified JSON into clean, properly indented code. Perfect for making sense of compressed API responses, config files, and database exports. Choose 2-space or 4-space indentation.',
    faqJson: [
      { q: 'What is JSON beautifying?', a: 'JSON beautifying (or pretty-printing) adds proper indentation and line breaks to compressed JSON, making it human-readable while keeping the data identical.' },
    ],
    defaultConfig: {}, locale: 'en', canonicalSlug: 'tools/json-beautifier',
  },
  'en:tools/json-minifier': {
    toolId: 'json_formatter', pageType: 'SPOKE',
    h1: 'JSON Minifier — Compress JSON Online',
    metaTitle: 'JSON Minifier | Free',
    metaDesc: 'Minify JSON by removing whitespace and line breaks. Reduce JSON file size for API payloads and storage. Free online tool.',
    introText: 'Remove all unnecessary whitespace, indentation, and line breaks from JSON data to reduce file size. Essential for optimizing API payloads, reducing storage costs, and improving network transfer speeds.',
    faqJson: [
      { q: 'Does minifying change the data?', a: 'No. Minifying only removes formatting (whitespace, newlines). The actual data structure and values remain identical.' },
    ],
    defaultConfig: {}, locale: 'en', canonicalSlug: 'tools/json-minifier',
  },

  // ─── Color Picker: HUB ───
  'en:tools/color-picker': {
    toolId: 'color_picker', pageType: 'HUB',
    h1: 'Color Picker — HEX, RGB, HSL Converter',
    metaTitle: 'Free Color Picker | HEX RGB HSL',
    metaDesc: 'Free color picker. Pick any color, convert between HEX, RGB, HSL. Copy to clipboard instantly.',
    faqJson: [{ q: 'What formats?', a: 'HEX, RGB, HSL, and CSS values.' }],
    defaultConfig: {}, locale: 'en', canonicalSlug: 'tools/color-picker',
  },
  'en:tools/hex-to-rgb': {
    toolId: 'color_picker', pageType: 'SPOKE',
    h1: 'HEX to RGB Converter — Convert Color Codes',
    metaTitle: 'HEX to RGB Converter | Free',
    metaDesc: 'Convert HEX color codes to RGB values instantly. Free color converter.',
    introText: 'Paste any HEX color code (like #FF5733) and instantly see the RGB values. Essential for web developers and designers who need to switch between CSS and design tool formats.',
    faqJson: [
      { q: 'What is a HEX color?', a: 'A HEX color is a 6-digit hexadecimal code (e.g., #FF5733) used in HTML and CSS. Each pair represents Red, Green, and Blue values from 00 to FF.' },
    ],
    defaultConfig: {}, locale: 'en', canonicalSlug: 'tools/hex-to-rgb',
  },
  'en:tools/rgb-to-hex': {
    toolId: 'color_picker', pageType: 'SPOKE',
    h1: 'RGB to HEX Converter — Convert Colors for CSS',
    metaTitle: 'RGB to HEX Converter | Free',
    metaDesc: 'Convert RGB color values to HEX codes for CSS and HTML. Enter red, green, and blue values and get the HEX code instantly. Free and instant.',
    introText: 'Convert RGB color values (like 255, 87, 51) to HEX codes for use in CSS, HTML, and web design. Enter your red, green, and blue values and copy the resulting HEX code with one click.',
    faqJson: [
      { q: 'Why convert RGB to HEX?', a: 'HEX codes are shorter and more commonly used in CSS and HTML. Converting rgb(255, 87, 51) to #FF5733 makes your stylesheets cleaner and more readable.' },
    ],
    defaultConfig: {}, locale: 'en', canonicalSlug: 'tools/rgb-to-hex',
  },
  'en:tools/color-code-converter': {
    toolId: 'color_picker', pageType: 'SPOKE',
    h1: 'Color Code Converter — HEX, RGB, HSL, CSS',
    metaTitle: 'Color Code Converter | Free',
    metaDesc: 'Convert between HEX, RGB, HSL, and CSS color formats. Enter any color code and see all equivalent values at once. Free online tool.',
    introText: 'Enter a color in any format — HEX (#FF5733), RGB (255, 87, 51), HSL (11, 100%, 60%), or a CSS named color — and instantly see all equivalent codes. Copy any format with one click for use in your designs or code.',
    faqJson: [
      { q: 'Which color formats are supported?', a: 'HEX (3 and 6 digit), RGB, HSL, and CSS named colors. All conversions happen instantly as you type.' },
    ],
    defaultConfig: {}, locale: 'en', canonicalSlug: 'tools/color-code-converter',
  },
  'de:werkzeuge/farbwaehler': {
    toolId: 'color_picker', pageType: 'HUB',
    h1: 'Farbwähler — HEX, RGB, HSL Konverter',
    metaTitle: 'Kostenloser Farbwähler | HEX RGB HSL',
    metaDesc: 'Kostenloser Farbwähler. Beliebige Farbe auswählen, zwischen HEX, RGB, HSL konvertieren. Sofort in die Zwischenablage kopieren.',
    faqJson: [{ q: 'Welche Formate?', a: 'HEX, RGB, HSL und CSS-Werte.' }],
    defaultConfig: {}, locale: 'de', canonicalSlug: 'tools/color-picker',
  },

  // ─── URL Encoder: HUB ───
  'en:tools/url-encoder': {
    toolId: 'url_encoder', pageType: 'HUB',
    h1: 'URL Encoder / Decoder — Free Online',
    metaTitle: 'URL Encoder Decoder | Free',
    metaDesc: 'Free URL encoder and decoder. Encode special characters or decode percent-encoded strings instantly.',
    faqJson: [{ q: 'Is it free?', a: 'Yes, 100% free.' }],
    defaultConfig: {}, locale: 'en', canonicalSlug: 'tools/url-encoder',
  },
  'de:werkzeuge/url-encoder': {
    toolId: 'url_encoder', pageType: 'HUB',
    h1: 'URL Encoder / Decoder — Kostenlos Online',
    metaTitle: 'URL Encoder Decoder | Kostenlos',
    metaDesc: 'Kostenloser URL-Encoder und -Decoder. Sonderzeichen kodieren oder prozent-kodierte Zeichenketten dekodieren.',
    faqJson: [{ q: 'Ist es kostenlos?', a: 'Ja, 100% kostenlos.' }],
    defaultConfig: {}, locale: 'de', canonicalSlug: 'tools/url-encoder',
  },

  // ─── Base64 Text: HUB ───
  'en:tools/base64-text': {
    toolId: 'base64_text', pageType: 'HUB',
    h1: 'Base64 Text Encoder / Decoder — Free Online',
    metaTitle: 'Base64 Encoder Decoder | Free',
    metaDesc: 'Free Base64 encoder and decoder for text. Encode text to Base64 or decode Base64 strings — supports UTF-8.',
    faqJson: [{ q: 'Is it free?', a: 'Yes, 100% free.' }],
    defaultConfig: {}, locale: 'en', canonicalSlug: 'tools/base64-text',
  },
  'de:werkzeuge/base64-text': {
    toolId: 'base64_text', pageType: 'HUB',
    h1: 'Base64 Text Encoder / Decoder — Kostenlos',
    metaTitle: 'Base64 Encoder Decoder | Kostenlos',
    metaDesc: 'Kostenloser Base64-Encoder und -Decoder für Text. Text in Base64 kodieren oder Base64-Strings dekodieren — UTF-8.',
    faqJson: [{ q: 'Ist es kostenlos?', a: 'Ja, 100% kostenlos.' }],
    defaultConfig: {}, locale: 'de', canonicalSlug: 'tools/base64-text',
  },

  // ─── Password Generator: HUB ───
  'en:tools/password-generator': {
    toolId: 'password_generator', pageType: 'HUB',
    h1: 'Password Generator — Create Strong Passwords',
    metaTitle: 'Password Generator | Free, Secure',
    metaDesc: 'Free password generator. Create strong, random passwords with customizable length and characters. Crypto-secure.',
    faqJson: [{ q: 'Is it secure?', a: 'Yes — uses crypto.getRandomValues().' }],
    defaultConfig: {}, locale: 'en', canonicalSlug: 'tools/password-generator',
  },
  'de:werkzeuge/passwort-generator': {
    toolId: 'password_generator', pageType: 'HUB',
    h1: 'Passwort-Generator — Sichere Passwörter erstellen',
    metaTitle: 'Passwort-Generator | Kostenlos, Sicher',
    metaDesc: 'Kostenloser Passwort-Generator. Starke, zufällige Passwörter mit anpassbarer Länge und Zeichen erstellen. Kryptografisch sicher.',
    faqJson: [{ q: 'Ist es sicher?', a: 'Ja — nutzt die Web Crypto API (crypto.getRandomValues) für echte Zufälligkeit.' }],
    defaultConfig: {}, locale: 'de', canonicalSlug: 'tools/password-generator',
  },
  'en:tools/strong-password-generator': {
    toolId: 'password_generator', pageType: 'SPOKE',
    h1: 'Strong Password Generator — Uncrackable Passwords',
    metaTitle: 'Strong Password Generator | Free',
    metaDesc: 'Generate strong, uncrackable passwords with uppercase, lowercase, numbers, and symbols. Cryptographically secure — runs locally in your browser.',
    introText: 'Create passwords that would take billions of years to crack. This generator uses your browser\'s crypto API to produce truly random, high-entropy passwords. Customize length (8-128 characters), include symbols, numbers, and mixed case for maximum security.',
    faqJson: [
      { q: 'What makes a password strong?', a: 'A strong password is at least 16 characters long and includes uppercase, lowercase, numbers, and symbols. Our generator creates passwords with maximum entropy.' },
      { q: 'Is this generator cryptographically secure?', a: 'Yes. We use the Web Crypto API (crypto.getRandomValues) which provides cryptographic-quality random numbers.' },
    ],
    defaultConfig: { length: 20, uppercase: true, lowercase: true, numbers: true, symbols: true },
    locale: 'en', canonicalSlug: 'tools/strong-password-generator',
  },
  'en:tools/random-password-generator': {
    toolId: 'password_generator', pageType: 'SPOKE',
    h1: 'Random Password Generator — Free & Instant',
    metaTitle: 'Random Password Generator | Free',
    metaDesc: 'Generate random passwords instantly. Choose length, character types, and get a unique password you can copy with one click. 100% browser-based.',
    introText: 'Need a random password quickly? This generator creates unique, unpredictable passwords on demand. Each password is generated using cryptographic randomness — never based on patterns, dictionaries, or timestamps.',
    faqJson: [
      { q: 'How random are these passwords?', a: 'Completely random. Each password is generated using the browser\'s cryptographic random number generator, ensuring true randomness.' },
    ],
    defaultConfig: { length: 16 },
    locale: 'en', canonicalSlug: 'tools/random-password-generator',
  },
  'en:tools/wifi-password-generator': {
    toolId: 'password_generator', pageType: 'SPOKE',
    h1: 'WiFi Password Generator — Secure Network Passwords',
    metaTitle: 'WiFi Password Generator | Free',
    metaDesc: 'Generate strong WiFi passwords for your router. Easy to type but hard to crack. Perfect for WPA2/WPA3 networks. Free, instant, private.',
    introText: 'Create a strong, unique password for your WiFi network that is both secure and reasonably easy for guests to type. WiFi passwords should be at least 12 characters with a mix of character types to protect against brute-force attacks on WPA2/WPA3 networks.',
    faqJson: [
      { q: 'How long should a WiFi password be?', a: 'At least 12 characters for WPA2 security. We recommend 16+ characters with mixed types for best protection against brute-force attacks.' },
      { q: 'Can I make it easier to type?', a: 'Yes — uncheck symbols to generate passwords without special characters, making them easier for guests to enter on mobile devices.' },
    ],
    defaultConfig: { length: 16, uppercase: true, lowercase: true, numbers: true, symbols: false },
    locale: 'en', canonicalSlug: 'tools/wifi-password-generator',
  },

  // ─── PDF Rotate: HUB ───
  'en:pdf/rotate': {
    toolId: 'pdf_rotate', pageType: 'HUB',
    h1: 'Rotate PDF Pages — Free Online',
    metaTitle: 'Rotate PDF Pages | Free Online',
    metaDesc: 'Free PDF page rotator. Rotate all or specific pages by 90°, 180° or 270° — no upload, 100% in browser.',
    faqJson: [{ q: 'Is it free?', a: 'Yes, 100% free.' }],
    defaultConfig: {}, locale: 'en', canonicalSlug: 'pdf/rotate',
  },
  'de:pdf/drehen': {
    toolId: 'pdf_rotate', pageType: 'HUB',
    h1: 'PDF-Seiten drehen — Kostenlos Online',
    metaTitle: 'PDF-Seiten drehen | Kostenlos',
    metaDesc: 'Kostenloser PDF-Seitenrotierer. Alle oder einzelne Seiten um 90°, 180° oder 270° drehen — ohne Upload, 100% im Browser.',
    faqJson: [{ q: 'Ist es kostenlos?', a: 'Ja, 100% kostenlos.' }],
    defaultConfig: {}, locale: 'de', canonicalSlug: 'pdf/rotate',
  },
  'en:tools/rotate-pdf-90-degrees': {
    toolId: 'pdf_rotate', pageType: 'SPOKE',
    h1: 'Rotate PDF 90 Degrees — Fix Portrait & Landscape',
    metaTitle: 'Rotate PDF 90 Degrees | Free',
    metaDesc: 'Rotate PDF pages by 90 degrees clockwise or counter-clockwise. Fix landscape/portrait orientation issues. Free, private, no upload required.',
    introText: 'Scanned documents and photos often end up sideways in PDFs. Rotate individual pages or the entire document by 90° to fix portrait and landscape orientation issues — all without uploading your document to any server.',
    faqJson: [
      { q: 'Can I rotate specific pages?', a: 'Yes. Select individual pages to rotate, or rotate all pages at once. You can also rotate different pages in different directions.' },
    ],
    defaultConfig: {}, locale: 'en', canonicalSlug: 'tools/rotate-pdf-90-degrees',
  },
  'en:tools/fix-upside-down-pdf': {
    toolId: 'pdf_rotate', pageType: 'SPOKE',
    h1: 'Fix Upside Down PDF — Rotate 180° Free',
    metaTitle: 'Fix Upside Down PDF | Free',
    metaDesc: 'Fix upside down PDF pages by rotating them 180 degrees. Common fix for scanned documents. Free, instant, no upload needed.',
    introText: 'Got a PDF where some pages are upside down? This happens frequently with scanned documents and faxes. Select the flipped pages and rotate them 180° to fix the orientation — your document stays on your device throughout.',
    faqJson: [
      { q: 'Why are my scanned PDFs upside down?', a: 'Scanners sometimes feed pages in the wrong orientation. This tool lets you fix individual pages by rotating them 180° without re-scanning.' },
    ],
    defaultConfig: {}, locale: 'en', canonicalSlug: 'tools/fix-upside-down-pdf',
  },

  // ─── Diff Checker: HUB ───
  'en:tools/diff-checker': {
    toolId: 'diff_checker', pageType: 'HUB',
    h1: 'Diff Checker — Compare Text Online',
    metaTitle: 'Diff Checker | Free Text Compare',
    metaDesc: 'Free diff checker. Compare two texts side-by-side and find additions, deletions, and changes instantly.',
    faqJson: [{ q: 'Is it free?', a: 'Yes, 100% free.' }],
    defaultConfig: {}, locale: 'en', canonicalSlug: 'tools/diff-checker',
  },
  'de:werkzeuge/text-vergleich': {
    toolId: 'diff_checker', pageType: 'HUB',
    h1: 'Text-Vergleich — Texte online vergleichen',
    metaTitle: 'Text-Vergleich | Kostenlos',
    metaDesc: 'Kostenloser Diff-Checker. Zwei Texte nebeneinander vergleichen und Ergänzungen, Löschungen und Änderungen sofort finden.',
    faqJson: [{ q: 'Ist es kostenlos?', a: 'Ja, 100% kostenlos.' }],
    defaultConfig: {}, locale: 'de', canonicalSlug: 'tools/diff-checker',
  },
  'en:tools/text-compare': {
    toolId: 'diff_checker', pageType: 'SPOKE',
    h1: 'Text Compare — Find Differences Between Texts',
    metaTitle: 'Text Compare | Free',
    metaDesc: 'Compare two blocks of text and see what changed. Free online text comparison tool.',
    faqJson: [], defaultConfig: {}, locale: 'en', canonicalSlug: 'tools/text-compare',
  },

  // ─── Hash Generator: HUB ───
  'en:tools/hash-generator': {
    toolId: 'hash_generator', pageType: 'HUB',
    h1: 'Hash Generator — SHA-256, SHA-512 & More',
    metaTitle: 'Free Hash Generator | SHA256 SHA512',
    metaDesc: 'Free hash generator. Compute SHA-1, SHA-256, SHA-384, SHA-512 hashes instantly using Web Crypto API.',
    faqJson: [{ q: 'Is it secure?', a: 'Yes — uses the browser native Web Crypto API.' }],
    defaultConfig: {}, locale: 'en', canonicalSlug: 'tools/hash-generator',
  },
  'de:werkzeuge/hash-generator': {
    toolId: 'hash_generator', pageType: 'HUB',
    h1: 'Hash-Generator — SHA-256, SHA-512 & Mehr',
    metaTitle: 'Kostenloser Hash-Generator | SHA256 SHA512',
    metaDesc: 'Kostenloser Hash-Generator. SHA-1, SHA-256, SHA-384, SHA-512 Hashes sofort berechnen mit der Web Crypto API.',
    faqJson: [{ q: 'Ist es sicher?', a: 'Ja — nutzt die native Web Crypto API des Browsers.' }],
    defaultConfig: {}, locale: 'de', canonicalSlug: 'tools/hash-generator',
  },
  'en:tools/sha256-hash-generator': {
    toolId: 'hash_generator', pageType: 'SPOKE',
    h1: 'SHA-256 Hash Generator — Free Online',
    metaTitle: 'SHA-256 Hash Generator | Free',
    metaDesc: 'Generate SHA-256 hashes from text or files instantly. Uses the browser\'s native Web Crypto API for secure hashing. Free and private.',
    introText: 'Compute SHA-256 hashes for text strings or files directly in your browser. SHA-256 is the most widely used hash algorithm for file verification, digital signatures, and password hashing. No data is sent to any server.',
    faqJson: [
      { q: 'What is SHA-256?', a: 'SHA-256 (Secure Hash Algorithm 256-bit) produces a unique 64-character hexadecimal fingerprint for any input. It is used for file integrity verification, blockchain, and security applications.' },
    ],
    defaultConfig: {}, locale: 'en', canonicalSlug: 'tools/sha256-hash-generator',
  },
  'en:tools/md5-hash-generator': {
    toolId: 'hash_generator', pageType: 'SPOKE',
    h1: 'MD5 Hash Generator — Free Online',
    metaTitle: 'MD5 Hash Generator | Free',
    metaDesc: 'Generate MD5 hashes from text instantly. Note: MD5 is not recommended for security. Use SHA-256 for cryptographic purposes. Free and private.',
    introText: 'Generate MD5 hashes for file checksums and legacy compatibility. While MD5 is no longer considered secure for cryptographic use, it remains widely used for file integrity verification and database checksums.',
    faqJson: [
      { q: 'Is MD5 still safe to use?', a: 'MD5 is fine for checksums and non-security purposes. For passwords and security, use SHA-256 or SHA-512 instead — MD5 is vulnerable to collision attacks.' },
    ],
    defaultConfig: {}, locale: 'en', canonicalSlug: 'tools/md5-hash-generator',
  },

  // ─── Regex Tester: HUB ───
  'en:tools/regex-tester': {
    toolId: 'regex_tester', pageType: 'HUB',
    h1: 'Regex Tester — Test Regular Expressions',
    metaTitle: 'Regex Tester | Free Online',
    metaDesc: 'Free regex tester. Write and test regular expressions with live matching and detailed results.',
    faqJson: [{ q: 'What syntax?', a: 'JavaScript/ECMAScript regex syntax.' }],
    defaultConfig: {}, locale: 'en', canonicalSlug: 'tools/regex-tester',
  },
  'de:werkzeuge/regex-tester': {
    toolId: 'regex_tester', pageType: 'HUB',
    h1: 'Regex-Tester — Reguläre Ausdrücke testen',
    metaTitle: 'Regex-Tester | Kostenlos Online',
    metaDesc: 'Kostenloser Regex-Tester. Reguläre Ausdrücke schreiben und testen mit Live-Matching und detaillierten Ergebnissen.',
    faqJson: [{ q: 'Welche Syntax?', a: 'JavaScript/ECMAScript Regex-Syntax.' }],
    defaultConfig: {}, locale: 'de', canonicalSlug: 'tools/regex-tester',
  },

  // ─── CSV JSON: HUB ───
  'en:tools/csv-json': {
    toolId: 'csv_json', pageType: 'HUB',
    h1: 'CSV ↔ JSON Converter — Free Online',
    metaTitle: 'CSV to JSON Converter | Free',
    metaDesc: 'Free CSV to JSON and JSON to CSV converter. Bidirectional conversion with proper escaping.',
    faqJson: [{ q: 'Is it free?', a: 'Yes, 100% free.' }],
    defaultConfig: {}, locale: 'en', canonicalSlug: 'tools/csv-json',
  },
  'de:werkzeuge/csv-json': {
    toolId: 'csv_json', pageType: 'HUB',
    h1: 'CSV ↔ JSON Konverter — Kostenlos Online',
    metaTitle: 'CSV zu JSON Konverter | Kostenlos',
    metaDesc: 'Kostenloser CSV-zu-JSON und JSON-zu-CSV Konverter. Bidirektionale Konvertierung mit korrektem Escaping.',
    faqJson: [{ q: 'Ist es kostenlos?', a: 'Ja, 100% kostenlos.' }],
    defaultConfig: {}, locale: 'de', canonicalSlug: 'tools/csv-json',
  },
  'en:tools/csv-to-json': {
    toolId: 'csv_json', pageType: 'SPOKE',
    h1: 'CSV to JSON — Convert CSV Files to JSON',
    metaTitle: 'CSV to JSON | Free',
    metaDesc: 'Convert CSV data to JSON format instantly. Handles headers, quotes, and special characters correctly. Free online converter.',
    introText: 'Paste CSV data or upload a .csv file and get properly formatted JSON output instantly. Headers become object keys, and the converter handles quoted fields, commas in values, and special characters correctly.',
    faqJson: [
      { q: 'How are CSV headers handled?', a: 'The first row is treated as column headers. Each subsequent row becomes a JSON object with header names as keys.' },
    ],
    defaultConfig: {}, locale: 'en', canonicalSlug: 'tools/csv-to-json',
  },
  'en:tools/json-to-csv': {
    toolId: 'csv_json', pageType: 'SPOKE',
    h1: 'JSON to CSV — Convert JSON to Spreadsheet Format',
    metaTitle: 'JSON to CSV Converter | Free',
    metaDesc: 'Convert JSON arrays to CSV format for Excel, Google Sheets, and databases. Handles nested data and special characters. Free and instant.',
    introText: 'Convert JSON arrays into CSV format ready for import into Excel, Google Sheets, or any database. Object keys become column headers, and nested values are flattened automatically. Download the result as a .csv file.',
    faqJson: [
      { q: 'Can it handle nested JSON?', a: 'Nested objects are flattened using dot notation (e.g., address.city becomes a column). Arrays within objects are serialized.' },
    ],
    defaultConfig: {}, locale: 'en', canonicalSlug: 'tools/json-to-csv',
  },

  // ─── Markdown HTML: HUB ───
  'en:tools/markdown-html': {
    toolId: 'markdown_html', pageType: 'HUB',
    h1: 'Markdown ↔ HTML Converter — Free Online',
    metaTitle: 'Markdown to HTML Converter | Free',
    metaDesc: 'Free Markdown to HTML and HTML to Markdown converter. Bidirectional, no dependencies.',
    faqJson: [{ q: 'Is it free?', a: 'Yes, 100% free.' }],
    defaultConfig: {}, locale: 'en', canonicalSlug: 'tools/markdown-html',
  },
  'de:werkzeuge/markdown-html': {
    toolId: 'markdown_html', pageType: 'HUB',
    h1: 'Markdown ↔ HTML Konverter — Kostenlos',
    metaTitle: 'Markdown zu HTML Konverter | Kostenlos',
    metaDesc: 'Kostenloser Markdown-zu-HTML und HTML-zu-Markdown Konverter. Bidirektional, ohne Abhängigkeiten.',
    faqJson: [{ q: 'Ist es kostenlos?', a: 'Ja, 100% kostenlos.' }],
    defaultConfig: {}, locale: 'de', canonicalSlug: 'tools/markdown-html',
  },
  'en:tools/markdown-to-html': {
    toolId: 'markdown_html', pageType: 'SPOKE',
    h1: 'Markdown to HTML — Convert MD to HTML',
    metaTitle: 'Markdown to HTML | Free',
    metaDesc: 'Convert Markdown text to HTML code instantly. Free online tool.',
    faqJson: [], defaultConfig: {}, locale: 'en', canonicalSlug: 'tools/markdown-to-html',
  },
};

/**
 * Resolve a localized slug to page data.
 * Tries DB first if configured, falls back to JSON map.
 */
export async function resolvePageAsync(locale: Locale, slug: string): Promise<PageData | null> {
  const db = getDb();
  if (db) {
    try {
      const rows = await db`
        SELECT tool_id, page_type, h1, meta_title, meta_desc, faq_json, default_config, locale, canonical_slug
        FROM pseo_pages
        WHERE locale = ${locale} AND slug = ${slug}
        LIMIT 1
      `;
      if (rows.length > 0) return dbRowToPageData(rows[0]);
    } catch {
      // DB error — fall through to JSON
    }
  }
  // JSON fallback
  const key = `${locale}:${slug}`;
  return pages[key] || null;
}

/**
 * Synchronous fallback — used by existing code that can't await.
 * Only queries JSON map (no DB). Keep for backward compatibility.
 */
export function resolvePage(locale: Locale, slug: string): PageData | null {
  const key = `${locale}:${slug}`;
  return pages[key] || null;
}

/**
 * Get all sibling pages for hreflang generation.
 */
export async function getSiblingPagesAsync(canonicalSlug: string): Promise<Array<{ locale: Locale; slug: string }>> {
  const db = getDb();
  if (db) {
    try {
      const rows = await db`
        SELECT locale, slug FROM pseo_pages WHERE canonical_slug = ${canonicalSlug}
      `;
      if (rows.length > 0) {
        return rows.map(r => ({ locale: r.locale as Locale, slug: r.slug as string }));
      }
    } catch {
      // fall through
    }
  }
  // JSON fallback
  return getSiblingPages(canonicalSlug);
}

export function getSiblingPages(canonicalSlug: string): Array<{ locale: Locale; slug: string }> {
  const siblings: Array<{ locale: Locale; slug: string }> = [];
  for (const [key, page] of Object.entries(pages)) {
    if (page.canonicalSlug === canonicalSlug) {
      const colonIdx = key.indexOf(':');
      siblings.push({
        locale: page.locale,
        slug: key.slice(colonIdx + 1),
      });
    }
  }
  return siblings;
}

/**
 * Given a pathname (e.g. "/pdf/merge" or "/de/pdf/zusammenfuehren"),
 * find the equivalent full path in the target locale.
 * Returns null if no equivalent page exists.
 */
export function getLocalizedPath(pathname: string, targetLocale: Locale): string | null {
  // Determine current locale and slug from pathname
  let currentLocale: Locale = 'en';
  let slug = pathname.replace(/^\//, ''); // strip leading /

  // Check if path starts with a non-EN locale prefix
  const localeMatch = slug.match(/^(de|fr|es|it|nl|pt|pl|sv|ja)\//);
  if (localeMatch) {
    currentLocale = localeMatch[1] as Locale;
    slug = slug.slice(localeMatch[1].length + 1); // strip "de/"
  }

  // Look up current page
  const currentPage = pages[`${currentLocale}:${slug}`];
  if (!currentPage) return null;

  // If switching to same locale, return current path
  if (targetLocale === currentLocale) return pathname;

  // Find sibling in target locale via canonicalSlug
  const siblings = getSiblingPages(currentPage.canonicalSlug);
  const targetSibling = siblings.find(s => s.locale === targetLocale);
  if (!targetSibling) return null;

  // Build the full path
  if (targetLocale === 'en') {
    return `/${targetSibling.slug}`;
  }
  return `/${targetLocale}/${targetSibling.slug}`;
}

/**
 * Get all pages for sitemap generation.
 */
export async function getAllPagesAsync(): Promise<Array<PageData & { slug: string }>> {
  const db = getDb();
  if (db) {
    try {
      const rows = await db`
        SELECT tool_id, page_type, h1, meta_title, meta_desc, faq_json, default_config, locale, canonical_slug, slug
        FROM pseo_pages
        ORDER BY locale, slug
      `;
      if (rows.length > 0) {
        return rows.map(r => ({ ...dbRowToPageData(r), slug: r.slug as string }));
      }
    } catch {
      // fall through
    }
  }
  return getAllPages();
}

export function getAllPages(): Array<PageData & { slug: string }> {
  return Object.entries(pages).map(([key, page]) => {
    const colonIdx = key.indexOf(':');
    return { ...page, slug: key.slice(colonIdx + 1) };
  });
}

/**
 * Get related pages for a given tool in a given locale.
 * Returns spoke and alternative pages for cross-linking.
 */
export function getRelatedPages(toolId: string, locale: Locale): Array<PageData & { slug: string }> {
  return Object.entries(pages)
    .filter(([, page]) => page.toolId === toolId && page.locale === locale && page.pageType !== 'HUB')
    .map(([key, page]) => {
      const colonIdx = key.indexOf(':');
      return { ...page, slug: key.slice(colonIdx + 1) };
    })
    .slice(0, 12); // Limit to 12 cross-links
}

/**
 * Resolve an incoming URL path to page data.
 */
export async function resolveFromPathAsync(locale: Locale, slugSegments: string[]): Promise<PageData | null> {
  const fullSlug = slugSegments.join('/');
  return resolvePageAsync(locale, fullSlug);
}

export function resolveFromPath(locale: Locale, slugSegments: string[]): PageData | null {
  const fullSlug = slugSegments.join('/');
  return resolvePage(locale, fullSlug);
}

/**
 * Map a DB row to PageData.
 */
function dbRowToPageData(row: Record<string, unknown>): PageData {
  return {
    toolId: row.tool_id as string,
    pageType: row.page_type as PageData['pageType'],
    h1: row.h1 as string,
    metaTitle: row.meta_title as string,
    metaDesc: row.meta_desc as string,
    faqJson: (row.faq_json || []) as Array<{ q: string; a: string }>,
    defaultConfig: (row.default_config || {}) as Record<string, unknown>,
    locale: row.locale as Locale,
    canonicalSlug: row.canonical_slug as string,
  };
}

// ─── AUTO-GENERATED LOCALE HUB PAGES ───
// Generates HUB pages for non-EN/DE locales from localeData.ts translations.
// Adding a new locale only requires adding entries to localeData.ts.

import { categorySlugs, toolSlugs } from './i18n';
import { hubTranslations } from './localeData';

/** Map toolId → { category, hubSlug, canonicalSlug } for HUB generation */
const toolHubMeta: Record<string, { category: string; hubSlug: string }> = {
  svg_vectorizer:   { category: 'image', hubSlug: 'png-to-svg' },
  remove_bg:        { category: 'image', hubSlug: 'remove-background' },
  pdf_merge:        { category: 'pdf',   hubSlug: 'merge-pdf' },
  pdf_split:        { category: 'pdf',   hubSlug: 'split-pdf' },
  image_compressor: { category: 'image', hubSlug: 'compress-image' },
  coloring_page:    { category: 'image', hubSlug: 'photo-to-coloring-page' },
  audio_converter:  { category: 'audio', hubSlug: 'convert-audio' },
  speech_to_text:   { category: 'audio', hubSlug: 'speech-to-text' },
  image_converter:  { category: 'image', hubSlug: 'format-converter' },
  pdf_password:     { category: 'pdf',   hubSlug: 'password-protect' },
};

// Generate and inject locale pages at module load
for (const [toolId, translations] of Object.entries(hubTranslations)) {
  const meta = toolHubMeta[toolId];
  if (!meta) continue;

  const canonicalSlug = `${meta.category}/${meta.hubSlug}`;

  for (const [locale, t] of Object.entries(translations)) {
    if (locale === 'en' || locale === 'de') continue; // Already have manual EN/DE pages
    if (!t) continue;

    const localeCat = categorySlugs[meta.category]?.[locale as Locale] || meta.category;
    const localeSlug = toolSlugs[meta.hubSlug]?.[locale as Locale] || meta.hubSlug;
    const fullSlug = `${localeCat}/${localeSlug}`;
    const key = `${locale}:${fullSlug}`;

    pages[key] = {
      toolId,
      pageType: 'HUB',
      h1: t.h1,
      metaTitle: t.metaTitle,
      metaDesc: t.metaDesc,
      faqJson: [],
      defaultConfig: {},
      locale: locale as Locale,
      canonicalSlug,
    };
  }
}
