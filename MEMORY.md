# System Memory & Context 🧠
<!--
AGENTS: Update this file after every major milestone, structural change, or resolved bug.
DO NOT delete historical context if it is still relevant. Compress older completed items.
-->

## 🏗️ Active Phase & Goal
**Current Task:** Wave 2 in progress
**Next Steps:**
1. Scale locales from 2 → 10 (FR, ES, IT, NL, PT, PL, SV, JA)
2. PDF Compress WASM feasibility spike
3. Text-to-Coloring-Book (Fal.ai FLUX)
4. Connect Neon DB (code is prepared, just add DATABASE_URL)

## 📂 Architectural Decisions
- 2026-03-22 — **Single catch-all route:** Chose unified `[...slug]` over dual `[locale]/[...slug]` + `[...slug]`. Next.js couldn't distinguish English paths from locale-prefixed paths (e.g., `/image/png-to-svg` matched `locale='image'`). The `parseSlug()` function detects locale from first segment instead.
- 2026-03-22 — **English = no URL prefix:** English paths have no locale prefix (e.g., `/image/png-to-svg`). Non-default locales get prefixed (e.g., `/de/bild/png-zu-svg`). Matches Wikipedia/MDN pattern, avoids breaking existing URLs.
- 2026-03-22 — **JSON page resolver as MVP:** Using a static JSON map in `pageResolver.ts` for slug→page resolution instead of Neon DB queries. Will migrate to Neon in a future sprint — the interface is identical (`resolvePage()` / `getAllPages()`).
- 2026-03-22 — **proxy.ts over middleware.ts:** Next.js 16 deprecated `middleware.ts` in favor of `proxy.ts` (same API, renamed export from `middleware` to `proxy`).
- 2026-03-22 — **pdf-lib.js can't compress PDFs:** Moved PDF Compress from Wave 1 to Wave 2. Requires Ghostscript/MuPDF compiled to WASM — separate feasibility spike needed.
- 2026-03-22 — **pSEO ships with Wave 1:** Dynamic `/tools/[action]-[x]-to-[y]` routes and `/alternatives/[competitor]` pages must launch with the first tools. SEO takes 3-6 months to age — can't wait.
- 2026-03-22 — **Neon DB for pSEO matrix:** Vercel Postgres (powered by Neon), free tier = 256MB. Sufficient for 10K pSEO rows.
- 2026-03-22 — **MVP locales: EN + DE:** Start with 2 locales to validate the i18n pipeline, then scale to 10 languages in Wave 2.
- 2026-03-22 — **Zustand + IndexedDB for file handoff:** Stores processed files as ArrayBuffers (not Blobs/ObjectURLs) for IndexedDB serialization. 30-minute staleness cleanup prevents stale handoffs. FileStoreProvider hydrates on app mount via root layout.
- 2026-03-22 — **@neplex/vectorizer as serverExternal:** Native NAPI-RS addon can't be bundled by Turbopack. Must use `serverExternalPackages` in next.config.ts.
- 2026-03-22 — **BG Remover: Web Worker + WebGPU:** RMBG-1.4 runs in a Web Worker for non-blocking UI. WebGPU primary with WASM fallback. Model is ~40MB, cached after first download. Pipeline pre-warmed with 1x1 dummy image to avoid cold-start.
- 2026-03-30 — **COOP/COEP headers for FFmpeg.wasm:** Added `Cross-Origin-Opener-Policy: same-origin` and `Cross-Origin-Embedder-Policy: require-corp` to `next.config.ts`. Required for SharedArrayBuffer (multi-threaded WASM). Applied globally to all routes.
- 2026-03-31 — **href field in ToolDefinition:** All tool linking now derives from `tool.href` (e.g., `/image/png-to-svg`). Header, Footer, ToolCard, and any future component must use this field — never construct URLs from slug. Adding a new tool to `registry.ts` automatically propagates to all navigation.

## 🐛 Known Issues & Quirks
- PowerShell `Remove-Item` fails silently on directories with brackets (`[locale]`). Use `cmd /c rmdir /s /q` instead.
- The old `tools/vectorizer/page.tsx` still exists as a static route. It has a 301 redirect configured in `next.config.ts` to `/image/png-to-svg`, but the physical page file should be cleaned up once all references are updated.
- Dev server needs restart after adding/removing route directories — Turbopack doesn't hot-reload new directory structures.
- Build output may show stale routes from `.next` cache — clear with `cmd /c rmdir /s /q .next` before rebuilding. This is especially important after deleting route directories.

## 📜 Completed Phases
- [x] Strategic tool review (20+ tools scored, 4 build waves defined)
- [x] PRD Step 0: Site Architecture + pSEO + i18n (approved)
- [x] Sprint 1: Routing & DB Skeleton (schema, i18n config, proxy, catch-all route, tool registry, page resolver)
- [x] Sprint 2: SEO Engine (12 pSEO pages seeded, dynamic sitemap, hreflang tags, JSON-LD schemas)
- [x] Route fix: Consolidated dual catch-all into single `[...slug]` with `parseSlug()`
- [x] Sprint 3: Cross-tool file handoff (Zustand + IndexedDB, ToolSuccess component, FileStoreProvider)
- [x] PRD #2: Background Remover (implemented — worker, hook, UI, 10 pSEO pages)
- [x] Swiss International design system rebrand (globals, header, footer, homepage, all tool CSS)
- [x] PRD #3: PDF Suite (Merge + Split — pdf-lib.js, 14 pSEO pages)
- [x] Neon DB migration (dual-mode resolver — DB when configured, JSON fallback)
- [x] PRD #4: Image Compressor (Canvas API, batch, quality slider, format toggle, 14 pSEO pages)
- [x] PRD #5: Photo to Coloring Page (Sobel edge detection, live preview, 3 adjustable params, 14 pSEO pages)
- [x] ✅ WAVE 1 COMPLETE — 6 tools live (Vectorizer, BG Remover, PDF Merge, PDF Split, Image Compressor, Coloring Page)
- [x] PRD #6: Audio Converter (FFmpeg.wasm, 5 formats, bitrate slider, trim, COOP/COEP headers, 14 pSEO pages)
- [x] PRD #7: Speech to Text (Whisper tiny.en via Transformers.js, Web Worker, WebGPU, timestamps, SRT export, 14 pSEO pages)
- [x] Platform Fix: Added href to ToolDefinition, restored BG Remover to registry, fixed Header/Footer/ToolCard linking, mobile hamburger menu, /privacy page, /pricing page, removed legacy /tools/ route
- [x] PRD #8: Image Converter (Canvas API, HEIC/WebP/AVIF/BMP/GIF/TIFF→JPG/PNG/WebP, quality slider, batch, 14 pSEO pages + Convertio/iLoveIMG alternatives)
- [x] PRD #9: PDF Password Protect (@pdfsmaller/pdf-encrypt-lite, password UI, single-file, 8 pSEO pages EN+DE)

## 📌 Pending
- [ ] Scale locales 2→10 (FR, ES, IT, NL, PT, PL, SV, JA)
- [ ] Design system migration: user provided Flat Design spec (Outfit font, blue/emerald/amber palette, rounded corners, color blocks, no shadows/borders). Should be done as a dedicated sweep after tool development stabilizes.
