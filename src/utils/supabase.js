import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY

// Mock mode for development  
const isMockMode = !supabaseUrl || !supabaseKey || supabaseUrl.includes('xxdpcteamnbothgwbvwr') || supabaseUrl.includes('cunlpyblpkvaplfyrkcs')

let supabase = null

if (isMockMode) {
  console.log('🚨 MOCK MODE: Supabase URL geçersiz, mock data kullanılıyor')
  // Mock Supabase client
  supabase = {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null } }),
      signUp: (data) => Promise.resolve({ data: { user: { id: 'mock-user-id', email: data.email } }, error: null }),
      signInWithPassword: (data) => Promise.resolve({ data: { user: { id: 'mock-user-id', email: data.email } }, error: null }),
      signInWithOAuth: () => Promise.resolve({ data: { url: 'http://localhost:3000' }, error: null }),
      signOut: () => Promise.resolve({ error: null }),
      onAuthStateChange: (callback) => {
        // Mock auth state
        setTimeout(() => callback('SIGNED_OUT', null), 100)
        return { data: { subscription: { unsubscribe: () => {} } } }
      }
    },
    from: (table) => ({
      select: () => Promise.resolve({ data: [], error: null }),
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
    return null
  }
  const { data: { session } } = await supabase.auth.getSession()
  return session?.user || null
}

export { supabase }
export default supabase