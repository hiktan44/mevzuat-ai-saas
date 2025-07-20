// MCP Server Integration for Mevzuat
// Gerçek mevzuat.gov.tr verilerine erişim

class MevzuatMCPAPI {
  constructor() {
    // Development: localhost, Production: Render URL
    this.mcpServerUrl = process.env.NODE_ENV === 'production' 
      ? 'https://mevzuat-ai-saas.onrender.com' // Render'dan aldığınız gerçek URL
      : 'http://localhost:8080'
    this.timeout = 30000 // 30 saniye
  }

  async searchMevzuat(query, types = ['KANUN']) {
    try {
      console.log(`🔍 MCP Server'da arama yapılıyor: "${query}", types: ${types}`)
      
      const response = await fetch(`${this.mcpServerUrl}/search`, {
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
        }),
        signal: AbortSignal.timeout(this.timeout)
      })

      if (!response.ok) {
        throw new Error(`MCP Server error: ${response.status}`)
      }

      const result = await response.json()
      
      if (result.error) {
        throw new Error(result.error)
      }

      console.log(`✅ MCP'den ${result.data?.mevzuat_listesi?.length || 0} sonuç bulundu`)
      
      // Veriyi frontend formatına çevir
      const formattedData = result.data?.mevzuat_listesi?.map(item => ({
        id: item.mevzuat_id,
        adi: item.mevzuat_adi,
        sayi: item.mevzuat_no,
        tarih: item.yayim_tarihi,
        tip: item.mevzuat_turu,
        ozet: item.ozet || 'Özet mevcut değil',
        madde_sayisi: item.madde_sayisi || 0,
        kategori: this.categorizeMevzuat(item.mevzuat_adi, item.mevzuat_turu),
        url: item.url,
        rank: 1.0
      })) || []

      return { success: true, data: formattedData }
    } catch (error) {
      console.error('MCP Search API error:', error)
      return { success: false, error: error.message }
    }
  }

  async getMevzuatArticleTree(mevzuatId) {
    try {
      console.log(`📊 MCP'den mevzuat maddeleri alınıyor: ${mevzuatId}`)
      
      const response = await fetch(`${this.mcpServerUrl}/article-tree`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mevzuat_id: mevzuatId
        }),
        signal: AbortSignal.timeout(this.timeout)
      })

      if (!response.ok) {
        throw new Error(`MCP Server error: ${response.status}`)
      }

      const result = await response.json()
      
      if (result.error) {
        throw new Error(result.error)
      }

      console.log(`✅ MCP'den ${result.data?.length || 0} madde bulundu`)
      return { success: true, data: result.data }
    } catch (error) {
      console.error('MCP Article tree API error:', error)
      return { success: false, error: error.message }
    }
  }

  async getMevzuatArticleContent(mevzuatId, maddeId) {
    try {
      console.log(`📄 MCP'den madde içeriği alınıyor: ${mevzuatId}, madde: ${maddeId}`)
      
      const response = await fetch(`${this.mcpServerUrl}/article-content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mevzuat_id: mevzuatId,
          madde_id: maddeId
        }),
        signal: AbortSignal.timeout(this.timeout)
      })

      if (!response.ok) {
        throw new Error(`MCP Server error: ${response.status}`)
      }

      const result = await response.json()
      
      if (result.error) {
        throw new Error(result.error)
      }

      console.log(`✅ MCP'den madde içeriği alındı`)
      return { success: true, data: result.data }
    } catch (error) {
      console.error('MCP Article content API error:', error)
      return { success: false, error: error.message }
    }
  }

  // Mevzuatı kategoriye göre sınıflandır
  categorizeMevzuat(title, type) {
    const titleLower = title.toLowerCase()
    
    if (titleLower.includes('anayasa') || titleLower.includes('seçim')) {
      return 'Anayasa Hukuku'
    } else if (titleLower.includes('iş') || titleLower.includes('çalışma')) {
      return 'İş Hukuku'
    } else if (titleLower.includes('ceza') || titleLower.includes('suç')) {
      return 'Ceza Hukuku'
    } else if (titleLower.includes('medeni') || titleLower.includes('aile')) {
      return 'Medeni Hukuk'
    } else if (titleLower.includes('vergi') || titleLower.includes('gelir')) {
      return 'Vergi Hukuku'
    } else if (titleLower.includes('ticaret') || titleLower.includes('şirket')) {
      return 'Ticaret Hukuku'
    } else if (titleLower.includes('sağlık') || titleLower.includes('tıp')) {
      return 'Sağlık Hukuku'
    } else if (titleLower.includes('eğitim') || titleLower.includes('okul')) {
      return 'Eğitim Hukuku'
    } else if (titleLower.includes('çevre') || titleLower.includes('orman')) {
      return 'Çevre Hukuku'
    } else if (titleLower.includes('enerji') || titleLower.includes('elektrik')) {
      return 'Enerji Hukuku'
    } else if (titleLower.includes('banka') || titleLower.includes('kredi')) {
      return 'Bankacılık Hukuku'
    } else {
      return 'İdare Hukuku'
    }
  }

  // Health check
  async checkServerHealth() {
    try {
      const response = await fetch(`${this.mcpServerUrl}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000)
      })
      return response.ok
    } catch (error) {
      console.error('MCP Server health check failed:', error)
      return false
    }
  }
}

export default new MevzuatMCPAPI() 