-- Create user_streaks table for tracking login and task streaks
CREATE TABLE public.user_streaks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  
  -- Login streak tracking
  login_streak_current INTEGER NOT NULL DEFAULT 0,
  login_streak_longest INTEGER NOT NULL DEFAULT 0,
  last_login_date DATE,
  
  -- Task completion streak tracking  
  task_streak_current INTEGER NOT NULL DEFAULT 0,
  task_streak_longest INTEGER NOT NULL DEFAULT 0,
  last_task_date DATE,
  
  -- Totals
  total_login_days INTEGER NOT NULL DEFAULT 0,
  total_tasks_completed INTEGER NOT NULL DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.user_streaks ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own streaks" 
ON public.user_streaks 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own streaks" 
ON public.user_streaks 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own streaks" 
ON public.user_streaks 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX idx_user_streaks_user_id ON public.user_streaks(user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_user_streaks_updated_at
  BEFORE UPDATE ON public.user_streaks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add streak-related achievements to earn
-- These will be checked by the frontend achievement system