-- BestOnline.Tools: pSEO Database Schema
-- Target: Neon (PostgreSQL)

-- Table 1: Registered tool components
CREATE TABLE IF NOT EXISTS tools_master (
  id          TEXT PRIMARY KEY,           -- e.g. 'svg_vectorizer', 'remove_bg'
  component   TEXT NOT NULL,              -- React component name e.g. 'VectorizerTool'
  category    TEXT NOT NULL,              -- 'image', 'pdf', 'audio', 'video'
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Table 2: All pSEO pages (the content engine)
CREATE TABLE IF NOT EXISTS pseo_pages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  locale          TEXT NOT NULL,               -- 'en', 'de', 'es'
  slug            TEXT NOT NULL,               -- full slug after locale: 'image/png-to-svg'
  tool_id         TEXT NOT NULL REFERENCES tools_master(id),
  page_type       TEXT NOT NULL CHECK (page_type IN ('HUB', 'SPOKE', 'ALTERNATIVE', 'GUIDE')),
  h1              TEXT NOT NULL,
  meta_title      TEXT NOT NULL,
  meta_desc       TEXT NOT NULL,
  faq_json        JSONB DEFAULT '[]',
  default_config  JSONB DEFAULT '{}',
  is_active       BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(locale, slug)
);

-- Index for fast slug lookups (the hot path)
CREATE INDEX IF NOT EXISTS idx_pseo_locale_slug ON pseo_pages(locale, slug);

-- Index for finding all sibling locales (hreflang generation)
CREATE INDEX IF NOT EXISTS idx_pseo_tool_type ON pseo_pages(tool_id, page_type);

-- Seed: Register the vectorizer tool
INSERT INTO tools_master (id, component, category) VALUES
  ('svg_vectorizer', 'VectorizerTool', 'image')
ON CONFLICT (id) DO NOTHING;

-- Seed: Vectorizer Hub pages (EN + DE)
INSERT INTO pseo_pages (locale, slug, tool_id, page_type, h1, meta_title, meta_desc) VALUES
  ('en', 'image/png-to-svg',
   'svg_vectorizer', 'HUB',
   'Convert PNG to SVG — Free Online Vectorizer',
   'PNG to SVG Converter | Free, Private, Instant | BestOnline.Tools',
   'Convert any PNG, JPG, or WebP image to SVG vector format. Runs locally in your browser — your files never leave your device.'),
  ('de', 'bild/png-zu-svg',
   'svg_vectorizer', 'HUB',
   'PNG in SVG umwandeln — Kostenloser Online-Vektorisierer',
   'PNG zu SVG Konverter | Kostenlos, Privat, Sofort | BestOnline.Tools',
   'Konvertieren Sie jedes PNG-, JPG- oder WebP-Bild in das SVG-Vektorformat. Läuft lokal in Ihrem Browser.')
ON CONFLICT (locale, slug) DO NOTHING;
