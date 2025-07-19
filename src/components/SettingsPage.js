import React, { useState } from 'react'
import { User, Lock, Bell, Shield, LogOut, Save } from 'lucide-react'
import { supabase, signOut } from '../utils/supabase'
import toast from 'react-hot-toast'

const SettingsPage = ({ profile }) => {
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: profile?.full_name || '',
    email: profile?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const tabs = [
    { id: 'profile', label: 'Profil Bilgileri', icon: <User className="w-4 h-4" /> },
    { id: 'security', label: 'Güvenlik', icon: <Lock className="w-4 h-4" /> },
    { id: 'notifications', label: 'Bildirimler', icon: <Bell className="w-4 h-4" /> },
    { id: 'privacy', label: 'Gizlilik', icon: <Shield className="w-4 h-4" /> }
  ]

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const updateProfile = async () => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.fullName,
          email: formData.email
        })
        .eq('id', profile.id)

      if (error) {
        toast.error('Profil güncellenirken hata oluştu')
      } else {
        toast.success('Profil başarıyla güncellendi')
      }
    } catch (error) {
      console.error('Profile update error:', error)
      toast.error('Beklenmeyen bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const updatePassword = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Yeni şifreler eşleşmiyor')
      return
    }

    if (formData.newPassword.length < 6) {
      toast.error('Yeni şifre en az 6 karakter olmalıdır')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({
        password: formData.newPassword
      })

      if (error) {
        toast.error('Şifre güncellenirken hata oluştu')
      } else {
        toast.success('Şifre başarıyla güncellendi')
        setFormData({
          ...formData,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
      }
    } catch (error) {
      console.error('Password update error:', error)
      toast.error('Beklenmeyen bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    if (window.confirm('Çıkış yapmak istediğinizden emin misiniz?')) {
      try {
        await signOut()
        toast.success('Başarıyla çıkış yapıldı')
      } catch (error) {
        toast.error('Çıkış yapılırken bir hata oluştu')
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Ayarlar</h1>
        <p className="text-gray-600">
          Hesap ayarlarınızı ve tercihlerinizi yönetin
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {tab.icon}
                <span className="ml-3">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="card p-6">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Profil Bilgileri</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ad Soyad
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      E-posta Adresi
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={updateProfile}
                    disabled={loading}
                    className="btn-primary flex items-center"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {loading ? 'Kaydediliyor...' : 'Kaydet'}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Güvenlik Ayarları</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mevcut Şifre
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Yeni Şifre
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Yeni Şifre Tekrar
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={updatePassword}
                    disabled={loading}
                    className="btn-primary flex items-center"
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    {loading ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Bildirim Tercihleri</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">E-posta Bildirimleri</h3>
                      <p className="text-sm text-gray-500">Önemli güncellemeler için e-posta alın</p>
                    </div>
                    <input type="checkbox" className="rounded" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Mevzuat Güncellemeleri</h3>
                      <p className="text-sm text-gray-500">Yeni mevzuat yayınlandığında bilgilendirilme</p>
                    </div>
                    <input type="checkbox" className="rounded" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">AI Önerileri</h3>
                      <p className="text-sm text-gray-500">Arama geçmişinize göre öneriler</p>
                    </div>
                    <input type="checkbox" className="rounded" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Gizlilik Ayarları</h2>
                
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Veri Kullanımı</h3>
                    <p className="text-sm text-gray-600">
                      Arama geçmişiniz ve AI sohbet verileriniz yalnızca hizmet kalitesini 
                      artırmak için kullanılır ve üçüncü taraflarla paylaşılmaz.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-red-50 rounded-lg">
                    <h3 className="text-sm font-medium text-red-900 mb-2">Hesap Silme</h3>
                    <p className="text-sm text-red-600 mb-3">
                      Hesabınızı silmek, tüm verilerinizin kalıcı olarak silinmesine neden olur.
                    </p>
                    <button className="text-red-600 hover:text-red-700 font-medium text-sm">
                      Hesabımı Sil
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sign Out Section */}
      <div className="card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Çıkış Yap</h3>
            <p className="text-gray-600">Hesabınızdan güvenli bir şekilde çıkış yapın</p>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center text-red-600 hover:text-red-700 font-medium"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Çıkış Yap
          </button>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage