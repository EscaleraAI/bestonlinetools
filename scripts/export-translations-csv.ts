/**
 * Export ALL translatable content to a single flat CSV for wording audit.
 * 
 * Covers three content sources:
 *   1. UI translations (en.ts / de.ts) — buttons, labels, headings, page copy
 *   2. Tool content (toolContent.ts / toolContent.de.ts) — howItWorks, features, FAQs
 *   3. Page SEO (pageResolver.ts) — h1, metaTitle, metaDesc for every route
 * 
 * Usage: npx tsx scripts/export-translations-csv.ts
 * Output: locales/translations-audit.csv
 */

import * as fs from 'fs';
import * as path from 'path';

const enModule = require('../src/lib/i18n/translations/en');
const deModule = require('../src/lib/i18n/translations/de');
const en: Record<string, string> = enModule.en;
const de: Record<string, string> = deModule.de;

const toolContentModule = require('../src/lib/tools/toolContent');
const toolContentDeModule = require('../src/lib/tools/toolContent.de');
const toolContentDe = toolContentDeModule.toolContentDe || {};

// pageResolver exposes the `pages` object indirectly — we need to import it
// and filter for EN vs DE entries
const pageResolverModule = require('../src/lib/pageResolver');

// ─── Section mapping for UI keys ───
const SECTIONS: [string, string][] = [
  ['nav.', 'Navigation'],
  ['toolPage.', 'Tool Page Chrome'],
  ['home.', 'Homepage'],
  ['footer.', 'Footer'],
  ['pricing.', 'Pricing Page'],
  ['privacy.', 'Privacy Page'],
  ['category.', 'Category Labels'],
  ['tool.', 'Shared Tool UI'],
  ['pdfMerge.', 'PDF Merge'],
  ['pdfSplit.', 'PDF Split'],
  ['pdfPassword.', 'PDF Password'],
  ['pdfWatermark.', 'PDF Watermark'],
  ['pdfPageNumbers.', 'PDF Page Numbers'],
  ['pdfRotate.', 'PDF Rotate'],
  ['pdfFormFiller.', 'PDF Form Filler'],
  ['pdfToImages.', 'PDF to Images'],
  ['signPdf.', 'Sign PDF'],
  ['imagesToPdf.', 'Images to PDF'],
  ['imageCompressor.', 'Image Compressor'],
  ['imageResize.', 'Image Resize'],
  ['imageConverter.', 'Image Converter'],
  ['imageBase64.', 'Image Base64'],
  ['vectorizer.', 'SVG Vectorizer'],
  ['bgRemover.', 'Background Remover'],
  ['coloringPage.', 'Coloring Page'],
  ['audioConverter.', 'Audio Converter'],
  ['speechToText.', 'Speech to Text'],
  ['videoToGif.', 'Video to GIF'],
  ['qrCode.', 'QR Code'],
  ['ocr.', 'OCR'],
  ['wordCounter.', 'Word Counter'],
  ['caseConverter.', 'Case Converter'],
  ['loremIpsum.', 'Lorem Ipsum'],
  ['textToPdf.', 'Text to PDF'],
  ['jsonFormatter.', 'JSON Formatter'],
  ['colorPicker.', 'Color Picker'],
  ['urlEncoder.', 'URL Encoder'],
  ['base64Text.', 'Base64 Text'],
  ['passwordGen.', 'Password Generator'],
  ['diffChecker.', 'Diff Checker'],
  ['hashGenerator.', 'Hash Generator'],
  ['regexTester.', 'Regex Tester'],
  ['csvJson.', 'CSV/JSON Converter'],
  ['markdownHtml.', 'Markdown/HTML'],
  ['registry.', 'Tool Registry'],
];

function getSection(key: string): string {
  for (const [prefix, name] of SECTIONS) {
    if (key.startsWith(prefix)) return name;
  }
  return 'Other';
}

