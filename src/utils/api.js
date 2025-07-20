// Supabase Integration for Mevzuat
import { supabase } from './supabase'

class MevzuatAPI {
  async searchMevzuat(query, types = ['KANUN']) {
    try {
      console.log(`🔍 Supabase'de arama yapılıyor: "${query}", types: ${types}`)
      
      // Supabase'deki search_mevzuat fonksiyonunu çağır
      const { data, error } = await supabase
        .rpc('search_mevzuat', {
          search_query: query,
          mevzuat_types: types,
          limit_count: 20
        })

      if (error) {
        console.error('Supabase search error:', error)
        throw new Error(error.message)
      }

      console.log(`✅ ${data?.length || 0} sonuç bulundu`)
      
      // Veriyi frontend formatına çevir
      const formattedData = data.map(item => ({
        id: item.mevzuat_id,
        adi: item.title,
        sayi: item.mevzuat_no,
        tarih: item.publication_date,
        tip: item.type,
        ozet: item.summary,
        madde_sayisi: item.article_count,
        kategori: item.category_title,
        rank: item.rank
      }))

      return { success: true, data: formattedData }
    } catch (error) {
      console.error('Search API error:', error)
      return { success: false, error: error.message }
    }
  }

  async getMevzuatArticleTree(mevzuatId) {
    try {
      console.log(`📊 Mevzuat maddeleri alınıyor: ${mevzuatId}`)
      
      const { data, error } = await supabase
        .from('mevzuat_articles')
        .select('*')
        .eq('mevzuat_id', mevzuatId)
        .order('article_order', { ascending: true })

      if (error) {
        console.error('Supabase articles error:', error)
        throw new Error(error.message)
      }

      console.log(`✅ ${data?.length || 0} madde bulundu`)
      return { success: true, data }
    } catch (error) {
      console.error('Article tree API error:', error)
      return { success: false, error: error.message }
    }
  }

  async getMevzuatArticleContent(mevzuatId, articleNumber) {
    try {
      console.log(`📄 Madde içeriği alınıyor: ${mevzuatId}, madde: ${articleNumber}`)
      
      const { data, error } = await supabase
        .from('mevzuat_articles')
        .select('*')
        .eq('mevzuat_id', mevzuatId)
        .eq('article_no', articleNumber)
        .single()

      if (error) {
        console.error('Supabase article content error:', error)
        throw new Error(error.message)
      }

      console.log(`✅ Madde içeriği alındı`)
      return { success: true, data }
    } catch (error) {
      console.error('Article content API error:', error)
      return { success: false, error: error.message }
    }
  }

  async getMevzuatCategories() {
    try {
      console.log(`📂 Kategoriler alınıyor`)
      
      const { data, error } = await supabase
        .from('mevzuat_categories')
        .select('*')
        .order('title', { ascending: true })

      if (error) {
        console.error('Supabase categories error:', error)
        throw new Error(error.message)
      }

      console.log(`✅ ${data?.length || 0} kategori alındı`)
      return { success: true, data }
    } catch (error) {
      console.error('Categories API error:', error)
      return { success: false, error: error.message }
    }
  }

