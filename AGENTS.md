<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AGENTS.md — Master Plan for BestOnline.Tools

## Project Overview & Stack
**App:** BestOnline.Tools
**Overview:** A standalone, privacy-first online tools platform. All tools run client-side via WebAssembly — files never leave the user's browser. Monetized via ads, Pro upsells, and the Snappit ecosystem funnel. Designed for massive pSEO with 10,000+ localized pages.
**Stack:** Next.js 16.2.1 (App Router), React 19, TypeScript 5, PostgreSQL (Neon), Vercel
**Critical Constraints:**
- 100% standalone — no outbound links to external apps
- Client-side processing via WASM/WebGPU (no server uploads for free tier)
- i18n with translated URL slugs (EN=default no prefix, DE=`/de/` prefix)
- Strict TypeScript — no `any` types

## Setup & Commands
- **Setup:** `npm install`
- **Development:** `npm run dev`
- **Build:** `npm run build`
- **Linting:** `npm run lint`

## Protected Areas
Do NOT modify without explicit human approval:
- **Database Migrations:** `db/schema.sql`
- **i18n Config:** `src/lib/i18n.ts` (locale list, slug translations)
- **Proxy/Middleware:** `src/proxy.ts`
- **next.config.ts:** Server external packages, redirects

## Coding Conventions
- **Architecture:** Single unified `[...slug]` catch-all route with `parseSlug()` locale detection
- **Tool registration:** Add new tools via `src/lib/toolRegistry.ts` + seed pages in `src/lib/pageResolver.ts`
- **State:** Zustand + IndexedDB for cross-tool file handoff (Sprint 3)
- **CSS:** Component-scoped CSS Modules (`.module.css`)
- **Type Safety:** Strict TypeScript, no `any`

## Agent Behaviors
1. **Plan Before Execution:** Propose a step-by-step plan before changing more than one file.
2. **Refactor Over Rewrite:** Prefer incremental refactoring over complete rewrites.
3. **Context Compaction:** Update `MEMORY.md` after every major milestone.
4. **Iterative Verification:** Run `npm run build` after each logical change. Fix errors before proceeding.
5. **Documentation:** Keep `MEMORY.md`, strategic review, and PRDs current.
