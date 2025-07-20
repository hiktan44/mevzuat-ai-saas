#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Mevzuat MCP ile Güncelleme Scripti
MCP sunucusu kullanarak mevzuat.gov.tr'den veri çeker ve Supabase'e yükler
"""

import os
import json
import time
from datetime import datetime, timedelta
from typing import Dict, List, Optional
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables
load_dotenv()

class MevzuatMCPUpdater:
    def __init__(self):
        # Supabase bağlantısı
        self.supabase_url = os.getenv('SUPABASE_URL')
        self.supabase_key = os.getenv('SUPABASE_ANON_KEY')
        self.supabase: Client = create_client(self.supabase_url, self.supabase_key)
        
        print(f"🔄 Supabase bağlantısı kuruldu: {self.supabase_url}")

    def categorize_mevzuat(self, title: str, type_name: str) -> str:
        """Mevzuatı kategoriye göre sınıflandırır"""
        title_lower = title.lower()
        
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

    def save_to_supabase(self, mevzuat_data: Dict) -> Optional[str]:
        """Mevzuatı Supabase'e kaydeder"""
        try:
            # Kategori ID'sini bul
            category_name = self.categorize_mevzuat(
                mevzuat_data.get('title', ''), 
                mevzuat_data.get('type', '')
            )
            
            # Kategori ID'sini al
            try:
                category_result = self.supabase.table('mevzuat_categories').select('id').eq('title', category_name).single().execute()
                category_id = category_result.data['id'] if category_result.data else None
            except:
                category_id = None
                print(f"⚠️ Kategori bulunamadı: {category_name}")
            
            # Mevzuat verisini hazırla
            mevzuat_insert = {
                'mevzuat_no': mevzuat_data.get('number'),
                'title': mevzuat_data.get('title'),
                'type': mevzuat_data.get('type'),
                'category_id': category_id,
                'publication_date': mevzuat_data.get('publication_date'),
                'gazette_no': mevzuat_data.get('gazette_no'),
                'gazette_date': mevzuat_data.get('gazette_date'),
                'summary': mevzuat_data.get('summary'),
                'full_text': mevzuat_data.get('full_text'),
                'article_count': mevzuat_data.get('article_count', 0),
                'url': mevzuat_data.get('url'),
                'keywords': self.extract_keywords(mevzuat_data.get('title', ''))
            }
            
            # Mevzuatı ekle
            result = self.supabase.table('mevzuat').insert(mevzuat_insert).execute()
            mevzuat_id = result.data[0]['id']
            
            print(f"✅ Mevzuat kaydedildi: {mevzuat_data.get('title')}")
            
            # Eğer maddeler varsa kaydet
            if 'articles' in mevzuat_data and mevzuat_data['articles']:
                self.save_articles(mevzuat_id, mevzuat_data['articles'])
                
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
                    'article_no': article.get('number', str(i+1)),
                    'title': article.get('title'),
                    'content': article.get('content'),
                    'html_content': article.get('html_content'),
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
        if not title:
            return []
            
        stop_words = {'ve', 'ile', 'hakkında', 'dair', 'kanunu', 'kanun', 'yönetmelik', 'tebliğ'}
        words = title.lower().split()
        keywords = [word for word in words if len(word) > 2 and word not in stop_words]
        return keywords[:10]  # Max 10 anahtar kelime

    def search_recent_mevzuat(self, days: int = 7) -> List[Dict]:
        """Son X günlük mevzuat listesini getirir (şimdilik mock data)"""
        print(f"📅 Son {days} günün mevzuatları aranıyor...")
        
        # Mock data - gerçek MCP entegrasyonu için güncelleneeck
        mock_mevzuat = [
            {
                'title': '7504 Sayılı İş Kanununda Değişiklik Yapan Kanun',
                'number': '7504',
                'type': 'KANUN',
                'publication_date': (datetime.now() - timedelta(days=2)).strftime('%Y-%m-%d'),
                'gazette_no': '32145',
                'gazette_date': (datetime.now() - timedelta(days=2)).strftime('%Y-%m-%d'),
                'summary': 'İş hukuku alanında düzenlemeler',
                'url': 'https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=7504',
                'article_count': 12,
                'articles': [
                    {
                        'number': '1',
                        'title': 'Amaç',
                        'content': 'Bu Kanunun amacı...',
                    },
                    {
                        'number': '2', 
                        'title': 'Kapsam',
                        'content': 'Bu Kanun kapsamında...',
                    }
                ]
            },
            {
                'title': 'Çevre Koruma Yönetmeliği',
                'number': 'YN-2024-15',
                'type': 'YÖNETMELIK',
                'publication_date': (datetime.now() - timedelta(days=1)).strftime('%Y-%m-%d'),
                'gazette_no': '32146',
                'gazette_date': (datetime.now() - timedelta(days=1)).strftime('%Y-%m-%d'),
                'summary': 'Çevre koruma tedbirleri',
                'url': 'https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=YN-2024-15',
                'article_count': 8,
                'articles': [
                    {
                        'number': '1',
                        'title': 'Tanımlar',
                        'content': 'Bu Yönetmelikte geçen terimler...',
                    }
                ]
            }
        ]
        
        print(f"✅ {len(mock_mevzuat)} mevzuat bulundu")
        return mock_mevzuat

    def update_database(self, days: int = 7):
        """Veritabanını günceller"""
        print("🚀 Mevzuat MCP güncelleme başlatıldı...")
        print("=" * 50)
        
        # Son X günün mevzuatlarını al
        recent_mevzuat = self.search_recent_mevzuat(days)
        
        if not recent_mevzuat:
            print("📭 Yeni mevzuat bulunamadı")
            return
        
        updated_count = 0
        
        for mevzuat in recent_mevzuat:
            try:
                # Zaten var mı kontrol et
                existing = self.supabase.table('mevzuat').select('id').eq('mevzuat_no', mevzuat.get('number')).execute()
                
                if existing.data:
                    print(f"⚠️ Zaten mevcut: {mevzuat.get('title')}")
                    continue
                
                # Kaydet
                if self.save_to_supabase(mevzuat):
                    updated_count += 1
                
                # Rate limiting
                time.sleep(0.5)
                
            except Exception as e:
                print(f"❌ İşlem hatası: {str(e)}")
                continue
        
        print("=" * 50)
        print(f"🎉 Güncelleme tamamlandı! {updated_count} yeni mevzuat eklendi")

def main():
    """Ana fonksiyon"""
    print("🔄 MEVZUAT MCP GÜNCELLEME ARACI")
    print("=" * 50)
    
    updater = MevzuatMCPUpdater()
    
    # Son 7 günün mevzuatlarını al (test için)
    updater.update_database(days=7)

if __name__ == "__main__":
    main() 