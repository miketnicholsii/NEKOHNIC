-- Drop and recreate the public_digital_cv view with security_invoker = true
-- This ensures the view respects RLS policies from the underlying digital_cv table

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