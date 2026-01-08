-- Fix the SECURITY DEFINER view issue by explicitly setting SECURITY INVOKER
-- This ensures the view uses the permissions of the querying user, not the view creator
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

-- Grant SELECT on the view to public roles
GRANT SELECT ON public.public_digital_cv TO anon, authenticated;