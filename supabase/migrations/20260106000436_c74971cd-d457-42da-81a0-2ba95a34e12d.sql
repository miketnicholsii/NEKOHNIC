-- Add unique constraint on progress table for upsert operations
ALTER TABLE public.progress ADD CONSTRAINT progress_user_module_step_unique UNIQUE (user_id, module, step);