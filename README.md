# Mevzuat AI - Türkiye Mevzuatı SaaS Uygulaması

Türkiye mevzuatını daha anlaşılır hale getiren AI destekli SaaS platformu.

## 🚀 Özellikler

- **AI Destekli Arama**: Mevzuat metinlerinde gelişmiş arama
- **Akıllı Asistan**: Hukuki metinleri anlamanızı kolaylaştıran AI
- **Kapsamlı Veritabanı**: Kanunlar, yönetmelikler, tebliğler
- **Kişiselleştirme**: Favoriler ve arama geçmişi
- **Modern Arayüz**: Responsive ve kullanıcı dostu tasarım

## 🛠 Teknolojiler

- **Frontend**: React 18, Tailwind CSS
- **Backend**: Supabase (Auth + Database)
- **AI**: Gemini API
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Router**: React Router v6

## 📋 Kurulum

### 1. Gereklilikler

- Node.js 16+ 
- npm veya yarn
- Supabase hesabı
- Gemini API anahtarı

### 2. Proje Kurulumu

```bash
# Bağımlılıkları yükle
npm install

# Çevresel değişkenleri yapılandır
cp .env.example .env
```

### 3. Çevresel Değişkenler

`.env` dosyasını düzenleyin:

```env
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
REACT_APP_GEMINI_API_KEY=your_gemini_api_key
```

### 4. Supabase Veritabanı Kurulumu

Supabase SQL Editor'de aşağıdaki SQL kodunu çalıştırın:

```sql
-- Profil tablosu
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  daily_search_count INT DEFAULT 0,
  daily_ai_count INT DEFAULT 0,
  last_reset_date DATE DEFAULT CURRENT_DATE
);

-- Arama geçmişi
CREATE TABLE search_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  query TEXT,
  mevzuat_types TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);

-- AI konuşmaları
CREATE TABLE ai_conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  mevzuat_name TEXT,
  madde_no TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- AI mesajları
CREATE TABLE ai_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES ai_conversations(id),
  role TEXT, -- 'user' veya 'assistant'
  content TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Favoriler
CREATE TABLE favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  mevzuat_id TEXT,
  mevzuat_name TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Row Level Security aktifleştir
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- RLS Politikaları
CREATE POLICY "Users can view own data" ON profiles
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users can view own search history" ON search_history
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own conversations" ON ai_conversations
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own messages" ON ai_messages
  FOR ALL USING (auth.uid() IN (
    SELECT user_id FROM ai_conversations WHERE id = conversation_id
  ));

CREATE POLICY "Users can view own favorites" ON favorites
  FOR ALL USING (auth.uid() = user_id);
```

### 5. Uygulamayı Başlatma

```bash
npm start
```

Uygulama `http://localhost:3000` adresinde çalışacaktır.

## 📱 Kullanım

### Hesap Oluşturma
1. Ana sayfada "Üye Ol" butonuna tıklayın
2. Gerekli bilgileri doldurun
3. E-posta doğrulaması yapın

### Mevzuat Arama
1. Dashboard'da arama kutusunu kullanın
2. Filtreleri ayarlayın (Kanun, Yönetmelik, vb.)
3. Sonuçları inceleyin

### AI Asistan
1. Arama sonuçlarında "AI'ya Sor" butonunu kullanın
2. Mevzuat hakkında sorular sorun
3. Sohbet geçmişinizi görüntüleyin

## 🏗 Proje Yapısı

```
src/
├── components/          # React bileşenleri
│   ├── Sidebar.js      # Sol menü
│   ├── SearchPage.js   # Arama sayfası
│   ├── ChatsPage.js    # AI sohbetler
│   └── ...
├── pages/              # Ana sayfalar
│   ├── LandingPage.js  # Giriş sayfası
│   ├── LoginPage.js    # Giriş formu
│   └── Dashboard.js    # Kullanıcı paneli
├── utils/              # Yardımcı fonksiyonlar
│   └── supabase.js     # Supabase yapılandırması
└── hooks/              # Custom hook'lar
```

## 🎨 Tasarım Sistemi

### Renkler
- **Primary**: Mavi tonları (#3B82F6)
- **Secondary**: Gri tonları
- **Success**: Yeşil (#10B981)
- **Error**: Kırmızı (#EF4444)

### Typography
- **Font**: Inter
- **Sizes**: text-sm, text-base, text-lg, text-xl, text-2xl, text-3xl

## 🔐 Güvenlik

- Row Level Security (RLS) ile veri koruması
- E-posta doğrulama
- Şifreli veri saklama
- HTTPS iletişim

## 📊 Limitler

### Ücretsiz Plan
- 50 günlük arama
- 20 günlük AI sorgusu
- Temel özellikler

## 🚀 Deployment

### Vercel Deployment

```bash
# Vercel CLI yükle
npm i -g vercel

# Deploy et
vercel

# Çevresel değişkenleri ekle
vercel env add REACT_APP_SUPABASE_URL
vercel env add REACT_APP_SUPABASE_ANON_KEY
vercel env add REACT_APP_GEMINI_API_KEY
```

### Netlify Deployment

1. GitHub'a push yapın
2. Netlify'da repository'yi bağlayın
3. Environment variables ekleyin
4. Deploy edin

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add some amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📞 İletişim

- **E-posta**: info@mevzuatai.com
- **Website**: https://mevzuatai.com

## 🙏 Teşekkürler

- Supabase ekibine
- Google Gemini AI'ya
- React ve Tailwind CSS topluluklarına

---

**Mevzuat AI** - Türkiye mevzuatını daha anlaşılır hale getiriyoruz 🇹🇷