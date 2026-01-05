-- Drop the misconfigured RESTRICTIVE policy
DROP POLICY IF EXISTS "Only service role can insert contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Allow service role to insert contact submissions" ON public.contact_submissions;

-- Service role bypasses RLS, so we don't need an INSERT policy for it
-- The edge function uses service role key which bypasses RLS automatically
-- Just ensure no policy blocks inserts