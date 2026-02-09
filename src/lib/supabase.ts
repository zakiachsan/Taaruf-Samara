import { createClient } from '@supabase/supabase-js'

// Replace these with your actual Supabase URL and Anon Key
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://okgddlgugdkiswitewdi.supabase.co'
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key-here'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Auth helpers
export const signUp = async (email: string, password: string, fullName: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  })
  
  if (error) throw error
  return data
}

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  if (error) throw error
  return data
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export const getSession = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

// User profile helpers
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single()
  
  if (error) throw error
  return data
}

export const updateUserProfile = async (userId: string, updates: any) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('user_id', userId)
  
  if (error) throw error
  return data
}

// Premium subscription helpers
export const getUserSubscription = async (userId: string) => {
  const { data, error } = await supabase
    .from('premium_subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()
  
  if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows returned
  return data
}

// Referral helpers
export const getReferralCode = async (userId: string) => {
  const { data, error } = await supabase
    .from('referrals')
    .select('code')
    .eq('referrer_id', userId)
    .limit(1)
    .single()
  
  if (error && error.code !== 'PGRST116') throw error
  return data?.code || null
}

export const getReferralStats = async (userId: string) => {
  const { data, error } = await supabase
    .from('referrals')
    .select('status, reward_amount')
    .eq('referrer_id', userId)
  
  if (error) throw error
  
  const successful = data.filter(r => r.status === 'successful').length
  const totalEarnings = data
    .filter(r => r.status === 'successful')
    .reduce((sum, r) => sum + (r.reward_amount || 0), 0)
  
  return {
    totalReferrals: data.length,
    successful,
    totalEarnings,
  }
}

// Profiles / Matching helpers
export const getProfiles = async (filters: any = {}, page: number = 1, limit: number = 20) => {
  let query = supabase
    .from('user_profiles')
    .select(`
      *,
      users:user_id (
        full_name,
        is_verified
      )
    `)
    .eq('is_blurred', false)
    .order('created_at', { ascending: false })
  
  const from = (page - 1) * limit
  const to = from + limit - 1
  
  query = query.range(from, to)
  
  const { data, error } = await query
  
  if (error) throw error
  return data
}

export const getProfileById = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select(`
      *,
      users:user_id (
        full_name,
        email,
        is_verified
      )
    `)
    .eq('user_id', userId)
    .single()
  
  if (error) throw error
  return data
}
