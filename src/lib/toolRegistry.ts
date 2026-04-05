/**
 * Tool Registry: maps tool IDs to their dynamic imports.
 * This is the bridge between the pSEO database and actual React components.
 */

import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';

export interface ToolRegistryEntry {
  component: ComponentType;
  category: string;
}

const registry: Record<string, ToolRegistryEntry> = {
  svg_vectorizer: {
    component: dynamic(() => import('@/tools/vectorizer/VectorizerTool')),
    category: 'image',
  },
  remove_bg: {
    component: dynamic(() => import('@/tools/bgremover/BackgroundRemoverTool')),
    category: 'image',
  },
  pdf_merge: {
    component: dynamic(() => import('@/tools/pdfmerge/PdfMergeTool')),
    category: 'pdf',
  },
  pdf_split: {
    component: dynamic(() => import('@/tools/pdfsplit/PdfSplitTool')),
    category: 'pdf',
  },
  image_compressor: {
    component: dynamic(() => import('@/tools/compressor/ImageCompressorTool')),
    category: 'image',
  },
  coloring_page: {
    component: dynamic(() => import('@/tools/coloringpage/ColoringPageTool')),
    category: 'image',
  },
  audio_converter: {
    component: dynamic(() => import('@/tools/audioconverter/AudioConverterTool')),
    category: 'audio',
  },
  speech_to_text: {
    component: dynamic(() => import('@/tools/speechtotext/SpeechToTextTool')),
    category: 'audio',
  },
  image_converter: {
    component: dynamic(() => import('@/tools/imageconverter/ImageConverterTool')),
    category: 'image',
  },
  pdf_password: {
    component: dynamic(() => import('@/tools/pdfpassword/PdfPasswordTool')),
    category: 'pdf',
  },
  images_to_pdf: {
    component: dynamic(() => import('@/tools/imagestopdf/ImagesToPdfTool')),
    category: 'pdf',
  },
  pdf_watermark: {
    component: dynamic(() => import('@/tools/pdfwatermark/PdfWatermarkTool')),
    category: 'pdf',
  },
  pdf_page_numbers: {
    component: dynamic(() => import('@/tools/pdfpagenumbers/PdfPageNumbersTool')),
    category: 'pdf',
  },
  image_resize: {
    component: dynamic(() => import('@/tools/imageresize/ImageResizeTool')),
    category: 'image',
  },
  image_base64: {
    component: dynamic(() => import('@/tools/imagebase64/ImageBase64Tool')),
    category: 'image',
  },
  video_to_gif: {
    component: dynamic(() => import('@/tools/videotogif/VideoToGifTool')),
    category: 'image',
  },
  qr_code: {
    component: dynamic(() => import('@/tools/qrcode/QrCodeTool')),
    category: 'image',
  },
  sign_pdf: {
    component: dynamic(() => import('@/tools/signpdf/SignPdfTool')),
    category: 'pdf',
  },
  pdf_form_filler: {
    component: dynamic(() => import('@/tools/pdfformfiller/PdfFormFillerTool')),
    category: 'pdf',
  },
  pdf_to_images: {
    component: dynamic(() => import('@/tools/pdftoimages/PdfToImagesTool')),
    category: 'pdf',
  },
  ocr: {
    component: dynamic(() => import('@/tools/ocr/OcrTool')),
    category: 'image',
  },
  word_counter: {
    component: dynamic(() => import('@/tools/wordcounter/WordCounterTool')),
    category: 'data',
  },
  case_converter: {
    component: dynamic(() => import('@/tools/caseconverter/CaseConverterTool')),
    category: 'data',
  },
  lorem_ipsum: {
    component: dynamic(() => import('@/tools/loremipsum/LoremIpsumTool')),
    category: 'data',
  },
  text_to_pdf: {
    component: dynamic(() => import('@/tools/texttopdf/TextToPdfTool')),
    category: 'pdf',
  },
  json_formatter: {
    component: dynamic(() => import('@/tools/jsonformatter/JsonFormatterTool')),
    category: 'data',
  },
  color_picker: {
    component: dynamic(() => import('@/tools/colorpicker/ColorPickerTool')),
    category: 'data',
  },
  url_encoder: {
    component: dynamic(() => import('@/tools/urlencoder/UrlEncoderTool')),
    category: 'data',
  },
  base64_text: {
    component: dynamic(() => import('@/tools/base64text/Base64TextTool')),
    category: 'data',
  },
  password_generator: {
    component: dynamic(() => import('@/tools/passwordgen/PasswordGeneratorTool')),
    category: 'data',
  },
  pdf_rotate: {
    component: dynamic(() => import('@/tools/pdfrotate/PdfRotateTool')),
    category: 'pdf',
  },
  diff_checker: {
    component: dynamic(() => import('@/tools/diffchecker/DiffCheckerTool')),
    category: 'data',
  },
  hash_generator: {
    component: dynamic(() => import('@/tools/hashgenerator/HashGeneratorTool')),
    category: 'data',
  },
  regex_tester: {
    component: dynamic(() => import('@/tools/regextester/RegexTesterTool')),
    category: 'data',
  },
  csv_json: {
    component: dynamic(() => import('@/tools/csvjson/CsvJsonTool')),
    category: 'data',
  },
  markdown_html: {
    component: dynamic(() => import('@/tools/markdownhtml/MarkdownHtmlTool')),
    category: 'data',
  },
};

export function getToolComponent(toolId: string): ToolRegistryEntry | null {
  return registry[toolId] || null;
}

export function getAllToolIds(): string[] {
  return Object.keys(registry);
}
