# Database Error Fix: "Database error saving new user"

## Problem
When users try to sign up, they encounter the error: `{"code":"unexpected_failure","message":"Database error saving new user"}`

This error occurs because the user profile is not being created in the database when a new user signs up.

## ⚠️ CRITICAL ISSUE: Column Name Error

**If you see this error**: `ERROR: record "new" has no field "user_metadata"`

This is the primary cause. The trigger is using the wrong column name. **See the HOTFIX below.**

## Root Causes

1. **🔴 CRITICAL: Wrong Metadata Column** - Trigger uses `raw_user_meta_data` but should use `user_metadata`
2. **Trigger Not Executed**: The database trigger that auto-creates profiles when users sign up may not be executing
3. **Invalid Role Value**: The role stored in user metadata might be invalid
4. **Missing Profile Data**: Required fields in the profiles table aren't being populated
5. **RLS Policy Issues**: Row-Level Security policies might be preventing profile creation
6. **Trigger Permissions**: The trigger might lack necessary permissions

## 🚨 HOTFIX (Apply First!)

### Step 1: Apply Hotfix Script (2 minutes)

1. Log into your Supabase project dashboard
2. Go to **SQL Editor** → **New Query**
3. Copy entire contents of: `scripts/004_hotfix_trigger.sql`
4. Click **Run**
5. Verify success message appears

This corrects the metadata column name from `raw_user_meta_data` to `user_metadata`.

### Step 2: Test Immediately
- Go to http://localhost:3000/auth/signup
- Try signing up with test data
- Should now work without the metadata column error

## Solution (If Hotfix Doesn't Work)

### Step 1: Re-run the Setup Scripts in Supabase

1. Log into your Supabase project dashboard
2. Go to **SQL Editor** → **New Query**
3. Copy the contents of `/scripts/001_create_tables.sql` and run it
4. Then copy the contents of `/scripts/004_hotfix_trigger.sql` and run it

The updated trigger includes:
- **Correct metadata column name** (`user_metadata` not `raw_user_meta_data`)
- Better validation of the role field
- Default value handling for full_name
- Proper error handling
- ON CONFLICT clause for idempotency

### Step 2: Verify Trigger Creation

In the Supabase SQL Editor, run:

```sql
-- Check if trigger exists
SELECT 
  t.tgname as trigger_name,
  p.proname as function_name,
  t.tgtype::text,
  t.tgenabled
FROM pg_trigger t
JOIN pg_proc p ON t.tgfoid = p.oid
JOIN pg_class c ON t.tgrelid = c.oid
WHERE c.relname = 'users' AND t.tgname = 'on_auth_user_created';

-- Check function source
SELECT prosrc FROM pg_proc WHERE proname = 'handle_new_user';

-- Check profiles table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;
```

### Step 3: Enable Backup Profile Creation API

We've added an API endpoint at `/api/auth/create-profile` that acts as a backup mechanism. This ensures profiles are created even if the database trigger fails.

The signup flow now:
1. Creates the user in Supabase Auth
2. Calls the API endpoint to create the profile
3. If either step fails, returns a clear error

### Step 4: Test the Setup

1. Clear browser cache and cookies
2. Go to http://localhost:3000/auth/signup
3. Fill in the form:
   - Full Name: John Doe
   - Email: john@example.com
   - Role: Student
   - Password: Test@1234
   - Confirm Password: Test@1234

4. Click "Sign Up"

Expected result: Navigate to signup-success page

### Step 5: Verify Profile Creation

If signup succeeds, verify the profile was created:

In Supabase SQL Editor:
```sql
SELECT id, email, role, full_name, created_at 
FROM public.profiles 
WHERE email = 'john@example.com';
```

You should see a single row with the user data.

## Troubleshooting

### Still Getting "Database error saving new user"?

1. **Check Supabase Auth Settings**
   - Go to Authentication → Providers
   - Ensure Email/Password is enabled
   - Check email configuration

2. **Check Database Logs**
   - In Supabase, go to Logs → Database
   - Look for errors related to profile creation

3. **Verify Environment Variables**
   ```bash
   echo $NEXT_PUBLIC_SUPABASE_URL
   echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
   ```
   Both should be set

4. **Check RLS Policies**
   - Profiles insert policy requires `auth.uid()` to equal the ID
   - This should work automatically for the trigger
   - Run in SQL Editor:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'profiles';
   ```

5. **Check Trigger Permissions**
   - Run in SQL Editor:
   ```sql
   GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated, anon;
   ```

6. **Manual Profile Creation Test**
   - In Supabase SQL Editor:
   ```sql
   -- This tests if you can insert manually
   INSERT INTO public.profiles (id, email, role, full_name)
   VALUES (
     gen_random_uuid(),
     'test@example.com',
     'student',
     'Test User'
   );
   ```
   - If this fails, check the error message
   - Common issues: CHECK constraint on role, NOT NULL constraint violations

### API Endpoint Returning Error?

Check the browser console (F12) for detailed error messages, or check the Next.js server logs for stack traces at `/api/auth/create-profile`.

## Files Modified

- **scripts/003_fix_profiles_trigger.sql**: New improved trigger script
- **app/api/auth/create-profile/route.ts**: New API endpoint for profile creation
- **app/auth/signup/page.tsx**: Updated to call profile creation API as backup

## Next Steps

After fixing this error:

1. Test user signup with both "Student" and "HR Professional" roles
2. Verify users can log in after email confirmation
3. Test role-specific functionality (if applicable)
4. Check that profiles are visible in the database

## Questions?

Review these files for more context:
- `/docs/DATABASE_SETUP.md` for database structure
- `/app/auth/login/page.tsx` to understand the auth flow
