-- Add subscription fields to contractor_profiles
ALTER TABLE public.contractor_profiles
  ADD COLUMN IF NOT EXISTS subscription_status TEXT NOT NULL DEFAULT 'free'
    CHECK (subscription_status IN ('free', 'pro')),
  ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS payment_provider_id TEXT;

-- Index for quick subscription lookups
CREATE INDEX IF NOT EXISTS idx_contractor_profiles_subscription_status
  ON public.contractor_profiles(subscription_status);

COMMENT ON COLUMN public.contractor_profiles.subscription_status IS 'free or pro subscription tier';
COMMENT ON COLUMN public.contractor_profiles.subscription_expires_at IS 'When the pro subscription expires (NULL = active/no expiry for free)';
COMMENT ON COLUMN public.contractor_profiles.payment_provider_id IS 'Montonio/Maksekeskus subscription/payment ID for recurring billing';
