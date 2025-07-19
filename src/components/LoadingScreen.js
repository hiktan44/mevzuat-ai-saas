import React from 'react'

const LoadingScreen = () => {
  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Mevzuat AI</h2>
        <p className="text-gray-500">Yükleniyor...</p>
      </div>
    </div>
  )
}

export default LoadingScreen