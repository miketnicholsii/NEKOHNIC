-- Allow admins to view all profiles for user management
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Allow admins to update any profile
CREATE POLICY "Admins can update any profile"
ON public.profiles
FOR UPDATE
USING (has_role(auth.uid(), 'admin'));

-- Allow admins to view all subscriptions for user management
CREATE POLICY "Admins can view all subscriptions"
ON public.subscriptions
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Allow admins to update any subscription (for manual tier override)
CREATE POLICY "Admins can update any subscription"
ON public.subscriptions
FOR UPDATE
USING (has_role(auth.uid(), 'admin'));

-- Allow admins to view all user achievements
CREATE POLICY "Admins can view all achievements"
ON public.user_achievements
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Allow admins to view all user streaks
CREATE POLICY "Admins can view all streaks"
ON public.user_streaks
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Allow admins to view all user tasks
CREATE POLICY "Admins can view all tasks"
ON public.user_tasks
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Allow admins to view all tradelines
CREATE POLICY "Admins can view all tradelines"
ON public.tradelines
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Allow admins to view all credit scores
CREATE POLICY "Admins can view all credit scores"
ON public.credit_scores
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Allow admins to view all progress
CREATE POLICY "Admins can view all progress"
ON public.progress
FOR SELECT
USING (has_role(auth.uid(), 'admin'));