import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Search, 
  Clock, 
  TrendingUp, 
  BookOpen,
  ArrowRight,
  ChevronRight
} from 'lucide-react'
import { supabase } from '../utils/supabase'

const DashboardHome = ({ profile }) => {
  const [recentSearches, setRecentSearches] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchRecentSearches()
  }, [])

  const fetchRecentSearches = async () => {
    try {
      const { data, error } = await supabase
        .from('search_history')
        .select('*')
        .eq('user_id', profile?.id)
        .order('created_at', { ascending: false })
        .limit(5)

      if (error) {
        console.error('Error fetching recent searches:', error)
      } else {
        setRecentSearches(data || [])
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const quickActions = [
    {
      title: 'Kanun Ara',
      description: 'Türkiye\'nin tüm kanunlarında arama yapın',
      icon: <BookOpen className="w-6 h-6" />,
      link: '/dashboard/search',
      color: 'bg-blue-500'
    },
    {
      title: 'AI Asistan',
      description: 'Mevzuat sorularınızı AI\'ya sorun',
      icon: <Search className="w-6 h-6" />,
      link: '/dashboard/chats',
      color: 'bg-green-500'
    },
    {
      title: 'Favorilerim',
      description: 'Kaydettiğiniz mevzuatlara erişin',
      icon: <Clock className="w-6 h-6" />,
      link: '/dashboard/favorites',
      color: 'bg-purple-500'
    }
  ]

  const handleQuickSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Redirect to search page with query
      window.location.href = `/dashboard/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('tr-TR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-blue-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Hoş geldiniz, {profile?.full_name?.split(' ')[0] || 'Kullanıcı'}!
        </h1>
        <p className="text-primary-100 text-lg mb-6">
          Türkiye mevzuatında aradığınızı bulmanız için buradayız
        </p>
        
        {/* Quick Search */}
        <form onSubmit={handleQuickSearch} className="flex gap-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Kanun, yönetmelik veya konu ara..."
            className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
          />
          <button
            type="submit"
            className="bg-white text-primary-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center"
          >
            <Search className="w-5 h-5 mr-2" />
            Ara
          </button>
        </form>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Günlük Arama</p>
              <p className="text-2xl font-bold text-gray-900">
                {profile?.daily_search_count || 0}
              </p>
              <p className="text-sm text-gray-500">50 limitten</p>
            </div>
            <div className="bg-primary-100 p-3 rounded-full">
              <Search className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">AI Sorguları</p>
              <p className="text-2xl font-bold text-gray-900">
                {profile?.daily_ai_count || 0}
              </p>
              <p className="text-sm text-gray-500">20 limitten</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Favori Sayısı</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
              <p className="text-sm text-gray-500">Toplam</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Hızlı İşlemler</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.link}
              className="card p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-center mb-4">
                <div className={`${action.color} p-3 rounded-full text-white mr-4`}>
                  {action.icon}
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 ml-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {action.title}
              </h3>
              <p className="text-gray-600">
                {action.description}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Son Aramalarınız</h2>
            <Link 
              to="/dashboard/search" 
              className="text-primary-600 hover:text-primary-700 font-medium flex items-center"
            >
              Tümünü Gör
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          <div className="card">
            <div className="divide-y divide-gray-200">
              {recentSearches.map((search, index) => (
                <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-1">
                        "{search.query}"
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        {formatDate(search.created_at)}
                        {search.mevzuat_types && (
                          <span className="ml-3 px-2 py-1 bg-gray-100 rounded text-xs">
                            {search.mevzuat_types.join(', ')}
                          </span>
                        )}
                      </div>
                    </div>
                    <Link
                      to={`/dashboard/search?q=${encodeURIComponent(search.query)}`}
                      className="text-primary-600 hover:text-primary-700 ml-4"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DashboardHome