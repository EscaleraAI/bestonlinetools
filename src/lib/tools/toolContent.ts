/**
 * Tool-specific SEO content for tool pages.
 * Each tool gets unique "How It Works" copy and feature bullet points
 * to avoid duplicate content across pages.
 */

export interface ToolContent {
  howItWorks: string[];    // Array of paragraphs
  features: string[];      // Feature bullet points
  faqs: Array<{ q: string; a: string }>;  // Expanded FAQ entries
}

import type { Locale } from '../i18n';

const toolContent: Record<string, ToolContent> = {
  svg_vectorizer: {
    howItWorks: [
      'Our vectorizer uses advanced edge-detection and path-tracing algorithms to convert raster images (PNG, JPG, WebP, BMP) into clean, scalable SVG vector files. The tool analyzes pixel boundaries, detects shapes and curves, and generates optimized SVG paths — all running locally via WebAssembly.',
      'Choose from built-in presets optimized for logos, icons, sketches, or photographs. Fine-tune parameters like speckle filtering, corner thresholds, and path precision to get exactly the output you need. The real-time preview lets you compare the original and vectorized versions side by side.',
    ],
    features: [
      'Multiple presets: Logo, Icon, Sketch, Photo — each fine-tuned for its use case',
      'Adjustable path simplification, corner detection, and speckle filtering',
      'Color and black & white vectorization modes',
      'Export as SVG, PDF, EPS, or DXF for any workflow',
      'Real-time comparison slider to preview results before downloading',
      'SVGO optimization automatically reduces SVG file size',
    ],
    faqs: [
      { q: 'What image formats can I convert to SVG?', a: 'You can convert PNG, JPG/JPEG, WebP, and BMP images. For best results with logos and icons, use a high-contrast PNG with a transparent or solid background.' },
      { q: 'How does the vectorization process work?', a: 'The tool traces pixel boundaries in your image, detects edges and curves, then generates smooth SVG paths using spline or polygon fitting. The result is a scalable vector file that stays sharp at any size.' },
      { q: 'Can I vectorize logos and icons?', a: 'Yes — use the built-in Logo or Icon preset for optimal results. These presets are tuned for clean edges, minimal noise, and high path accuracy on graphic elements.' },
      { q: 'What is the maximum file size or resolution?', a: 'There is no hard file size limit. We recommend images up to 4000×4000 pixels for the best balance of quality and processing speed.' },
      { q: 'Is the SVG output editable in design tools?', a: 'Yes. The generated SVG contains standard path elements that can be opened and edited in any SVG editor including Adobe Illustrator, Figma, Inkscape, and Affinity Designer.' },
      { q: 'What export formats are available?', a: 'You can download your vectorized result as SVG (default), PDF, EPS, or DXF — covering workflows from web design to laser cutting and CAD.' },
    ],
  },

  remove_bg: {
    howItWorks: [
      'This tool uses a state-of-the-art AI segmentation model that runs directly in your browser using WebGPU acceleration. The model identifies the foreground subject in your image and creates a precise alpha mask to remove the background — no cloud processing required.',
      'Simply drop your image and the AI handles the rest. The model loads once (~30MB) and stays cached in your browser for instant processing on subsequent uses. Results are typically ready in under 3 seconds.',
    ],
    features: [
      'AI-powered edge detection for precise cutouts around hair, fur, and complex edges',
      'WebGPU acceleration for near-instant processing on modern browsers',
      'One-click download as transparent PNG',
      'Handles portraits, product photos, logos, and complex scenes',
      'Model caches locally — loads once, processes instantly after',
      'No file size limits for most images — recommended up to 25MP',
    ],
    faqs: [
      { q: 'How accurate is the background removal?', a: 'The AI model handles complex edges including hair, fur, and semi-transparent objects with high precision. Results are comparable to professional editing tools like Adobe Photoshop.' },
      { q: 'Does it work with product photography?', a: 'Yes — the model is trained on diverse image types including product photos, portraits, animals, and objects. It excels at creating clean cutouts for e-commerce listings.' },
      { q: 'What format is the output?', a: 'The result is downloaded as a transparent PNG with the background fully removed. You can then place the subject on any new background.' },
      { q: 'Why does the AI model need to load first?', a: 'The segmentation model (~30MB) downloads once and is cached in your browser. After the first load, subsequent uses are near-instant as the model is served from local cache.' },
      { q: 'Does my image get uploaded to a server?', a: 'No. The AI model runs entirely in your browser using WebGPU. Your images are never sent to any server — complete privacy is guaranteed.' },
      { q: 'What image types work best?', a: 'Images with clear subjects against distinct backgrounds work best. The tool handles complex scenes too, but simple compositions yield the cleanest cutouts.' },
    ],
  },

  pdf_merge: {
    howItWorks: [
      'Drag and drop multiple PDF files, reorder them visually, and merge them into a single document — all processed locally in your browser using the pdf-lib library. Your PDFs never touch a server.',
      'The tool reads each PDF\'s internal structure, preserves all pages, bookmarks, and formatting, then combines them into one continuous document. You can rearrange the order by dragging files before merging.',
    ],
    features: [
      'Combine unlimited PDF files into one document',
      'Drag-and-drop reordering before merging',
      'Preserves original formatting, fonts, and embedded images',
      'No file size limits — handles large documents with ease',
      'Instant download of the merged PDF',
      'Works entirely offline after page load',
    ],
    faqs: [
      { q: 'How many PDFs can I merge at once?', a: 'There is no limit — you can combine as many PDF files as you need into a single document.' },
      { q: 'Will the merged PDF keep the original formatting?', a: 'Yes. The tool preserves all pages, fonts, images, annotations, and formatting from each source PDF exactly as they appear.' },
      { q: 'Can I reorder the PDFs before merging?', a: 'Yes — drag and drop the files in the list to arrange them in your desired order before clicking Merge.' },
      { q: 'Is there a file size limit?', a: 'There is no hard limit. The tool handles large documents (100MB+), though very large files may take a few extra seconds to process.' },
      { q: 'Do I need to create an account?', a: 'No. The tool works immediately with no signup, login, or registration required.' },
      { q: 'Are my PDFs uploaded to a server?', a: 'No. All merging happens locally in your browser using the pdf-lib library. Your files never leave your device.' },
    ],
  },

  pdf_split: {
    howItWorks: [
      'Upload any PDF and choose how to split it: extract specific pages, split every N pages, or divide into equal parts. The tool parses your PDF locally using pdf-lib and creates separate output files without any server upload.',
      'Use page range syntax (e.g., "1, 3-5, 8") for precise page extraction, or let the tool automatically divide your document into chunks. Each output file is a valid, standalone PDF.',
    ],
    features: [
      'Three split modes: Extract Pages, Every N Pages, Equal Parts',
      'Page range syntax for precise control (e.g., "1, 3-5, 8-12")',
      'Download individual files or all at once',
      'Preserves page formatting and embedded content',
      'Handles encrypted PDFs (read-only protection)',
      'Instant processing — no waiting for server uploads',
    ],
    faqs: [
      { q: 'What split modes are available?', a: 'Three modes: Extract specific pages (e.g., pages 1, 3-5), split every N pages (e.g., every 2 pages), or divide into equal parts (e.g., 3 equal sections).' },
      { q: 'Can I extract specific pages from a PDF?', a: 'Yes — use page range syntax like "1, 3-5, 8" to extract exactly the pages you need into a new PDF.' },
      { q: 'Does splitting preserve the original PDF quality?', a: 'Yes. Each output file maintains the exact formatting, fonts, images, and layout of the original pages.' },
      { q: 'Can I split password-protected PDFs?', a: 'Yes, the tool can handle PDFs with read-only restrictions. However, PDFs locked with an open password must be unlocked first.' },
      { q: 'How do I download the split files?', a: 'You can download each part individually or use the "Download All" button to get all split files at once.' },
      { q: 'Is there a page limit?', a: 'No — you can split PDFs of any length. The tool processes them entirely in your browser.' },
    ],
  },

  image_compressor: {
    howItWorks: [
      'This compressor uses your browser\'s native Canvas API and intelligent quality reduction algorithms to minimize image file size while preserving visual quality. Drop your images, adjust the quality slider, and see the compressed result with a side-by-side comparison.',
      'The tool re-encodes images at your chosen quality level, stripping unnecessary metadata (EXIF, ICC profiles) and optimizing the encoding. You see the exact file size savings and visual difference before downloading.',
    ],
    features: [
      'Adjustable quality slider with real-time size preview',
      'Side-by-side comparison: original vs. compressed',
      'Batch processing — compress multiple images at once',
      'Supports PNG, JPG, WebP input formats',
      'Shows exact file size reduction percentage',
      'Preserves image dimensions and aspect ratio',
    ],
    faqs: [
      { q: 'How much can I reduce my image file size?', a: 'Typical reductions are 50-80% depending on the image and quality setting. The tool shows you the exact savings before you download.' },
      { q: 'Will compression reduce image quality?', a: 'The quality slider lets you balance file size and visual quality. At moderate settings (70-80%), the difference is imperceptible to the human eye.' },
      { q: 'Can I compress multiple images at once?', a: 'Yes — drop multiple images and they will all be compressed with your chosen settings. Download them individually or all at once.' },
      { q: 'What image formats are supported?', a: 'The tool accepts PNG, JPG/JPEG, and WebP images. Output format matches the input format for maximum compatibility.' },
      { q: 'Does compression change the image dimensions?', a: 'No — the tool only reduces file size by optimizing encoding quality. Image width, height, and aspect ratio remain unchanged.' },
      { q: 'Is EXIF metadata preserved?', a: 'No — metadata (EXIF, ICC profiles) is stripped during compression, which contributes to additional file size savings.' },
    ],
  },

  coloring_page: {
    howItWorks: [
      'Upload any photograph and the tool applies advanced edge detection and contrast analysis to convert it into a clean, printable coloring page. The algorithm extracts outlines while removing photo details, creating bold line art suitable for coloring.',
      'Adjust parameters like line thickness, detail level, and contrast to fine-tune the output. The result is a high-contrast black and white image optimized for printing on standard paper sizes.',
    ],
    features: [
      'Converts any photo into printable line art',
      'Adjustable edge detection sensitivity and line thickness',
      'High-contrast output optimized for printing',
      'Works with portraits, landscapes, animals, and objects',
      'Download as PNG ready for immediate printing',
      'Perfect for teachers, parents, and art activities',
    ],
    faqs: [
      { q: 'What kind of photos work best?', a: 'Photos with clear subjects and good contrast work best — portraits, animals, landscapes, and objects. Busy or low-contrast images may need detail adjustments.' },
      { q: 'Can I adjust the line thickness?', a: 'Yes — the tool provides sliders for edge sensitivity, line thickness, and contrast level so you can fine-tune the coloring page output.' },
      { q: 'What size paper can I print on?', a: 'The output PNG can be printed on any paper size. For best results at standard sizes (A4, Letter), use source images of at least 2000 pixels wide.' },
      { q: 'Is this suitable for kids?', a: 'Absolutely — the tool is perfect for creating custom coloring pages for children, classrooms, and art activities from any photograph.' },
      { q: 'Can I use this for commercial purposes?', a: 'Yes — as long as you own the rights to the source photograph, you can use the coloring page output for any purpose.' },
      { q: 'What format is the download?', a: 'The coloring page is downloaded as a high-contrast PNG image, ready for printing or further editing.' },
    ],
  },

  audio_converter: {
    howItWorks: [
      'This tool uses FFmpeg compiled to WebAssembly to perform professional-grade audio conversion entirely in your browser. The FFmpeg engine loads once (~30MB) and stays cached for instant conversions on return visits.',
      'Select your target format (MP3, WAV, OGG, FLAC, AAC, M4A), optionally adjust bitrate and sample rate, then convert. The tool handles codec transcoding, metadata preservation, and format-specific optimizations automatically.',
    ],
    features: [
      'Convert between MP3, WAV, OGG, FLAC, AAC, and M4A formats',
      'Adjustable bitrate (64kbps to 320kbps) and sample rate settings',
      'FFmpeg-powered — professional codec support',
      'Handles files up to 100MB',
      'Audio trimming with start/end time controls',
      'Preserves ID3 tags and metadata where supported',
    ],
    faqs: [
      { q: 'What audio formats can I convert between?', a: 'Supported formats include MP3, WAV, OGG, FLAC, AAC, and M4A. You can convert between any combination of these formats.' },
      { q: 'Why does the audio engine need to load first?', a: 'The FFmpeg WebAssembly engine (~30MB) downloads once and is cached in your browser. After the initial load, subsequent conversions start instantly.' },
      { q: 'Can I adjust the audio quality?', a: 'Yes — you can set the output bitrate (64kbps to 320kbps) and sample rate to balance file size and audio quality.' },
      { q: 'Is there a file size limit?', a: 'The tool handles audio files up to 100MB. For larger files, consider splitting them first.' },
      { q: 'Are my audio files uploaded to a server?', a: 'No. All conversion happens locally in your browser using WebAssembly. Your audio files never leave your device.' },
      { q: 'Does it preserve audio metadata?', a: 'The tool preserves ID3 tags and metadata where the target format supports it. Some metadata may be lost when converting between incompatible formats.' },
    ],
  },

  speech_to_text: {
    howItWorks: [
      'Powered by OpenAI\'s Whisper model running locally via WebAssembly, this tool transcribes spoken audio into text with high accuracy. The AI model loads once and processes your audio entirely on your device — no data is sent to any server.',
      'Upload an audio or video file, select the language (or let it auto-detect), and receive a timestamped transcript. Export as plain text, SRT subtitles, or VTT format for video captioning.',
    ],
    features: [
      'OpenAI Whisper AI — state-of-the-art speech recognition accuracy',
      'Supports 99+ languages with automatic language detection',
      'Timestamped output for subtitle generation',
      'Export as plain text, SRT, or VTT format',
      'Runs entirely locally — your audio stays private',
      'Handles MP3, WAV, OGG, FLAC, M4A, and video files',
    ],
    faqs: [
      { q: 'How accurate is the transcription?', a: 'The tool uses OpenAI\'s Whisper model, which achieves near-human accuracy on clear audio. Results are best with clear speech and minimal background noise.' },
      { q: 'What languages are supported?', a: 'Whisper supports 99+ languages including English, Spanish, French, German, Japanese, Chinese, and many more. Language can be auto-detected or manually selected.' },
      { q: 'Can I generate subtitles?', a: 'Yes — export your transcript as SRT or VTT format, which can be imported directly into video editors like Premiere Pro, DaVinci Resolve, or YouTube.' },
      { q: 'Does it work with video files?', a: 'Yes — the tool extracts the audio track from video files (MP4, WebM, etc.) and transcribes it. The video itself is not modified.' },
      { q: 'How long does transcription take?', a: 'Processing time depends on audio length and your device\'s hardware. A 5-minute audio clip typically takes 30-60 seconds to transcribe.' },
      { q: 'Is my audio data private?', a: 'Completely. The Whisper AI model runs entirely in your browser via WebAssembly. No audio data is ever sent to any server.' },
    ],
  },

  image_converter: {
    howItWorks: [
      'Convert images between all major formats using your browser\'s native Canvas and encoding APIs. The tool supports HEIC, WebP, AVIF, PNG, JPG, and BMP — including Apple\'s HEIC format which many online tools can\'t handle.',
      'Drop one or multiple images, select your target format and quality settings, then batch-convert all files at once. Each image is re-encoded client-side with no server upload required.',
    ],
    features: [
      'Full HEIC/HEIF support — convert iPhone photos to JPG instantly',
      'Batch conversion — process dozens of images at once',
      'Support for HEIC, WebP, AVIF, PNG, JPG, and BMP formats',
      'Adjustable output quality for lossy formats',
      'Preserves image dimensions and color accuracy',
      'Download individual files or all converted images at once',
    ],
    faqs: [
      { q: 'Can I convert HEIC photos from my iPhone?', a: 'Yes — this is one of the few browser-based tools that supports Apple\'s HEIC/HEIF format. Drop your iPhone photos and convert them to JPG, PNG, or WebP instantly.' },
      { q: 'What image formats are supported?', a: 'Input formats: HEIC, HEIF, WebP, AVIF, PNG, JPG/JPEG, and BMP. Output formats: PNG, JPG, WebP, and BMP.' },
      { q: 'Can I batch-convert multiple images?', a: 'Yes — drop all your images at once, select the target format, and convert them all with a single click.' },
      { q: 'Does conversion affect image quality?', a: 'For lossless formats (PNG), quality is preserved exactly. For lossy formats (JPG, WebP), you can adjust the quality slider to balance file size and visual fidelity.' },
      { q: 'Is there a file size or count limit?', a: 'Individual files up to 100MB are supported. There is no limit on the number of images you can convert at once.' },
      { q: 'Are my images uploaded anywhere?', a: 'No. All conversion uses your browser\'s native Canvas API. Images are processed locally and never leave your device.' },
    ],
  },

  pdf_password: {
    howItWorks: [
      'Add password protection to any PDF using AES-256 encryption — the industry standard used by banks and governments. The encryption process runs entirely in your browser using WebAssembly, so your PDF and password never leave your device.',
      'Choose a strong password, confirm it, and download the encrypted PDF. Recipients will need the password to open the file. The original formatting, fonts, and images are preserved exactly.',
    ],
    features: [
      'AES-256 encryption — military-grade security standard',
      'Password-to-open protection prevents unauthorized access',
      'Preserves all formatting, fonts, and embedded images',
      'Handles PDFs up to 200MB',
      'Zero-knowledge — your password never leaves your device',
      'Compatible with all PDF readers (Adobe, Chrome, Preview)',
    ],
    faqs: [
      { q: 'What encryption standard is used?', a: 'The tool uses AES-256 encryption, the same standard used by banks, governments, and enterprise security systems.' },
      { q: 'Can the encrypted PDF be opened in any PDF reader?', a: 'Yes — the encrypted PDF is compatible with all standard readers including Adobe Acrobat, Apple Preview, Chrome, and Firefox.' },
      { q: 'Is my password stored or transmitted?', a: 'No. Your password is used only for encryption in your browser and is never stored, transmitted, or logged anywhere. This is a zero-knowledge process.' },
      { q: 'Does encryption change the PDF content?', a: 'No — all text, images, fonts, and formatting are preserved exactly. Only access is restricted by the password.' },
      { q: 'What is the maximum PDF file size?', a: 'The tool handles PDFs up to 200MB. Larger files may cause slower processing depending on your device.' },
      { q: 'Can I remove password protection from a PDF?', a: 'This tool only adds password protection. To remove a password, you would need the original password and a PDF unlock tool.' },
    ],
  },
  images_to_pdf: {
    howItWorks: [
      'Drop your images into the tool, reorder them by dragging, then choose a page size — Fit to Image, A4, or US Letter. Each image becomes a page in the output PDF, centered and scaled to fit the chosen layout.',
      'The conversion runs entirely in your browser using pdf-lib.js. Your images are embedded directly into the PDF structure without re-compression, preserving their original quality. PNG transparency is maintained, and non-standard formats are automatically converted before embedding.',
    ],
    features: [
      'Drag-and-drop reordering to arrange pages in any order',
      'Multiple page sizes: Fit to Image, A4, Letter',
      'Supports JPG, PNG, WebP, BMP, and GIF input',
      'Preserves original image quality — no re-compression',
      'Batch processing: convert dozens of images at once',
      'Instant download — no watermarks, no limits',
    ],
    faqs: [
      { q: 'What image formats can I convert to PDF?', a: 'You can convert JPG/JPEG, PNG, WebP, BMP, and GIF images. Each image becomes one page in the output PDF.' },
      { q: 'Can I reorder the images before converting?', a: 'Yes — drag and drop images in the file list to arrange them in your preferred page order before converting.' },
      { q: 'What page sizes are available?', a: 'Three options: "Fit to Image" matches the page size to each image, "A4" (210 × 297 mm) centers the image on a standard A4 page, and "Letter" (8.5 × 11 in) uses US Letter size.' },
      { q: 'Is the image quality preserved?', a: 'Yes. JPG and PNG images are embedded directly without re-compression. Other formats are losslessly converted to PNG before embedding.' },
      { q: 'Is there a limit on the number of images?', a: 'There is no hard limit. The tool processes images sequentially in your browser, so performance depends on your device. Most users can convert 50+ images without issues.' },
      { q: 'Are my images uploaded to a server?', a: 'No. All processing happens locally in your browser. Your images never leave your device — this is a 100% client-side tool.' },
    ],
  },
  pdf_watermark: {
    howItWorks: [
      'Upload a PDF, type your watermark text, and configure opacity, size, rotation, and position. The tool loads your PDF using pdf-lib.js, then draws the watermark text on every page before saving the result.',
      'Processing is 100% local — your PDF is never uploaded to any server. The watermark is embedded directly into the PDF structure, so it appears in all viewers and when printed.',
    ],
    features: [
      'Custom text watermarks — CONFIDENTIAL, DRAFT, or any text',
      'Adjustable opacity from 5% to 100%',
      'Font size control from 12pt to 120pt',
      'Rotation angle from -90° to 90°',
      'Position presets: center, corners',
      'Applies to all pages automatically',
    ],
    faqs: [
      { q: 'Can I add an image watermark?', a: 'Currently the tool supports text watermarks. Image/logo watermarks are on the roadmap.' },
      { q: 'Does the watermark appear when printed?', a: 'Yes — the watermark is embedded in the PDF structure and will appear in print and on screen.' },
      { q: 'Can I remove a watermark later?', a: 'The watermark is permanently drawn onto each page. To remove it, you would need to re-export from the original unwatermarked file.' },
      { q: 'Is there a page limit?', a: 'No — the watermark is applied to every page regardless of document length.' },
      { q: 'What fonts are available?', a: 'The tool uses Helvetica Bold, which is universally supported across all PDF readers.' },
      { q: 'Are my files private?', a: 'Yes. All processing happens in your browser. Your PDF never leaves your device.' },
    ],
  },
  pdf_page_numbers: {
    howItWorks: [
      'Upload a PDF and configure the page numbering settings — position, format, starting number, and font size. The tool loads your document, adds the page number text to every page, and saves the result.',
      'Choose from several numbering formats: plain numbers (1, 2, 3), "Page X of Y", dashed (— 1 —), or Roman numerals (i, ii, iii). Numbers can be placed at any corner or centered at top/bottom.',
    ],
    features: [
      'Six position options: top/bottom × left/center/right',
      'Four number formats: plain, Page X of Y, dashed, Roman',
      'Custom starting number',
      'Adjustable font size (6-36pt)',
      'Live preview of numbering format',
      'Applies to all pages instantly',
    ],
    faqs: [
      { q: 'Can I skip numbering on the first page?', a: 'Not currently — numbers are added to all pages. You can work around this by setting the start number to 0 and considering the first page as a cover.' },
      { q: 'What position options are available?', a: 'You can place numbers at bottom-center, bottom-left, bottom-right, top-center, top-left, or top-right.' },
      { q: 'Can I use Roman numerals?', a: 'Yes — select the Roman format to get i, ii, iii, iv style numbering.' },
      { q: 'Does it preserve the original PDF content?', a: 'Yes — all existing text, images, and formatting are preserved. The page numbers are drawn as an additional layer.' },
      { q: 'Is there a file size limit?', a: 'The tool handles PDFs up to 200MB. Processing speed depends on your device.' },
      { q: 'Are my files uploaded?', a: 'No. Everything runs locally in your browser — your PDF never leaves your device.' },
    ],
  },
  image_resize: {
    howItWorks: [
      'Upload an image and choose your resize method — enter exact pixel dimensions, a percentage scale, or select from social media presets like Instagram, YouTube, or Facebook.',
      'The tool uses the browser\'s native Canvas API with high-quality bicubic interpolation to ensure sharp, clean results. Export as PNG (lossless), JPG (compressed), or WebP (modern) with adjustable quality.',
    ],
    features: [
      'Three resize modes: pixel dimensions, percentage, and presets',
      'Social media presets: Instagram, Facebook, Twitter, YouTube, LinkedIn',
      'Aspect ratio lock to prevent distortion',
      'Output format choice: PNG, JPG, or WebP',
      'Quality slider for JPG and WebP exports',
      'Real-time preview of the resized image',
    ],
    faqs: [
      { q: 'Does resizing reduce image quality?', a: 'Downscaling slightly reduces detail, but the tool uses high-quality interpolation. For lossless output, use PNG format.' },
      { q: 'Can I resize to specific social media sizes?', a: 'Yes — built-in presets for Instagram, Facebook, Twitter, YouTube, LinkedIn, and more. One click to select.' },
      { q: 'What formats are supported?', a: 'Input: JPG, PNG, WebP, BMP, GIF. Output: PNG (lossless), JPG (compressed), or WebP.' },
      { q: 'Can I keep the aspect ratio?', a: 'Yes — the aspect ratio lock is enabled by default. Toggle it off to stretch freely.' },
      { q: 'Is there a file size limit?', a: 'No hard limit, but very large images may be slower depending on your device.' },
      { q: 'Are my images private?', a: 'Yes. All processing happens locally in your browser.' },
    ],
  },
  image_base64: {
    howItWorks: [
      'In encode mode, drop an image file and the tool instantly converts it to a Base64 data URI using the browser\'s FileReader API. Copy the full data URI (with MIME prefix) or the raw Base64 string.',
      'In decode mode, paste a Base64 string or data URI and the tool renders the image for preview and download. No server required — everything runs in your browser.',
    ],
    features: [
      'Two modes: Image → Base64 and Base64 → Image',
      'Copy as full data URI or raw Base64 string',
      'Supports all common image formats',
      'Instant encode — no processing delay',
      'Download decoded images as PNG',
      'Useful for embedding images in HTML, CSS, and JSON',
    ],
    faqs: [
      { q: 'What is Base64 encoding?', a: 'Base64 converts binary image data into a text string that can be embedded directly in HTML, CSS, or JSON without a separate file.' },
      { q: 'When should I use Base64 images?', a: 'Base64 is useful for small images like icons, logos, and placeholders where you want to avoid extra HTTP requests.' },
      { q: 'Does Base64 increase file size?', a: 'Yes — Base64 encoding increases data size by roughly 33%. It\'s best for small images (under ~10KB).' },
      { q: 'Can I decode any Base64 string?', a: 'Yes — paste a raw Base64 string or a full data URI (e.g., data:image/png;base64,...). The tool will render and display the image.' },
      { q: 'Are my files private?', a: 'Yes. All encoding and decoding happens locally in your browser.' },
    ],
  },
  video_to_gif: {
    howItWorks: [
      'Upload a video, set the start and end times to trim the clip, then choose FPS and width. The tool uses FFmpeg.wasm to process the video entirely in your browser — no upload required.',
      'The conversion uses a two-pass palette generation algorithm for optimal GIF color quality. First, it analyzes the video frames to build an optimal 256-color palette, then applies that palette to produce a high-quality animated GIF.',
    ],
    features: [
      'Two-pass conversion for superior GIF quality',
      'Trim video with start/end time controls',
      'Adjustable FPS: 10, 15, 20, or 25 frames per second',
      'Width presets: 320px to 800px',
      'Supports MP4, WebM, MOV, and AVI input',
      'Real-time progress bar during conversion',
    ],
    faqs: [
      { q: 'How long can the video be?', a: 'There is no hard limit, but longer clips at higher FPS/resolution produce very large GIF files. We recommend clips under 15 seconds for best results.' },
      { q: 'Why is the GIF file so large?', a: 'GIFs are uncompressed frame-by-frame animations. Lower the FPS and width to reduce file size significantly.' },
      { q: 'Does it work offline?', a: 'After the initial FFmpeg engine load (~31MB, cached), the tool works offline.' },
      { q: 'What video formats are supported?', a: 'MP4, WebM, MOV, and AVI. Most modern video formats should work.' },
      { q: 'Is there a file size limit?', a: 'Input videos up to 200MB are supported. Processing time depends on your device.' },
    ],
  },
  qr_code: {
    howItWorks: [
      'Enter a URL, text, or WiFi credentials and the tool generates a QR code in real time. Customize colors and size, then download as PNG or scalable SVG.',
      'QR codes are generated entirely in your browser using the qrcode.js library. No data is sent to any server — your URLs and credentials remain completely private.',
    ],
    features: [
      'Three input modes: URL, Text, and WiFi',
      'Live preview updates as you type',
      'Custom foreground and background colors',
      'Multiple size options from 200px to 800px',
      'Download as PNG or SVG',
      'WiFi QR codes work with iOS and Android camera apps',
    ],
    faqs: [
      { q: 'What can I encode in a QR code?', a: 'URLs, plain text, and WiFi network credentials (SSID + password). All three modes are supported.' },
      { q: 'Can I use custom colors?', a: 'Yes — pick any foreground and background color. Make sure there is enough contrast for scanners to read the code.' },
      { q: 'What is the SVG format for?', a: 'SVG is a scalable vector format — the QR code stays sharp at any size, making it ideal for print materials.' },
      { q: 'Do WiFi QR codes work?', a: 'Yes — scanning a WiFi QR code with an iPhone or Android camera will prompt to join the network automatically.' },
      { q: 'Are my entries private?', a: 'Yes. All QR code generation happens in your browser. Nothing is sent to any server.' },
    ],
  },
  sign_pdf: {
    howItWorks: [
      'Upload a PDF, draw your signature on the canvas pad, then position it on any page. The canvas signature is converted to a PNG and embedded into the PDF using pdf-lib.js — no server interaction.',
      'Adjust the signature size, horizontal position, and vertical position using slider controls. Choose which page to place it on, then download the signed PDF instantly.',
    ],
    features: [
      'Touch-friendly signature canvas — works on desktop and mobile',
      'Place signature on any page in the document',
      'Adjustable signature size, position (X/Y)',
      'Preserves all original PDF content',
      'Instant download — no watermarks',
      '100% client-side — your PDF never leaves your device',
    ],
    faqs: [
      { q: 'Is this a legally binding signature?', a: 'This tool adds a visual signature to the PDF. Legal validity depends on your jurisdiction. For legally binding e-signatures, you may need a certified digital signature service.' },
      { q: 'Can I sign on mobile?', a: 'Yes — the signature pad supports touch input, so you can draw with your finger on phones and tablets.' },
      { q: 'Does it modify the original PDF?', a: 'All original content is preserved — the signature is added as an image overlay on the selected page.' },
      { q: 'Can I sign multiple pages?', a: 'Currently the signature is placed on one page per operation. You can download and re-upload to add signatures to additional pages.' },
      { q: 'Are my documents private?', a: 'Yes. All processing happens locally in your browser. Your PDF is never uploaded anywhere.' },
    ],
  },
  pdf_form_filler: {
    howItWorks: [
      'Upload a PDF that contains fillable form fields. The tool automatically detects all interactive fields — text inputs, checkboxes, dropdowns, and radio buttons — and presents them as an editable form.',
      'Fill in the fields, then download the completed PDF. The form is "flattened," meaning the filled values become permanent text — the PDF will display correctly in any reader.',
    ],
    features: [
      'Auto-detects text fields, checkboxes, dropdowns, and radio buttons',
      'Editable form UI for each detected field',
      'Flattens filled forms for universal compatibility',
      'Preserves all other PDF content and formatting',
      'No field limit — handles complex multi-page forms',
      '100% client-side — your data stays private',
    ],
    faqs: [
      { q: 'What kind of PDFs work with this?', a: 'The tool works with PDFs that have interactive form fields (created with Adobe Acrobat, LibreOffice, etc.). Scanned PDFs or image-only PDFs will not have detectable fields.' },
      { q: 'What does "flatten" mean?', a: 'Flattening converts the filled form fields into permanent text/graphics on the PDF. This ensures the values display correctly in all PDF viewers, but the fields can no longer be edited.' },
      { q: 'Can I fill password-protected PDFs?', a: 'The tool attempts to open PDFs with encryption. If the PDF requires a password to view, you will need to remove the password first.' },
      { q: 'Are my form entries private?', a: 'Yes. All processing happens locally. Your data and PDF are never transmitted to any server.' },
    ],
  },
  pdf_to_images: {
    howItWorks: [
      'Upload a PDF and the tool loads it using PDF.js, a Mozilla open-source PDF renderer. Each page is rendered to a high-resolution canvas and exported as a PNG or JPG image.',
      'Choose the render scale to control output quality: 1× (72 DPI) for fast/small files, 2× (144 DPI) for balanced quality, or 3× (216 DPI) for print-quality images. Download each page individually or all at once.',
    ],
    features: [
      'Convert every PDF page to PNG or JPG',
      'Three quality levels: 72, 144, or 216 DPI',
      'Visual grid showing all extracted pages',
      'Download individual pages or all at once',
      'Progress bar for multi-page PDFs',
      '100% client-side — your PDF is never uploaded',
    ],
    faqs: [
      { q: 'What output formats are supported?', a: 'PNG (lossless, larger files) and JPG (compressed, smaller files). Choose based on your needs.' },
      { q: 'How do I get the highest quality?', a: 'Select 3× (216 DPI) quality. This produces the sharpest images suitable for printing.' },
      { q: 'Is there a page limit?', a: 'No — all pages are converted. Processing time depends on page count and quality setting.' },
      { q: 'Can I convert a specific page only?', a: 'Currently all pages are converted, but you can download individual pages from the result grid.' },
      { q: 'Are my files private?', a: 'Yes. The PDF is rendered entirely in your browser using PDF.js. Nothing is uploaded.' },
    ],
  },
  ocr: {
    howItWorks: [
      'Upload an image containing text — a photo, screenshot, or scanned document. Select the language of the text, then click Extract. The tool uses Tesseract.js, an open-source OCR engine, to recognize and extract the text.',
      'The extracted text appears in an editable text area. You can copy it to clipboard, download as a .txt file, or edit it directly before saving. The tool also shows a confidence score indicating recognition accuracy.',
    ],
    features: [
      'Supports 10 languages including English, German, French, Spanish, Japanese, Chinese, and Korean',
      'Real-time progress bar during text recognition',
      'Confidence score for recognition accuracy',
      'Editable text output — fix errors before saving',
      'Copy to clipboard or download as .txt',
      'Works with photos, screenshots, and scanned documents',
    ],
    faqs: [
      { q: 'What languages are supported?', a: 'English, German, French, Spanish, Italian, Portuguese, Dutch, Japanese, Chinese (Simplified), and Korean.' },
      { q: 'How accurate is the OCR?', a: 'Accuracy depends on image quality. Clear, high-contrast text typically achieves 95%+ accuracy. Handwritten text and low-resolution images give lower results.' },
      { q: 'Can it read handwritten text?', a: 'Basic handwritten text may be partially recognized, but printed/typed text gives much better results.' },
      { q: 'How long does OCR take?', a: 'The first recognition takes 5-15 seconds to load the language model. Subsequent recognitions in the same language are faster.' },
      { q: 'Are my images private?', a: 'Yes. All processing happens locally using Tesseract.js. Your images and text never leave your device.' },
    ],
  },
  word_counter: {
    howItWorks: [
      'Type or paste text and see live statistics update instantly. The tool counts words, characters (with and without spaces), sentences, paragraphs, and estimates reading and speaking time.',
      'Statistics update on every keystroke with zero delay. The tool uses whitespace and punctuation analysis to accurately count words and sentences across all languages, including CJK characters.',
    ],
    features: ['Live word, character, sentence count', 'Characters with and without spaces', 'Paragraph counter', 'Reading time estimate (200 wpm)', 'Speaking time estimate (130 wpm)', 'Copy and clear buttons'],
    faqs: [
      { q: 'How is reading time calculated?', a: 'Based on the average adult reading speed of 200 words per minute. Speaking time uses 130 wpm, which is a comfortable presentation pace.' },
      { q: 'Is my text stored or sent anywhere?', a: 'No. Everything happens locally in your browser. Your text never leaves your device — there is no server involved.' },
      { q: 'Does it count words in other languages?', a: 'Yes. The tool counts word boundaries correctly for Latin, Cyrillic, and most European languages. For CJK (Chinese, Japanese, Korean), character count is more meaningful than word count.' },
      { q: 'Can I use it for Twitter/X character limits?', a: 'Yes — the "characters with spaces" count matches how Twitter counts characters. Perfect for checking if your post fits within the 280-character limit.' },
      { q: 'How are sentences counted?', a: 'Sentences are counted by detecting ending punctuation (periods, question marks, exclamation marks) followed by a space or end of text.' },
    ],
  },
  case_converter: {
    howItWorks: [
      'Paste or type text, then click a case button to convert. Supports uppercase, lowercase, title case, sentence case, alternating case, and inverse case.',
      'The conversion is instant and works on any length of text. Title case intelligently capitalizes the first letter of each word, while sentence case capitalizes only the first letter after sentence-ending punctuation.',
    ],
    features: ['6 case modes: upper, lower, title, sentence, alternating, inverse', 'One-click conversion', 'Copy to clipboard', 'Live character count'],
    faqs: [
      { q: 'What is title case?', a: 'Each word starts with a capital letter, with the rest lowercase. Example: "The Quick Brown Fox Jumps Over The Lazy Dog."' },
      { q: 'What is alternating case?', a: 'Characters alternate between lower and uppercase: "aLtErNaTiNg CaSe." Often used for sarcastic or mocking tone in memes.' },
      { q: 'Does sentence case handle multiple sentences?', a: 'Yes — it capitalizes the first letter after every period, question mark, or exclamation mark, plus the very first character.' },
      { q: 'What is inverse case?', a: 'Inverse (or toggle) case swaps the case of every character. Uppercase becomes lowercase and vice versa. Useful for fixing text typed with Caps Lock on.' },
      { q: 'Does it work with special characters and numbers?', a: 'Yes. Numbers, punctuation, and special characters are left unchanged. Only alphabetic characters are affected by the case conversion.' },
    ],
  },
  lorem_ipsum: {
    howItWorks: [
      'Choose whether you want paragraphs, sentences, or words, set the count, then click Generate. The tool produces standard Lorem Ipsum placeholder text.',
      'The generated text follows the classical Lorem Ipsum corpus that designers have used since the 1960s. It reads like natural language but contains no meaningful content, making it ideal for layout testing without distracting from the design.',
    ],
    features: ['Three modes: paragraphs, sentences, words', 'Configurable count', 'Copy to clipboard', 'Word and character count of output'],
    faqs: [
      { q: 'What is Lorem Ipsum?', a: 'Lorem Ipsum is standard placeholder text used in design and typesetting since the 1500s. It originates from a scrambled passage of Cicero\'s "De Finibus Bonorum et Malorum" from 45 BC.' },
      { q: 'Is the text random?', a: 'It draws from a fixed set of classical Lorem Ipsum paragraphs, so it is consistent and readable. This ensures repeatable placeholder text across projects.' },
      { q: 'Why use Lorem Ipsum instead of real text?', a: 'Using meaningless text prevents reviewers from reading the content and allows them to focus on layout, typography, and visual hierarchy instead.' },
      { q: 'Can I generate a specific number of words?', a: 'Yes — switch to "Words" mode and enter the exact number. The tool will generate that many words of Lorem Ipsum text.' },
      { q: 'Is this the standard Lorem Ipsum?', a: 'Yes — it uses the standard corpus starting with "Lorem ipsum dolor sit amet, consectetur adipiscing elit..." which is universally recognized.' },
    ],
  },
  text_to_pdf: {
    howItWorks: [
      'Type or paste your text, choose a font and size, then click Convert. The tool generates a PDF with proper word wrapping and pagination using pdf-lib.js — entirely in your browser.',
      'The converter handles long documents by automatically splitting text across multiple A4 pages with proper margins. Choose from three professional fonts and multiple sizes to match your needs.',
    ],
    features: ['Three fonts: Helvetica, Times Roman, Courier', 'Multiple font sizes (10–18pt)', 'Automatic word wrapping and pagination', 'A4 page format with margins', 'Instant download'],
    faqs: [
      { q: 'Does it support formatting like bold or italic?', a: 'Currently it converts plain text only. Bold, italic, and other rich formatting are not yet supported. The text is rendered in the selected font at the chosen size.' },
      { q: 'Can I convert long documents?', a: 'Yes — the tool automatically splits text across multiple pages with proper margins. There is no practical page limit.' },
      { q: 'What page size is used?', a: 'A4 (210mm × 297mm) with standard margins. This is the most common page size for documents worldwide.' },
      { q: 'Can I use this to create PDF notes or memos?', a: 'Yes — type your text, select Courier font for a typewriter look or Times Roman for a formal feel, then download as a professional PDF.' },
      { q: 'Is my text sent to a server?', a: 'No. The PDF is generated entirely in your browser using pdf-lib.js. Your text never leaves your device.' },
    ],
  },
  json_formatter: {
    howItWorks: [
      'Paste your JSON into the input panel, then click Format to pretty-print it or Minify to compress it. Invalid JSON shows a detailed error message.',
      'The formatter uses the browser\'s native JSON.parse() for validation and JSON.stringify() with configurable indentation for formatting. This ensures 100% spec-compliant parsing — if something is invalid JSON, you\'ll know exactly where and why.',
    ],
    features: ['Format with 2 or 4 space indentation', 'Minify to single line', 'Validate JSON and show errors', 'Copy formatted output', 'Monospace code view'],
    faqs: [
      { q: 'Does it validate JSON?', a: 'Yes — if the JSON is invalid, you will see the exact error message from the parser, including the position of the error. This makes it easy to fix syntax issues.' },
      { q: 'Can I minify JSON?', a: 'Yes — the Minify button removes all whitespace, newlines, and indentation to produce the smallest possible output. Great for reducing API payload sizes.' },
      { q: 'What\'s the difference between 2-space and 4-space indentation?', a: '2-space is more compact and common in JavaScript/React projects. 4-space is more readable and common in Python and Java projects. Both are valid.' },
      { q: 'Can I use it to debug API responses?', a: 'Yes — paste a raw API response and click Format to instantly see the structure. This is one of the most common use cases for the tool.' },
      { q: 'Is there a size limit?', a: 'No hard limit. The formatter handles large JSON payloads (several MB) in your browser. Very large files may take a moment to format.' },
    ],
  },
  color_picker: {
    howItWorks: [
      'Click the color swatch to open the visual picker, or type HEX/RGB values directly. The tool instantly converts between HEX, RGB, and HSL formats.',
      'All three color formats update in real time as you pick or type. Copy any format with one click for use in CSS, design tools, or any application that accepts color values.',
    ],
    features: ['Visual color picker', 'HEX, RGB, HSL conversion', 'Direct RGB channel input', 'One-click copy for each format', 'Live preview swatch'],
    faqs: [
      { q: 'What color formats are supported?', a: 'HEX (#FF5733), RGB (rgb(255, 87, 51)), and HSL (hsl(11, 100%, 60%)). All three update simultaneously when you pick a color.' },
      { q: 'Can I enter colors manually?', a: 'Yes — type a HEX code directly, or adjust individual R, G, B channel values with the sliders. The visual picker updates to match.' },
      { q: 'What is HSL?', a: 'HSL stands for Hue, Saturation, Lightness. It\'s often more intuitive than RGB for adjusting colors — Hue controls the color wheel position, Saturation the intensity, and Lightness the brightness.' },
      { q: 'Can I use this for CSS colors?', a: 'Yes — all output formats are valid CSS. Copy the HEX, RGB, or HSL value and paste it directly into your stylesheet.' },
      { q: 'Does it support transparency (alpha)?', a: 'The current version supports opaque colors. RGBA and HSLA with alpha transparency support may be added in a future update.' },
    ],
  },
  url_encoder: {
    howItWorks: [
      'Choose Encode or Decode mode, paste your text or URL, then click the button. Encode mode applies percent-encoding; Decode mode reverses it.',
      'The tool uses the standard encodeURIComponent and decodeURIComponent functions, which are the same methods browsers use internally to encode URLs. This ensures compatibility with all web standards.',
    ],
    features: ['Encode and decode modes', 'Uses standard encodeURIComponent/decodeURIComponent', 'Copy output to clipboard', 'Live preview'],
    faqs: [
      { q: 'What is URL encoding?', a: 'URL encoding (percent-encoding) replaces special characters with percent-encoded equivalents (e.g., space → %20, & → %26) so they can be safely used in URLs without being misinterpreted.' },
      { q: 'Does it handle Unicode and emojis?', a: 'Yes — encodeURIComponent fully supports Unicode characters including emojis. Multi-byte characters are encoded as multiple percent-sequences.' },
      { q: 'When do I need URL encoding?', a: 'Whenever you pass special characters in URL parameters (query strings), form data, or API requests. Characters like &, =, ?, #, and spaces must be encoded.' },
      { q: 'What\'s the difference between encodeURI and encodeURIComponent?', a: 'encodeURIComponent encodes everything except letters, digits, and - _ . ~ (it encodes /, ?, #, etc.). encodeURI leaves URL-structural characters intact. This tool uses the stricter encodeURIComponent.' },
      { q: 'Can I decode a full URL?', a: 'Yes — switch to Decode mode and paste the encoded URL. All percent-encoded characters will be converted back to their original form.' },
    ],
  },
  base64_text: {
    howItWorks: [
      'Choose Encode or Decode mode, enter your text or Base64 string, then click the button. Encoding converts text to Base64; decoding reverses it.',
      'Base64 encoding represents binary data as printable ASCII characters. The tool handles the UTF-8 encoding step internally, so Unicode text (including accented characters and emojis) is correctly preserved in both directions.',
    ],
    features: ['Encode text to Base64', 'Decode Base64 to text', 'Full UTF-8 Unicode support', 'Copy output to clipboard', 'Error handling for invalid Base64'],
    faqs: [
      { q: 'What is Base64 encoding?', a: 'Base64 is an encoding that represents binary data as ASCII text using 64 printable characters (A-Z, a-z, 0-9, +, /). It\'s commonly used in emails, data URIs, JWTs, and API payloads.' },
      { q: 'Does it support Unicode?', a: 'Yes — the tool handles multi-byte UTF-8 characters correctly, including accented letters, CJK characters, and emojis.' },
      { q: 'Why does Base64 make text longer?', a: 'Base64 expands data by about 33%. Three bytes of input produce four characters of Base64 output. This is the trade-off for having a text-safe representation.' },
      { q: 'Can I use this for data URIs?', a: 'Yes — encode your content to Base64, then use it in a data URI like: data:text/plain;base64,{your-base64-string}.' },
      { q: 'What happens with invalid Base64 input?', a: 'The decoder shows a clear error message if the input is not valid Base64. Common issues include missing padding (= characters) or illegal characters.' },
    ],
  },
  password_generator: {
    howItWorks: [
      'Click Generate to create a random password. Adjust length using the slider (6–64 characters) and toggle character types: uppercase, lowercase, numbers, and symbols. A strength meter shows password security.',
      'The generator uses the Web Crypto API — the same cryptographically secure random number generator used by banks and security software. Your password is created entirely in your browser and is never transmitted anywhere.',
    ],
    features: [
      'Crypto-secure randomness (Web Crypto API)',
      'Length slider: 6–64 characters',
      'Toggle uppercase, lowercase, numbers, symbols',
      'Real-time strength meter with scoring',
      'One-click copy to clipboard',
      'Generate multiple passwords at once',
    ],
    faqs: [
      { q: 'Is it truly secure?', a: 'Yes — it uses crypto.getRandomValues(), the same cryptographically secure random number generator used by banks and TLS/SSL encryption. Passwords are generated entirely in your browser.' },
      { q: 'Are my passwords stored or sent anywhere?', a: 'No. Everything runs locally in your browser. We have no server, no database, and no way to see your passwords. Once you close the tab, the password exists only where you copied it.' },
      { q: 'How long should my password be?', a: 'At least 12 characters for most accounts. For high-security accounts (banking, email), use 16 or more. Our strength meter gives real-time feedback as you adjust.' },
      { q: 'What makes a strong password?', a: 'Length is the biggest factor, followed by character diversity. A 16-character password mixing uppercase, lowercase, numbers, and symbols would take billions of years to brute-force.' },
      { q: 'Can I use this for passphrase generation?', a: 'This tool generates random character strings. For word-based passphrases (like "correct-horse-battery-staple"), you would need a dedicated passphrase generator.' },
    ],
  },
  pdf_rotate: {
    howItWorks: [
      'Upload a PDF, select rotation angle (90°, 180°, or 270°), choose whether to rotate all pages or specific ones, then download the rotated PDF.',
      'The tool uses pdf-lib to read your PDF, apply the rotation transformation to each selected page, and save the result — all without sending files to any server. Page content, fonts, images, and annotations are fully preserved.',
    ],
    features: [
      'Rotate by 90°, 180°, or 270° clockwise',
      'All pages or specific page selection',
      'Preserves all PDF content and formatting',
      'Handles scanned documents and large files',
      'Instant download of the rotated PDF',
      '100% client-side — files never leave your device',
    ],
    faqs: [
      { q: 'Can I rotate individual pages?', a: 'Yes — switch to Custom mode and enter page numbers separated by commas. For example, "1, 3, 5" rotates only those pages while leaving the rest unchanged.' },
      { q: 'Does rotation affect text selection?', a: 'No. The rotation is applied at the PDF page level, so text remains selectable and searchable. It\'s the same as rotating in Adobe Acrobat.' },
      { q: 'What\'s the maximum file size?', a: 'There is no hard limit, but very large files (over 100MB) may be slow depending on your device\'s available memory. Files are processed entirely in your browser.' },
      { q: 'Will it work on scanned PDFs?', a: 'Yes. Scanned PDFs are just image-based pages, which rotate the same way as text-based pages. All content is preserved exactly as-is.' },
      { q: 'Can I rotate a password-protected PDF?', a: 'The tool attempts to open PDFs with encryption. Password-protected files that restrict editing may not be modifiable, but read-only protected PDFs usually work.' },
    ],
  },
  diff_checker: {
    howItWorks: [
      'Paste your original text on the left and the changed version on the right. Click Compare to see a unified diff with additions (green) and deletions (red) highlighted.',
      'The tool performs a line-by-line comparison using a standard diff algorithm. It identifies the minimum set of changes needed to transform the original text into the modified version, making it easy to review edits in code, documents, or configuration files.',
    ],
    features: [
      'Side-by-side input panes',
      'Unified diff output with color coding',
      'Green highlights for additions, red for deletions',
      'Line-by-line comparison with line numbers',
      'Statistics: lines added, removed, and unchanged',
      'Handles large texts with thousands of lines',
    ],
    faqs: [
      { q: 'How does it compare text?', a: 'It performs a line-by-line diff algorithm (similar to Unix diff), showing which lines were added, removed, or unchanged. Changes are highlighted in green (added) and red (removed).' },
      { q: 'Can I compare code files?', a: 'Yes — it works great for comparing code, config files, SQL queries, JSON, or any plain text. Paste both versions and see exactly what changed.' },
      { q: 'Is there a size limit?', a: 'No hard limit. However, very large texts (10,000+ lines) may take a moment to process since everything runs in your browser.' },
      { q: 'Does it handle whitespace changes?', a: 'Yes — all whitespace changes (spaces, tabs, line endings) are detected and shown in the diff. Every character difference is captured.' },
      { q: 'Can I copy the diff output?', a: 'Yes. The diff output is plain text and can be selected and copied. It uses the standard unified diff format that developers are familiar with.' },
    ],
  },
  hash_generator: {
    howItWorks: [
      'Type or paste text, click Generate Hashes. The tool computes SHA-1, SHA-256, SHA-384, and SHA-512 hashes using the Web Crypto API — entirely in your browser.',
      'Hashing is a one-way function: you can generate a hash from any text, but you cannot reverse a hash back to text. This makes hashes useful for verifying file integrity, storing password fingerprints, and creating digital signatures.',
    ],
    features: [
      'SHA-1, SHA-256, SHA-384, SHA-512 algorithms',
      'Uses native Web Crypto API (browser-built-in)',
      'One-click copy for each hash value',
      'Instant computation — no server round-trip',
      'Handles long text inputs',
      'Hexadecimal output format',
    ],
    faqs: [
      { q: 'Is the hashing secure?', a: 'Yes — the Web Crypto API is the same cryptographic engine used by HTTPS websites. SHA-256 and SHA-512 are widely used in security applications, blockchain, and digital certificates.' },
      { q: 'What\'s the difference between SHA-256 and SHA-512?', a: 'SHA-256 produces a 256-bit (64 character) hash, while SHA-512 produces a 512-bit (128 character) hash. SHA-512 is slightly more secure but both are considered safe for current applications.' },
      { q: 'Can I hash files?', a: 'This tool hashes text input. For file checksums (verifying downloads), you would paste the file content or use a command-line tool like shasum.' },
      { q: 'Why is SHA-1 still included?', a: 'SHA-1 is included for compatibility with legacy systems that still use it. For new applications, use SHA-256 or SHA-512 which are more collision-resistant.' },
      { q: 'Is my text sent to a server?', a: 'No. All hashing happens in your browser using the Web Crypto API. Your text never leaves your device.' },
    ],
  },
  regex_tester: {
    howItWorks: [
      'Enter a regular expression pattern and flags, type or paste your test string. Matches are listed in real time with their position and value.',
      'The tool uses JavaScript\'s native RegExp engine. As you type, it continuously tests your pattern against the input, highlighting all matches and showing capture groups. Perfect for debugging patterns before using them in code.',
    ],
    features: [
      'Live matching as you type — instant feedback',
      'Supports all JavaScript regex flags (g, i, m, s, u, y)',
      'Match list with positions and capture groups',
      'Error messages for invalid patterns',
      'Syntax highlighting in pattern input',
      'Copy regex or matches to clipboard',
    ],
    faqs: [
      { q: 'What regex syntax is supported?', a: 'JavaScript/ECMAScript regular expression syntax. This includes groups, lookaheads, lookbehinds, named captures, character classes, and quantifiers.' },
      { q: 'Can I test regex flags?', a: 'Yes. Enter flags like g (global), i (case-insensitive), m (multiline), s (dotAll), u (unicode), and y (sticky) in the flags input field.' },
      { q: 'Does it support capture groups?', a: 'Yes. Both numbered groups (parentheses) and named groups (?<name>pattern) are supported. Each match shows its captured groups.' },
      { q: 'Will my regex work in Python/Java/PHP?', a: 'Most basic patterns are cross-compatible. However, some advanced features (lookbehinds, named groups) have different syntax in other languages. This tester uses JavaScript regex specifically.' },
      { q: 'Is there a limit on input length?', a: 'No hard limit. Very long test strings (100,000+ characters) may slow down live matching since the regex runs on every keystroke in your browser.' },
    ],
  },
  csv_json: {
    howItWorks: [
      'Choose CSV→JSON or JSON→CSV mode. Paste your data and click Convert. CSV headers become JSON keys; JSON array of objects becomes CSV with headers.',
      'The converter properly handles edge cases like quoted fields, commas within values, newlines inside quotes, and special characters. It produces clean, valid output in both directions — ready to use in APIs, databases, or spreadsheets.',
    ],
    features: [
      'Bidirectional: CSV→JSON and JSON→CSV',
      'Automatic header detection from first row',
      'Proper CSV escaping (quotes, commas, newlines)',
      'Valid JSON output with proper types',
      'Copy output to clipboard with one click',
      'Handles large datasets efficiently',
    ],
    faqs: [
      { q: 'What CSV format is expected?', a: 'Standard comma-separated values. The first row is treated as column headers. Values containing commas or quotes should be enclosed in double quotes.' },
      { q: 'Does it preserve data types?', a: 'In CSV→JSON mode, numbers are converted to numeric types and "true"/"false" become booleans. All other values remain strings.' },
      { q: 'What JSON structure is supported?', a: 'For JSON→CSV, the tool expects an array of objects (e.g., [{\"name\":\"Alice\"},{\"name\":\"Bob\"}]). Object keys become CSV column headers.' },
      { q: 'Can it handle large files?', a: 'Yes. The converter runs in your browser and handles datasets with thousands of rows. For very large files (10MB+), processing may take a few seconds.' },
      { q: 'What about semicolon-separated files?', a: 'Currently the tool uses commas as the delimiter (standard CSV). Semicolon-separated files (common in European locales) would need the semicolons replaced with commas first.' },
    ],
  },
  markdown_html: {
    howItWorks: [
      'Choose Markdown→HTML or HTML→Markdown mode. Paste your content and click Convert. Supports headers, bold, italic, links, images, lists, and blockquotes.',
      'The converter parses Markdown syntax into semantic HTML tags, or reverses the process — turning HTML back into clean Markdown. It handles nested structures, inline formatting, and preserves document hierarchy. No external libraries or server calls needed.',
    ],
    features: [
      'Bidirectional: Markdown→HTML and HTML→Markdown',
      'Full heading support (H1–H6)',
      'Bold, italic, inline code, and strikethrough',
      'Links, images, and blockquotes',
      'Ordered and unordered lists',
      'No external dependencies — pure JavaScript',
    ],
    faqs: [
      { q: 'What Markdown features are supported?', a: 'Headings (H1–H6), bold, italic, inline code, code blocks, links, images, ordered/unordered lists, blockquotes, and horizontal rules.' },
      { q: 'Does it support GitHub-Flavored Markdown?', a: 'It supports the most common GFM features like strikethrough (~~text~~) and fenced code blocks. Tables and task lists may have limited support.' },
      { q: 'Will it preserve my HTML classes and attributes?', a: 'In HTML→Markdown mode, HTML attributes like classes, IDs, and styles are stripped since Markdown doesn\'t have a concept of attributes. The content and structure are preserved.' },
      { q: 'Can I use it for blog post conversion?', a: 'Yes — it\'s great for converting blog drafts between formats. Write in Markdown and export to HTML for your CMS, or import HTML content back to Markdown for editing.' },
      { q: 'Is there a size limit?', a: 'No hard limit. The converter handles large documents with hundreds of paragraphs. All processing runs in your browser.' },
    ],
  },
};

const localizedContent: Record<string, Record<string, ToolContent>> = {};

try {
  // Dynamic imports don't work in this context, so we use require-style
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const deContent = require('./toolContent.de');
  if (deContent?.toolContentDe) {
    localizedContent['de'] = deContent.toolContentDe;
  }
} catch {
  // German content not yet available — will fall back to English
}

export function getToolContent(toolId: string, locale?: Locale): ToolContent | null {
  // Try locale-specific content first
  if (locale && locale !== 'en' && localizedContent[locale]?.[toolId]) {
    return localizedContent[locale][toolId];
  }
  // Fallback to English
  return toolContent[toolId] || null;
}
