-- Fix PUBLIC_PROMO_CODES: Restrict promo codes to authenticated users only (they'll validate at checkout)
DROP POLICY IF EXISTS "Promo codes are publicly readable" ON public.promo_codes;
DROP POLICY IF EXISTS "Authenticated users can read active promo codes" ON public.promo_codes;

-- Only allow promo code validation through edge functions using service role
-- No direct client access to promo_codes table
CREATE POLICY "No direct promo code access"
ON public.promo_codes
FOR SELECT
USING (false);

-- Fix RLS_POLICY_ALWAYS_TRUE: Replace service role wildcard policies with proper checks
DROP POLICY IF EXISTS "Service role can manage subscriptions" ON public.subscriptions;

-- Service role already bypasses RLS by default, remove explicit policies that use 'true'
-- Users can only view their own subscriptions
DROP POLICY IF EXISTS "Users can view own subscriptions" ON public.subscriptions;
CREATE POLICY "Users can view own subscriptions"
ON public.subscriptions
FOR SELECT
USING (auth.uid() = user_id);