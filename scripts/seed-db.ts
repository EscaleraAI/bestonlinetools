/**
 * Seed script — Populates the Neon pseo_pages table from the JSON page map.
 * 
 * Usage: npx tsx scripts/seed-db.ts
 * 
 * Requires DATABASE_URL in .env.local
 */

import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';

// Load .env.local
config({ path: '.env.local' });

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL not found in .env.local');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

// --- Schema ---
const CREATE_TABLE = `
CREATE TABLE IF NOT EXISTS pseo_pages (
  id              SERIAL PRIMARY KEY,
  locale          VARCHAR(5) NOT NULL DEFAULT 'en',
  slug            TEXT NOT NULL,
  tool_id         TEXT NOT NULL,
  page_type       VARCHAR(20) NOT NULL,
  h1              TEXT NOT NULL,
  meta_title      TEXT NOT NULL,
  meta_desc       TEXT NOT NULL,
  faq_json        JSONB DEFAULT '[]',
  default_config  JSONB DEFAULT '{}',
  canonical_slug  TEXT NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(locale, slug)
);

CREATE INDEX IF NOT EXISTS idx_pseo_locale_slug ON pseo_pages(locale, slug);
CREATE INDEX IF NOT EXISTS idx_pseo_tool_id ON pseo_pages(tool_id);
`;

// --- Import the static pages map ---
// We inline the data here to avoid TypeScript path alias issues in scripts
interface PageEntry {
  toolId: string;
  pageType: string;
  h1: string;
  metaTitle: string;
  metaDesc: string;
  faqJson: { q: string; a: string }[];
  defaultConfig: Record<string, unknown>;
  locale: string;
  canonicalSlug: string;
}

async function main() {
  console.log('📦 Creating table...');
  await sql`
    CREATE TABLE IF NOT EXISTS pseo_pages (
      id              SERIAL PRIMARY KEY,
      locale          VARCHAR(5) NOT NULL DEFAULT 'en',
      slug            TEXT NOT NULL,
      tool_id         TEXT NOT NULL,
      page_type       VARCHAR(20) NOT NULL,
      h1              TEXT NOT NULL,
      meta_title      TEXT NOT NULL,
      meta_desc       TEXT NOT NULL,
      faq_json        JSONB DEFAULT '[]',
      default_config  JSONB DEFAULT '{}',
      canonical_slug  TEXT NOT NULL,
      created_at      TIMESTAMPTZ DEFAULT NOW(),
      updated_at      TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(locale, slug)
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS idx_pseo_locale_slug ON pseo_pages(locale, slug)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_pseo_tool_id ON pseo_pages(tool_id)`;

  // Dynamically read the JSON pages from pageResolver
  // Since we can't use path aliases in scripts, we read the module relatively
  const { getAllPages } = await import('../src/lib/pageResolver.ts');
  const allPages = getAllPages();

  console.log(`📄 Found ${allPages.length} pages to seed`);

  let inserted = 0;
  let skipped = 0;

  for (const page of allPages) {
    try {
      await sql`
        INSERT INTO pseo_pages (locale, slug, tool_id, page_type, h1, meta_title, meta_desc, faq_json, default_config, canonical_slug)
        VALUES (
          ${page.locale},
          ${page.slug},
          ${page.toolId},
          ${page.pageType},
          ${page.h1},
          ${page.metaTitle},
          ${page.metaDesc},
          ${JSON.stringify(page.faqJson)}::jsonb,
          ${JSON.stringify(page.defaultConfig)}::jsonb,
          ${page.canonicalSlug}
        )
        ON CONFLICT (locale, slug) DO UPDATE SET
          tool_id = EXCLUDED.tool_id,
          page_type = EXCLUDED.page_type,
          h1 = EXCLUDED.h1,
          meta_title = EXCLUDED.meta_title,
          meta_desc = EXCLUDED.meta_desc,
          faq_json = EXCLUDED.faq_json,
          default_config = EXCLUDED.default_config,
          canonical_slug = EXCLUDED.canonical_slug,
          updated_at = NOW()
      `;
      inserted++;
    } catch (err: any) {
      console.error(`  ❌ Failed: ${page.locale}:${page.slug} — ${err.message}`);
      skipped++;
    }
  }

  console.log(`\n✅ Done! Inserted/updated: ${inserted}, Skipped: ${skipped}`);
}

main().catch(console.error);
