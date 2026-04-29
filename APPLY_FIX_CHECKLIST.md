# Checklist: Fix Database Error "Database error saving new user"

## ✅ Step-by-Step Fix

### Step 1: Update Database Trigger (5 minutes)
- [ ] Open Supabase Dashboard
- [ ] Go to SQL Editor → New Query
- [ ] Copy entire contents of `scripts/003_fix_profiles_trigger.sql`
- [ ] Paste into Supabase SQL Editor
- [ ] Click "Run" button
- [ ] Verify success message appears

### Step 2: Verify Trigger Installation (2 minutes)
In Supabase SQL Editor, run this query:
```sql
SELECT tgname, tgenabled FROM pg_trigger tt
JOIN pg_class c ON tt.tgrelid = c.oid  
WHERE c.relname = 'users';
```
- [ ] Verify `on_auth_user_created` trigger is listed
- [ ] Verify `tgenabled` is `true`

### Step 3: Deploy Updated Code (5 minutes)
- [ ] Open project in VS Code
- [ ] Files have already been updated:
  - `app/api/auth/create-profile/route.ts` ✅
  - `app/auth/signup/page.tsx` ✅
  - `scripts/003_fix_profiles_trigger.sql` ✅
- [ ] Commit changes: `git add . && git commit -m "Fix: Add profile creation API and improve auth trigger"`
- [ ] Deploy to your hosting platform (Vercel, Railway, etc.)

### Step 4: Test Signup (5 minutes)
- [ ] Clear browser cache (Ctrl+Shift+Delete)
- [ ] Go to http://localhost:3000/auth/signup
- [ ] Fill signup form:
  - Full Name: `Test User`
  - Email: `test@example.com`
  - Role: `Student`
  - Password: `Test@12345`
  - Confirm: `Test@12345`
- [ ] Click "Sign Up" button
- [ ] Verify redirected to signup-success page
- [ ] Check Next.js console for errors

### Step 5: Verify Profile Created (3 minutes)
In Supabase SQL Editor, run:
```sql
SELECT * FROM public.profiles 
WHERE email = 'test@example.com';
```
- [ ] Verify one row appears with:
  - `email`: test@example.com
  - `role`: student
  - `full_name`: Test User
  - `created_at`: recent timestamp

### Step 6: Clean Up Test Data (1 minute)
```sql
DELETE FROM public.profiles 
WHERE email = 'test@example.com';
```
- [ ] Execute query to remove test profile

## ✅ Verification Checklist

### Database Setup
- [ ] `profiles` table exists  
- [ ] `profiles` table has columns: id, email, full_name, role, created_at, updated_at
- [ ] `on_auth_user_created` trigger exists and is enabled
- [ ] RLS is enabled on `profiles` table
- [ ] Insert policy exists for authenticated users

### Application Code
- [ ] `scripts/003_fix_profiles_trigger.sql` contains improved trigger
- [ ] `app/api/auth/create-profile/route.ts` exists and can handle POST requests
- [ ] `app/auth/signup/page.tsx` calls profile creation API after signup
- [ ] Environment variables are set:
  - [ ] `NEXT_PUBLIC_SUPABASE_URL` 
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Testing
- [ ] Student signup works
- [ ] HR signup works  
- [ ] Profile is created in database
- [ ] Email confirmation email is sent
- [ ] Login works with new user account

## ⚠️ If Something Still Doesn't Work

### Troubleshooting Steps

1. **Check API Error Response**
   - Open browser DevTools (F12)
   - Go to Network tab
   - Try signup again
   - Look for failed `create-profile` request
   - Check Response tab for error message

2. **Check Server Logs**
   - Look at Next.js server console output
   - Should show error from `/api/auth/create-profile`
   - Copy full error message

3. **Check Supabase Logs**
   - Supabase Dashboard → Logs → Database
   - Look for errors in recent activity
   - Check Auth → Logs for signup errors

4. **Test Trigger Manually**
   ```sql
   -- This tests manual profile creation
   INSERT INTO public.profiles 
   (id, email, role, full_name) 
   VALUES (
     gen_random_uuid(),
     'manual@example.com',
     'student',
     'Manual Test'
   );
   ```
   - If this fails, screenshot error
   - Check table structure matches expected schema

5. **Reset and Try Again**
   - Drop and recreate profiles table:
   ```sql
   DROP TABLE IF EXISTS public.applications;
   DROP TABLE IF EXISTS public.jobs;  
   DROP TABLE IF EXISTS public.profiles;
   ```
   - Re-run `scripts/001_create_tables.sql`
   - Re-run `scripts/003_fix_profiles_trigger.sql`

## 📝 Estimated Time

- Database updates: 5 minutes
- Code deployment: 5-10 minutes
- Testing: 5 minutes
- **Total: 15-20 minutes**

## 🎯 Next Steps After Fix

1. Test with multiple users
2. Test both Student and HR roles
3. Test email confirmation flow
4. Test login with new users
5. Monitor Supabase logs for any errors
6. Update any CI/CD pipelines if needed

---

**Version**: 1.0  
**Last Updated**: April 2026  
**Status**: Ready to implement
