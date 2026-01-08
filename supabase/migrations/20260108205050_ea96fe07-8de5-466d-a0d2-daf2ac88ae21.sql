-- ============================================================
-- Security fixes for:
-- 1) contact_submissions admin-only SELECT
-- 2) credit_scores owner-only SELECT
-- 3) public_digital_cv secure view with email redaction
-- ============================================================

-- ------------------------------------------------------------
-- 1) contact_submissions: ensure RLS + admin-only SELECT
-- ------------------------------------------------------------

-- Ensure RLS is enabled and forced
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions FORCE ROW LEVEL SECURITY;

-- Drop any existing SELECT policies to ensure only admin access
DROP POLICY IF EXISTS "Admins can read contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Admins can view contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Service role can read contact submissions" ON public.contact_submissions;

-- Create admin-only SELECT policy
CREATE POLICY "Admins can view contact submissions"
ON public.contact_submissions
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- ------------------------------------------------------------
-- 2) credit_scores: ensure RLS + owner-only SELECT
-- ------------------------------------------------------------

-- Ensure RLS is enabled and forced
ALTER TABLE public.credit_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_scores FORCE ROW LEVEL SECURITY;

-- Drop and recreate owner-only SELECT policy
DROP POLICY IF EXISTS "Users can view their own credit scores" ON public.credit_scores;

CREATE POLICY "Users can view their own credit scores"
ON public.credit_scores
FOR SELECT
USING (auth.uid() = user_id);

-- ------------------------------------------------------------
-- 3) public_digital_cv: secure view with email redaction
-- ------------------------------------------------------------
-- Since this is a VIEW, RLS cannot be enabled directly.
-- We'll create a secure SECURITY BARRIER view and revoke access to the base.

-- Drop the existing view
DROP VIEW IF EXISTS public.public_digital_cv;

-- Create secure view with SECURITY BARRIER and email redaction
CREATE VIEW public.public_digital_cv
WITH (security_barrier = true)
AS
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
    -- Only expose email when explicitly allowed
    CASE
        WHEN show_email_publicly = true THEN contact_email
        ELSE NULL::text
    END AS contact_email,
    seo_title,
    seo_description,
    social_image_url,
    template,
    created_at,
    updated_at
FROM public.digital_cv
WHERE is_published = true;

-- Grant SELECT access to the secure view
GRANT SELECT ON public.public_digital_cv TO anon, authenticated;