import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase, getCurrentUser, getSession } from '../lib/supabase'
import { User } from '../types'

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName: string, referralCode?: string) => Promise<{ userId: string; referralCode: string }>
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Generate unique referral code
function generateReferralCode(name: string): string {
  const prefix = name
    .toUpperCase()
    .replace(/[^A-Z]/g, '')
    .substring(0, 3)
    .padEnd(3, 'X')
  const random = Math.random().toString(36).substring(2, 7).toUpperCase()
  return `${prefix}${random}`
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session on app start
    checkSession()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event)
        
        if (session?.user) {
          // Fetch user profile from database
          await fetchUserProfile(session.user.id)
        } else {
          setUser(null)
        }
        setLoading(false)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const fetchUserProfile = async (userId: string) => {
    try {
      // First get auth user data
      const { data: { user: authUser } } = await supabase.auth.getUser()
      
      if (!authUser) {
        setUser(null)
        return
      }

      // Try to get user profile from database
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error)
      }

      // Get subscription status
      const { data: subscription } = await supabase
        .from('premium_subscriptions')
        .select('plan_type, status, expires_at')
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      const userData: User = {
        id: userId,
        email: authUser.email!,
        full_name: profile?.full_name || authUser.user_metadata?.full_name || '',
        role: authUser.user_metadata?.role || 'user',
        is_verified: profile?.is_verified || authUser.user_metadata?.is_verified || false,
        created_at: authUser.created_at || new Date().toISOString(),
        profile: profile || undefined,
        subscription: subscription || undefined,
      }
      
      setUser(userData)
    } catch (error) {
      console.error('Error in fetchUserProfile:', error)
      setUser(null)
    }
  }

  const checkSession = async () => {
    try {
      const session = await getSession()
      if (session?.user) {
        await fetchUserProfile(session.user.id)
      }
    } catch (error) {
      console.error('Error checking session:', error)
    } finally {
      setLoading(false)
    }
  }

  const refreshUser = async () => {
    const session = await getSession()
    if (session?.user) {
      await fetchUserProfile(session.user.id)
    }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
  }

  const signUp = async (
    email: string, 
    password: string, 
    fullName: string,
    referredByCode?: string
  ): Promise<{ userId: string; referralCode: string }> => {
    // 1. Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })
    
    if (authError) throw authError
    if (!authData.user) throw new Error('Gagal membuat akun')

    const userId = authData.user.id
    const referralCode = generateReferralCode(fullName)

    // 2. Create user profile
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        user_id: userId,
        full_name: fullName,
        referral_code: referralCode,
        is_verified: false,
        is_blurred: true, // Start with blurred photos
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

    if (profileError) {
      console.error('Error creating profile:', profileError)
      // Don't throw - auth user is created, profile can be created later
    }

    // 3. If referred by someone, create referral record
    if (referredByCode) {
      try {
        // Find referrer
        const { data: referrer } = await supabase
          .from('user_profiles')
          .select('user_id')
          .eq('referral_code', referredByCode)
          .single()

        if (referrer) {
          await supabase
            .from('referrals')
            .insert({
              referrer_id: referrer.user_id,
              referred_id: userId,
              code: referredByCode,
              status: 'pending', // Will become 'successful' after subscription
              reward_amount: 0,
              created_at: new Date().toISOString(),
            })
        }
      } catch (error) {
        console.error('Error processing referral:', error)
        // Don't throw - referral is optional
      }
    }

    return { userId, referralCode }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
