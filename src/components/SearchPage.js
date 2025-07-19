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
  Loader
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

  const mevzuatTypes = [
    { value: 'KANUN', label: 'Kanunlar', count: 2847 },
    { value: 'YONETMELIK', label: 'Yönetmelikler', count: 12450 },
    { value: 'TEBLIG', label: 'Tebliğler', count: 8932 },
    { value: 'KARAR', label: 'Kararlar', count: 5621 },
    { value: 'GENELGE', label: 'Genelgeler', count: 3218 }
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
      toast.error('Günlük arama limitinize ulaştınız!')
      return
    }

    setLoading(true)

    try {
      // Call real MCP API
      const apiResponse = await MevzuatAPI.searchMevzuat(searchQuery, selectedTypes)
      
      let searchResults = []
      
      if (apiResponse.success && apiResponse.data) {
        // Process API response
        searchResults = apiResponse.data.map(item => ({
          id: item.id || item.sayi || Math.random().toString(36),
          adi: item.adi || item.name || item.title,
          sayi: item.sayi || item.number,
          tarih: item.tarih || item.date,
          tip: item.tip || item.type || 'KANUN',
          ozet: item.ozet || item.summary || item.description || 'Açıklama bulunamadı',
          madde_sayisi: item.madde_sayisi || item.article_count || 0
        }))
        
        toast.success(`${searchResults.length} sonuç bulundu`)
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

      // Save to search history
      if (profile?.id) {
        await supabase.from('search_history').insert({
          user_id: profile.id,
          query: searchQuery,
          mevzuat_types: selectedTypes
        })

        // Update search count
        await supabase
          .from('profiles')
          .update({ 
            daily_search_count: (profile.daily_search_count || 0) + 1 
          })
          .eq('id', profile.id)
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

  const handleTypeChange = (type) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter(t => t !== type))
    } else {
      setSelectedTypes([...selectedTypes, type])
    }
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mevzuat Arama</h1>
        <p className="text-gray-600">
          Türkiye mevzuatında aradığınızı kolayca bulun
        </p>
      </div>

      {/* Search Form */}
      <div className="card p-6">
        <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Kanun adı, numarası veya anahtar kelime girin..."
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
            />
          </div>

          {/* Filters Toggle */}
          <div className="flex items-center justify-between">
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
              className="btn-primary px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
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
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
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
            <h2 className="text-xl font-semibold text-gray-900">
              Arama Sonuçları ({results.length})
            </h2>
          </div>

          <div className="space-y-4">
            {results.map(result => (
              <ResultCard 
                key={result.id} 
                result={result} 
                onAddToFavorites={addToFavorites}
                profile={profile}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && results.length === 0 && query && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Sonuç bulunamadı
          </h3>
          <p className="text-gray-600">
            "{query}" için arama sonucu bulunamadı. Farklı anahtar kelimeler deneyin.
          </p>
        </div>
      )}
    </div>
  )
}

// Result Card Component
const ResultCard = ({ result, onAddToFavorites, profile }) => {
  const [showModal, setShowModal] = useState(false)

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('tr-TR').format(date)
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
    <div className="card p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {result.adi}
            </h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(result.tip)}`}>
              {result.tip}
            </span>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
            <span className="flex items-center">
              <FileText className="w-4 h-4 mr-1" />
              Sayı: {result.sayi}
            </span>
            <span className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {formatDate(result.tarih)}
            </span>
            <span>{result.madde_sayisi} madde</span>
          </div>
          
          <p className="text-gray-700 mb-4">
            {result.ozet}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary"
          >
            Detayları Gör
          </button>
          <button
            onClick={() => onAddToFavorites(result)}
            className="btn-secondary flex items-center"
          >
            <Heart className="w-4 h-4 mr-1" />
            Favorile
          </button>
        </div>
        
        <button className="flex items-center text-primary-600 hover:text-primary-700 font-medium">
          <MessageCircle className="w-4 h-4 mr-1" />
          AI'ya Sor
        </button>
      </div>
    </div>
  )
}

export default SearchPage