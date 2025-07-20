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
    if (!profile?.id) {
      console.log('No user profile, skipping recent searches fetch')
      return
    }

    try {
      const { data, error } = await supabase
        .from('search_history')
        .select('*')
        .eq('user_id', profile?.id)
        .order('created_at', { ascending: false })
        .limit(5)

      if (error) {
        console.error('Error fetching recent searches:', error)
        setRecentSearches([])
      } else {
        setRecentSearches(data || [])
      }
    } catch (error) {
      console.error('Error:', error)
      setRecentSearches([])
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

  const legalCategories = [
    {
      title: 'Anayasa Hukuku',
      description: 'Temel hak ve özgürlükler, devlet yapısı',
      icon: '📜',
      color: 'bg-red-50 border-red-200',
      textColor: 'text-red-800',
      laws: ['Türkiye Cumhuriyeti Anayasası', 'Anayasa Mahkemesi Kanunu', 'Siyasi Partiler Kanunu', 'Seçim Kanunu', 'Meclis İçtüzüğü', 'Cumhurbaşkanlığı Kararnameleri', 'İnsan Hakları Kanunu']
    },
    {
      title: 'İş Hukuku',
      description: 'Çalışma hayatı ve sosyal güvenlik',
      icon: '👔',
      color: 'bg-blue-50 border-blue-200',
      textColor: 'text-blue-800',
      laws: ['İş Kanunu (4857)', 'İş Sağlığı ve Güvenliği Kanunu', 'Sosyal Sigortalar Kanunu', 'İşsizlik Sigortası Kanunu', 'Sendikalar Kanunu', 'Toplu İş Sözleşmesi Kanunu', 'Emeklilik Kanunu', 'Asgari Ücret Tebliği']
    },
    {
      title: 'Ceza Hukuku',
      description: 'Suç ve cezalar, yargılama usulü',
      icon: '⚖️',
      color: 'bg-gray-50 border-gray-200',
      textColor: 'text-gray-800',
      laws: ['Türk Ceza Kanunu (5237)', 'Ceza Muhakemesi Kanunu (5271)', 'Ceza İnfaz Kanunu', 'Kabahatler Kanunu', 'Terörle Mücadele Kanunu', 'Uyuşturucu Kanunu', 'Adli Tıp Kanunu', 'Tanık Koruma Kanunu']
    },
    {
      title: 'Medeni Hukuk',
      description: 'Kişi, aile ve miras hukuku',
      icon: '👨‍👩‍👧‍👦',
      color: 'bg-green-50 border-green-200',
      textColor: 'text-green-800',
      laws: ['Türk Medeni Kanunu (4721)', 'Türk Borçlar Kanunu (6098)', 'Aile Mahkemeleri Kanunu', 'İcra ve İflas Kanunu', 'Noterlik Kanunu', 'Tapu Kanunu', 'Miras Kanunu', 'Evlat Edinme Kanunu']
    },
    {
      title: 'Vergi Hukuku',
      description: 'Vergi, resim ve harçlar',
      icon: '💰',
      color: 'bg-yellow-50 border-yellow-200',
      textColor: 'text-yellow-800',
      laws: ['Vergi Usul Kanunu', 'Gelir Vergisi Kanunu', 'Katma Değer Vergisi Kanunu', 'Kurumlar Vergisi Kanunu', 'Veraset ve İntikal Vergisi', 'Damga Vergisi Kanunu', 'Harçlar Kanunu', 'Gümrük Kanunu']
    },
    {
      title: 'Ticaret Hukuku',
      description: 'Ticari faaliyetler ve şirketler',
      icon: '🏢',
      color: 'bg-purple-50 border-purple-200',
      textColor: 'text-purple-800',
      laws: ['Türk Ticaret Kanunu (6102)', 'Rekabet Kanunu', 'Tüketicinin Korunması Kanunu', 'Marka Kanunu', 'Patent Kanunu', 'Sigortacılık Kanunu', 'Bankacılık Kanunu', 'Ticaret Sicili Tüzüğü']
    },
    {
      title: 'İdare Hukuku',
      description: 'Kamu yönetimi ve idari işlemler',
      icon: '🏛️',
      color: 'bg-indigo-50 border-indigo-200',
      textColor: 'text-indigo-800',
      laws: ['Devlet Memurları Kanunu', 'İdari Yargılama Usulü Kanunu', 'Kamu İhale Kanunu', 'Belediye Kanunu', 'İl İdaresi Kanunu', 'Köy Kanunu', 'Bilgi Edinme Kanunu', 'Kamu Personeli Kanunu']
    },
    {
      title: 'Sağlık Hukuku',
      description: 'Sağlık hizmetleri ve tıbbi düzenlemeler',
      icon: '🏥',
      color: 'bg-pink-50 border-pink-200',
      textColor: 'text-pink-800',
      laws: ['Hasta Hakları Yönetmeliği', 'Tababet ve Şuabatı Sanatı Kanunu', 'Eczacılar ve Eczaneler Kanunu', 'Sağlık Bakanlığı Kanunu', 'Organ Nakli Kanunu', 'Tıbbi Malzeme Kanunu', 'Hasta Güvenliği Kanunu']
    },
    {
      title: 'Eğitim Hukuku',
      description: 'Eğitim sistemi ve akademik düzenlemeler',
      icon: '📚',
      color: 'bg-orange-50 border-orange-200',
      textColor: 'text-orange-800',
      laws: ['Milli Eğitim Temel Kanunu', 'Yükseköğretim Kanunu', 'Özel Öğretim Kurumları Kanunu', 'Meslek Eğitimi Kanunu', 'Öğretmenlik Meslek Kanunu', 'Üniversite Tüzüğü', 'Yönetmelik Kanunu']
    },
    {
      title: 'Çevre Hukuku',
      description: 'Çevre koruma ve doğal kaynaklar',
      icon: '🌱',
      color: 'bg-emerald-50 border-emerald-200',
      textColor: 'text-emerald-800',
      laws: ['Çevre Kanunu', 'Orman Kanunu', 'Su Kirliliği Kontrolü Kanunu', 'Hava Kalitesi Kanunu', 'Atık Kanunu', 'Doğa Koruma Kanunu', 'Çevresel Etki Değerlendirmesi']
    },
    {
      title: 'Ulaştırma Hukuku',
      description: 'Karayolu, havayolu ve denizyolu',
      icon: '🚗',
      color: 'bg-cyan-50 border-cyan-200',
      textColor: 'text-cyan-800',
      laws: ['Karayolları Trafik Kanunu', 'Sivil Havacılık Kanunu', 'Denizcilik Kanunu', 'Kara Yolları Kanunu', 'Demiryolu Kanunu', 'Liman Kanunu', 'Sürücü Kursu Kanunu']
    },
          {
        title: 'İletişim Hukuku',
        description: 'Medya, internet ve teknoloji',
        icon: '📱',
        color: 'bg-violet-50 border-violet-200',
        textColor: 'text-violet-800',
        laws: ['Basın Kanunu', 'Radyo ve Televizyon Kanunu', 'İnternet Kanunu', 'Elektronik Haberleşme Kanunu', 'Kişisel Verilerin Korunması Kanunu', 'Telif Hakları Kanunu', 'Sosyal Medya Kanunu']
      },
      {
        title: 'Enerji Hukuku',
        description: 'Elektrik, doğalgaz ve yenilenebilir enerji',
        icon: '⚡',
        color: 'bg-amber-50 border-amber-200',
        textColor: 'text-amber-800',
        laws: ['Elektrik Piyasası Kanunu', 'Doğalgaz Piyasası Kanunu', 'Petrol Kanunu', 'Yenilenebilir Enerji Kanunu', 'Enerji Verimliliği Kanunu', 'Nükleer Kanunu', 'Maden Kanunu', 'EPDK Kanunu']
      },
      {
        title: 'Tarım Hukuku',
        description: 'Tarım, hayvancılık ve gıda güvenliği',
        icon: '🚜',
        color: 'bg-lime-50 border-lime-200',
        textColor: 'text-lime-800',
        laws: ['Tarım Kanunu', 'Veteriner Hizmetleri Kanunu', 'Gıda Kanunu', 'Tohum Kanunu', 'Su Ürünleri Kanunu', 'Arıcılık Kanunu', 'Tarımsal Araştırmalar Kanunu', 'Kooperatifler Kanunu']
      },
      {
        title: 'Turizm Hukuku',
        description: 'Turizm işletmeleri ve hizmetleri',
        icon: '🏨',
        color: 'bg-sky-50 border-sky-200',
        textColor: 'text-sky-800',
        laws: ['Turizmi Teşvik Kanunu', 'Turizm İşletmeleri Kanunu', 'Kültür ve Turizm Bakanlığı Kanunu', 'Otel İşletme Kanunu', 'Rehberlik Kanunu', 'Termal Turizm Kanunu', 'Kış Turizmi Kanunu']
      },
      {
        title: 'Devlet Destekleri',
        description: 'Teşvikler, hibeler ve mali destekler',
        icon: '🎯',
        color: 'bg-rose-50 border-rose-200',
        textColor: 'text-rose-800',
        laws: ['Yatırım Teşvik Kanunu', 'KOBİ Destekleri Kanunu', 'TÜBİTAK Kanunu', 'KOSGEB Kanunu', 'İhracat Teşvik Kanunu', 'Tarımsal Destekler Kanunu', 'İstihdam Teşvik Kanunu', 'Bölgesel Kalkınma Kanunu']
      },
      {
        title: 'Sosyal Güvenlik',
        description: 'Emeklilik, sağlık ve sosyal yardımlar',
        icon: '🛡️',
        color: 'bg-teal-50 border-teal-200',
        textColor: 'text-teal-800',
        laws: ['Sosyal Güvenlik Kanunu', 'Emekli Sandığı Kanunu', 'SGK Kanunu', 'Sosyal Yardımlaşma Kanunu', 'Aile Yardımları Kanunu', 'Engelli Hakları Kanunu', 'Yaşlı Bakım Kanunu', 'Sosyal Hizmetler Kanunu']
      },
      {
        title: 'Bankacılık Hukuku',
        description: 'Bankalar, krediler ve finansal işlemler',
        icon: '🏦',
        color: 'bg-slate-50 border-slate-200',
        textColor: 'text-slate-800',
        laws: ['Bankacılık Kanunu', 'BDDK Kanunu', 'Kredi Kartları Kanunu', 'Tüketici Kredileri Kanunu', 'Leasing Kanunu', 'Factoring Kanunu', 'TCMB Kanunu', 'Sermaye Piyasası Kanunu']
      }
  ]

  const handleCategorySearch = (categoryTitle) => {
    const searchTerm = categoryTitle.toLowerCase()
    window.location.href = `/dashboard/search?q=${encodeURIComponent(searchTerm)}`
  }

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



      {/* Legal Categories */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Kanun Kategorileri</h2>
            <p className="text-gray-600 mt-1">Hangi konularda arama yapabileceğinizi keşfedin</p>
          </div>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
          {legalCategories.map((category, index) => (
                          <div
                key={index}
                onClick={() => handleCategorySearch(category.title)}
                className={`${category.color} border-2 rounded-xl p-4 lg:p-5 cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}
              >
              {/* Category Header */}
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-3">{category.icon}</span>
                <div className="flex-1">
                  <h3 className={`text-base lg:text-lg font-bold ${category.textColor}`}>
                    {category.title}
                  </h3>
                  <p className="text-xs lg:text-sm text-gray-600 mt-1">
                    {category.description}
                  </p>
                </div>
                <ChevronRight className={`w-5 h-5 ${category.textColor} opacity-60`} />
              </div>

              {/* Popular Laws */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Popüler Kanunlar
                </p>
                <div className="space-y-1">
                  {category.laws.slice(0, 3).map((law, lawIndex) => (
                    <div 
                      key={lawIndex}
                      className="text-xs lg:text-sm text-gray-700 hover:text-gray-900 transition-colors flex items-center"
                    >
                      <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
                      {law}
                    </div>
                  ))}
                  {category.laws.length > 3 && (
                    <div className="text-xs text-gray-500 mt-2">
                      +{category.laws.length - 3} daha...
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Kategorilere tıklayarak o alanda arama yapabilir, 
            <Link to="/dashboard/search" className="text-primary-600 hover:text-primary-700 font-medium ml-1">
              detaylı arama sayfasından
            </Link> tüm mevzuatlara erişebilirsiniz.
          </p>
        </div>
      </div>

      {/* AI Capabilities Section */}
      <div>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">🤖 AI Asistanınızla Neler Yapabilirsiniz?</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Gelişmiş mevzuat veritabanımız ve AI teknolojimizle hukuki sorularınıza anında yanıt alın
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* AI Features */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200 rounded-xl p-6">
            <div className="flex items-center mb-4">
              <div className="bg-blue-500 p-3 rounded-full text-white mr-4">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-blue-800">Akıllı Mevzuat Arama</h3>
            </div>
            <div className="space-y-2 text-sm text-blue-700">
              <p>• Kanun numarasıyla direkt erişim (örn: "5237")</p>
              <p>• İçerik içinde tam metin arama</p>
              <p>• 140.000+ mevzuat arasında anlık arama</p>
              <p>• Güncel ve mülga mevzuat ayrımı</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-100 border border-green-200 rounded-xl p-6">
            <div className="flex items-center mb-4">
              <div className="bg-green-500 p-3 rounded-full text-white mr-4">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-green-800">Madde Bazında Analiz</h3>
            </div>
            <div className="space-y-2 text-sm text-green-700">
              <p>• Hiyerarşik madde ağacı görüntüleme</p>
              <p>• Bölüm ve kısım bazında organizasyon</p>
              <p>• Markdown formatında net içerik</p>
              <p>• İlgili maddeleri otomatik bağlama</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-violet-100 border border-purple-200 rounded-xl p-6">
            <div className="flex items-center mb-4">
              <div className="bg-purple-500 p-3 rounded-full text-white mr-4">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-purple-800">AI Yorumlama</h3>
            </div>
            <div className="space-y-2 text-sm text-purple-700">
              <p>• Karmaşık maddeleri basit dille açıklama</p>
              <p>• Hukuki kavramları örneklerle anlatma</p>
              <p>• İlgili mevzuatları otomatik önerme</p>
              <p>• Güncel değişiklikleri takip etme</p>
            </div>
          </div>
        </div>

        {/* Real Examples */}
        <div className="bg-gray-50 rounded-2xl p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">💬 AI ile Yapabileceğiniz Sorgular</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm mr-2">Kanun Arama</span>
              </h4>
              <div className="space-y-2 text-sm text-gray-600">
                <p className="bg-white p-3 rounded border-l-4 border-blue-400">
                  "İş Kanunu 5237 nedir?" → Direkt kanun numarasıyla arama
                </p>
                <p className="bg-white p-3 rounded border-l-4 border-blue-400">
                  "Kişisel verilerin korunması hakkında kanun" → İsimle arama
                </p>
                <p className="bg-white p-3 rounded border-l-4 border-blue-400">
                  "Enerji piyasası düzenlemeleri neler?" → Konusal arama
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm mr-2">Detaylı Analiz</span>
              </h4>
              <div className="space-y-2 text-sm text-gray-600">
                <p className="bg-white p-3 rounded border-l-4 border-green-400">
                  "TCK 123. madde ne diyor?" → Belirli madde açıklaması
                </p>
                <p className="bg-white p-3 rounded border-l-4 border-green-400">
                  "Vergi kanununda kimlere istisna var?" → Kapsamlı analiz
                </p>
                <p className="bg-white p-3 rounded border-l-4 border-green-400">
                  "Bu durumda hangi kanun geçerli?" → Hukuki danışmanlık
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link
              to="/dashboard/chats"
              className="inline-flex items-center bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              <TrendingUp className="w-5 h-5 mr-2" />
              AI Asistanı Deneyin
            </Link>
          </div>
        </div>
      </div>

      {/* Technical Capabilities */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-6">🔧 Teknik Özelliklerimiz</h2>
        
        <div className="grid md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-2xl font-bold text-blue-600">140.000+</div>
            <div className="text-sm text-blue-800 font-medium">Mevzuat</div>
            <div className="text-xs text-gray-600 mt-1">Kanun, Yönetmelik, Tebliğ</div>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="text-2xl font-bold text-green-600">12</div>
            <div className="text-sm text-green-800 font-medium">Mevzuat Türü</div>
            <div className="text-xs text-gray-600 mt-1">Kanun'dan Tebliğ'e</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="text-2xl font-bold text-purple-600">Anlık</div>
            <div className="text-sm text-purple-800 font-medium">Arama</div>
            <div className="text-xs text-gray-600 mt-1">Milisaniye hızında</div>
          </div>
          
          <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
            <div className="text-2xl font-bold text-orange-600">7/24</div>
            <div className="text-sm text-orange-800 font-medium">AI Asistan</div>
            <div className="text-xs text-gray-600 mt-1">Kesintisiz hizmet</div>
          </div>
        </div>

        <div className="mt-6 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Mevzuat MCP Entegrasyonu</h3>
              <p className="text-gray-600 mt-1">
                Resmi Mevzuat veritabanıyla direkt bağlantı. Güncel, güvenilir ve kapsamlı.
              </p>
            </div>
            <div className="text-4xl">⚡</div>
          </div>
        </div>
      </div>

      {/* Recent Searches - Moved to Bottom */}
      {recentSearches.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-gray-500" />
              Son Aramalarınız
            </h2>
            <Link 
              to="/dashboard/search" 
              className="text-primary-600 hover:text-primary-700 font-medium flex items-center text-sm"
            >
              Tümünü Gör
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          <div className="card bg-gray-50">
            <div className="divide-y divide-gray-200">
              {recentSearches.map((search, index) => (
                <div key={index} className="p-3 hover:bg-white transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-1 text-sm">
                        "{search.query}"
                      </p>
                      <div className="flex items-center text-xs text-gray-500">
                        <span>{formatDate(search.created_at)}</span>
                        {search.mevzuat_types && (
                          <span className="ml-3 px-2 py-1 bg-gray-100 rounded text-xs">
                            {search.mevzuat_types.join(', ')}
                          </span>
                        )}
                      </div>
                    </div>
                    <Link
                      to={`/dashboard/search?q=${encodeURIComponent(search.query)}`}
                      className="text-primary-600 hover:text-primary-700 ml-4 p-1"
                    >
                      <ArrowRight className="w-4 h-4" />
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