import React from 'react'
import { Link } from 'react-router-dom'
import { 
  Scale, 
  Brain, 
  Search, 
  Clock, 
  Shield, 
  Star,
  ArrowRight,
  CheckCircle
} from 'lucide-react'

const LandingPage = () => {
  const features = [
    {
      icon: <Brain className="w-8 h-8 text-primary-600" />,
      title: "AI Asistan",
      description: "Yapay zeka ile mevzuatı anlamanızı kolaylaştırır"
    },
    {
      icon: <Search className="w-8 h-8 text-primary-600" />,
      title: "Hızlı Arama",
      description: "Milyonlarca hukuki metinden saniyeler içinde bulun"
    },
    {
      icon: <Clock className="w-8 h-8 text-primary-600" />,
      title: "Güncel Veri",
      description: "Her zaman en güncel mevzuat bilgilerine erişin"
    },
    {
      icon: <Shield className="w-8 h-8 text-primary-600" />,
      title: "Güvenli Platform",
      description: "Verileriniz şifreli ve güvenli bir şekilde saklanır"
    }
  ]

  const benefits = [
    "Karmaşık hukuki metinleri basit Türkçe ile açıklar",
    "7/24 erişilebilir AI asistan desteği",
    "Tüm Türkiye mevzuatına tek platformdan erişim",
    "Kişiselleştirilmiş favoriler ve geçmiş"
  ]

  const legalCategories = [
    { title: 'Anayasa Hukuku', icon: '📜', description: 'Temel hak ve özgürlükler, devlet yapısı' },
    { title: 'İş Hukuku', icon: '👔', description: 'Çalışma hayatı ve sosyal güvenlik' },
    { title: 'Ceza Hukuku', icon: '⚖️', description: 'Suç ve cezalar, yargılama usulü' },
    { title: 'Medeni Hukuk', icon: '👨‍👩‍👧‍👦', description: 'Kişi, aile ve miras hukuku' },
    { title: 'Vergi Hukuku', icon: '💰', description: 'Vergi, resim ve harçlar' },
    { title: 'Ticaret Hukuku', icon: '🏢', description: 'Ticari faaliyetler ve şirketler' },
    { title: 'İdare Hukuku', icon: '🏛️', description: 'Kamu yönetimi ve idari işlemler' },
    { title: 'Sağlık Hukuku', icon: '🏥', description: 'Sağlık hizmetleri ve tıbbi düzenlemeler' },
    { title: 'Eğitim Hukuku', icon: '📚', description: 'Eğitim sistemi ve akademik düzenlemeler' },
    { title: 'Çevre Hukuku', icon: '🌱', description: 'Çevre koruma ve doğal kaynaklar' },
    { title: 'Enerji Hukuku', icon: '⚡', description: 'Elektrik, doğalgaz ve yenilenebilir enerji' },
    { title: 'Bankacılık Hukuku', icon: '🏦', description: 'Bankalar, krediler ve finansal işlemler' }
  ]

  const aiCapabilities = [
    {
      title: "Akıllı Mevzuat Arama",
      icon: "🔍",
      features: ["140.000+ mevzuat arasında anlık arama", "Kanun numarasıyla direkt erişim", "İçerik içinde tam metin arama"]
    },
    {
      title: "Madde Bazında Analiz", 
      icon: "📊",
      features: ["Hiyerarşik madde ağacı görüntüleme", "Bölüm ve kısım bazında organizasyon", "Markdown formatında net içerik"]
    },
    {
      title: "AI Yorumlama",
      icon: "🤖", 
      features: ["Karmaşık maddeleri basit dille açıklama", "Hukuki kavramları örneklerle anlatma", "İlgili mevzuatları otomatik önerme"]
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Scale className="h-8 w-8 text-primary-600 mr-3" />
              <span className="text-2xl font-bold text-gray-900">Mevzuat AI</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Giriş Yap
              </Link>
              <Link
                to="/register"
                className="btn-primary"
              >
                Üye Ol
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="gradient-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Türkiye Mevzuatı 
              <span className="text-primary-600 block">Artık Daha Anlaşılır</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Yapay zeka destekli platformumuzla karmaşık hukuki metinleri kolayca anlayın. 
              Kanunlar, yönetmelikler ve tebliğlere hızla erişin.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center bg-primary-600 hover:bg-primary-700 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Ücretsiz Başla
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center bg-white hover:bg-gray-50 text-gray-800 font-semibold py-4 px-8 rounded-lg border-2 border-gray-200 transition-all duration-300"
              >
                Zaten Üye Misiniz?
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Neden Mevzuat AI?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Modern teknoloji ile hukuki metinlere erişimi kolaylaştırıyoruz
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="bg-primary-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-100 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Hukuki Metinleri Anlamak 
                <span className="text-primary-600">Hiç Bu Kadar Kolay Olmamıştı</span>
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Karmaşık hukuki terminoloji yerine günlük dilde açıklamalar alın. 
                AI asistanımız size yardımcı olmaya hazır.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <div className="space-y-4">
                <div className="bg-gray-100 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-2">Kullanıcı Sorusu:</p>
                  <p className="text-gray-800">"İş Kanunu 25. madde ne diyor?"</p>
                </div>
                
                <div className="bg-primary-50 rounded-lg p-4">
                  <p className="text-sm text-primary-600 mb-2">AI Asistan:</p>
                  <p className="text-gray-800">
                    "İş Kanunu'nun 25. maddesi, işverenin işçiye eşit davranma yükümlülüğünü düzenler. 
                    Bu maddeye göre işveren, aynı işyerinde çalışan işçiler arasında..."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Legal Categories Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              18 Ana Hukuk Dalında Uzmanlaştık
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Anayasa'dan Bankacılık'a, Türkiye'nin tüm önemli hukuk alanlarında kapsamlı mevzuat desteği
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {legalCategories.map((category, index) => (
              <div key={index} className="bg-gray-50 hover:bg-gray-100 rounded-xl p-6 text-center transition-all duration-300 transform hover:-translate-y-1 border border-gray-200">
                <div className="text-3xl mb-3">{category.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {category.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {category.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-6">
              <strong>140.000+</strong> mevzuat, <strong>12</strong> farklı mevzuat türü, 
              <strong>18</strong> ana hukuk dalı
            </p>
            <Link
              to="/register"
              className="inline-flex items-center bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
            >
              Tüm Kategorileri Keşfedin
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* AI Capabilities Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              🤖 Gelişmiş AI Yetenekleri
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Mevzuat MCP entegrasyonu ile Claude AI'ın tüm gücünü hukuki metinler için kullanın
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {aiCapabilities.map((capability, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg border border-blue-200">
                <div className="text-4xl mb-4 text-center">{capability.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                  {capability.title}
                </h3>
                <ul className="space-y-3">
                  {capability.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Example Queries */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              💬 AI ile Yapabileceğiniz Sorgular
            </h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm mr-3">Kanun Arama</span>
                </h4>
                <div className="space-y-3">
                  <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-400">
                    <p className="text-sm text-gray-800">"İş Kanunu 4857 nedir?"</p>
                    <p className="text-xs text-gray-500 mt-1">→ Direkt kanun numarasıyla arama</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-400">
                    <p className="text-sm text-gray-800">"Kişisel verilerin korunması kanunu"</p>
                    <p className="text-xs text-gray-500 mt-1">→ İsimle arama</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm mr-3">Detaylı Analiz</span>
                </h4>
                <div className="space-y-3">
                  <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-green-400">
                    <p className="text-sm text-gray-800">"TCK 123. madde ne diyor?"</p>
                    <p className="text-xs text-gray-500 mt-1">→ Belirli madde açıklaması</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-green-400">
                    <p className="text-sm text-gray-800">"Bu durumda hangi kanun geçerli?"</p>
                    <p className="text-xs text-gray-500 mt-1">→ Hukuki danışmanlık</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Specs Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              🔧 Teknik Özelliklerimiz
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Resmi Mevzuat veritabanıyla direkt entegrasyon ve güçlü AI teknolojisi
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">140.000+</div>
              <div className="text-lg font-medium mb-1">Mevzuat</div>
              <div className="text-sm text-gray-400">Kanun, Yönetmelik, Tebliğ</div>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400 mb-2">12</div>
              <div className="text-lg font-medium mb-1">Mevzuat Türü</div>
              <div className="text-sm text-gray-400">Kanun'dan Tebliğ'e</div>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">Anlık</div>
              <div className="text-lg font-medium mb-1">Arama Hızı</div>
              <div className="text-sm text-gray-400">Milisaniye performans</div>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-400 mb-2">7/24</div>
              <div className="text-lg font-medium mb-1">AI Asistan</div>
              <div className="text-sm text-gray-400">Kesintisiz hizmet</div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-2xl p-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">⚡ Mevzuat MCP Entegrasyonu</h3>
                <p className="text-gray-300 mb-4">
                  Resmi Mevzuat veritabanıyla direkt bağlantı. Güncel, güvenilir ve kapsamlı veri erişimi.
                </p>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• search_mevzuat - Detaylı arama ve filtreleme</li>
                  <li>• get_mevzuat_article_tree - Hiyerarşik madde yapısı</li>
                  <li>• get_mevzuat_article_content - Tam metin içerik</li>
                </ul>
              </div>
              <div className="text-6xl">⚡</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Hemen Başlayın
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Ücretsiz hesabınızı oluşturun ve Türkiye mevzuatına AI destekli erişimin keyfini çıkarın.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center bg-white text-primary-600 font-semibold py-4 px-8 rounded-lg hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Ücretsiz Hesap Oluştur
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Scale className="h-8 w-8 text-primary-400 mr-3" />
              <span className="text-2xl font-bold text-white">Mevzuat AI</span>
            </div>
            <p className="text-gray-400 mb-4">
              Türkiye mevzuatını daha anlaşılır hale getiren AI destekli platform
            </p>
            <div className="flex justify-center space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Gizlilik Politikası</a>
              <a href="#" className="hover:text-white transition-colors">Kullanım Şartları</a>
              <a href="#" className="hover:text-white transition-colors">İletişim</a>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-800">
              <p className="text-gray-400 text-sm">
                © 2024 Mevzuat AI. Tüm hakları saklıdır.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage