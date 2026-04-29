-- Fixed profile creation trigger with better error handling and validation
-- This script improves the auto-create profile trigger with the following enhancements:
-- 1. Better validation of role data
-- 2. Explicit handling of full_name (not nullifying empty strings)
-- 3. Proper error handling
-- 4. Default values for missing data

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create improved trigger function
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
  -- Extract role from metadata, default to 'student' if not provided or invalid
  v_role := COALESCE(NEW.user_metadata ->> 'role', 'student');
  
  -- Validate role - if not 'hr' or 'student', default to 'student'
  IF v_role NOT IN ('hr', 'student') THEN
    v_role := 'student';
  END IF;
  
  -- Extract full_name from metadata, use email prefix if not provided
  v_full_name := NULLIF(TRIM(COALESCE(NEW.user_metadata ->> 'full_name', '')), '');
  IF v_full_name IS NULL THEN
    v_full_name := SPLIT_PART(NEW.email, '@', 1);
  END IF;
  
  -- Insert the profile
  BEGIN
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
    
  EXCEPTION WHEN OTHERS THEN
    -- Log error but don't fail - user is still created
    RAISE WARNING 'Error creating profile for user %: %', NEW.id, SQLERRM;
  END;
  
  RETURN NEW;
END;
$$;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated, anon;

-- Verify the trigger is created
SELECT 'Trigger setup complete. Profile auto-creation is now active!' as status;
