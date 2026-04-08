/**
 * Export all translations to a structured JSON file for audit and 3rd-party tool consumption.
 * 
 * Usage: npx tsx scripts/export-translations.ts
 * 
 * Output: locales/translations.json
 */

import * as fs from 'fs';
import * as path from 'path';

// Import the source dictionaries
const enModule = require('../src/lib/i18n/translations/en');
const deModule = require('../src/lib/i18n/translations/de');
const en: Record<string, string> = enModule.en;
const de: Record<string, string> = deModule.de;

// Import tool content
const toolContentModule = require('../src/lib/tools/toolContent');
const toolContentDeModule = require('../src/lib/tools/toolContent.de');

// toolContent is not directly exported — use getToolContent for EN
// But we need the raw dict. Let's read the file and extract tool IDs instead.
const toolContentDe: Record<string, { howItWorks: string[]; features: string[]; faqs: { q: string; a: string }[] }> = toolContentDeModule.toolContentDe || {};

// ─── Section Definitions ───
const SECTIONS: [string, string][] = [
  ['nav.', 'Navigation'],
  ['toolPage.', 'Tool Page Chrome'],
  ['home.', 'Homepage'],
  ['footer.', 'Footer'],
  ['pricing.', 'Pricing Page'],
  ['privacy.', 'Privacy Page'],
  ['category.', 'Category Labels'],
  ['tool.', 'Shared Tool UI'],
  ['pdfMerge.', 'PDF Merge Tool'],
  ['pdfSplit.', 'PDF Split Tool'],
  ['pdfPassword.', 'PDF Password Tool'],
  ['pdfWatermark.', 'PDF Watermark Tool'],
  ['pdfPageNumbers.', 'PDF Page Numbers Tool'],
  ['pdfRotate.', 'PDF Rotate Tool'],
  ['pdfFormFiller.', 'PDF Form Filler Tool'],
  ['pdfToImages.', 'PDF to Images Tool'],
  ['signPdf.', 'Sign PDF Tool'],
  ['imagesToPdf.', 'Images to PDF Tool'],
  ['imageCompressor.', 'Image Compressor Tool'],
  ['imageResize.', 'Image Resize Tool'],
  ['imageConverter.', 'Image Converter Tool'],
  ['imageBase64.', 'Image Base64 Tool'],
  ['vectorizer.', 'SVG Vectorizer Tool'],
  ['bgRemover.', 'Background Remover Tool'],
  ['coloringPage.', 'Coloring Page Tool'],
  ['audioConverter.', 'Audio Converter Tool'],
  ['speechToText.', 'Speech to Text Tool'],
  ['videoToGif.', 'Video to GIF Tool'],
  ['qrCode.', 'QR Code Tool'],
  ['ocr.', 'OCR Tool'],
  ['wordCounter.', 'Word Counter Tool'],
  ['caseConverter.', 'Case Converter Tool'],
  ['loremIpsum.', 'Lorem Ipsum Tool'],
  ['textToPdf.', 'Text to PDF Tool'],
  ['jsonFormatter.', 'JSON Formatter Tool'],
  ['colorPicker.', 'Color Picker Tool'],
  ['urlEncoder.', 'URL Encoder Tool'],
  ['base64Text.', 'Base64 Text Tool'],
  ['passwordGen.', 'Password Generator Tool'],
  ['diffChecker.', 'Diff Checker Tool'],
  ['hashGenerator.', 'Hash Generator Tool'],
  ['regexTester.', 'Regex Tester Tool'],
  ['csvJson.', 'CSV/JSON Converter Tool'],
  ['markdownHtml.', 'Markdown/HTML Tool'],
  ['registry.', 'Tool Registry (Names & Taglines)'],
];

interface TranslationEntry {
  key: string;
  en: string;
  de: string;
  missing_de: boolean;
}

interface Section {
  section: string;
  key_count: number;
  missing_de_count: number;
  entries: TranslationEntry[];
}

