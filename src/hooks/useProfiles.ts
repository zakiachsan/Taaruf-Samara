import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { UserProfile } from '../types'

interface ProfileFilters {
  gender?: 'male' | 'female'
  minAge?: number
  maxAge?: number
  religion?: string
  location?: string
  education?: string
}

interface UseProfilesReturn {
  profiles: UserProfile[]
  loading: boolean
  error: string | null
  hasMore: boolean
  refetch: () => Promise<void>
  loadMore: () => Promise<void>
}

const PAGE_SIZE = 20

export function useProfiles(filters: ProfileFilters = {}): UseProfilesReturn {
  const { user } = useAuth()
  const [profiles, setProfiles] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const fetchProfiles = useCallback(async (pageNum: number = 1, append: boolean = false) => {
    if (!user?.id) {
      setLoading(false)
      return
    }

    try {
      if (!append) setLoading(true)
      setError(null)

      let query = supabase
        .from('user_profiles')
        .select('*')
        .neq('user_id', user.id) // Exclude self
        .eq('is_verified', true) // Only verified profiles
        .order('created_at', { ascending: false })

      // Apply filters
      if (filters.gender) {
        query = query.eq('gender', filters.gender)
      }
      if (filters.minAge) {
        query = query.gte('age', filters.minAge)
      }
      if (filters.maxAge) {
        query = query.lte('age', filters.maxAge)
      }
      if (filters.religion) {
        query = query.eq('religion', filters.religion)
      }
      if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`)
      }
      if (filters.education) {
        query = query.eq('education', filters.education)
      }

      // Pagination
      const from = (pageNum - 1) * PAGE_SIZE
      const to = from + PAGE_SIZE - 1
      query = query.range(from, to)

      const { data, error: fetchError } = await query

      if (fetchError) throw fetchError

      if (append) {
        setProfiles(prev => [...prev, ...(data || [])])
      } else {
        setProfiles(data || [])
      }

      setHasMore((data?.length || 0) === PAGE_SIZE)
      setPage(pageNum)
    } catch (err: any) {
      console.error('Error fetching profiles:', err)
      setError(err.message || 'Gagal memuat profil')
    } finally {
      setLoading(false)
    }
  }, [user?.id, filters.gender, filters.minAge, filters.maxAge, filters.religion, filters.location, filters.education])

  useEffect(() => {
    fetchProfiles(1, false)
  }, [fetchProfiles])

  const refetch = async () => {
    await fetchProfiles(1, false)
  }

  const loadMore = async () => {
    if (!hasMore || loading) return
    await fetchProfiles(page + 1, true)
  }

  return {
    profiles,
    loading,
    error,
    hasMore,
    refetch,
    loadMore,
  }
}

// Hook for fetching new members (recently joined)
export function useNewMembers(limit: number = 10) {
  const { user } = useAuth()
  const [members, setMembers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.id) {
      setLoading(false)
      return
    }

    const fetchNewMembers = async () => {
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .neq('user_id', user.id)
          .eq('is_verified', true)
          .order('created_at', { ascending: false })
          .limit(limit)

        if (error) throw error
        setMembers(data || [])
      } catch (err) {
        console.error('Error fetching new members:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchNewMembers()
  }, [user?.id, limit])

  return { members, loading }
}

// Hook for fetching recommended profiles (based on preferences)
export function useRecommendedProfiles(limit: number = 6) {
  const { user } = useAuth()
  const [profiles, setProfiles] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.id) {
      setLoading(false)
      return
    }

    const fetchRecommended = async () => {
      try {
        // Get current user's profile to determine preferences
        const { data: myProfile } = await supabase
          .from('user_profiles')
          .select('gender, religion, location')
          .eq('user_id', user.id)
          .single()

        // Determine opposite gender
        const targetGender = myProfile?.gender === 'male' ? 'female' : 'male'

        let query = supabase
          .from('user_profiles')
          .select('*')
          .neq('user_id', user.id)
          .eq('is_verified', true)
          .eq('gender', targetGender)
          .order('created_at', { ascending: false })
          .limit(limit)

        // Optionally filter by same religion
        if (myProfile?.religion) {
          query = query.eq('religion', myProfile.religion)
        }

        const { data, error } = await query

        if (error) throw error
        setProfiles(data || [])
      } catch (err) {
        console.error('Error fetching recommended profiles:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchRecommended()
  }, [user?.id, limit])

  return { profiles, loading }
}
