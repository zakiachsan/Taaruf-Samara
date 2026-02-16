-- Profile Enhancements for Taaruf Samara
-- New fields for registration and profile

-- =====================================================
-- 1. Add new profile fields to user_profiles
-- =====================================================

ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS profession TEXT,
ADD COLUMN IF NOT EXISTS marriage_status TEXT CHECK (marriage_status IN ('lajang', 'menikah', 'cerai_hidup', 'cerai_mati')),
ADD COLUMN IF NOT EXISTS marriage_readiness TEXT CHECK (marriage_readiness IN ('sangat_siap', 'siap', 'cukup_siap')),
ADD COLUMN IF NOT EXISTS marriage_target TEXT,
ADD COLUMN IF NOT EXISTS prayer_condition TEXT CHECK (prayer_condition IN ('terjaga', 'bolong')),
ADD COLUMN IF NOT EXISTS manhaj TEXT,
ADD COLUMN IF NOT EXISTS height_cm INTEGER,
ADD COLUMN IF NOT EXISTS weight_kg INTEGER,
ADD COLUMN IF NOT EXISTS photo_closeup TEXT,
ADD COLUMN IF NOT EXISTS photo_fullbody TEXT,
ADD COLUMN IF NOT EXISTS partner_pref_ethnicity TEXT[],
ADD COLUMN IF NOT EXISTS partner_pref_hijab TEXT CHECK (partner_pref_hijab IN ('berhijab', 'bercadar', 'tidak_ada_preferensi')),
ADD COLUMN IF NOT EXISTS has_bedah_value_cert BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS bedah_value_cert_code TEXT,
ADD COLUMN IF NOT EXISTS referral_balance INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS bank_name TEXT,
ADD COLUMN IF NOT EXISTS bank_account_number TEXT,
ADD COLUMN IF NOT EXISTS bank_account_name TEXT;

-- =====================================================
-- 2. Create user_children table
-- =====================================================

CREATE TABLE IF NOT EXISTS user_children (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female')),
  age INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_children_user ON user_children (user_id);

-- =====================================================
-- 3. Create referral_transactions table (for history)
-- =====================================================

CREATE TABLE IF NOT EXISTS referral_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES user_profiles(id),
  referred_id UUID NOT NULL REFERENCES user_profiles(id),
  referred_name TEXT,
  amount INTEGER NOT NULL DEFAULT 10000,
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ref_trans_referrer ON referral_transactions (referrer_id);
CREATE INDEX IF NOT EXISTS idx_ref_trans_date ON referral_transactions (created_at DESC);

-- =====================================================
-- 4. Create bedah_value_results table
-- =====================================================

CREATE TABLE IF NOT EXISTS bedah_value_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  quality_score INTEGER,
  mental_readiness_score INTEGER,
  emotional_baggage_notes TEXT,
  life_needs_notes TEXT,
  partner_category TEXT,
  consultant_notes TEXT,
  certificate_code TEXT UNIQUE,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bedah_results_user ON bedah_value_results (user_id);
CREATE INDEX IF NOT EXISTS idx_bedah_results_code ON bedah_value_results (certificate_code);

-- =====================================================
-- 5. Enable RLS on new tables
-- =====================================================

ALTER TABLE user_children ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bedah_value_results ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 6. RLS Policies for user_children
-- =====================================================

DROP POLICY IF EXISTS "Users can manage own children" ON user_children;
CREATE POLICY "Users can manage own children"
  ON user_children FOR ALL
  USING (auth.uid() = user_id);

-- =====================================================
-- 7. RLS Policies for referral_transactions
-- =====================================================

DROP POLICY IF EXISTS "Users can view own referral transactions" ON referral_transactions;
CREATE POLICY "Users can view own referral transactions"
  ON referral_transactions FOR SELECT
  USING (auth.uid() = referrer_id);

-- =====================================================
-- 8. RLS Policies for bedah_value_results
-- =====================================================

DROP POLICY IF EXISTS "Users can view own bedah results" ON bedah_value_results;
CREATE POLICY "Users can view own bedah results"
  ON bedah_value_results FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admin can manage bedah results" ON bedah_value_results;
CREATE POLICY "Admin can manage bedah results"
  ON bedah_value_results FOR ALL
  USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- =====================================================
-- 9. Function to update referral balance
-- =====================================================

CREATE OR REPLACE FUNCTION update_referral_balance()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' THEN
    UPDATE user_profiles
    SET referral_balance = referral_balance + NEW.amount
    WHERE id = NEW.referrer_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_referral_transaction ON referral_transactions;
CREATE TRIGGER on_referral_transaction
  AFTER INSERT OR UPDATE ON referral_transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_referral_balance();

-- =====================================================
-- 10. Function to deduct balance on withdrawal
-- =====================================================

CREATE OR REPLACE FUNCTION deduct_balance_on_withdrawal()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND (OLD IS NULL OR OLD.status != 'completed') THEN
    UPDATE user_profiles
    SET referral_balance = referral_balance - NEW.amount
    WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_withdrawal_complete ON referral_withdrawals;
CREATE TRIGGER on_withdrawal_complete
  AFTER UPDATE ON referral_withdrawals
  FOR EACH ROW
  EXECUTE FUNCTION deduct_balance_on_withdrawal();

-- =====================================================
-- Done! Profile enhancements schema ready
-- =====================================================
