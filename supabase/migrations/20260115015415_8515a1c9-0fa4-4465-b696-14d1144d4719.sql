-- Add explicit deny policy for non-admin SELECT on contact_submissions
-- This provides defense-in-depth even though existing restrictive policies should block access

-- First, drop the existing admin policy to recreate it as PERMISSIVE
DROP POLICY IF EXISTS "Admins can view contact submissions" ON public.contact_submissions;

-- Create a PERMISSIVE admin policy (allows admins to SELECT)
CREATE POLICY "Admins can view contact submissions"
ON public.contact_submissions
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add explicit default deny for all other users (RESTRICTIVE policy that blocks everyone else)
CREATE POLICY "Block public SELECT access"
ON public.contact_submissions
FOR SELECT
TO anon
USING (false);

-- Verify RLS is enabled (should already be, but ensure it)
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;