export interface User {
  id: string
  email: string
  full_name: string
  role: 'user' | 'admin' | 'moderator'
  is_verified: boolean
  created_at: string
  profile?: UserProfile
  subscription?: {
    plan_type: 'basic' | 'premium'
    status: 'active' | 'expired' | 'cancelled'
    expires_at: string
  }
}

export interface UserProfile {
  id: string
  user_id: string
  full_name?: string
  age?: number
  gender?: 'male' | 'female'
  religion?: string
  prayer_condition?: 'terjaga' | 'bolong'
  salary_range?: string
  education?: string
  location?: string
  bio?: string
  photos?: string[]
  hobbies?: string[]
  interests?: string[]
  referral_code?: string
  is_verified: boolean
  is_blurred: boolean
  created_at: string
  updated_at: string
  // New fields from profile enhancements
  profession?: string
  marriage_status?: 'lajang' | 'menikah' | 'cerai_hidup' | 'cerai_mati'
  marriage_readiness?: 'sangat_siap' | 'siap' | 'cukup_siap'
  marriage_target?: string
  manhaj?: string
  height_cm?: number
  weight_kg?: number
  photo_closeup?: string
  photo_fullbody?: string
  partner_pref_ethnicity?: string[]
  partner_pref_hijab?: 'berhijab' | 'bercadar' | 'tidak_ada_preferensi'
  has_bedah_value_cert?: boolean
  bedah_value_cert_code?: string
  referral_balance?: number
  bank_name?: string
  bank_account_number?: string
  bank_account_name?: string
}

export interface PremiumSubscription {
  id: string
  user_id: string
  type: 'basic' | 'premium'
  status: 'active' | 'expired' | 'cancelled'
  start_date: string
  end_date: string
  amount: number
  created_at: string
}

export interface Referral {
  id: string
  referrer_id: string
  referred_id: string
  code: string
  status: 'pending' | 'successful' | 'failed'
  reward_amount: number
  created_at: string
  completed_at?: string
}

export interface MatchRequest {
  id: string
  requester_id: string
  recipient_id: string
  status: 'pending' | 'accepted' | 'rejected' | 'completed'
  introduction_message?: string
  created_at: string
}

export interface Banner {
  id: string
  title: string
  subtitle?: string
  image_url: string
  link_to?: string
  is_active: boolean
  display_order: number
  start_date?: string
  end_date?: string
  created_at?: string
  updated_at?: string
}

export interface SelfValueRegistration {
  id: string
  user_id: string
  status: 'registered' | 'scheduled' | 'completed' | 'cancelled'
  scheduled_date?: string
  scheduled_time?: string
  location?: string
  certificate_url?: string
  notes?: string
}

export interface Report {
  id: string
  reporter_id: string
  reported_id: string
  reason: string
  description?: string
  status: 'open' | 'investigating' | 'resolved' | 'dismissed'
  created_at: string
}

export interface BlockedUser {
  id: string
  blocker_id: string
  blocked_id: string
  reason?: string
  created_at: string
}

export interface ChatMessage {
  id: string
  chat_id: string
  sender_id: string
  content: string
  is_read: boolean
  created_at: string
}

export interface Chat {
  id: string
  participant_ids: string[]
  match_request_id?: string
  created_at: string
  updated_at: string
}

export interface ReferralWithdrawal {
  id: string
  user_id: string
  amount: number
  bank_name: string
  account_number: string
  account_name: string
  status: 'pending' | 'processing' | 'completed' | 'rejected'
  admin_notes?: string
  processed_at?: string
  created_at: string
}
