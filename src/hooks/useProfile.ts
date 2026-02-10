import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { UserProfile } from '../types'

interface UseProfileReturn {
  profile: UserProfile | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>
  uploadPhoto: (uri: string, index: number) => Promise<string>
}

export function useProfile(): UseProfileReturn {
  const { user } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = useCallback(async () => {
    if (!user?.id) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError
      }

      setProfile(data)
    } catch (err: any) {
      console.error('Error fetching profile:', err)
      setError(err.message || 'Gagal memuat profil')
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user?.id) throw new Error('User not authenticated')

    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id)

    if (updateError) throw updateError

    // Refetch profile after update
    await fetchProfile()
  }

  const uploadPhoto = async (uri: string, index: number): Promise<string> => {
    if (!user?.id) throw new Error('User not authenticated')

    // Convert URI to blob
    const response = await fetch(uri)
    const blob = await response.blob()

    const fileExt = uri.split('.').pop() || 'jpg'
    const fileName = `${user.id}/photo_${index}_${Date.now()}.${fileExt}`

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('profile-photos')
      .upload(fileName, blob, {
        contentType: `image/${fileExt}`,
        upsert: true,
      })

    if (uploadError) throw uploadError

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('profile-photos')
      .getPublicUrl(fileName)

    // Update photos array in profile
    const currentPhotos = profile?.photos || []
    const newPhotos = [...currentPhotos]
    newPhotos[index] = publicUrl

    await updateProfile({ photos: newPhotos })

    return publicUrl
  }

  return {
    profile,
    loading,
    error,
    refetch: fetchProfile,
    updateProfile,
    uploadPhoto,
  }
}

// Hook for fetching other user's profile
export function useProfileById(userId: string | null) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    const fetchProfile = async () => {
      try {
        setLoading(true)
        setError(null)

        const { data, error: fetchError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', userId)
          .single()

        if (fetchError) throw fetchError

        setProfile(data)
      } catch (err: any) {
        console.error('Error fetching profile:', err)
        setError(err.message || 'Gagal memuat profil')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [userId])

  return { profile, loading, error }
}
