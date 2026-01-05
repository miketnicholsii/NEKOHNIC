-- Drop the overly restrictive INSERT policy
DROP POLICY IF EXISTS "Only service role can insert contact submissions" ON public.contact_submissions;

-- Create a permissive policy that explicitly allows service role inserts
-- Note: Service role bypasses RLS anyway, but this makes intent explicit
CREATE POLICY "Allow service role to insert contact submissions" 
  ON public.contact_submissions 
  FOR INSERT 
  TO service_role
  WITH CHECK (true);