function csvEscape(val: string): string {
  if (!val) return '';
  const escaped = val.replace(/"/g, '""');
  if (escaped.includes(',') || escaped.includes('\n') || escaped.includes('"') || escaped.includes(';')) {
    return `"${escaped}"`;
  }
  return escaped;
}

const rows: string[] = [];
rows.push('Section,Type,Key,English,German');

// ═══════════════════════════════════════════════
// PART 1: UI Translations (en.ts / de.ts)
// ═══════════════════════════════════════════════
const allKeys = Object.keys(en);
for (const key of allKeys) {
  const section = getSection(key);
  rows.push([
    csvEscape(section),
    'UI String',
    csvEscape(key),
    csvEscape(en[key]),
    csvEscape(de[key] || '⚠ MISSING'),
  ].join(','));
}

// ═══════════════════════════════════════════════
// PART 2: Tool Content (howItWorks, features, FAQs)
// ═══════════════════════════════════════════════
const toolIds = Object.keys(toolContentDe);
for (const toolId of toolIds) {
  const enContent = toolContentModule.getToolContent(toolId, 'en');
  const deContent = toolContentDe[toolId];
  if (!enContent || !deContent) continue;

  const section = `Tool Content: ${toolId}`;

  for (let i = 0; i < Math.max(enContent.howItWorks.length, deContent.howItWorks.length); i++) {
    rows.push([
      csvEscape(section),
      'How It Works',
      csvEscape(`${toolId}.howItWorks[${i}]`),
      csvEscape(enContent.howItWorks[i] || ''),
      csvEscape(deContent.howItWorks[i] || '⚠ MISSING'),
    ].join(','));
  }

  for (let i = 0; i < Math.max(enContent.features.length, deContent.features.length); i++) {
    rows.push([
      csvEscape(section),
      'Feature',
      csvEscape(`${toolId}.features[${i}]`),
      csvEscape(enContent.features[i] || ''),
      csvEscape(deContent.features[i] || '⚠ MISSING'),
    ].join(','));
  }

  for (let i = 0; i < Math.max(enContent.faqs.length, deContent.faqs.length); i++) {
    const enFaq = enContent.faqs[i] || { q: '', a: '' };
    const deFaq = deContent.faqs[i] || { q: '⚠ MISSING', a: '⚠ MISSING' };
    rows.push([
      csvEscape(section),
      'FAQ Question',
      csvEscape(`${toolId}.faqs[${i}].q`),
      csvEscape(enFaq.q),
      csvEscape(deFaq.q),
    ].join(','));
    rows.push([
      csvEscape(section),
      'FAQ Answer',
      csvEscape(`${toolId}.faqs[${i}].a`),
      csvEscape(enFaq.a),
      csvEscape(deFaq.a),
    ].join(','));
  }
}

// ═══════════════════════════════════════════════
// PART 3: Page SEO Content (pageResolver.ts)
// ═══════════════════════════════════════════════
// Build a map: canonicalSlug → { en: PageData, de: PageData }
interface PageSEO { h1: string; metaTitle: string; metaDesc: string; locale: string; introText?: string }

// We can't import pages directly, but we can use resolveFromPath.
// Instead, let's read the source file and extract page data.
const pageResolverSource = fs.readFileSync(
  path.resolve(__dirname, '..', 'src', 'lib', 'pageResolver.ts'), 'utf-8'
);

// Parse all page entries from the source
const pageEntries: { key: string; locale: string; h1: string; metaTitle: string; metaDesc: string; introText: string }[] = [];

// Match each page entry block
const pageBlockRegex = /'([^']+)':\s*\{[^}]*toolId:\s*'([^']+)'[^}]*pageType:\s*'([^']+)'[^}]*h1:\s*'([^']*)'[^}]*metaTitle:\s*'([^']*)'[^}]*metaDesc:\s*'([^']*)'[^}]*(?:introText:\s*'([^']*)')?\s*[^}]*\}/g;

let match;
while ((match = pageBlockRegex.exec(pageResolverSource)) !== null) {
  const [, routeKey, , , h1, metaTitle, metaDesc, introText] = match;
  const locale = routeKey.startsWith('de:') ? 'de' : 'en';
  pageEntries.push({ key: routeKey, locale, h1, metaTitle, metaDesc, introText: introText || '' });
}

