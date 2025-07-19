import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Scale, 
  Search, 
  Heart, 
  MessageCircle, 
  Settings, 
  LogOut,
  User
} from 'lucide-react'
import { signOut } from '../utils/supabase'
import toast from 'react-hot-toast'

const Sidebar = ({ user, profile }) => {
  const location = useLocation()

  const menuItems = [
    {
      path: '/dashboard',
      icon: <Search className="w-5 h-5" />,
      label: 'Arama',
      exact: true
    },
    {
      path: '/dashboard/search',
      icon: <Search className="w-5 h-5" />,
      label: 'Gelişmiş Arama'
    },
    {
      path: '/dashboard/favorites',
      icon: <Heart className="w-5 h-5" />,
      label: 'Favorilerim'
    },
    {
      path: '/dashboard/chats',
      icon: <MessageCircle className="w-5 h-5" />,
      label: 'AI Sohbetler'
    },
    {
      path: '/dashboard/settings',
      icon: <Settings className="w-5 h-5" />,
      label: 'Ayarlar'
    }
  ]

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success('Başarıyla çıkış yapıldı')
    } catch (error) {
      toast.error('Çıkış yapılırken bir hata oluştu')
    }
  }

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path
    }
    return location.pathname.startsWith(path)
  }

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
      {/* Header */}
      <div className="flex items-center px-6 py-4 border-b">
        <Scale className="h-8 w-8 text-primary-600 mr-3" />
        <span className="text-xl font-bold text-gray-900">Mevzuat AI</span>
      </div>

      {/* User Info */}
      <div className="px-6 py-4 border-b bg-gray-50">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-primary-600" />
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-900 truncate">
              {profile?.full_name || user?.email?.split('@')[0] || 'Kullanıcı'}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user?.email}
            </p>
          </div>
        </div>
      </div>

      {/* Usage Stats */}
      <div className="px-6 py-4 border-b bg-gradient-to-r from-primary-50 to-blue-50">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Günlük Arama</span>
            <span className="text-sm font-medium text-gray-900">
              {profile?.daily_search_count || 0}/50
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-600 h-2 rounded-full" 
              style={{ width: `${((profile?.daily_search_count || 0) / 50) * 100}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between items-center mt-3">
            <span className="text-sm text-gray-600">AI Sorguları</span>
            <span className="text-sm font-medium text-gray-900">
              {profile?.daily_ai_count || 0}/20
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full" 
              style={{ width: `${((profile?.daily_ai_count || 0) / 20) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
              isActive(item.path, item.exact)
                ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            {item.icon}
            <span className="ml-3">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t">
        <button
          onClick={handleSignOut}
          className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="ml-3">Çıkış Yap</span>
        </button>
      </div>
    </div>
  )
}

export default Sidebar