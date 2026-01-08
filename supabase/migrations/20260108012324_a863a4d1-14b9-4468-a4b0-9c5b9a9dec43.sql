-- Fix 1: Secure the public_digital_cv view by recreating it with proper email visibility logic
DROP VIEW IF EXISTS public.public_digital_cv;

CREATE VIEW public.public_digital_cv AS
SELECT 
  id,
  user_id,
  slug,
  headline,
  bio,
  skills,
  goals,
  links,
  projects,
  is_published,
  show_email_publicly,
  -- Only show contact_email if show_email_publicly is true
  CASE WHEN show_email_publicly = true THEN contact_email ELSE NULL END AS contact_email,
  seo_title,
  seo_description,
  social_image_url,
  template,
  created_at,
  updated_at
FROM public.digital_cv
WHERE is_published = true;

-- Grant access to authenticated and anon users (read-only view of published CVs)
GRANT SELECT ON public.public_digital_cv TO authenticated, anon;

-- Fix 2: Replace the overly permissive contact_submissions INSERT policy with rate limiting
DROP POLICY IF EXISTS "Rate limited contact form submissions" ON public.contact_submissions;

CREATE POLICY "Anyone can submit contact form"
ON public.contact_submissions
FOR INSERT
TO anon, authenticated
WITH CHECK (
  -- Basic rate limiting: max 5 submissions per IP per hour
  (
    SELECT COUNT(*) < 5
    FROM public.contact_submissions
    WHERE ip_address = current_setting('request.headers', true)::json->>'x-forwarded-for'
      AND created_at > now() - interval '1 hour'
  )
);

-- Fix 3: Add service role read access for contact_submissions (for backend processing)
DROP POLICY IF EXISTS "Only service role can read contact submissions" ON public.contact_submissions;

CREATE POLICY "Service role can read contact submissions"
ON public.contact_submissions
FOR SELECT
TO service_role
USING (true);

-- Also allow admins to read contact submissions
CREATE POLICY "Admins can read contact submissions"
ON public.contact_submissions
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Fix 4: Prevent unauthorized subscription creation - only service_role should insert
-- First, check if there's any existing permissive INSERT policy and remove it
-- The table already lacks INSERT policy which is correct - subscriptions should only be created by:
-- 1. The handle_new_user trigger (for new users)
-- 2. Stripe webhooks via service_role

-- Add explicit restrictive policy to document this behavior
CREATE POLICY "Only system can create subscriptions"
ON public.subscriptions
FOR INSERT
TO authenticated
WITH CHECK (false);

-- Service role bypass RLS so no explicit policy needed for webhooks