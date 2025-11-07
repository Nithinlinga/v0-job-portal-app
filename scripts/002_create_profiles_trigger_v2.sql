-- Updated trigger to properly handle full_name extraction
-- Run this in Supabase SQL Editor to replace the old trigger

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'student'),
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', '')
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    role = COALESCE(NEW.raw_user_meta_data ->> 'role', 'student'),
    updated_at = NOW();
  
  RETURN NEW;
END;
$$;