// ─── Build Sections ───
const allKeys = Object.keys(en);
const usedKeys = new Set<string>();

const sections: Section[] = [];

for (const [prefix, sectionName] of SECTIONS) {
  const sectionKeys = allKeys.filter(k => k.startsWith(prefix));
  sectionKeys.forEach(k => usedKeys.add(k));

  const entries: TranslationEntry[] = sectionKeys.map(key => ({
    key,
    en: en[key],
    de: de[key] || '',
    missing_de: !de[key],
  }));

  if (entries.length > 0) {
    sections.push({
      section: sectionName,
      key_count: entries.length,
      missing_de_count: entries.filter(e => e.missing_de).length,
      entries,
    });
  }
}

// Catch any uncategorized keys
const uncategorized = allKeys.filter(k => !usedKeys.has(k));
if (uncategorized.length > 0) {
  const entries: TranslationEntry[] = uncategorized.map(key => ({
    key,
    en: en[key],
    de: de[key] || '',
    missing_de: !de[key],
  }));
  sections.push({
    section: 'Uncategorized',
    key_count: entries.length,
    missing_de_count: entries.filter(e => e.missing_de).length,
    entries,
  });
}

// ─── Build Tool Content ───
// Get EN tool IDs from the getToolContent function
const toolIds = Object.keys(toolContentDe); // DE has all 36 tools
const toolContentSections: Record<string, unknown>[] = [];

for (const toolId of toolIds) {
  const enContent = toolContentModule.getToolContent(toolId, 'en');
  const deContent = toolContentDe[toolId] || { howItWorks: [], features: [], faqs: [] };
  
  if (enContent) {
    toolContentSections.push({
      tool_id: toolId,
      howItWorks: { en: enContent.howItWorks, de: deContent.howItWorks },
      features: { en: enContent.features, de: deContent.features },
      faqs: { en: enContent.faqs, de: deContent.faqs },
    });
  }
}

// ─── Summary ───
const totalKeys = allKeys.length;
const totalDeKeys = allKeys.filter(k => de[k]).length;
const totalMissing = totalKeys - totalDeKeys;

const output = {
  _meta: {
    generated_at: new Date().toISOString(),
    format_version: '1.0',
    description: 'BestOnline.Tools translation export — EN/DE side-by-side for audit',
    source_files: [
      'src/lib/i18n/translations/en.ts',
      'src/lib/i18n/translations/de.ts',
      'src/lib/tools/toolContent.ts',
      'src/lib/tools/toolContent.de.ts',
    ],
    compatible_with: ['Crowdin', 'Lokalise', 'Phrase', 'POEditor', 'Weblate', 'i18next'],
  },
  summary: {
    total_ui_keys: totalKeys,
    translated_de: totalDeKeys,
    missing_de: totalMissing,
    coverage_percent: Math.round((totalDeKeys / totalKeys) * 1000) / 10,
    tool_content_tools: toolContentSections.length,
    sections: sections.map(s => ({
      name: s.section,
      keys: s.key_count,
      missing: s.missing_de_count,
    })),
  },
  ui_translations: sections,
  tool_content: toolContentSections,
};

// ─── Write Output ───
const outDir = path.resolve(__dirname, '..', 'locales');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const outPath = path.join(outDir, 'translations.json');
fs.writeFileSync(outPath, JSON.stringify(output, null, 2), 'utf-8');

console.log(`\n✅ Translations exported to: ${outPath}`);
console.log(`\n📊 Summary:`);
console.log(`   UI Keys:       ${totalKeys} total, ${totalDeKeys} translated (${output.summary.coverage_percent}%)`);
console.log(`   Missing DE:    ${totalMissing}`);
console.log(`   Tool Content:  ${toolContentSections.length} tools`);
console.log(`   Sections:      ${sections.length}`);
console.log(`\n📁 Format: Structured JSON — compatible with Crowdin, Lokalise, Phrase, etc.`);
