-- Supabase Mevzuat - Düzeltilmiş Versiyon (ON CONFLICT hatası yok)
-- Mevcut 'profiles' tablosu var, sadece eksikleri ekleyelim

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. MEVZUAT KATEGORİLERİ TABLOSU (UNIQUE constraint ile)
CREATE TABLE IF NOT EXISTS mevzuat_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(100) NOT NULL UNIQUE,  -- UNIQUE constraint eklendi
    description TEXT,
    icon VARCHAR(10),
    color VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. MEVZUAT ANA TABLOSU
CREATE TABLE IF NOT EXISTS mevzuat (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mevzuat_no VARCHAR(20),
    title VARCHAR(500) NOT NULL,
    type VARCHAR(50) NOT NULL,
    category_id UUID REFERENCES mevzuat_categories(id),
    publication_date DATE,
    effective_date DATE,
    gazette_no VARCHAR(20),
    gazette_date DATE,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    summary TEXT,
    full_text TEXT,
    article_count INTEGER DEFAULT 0,
    url VARCHAR(500),
    keywords TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. MEVZUAT MADDELERİ TABLOSU
CREATE TABLE IF NOT EXISTS mevzuat_articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mevzuat_id UUID NOT NULL REFERENCES mevzuat(id) ON DELETE CASCADE,
    article_no VARCHAR(20) NOT NULL,
    title VARCHAR(300),
    content TEXT NOT NULL,
    html_content TEXT,
    section VARCHAR(100),
    chapter VARCHAR(100),
    article_order INTEGER,
    is_repealed BOOLEAN DEFAULT FALSE,
    amendment_info TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. MEVZUAT ARAMA İNDEKSİ
CREATE TABLE IF NOT EXISTS mevzuat_search_index (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mevzuat_id UUID NOT NULL REFERENCES mevzuat(id) ON DELETE CASCADE UNIQUE,  -- UNIQUE constraint
    search_vector tsvector,
    content_type VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. İNDEKSLER
CREATE INDEX IF NOT EXISTS idx_mevzuat_type ON mevzuat(type);
CREATE INDEX IF NOT EXISTS idx_mevzuat_category ON mevzuat(category_id);
CREATE INDEX IF NOT EXISTS idx_mevzuat_status ON mevzuat(status);
CREATE INDEX IF NOT EXISTS idx_mevzuat_no ON mevzuat(mevzuat_no);
CREATE INDEX IF NOT EXISTS idx_mevzuat_publication_date ON mevzuat(publication_date);
CREATE INDEX IF NOT EXISTS idx_mevzuat_keywords ON mevzuat USING gin(keywords);

CREATE INDEX IF NOT EXISTS idx_articles_mevzuat_id ON mevzuat_articles(mevzuat_id);
CREATE INDEX IF NOT EXISTS idx_articles_article_no ON mevzuat_articles(article_no);
CREATE INDEX IF NOT EXISTS idx_articles_order ON mevzuat_articles(article_order);

CREATE INDEX IF NOT EXISTS idx_search_vector ON mevzuat_search_index USING gin(search_vector);
CREATE INDEX IF NOT EXISTS idx_search_mevzuat_id ON mevzuat_search_index(mevzuat_id);

-- 6. FULL-TEXT SEARCH TRIGGER
CREATE OR REPLACE FUNCTION update_mevzuat_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO mevzuat_search_index (mevzuat_id, search_vector, content_type)
    VALUES (NEW.id, to_tsvector('turkish', COALESCE(NEW.title, '') || ' ' || COALESCE(NEW.summary, '')), 'title')
    ON CONFLICT (mevzuat_id) DO UPDATE SET
        search_vector = to_tsvector('turkish', COALESCE(NEW.title, '') || ' ' || COALESCE(NEW.summary, '')),
        created_at = NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_mevzuat_search ON mevzuat;
CREATE TRIGGER trigger_update_mevzuat_search
    AFTER INSERT OR UPDATE ON mevzuat
    FOR EACH ROW
    EXECUTE FUNCTION update_mevzuat_search_vector();

-- 7. ARAMA FONKSİYONU (EN ÖNEMLİSİ!)
CREATE OR REPLACE FUNCTION search_mevzuat(
    search_query TEXT,
    mevzuat_types TEXT[] DEFAULT NULL,
    category_filter UUID DEFAULT NULL,
    limit_count INTEGER DEFAULT 20
)
RETURNS TABLE (
    mevzuat_id UUID,
    title VARCHAR(500),
    type VARCHAR(50),
    mevzuat_no VARCHAR(20),
    publication_date DATE,
    summary TEXT,
    article_count INTEGER,
    category_title VARCHAR(100),
    rank REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        m.id as mevzuat_id,
        m.title,
        m.type,
        m.mevzuat_no,
        m.publication_date,
        m.summary,
        m.article_count,
        mc.title as category_title,
        COALESCE(ts_rank(msi.search_vector, plainto_tsquery('turkish', search_query)), 0.1) as rank
    FROM mevzuat m
    LEFT JOIN mevzuat_categories mc ON m.category_id = mc.id
    LEFT JOIN mevzuat_search_index msi ON m.id = msi.mevzuat_id
    WHERE 
        m.status = 'ACTIVE'
        AND (
            (msi.search_vector IS NOT NULL AND msi.search_vector @@ plainto_tsquery('turkish', search_query))
            OR m.title ILIKE '%' || search_query || '%'
            OR m.mevzuat_no = search_query
            OR EXISTS (
                SELECT 1 FROM unnest(m.keywords) as keyword 
                WHERE keyword ILIKE '%' || search_query || '%'
            )
        )
        AND (mevzuat_types IS NULL OR m.type = ANY(mevzuat_types))
        AND (category_filter IS NULL OR m.category_id = category_filter)
    ORDER BY 
        CASE 
            WHEN m.mevzuat_no = search_query THEN 1
            WHEN m.title ILIKE search_query || '%' THEN 2
            ELSE COALESCE(ts_rank(msi.search_vector, plainto_tsquery('turkish', search_query)), 0.1)
        END DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- 8. RLS (Row Level Security) POLİCİES
ALTER TABLE mevzuat_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE mevzuat ENABLE ROW LEVEL SECURITY;
ALTER TABLE mevzuat_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE mevzuat_search_index ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read on mevzuat_categories" ON mevzuat_categories;
DROP POLICY IF EXISTS "Allow public read on mevzuat" ON mevzuat;
DROP POLICY IF EXISTS "Allow public read on mevzuat_articles" ON mevzuat_articles;
DROP POLICY IF EXISTS "Allow public read on mevzuat_search_index" ON mevzuat_search_index;

-- Herkese okuma izni
CREATE POLICY "Allow public read on mevzuat_categories" ON mevzuat_categories FOR SELECT USING (true);
CREATE POLICY "Allow public read on mevzuat" ON mevzuat FOR SELECT USING (true);
CREATE POLICY "Allow public read on mevzuat_articles" ON mevzuat_articles FOR SELECT USING (true);
CREATE POLICY "Allow public read on mevzuat_search_index" ON mevzuat_search_index FOR SELECT USING (true);

-- 9. KATEGORİLER (Güvenli şekilde ekle)
DO $$ 
BEGIN
    -- Anayasa Hukuku
    IF NOT EXISTS (SELECT 1 FROM mevzuat_categories WHERE title = 'Anayasa Hukuku') THEN
        INSERT INTO mevzuat_categories (title, description, icon, color) 
        VALUES ('Anayasa Hukuku', 'Temel hak ve özgürlükler, devlet yapısı', '📜', 'bg-red-50 border-red-200');
    END IF;
    
    -- İş Hukuku
    IF NOT EXISTS (SELECT 1 FROM mevzuat_categories WHERE title = 'İş Hukuku') THEN
        INSERT INTO mevzuat_categories (title, description, icon, color) 
        VALUES ('İş Hukuku', 'Çalışma hayatı ve sosyal güvenlik', '👔', 'bg-blue-50 border-blue-200');
    END IF;
    
    -- Ceza Hukuku
    IF NOT EXISTS (SELECT 1 FROM mevzuat_categories WHERE title = 'Ceza Hukuku') THEN
        INSERT INTO mevzuat_categories (title, description, icon, color) 
        VALUES ('Ceza Hukuku', 'Suç ve cezalar, yargılama usulü', '⚖️', 'bg-gray-50 border-gray-200');
    END IF;
    
    -- Medeni Hukuk
    IF NOT EXISTS (SELECT 1 FROM mevzuat_categories WHERE title = 'Medeni Hukuk') THEN
        INSERT INTO mevzuat_categories (title, description, icon, color) 
        VALUES ('Medeni Hukuk', 'Kişi, aile ve miras hukuku', '👨‍👩‍👧‍👦', 'bg-green-50 border-green-200');
    END IF;
    
    -- Vergi Hukuku
    IF NOT EXISTS (SELECT 1 FROM mevzuat_categories WHERE title = 'Vergi Hukuku') THEN
        INSERT INTO mevzuat_categories (title, description, icon, color) 
        VALUES ('Vergi Hukuku', 'Vergi, resim ve harçlar', '💰', 'bg-yellow-50 border-yellow-200');
    END IF;
    
    -- Ticaret Hukuku
    IF NOT EXISTS (SELECT 1 FROM mevzuat_categories WHERE title = 'Ticaret Hukuku') THEN
        INSERT INTO mevzuat_categories (title, description, icon, color) 
        VALUES ('Ticaret Hukuku', 'Ticari faaliyetler ve şirketler', '🏢', 'bg-purple-50 border-purple-200');
    END IF;
    
    -- İdare Hukuku
    IF NOT EXISTS (SELECT 1 FROM mevzuat_categories WHERE title = 'İdare Hukuku') THEN
        INSERT INTO mevzuat_categories (title, description, icon, color) 
        VALUES ('İdare Hukuku', 'Kamu yönetimi ve idari işlemler', '🏛️', 'bg-indigo-50 border-indigo-200');
    END IF;
    
    -- Sağlık Hukuku
    IF NOT EXISTS (SELECT 1 FROM mevzuat_categories WHERE title = 'Sağlık Hukuku') THEN
        INSERT INTO mevzuat_categories (title, description, icon, color) 
        VALUES ('Sağlık Hukuku', 'Sağlık hizmetleri ve tıbbi düzenlemeler', '🏥', 'bg-pink-50 border-pink-200');
    END IF;
    
    -- Eğitim Hukuku
    IF NOT EXISTS (SELECT 1 FROM mevzuat_categories WHERE title = 'Eğitim Hukuku') THEN
        INSERT INTO mevzuat_categories (title, description, icon, color) 
        VALUES ('Eğitim Hukuku', 'Eğitim sistemi ve akademik düzenlemeler', '📚', 'bg-orange-50 border-orange-200');
    END IF;
    
    -- Çevre Hukuku
    IF NOT EXISTS (SELECT 1 FROM mevzuat_categories WHERE title = 'Çevre Hukuku') THEN
        INSERT INTO mevzuat_categories (title, description, icon, color) 
        VALUES ('Çevre Hukuku', 'Çevre koruma ve doğal kaynaklar', '🌱', 'bg-emerald-50 border-emerald-200');
    END IF;
    
    -- Enerji Hukuku
    IF NOT EXISTS (SELECT 1 FROM mevzuat_categories WHERE title = 'Enerji Hukuku') THEN
        INSERT INTO mevzuat_categories (title, description, icon, color) 
        VALUES ('Enerji Hukuku', 'Elektrik, doğalgaz ve yenilenebilir enerji', '⚡', 'bg-amber-50 border-amber-200');
    END IF;
    
    -- Bankacılık Hukuku
    IF NOT EXISTS (SELECT 1 FROM mevzuat_categories WHERE title = 'Bankacılık Hukuku') THEN
        INSERT INTO mevzuat_categories (title, description, icon, color) 
        VALUES ('Bankacılık Hukuku', 'Bankalar, krediler ve finansal işlemler', '🏦', 'bg-slate-50 border-slate-200');
    END IF;
    
END $$;

-- 10. BAŞARILI KURULUM MESAJI
SELECT 'Mevzuat tabloları ve search_mevzuat fonksiyonu başarıyla kuruldu! 🎉' as message; 