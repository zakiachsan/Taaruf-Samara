import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useProfile } from './useProfile'

export interface ReferralStats {
  totalReferrals: number
  successfulReferrals: number
  pendingReferrals: number
  totalEarnings: number
  pendingWithdrawal: number
  withdrawnAmount: number
}

export interface ReferralHistory {
  id: string
  referred_name: string
  referred_photo?: string
  status: 'pending' | 'successful' | 'failed'
  reward_amount: number
  created_at: string
  completed_at?: string
}

export interface WithdrawalHistory {
  id: string
  amount: number
  status: 'pending' | 'processing' | 'completed' | 'rejected'
  bank_name?: string
  account_number?: string
  created_at: string
  processed_at?: string
}

export function useReferral() {
  const { user } = useAuth()
  const { profile } = useProfile()
  const [stats, setStats] = useState<ReferralStats>({
    totalReferrals: 0,
    successfulReferrals: 0,
    pendingReferrals: 0,
    totalEarnings: 0,
    pendingWithdrawal: 0,
    withdrawnAmount: 0,
  })
  const [referralHistory, setReferralHistory] = useState<ReferralHistory[]>([])
  const [withdrawalHistory, setWithdrawalHistory] = useState<WithdrawalHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchReferralData = useCallback(async () => {
    if (!user?.id) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Fetch referrals where user is the referrer
      const { data: referrals, error: refError } = await supabase
        .from('referrals')
        .select(`
          *,
          referred_profile:user_profiles!referred_id (
            full_name,
            photos
          )
        `)
        .eq('referrer_id', user.id)
        .order('created_at', { ascending: false })

      if (refError) throw refError

      // Calculate stats
      const successful = referrals?.filter(r => r.status === 'successful') || []
      const pending = referrals?.filter(r => r.status === 'pending') || []
      const totalEarnings = successful.reduce((sum, r) => sum + (r.reward_amount || 0), 0)

      // Fetch withdrawals
      const { data: withdrawals, error: wdError } = await supabase
        .from('referral_withdrawals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (wdError && wdError.code !== 'PGRST116') {
        console.error('Error fetching withdrawals:', wdError)
      }

      const completedWithdrawals = withdrawals?.filter(w => w.status === 'completed') || []
      const pendingWithdrawals = withdrawals?.filter(w => w.status === 'pending' || w.status === 'processing') || []

      const withdrawnAmount = completedWithdrawals.reduce((sum, w) => sum + w.amount, 0)
      const pendingWithdrawal = pendingWithdrawals.reduce((sum, w) => sum + w.amount, 0)

      setStats({
        totalReferrals: referrals?.length || 0,
        successfulReferrals: successful.length,
        pendingReferrals: pending.length,
        totalEarnings,
        pendingWithdrawal,
        withdrawnAmount,
      })

      // Map referral history
      const history: ReferralHistory[] = (referrals || []).map(r => ({
        id: r.id,
        referred_name: r.referred_profile?.full_name || 'Pengguna',
        referred_photo: r.referred_profile?.photos?.[0],
        status: r.status,
        reward_amount: r.reward_amount || 0,
        created_at: r.created_at,
        completed_at: r.completed_at,
      }))

      setReferralHistory(history)
      setWithdrawalHistory(withdrawals || [])

    } catch (err: any) {
      console.error('Error fetching referral data:', err)
      setError(err.message || 'Gagal memuat data referral')
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  useEffect(() => {
    fetchReferralData()
  }, [fetchReferralData])

  const requestWithdrawal = async (
    amount: number,
    bankName: string,
    accountNumber: string,
    accountName: string
  ) => {
    if (!user?.id) throw new Error('User not authenticated')

    const availableBalance = stats.totalEarnings - stats.withdrawnAmount - stats.pendingWithdrawal

    if (amount > availableBalance) {
      throw new Error('Saldo tidak mencukupi')
    }

    if (amount < 50000) {
      throw new Error('Minimum penarikan Rp 50.000')
    }

    const { data, error } = await supabase
      .from('referral_withdrawals')
      .insert({
        user_id: user.id,
        amount,
        bank_name: bankName,
        account_number: accountNumber,
        account_name: accountName,
        status: 'pending',
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error

    await fetchReferralData()
    return data
  }

  const referralCode = profile?.referral_code || ''
  const availableBalance = stats.totalEarnings - stats.withdrawnAmount - stats.pendingWithdrawal

  return {
    referralCode,
    stats,
    availableBalance,
    referralHistory,
    withdrawalHistory,
    loading,
    error,
    refetch: fetchReferralData,
    requestWithdrawal,
  }
}
