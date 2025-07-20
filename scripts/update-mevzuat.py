#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Mevzuat Güncelleme Scripti
mevzuat.gov.tr'den güncel verileri çeker ve Supabase'e yükler
"""

import requests
import json
import time
from datetime import datetime, timedelta
from bs4 import BeautifulSoup
from supabase import create_client, Client
import os
from typing import Dict, List, Optional
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class MevzuatUpdater:
    def __init__(self):
        # Supabase bağlantısı
        self.supabase_url = os.getenv('SUPABASE_URL')
        self.supabase_key = os.getenv('SUPABASE_ANON_KEY')
        self.supabase: Client = create_client(self.supabase_url, self.supabase_key)
        
        # mevzuat.gov.tr API endpoints
        self.base_url = "https://www.mevzuat.gov.tr"
        self.api_endpoints = {
            'search': '/MevzuatMetin/1.0.1/MevzuatListe',
            'detail': '/MevzuatMetin/1.0.1/MevzuatDetay',
            'articles': '/MevzuatMetin/1.0.1/MevzuatMaddeleri'
        }
        
        # Headers (real browser simulation)
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'application/json, text/plain, */*',
            'Accept-Language': 'tr-TR,tr;q=0.9,en;q=0.8',
            'Content-Type': 'application/json;charset=UTF-8',
            'Referer': 'https://www.mevzuat.gov.tr'
        }

    def get_recent_publications(self, days: int = 7) -> List[Dict]:
        """Son X günde yayımlanan mevzuatları getirir"""
        print(f"📅 Son {days} günün mevzuatları alınıyor...")
        
        end_date = datetime.now()
        start_date = end_date - timedelta(days=days)
        
        payload = {
            "baslangicTarihi": start_date.strftime("%Y-%m-%d"),
            "bitisTarihi": end_date.strftime("%Y-%m-%d"),
            "mevzuatTuru": "",  # Tüm türler
            "sayfaNo": 1,
            "kayitSayisi": 100
        }
        
        try:
            response = requests.post(
                f"{self.base_url}{self.api_endpoints['search']}", 
                json=payload, 
                headers=self.headers,
                timeout=30
            )
            
            if response.status_code == 200:
                print(f"📡 API Response alındı. İçerik (ilk 200 karakter): {response.text[:200]}")
                try:
                    data = response.json()
                    print(f"✅ {len(data.get('data', []))} yeni mevzuat bulundu")
                    return data.get('data', [])
                except json.JSONDecodeError as e:
                    print(f"❌ JSON Parse Hatası: {e}")
                    print(f"🔍 Tam response: {response.text}")
                    return []
            else:
                print(f"❌ API Hatası: {response.status_code}")
                print(f"🔍 Response: {response.text}")
                return []
                
        except Exception as e:
            print(f"❌ Bağlantı hatası: {str(e)}")
            return []

    def get_mevzuat_details(self, mevzuat_id: str) -> Optional[Dict]:
        """Mevzuat detaylarını getirir"""
        payload = {"mevzuatId": mevzuat_id}
        
        try:
            response = requests.post(
                f"{self.base_url}{self.api_endpoints['detail']}", 
                json=payload, 
                headers=self.headers,
                timeout=30
            )
            
            if response.status_code == 200:
                return response.json()
            return None
            
        except Exception as e:
            print(f"❌ Detay hatası: {str(e)}")
            return None

    def get_mevzuat_articles(self, mevzuat_id: str) -> List[Dict]:
        """Mevzuat maddelerini getirir"""
        payload = {"mevzuatId": mevzuat_id}
        
        try:
            response = requests.post(
                f"{self.base_url}{self.api_endpoints['articles']}", 
                json=payload, 
                headers=self.headers,
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                return data.get('data', [])
            return []
            
        except Exception as e:
            print(f"❌ Madde hatası: {str(e)}")
            return []

    def categorize_mevzuat(self, title: str, type_name: str) -> str:
        """Mevzuatı kategoriye göre sınıflandırır"""
        title_lower = title.lower()
        type_lower = type_name.lower()
        
        # Kategori eşleştirme kuralları
        if any(word in title_lower for word in ['anayasa', 'seçim', 'parti']):
            return 'Anayasa Hukuku'
        elif any(word in title_lower for word in ['iş', 'çalışma', 'sosyal güvenlik', 'sgk']):
            return 'İş Hukuku'
        elif any(word in title_lower for word in ['ceza', 'suç', 'mahkeme']):
            return 'Ceza Hukuku'
        elif any(word in title_lower for word in ['medeni', 'aile', 'evlilik', 'miras']):
            return 'Medeni Hukuk'
        elif any(word in title_lower for word in ['vergi', 'gelir', 'kdv', 'stopaj']):
            return 'Vergi Hukuku'
        elif any(word in title_lower for word in ['ticaret', 'şirket', 'rekabet']):
            return 'Ticaret Hukuku'
        elif any(word in title_lower for word in ['sağlık', 'tıp', 'hastane']):
            return 'Sağlık Hukuku'
        elif any(word in title_lower for word in ['eğitim', 'okul', 'üniversite']):
            return 'Eğitim Hukuku'
        elif any(word in title_lower for word in ['çevre', 'orman', 'su']):
            return 'Çevre Hukuku'
        elif any(word in title_lower for word in ['enerji', 'elektrik', 'doğalgaz']):
            return 'Enerji Hukuku'
        elif any(word in title_lower for word in ['banka', 'kredi', 'finansal']):
            return 'Bankacılık Hukuku'
        else:
            return 'İdare Hukuku'  # Default

    def save_to_supabase(self, mevzuat_data: Dict, articles: List[Dict] = None):
        """Mevzuatı Supabase'e kaydeder"""
        try:
            # Kategori ID'sini bul
            category_name = self.categorize_mevzuat(
                mevzuat_data.get('adi', ''), 
                mevzuat_data.get('turu', '')
            )
            
            # Kategori ID'sini al
            category_result = self.supabase.table('mevzuat_categories').select('id').eq('title', category_name).single().execute()
            category_id = category_result.data['id'] if category_result.data else None
            
            # Mevzuat verisini hazırla
            mevzuat_insert = {
                'mevzuat_no': mevzuat_data.get('no'),
                'title': mevzuat_data.get('adi'),
                'type': mevzuat_data.get('turu'),
                'category_id': category_id,
                'publication_date': mevzuat_data.get('yayimTarihi'),
                'gazette_no': mevzuat_data.get('resmigNo'),
                'gazette_date': mevzuat_data.get('resmigTarihi'),
                'summary': mevzuat_data.get('ozet'),
                'full_text': mevzuat_data.get('metnin_tamami'),
                'article_count': len(articles) if articles else 0,
                'url': f"https://www.mevzuat.gov.tr/mevzuat?MevzuatNo={mevzuat_data.get('no')}",
                'keywords': self.extract_keywords(mevzuat_data.get('adi', ''))
            }
            
            # Mevzuatı ekle
            result = self.supabase.table('mevzuat').insert(mevzuat_insert).execute()
            mevzuat_id = result.data[0]['id']
            
            print(f"✅ Mevzuat kaydedildi: {mevzuat_data.get('adi')}")
            
            # Maddeleri ekle
            if articles:
                self.save_articles(mevzuat_id, articles)
                
            return mevzuat_id
            
        except Exception as e:
            print(f"❌ Kaydetme hatası: {str(e)}")
            return None

    def save_articles(self, mevzuat_id: str, articles: List[Dict]):
        """Mevzuat maddelerini kaydeder"""
        try:
            article_inserts = []
            for i, article in enumerate(articles):
                article_insert = {
                    'mevzuat_id': mevzuat_id,
                    'article_no': article.get('maddeNo', str(i+1)),
                    'title': article.get('baslik'),
                    'content': article.get('metin'),
                    'html_content': article.get('htmlMetin'),
                    'article_order': i + 1
                }
                article_inserts.append(article_insert)
            
            if article_inserts:
                self.supabase.table('mevzuat_articles').insert(article_inserts).execute()
                print(f"✅ {len(article_inserts)} madde kaydedildi")
                
        except Exception as e:
            print(f"❌ Madde kaydetme hatası: {str(e)}")

    def extract_keywords(self, title: str) -> List[str]:
        """Başlıktan anahtar kelimeler çıkarır"""
        stop_words = {'ve', 'ile', 'hakkında', 'dair', 'kanunu', 'kanun', 'yönetmelik', 'tebliğ'}
        words = title.lower().split()
        keywords = [word for word in words if len(word) > 2 and word not in stop_words]
        return keywords[:10]  # Max 10 anahtar kelime

    def update_database(self, days: int = 7):
        """Veritabanını günceller"""
        print("🚀 Mevzuat güncelleme başlatıldı...")
        
        # Son X günün mevzuatlarını al
        recent_mevzuat = self.get_recent_publications(days)
        
        if not recent_mevzuat:
            print("📭 Yeni mevzuat bulunamadı")
            return
        
        updated_count = 0
        
        for mevzuat in recent_mevzuat:
            try:
                # Zaten var mı kontrol et
                existing = self.supabase.table('mevzuat').select('id').eq('mevzuat_no', mevzuat.get('no')).execute()
                
                if existing.data:
                    print(f"⚠️ Zaten mevcut: {mevzuat.get('adi')}")
                    continue
                
                # Detayları al
                details = self.get_mevzuat_details(mevzuat.get('id'))
                if details:
                    mevzuat.update(details)
                
                # Maddeleri al
                articles = self.get_mevzuat_articles(mevzuat.get('id'))
                
                # Kaydet
                if self.save_to_supabase(mevzuat, articles):
                    updated_count += 1
                
                # Rate limiting
                time.sleep(1)
                
            except Exception as e:
                print(f"❌ İşlem hatası: {str(e)}")
                continue
        
        print(f"🎉 Güncelleme tamamlandı! {updated_count} yeni mevzuat eklendi")

def main():
    """Ana fonksiyon"""
    print("🔄 MEVZUAT GÜNCELLEME ARACΙ")
    print("=" * 40)
    
    updater = MevzuatUpdater()
    
    # Son 7 günün mevzuatlarını al (ilk test)
    updater.update_database(days=7)

if __name__ == "__main__":
    main() 