-- Drop the existing view and recreate with conditional email exposure
DROP VIEW IF EXISTS public.public_digital_cv;

-- Create new view that respects show_email_publicly preference
CREATE VIEW public.public_digital_cv
WITH (security_invoker = on)
AS
SELECT 
  id,
  user_id,
  headline,
  bio,
  goals,
  skills,
  links,
  projects,
  slug,
  is_published,
  template,
  seo_title,
  seo_description,
  social_image_url,
  show_email_publicly,
  created_at,
  updated_at,
  -- Only expose contact_email when user has explicitly allowed it
  CASE 
    WHEN show_email_publicly = true THEN contact_email
    ELSE NULL
  END as contact_email
FROM public.digital_cv
WHERE is_published = true;