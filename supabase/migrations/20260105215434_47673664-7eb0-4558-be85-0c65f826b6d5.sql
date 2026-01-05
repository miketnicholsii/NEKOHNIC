-- Create table for contact form submissions
CREATE TABLE public.contact_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  business_name TEXT,
  stage TEXT,
  goal TEXT,
  message TEXT,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy for inserts (anyone can submit, no auth required for public form)
CREATE POLICY "Anyone can submit contact form" 
  ON public.contact_submissions 
  FOR INSERT 
  WITH CHECK (true);

-- Create policy for select (only authenticated admin can view - we'll rely on edge function for access)
-- For now, no select policy means only backend/edge functions can read
-- This keeps submissions private

-- Add index on created_at for querying recent submissions
CREATE INDEX idx_contact_submissions_created_at ON public.contact_submissions(created_at DESC);