  // MCP Server entegrasyonu - GERÇEK VERİLER
  async searchWithMCP(query, types = ['KANUN'], pageNumber = 1) {
    try {
      console.log(`🔍 MCP Server ile gerçek arama: "${query}" (Sayfa: ${pageNumber})`)
      
      // Production: Render URL, Development: localhost
      const mcpServerUrl = process.env.NODE_ENV === 'production' 
        ? 'https://mevzuat-ai-saas.onrender.com' 
        : 'http://localhost:8080'
      
      const response = await fetch(`${mcpServerUrl}/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phrase: query,
          mevzuat_turleri: types,
          page_size: 20,
          page_number: pageNumber,
          sort_field: 'RESMI_GAZETE_TARIHI',
          sort_direction: 'desc'
        })
      })

      if (!response.ok) {
        throw new Error(`MCP Server error: ${response.status}`)
      }

      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'MCP Server error')
      }

      console.log(`✅ MCP'den ${result.data?.documents?.length || 0} gerçek sonuç bulundu`)
      console.log('İlk ogenin fieldlari:', result.data?.documents?.[0])
      
      // Veriyi frontend formatına çevir
      const formattedData = result.data?.documents?.map(item => ({
        id: item.mevzuat_id || item.id,
        adi: item.mevzuat_adi || item.title,
        sayi: item.mevzuat_no || item.number,
        tarih: item.resmi_gazete_tarihi || item.yayim_tarihi || item.publish_date || item.created_at,
        tip: item.mevzuat_turu || item.type,
        ozet: item.ozet || item.summary || 'Gerçek mevzuat.gov.tr verisi',
        madde_sayisi: item.madde_sayisi || item.article_count || 0,
        kategori: this.categorizeMevzuat(item.mevzuat_adi || item.title, item.mevzuat_turu || item.type),
        url: item.url,
        rank: this.calculateRelevanceScore(item.mevzuat_adi || item.title, query),
        // Tüm tarih alanlarını koruyalım
        resmi_gazete_tarihi: item.resmi_gazete_tarihi,
        yayim_tarihi: item.yayim_tarihi,
        mevzuat_tur: item.mevzuat_tur,
        mevzuat_adi: item.mevzuat_adi,
        mevzuat_no: item.mevzuat_no
      })) || []

      // 1. Önce tarihe göre sırala (en yeni önce)
      formattedData.sort((a, b) => {
        const dateA = new Date(a.tarih || a.resmi_gazete_tarihi || '1900-01-01')
        const dateB = new Date(b.tarih || b.resmi_gazete_tarihi || '1900-01-01')
        return dateB.getTime() - dateA.getTime() // En yeni tarih önce
      })
      
      // 2. Sonra relevance skoruna göre grup içinde sırala
      const now = new Date()
      formattedData.forEach(item => {
        const itemDate = new Date(item.tarih || item.resmi_gazete_tarihi || '1900-01-01')
        const daysDiff = Math.abs((now.getTime() - itemDate.getTime()) / (1000 * 3600 * 24))
        
        // Yeni tarihlere bonus puan ver
        const recencyBonus = daysDiff < 365 ? (365 - daysDiff) / 10 : 0
        item.finalScore = item.rank + recencyBonus
      })
      
      // Final skorlarına göre tekrar sırala
      formattedData.sort((a, b) => b.finalScore - a.finalScore)
      
      // Debug: İlk 5 sonucun skorlarını console'a yazdır
      console.log('🎯 Relevance Skorları (İlk 5):')
      formattedData.slice(0, 5).forEach((item, index) => {
        console.log(`${index + 1}. ${item.adi} → Skor: ${item.rank}`)
      })

      return { success: true, data: formattedData }
      
    } catch (error) {
      console.error('MCP Search error:', error)
      return { success: false, error: error.message }
    }
  }

  // Mevzuat detayını getir
  async getDocumentContent(mevzuatId) {
    try {
      console.log('MCP document content request for ID:', mevzuatId)
      
      const response = await fetch(`${this.MCP_BASE_URL}/get_article_tree`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mevzuat_id: mevzuatId
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('MCP document tree response:', data)

      if (data.success) {
        return { success: true, data: data.data }
      } else {
        throw new Error(data.error || 'MCP server error')
      }
    } catch (error) {
      console.error('MCP Document API error:', error)
      return { success: false, error: error.message }
    }
  }

  // Relevance skoru hesapla (ana kanunlar ve birleşik kelimeler öncelikli)
  calculateRelevanceScore(title, query) {
    if (!title || !query) return 1.0
    
    const titleLower = title.toLowerCase()
    const queryLower = query.toLowerCase()
    const queryWords = queryLower.split(/\s+/).filter(word => word.length > 2)
    
    let score = 1.0
    
    // Birleşik kelime analizi
    const matchedWords = queryWords.filter(word => titleLower.includes(word))
    const matchRatio = matchedWords.length / queryWords.length
    
    // Birleşik kelime bonusu (ne kadar çok kelime eşleşirse o kadar yüksek skor)
    if (matchRatio >= 0.8) {  // %80+ eşleşme
      score += 15.0
    } else if (matchRatio >= 0.6) {  // %60+ eşleşme
      score += 10.0
    } else if (matchRatio >= 0.4) {  // %40+ eşleşme
      score += 5.0
    }
    
    // KDV ve iade özel kombinasyonları
    if (queryLower.includes('kdv') && queryLower.includes('iade')) {
      // Ana KDV Kanunu en önce gelmeli
      if ((titleLower.includes('katma değer vergisi kanunu') || titleLower.includes('kdv kanunu')) && 
          !titleLower.includes('yönetmelik') && !titleLower.includes('tebliğ')) {
        score += 30.0 // Ana KDV Kanunu en yüksek öncelik
      }
      // KDV + iade birlikte geçen mevzuat
      else if (titleLower.includes('kdv') && titleLower.includes('iade')) {
        score += 25.0 // Tam eşleşme için çok yüksek skor
      } 
      // Katma değer vergisi + iade birlikte
      else if (titleLower.includes('katma değer vergisi') && titleLower.includes('iade')) {
        score += 22.0
      }
      // Sadece KDV geçen mevzuat (iade yoksa daha düşük)
      else if (titleLower.includes('kdv') || titleLower.includes('katma değer vergisi')) {
        score += 15.0
      } 
      // Sadece iade geçen mevzuat (KDV yoksa daha düşük)
      else if (titleLower.includes('iade')) {
        score += 8.0
      }
    }
    
    // Tek başına KDV araması (iade olmadan)
    else if (queryLower.includes('kdv') && !queryLower.includes('iade')) {
      if (titleLower.includes('katma değer vergisi kanunu') || titleLower.includes('kdv kanunu')) {
        score += 25.0 // Ana KDV Kanunu
      } else if (titleLower.includes('kdv') || titleLower.includes('katma değer vergisi')) {
        score += 12.0
      }
    }
    
    // Ana vergi kanunları için yüksek skor (Kanun türü varsa ekstra bonus)
    if (queryLower.includes('vergi')) {
      // Ana Vergi Kanunları (en yüksek öncelik)
      if (titleLower.includes('gelir vergisi kanunu') && !titleLower.includes('yönetmelik')) {
        score += 25.0 // Gelir Vergisi Kanunu
      } else if (titleLower.includes('vergi usul kanunu') && !titleLower.includes('yönetmelik')) {
        score += 25.0 // Vergi Usul Kanunu
      } else if (titleLower.includes('kurumlar vergisi kanunu') && !titleLower.includes('yönetmelik')) {
        score += 24.0 // Kurumlar Vergisi Kanunu
      } else if ((titleLower.includes('katma değer vergisi kanunu') || titleLower.includes('kdv kanunu')) && !titleLower.includes('yönetmelik')) {
        score += 23.0 // KDV Kanunu
      } else if (titleLower.includes('harçlar kanunu') && !titleLower.includes('yönetmelik')) {
        score += 20.0 // Harçlar Kanunu
      } else if (titleLower.includes('damga vergisi kanunu') && !titleLower.includes('yönetmelik')) {
        score += 18.0 // Damga Vergisi Kanunu
      }
      // Diğer vergi kanunları (genel)
      else if (titleLower.includes('vergi') && titleLower.includes('kanun') && !titleLower.includes('yönetmelik')) {
        score += 15.0 // Diğer vergi kanunları
      }
      // Vergi yönetmelikleri (orta öncelik)
      else if (titleLower.includes('vergi') && titleLower.includes('yönetmelik')) {
        score += 8.0 // Vergi yönetmelikleri
      }
      // Vergi tebliğleri (düşük öncelik)
      else if (titleLower.includes('vergi') && titleLower.includes('tebliğ')) {
        score += 6.0 // Vergi tebliğleri
      }
      // Genel vergi mevzuatı
      else if (titleLower.includes('vergi')) {
        score += 4.0 // Vergi içeren diğer mevzuat
      }
    }
    
    // Tam kelime eşleşmesi bonusu
    queryWords.forEach(word => {
      if (titleLower.includes(word)) {
        score += 2.0
      }
    })
    
    // Title'da query tam eşleşmesi varsa ekstra bonus
    if (titleLower.includes(queryLower)) {
      score += 5.0
    }
    
    // Mevzuat türü hiyerarşi bonusu (önemlilik sırasına göre)
    score += this.getMevzuatTypeScore(title, titleLower)
    
    return score
  }

  // Mevzuat türü öncelik skorları
  getMevzuatTypeScore(title, titleLower) {
    // Ana Kanunlar (en yüksek öncelik)
    if (titleLower.includes('kanun') && !titleLower.includes('hükmünde')) {
      return 10.0
    }
    
    // Kanun Hükmünde Kararnameler
    if (titleLower.includes('kanun hükmünde') || titleLower.includes('khk')) {
      return 8.0
    }
    
    // Tüzükler
    if (titleLower.includes('tüzük') || titleLower.includes('tuzuk')) {
      return 7.0
    }
    
    // Yönetmelikler (Cumhurbaşkanlığı ve normal)
    if (titleLower.includes('yönetmelik')) {
      if (titleLower.includes('cumhurbaşkanlığı')) {
        return 6.0  // CB Yönetmeliği
      }
      return 5.5  // Normal Yönetmelik
    }
    
    // Tebliğler
    if (titleLower.includes('tebliğ')) {
      return 4.0
    }
    
    // Cumhurbaşkanlığı Kararları
    if (titleLower.includes('cumhurbaşkanlığı') && titleLower.includes('karar')) {
      return 3.5
    }
    
    // Cumhurbaşkanlığı Kararnameleri
    if (titleLower.includes('cumhurbaşkanlığı') && titleLower.includes('kararname')) {
      return 3.0
    }
    
    // Cumhurbaşkanlığı Genelgeleri
    if (titleLower.includes('cumhurbaşkanlığı') && titleLower.includes('genelge')) {
      return 2.5
    }
    
    // Diğer kararlar
    if (titleLower.includes('karar')) {
      return 2.0
    }
    
    // Genelgeler
    if (titleLower.includes('genelge')) {
      return 1.5
    }
    
    // Mülga mevzuat (en düşük)
    if (titleLower.includes('mülga') || titleLower.includes('mulga')) {
      return 0.5
    }
    
    // Varsayılan
    return 1.0
  }

  // Kategori belirleme
  categorizeMevzuat(title, type) {
    const titleLower = title.toLowerCase()
    if (titleLower.includes('iş') || titleLower.includes('çalışma')) return 'İş Hukuku'
    if (titleLower.includes('anayasa')) return 'Anayasa Hukuku'
    if (titleLower.includes('ceza')) return 'Ceza Hukuku'
    if (titleLower.includes('medeni')) return 'Medeni Hukuk'
    if (titleLower.includes('vergi')) return 'Vergi Hukuku'
    if (titleLower.includes('ticaret')) return 'Ticaret Hukuku'
    if (titleLower.includes('sağlık')) return 'Sağlık Hukuku'
    if (titleLower.includes('eğitim')) return 'Eğitim Hukuku'
    return 'İdare Hukuku'
  }
}

export default new MevzuatAPI()