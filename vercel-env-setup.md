# Vercel Environment Variables Setup

Vercel deploy sırasında aşağıdaki environment variables'ları eklemeniz gerekiyor:

## 🔧 Required Environment Variables

### 1. REACT_APP_SUPABASE_URL
```
Name: REACT_APP_SUPABASE_URL
Value: YOUR_SUPABASE_PROJECT_URL
Environments: Production, Preview, Development
```

### 2. REACT_APP_SUPABASE_ANON_KEY  
```
Name: REACT_APP_SUPABASE_ANON_KEY
Value: YOUR_SUPABASE_ANON_KEY
Environments: Production, Preview, Development
```

### 3. REACT_APP_GEMINI_API_KEY
```
Name: REACT_APP_GEMINI_API_KEY
Value: YOUR_GEMINI_API_KEY
Environments: Production, Preview, Development
```

### 4. REACT_APP_API_URL (MCP Server)
```
Name: REACT_APP_API_URL
Value: https://your-mcp-server-url.com
Environments: Production, Preview, Development
```

## 📝 Supabase Setup

1. supabase.com'da yeni proje oluşturun
2. SQL Editor'de `supabase-schema.sql` dosyasını çalıştırın
3. Settings > API'den URL ve Anon Key'i alın

## 🤖 Gemini AI Setup

1. aistudio.google.com'da hesap oluşturun
2. API Key oluşturun
3. Türkçe model desteğini aktifleştirin

## 🚀 Deploy Steps

1. Repository'yi Vercel'e import edin
2. Environment variables'ları yukarıdaki gibi ekleyin
3. Deploy butonuna tıklayın
4. Domain'inizi customize edin (opsiyonel)

## ✅ Test Etme

Deploy sonrası:
- Ana sayfa yüklenmelidir
- Kayıt/Giriş çalışmalıdır  
- Arama fonksiyonu test edilmelidir
- AI sohbet özelliği denenmelidir

## 🔍 Sorun Giderme

Eğer uygulama açılmıyorsa:
1. Vercel Functions tab'ından logs kontrol edin
2. Environment variables'lar doğru girilmiş mi kontrol edin
3. Supabase RLS policies'leri aktif mi kontrol edin
4. API endpoints'leri çalışıyor mu test edin

## 📱 Production URL

Deploy sonrası URL'iniz şu formatta olacak:
`https://mevzuat-ai-saas-username.vercel.app`

Bu URL'yi domain provider'ınızdan custom domain'e yönlendirebilirsiniz.