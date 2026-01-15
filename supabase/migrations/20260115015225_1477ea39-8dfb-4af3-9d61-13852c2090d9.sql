-- Drop and recreate the public_digital_cv view with proper email privacy protection
DROP VIEW IF EXISTS public.public_digital_cv;

CREATE VIEW public.public_digital_cv
WITH (security_invoker=on) AS
SELECT
  id,
  user_id,
  slug,
  headline,
  bio,
  goals,
  skills,
  projects,
  links,
  -- Only expose contact_email when user has explicitly opted in
  CASE 
    WHEN show_email_publicly = true THEN contact_email
    ELSE NULL
  END AS contact_email,
  show_email_publicly,
  seo_title,
  seo_description,
  social_image_url,
  template,
  is_published,
  created_at,
  updated_at
FROM public.digital_cv
WHERE is_published = true;