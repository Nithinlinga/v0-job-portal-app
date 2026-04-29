# Fix Summary: Database Error Saving New User

## What Was Wrong

The error `{"code":"unexpected_failure","message":"Database error saving new user"}` was occurring because:

1. The database trigger wasn't properly creating user profiles
2. The trigger had insufficient validation and error handling
3. There was no backup mechanism if the trigger failed

## Changes Made

### 1. **Improved Database Trigger** (`scripts/003_fix_profiles_trigger.sql`)
   - Added role validation (ensures only 'hr' or 'student')
   - Improved full_name handling with fallback logic
   - Added exception handling to prevent trigger failures
   - Uses ON CONFLICT to handle edge cases

### 2. **Backup API Endpoint** (`app/api/auth/create-profile/route.ts`)
   - Creates user profiles via REST API
   - Acts as failsafe if database trigger doesn't work
   - Includes comprehensive error handling
   - Validates all inputs

### 3. **Updated Signup Flow** (`app/auth/signup/page.tsx`)
   - Now calls the profile creation API after successful auth signup
   - Ensures profile is created either by trigger or by API
   - Better error messages for debugging

## How to Apply the Fix

### Option A: Fresh Setup (Recommended)

1. **Create a NEW Supabase project** (if you want a clean slate)
2. **Run these scripts in order:**
   ```
   scripts/001_create_tables.sql
   scripts/003_fix_profiles_trigger.sql
   ```
3. **Update environment variables** in `.env.local`
4. **Deploy the updated code**

### Option B: Update Existing Supabase Project

1. **In Supabase SQL Editor**, run `scripts/003_fix_profiles_trigger.sql`
2. **Deploy the updated Next.js code** (signup page + API route)
3. **Test signup**

### Option C: Manual Debugging

1. **Check trigger** in Supabase SQL Editor:
   ```sql
   SELECT tgname FROM pg_trigger WHERE tgrelid = 'auth.users'::regclass;
   ```

2. **Check if profiles table exists:**
   ```sql
   SELECT * FROM information_schema.tables 
   WHERE table_schema = 'public' AND table_name = 'profiles';
   ```

3. **Manually create a test profile:**
   ```sql
   INSERT INTO public.profiles (id, email, role, full_name)
   VALUES (gen_random_uuid(), 'test@example.com', 'student', 'Test User');
   ```
   - If this fails, check the error message for constraint violations

## Testing the Fix

1. **Clear browser cache** (Ctrl+Shift+Delete in Chrome)
2. **Go to** http://localhost:3000/auth/signup
3. **Fill in form:**
   - Full Name: John Doe
   - Email: john@example.com  
   - Role: Student
   - Password: Test@1234
   - Confirm Password: Test@1234
4. **Click Sign Up**
5. **Expected result:** Redirected to signup-success page
6. **Verify in Supabase:**
   ```sql
   SELECT * FROM public.profiles WHERE email = 'john@example.com';
   ```

## If It Still Doesn't Work

1. Check Next.js server console for error messages
2. Check Supabase logs: Dashboard → Logs → Database  
3. Verify RLS policies aren't blocking profile creation
4. Check that both environment variables are correctly set:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Files Changed

```
scripts/003_fix_profiles_trigger.sql     (NEW)
app/api/auth/create-profile/route.ts    (NEW)
app/auth/signup/page.tsx                (UPDATED)
docs/DATABASE_ERROR_FIX.md              (NEW)
docs/QUICK_FIX_SUMMARY.md               (THIS FILE)
```

## Next: Live Testing

Once fixed, test:
- ✅ Students can sign up
- ✅ HR users can sign up
- ✅ Profiles appear in database
- ✅ Users receive confirmation email
- ✅ Users can log in after confirming email
