-- Fix: Replace SECURITY_BARRIER with SECURITY_INVOKER
-- SECURITY_BARRIER prevents optimizer leaks but creates a SECURITY DEFINER context
-- SECURITY_INVOKER ensures RLS of the underlying table is respected

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

-- Grant SELECT access to the view
GRANT SELECT ON public.public_digital_cv TO anon, authenticated;