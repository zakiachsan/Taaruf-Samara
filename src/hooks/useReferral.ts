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
  status: 'pending' | 'completed' | 'failed'
  amount: number
  created_at: string
}

export interface Transaction {
  id: string
  type: 'credit' | 'debit'
  amount: number
  description: string
  status: 'pending' | 'completed' | 'failed'
  created_at: string
}

export interface WithdrawalHistory {
  id: string
  amount: number
  status: 'pending' | 'processing' | 'completed' | 'rejected'
  bank_name?: string
  account_number?: string
  account_name?: string
  created_at: string
  processed_at?: string
}

export function useReferral() {
  const { user } = useAuth()
  const { profile, refetch: refetchProfile } = useProfile()
  const [stats, setStats] = useState<ReferralStats>({
    totalReferrals: 0,
    successfulReferrals: 0,
    pendingReferrals: 0,
    totalEarnings: 0,
    pendingWithdrawal: 0,
    withdrawnAmount: 0,
  })
  const [referralHistory, setReferralHistory] = useState<ReferralHistory[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
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

      // Fetch referral transactions (bonus received)
      const { data: refTransactions, error: refTxError } = await supabase
        .from('referral_transactions')
        .select(`
          *,
          referred:user_profiles!referred_id (
            full_name,
            photo_closeup
          )
        `)
        .eq('referrer_id', user.id)
        .order('created_at', { ascending: false })

      if (refTxError && refTxError.code !== 'PGRST116') {
        console.error('Error fetching referral transactions:', refTxError)
      }

      // Calculate stats from transactions
      const completed = refTransactions?.filter(r => r.status === 'completed') || []
      const pending = refTransactions?.filter(r => r.status === 'pending') || []
      const totalEarnings = completed.reduce((sum, r) => sum + (r.amount || 0), 0)

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
      const pendingWithdrawals = withdrawals?.filter(w => 
        w.status === 'pending' || w.status === 'processing'
      ) || []

      const withdrawnAmount = completedWithdrawals.reduce((sum, w) => sum + w.amount, 0)
      const pendingWithdrawal = pendingWithdrawals.reduce((sum, w) => sum + w.amount, 0)

      setStats({
        totalReferrals: refTransactions?.length || 0,
        successfulReferrals: completed.length,
        pendingReferrals: pending.length,
        totalEarnings,
        pendingWithdrawal,
        withdrawnAmount,
      })

      // Map referral history
      const history: ReferralHistory[] = (refTransactions || []).map(r => ({
        id: r.id,
        referred_name: r.referred?.full_name || r.referred_name || 'Pengguna',
        referred_photo: r.referred?.photo_closeup,
        status: r.status,
        amount: r.amount || 0,
        created_at: r.created_at,
      }))

      setReferralHistory(history)
      setWithdrawalHistory(withdrawals || [])

      // Build transactions list (credits + debits)
      const txList: Transaction[] = []

      // Add referral bonuses as credits
      for (const ref of (refTransactions || [])) {
        if (ref.status === 'completed') {
          txList.push({
            id: `ref-${ref.id}`,
            type: 'credit',
            amount: ref.amount,
            description: `Bonus referral ${ref.referred?.full_name || ref.referred_name || 'Pengguna'}`,
            status: 'completed',
            created_at: ref.created_at,
          })
        }
      }

      // Add withdrawals as debits
      for (const wd of (withdrawals || [])) {
        txList.push({
          id: `wd-${wd.id}`,
          type: 'debit',
          amount: wd.amount,
          description: `Penarikan ke ${wd.bank_name} ${wd.account_number?.slice(-4) || ''}`,
          status: wd.status === 'completed' ? 'completed' : wd.status === 'rejected' ? 'failed' : 'pending',
          created_at: wd.created_at,
        })
      }

      // Sort by date descending
      txList.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

      setTransactions(txList)

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

    // Use balance from profile (updated by trigger)
    const currentBalance = profile?.referral_balance || 0

    if (amount > currentBalance) {
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

    // Update user's bank info for future withdrawals
    await supabase
      .from('user_profiles')
      .update({
        bank_name: bankName,
        bank_account_number: accountNumber,
        bank_account_name: accountName,
      })
      .eq('id', user.id)

    await fetchReferralData()
    if (refetchProfile) refetchProfile()
    
    return data
  }

  const referralCode = profile?.referral_code || ''
  // Use referral_balance from profile (managed by database trigger)
  const referralBalance = profile?.referral_balance || 0

  return {
    referralCode,
    stats,
    referralBalance, // Renamed from availableBalance for clarity
    referralHistory,
    transactions,
    withdrawalHistory,
    loading,
    error,
    refetch: fetchReferralData,
    requestWithdrawal,
  }
}
