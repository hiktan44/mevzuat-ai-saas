-- Supabase Mevzuat Sample Data
-- Türkiye'nin temel kanunları ve mevzuatları

-- Kategori ID'lerini almak için değişkenler
DO $$
DECLARE
    anayasa_cat_id UUID;
    is_cat_id UUID;
    ceza_cat_id UUID;
    medeni_cat_id UUID;
    vergi_cat_id UUID;
    ticaret_cat_id UUID;
    idare_cat_id UUID;
    saglik_cat_id UUID;
    egitim_cat_id UUID;
    cevre_cat_id UUID;
    enerji_cat_id UUID;
    bankacilik_cat_id UUID;
BEGIN
    -- Kategori ID'lerini al
    SELECT id INTO anayasa_cat_id FROM mevzuat_categories WHERE title = 'Anayasa Hukuku';
    SELECT id INTO is_cat_id FROM mevzuat_categories WHERE title = 'İş Hukuku';
    SELECT id INTO ceza_cat_id FROM mevzuat_categories WHERE title = 'Ceza Hukuku';
    SELECT id INTO medeni_cat_id FROM mevzuat_categories WHERE title = 'Medeni Hukuk';
    SELECT id INTO vergi_cat_id FROM mevzuat_categories WHERE title = 'Vergi Hukuku';
    SELECT id INTO ticaret_cat_id FROM mevzuat_categories WHERE title = 'Ticaret Hukuku';
    SELECT id INTO idare_cat_id FROM mevzuat_categories WHERE title = 'İdare Hukuku';
    SELECT id INTO saglik_cat_id FROM mevzuat_categories WHERE title = 'Sağlık Hukuku';
    SELECT id INTO egitim_cat_id FROM mevzuat_categories WHERE title = 'Eğitim Hukuku';
    SELECT id INTO cevre_cat_id FROM mevzuat_categories WHERE title = 'Çevre Hukuku';
    SELECT id INTO enerji_cat_id FROM mevzuat_categories WHERE title = 'Enerji Hukuku';
    SELECT id INTO bankacilik_cat_id FROM mevzuat_categories WHERE title = 'Bankacılık Hukuku';

    -- ANAYASA HUKUKU
    INSERT INTO mevzuat (mevzuat_no, title, type, category_id, publication_date, gazette_no, status, summary, article_count, keywords) VALUES
    ('2709', 'Türkiye Cumhuriyeti Anayasası', 'KANUN', anayasa_cat_id, '1982-11-09', '17863', 'ACTIVE', 'Türkiye Cumhuriyeti''nin temel kanunu. Devletin yapısını, vatandaşların hak ve ödevlerini düzenler.', 177, ARRAY['anayasa', 'temel hak', 'özgürlük', 'devlet', 'yargı', 'yasama', 'yürütme']),
    ('2820', 'Siyasi Partiler Kanunu', 'KANUN', anayasa_cat_id, '1983-04-24', '18027', 'ACTIVE', 'Siyasi partilerin kuruluşu, faaliyetleri ve denetimine dair düzenlemeler.', 122, ARRAY['siyasi parti', 'demokrasi', 'seçim', 'parti kuruluşu']),
    ('298', 'Seçimlerin Temel Hükümleri ve Seçmen Kütükleri Hakkında Kanun', 'KANUN', anayasa_cat_id, '1961-04-26', '10796', 'ACTIVE', 'Seçimlerin genel usul ve esaslarını düzenleyen temel kanun.', 48, ARRAY['seçim', 'oy verme', 'seçmen', 'demokratik seçim']);

    -- İŞ HUKUKU
    INSERT INTO mevzuat (mevzuat_no, title, type, category_id, publication_date, gazette_no, status, summary, article_count, keywords) VALUES
    ('4857', 'İş Kanunu', 'KANUN', is_cat_id, '2003-06-10', '25134', 'ACTIVE', 'İş ilişkilerinde işçi ve işverenin hak ve yükümlülüklerini düzenleyen temel kanun.', 103, ARRAY['iş sözleşmesi', 'işçi hakları', 'çalışma saatleri', 'izin', 'ücret', 'işten çıkarma']),
    ('6331', 'İş Sağlığı ve Güvenliği Kanunu', 'KANUN', is_cat_id, '2012-06-30', '28339', 'ACTIVE', 'İşyerlerinde iş sağlığı ve güvenliği önlemlerini düzenleyen kanun.', 30, ARRAY['iş güvenliği', 'sağlık', 'işyeri', 'risk', 'koruyucu ekipman']),
    ('5510', 'Sosyal Sigortalar ve Genel Sağlık Sigortası Kanunu', 'KANUN', is_cat_id, '2006-06-16', '26200', 'ACTIVE', 'Sosyal güvenlik sistemini düzenleyen temel kanun.', 108, ARRAY['sosyal güvenlik', 'emeklilik', 'sağlık sigortası', 'SGK', 'prim']);

    -- CEZA HUKUKU
    INSERT INTO mevzuat (mevzuat_no, title, type, category_id, publication_date, gazette_no, status, summary, article_count, keywords) VALUES
    ('5237', 'Türk Ceza Kanunu', 'KANUN', ceza_cat_id, '2004-09-26', '25611', 'ACTIVE', 'Türkiye''de suç ve cezaları düzenleyen temel hukuki metin.', 345, ARRAY['suç', 'ceza', 'hapis', 'para cezası', 'suç unsuru', 'ceza sorumluluğu']),
    ('5271', 'Ceza Muhakemesi Kanunu', 'KANUN', ceza_cat_id, '2004-12-17', '25673', 'ACTIVE', 'Ceza davalarının yürütülmesine ilişkin usul ve esasları düzenler.', 308, ARRAY['dava', 'savcı', 'hakim', 'sanık', 'delil', 'yargılama']),
    ('5275', 'Ceza ve Güvenlik Tedbirlerinin İnfazı Hakkında Kanun', 'KANUN', ceza_cat_id, '2004-12-29', '25685', 'ACTIVE', 'Hapis cezalarının ve güvenlik tedbirlerinin infazını düzenler.', 117, ARRAY['ceza infazı', 'hapishane', 'denetimli serbestlik', 'koşullu salıverme']);

    -- MEDENİ HUKUK
    INSERT INTO mevzuat (mevzuat_no, title, type, category_id, publication_date, gazette_no, status, summary, article_count, keywords) VALUES
    ('4721', 'Türk Medeni Kanunu', 'KANUN', medeni_cat_id, '2001-11-22', '24607', 'ACTIVE', 'Kişilik hakları, aile hukuku, miras hukuku ve eşya hukukunu düzenler.', 1030, ARRAY['medeni hukuk', 'kişilik hakları', 'aile', 'evlilik', 'miras', 'mülkiyet']),
    ('6098', 'Türk Borçlar Kanunu', 'KANUN', medeni_cat_id, '2011-01-11', '27836', 'ACTIVE', 'Sözleşmeler ve borç ilişkilerini düzenleyen temel kanun.', 647, ARRAY['sözleşme', 'borç', 'tazminat', 'satış', 'kira', 'haksız fiil']),
    ('2644', 'Tapu Kanunu', 'KANUN', medeni_cat_id, '1934-12-22', '2892', 'ACTIVE', 'Tapu sicili ve gayrimenkul işlemlerini düzenler.', 57, ARRAY['tapu', 'gayrimenkul', 'mülkiyet', 'tapulama', 'sicil']);

    -- VERGİ HUKUKU
    INSERT INTO mevzuat (mevzuat_no, title, type, category_id, publication_date, gazette_no, status, summary, article_count, keywords) VALUES
    ('213', 'Vergi Usul Kanunu', 'KANUN', vergi_cat_id, '1961-01-04', '10703', 'ACTIVE', 'Vergi mükelleflerinin ödev ve hakları ile vergi idaresinin yetkilerini düzenler.', 521, ARRAY['vergi', 'mükellefiyet', 'beyanname', 'vergi dairesi', 'ceza']),
    ('193', 'Gelir Vergisi Kanunu', 'KANUN', vergi_cat_id, '1960-12-31', '10700', 'ACTIVE', 'Gelir vergisinin mükellefi, konusu, hesaplanması ve ödenmesini düzenler.', 103, ARRAY['gelir vergisi', 'ücret', 'ticari kazanç', 'stopaj', 'vergi dilimi']),
    ('3065', 'Katma Değer Vergisi Kanunu', 'KANUN', vergi_cat_id, '1984-10-25', '18563', 'ACTIVE', 'Mal ve hizmet teslimleri üzerinden alınan katma değer vergisini düzenler.', 46, ARRAY['kdv', 'katma değer vergisi', 'mal', 'hizmet', 'iade']);

    -- TİCARET HUKUKU
    INSERT INTO mevzuat (mevzuat_no, title, type, category_id, publication_date, gazette_no, status, summary, article_count, keywords) VALUES
    ('6102', 'Türk Ticaret Kanunu', 'KANUN', ticaret_cat_id, '2011-01-13', '27846', 'ACTIVE', 'Ticari işletme ve şirketlerin kuruluş, işleyiş ve sona ermelerini düzenler.', 1535, ARRAY['ticaret', 'şirket', 'anonim şirket', 'limited şirket', 'ticari defter']),
    ('4054', 'Rekabetin Korunması Hakkında Kanun', 'KANUN', ticaret_cat_id, '1994-12-07', '22140', 'ACTIVE', 'Piyasada rekabeti koruma ve teşvik etmeye yönelik düzenlemeler.', 26, ARRAY['rekabet', 'tekel', 'kartel', 'birleşme', 'piyasa']),
    ('6563', 'Elektronik Ticaretin Düzenlenmesi Hakkında Kanun', 'KANUN', ticaret_cat_id, '2014-11-05', '29166', 'ACTIVE', 'Elektronik ortamda yapılan ticari faaliyetleri düzenler.', 20, ARRAY['elektronik ticaret', 'internet', 'e-ticaret', 'online alışveriş']);

    -- EGİTİM HUKUKU
    INSERT INTO mevzuat (mevzuat_no, title, type, category_id, publication_date, gazette_no, status, summary, article_count, keywords) VALUES
    ('1739', 'Milli Eğitim Temel Kanunu', 'KANUN', egitim_cat_id, '1973-06-14', '14574', 'ACTIVE', 'Türk milli eğitim sisteminin genel amaç ve ilkelerini belirler.', 56, ARRAY['milli eğitim', 'okul', 'öğretmen', 'müfredat', 'eğitim sistemi']),
    ('2547', 'Yükseköğretim Kanunu', 'KANUN', egitim_cat_id, '1981-11-04', '17506', 'ACTIVE', 'Üniversiteler ve yükseköğretim kurumlarının organizasyonunu düzenler.', 80, ARRAY['üniversite', 'yüksek öğretim', 'akademisyen', 'öğrenci', 'YÖK']);

    -- ENERJI HUKUKU
    INSERT INTO mevzuat (mevzuat_no, title, type, category_id, publication_date, gazette_no, status, summary, article_count, keywords) VALUES
    ('4628', 'Elektrik Piyasası Kanunu', 'KANUN', enerji_cat_id, '2001-02-20', '24335', 'ACTIVE', 'Elektrik enerjisinin üretim, iletim, dağıtım ve ticaretini düzenler.', 20, ARRAY['elektrik', 'enerji', 'elektrik piyasası', 'EPDK']),
    ('4646', 'Doğalgaz Piyasası Kanunu', 'KANUN', enerji_cat_id, '2001-04-18', '24390', 'ACTIVE', 'Doğalgaz piyasasında faaliyetleri düzenleyen kanun.', 28, ARRAY['doğalgaz', 'gaz', 'enerji', 'boru hattı']);

    RAISE NOTICE 'Sample mevzuat data başarıyla eklendi! 📚';
END $$;

-- Mevzuat sayısını kontrol et
SELECT 
    mc.title as kategori,
    COUNT(m.id) as mevzuat_sayisi
FROM mevzuat_categories mc
LEFT JOIN mevzuat m ON mc.id = m.category_id
GROUP BY mc.title
ORDER BY COUNT(m.id) DESC; 