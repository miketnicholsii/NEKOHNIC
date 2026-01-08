-- Fix 1: Recreate public_digital_cv view with security_invoker = true
-- This ensures the view inherits RLS policies from the base digital_cv table
DROP VIEW IF EXISTS public.public_digital_cv;

CREATE VIEW public.public_digital_cv
WITH (security_invoker = true)
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
FROM digital_cv
WHERE is_published = true;

-- Fix 2: Remove overly permissive promo_codes policy
-- Users should not be able to browse all active promo codes
DROP POLICY IF EXISTS "Authenticated users can view active promo codes" ON public.promo_codes;

-- Keep only the restrictive policy "No direct promo code access" which returns false
-- Promo codes should only be validated through a secure edge function, not directly queried