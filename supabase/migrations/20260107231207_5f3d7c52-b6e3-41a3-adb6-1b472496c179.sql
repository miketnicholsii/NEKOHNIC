-- Drop and recreate view with SECURITY INVOKER (the default, but explicit)
DROP VIEW IF EXISTS public.public_digital_cv;

CREATE VIEW public.public_digital_cv 
WITH (security_invoker = true) AS
SELECT 
  id,
  user_id,
  slug,
  headline,
  bio,
  goals,
  skills,
  links,
  projects,
  template,
  is_published,
  show_email_publicly,
  -- Only expose contact_email when user explicitly consents
  CASE WHEN show_email_publicly = true THEN contact_email ELSE NULL END AS contact_email,
  seo_title,
  seo_description,
  social_image_url,
  created_at,
  updated_at
FROM public.digital_cv
WHERE is_published = true;

-- Grant access to the view for anonymous and authenticated users
GRANT SELECT ON public.public_digital_cv TO anon;
GRANT SELECT ON public.public_digital_cv TO authenticated;

COMMENT ON VIEW public.public_digital_cv IS 'Secure public view of digital CVs that only exposes contact_email when show_email_publicly is true';