import React, { useState, useEffect } from 'react'
import { Heart, Trash2, Calendar, FileText, Search } from 'lucide-react'
import { supabase } from '../utils/supabase'
import toast from 'react-hot-toast'

const FavoritesPage = ({ profile }) => {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFavorites()
  }, [profile])

  const fetchFavorites = async () => {
    if (!profile?.id) return

    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching favorites:', error)
        toast.error('Favoriler yüklenirken hata oluştu')
      } else {
        setFavorites(data || [])
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const removeFavorite = async (favoriteId) => {
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('id', favoriteId)

      if (error) {
        toast.error('Favorilerden kaldırılırken hata oluştu')
      } else {
        setFavorites(favorites.filter(fav => fav.id !== favoriteId))
        toast.success('Favorilerden kaldırıldı')
      }
    } catch (error) {
      console.error('Error removing favorite:', error)
      toast.error('Bir hata oluştu')
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Favorilerim</h1>
        <p className="text-gray-600">
          Kaydettiğiniz mevzuatlara buradan erişebilirsiniz
        </p>
      </div>

      {/* Favorites List */}
      {favorites.length > 0 ? (
        <div className="space-y-4">
          {favorites.map(favorite => (
            <div key={favorite.id} className="card p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Heart className="w-5 h-5 text-red-500 fill-current" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      {favorite.mevzuat_name}
                    </h3>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Eklenme: {formatDate(favorite.created_at)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <button className="btn-primary flex items-center">
                    <FileText className="w-4 h-4 mr-1" />
                    Görüntüle
                  </button>
                  <button
                    onClick={() => removeFavorite(favorite.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Favorilerden Kaldır"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Henüz favori mevzuatınız yok
          </h3>
          <p className="text-gray-600 mb-6">
            Arama yaptığınız mevzuatları favorilere ekleyerek buradan kolayca erişebilirsiniz.
          </p>
          <button className="btn-primary flex items-center mx-auto">
            <Search className="w-4 h-4 mr-2" />
            Mevzuat Ara
          </button>
        </div>
      )}
    </div>
  )
}

export default FavoritesPage