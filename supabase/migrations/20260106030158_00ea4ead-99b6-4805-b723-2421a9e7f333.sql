-- Create promo_codes table
CREATE TABLE public.promo_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  discount_percent INTEGER DEFAULT 0,
  free_months INTEGER DEFAULT 0,
  tier_upgrade TEXT, -- 'start', 'build', 'scale' or null
  max_uses INTEGER, -- null for unlimited
  current_uses INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create promo_code_redemptions table to track who used which code
CREATE TABLE public.promo_code_redemptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  promo_code_id UUID REFERENCES public.promo_codes(id) ON DELETE CASCADE NOT NULL,
  user_id UUID NOT NULL,
  redeemed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promo_code_redemptions ENABLE ROW LEVEL SECURITY;

-- Promo codes are readable by anyone (to validate codes)
CREATE POLICY "Promo codes are publicly readable" 
ON public.promo_codes 
FOR SELECT 
USING (true);

-- Only admins can manage promo codes (INSERT, UPDATE, DELETE handled via service role)

-- Users can view their own redemptions
CREATE POLICY "Users can view their own redemptions" 
ON public.promo_code_redemptions 
FOR SELECT 
USING (auth.uid() = user_id);

-- Users can insert their own redemptions
CREATE POLICY "Users can redeem promo codes" 
ON public.promo_code_redemptions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create index for faster code lookups
CREATE INDEX idx_promo_codes_code ON public.promo_codes(code);
CREATE INDEX idx_promo_codes_active ON public.promo_codes(is_active) WHERE is_active = true;

-- Add trigger for updated_at
CREATE TRIGGER update_promo_codes_updated_at
BEFORE UPDATE ON public.promo_codes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert a sample promo code for testing
INSERT INTO public.promo_codes (code, description, tier_upgrade, max_uses)
VALUES ('WELCOME2024', 'Welcome promo - 1 month free Build tier', 'build', 100);