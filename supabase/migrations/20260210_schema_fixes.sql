-- Schema Fixes for Taaruf Samara
-- Run this in Supabase SQL Editor to sync schema with mobile app

-- =====================================================
-- 1. Fix user_profiles table - Add missing columns
-- =====================================================

ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS gender TEXT CHECK (gender IN ('male', 'female')),
ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Create index for referral_code lookups
CREATE INDEX IF NOT EXISTS idx_profiles_referral_code ON user_profiles(referral_code);
CREATE INDEX IF NOT EXISTS idx_profiles_gender ON user_profiles(gender);

-- =====================================================
-- 2. Fix banners table - Rename order to display_order
-- =====================================================

-- Check if column exists and rename
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name = 'banners' AND column_name = 'order') THEN
    ALTER TABLE banners RENAME COLUMN "order" TO display_order;
  END IF;
END $$;

-- Add display_order if it doesn't exist
ALTER TABLE banners ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- =====================================================
-- 3. Add premium_subscriptions fixes
-- =====================================================

-- Add plan_type column (alias for type)
ALTER TABLE premium_subscriptions 
ADD COLUMN IF NOT EXISTS plan_type TEXT CHECK (plan_type IN ('basic', 'premium')),
ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;

-- Copy data from type to plan_type if type exists
UPDATE premium_subscriptions SET plan_type = type WHERE plan_type IS NULL AND type IS NOT NULL;
UPDATE premium_subscriptions SET expires_at = end_date WHERE expires_at IS NULL AND end_date IS NOT NULL;

-- =====================================================
-- 4. Create chats table
-- =====================================================

CREATE TABLE IF NOT EXISTS chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_ids UUID[] NOT NULL,
  match_request_id UUID REFERENCES match_requests(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chats_participants ON chats USING GIN (participant_ids);
CREATE INDEX IF NOT EXISTS idx_chats_updated ON chats (updated_at DESC);

-- =====================================================
-- 5. Create chat_messages table
-- =====================================================

CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_chat ON chat_messages (chat_id, created_at);
CREATE INDEX IF NOT EXISTS idx_messages_unread ON chat_messages (chat_id, is_read) WHERE is_read = FALSE;

-- =====================================================
-- 6. Create referral_withdrawals table
-- =====================================================

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

CREATE INDEX IF NOT EXISTS idx_withdrawals_user ON referral_withdrawals (user_id);
CREATE INDEX IF NOT EXISTS idx_withdrawals_status ON referral_withdrawals (status);

-- Add completed_at to referrals if missing
ALTER TABLE referrals ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;

-- =====================================================
-- 7. Enable RLS on new tables
-- =====================================================

ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_withdrawals ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 8. RLS Policies for chats
-- =====================================================

DROP POLICY IF EXISTS "Users can view their own chats" ON chats;
CREATE POLICY "Users can view their own chats"
  ON chats FOR SELECT
  USING (auth.uid() = ANY(participant_ids));

DROP POLICY IF EXISTS "Users can create chats" ON chats;
CREATE POLICY "Users can create chats"
  ON chats FOR INSERT
  WITH CHECK (auth.uid() = ANY(participant_ids));

DROP POLICY IF EXISTS "Users can update their chats" ON chats;
CREATE POLICY "Users can update their chats"
  ON chats FOR UPDATE
  USING (auth.uid() = ANY(participant_ids));

-- =====================================================
-- 9. RLS Policies for chat_messages
-- =====================================================

DROP POLICY IF EXISTS "Users can view messages in their chats" ON chat_messages;
CREATE POLICY "Users can view messages in their chats"
  ON chat_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM chats
      WHERE chats.id = chat_messages.chat_id
      AND auth.uid() = ANY(chats.participant_ids)
    )
  );

DROP POLICY IF EXISTS "Users can send messages" ON chat_messages;
CREATE POLICY "Users can send messages"
  ON chat_messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
      SELECT 1 FROM chats
      WHERE chats.id = chat_messages.chat_id
      AND auth.uid() = ANY(chats.participant_ids)
    )
  );

DROP POLICY IF EXISTS "Users can update messages" ON chat_messages;
CREATE POLICY "Users can update messages"
  ON chat_messages FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM chats
      WHERE chats.id = chat_messages.chat_id
      AND auth.uid() = ANY(chats.participant_ids)
    )
  );

-- =====================================================
-- 10. RLS Policies for referral_withdrawals
-- =====================================================

DROP POLICY IF EXISTS "Users can view own withdrawals" ON referral_withdrawals;
CREATE POLICY "Users can view own withdrawals"
  ON referral_withdrawals FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create withdrawals" ON referral_withdrawals;
CREATE POLICY "Users can create withdrawals"
  ON referral_withdrawals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admin can manage all withdrawals
DROP POLICY IF EXISTS "Admin can manage withdrawals" ON referral_withdrawals;
CREATE POLICY "Admin can manage withdrawals"
  ON referral_withdrawals FOR ALL
  USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- =====================================================
-- 11. Enable Realtime for chat_messages
-- =====================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND tablename = 'chat_messages'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
  END IF;
END $$;

-- =====================================================
-- 12. Trigger for auto-updating chat timestamp
-- =====================================================

CREATE OR REPLACE FUNCTION update_chat_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE chats
  SET updated_at = NOW()
  WHERE id = NEW.chat_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_message_insert ON chat_messages;
CREATE TRIGGER on_message_insert
  AFTER INSERT ON chat_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_chat_timestamp();

-- =====================================================
-- 13. Trigger for auto-processing referral on subscription
-- =====================================================

CREATE OR REPLACE FUNCTION process_referral_on_subscription()
RETURNS TRIGGER AS $$
DECLARE
  referral_record RECORD;
  reward_amount INTEGER := 10000;
BEGIN
  IF NEW.status = 'active' AND (OLD IS NULL OR OLD.status != 'active') THEN
    SELECT * INTO referral_record
    FROM referrals
    WHERE referred_id = NEW.user_id
    AND status = 'pending'
    LIMIT 1;
    
    IF FOUND THEN
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

DROP TRIGGER IF EXISTS on_subscription_success ON premium_subscriptions;
CREATE TRIGGER on_subscription_success
  AFTER INSERT OR UPDATE ON premium_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION process_referral_on_subscription();

-- =====================================================
-- Done! Schema is now synced with mobile app
-- =====================================================
