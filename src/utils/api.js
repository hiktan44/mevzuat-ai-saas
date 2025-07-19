// MCP API Integration for Mevzuat
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001'

class MevzuatAPI {
  async searchMevzuat(query, types = ['KANUN']) {
    try {
      const response = await fetch(`${API_BASE_URL}/search_mevzuat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query,
          types: types,
          limit: 20
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return { success: true, data }
    } catch (error) {
      console.error('Search API error:', error)
      return { success: false, error: error.message }
    }
  }

  async getMevzuatArticleTree(mevzuatId) {
    try {
      const response = await fetch(`${API_BASE_URL}/get_mevzuat_article_tree`, {
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
      return { success: true, data }
    } catch (error) {
      console.error('Article tree API error:', error)
      return { success: false, error: error.message }
    }
  }

  async getMevzuatArticleContent(mevzuatId, articleNumber) {
    try {
      const response = await fetch(`${API_BASE_URL}/get_mevzuat_article_content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mevzuat_id: mevzuatId,
          article_number: articleNumber
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return { success: true, data }
    } catch (error) {
      console.error('Article content API error:', error)
      return { success: false, error: error.message }
    }
  }

  // Fallback mock data for when API is not available
  getMockResults(query) {
    const mockResults = [
      {
        id: '4857',
        adi: 'İŞ KANUNU',
        sayi: '4857',
        tarih: '10.06.2003',
        tip: 'KANUN',
        ozet: 'İş ilişkilerinde işçi ve işverenin hak ve yükümlülüklerini düzenleyen temel kanun',
        madde_sayisi: 103
      },
      {
        id: '5237',
        adi: 'TÜRK CEZA KANUNU',
        sayi: '5237',
        tarih: '26.09.2004',
        tip: 'KANUN',
        ozet: 'Türkiye\'de suç ve cezaları düzenleyen temel hukuki metin',
        madde_sayisi: 345
      },
      {
        id: '4721',
        adi: 'TÜRK MEDENİ KANUNU',
        sayi: '4721',
        tarih: '22.11.2001',
        tip: 'KANUN',
        ozet: 'Kişilik hakları, aile hukuku, miras hukuku ve eşya hukukunu düzenler',
        madde_sayisi: 1030
      }
    ]

    return mockResults.filter(item => 
      item.adi.toLowerCase().includes(query.toLowerCase()) ||
      item.sayi.includes(query)
    )
  }
}

export default new MevzuatAPI()