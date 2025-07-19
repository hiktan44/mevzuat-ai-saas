-- Mevzuat AI - Supabase Database Schema
-- Bu dosyayı Supabase SQL Editor'de çalıştırın

-- 1. Profil Tablosu (auth.users ile bağlantılı)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  daily_search_count INT DEFAULT 0,
  daily_ai_count INT DEFAULT 0,
  last_reset_date DATE DEFAULT CURRENT_DATE
);

-- 2. Arama Geçmişi Tablosu
CREATE TABLE search_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  query TEXT NOT NULL,
  mevzuat_types TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);

-- 3. AI Konuşmaları Tablosu
CREATE TABLE ai_conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  mevzuat_name TEXT,
  madde_no TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 4. AI Mesajları Tablosu
CREATE TABLE ai_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES ai_conversations(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 5. Favoriler Tablosu
CREATE TABLE favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  mevzuat_id TEXT NOT NULL,
  mevzuat_name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, mevzuat_id)
);

-- 6. İndeksler (Performans için)
CREATE INDEX idx_search_history_user_id ON search_history(user_id);
CREATE INDEX idx_search_history_created_at ON search_history(created_at DESC);
CREATE INDEX idx_ai_conversations_user_id ON ai_conversations(user_id);
CREATE INDEX idx_ai_conversations_created_at ON ai_conversations(created_at DESC);
CREATE INDEX idx_ai_messages_conversation_id ON ai_messages(conversation_id);
CREATE INDEX idx_ai_messages_created_at ON ai_messages(created_at);
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_created_at ON favorites(created_at DESC);

-- 7. Row Level Security (RLS) Aktivasyonu
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- 8. RLS Politikaları

-- Profiles
CREATE POLICY "Users can view and update own profile" ON profiles
  FOR ALL USING (auth.uid() = id);

-- Search History
CREATE POLICY "Users can manage own search history" ON search_history
  FOR ALL USING (auth.uid() = user_id);

-- AI Conversations
CREATE POLICY "Users can manage own conversations" ON ai_conversations
  FOR ALL USING (auth.uid() = user_id);

-- AI Messages
CREATE POLICY "Users can manage own messages" ON ai_messages
  FOR ALL USING (auth.uid() IN (
    SELECT user_id FROM ai_conversations WHERE id = conversation_id
  ));

-- Favorites
CREATE POLICY "Users can manage own favorites" ON favorites
  FOR ALL USING (auth.uid() = user_id);

-- 9. Fonksiyonlar

-- Günlük sayaçları sıfırlama fonksiyonu
CREATE OR REPLACE FUNCTION reset_daily_counts()
RETURNS void AS $$
BEGIN
  UPDATE profiles 
  SET 
    daily_search_count = 0,
    daily_ai_count = 0,
    last_reset_date = CURRENT_DATE
  WHERE last_reset_date < CURRENT_DATE;
END;
$$ LANGUAGE plpgsql;

-- Arama sayacını artırma fonksiyonu
CREATE OR REPLACE FUNCTION increment_search_count(user_id UUID)
RETURNS void AS $$
BEGIN
  -- Önce günlük sayaçları kontrol et
  PERFORM reset_daily_counts();
  
  -- Sayacı artır
  UPDATE profiles 
  SET daily_search_count = daily_search_count + 1
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql;

-- AI sayacını artırma fonksiyonu
CREATE OR REPLACE FUNCTION increment_ai_count(user_id UUID)
RETURNS void AS $$
BEGIN
  -- Önce günlük sayaçları kontrol et
  PERFORM reset_daily_counts();
  
  -- Sayacı artır
  UPDATE profiles 
  SET daily_ai_count = daily_ai_count + 1
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql;

-- 10. Trigger'lar

-- Yeni kullanıcı kaydında profil oluşturma
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger oluşturma
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 11. İstatistikler için view'lar

-- Kullanıcı istatistikleri
CREATE OR REPLACE VIEW user_stats AS
SELECT 
  p.id,
  p.full_name,
  p.email,
  p.daily_search_count,
  p.daily_ai_count,
  COUNT(DISTINCT sh.id) as total_searches,
  COUNT(DISTINCT ac.id) as total_conversations,
  COUNT(DISTINCT f.id) as total_favorites,
  p.created_at as joined_date
FROM profiles p
LEFT JOIN search_history sh ON p.id = sh.user_id
LEFT JOIN ai_conversations ac ON p.id = ac.user_id
LEFT JOIN favorites f ON p.id = f.user_id
GROUP BY p.id, p.full_name, p.email, p.daily_search_count, p.daily_ai_count, p.created_at;

-- Günlük reset için cron job (Supabase cron extension gerekli)
-- SELECT cron.schedule('reset-daily-counts', '0 0 * * *', 'SELECT reset_daily_counts();');

-- 12. Test Verisi (Opsiyonel - Development için)
/*
-- Test profili oluşturma (sadece development için)
INSERT INTO profiles (id, email, full_name, daily_search_count, daily_ai_count)
VALUES (
  'test-user-id',
  'test@example.com',
  'Test Kullanıcısı',
  5,
  2
) ON CONFLICT (id) DO NOTHING;

-- Test arama geçmişi
INSERT INTO search_history (user_id, query, mevzuat_types)
VALUES 
  ('test-user-id', 'İş Kanunu', ARRAY['KANUN']),
  ('test-user-id', 'Türk Ceza Kanunu', ARRAY['KANUN']),
  ('test-user-id', 'Vergi', ARRAY['KANUN', 'YONETMELIK']);

-- Test favoriler
INSERT INTO favorites (user_id, mevzuat_id, mevzuat_name)
VALUES 
  ('test-user-id', '4857', 'İş Kanunu'),
  ('test-user-id', '5237', 'Türk Ceza Kanunu');
*/

-- Schema oluşturma tamamlandı!
-- Artık React uygulaması bu veritabanını kullanabilir.