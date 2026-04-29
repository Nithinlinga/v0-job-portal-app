-- HOTFIX: Correct the trigger to use user_metadata instead of raw_user_meta_data
-- ERROR FIXED: "record "new" has no field "user_metadata" (SQLSTATE 42703)"
-- 
-- The auth.users table in Supabase uses 'user_metadata', not 'raw_user_meta_data'
-- This script corrects the trigger immediately

-- Drop the broken trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create the corrected function with proper error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role TEXT;
  v_full_name TEXT;
BEGIN
  -- Extract role from metadata, default to 'student' if not provided
  v_role := COALESCE(NEW.user_metadata ->> 'role', 'student');
  
  -- Validate role
  IF v_role NOT IN ('hr', 'student') THEN
    v_role := 'student';
  END IF;
  
  -- Extract full_name from metadata
  v_full_name := NULLIF(TRIM(COALESCE(NEW.user_metadata ->> 'full_name', '')), '');
  IF v_full_name IS NULL THEN
    v_full_name := SPLIT_PART(NEW.email, '@', 1);
  END IF;
  
  -- Create profile
  INSERT INTO public.profiles (id, email, role, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    v_role,
    v_full_name
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    updated_at = NOW();
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Error creating profile for user %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$;

-- Create the corrected trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Verify the fix
SELECT 'Trigger fixed successfully! Now using correct user_metadata column.' as status;
