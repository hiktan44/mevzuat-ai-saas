import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from '../utils/supabase'

// Components
import Sidebar from '../components/Sidebar'
import DashboardHome from '../components/DashboardHome'
import SearchPage from '../components/SearchPage'
import FavoritesPage from '../components/FavoritesPage'
import ChatsPage from '../components/ChatsPage'
import SettingsPage from '../components/SettingsPage'

const Dashboard = () => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)

        if (user) {
          // Development kullanıcısı için mock profile
          if (user.id === 'dev-user-id' || user.id === 'auto-test-user-id') {
            console.log('🔧 Using mock profile for development user')
            setProfile({
              id: user.id,
              email: user.email,
              full_name: user.user_metadata?.full_name || 'Development User',
              daily_search_count: 19,
              daily_ai_count: 0,
              created_at: new Date().toISOString()
            })
            setLoading(false)
            return
          }

          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()

          if (error) {
            console.error('Profile fetch error:', error)
          } else {
            setProfile(profile)
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar user={user} profile={profile} />
      
      <div className="flex-1 ml-64">
        <main className="p-8">
          <Routes>
            <Route index element={<DashboardHome profile={profile} />} />
            <Route path="search" element={<SearchPage profile={profile} />} />
            <Route path="favorites" element={<FavoritesPage profile={profile} />} />
            <Route path="chats" element={<ChatsPage profile={profile} />} />
            <Route path="settings" element={<SettingsPage profile={profile} />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default Dashboard