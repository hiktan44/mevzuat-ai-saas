import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { 
  Search, 
  Filter, 
  Calendar, 
  FileText, 
  Heart,
  MessageCircle,
  ChevronDown,
  Loader,
  X
} from 'lucide-react'
import { supabase } from '../utils/supabase'
import MevzuatAPI from '../utils/api'
import toast from 'react-hot-toast'

const SearchPage = ({ profile }) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedTypes, setSelectedTypes] = useState(['KANUN'])
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMorePages, setHasMorePages] = useState(false)

  // Sidebar kategoriler için state'ler
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedMinistry, setSelectedMinistry] = useState('')
  const [selectedInstitution, setSelectedInstitution] = useState('')
  const [selectedHukukDali, setSelectedHukukDali] = useState('')

  const mevzuatTypes = [
    { value: 'KANUN', label: 'Kanunlar', count: 2847 },
    { value: 'YONETMELIK', label: 'Yönetmelikler', count: 12450 },
    { value: 'TEBLIG', label: 'Tebliğler', count: 8932 },
    { value: 'KARAR', label: 'Kararlar', count: 5621 },
    { value: 'GENELGE', label: 'Genelgeler', count: 3218 }
  ]

  // Ana Kanunlar Kategorileri
  const anaKanunlar = [
    {
      name: "Vergi Kanunları",
      icon: "💰",
      keywords: ["vergi", "gelir vergisi", "kurumlar vergisi", "katma değer vergisi", "özel tüketim vergisi"],
      subCategories: ["Gelir Vergisi Kanunu", "Kurumlar Vergisi Kanunu", "KDV Kanunu", "ÖTV Kanunu", "Vergi Usul Kanunu"]
    },
    {
      name: "İş ve Sosyal Güvenlik",
      icon: "👷",
      keywords: ["iş kanunu", "sosyal güvenlik", "işçi", "işveren", "sgk"],
      subCategories: ["İş Kanunu", "Sendikalar Kanunu", "Sosyal Güvenlik Kanunu", "İş Sağlığı Kanunu"]
    },
    {
      name: "Medeni ve Aile Hukuku",
      icon: "👨‍👩‍👧‍👦",
      keywords: ["medeni kanun", "aile", "evlilik", "boşanma", "miras"],
      subCategories: ["Türk Medeni Kanunu", "Aile Hukuku", "Miras Hukuku", "Eşya Hukuku"]
    },
    {
      name: "Ceza Hukuku",
      icon: "⚖️",
      keywords: ["ceza kanunu", "suç", "ceza", "hapis"],
      subCategories: ["Türk Ceza Kanunu", "Ceza Muhakemesi Kanunu", "İnfaz Kanunu"]
    },
    {
      name: "Ticaret ve Şirketler",
      icon: "🏢",
      keywords: ["ticaret kanunu", "şirket", "anonim", "limited"],
      subCategories: ["Türk Ticaret Kanunu", "Anonim Şirketler", "Limited Şirketler", "Kooperatifler"]
    },
    {
      name: "Eğitim Mevzuatı",
      icon: "📚",
      keywords: ["milli eğitim", "üniversite", "öğrenci", "öğretmen"],
      subCategories: ["Milli Eğitim Kanunu", "Yükseköğretim Kanunu", "Özel Öğretim Kanunu"]
    }
  ]

  // Bakanlıklar
  const bakanliklar = [
    {
      name: "Maliye ve Hazine Bakanlığı",
      icon: "💰",
      keywords: ["maliye", "hazine", "vergi", "gümrük", "bütçe"],
      subCategories: ["Vergi Mevzuatı", "Gümrük Mevzuatı", "Hazine Mevzuatı", "Bütçe Mevzuatı"]
    },
    {
      name: "Çalışma ve Sosyal Güvenlik Bakanlığı",
      icon: "👷",
      keywords: ["çalışma", "işçi", "sosyal güvenlik", "sgk", "işsizlik"],
      subCategories: ["İş Mevzuatı", "Sosyal Güvenlik", "İşsizlik Sigortası", "İş Sağlığı"]
    },
    {
      name: "Adalet Bakanlığı",
      icon: "⚖️",
      keywords: ["adalet", "mahkeme", "hâkim", "savcı", "avukat"],
      subCategories: ["Adli Mevzuat", "Ceza İnfaz", "Noterlik", "Avukatlık"]
    },
    {
      name: "İçişleri Bakanlığı",
      icon: "🏛️",
      keywords: ["içişleri", "emniyet", "jandarma", "nüfus", "sivil"],
      subCategories: ["Emniyet Mevzuatı", "Jandarma", "Sivil Havacılık", "Nüfus İşleri"]
    },
    {
      name: "Milli Eğitim Bakanlığı",
      icon: "📚",
      keywords: ["milli eğitim", "okul", "öğretmen", "müfredaet"],
      subCategories: ["Okul Öncesi", "İlköğretim", "Ortaöğretim", "Öğretmen Yetiştirme"]
    },
    {
      name: "Sağlık Bakanlığı",
      icon: "🏥",
      keywords: ["sağlık", "hastane", "doktor", "ilaç", "tıp"],
      subCategories: ["Kamu Hastaneleri", "İlaç Mevzuatı", "Sağlık Meslek", "Sağlık Turizmi"]
    }
  ]

  // Bağımsız Kurumlar
  const bagımsızKurumlar = [
    {
      name: "Türkiye Cumhuriyet Merkez Bankası",
      icon: "🏦",
      keywords: ["merkez bankası", "para politikası", "faiz", "döviz"],
      subCategories: ["Para Politikası", "Bankacılık Düzenlemeleri", "Döviz Mevzuatı"]
    },
    {
      name: "Sermaye Piyasası Kurulu",
      icon: "📈",
      keywords: ["sermaye piyasası", "borsa", "yatırım", "fon"],
      subCategories: ["Borsa Mevzuatı", "Yatırım Fonları", "Sigorta Şirketleri"]
    },
    {
      name: "Bankacılık Düzenleme ve Denetleme Kurumu",
      icon: "🏛️",
      keywords: ["bddk", "banka", "kredi", "finansal"],
      subCategories: ["Banka Mevzuatı", "Kredi Kartları", "Finansal Kiralama"]
    },
    {
      name: "Rekabet Kurumu",
      icon: "🤝",
      keywords: ["rekabet", "tekel", "kartel", "birleşme"],
      subCategories: ["Rekabet Hukuku", "Birleşme Devralma", "Devlet Yardımları"]
    }
  ]

  // Hukuk Dalları - Dashboard'daki kutu kategoriler
  const hukukDallari = [
    {
      name: "Anayasa Hukuku",
      icon: "🏛️",
      description: "Devletin temel yapısı, organları ve vatandaş hakları",
      color: "blue",
      keywords: ["anayasa", "temel haklar", "devlet organları"],
      populerKanunlar: ["Anayasa", "Siyasi Partiler Kanunu", "Seçim Kanunu"]
    },
    {
      name: "Medeni Hukuk",
      icon: "👨‍👩‍👧‍👦",
      description: "Kişiler arası özel hukuk ilişkileri",
      color: "green",
      keywords: ["medeni kanun", "kişiler hukuku", "aile hukuku"],
      populerKanunlar: ["Türk Medeni Kanunu", "Nüfus Hizmetleri Kanunu"]
    },
    {
      name: "Ceza Hukuku",
      icon: "⚖️",
      description: "Suçlar ve cezalar hukuku",
      color: "red",
      keywords: ["ceza", "suç", "ceza kanunu"],
      populerKanunlar: ["Türk Ceza Kanunu", "Ceza Muhakemesi Kanunu"]
    },
    {
      name: "İdare Hukuku",
      icon: "🏢",
      description: "Kamu yönetimi ve idari işlemler",
      color: "purple",
      keywords: ["idare", "kamu yönetimi", "idari yargı"],
      populerKanunlar: ["İdari Yargılama Usulü Kanunu", "Devlet Memurları Kanunu"]
    },
    {
      name: "Vergi Hukuku",
      icon: "💰",
      description: "Vergilendirme ve mali hukuk",
      color: "yellow",
      keywords: ["vergi", "gelir vergisi", "kurumlar vergisi"],
      populerKanunlar: ["Gelir Vergisi Kanunu", "Kurumlar Vergisi Kanunu", "KDV Kanunu"]
    },
    {
      name: "İş Hukuku",
      icon: "👷",
      description: "İşçi-işveren ilişkileri",
      color: "orange",
      keywords: ["iş kanunu", "işçi", "işveren"],
      populerKanunlar: ["İş Kanunu", "Sendikalar Kanunu", "Toplu İş Sözleşmesi Kanunu"]
    },
    {
      name: "Ticaret Hukuku",
      icon: "🏪",
      description: "Ticari işlemler ve şirketler hukuku",
      color: "indigo",
      keywords: ["ticaret", "şirket", "ticaret kanunu"],
      populerKanunlar: ["Türk Ticaret Kanunu", "Rekabet Kanunu"]
    },
    {
      name: "Sosyal Güvenlik Hukuku",
      icon: "🛡️",
      description: "Sosyal güvenlik ve sigorta sistemi",
      color: "teal",
      keywords: ["sosyal güvenlik", "sgk", "emeklilik"],
      populerKanunlar: ["Sosyal Sigortalar Kanunu", "İşsizlik Sigortası Kanunu"]
    }
  ]

  // MCP API entegrasyonu ile gerçek veri kullanılıyor

  useEffect(() => {
    const queryParam = searchParams.get('q')
    if (queryParam && queryParam !== query) {
      setQuery(queryParam)
      handleSearch(queryParam)
    }
  }, [searchParams])

  const handleSearch = async (searchQuery = query) => {
    if (!searchQuery.trim()) {
      toast.error('Lütfen arama terimi girin')
      return
    }

    // Check usage limit
    if (profile?.daily_search_count >= 50) {
      toast.error('Günlük arama limitinize ulaştınız! (50 arama/gün)')
      return
    }

    setLoading(true)
    setCurrentPage(1)

    try {
      // Call real MCP API
      const apiResponse = await MevzuatAPI.searchMevzuat(searchQuery, selectedTypes, 1)
      
      let searchResults = []
      
      if (apiResponse.success && apiResponse.data) {
        // Process API response with proper field mapping
        searchResults = apiResponse.data.map(item => ({
          id: item.mevzuat_id || item.id || Math.random().toString(36),
          adi: item.mevzuat_adi || item.adi || item.title,
          sayi: item.mevzuat_no || item.sayi || item.number,
          tarih: item.resmi_gazete_tarihi || item.yayim_tarihi || item.tarih || item.date,
          tip: item.mevzuat_tur?.adi || item.mevzuat_turu || item.tip || item.type || 'KANUN',
          ozet: item.ozet || item.summary || item.description || 'Gerçek mevzuat.gov.tr verisi',
          madde_sayisi: item.madde_sayisi || item.article_count || 'Belirtilmemiş',
          // Tüm alanları koruyalım API'den gelen
          ...item
        }))
        
        // Tarihe göre sırala (en yeni önce)
        searchResults.sort((a, b) => {
          const dateA = new Date(a.tarih || '1900-01-01')
          const dateB = new Date(b.tarih || '1900-01-01')
          return dateB.getTime() - dateA.getTime()
        })
        
        toast.success(`${searchResults.length} sonuç bulundu`)
        setHasMorePages(searchResults.length >= 20)
      } else {
        // Fallback to mock data if API fails
        console.warn('API failed, using mock data:', apiResponse.error)
        searchResults = MevzuatAPI.getMockResults(searchQuery).filter(item => 
          selectedTypes.includes(item.tip)
        )
        
        if (searchResults.length > 0) {
          toast.info(`${searchResults.length} demo sonuç gösteriliyor (API bağlantısı kurulamadı)`)
        } else {
          toast.warning('Sonuç bulunamadı')
        }
      }

      setResults(searchResults)

      // Save to search history and update count
      if (profile?.id) {
        await Promise.all([
          supabase.from('search_history').insert({
            user_id: profile.id,
            query: searchQuery,
            mevzuat_types: selectedTypes
          }),
          supabase
            .from('profiles')
            .update({ 
              daily_search_count: (profile.daily_search_count || 0) + 1 
            })
            .eq('id', profile.id)
        ])
      }

      // Update URL params
      setSearchParams({ q: searchQuery })

    } catch (error) {
      console.error('Search error:', error)
      toast.error('Arama sırasında bir hata oluştu')
      
      // Show mock results as fallback
      const mockResults = MevzuatAPI.getMockResults(searchQuery).filter(item => 
        selectedTypes.includes(item.tip)
      )
      setResults(mockResults)
      
      if (mockResults.length > 0) {
        toast.info('Demo veriler gösteriliyor')
      }
    } finally {
      setLoading(false)
    }
  }

  const loadMoreResults = async () => {
    if (loadingMore || !hasMorePages) return

    setLoadingMore(true)
    const nextPage = currentPage + 1

    try {
      const apiResponse = await MevzuatAPI.searchMevzuat(query, selectedTypes, nextPage)
      
      if (apiResponse.success && apiResponse.data) {
        const newResults = apiResponse.data.map(item => ({
          id: item.mevzuat_id || item.id || Math.random().toString(36),
          adi: item.mevzuat_adi || item.adi || item.title,
          sayi: item.mevzuat_no || item.sayi || item.number,
          tarih: item.resmi_gazete_tarihi || item.yayim_tarihi || item.tarih || item.date,
          tip: item.mevzuat_tur?.adi || item.mevzuat_turu || item.tip || item.type || 'KANUN',
          ozet: item.ozet || item.summary || item.description || 'Gerçek mevzuat.gov.tr verisi',
          madde_sayisi: item.madde_sayisi || item.article_count || 'Belirtilmemiş',
          ...item
        }))

        setResults(prev => [...prev, ...newResults])
        setCurrentPage(nextPage)
        setHasMorePages(newResults.length >= 20)
        
        toast.success(`${newResults.length} sonuç daha yüklendi`)
      } else {
        setHasMorePages(false)
        toast.info('Daha fazla sonuç bulunamadı')
      }
    } catch (error) {
      console.error('Load more error:', error)
      toast.error('Daha fazla sonuç yüklenirken hata oluştu')
    } finally {
      setLoadingMore(false)
    }
  }

  const handleTypeChange = (type) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter(t => t !== type))
    } else {
      setSelectedTypes([...selectedTypes, type])
    }
  }

  // Kategori handler'ları
  const handleCategoryChange = (e) => {
    const category = e.target.value
    setSelectedCategory(category)
    if (category) {
      const selectedCat = anaKanunlar.find(k => k.name === category)
      if (selectedCat) {
        setQuery(selectedCat.keywords[0])
        handleSearch(selectedCat.keywords[0])
      }
    }
  }

  const handleSubCategoryChange = (e) => {
    const subCategory = e.target.value
    if (subCategory) {
      setQuery(subCategory)
      handleSearch(subCategory)
    }
  }

  const handleMinistryChange = (e) => {
    const ministry = e.target.value
    setSelectedMinistry(ministry)
    if (ministry) {
      const selectedMin = bakanliklar.find(b => b.name === ministry)
      if (selectedMin) {
        setQuery(selectedMin.keywords[0])
        handleSearch(selectedMin.keywords[0])
      }
    }
  }

  const handleMinistrySubChange = (e) => {
    const subCategory = e.target.value
    if (subCategory) {
      setQuery(subCategory)
      handleSearch(subCategory)
    }
  }

  const handleInstitutionChange = (e) => {
    const institution = e.target.value
    setSelectedInstitution(institution)
    if (institution) {
      const selectedInst = bagımsızKurumlar.find(k => k.name === institution)
      if (selectedInst) {
        setQuery(selectedInst.keywords[0])
        handleSearch(selectedInst.keywords[0])
      }
    }
  }

  const handleInstitutionSubChange = (e) => {
    const subCategory = e.target.value
    if (subCategory) {
      setQuery(subCategory)
      handleSearch(subCategory)
    }
  }

  const handleHukukDaliChange = (e) => {
    const hukukDali = e.target.value
    setSelectedHukukDali(hukukDali)
    if (hukukDali) {
      const selectedDal = hukukDallari.find(d => d.name === hukukDali)
      if (selectedDal) {
        setQuery(selectedDal.keywords[0])
        handleSearch(selectedDal.keywords[0])
      }
    }
  }

  const handlePopulerKanunChange = (e) => {
    const kanun = e.target.value
    if (kanun) {
      setQuery(kanun)
      handleSearch(kanun)
    }
  }

  const quickSearchByCategory = (searchTerm) => {
    setQuery(searchTerm)
    handleSearch(searchTerm)
  }

  const clearAllSelections = () => {
    setSelectedCategory('')
    setSelectedMinistry('')
    setSelectedInstitution('')
    setSelectedHukukDali('')
    toast.info('Tüm seçimler temizlendi')
  }

  const addToFavorites = async (mevzuat) => {
    try {
      await supabase.from('favorites').insert({
        user_id: profile?.id,
        mevzuat_id: mevzuat.id,
        mevzuat_name: mevzuat.adi
      })
      toast.success('Favorilere eklendi!')
    } catch (error) {
      console.error('Favorite error:', error)
      toast.error('Favorilere eklenirken hata oluştu')
    }
  }

  const handleAskAI = (mevzuat) => {
    try {
      // localStorage'e seçili mevzuatı kaydet
      const contextData = {
        mevzuat_id: mevzuat.mevzuat_id || mevzuat.id,
        mevzuat_adi: mevzuat.mevzuat_adi || mevzuat.adi,
        mevzuat_no: mevzuat.mevzuat_no || mevzuat.sayi,
        mevzuat_turu: mevzuat.mevzuat_tur?.adi || mevzuat.tip,
        resmi_gazete_tarihi: mevzuat.resmi_gazete_tarihi || mevzuat.tarih,
        ozet: mevzuat.ozet,
        timestamp: new Date().toISOString()
      }
      
      localStorage.setItem('selectedMevzuatForChat', JSON.stringify(contextData))
      
      // Chat sayfasına yönlendir
      window.location.href = '/dashboard/chats'
      
      toast.success(`${mevzuat.mevzuat_adi || mevzuat.adi} hakkında AI ile sohbet başlatılıyor...`)
    } catch (error) {
      console.error('AI Chat error:', error)
      toast.error('AI sohbeti başlatılırken hata oluştu')
    }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
      {/* Sidebar - Mobil'de üstte, Desktop'ta solda */}
      <div className="w-full lg:w-80 order-2 lg:order-1 space-y-4 lg:space-y-6">
        {/* Sidebar Header */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">🎯 Hızlı Kategoriler</h3>
          <p className="text-sm text-gray-600">Aşağıdaki kategorilerden seçim yaparak hızlıca arama yapabilirsiniz.</p>
        </div>

        {/* Gelişmiş Kategori Dropdown Sistemi - Sidebar */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">📋 Kategoriler</h3>
            <button
              onClick={clearAllSelections}
              className="text-sm text-red-600 hover:text-red-700 px-2 py-1 border border-red-200 rounded-md hover:bg-red-50"
            >
              🧹 Temizle
            </button>
          </div>

          <div className="space-y-6">
            {/* Ana Kanunlar Kategorisi */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-800 flex items-center">
                🏛️ Ana Kanunlar
              </h4>
              
              {/* Kategori Seçimi */}
              <div>
                <label className="block text-xs text-gray-600 mb-1">Kanun Kategorisi</label>
                <select
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Kategori Seçin...</option>
                  {anaKanunlar.map((kategori, index) => (
                    <option key={index} value={kategori.name}>
                      {kategori.icon} {kategori.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Alt Kategori */}
              {selectedCategory && (
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Alt Kategori</label>
                  <select
                    onChange={handleSubCategoryChange}
                    className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Alt Kategori Seçin...</option>
                    {anaKanunlar.find(k => k.name === selectedCategory)?.subCategories.map((sub, index) => (
                      <option key={index} value={sub}>
                        📋 {sub}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Bakanlıklar */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-800 flex items-center">
                🏢 Bakanlıklar
              </h4>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Bakanlık Seçin</label>
                <select
                  value={selectedMinistry}
                  onChange={handleMinistryChange}
                  className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Bakanlık Seçin...</option>
                  {bakanliklar.map((bakanlik, index) => (
                    <option key={index} value={bakanlik.name}>
                      {bakanlik.icon} {bakanlik.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Alt Kategoriler */}
              {selectedMinistry && (
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Alt Kategori</label>
                  <select
                    onChange={handleMinistrySubChange}
                    className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">Alt Kategori Seçin...</option>
                    {bakanliklar.find(b => b.name === selectedMinistry)?.subCategories.map((sub, index) => (
                      <option key={index} value={sub}>
                        📄 {sub}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Bağımsız Kurumlar */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-800 flex items-center">
                🏦 Bağımsız Kurumlar
              </h4>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Kurum Seçin</label>
                <select
                  value={selectedInstitution}
                  onChange={handleInstitutionChange}
                  className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="">Kurum Seçin...</option>
                  {bagımsızKurumlar.map((kurum, index) => (
                    <option key={index} value={kurum.name}>
                      {kurum.icon} {kurum.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Kurum Alt Kategorileri */}
              {selectedInstitution && (
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Düzenleme Türü</label>
                  <select
                    onChange={handleInstitutionSubChange}
                    className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="">Düzenleme Türü Seçin...</option>
                    {bagımsızKurumlar.find(k => k.name === selectedInstitution)?.subCategories.map((sub, index) => (
                      <option key={index} value={sub}>
                        📋 {sub}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Hukuk Dalları - Dashboard Kategorileri */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-800 flex items-center">
                ⚖️ Hukuk Dalları
              </h4>
              
              {/* Hukuk Dalı Seçimi */}
              <div>
                <label className="block text-xs text-gray-600 mb-1">Hukuk Dalı Seçin</label>
                <select
                  value={selectedHukukDali}
                  onChange={handleHukukDaliChange}
                  className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                >
                  <option value="">Hukuk Dalı Seçin...</option>
                  {hukukDallari.map((dal, index) => (
                    <option key={index} value={dal.name}>
                      {dal.icon} {dal.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Popüler Kanunlar */}
              {selectedHukukDali && (
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Popüler Kanunlar</label>
                  <select
                    onChange={handlePopulerKanunChange}
                    className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="">Kanun Seçin...</option>
                    {hukukDallari.find(dal => dal.name === selectedHukukDali)?.populerKanunlar.map((kanun, index) => (
                      <option key={index} value={kanun}>
                        📋 {kanun}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Seçili Hukuk Dalı Info */}
              {selectedHukukDali && (
                <div className="mt-3 p-3 rounded-lg border-l-4 border-teal-400 bg-teal-50">
                  <div className="text-xs text-teal-800">
                    <strong>{selectedHukukDali}</strong>
                    <p className="mt-1 text-teal-600">
                      {hukukDallari.find(dal => dal.name === selectedHukukDali)?.description}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Aktif Seçimler */}
        {(selectedCategory || selectedMinistry || selectedInstitution || selectedHukukDali) && (
          <div className="bg-white rounded-lg shadow-md p-4">
            <h4 className="text-sm font-semibold text-gray-800 mb-3">🎯 Aktif Seçimler</h4>
            <div className="flex flex-wrap gap-2">
              {selectedCategory && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                  🏛️ {selectedCategory}
                </span>
              )}
              {selectedMinistry && (
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                  🏢 {selectedMinistry}
                </span>
              )}
              {selectedInstitution && (
                <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">
                  🏦 {selectedInstitution}
                </span>
              )}
              {selectedHukukDali && (
                <span className="px-2 py-1 bg-teal-100 text-teal-800 rounded-full text-xs">
                  ⚖️ {selectedHukukDali}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Hızlı Erişim Butonları - Sadece Desktop'ta göster */}
        <div className="hidden lg:block bg-white rounded-lg shadow-md p-4">
          <h5 className="text-sm font-medium text-gray-700 mb-3">⚡ Popüler Kategoriler</h5>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => quickSearchByCategory('vergi')}
              className="px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-xs hover:bg-yellow-100 transition-colors border border-yellow-200"
            >
              💰 Vergi
            </button>
            <button
              onClick={() => quickSearchByCategory('iş kanunu')}
              className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs hover:bg-blue-100 transition-colors border border-blue-200"
            >
              👷 İş Kanunu
            </button>
            <button
              onClick={() => quickSearchByCategory('medeni kanun')}
              className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs hover:bg-green-100 transition-colors border border-green-200"
            >
              👨‍👩‍👧‍👦 Medeni
            </button>
            <button
              onClick={() => quickSearchByCategory('ceza kanunu')}
              className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs hover:bg-red-100 transition-colors border border-red-200"
            >
              ⚖️ Ceza
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 order-1 lg:order-2 space-y-4 lg:space-y-6">
        {/* Header */}
        <div className="text-center lg:text-left">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Mevzuat Arama</h1>
          <p className="text-gray-600">
            Türkiye mevzuatında aradığınızı kolayca bulun
          </p>
        </div>

        {/* Search Form */}
        <div className="card p-4 lg:p-6">
          <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Kanun adı, numarası veya anahtar kelime girin..."
                className="w-full pl-12 pr-4 py-3 lg:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base lg:text-lg"
              />
            </div>

            {/* Filters Toggle */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filtreler
                <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>

              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="btn-primary px-6 lg:px-8 py-2 lg:py-3 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
              >
                {loading ? (
                  <div className="flex items-center">
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Aranıyor...
                  </div>
                ) : (
                  'Ara'
                )}
              </button>
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="border-t pt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Mevzuat Türü</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {mevzuatTypes.map(type => (
                    <label key={type.value} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedTypes.includes(type.value)}
                        onChange={() => handleTypeChange(type.value)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">{type.label}</span>
                      <span className="text-xs text-gray-500">({type.count})</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg lg:text-xl font-semibold text-gray-900">
                Arama Sonuçları ({results.length})
              </h2>
            </div>

            <div className="space-y-4">
              {results.map(result => (
                <ResultCard 
                  key={result.id} 
                  result={result} 
                  onAddToFavorites={addToFavorites}
                  onAskAI={handleAskAI}
                  profile={profile}
                />
              ))}
            </div>

            {/* Daha Fazla Sonuç Butonu */}
            {hasMorePages && (
              <div className="text-center mt-6">
                <button
                  onClick={loadMoreResults}
                  disabled={loadingMore}
                  className="btn-primary px-6 lg:px-8 py-2 lg:py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingMore ? (
                    <div className="flex items-center">
                      <Loader className="w-4 h-4 mr-2 animate-spin" />
                      Yükleniyor...
                    </div>
                  ) : (
                    'Daha Fazla Sonuç'
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!loading && results.length === 0 && query && (
          <div className="text-center py-8 lg:py-12">
            <FileText className="w-12 lg:w-16 h-12 lg:h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Sonuç bulunamadı
            </h3>
            <p className="text-gray-600">
              "{query}" için arama sonucu bulunamadı. Farklı anahtar kelimeler deneyin.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// Result Card Component
const ResultCard = ({ result, onAddToFavorites, onAskAI, profile }) => {
  const [showModal, setShowModal] = useState(false)

  const formatDate = (dateString) => {
    if (!dateString) return 'Tarih belirtilmemiş'
    
    try {
      const date = new Date(dateString)
      // Geçersiz tarih kontrolü
      if (isNaN(date.getTime())) {
        return 'Geçersiz tarih'
      }
      return new Intl.DateTimeFormat('tr-TR').format(date)
    } catch (error) {
      console.warn('Tarih formatlanırken hata:', dateString, error)
      return 'Tarih formatlanamadı'
    }
  }

  const getTypeColor = (type) => {
    const colors = {
      'KANUN': 'bg-blue-100 text-blue-800',
      'YONETMELIK': 'bg-green-100 text-green-800',
      'TEBLIG': 'bg-yellow-100 text-yellow-800',
      'KARAR': 'bg-purple-100 text-purple-800',
      'GENELGE': 'bg-gray-100 text-gray-800'
    }
    return colors[type] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="card p-4 lg:p-6 hover:shadow-lg transition-shadow">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-4 gap-4">
        <div className="flex-1">
          <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-3 mb-2">
            <h3 className="text-base lg:text-lg font-semibold text-gray-900 line-clamp-2">
              {result.mevzuat_adi || result.adi || 'Başlık Bulunamadı'}
            </h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(result.mevzuat_tur?.adi || result.tip)} self-start lg:self-auto`}>
              {result.mevzuat_tur?.adi || result.tip || 'TÜR'}
            </span>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600 mb-3">
            <span className="flex items-center">
              <FileText className="w-4 h-4 mr-1" />
              Sayı: {result.mevzuat_no || result.sayi || 'Belirtilmemiş'}
            </span>
            <span className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {formatDate(result.resmi_gazete_tarihi || result.tarih)}
            </span>
            <span>{result.madde_sayisi || 'Bilinmeyen'} madde</span>
          </div>
          
          <p className="text-gray-700 mb-4 line-clamp-3">
            {result.ozet || result.mevzuat_adi || 'Bu mevzuat için özet bilgi bulunmamaktadır.'}
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary text-sm py-2 px-4"
          >
            Detayları Gör
          </button>
          <button
            onClick={() => onAddToFavorites(result)}
            className="btn-secondary flex items-center justify-center text-sm py-2 px-4"
          >
            <Heart className="w-4 h-4 mr-1" />
            Favorile
          </button>
        </div>
        
        <button 
          onClick={() => onAskAI?.(result)}
          className="flex items-center justify-center text-primary-600 hover:text-primary-700 font-medium hover:bg-primary-50 px-3 py-2 rounded-md transition-colors text-sm"
        >
          <MessageCircle className="w-4 h-4 mr-1" />
          AI'ya Sor
        </button>
      </div>

      {/* Detay Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-lg p-4 lg:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg lg:text-xl font-bold text-gray-900">Mevzuat Detayları</h2>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {result.mevzuat_adi || result.adi || 'Başlık Bulunamadı'}
                </h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(result.mevzuat_tur?.adi || result.tip)}`}>
                    {result.mevzuat_tur?.adi || result.tip || 'TÜR'}
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                    Sayı: {result.mevzuat_no || result.sayi || 'Belirtilmemiş'}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <strong className="block text-sm font-medium text-gray-700">Yayım Tarihi:</strong>
                  <span className="text-gray-900">{formatDate(result.resmi_gazete_tarihi || result.yayim_tarihi || result.tarih)}</span>
                </div>
                <div>
                  <strong className="block text-sm font-medium text-gray-700">Madde Sayısı:</strong>
                  <span className="text-gray-900">{result.madde_sayisi || 'Belirtilmemiş'}</span>
                </div>
                <div>
                  <strong className="block text-sm font-medium text-gray-700">Mevzuat ID:</strong>
                  <span className="text-gray-900">{result.mevzuat_id || result.id || 'Belirtilmemiş'}</span>
                </div>
                <div>
                  <strong className="block text-sm font-medium text-gray-700">Kategori:</strong>
                  <span className="text-gray-900">{result.kategori || result.mevzuat_tur?.adi || 'Genel'}</span>
                </div>
              </div>
              
              <div>
                <strong className="block text-sm font-medium text-gray-700 mb-2">Açıklama:</strong>
                <p className="text-gray-700 leading-relaxed">
                  {result.ozet || result.mevzuat_adi || 'Bu mevzuat için detaylı açıklama bulunmamaktadır.'}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                <button 
                  onClick={() => window.open(`https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=${result.mevzuat_no || result.sayi}&MevzuatTur=${result.mevzuat_tur?.kod || '1'}&MevzuatTertip=5`, '_blank')}
                  className="btn-primary flex-1"
                >
                  📄 Tam Metni Görüntüle
                </button>
                <button 
                  onClick={() => onAddToFavorites(result)}
                  className="btn-secondary flex items-center justify-center"
                >
                  <Heart className="w-4 h-4 mr-1" />
                  Favorile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchPage