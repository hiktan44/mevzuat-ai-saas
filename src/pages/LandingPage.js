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