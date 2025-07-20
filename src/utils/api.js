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
  async searchWithMCP(query, types = ['KANUN']) {
    try {
      console.log(`🔍 MCP Server ile gerçek arama: "${query}"`)
      
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
          page_number: 1,
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

      console.log(`✅ MCP'den ${result.data?.mevzuat_listesi?.length || 0} gerçek sonuç bulundu`)
      
      // Veriyi frontend formatına çevir
      const formattedData = result.data?.mevzuat_listesi?.map(item => ({
        id: item.mevzuat_id,
        adi: item.mevzuat_adi,
        sayi: item.mevzuat_no,
        tarih: item.yayim_tarihi,
        tip: item.mevzuat_turu,
        ozet: item.ozet || 'Gerçek mevzuat.gov.tr verisi',
        madde_sayisi: item.madde_sayisi || 0,
        kategori: this.categorizeMevzuat(item.mevzuat_adi, item.mevzuat_turu),
        url: item.url,
        rank: 1.0
      })) || []

      return { success: true, data: formattedData }
      
    } catch (error) {
      console.error('MCP Search error:', error)
      return { success: false, error: error.message }
    }
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