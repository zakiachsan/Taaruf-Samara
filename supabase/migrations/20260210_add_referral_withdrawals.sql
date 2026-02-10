-- Referral withdrawals table for Taaruf Samara
-- Run this in Supabase SQL Editor

-- Referral withdrawals table
CREATE TABLE IF NOT EXISTS referral_withdrawals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  amount INTEGER NOT NULL,
  bank_name TEXT NOT NULL,
  account_number TEXT NOT NULL,
  account_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'rejected')),
  admin_notes TEXT,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_withdrawals_user ON referral_withdrawals (user_id);
CREATE INDEX IF NOT EXISTS idx_withdrawals_status ON referral_withdrawals (status);

-- Enable RLS
ALTER TABLE referral_withdrawals ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own withdrawals"
  ON referral_withdrawals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own withdrawals"
  ON referral_withdrawals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Add completed_at column to referrals table if not exists
ALTER TABLE referrals ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;

-- Function to process successful referral when user subscribes
CREATE OR REPLACE FUNCTION process_referral_on_subscription()
RETURNS TRIGGER AS $$
DECLARE
  referral_record RECORD;
  reward_amount INTEGER := 10000; -- Rp 10,000
BEGIN
  -- Check if this is a new subscription
  IF NEW.status = 'active' AND (OLD IS NULL OR OLD.status != 'active') THEN
    -- Find pending referral for this user
    SELECT * INTO referral_record
    FROM referrals
    WHERE referred_id = NEW.user_id
    AND status = 'pending'
    LIMIT 1;
    
    IF FOUND THEN
      -- Update referral to successful
      UPDATE referrals
      SET 
        status = 'successful',
        reward_amount = reward_amount,
        completed_at = NOW()
      WHERE id = referral_record.id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to process referrals when subscription is created/updated
DROP TRIGGER IF EXISTS on_subscription_success ON premium_subscriptions;
CREATE TRIGGER on_subscription_success
  AFTER INSERT OR UPDATE ON premium_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION process_referral_on_subscription();
