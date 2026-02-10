import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { MatchRequest, BlockedUser } from '../types'

// Hook for managing match requests
export function useMatches() {
  const { user } = useAuth()
  const [sentRequests, setSentRequests] = useState<MatchRequest[]>([])
  const [receivedRequests, setReceivedRequests] = useState<MatchRequest[]>([])
  const [matches, setMatches] = useState<MatchRequest[]>([])
  const [loading, setLoading] = useState(true)

  const fetchMatches = useCallback(async () => {
    if (!user?.id) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)

      // Fetch sent requests
      const { data: sent } = await supabase
        .from('match_requests')
        .select('*')
        .eq('requester_id', user.id)
        .order('created_at', { ascending: false })

      // Fetch received requests
      const { data: received } = await supabase
        .from('match_requests')
        .select('*')
        .eq('recipient_id', user.id)
        .order('created_at', { ascending: false })

      setSentRequests(sent || [])
      setReceivedRequests(received || [])

      // Filter accepted matches (both parties accepted)
      const acceptedMatches = [...(sent || []), ...(received || [])].filter(
        m => m.status === 'accepted'
      )
      setMatches(acceptedMatches)
    } catch (err) {
      console.error('Error fetching matches:', err)
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  useEffect(() => {
    fetchMatches()
  }, [fetchMatches])

  const sendRequest = async (recipientId: string, introMessage?: string) => {
    if (!user?.id) throw new Error('User not authenticated')

    // Check if request already exists
    const existingRequest = sentRequests.find(r => r.recipient_id === recipientId)
    if (existingRequest) {
      throw new Error('Permintaan sudah dikirim sebelumnya')
    }

    const { data, error } = await supabase
      .from('match_requests')
      .insert({
        requester_id: user.id,
        recipient_id: recipientId,
        introduction_message: introMessage,
        status: 'pending',
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error

    setSentRequests(prev => [data, ...prev])
    return data
  }

  const respondToRequest = async (requestId: string, accept: boolean) => {
    if (!user?.id) throw new Error('User not authenticated')

    const { error } = await supabase
      .from('match_requests')
      .update({
        status: accept ? 'accepted' : 'rejected',
      })
      .eq('id', requestId)
      .eq('recipient_id', user.id)

    if (error) throw error

    await fetchMatches()
  }

  const cancelRequest = async (requestId: string) => {
    if (!user?.id) throw new Error('User not authenticated')

    const { error } = await supabase
      .from('match_requests')
      .delete()
      .eq('id', requestId)
      .eq('requester_id', user.id)

    if (error) throw error

    setSentRequests(prev => prev.filter(r => r.id !== requestId))
  }

  // Check if already matched with a user
  const isMatched = (userId: string) => {
    return matches.some(
      m => m.requester_id === userId || m.recipient_id === userId
    )
  }

  // Check if request is pending
  const hasPendingRequest = (userId: string) => {
    return sentRequests.some(
      r => r.recipient_id === userId && r.status === 'pending'
    )
  }

  return {
    sentRequests,
    receivedRequests,
    matches,
    loading,
    refetch: fetchMatches,
    sendRequest,
    respondToRequest,
    cancelRequest,
    isMatched,
    hasPendingRequest,
  }
}

// Hook for managing blocked users
export function useBlockedUsers() {
  const { user } = useAuth()
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([])
  const [loading, setLoading] = useState(true)

  const fetchBlockedUsers = useCallback(async () => {
    if (!user?.id) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)

      const { data, error } = await supabase
        .from('blocked_users')
        .select(`
          *,
          blocked_profile:user_profiles!blocked_id (
            full_name,
            photos
          )
        `)
        .eq('blocker_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setBlockedUsers(data || [])
    } catch (err) {
      console.error('Error fetching blocked users:', err)
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  useEffect(() => {
    fetchBlockedUsers()
  }, [fetchBlockedUsers])

  const blockUser = async (blockedId: string, reason?: string) => {
    if (!user?.id) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('blocked_users')
      .insert({
        blocker_id: user.id,
        blocked_id: blockedId,
        reason,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error

    setBlockedUsers(prev => [data, ...prev])
    return data
  }

  const unblockUser = async (blockedId: string) => {
    if (!user?.id) throw new Error('User not authenticated')

    const { error } = await supabase
      .from('blocked_users')
      .delete()
      .eq('blocker_id', user.id)
      .eq('blocked_id', blockedId)

    if (error) throw error

    setBlockedUsers(prev => prev.filter(b => b.blocked_id !== blockedId))
  }

  const isBlocked = (userId: string) => {
    return blockedUsers.some(b => b.blocked_id === userId)
  }

  return {
    blockedUsers,
    loading,
    refetch: fetchBlockedUsers,
    blockUser,
    unblockUser,
    isBlocked,
  }
}

// Hook for reporting users
export function useReports() {
  const { user } = useAuth()

  const submitReport = async (
    reportedId: string,
    reason: string,
    description?: string
  ) => {
    if (!user?.id) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('reports')
      .insert({
        reporter_id: user.id,
        reported_id: reportedId,
        reason,
        description,
        status: 'open',
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  return { submitReport }
}
