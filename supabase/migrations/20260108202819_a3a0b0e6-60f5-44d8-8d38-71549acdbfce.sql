-- Fix 1: Add soft delete protection for credit_scores
-- Instead of preventing deletion (which users need for data management), 
-- we'll add an explicit admin delete policy for subscriptions

-- Fix 2: Add explicit DELETE policy for subscriptions table (only admins can delete)
CREATE POLICY "Only admins can delete subscriptions"
ON public.subscriptions
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));