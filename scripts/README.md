# 🚀 Mevzuat Güncelleme Scripti

Bu script mevzuat.gov.tr'den güncel mevzuat verilerini çekerek Supabase veritabanınıza aktarır.

## 📋 Kurulum

### 1. Gerekli Kütüphaneleri Yükle
```bash
cd scripts
pip3 install -r requirements.txt
```

### 2. Environment Variables Ayarla
```bash
# .env dosyası oluştur
echo "SUPABASE_URL=https://yhtnhgqeojlafjadfdxx.supabase.co" > .env
echo "SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." >> .env
```

### 3. Scripti Çalıştır
```bash
python3 update-mevzuat.py
```

## ⚡ Hızlı Test

### Manuel Çalıştırma (Son 30 gün)
```bash
python3 update-mevzuat.py
```

### Belirli Günleri Test Et
```python
# Script içinde bu satırı değiştir:
updater.update_database(days=7)  # Son 7 gün
```

## 🔄 Otomatik Güncelleme

### 1. Günlük Otomatik Çalıştırma (macOS/Linux)
```bash
# Crontab düzenle
crontab -e

# Her gün saat 06:00'da çalıştır
0 6 * * * cd /Users/hikmettanriverdi/mevzuat/scripts && python3 update-mevzuat.py >> mevzuat-update.log 2>&1
```

### 2. Systemd Service (Linux)
```bash
# /etc/systemd/system/mevzuat-updater.service
[Unit]
Description=Mevzuat Database Updater
After=network.target

[Service]
Type=oneshot
ExecStart=/usr/bin/python3 /path/to/scripts/update-mevzuat.py
WorkingDirectory=/path/to/scripts

[Install]
WantedBy=multi-user.target
```

## 📊 Script Özellikleri

### ✅ Yapabilecekleri
- Son X günün yeni mevzuatlarını otomatik çeker
- Mevzuat detaylarını (başlık, tür, tarih) alır  
- Tüm maddeleri içerik ile birlikte kaydeder
- Kategori bazında otomatik sınıflandırma
- Duplicate kontrolü (aynı mevzuatı 2 kez eklemez)
- Hata durumunda loglama
- Rate limiting (1 saniye bekleyerek)

### 🎯 Desteklenen Mevzuat Türleri
- Kanunlar
- Yönetmelikler
- Cumhurbaşkanlığı Kararnameleri
- Tebliğler
- Genelgeler
- Yönergeler

### 📂 Otomatik Kategoriler
- Anayasa Hukuku
- İş Hukuku  
- Ceza Hukuku
- Medeni Hukuk
- Vergi Hukuku
- Ticaret Hukuku
- İdare Hukuku
- Sağlık Hukuku
- Eğitim Hukuku
- Çevre Hukuku
- Enerji Hukuku
- Bankacılık Hukuku

## 🔧 Gelişmiş Kullanım

### Sadece Belirli Türdeki Mevzuatları Al
```python
# Script içinde filtreleme ekle
if mevzuat.get('turu') not in ['KANUN', 'YONETMELIK']:
    continue
```

### Belirli Kategorileri Hariç Tut
```python
# İstenmeyen kategorileri atla
exclude_categories = ['Çevre Hukuku', 'Enerji Hukuku']
if category_name in exclude_categories:
    continue
```

### Bulk Import (Tüm Mevzuatı Al)
```python
# Büyük veri seti için (dikkatli kullan!)
updater.update_database(days=365*10)  # Son 10 yıl
```

## 📈 Performans İpuçları

### 🚀 Hızlandırma
- `days` parametresini küçük tut (7-30)
- Rate limiting'i artır: `time.sleep(0.5)`
- Sadece gerekli alanları çek

### 🛡️ Güvenlik
- IP banned olmamak için rate limiting kullan
- User-Agent header'ını güncelle
- Error handling ile robust yap

## 🆘 Sorun Giderme

### "API Hatası" Alıyorum
```
❌ API Hatası: 403
```
**Çözüm**: User-Agent header'ını güncelleyin, rate limiting ekleyin.

### "Supabase bağlantı hatası"
```
❌ Supabase error: Invalid API key
```
**Çözüm**: `.env` dosyasındaki SUPABASE_URL ve SUPABASE_ANON_KEY değerlerini kontrol edin.

### "Kategori bulunamadı"
```
❌ Kategori ID'si bulunamadı
```
**Çözüm**: Önce `supabase-mevzuat-schema.sql`'i çalıştırıp kategorileri oluşturun.

## 📋 Log Kontrolü

### Script Çıktısı
```
🔄 MEVZUAT GÜNCELLEME ARACΙ
========================================
📅 Son 30 günün mevzuatları alınıyor...
✅ 15 yeni mevzuat bulundu
✅ Mevzuat kaydedildi: Elektrik Piyasası Yönetmeliği
✅ 25 madde kaydedildi
⚠️ Zaten mevcut: İş Kanunu
🎉 Güncelleme tamamlandı! 8 yeni mevzuat eklendi
```

### Hata Logları
```
❌ Bağlantı hatası: Connection timeout
❌ Detay hatası: Invalid mevzuat ID
❌ Kaydetme hatası: Duplicate key value
```

## 🔮 Gelecek Özellikler

- [ ] Webhook entegrasyonu (yeni mevzuat bildirimi)
- [ ] Email notifications (admin'e günlük rapor)
- [ ] Delta updates (sadece değişen maddeleri güncelle)
- [ ] Multi-threading (paralel veri çekme)
- [ ] Web UI (script'i web'den çalıştırma)
- [ ] Backup/restore (veri yedekleme)

**🎯 Hazır! Script şimdi çalışır durumda.** 