// Group by canonical slug (EN key)
const enPages = pageEntries.filter(p => p.locale === 'en');
const dePages = pageEntries.filter(p => p.locale === 'de');

// Create a lookup for DE pages by toolId-like key
const dePageMap = new Map<string, typeof dePages[0]>();
for (const dp of dePages) {
  // Strip "de:" prefix to get the slug
  const slug = dp.key.replace('de:', '');
  dePageMap.set(slug, dp);
}

// For each EN page, try to find the matching DE page
for (const enPage of enPages) {
  const enSlug = enPage.key.replace('en:', '');
  
  // Find DE equivalent — try exact slug match or by looking at the DE pages
  // with the same route position
  let dePage: typeof dePages[0] | undefined;
  
  // Search DE pages that share the same toolId's canonical slug
  // The EN key like "en:image/png-to-svg" maps to "de:bild/png-zu-svg" etc.
  // Best approach: find DE page with same h1 prefix or toolId
  for (const dp of dePages) {
    // Simple heuristic: same position in ordered list
    if (dp.key.replace('de:', '').split('/')[1] && enSlug.split('/')[1]) {
      // Category/tool structure
    }
  }
  
  // Actually simpler: just output EN pages and DE pages separately, 
  // since their slugs differ by design
  rows.push([
    csvEscape('Page SEO'),
    'H1',
    csvEscape(`page:${enPage.key}:h1`),
    csvEscape(enPage.h1),
    '',  // DE will be in its own row
  ].join(','));
  
  rows.push([
    csvEscape('Page SEO'),
    'Meta Title',
    csvEscape(`page:${enPage.key}:metaTitle`),
    csvEscape(enPage.metaTitle),
    '',
  ].join(','));

  rows.push([
    csvEscape('Page SEO'),
    'Meta Description',
    csvEscape(`page:${enPage.key}:metaDesc`),
    csvEscape(enPage.metaDesc),
    '',
  ].join(','));

  if (enPage.introText) {
    rows.push([
      csvEscape('Page SEO'),
      'Intro Text',
      csvEscape(`page:${enPage.key}:introText`),
      csvEscape(enPage.introText),
      '',
    ].join(','));
  }
}

// DE pages
for (const dePage of dePages) {
  rows.push([
    csvEscape('Page SEO (DE)'),
    'H1',
    csvEscape(`page:${dePage.key}:h1`),
    '',
    csvEscape(dePage.h1),
  ].join(','));
  
  rows.push([
    csvEscape('Page SEO (DE)'),
    'Meta Title',
    csvEscape(`page:${dePage.key}:metaTitle`),
    '',
    csvEscape(dePage.metaTitle),
  ].join(','));

  rows.push([
    csvEscape('Page SEO (DE)'),
    'Meta Description',
    csvEscape(`page:${dePage.key}:metaDesc`),
    '',
    csvEscape(dePage.metaDesc),
  ].join(','));

  if (dePage.introText) {
    rows.push([
      csvEscape('Page SEO (DE)'),
      'Intro Text',
      csvEscape(`page:${dePage.key}:introText`),
      '',
      csvEscape(dePage.introText),
    ].join(','));
  }
}

// ─── Write Output ───
const outDir = path.resolve(__dirname, '..', 'locales');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const outPath = path.join(outDir, 'translations-audit.csv');
const BOM = '\uFEFF';
fs.writeFileSync(outPath, BOM + rows.join('\n'), 'utf-8');

const uiCount = allKeys.length;
const toolContentCount = rows.filter(r => r.startsWith('Tool Content') || r.startsWith('"Tool Content')).length;
const pageSeoCount = rows.filter(r => r.startsWith('Page SEO') || r.startsWith('"Page SEO')).length;

console.log(`\n✅ CSV exported to: ${outPath}`);
console.log(`   ${rows.length - 1} total rows:`);
console.log(`     • ${uiCount} UI translation strings`);
console.log(`     • ${toolContentCount} tool content entries (howItWorks, features, FAQs)`);
console.log(`     • ${pageSeoCount} page SEO entries (h1, metaTitle, metaDesc)`);
console.log(`\n   Open in Excel / Google Sheets → filter by Section column for review`);
