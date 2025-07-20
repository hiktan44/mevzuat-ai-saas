import React, { useState, useEffect } from 'react'
import { MessageCircle, Plus, Trash2, Clock, Search } from 'lucide-react'
import { supabase } from '../utils/supabase'
import toast from 'react-hot-toast'

const ChatsPage = ({ profile }) => {
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedConversation, setSelectedConversation] = useState(null)

  useEffect(() => {
    fetchConversations()
    
    // SearchPage'den gelen mevzuat için otomatik sohbet başlat
    const savedMevzuat = localStorage.getItem('selectedMevzuatForChat')
    if (savedMevzuat) {
      try {
        const mevzuatData = JSON.parse(savedMevzuat)
        
        // localStorage'i temizle
        localStorage.removeItem('selectedMevzuatForChat')
        
        // Otomatik sohbet başlat
        startAutoConversation(mevzuatData)
      } catch (error) {
        console.error('Mevzuat verisi okuma hatası:', error)
        localStorage.removeItem('selectedMevzuatForChat')
      }
    }
  }, [profile])

  const fetchConversations = async () => {
    if (!profile?.id) return

    try {
      const { data, error } = await supabase
        .from('ai_conversations')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching conversations:', error)
        toast.error('Sohbetler yüklenirken hata oluştu')
      } else {
        setConversations(data || [])
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const startAutoConversation = async (mevzuatData) => {
    try {
      // AI limit kontrolü
      if (profile?.daily_ai_count >= 20) {
        toast.error('Günlük AI sorgu limitinize ulaştınız! (20 sorgu/gün)')
        return
      }

      // Yeni sohbet oluştur
      const { data: newConversation, error } = await supabase
        .from('ai_conversations')
        .insert([{
          user_id: profile.id,
          title: `${mevzuatData.mevzuat_adi} Hakkında Soru`,
          messages: JSON.stringify([
            {
              role: 'system',
              content: `Bu sohbet ${mevzuatData.mevzuat_adi} (${mevzuatData.mevzuat_turu}, Sayı: ${mevzuatData.mevzuat_no}) hakkında başlatıldı. Mevzuat özeti: ${mevzuatData.ozet || 'Özet bulunmamaktadır'}`
            },
            {
              role: 'assistant',
              content: `Merhaba! ${mevzuatData.mevzuat_adi} hakkında size nasıl yardımcı olabilirim? Bu ${mevzuatData.mevzuat_turu}'nun detayları, maddeleri, uygulama alanları veya diğer konularda sorularınızı yanıtlayabilirim.`
            }
          ])
        }])
        .select()
        .single()

      if (error) {
        throw error
      }

      // AI count'u artır
      await supabase
        .from('profiles')
        .update({ 
          daily_ai_count: (profile?.daily_ai_count || 0) + 1 
        })
        .eq('id', profile.id)

      // Sohbet listesini güncelle ve yeni sohbeti seç
      setConversations(prev => [newConversation, ...prev])
      setSelectedConversation(newConversation)
      
      toast.success(`${mevzuatData.mevzuat_adi} hakkında sohbet başlatıldı!`)
    } catch (error) {
      console.error('Auto conversation error:', error)
      toast.error('Otomatik sohbet başlatılırken hata oluştu')
    }
  }

  const deleteConversation = async (conversationId) => {
    try {
      const { error } = await supabase
        .from('ai_conversations')
        .delete()
        .eq('id', conversationId)

      if (error) {
        toast.error('Sohbet silinirken hata oluştu')
      } else {
        setConversations(conversations.filter(conv => conv.id !== conversationId))
        if (selectedConversation?.id === conversationId) {
          setSelectedConversation(null)
        }
        toast.success('Sohbet silindi')
      }
    } catch (error) {
      console.error('Error deleting conversation:', error)
      toast.error('Bir hata oluştu')
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Sohbetler</h1>
          <p className="text-gray-600">
            Mevzuat hakkında yaptığınız AI sohbetlerini görüntüleyin
          </p>
        </div>
        <button className="btn-primary flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Yeni Sohbet
        </button>
      </div>

      {/* Usage Info */}
      <div className="card p-4 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900">Günlük AI Kullanımı</p>
            <p className="text-2xl font-bold text-gray-900">
              {profile?.daily_ai_count || 0} / 20
            </p>
          </div>
          <div className="w-32">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full" 
                style={{ width: `${((profile?.daily_ai_count || 0) / 20) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Conversations List */}
      {conversations.length > 0 ? (
        <div className="space-y-4">
          {conversations.map(conversation => (
            <div key={conversation.id} className="card p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <MessageCircle className="w-5 h-5 text-primary-600" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      {conversation.mevzuat_name}
                    </h3>
                    {conversation.madde_no && (
                      <span className="px-2 py-1 bg-primary-100 text-primary-800 rounded-full text-sm">
                        Madde {conversation.madde_no}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {formatDate(conversation.created_at)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <button 
                    onClick={() => setSelectedConversation(conversation)}
                    className="btn-primary"
                  >
                    Görüntüle
                  </button>
                  <button
                    onClick={() => deleteConversation(conversation.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Sohbeti Sil"
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
          <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Henüz AI sohbetiniz yok
          </h3>
          <p className="text-gray-600 mb-6">
            Mevzuat arama sonuçlarında "AI'ya Sor" butonunu kullanarak sohbet başlatabilirsiniz.
          </p>
          <button className="btn-primary flex items-center mx-auto">
            <Search className="w-4 h-4 mr-2" />
            Mevzuat Ara
          </button>
        </div>
      )}

      {/* Conversation Modal */}
      {selectedConversation && (
        <ConversationModal 
          conversation={selectedConversation}
          onClose={() => setSelectedConversation(null)}
        />
      )}
    </div>
  )
}

// Conversation Modal Component
const ConversationModal = ({ conversation, onClose }) => {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMessages()
  }, [conversation])

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_messages')
        .select('*')
        .eq('conversation_id', conversation.id)
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Error fetching messages:', error)
      } else {
        setMessages(data || [])
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {conversation.mevzuat_name}
              </h2>
              {conversation.madde_no && (
                <p className="text-gray-600">Madde {conversation.madde_no}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="p-6 max-h-96 overflow-y-auto custom-scrollbar">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ChatsPage