import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY

// Mock mode for development (currently disabled - using real Supabase)
const isMockMode = false

let supabase = null

if (isMockMode) {
  console.log('🚨 MOCK MODE: Supabase URL geçersiz, mock data kullanılıyor')
  // Mock Supabase client
  // Mock user state
  let mockUser = null
  let mockAuthCallbacks = []

  supabase = {
    auth: {
      getSession: () => Promise.resolve({ 
        data: { 
          session: mockUser ? { user: mockUser } : null 
        } 
      }),
      getUser: () => Promise.resolve({
        data: { user: mockUser },
        error: null
      }),
      signUp: (data) => {
        mockUser = { id: 'mock-user-id', email: data.email }
        setTimeout(() => {
          mockAuthCallbacks.forEach(callback => callback('SIGNED_IN', { user: mockUser }))
        }, 100)
        return Promise.resolve({ data: { user: mockUser }, error: null })
      },
      signInWithPassword: (data) => {
        mockUser = { id: 'mock-user-id', email: data.email }
        setTimeout(() => {
          mockAuthCallbacks.forEach(callback => callback('SIGNED_IN', { user: mockUser }))
        }, 100)
        return Promise.resolve({ data: { user: mockUser }, error: null })
      },
      signInWithOAuth: () => {
        mockUser = { id: 'mock-user-id', email: 'mock@example.com' }
        setTimeout(() => {
          mockAuthCallbacks.forEach(callback => callback('SIGNED_IN', { user: mockUser }))
        }, 100)
        return Promise.resolve({ data: { url: 'http://localhost:3002' }, error: null })
      },
      signOut: () => {
        mockUser = null
        setTimeout(() => {
          mockAuthCallbacks.forEach(callback => callback('SIGNED_OUT', null))
        }, 100)
        return Promise.resolve({ error: null })
      },
      onAuthStateChange: (callback) => {
        mockAuthCallbacks.push(callback)
        // Initial state
        setTimeout(() => callback(mockUser ? 'SIGNED_IN' : 'SIGNED_OUT', mockUser ? { user: mockUser } : null), 50)
        return { data: { subscription: { unsubscribe: () => {
          const index = mockAuthCallbacks.indexOf(callback)
          if (index > -1) mockAuthCallbacks.splice(index, 1)
        } } } }
      }
    },
    from: (table) => ({
      select: (fields) => ({
        eq: (column, value) => ({
          single: () => {
            if (table === 'profiles' && column === 'id' && value === 'mock-user-id') {
              return Promise.resolve({ 
                data: {
                  id: 'mock-user-id',
                  email: 'mock@example.com',
                  full_name: 'Mock Kullanıcı',
                  daily_search_count: 3,
                  daily_ai_count: 1,
                  created_at: new Date().toISOString()
                }, 
                error: null 
              })
            }
            return Promise.resolve({ data: null, error: null })
          }
        }),
        then: (callback) => {
          if (table === 'search_history') {
            return callback({ data: [
              { id: '1', query: 'Mock Arama 1', created_at: new Date().toISOString() },
              { id: '2', query: 'Mock Arama 2', created_at: new Date().toISOString() }
            ], error: null })
          }
          return callback({ data: [], error: null })
        }
      }),
      insert: () => Promise.resolve({ data: null, error: null }),
      update: () => Promise.resolve({ data: null, error: null }),
      delete: () => Promise.resolve({ data: null, error: null })
    })
  }
} else {
  supabase = createClient(supabaseUrl, supabaseKey)
}

// Auth helper functions
export const signUp = async (email, password) => {
  if (isMockMode) {
    return { user: { id: 'mock-user', email }, error: null }
  }
  const { data, error } = await supabase.auth.signUp({ email, password })
  return { user: data.user, error }
}

export const signIn = async (email, password) => {
  if (isMockMode) {
    return { user: { id: 'mock-user', email }, error: null }
  }
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  return { user: data.user, error }
}

export const signInWithGoogle = async () => {
  if (isMockMode) {
    alert('Mock mode: Google OAuth simüle edildi')
    return { data: { url: 'http://localhost:3000' }, error: null }
  }
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin
    }
  })
  return { data, error }
}

export const signOut = async () => {
  if (isMockMode) {
    return { error: null }
  }
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async () => {
  if (isMockMode) {
    const { data: { session } } = await supabase.auth.getSession()
    return session?.user || null
  }
  const { data: { session } } = await supabase.auth.getSession()
  return session?.user || null
}

export { supabase }
export default supabase