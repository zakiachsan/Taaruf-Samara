import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export interface Chat {
  id: string
  participant_ids: string[]
  match_request_id?: string
  created_at: string
  updated_at: string
  // Joined data
  other_user?: {
    id: string
    full_name: string
    photos?: string[]
  }
  last_message?: {
    content: string
    created_at: string
    sender_id: string
  }
  unread_count?: number
}

export interface Message {
  id: string
  chat_id: string
  sender_id: string
  content: string
  is_read: boolean
  created_at: string
}

// Hook for chat list
export function useChatList() {
  const { user } = useAuth()
  const [chats, setChats] = useState<Chat[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchChats = useCallback(async () => {
    if (!user?.id) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Fetch chats where user is participant
      const { data: chatData, error: chatError } = await supabase
        .from('chats')
        .select('*')
        .contains('participant_ids', [user.id])
        .order('updated_at', { ascending: false })

      if (chatError) throw chatError

      // Enrich chats with other user info and last message
      const enrichedChats = await Promise.all(
        (chatData || []).map(async (chat) => {
          const otherUserId = chat.participant_ids.find((id: string) => id !== user.id)
          
          // Get other user's profile
          let otherUser = null
          if (otherUserId) {
            const { data: profile } = await supabase
              .from('user_profiles')
              .select('user_id, full_name, photos')
              .eq('user_id', otherUserId)
              .single()
            
            if (profile) {
              otherUser = {
                id: profile.user_id,
                full_name: profile.full_name,
                photos: profile.photos,
              }
            }
          }

          // Get last message
          const { data: lastMsg } = await supabase
            .from('chat_messages')
            .select('content, created_at, sender_id')
            .eq('chat_id', chat.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single()

          // Get unread count
          const { count } = await supabase
            .from('chat_messages')
            .select('*', { count: 'exact', head: true })
            .eq('chat_id', chat.id)
            .eq('is_read', false)
            .neq('sender_id', user.id)

          return {
            ...chat,
            other_user: otherUser,
            last_message: lastMsg || undefined,
            unread_count: count || 0,
          }
        })
      )

      setChats(enrichedChats)
    } catch (err: any) {
      console.error('Error fetching chats:', err)
      setError(err.message || 'Gagal memuat chat')
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  useEffect(() => {
    fetchChats()

    // Subscribe to real-time updates
    if (!user?.id) return

    const channel = supabase
      .channel('chat-list-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_messages',
        },
        () => {
          // Refetch chats when any message changes
          fetchChats()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchChats, user?.id])

  // Create or get existing chat with another user
  const getOrCreateChat = async (otherUserId: string): Promise<string> => {
    if (!user?.id) throw new Error('User not authenticated')

    // Check if chat already exists
    const { data: existingChats } = await supabase
      .from('chats')
      .select('id')
      .contains('participant_ids', [user.id, otherUserId])

    // Find chat that has exactly these two participants
    const existingChat = existingChats?.find(chat => {
      // We need to verify both users are in the chat
      return true // The contains filter should handle this
    })

    if (existingChat) {
      return existingChat.id
    }

    // Create new chat
    const { data: newChat, error } = await supabase
      .from('chats')
      .insert({
        participant_ids: [user.id, otherUserId],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error

    return newChat.id
  }

  return {
    chats,
    loading,
    error,
    refetch: fetchChats,
    getOrCreateChat,
  }
}

// Hook for individual chat room
export function useChatRoom(chatId: string | null) {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const channelRef = useRef<any>(null)

  const fetchMessages = useCallback(async () => {
    if (!chatId || !user?.id) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true })

      if (fetchError) throw fetchError

      setMessages(data || [])

      // Mark messages as read
      await supabase
        .from('chat_messages')
        .update({ is_read: true })
        .eq('chat_id', chatId)
        .neq('sender_id', user.id)
        .eq('is_read', false)

    } catch (err: any) {
      console.error('Error fetching messages:', err)
      setError(err.message || 'Gagal memuat pesan')
    } finally {
      setLoading(false)
    }
  }, [chatId, user?.id])

  useEffect(() => {
    fetchMessages()

    // Subscribe to real-time messages
    if (!chatId || !user?.id) return

    channelRef.current = supabase
      .channel(`chat-room-${chatId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `chat_id=eq.${chatId}`,
        },
        (payload) => {
          const newMessage = payload.new as Message
          setMessages(prev => {
            // Avoid duplicates
            if (prev.some(m => m.id === newMessage.id)) {
              return prev
            }
            return [...prev, newMessage]
          })

          // Mark as read if from other user
          if (newMessage.sender_id !== user.id) {
            supabase
              .from('chat_messages')
              .update({ is_read: true })
              .eq('id', newMessage.id)
          }
        }
      )
      .subscribe()

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
      }
    }
  }, [chatId, user?.id, fetchMessages])

  const sendMessage = async (content: string) => {
    if (!chatId || !user?.id || !content.trim()) return

    setSending(true)
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          chat_id: chatId,
          sender_id: user.id,
          content: content.trim(),
          is_read: false,
          created_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) throw error

      // Update chat's updated_at
      await supabase
        .from('chats')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', chatId)

      // Message will be added via real-time subscription
      // But add optimistically for immediate feedback
      setMessages(prev => [...prev, data])

    } catch (err: any) {
      console.error('Error sending message:', err)
      throw err
    } finally {
      setSending(false)
    }
  }

  return {
    messages,
    loading,
    sending,
    error,
    sendMessage,
    refetch: fetchMessages,
  }
}

// Hook to get chat info
export function useChatInfo(chatId: string | null) {
  const { user } = useAuth()
  const [chatInfo, setChatInfo] = useState<{
    otherUser: { id: string; full_name: string; photos?: string[] } | null
  }>({ otherUser: null })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!chatId || !user?.id) {
      setLoading(false)
      return
    }

    const fetchChatInfo = async () => {
      try {
        const { data: chat } = await supabase
          .from('chats')
          .select('participant_ids')
          .eq('id', chatId)
          .single()

        if (chat) {
          const otherUserId = chat.participant_ids.find((id: string) => id !== user.id)
          
          if (otherUserId) {
            const { data: profile } = await supabase
              .from('user_profiles')
              .select('user_id, full_name, photos')
              .eq('user_id', otherUserId)
              .single()

            if (profile) {
              setChatInfo({
                otherUser: {
                  id: profile.user_id,
                  full_name: profile.full_name,
                  photos: profile.photos,
                },
              })
            }
          }
        }
      } catch (err) {
        console.error('Error fetching chat info:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchChatInfo()
  }, [chatId, user?.id])

  return { ...chatInfo, loading }
}
