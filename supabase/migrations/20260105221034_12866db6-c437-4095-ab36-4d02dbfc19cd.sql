-- Add restrictive SELECT policy - only service role can read contact submissions
-- Regular users and authenticated users cannot read this sensitive data
CREATE POLICY "Only service role can read contact submissions" 
  ON public.contact_submissions 
  FOR SELECT 
  USING (false);

-- Note: The service role bypasses RLS, so edge functions can still read data
-- This policy blocks all client-side access while allowing server-side access