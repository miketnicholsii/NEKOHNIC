-- Add opt-in field for public email display
ALTER TABLE public.digital_cv 
ADD COLUMN show_email_publicly boolean NOT NULL DEFAULT false;

-- Add comment for documentation
COMMENT ON COLUMN public.digital_cv.show_email_publicly IS 'User must explicitly opt-in to show their contact email on the public profile';