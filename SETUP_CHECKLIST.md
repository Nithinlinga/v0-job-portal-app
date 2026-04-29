# Fresh Project Setup Checklist

Use this checklist to ensure you complete all steps for setting up a fresh instance of the Job Portal app.

## Pre-Setup

- [ ] You have a GitHub account
- [ ] You have access to create new repositories
- [ ] You have a Supabase account (sign up at supabase.com if needed)
- [ ] You have this current project downloaded/accessible

## Step 1: GitHub Repository Setup

- [ ] Go to github.com
- [ ] Create a new repository (name: `job-portal-app-fresh` or similar)
- [ ] Copy the repository URL
- [ ] Save the URL somewhere (you'll need it soon)

## Step 2: Supabase Project Setup

- [ ] Go to supabase.com and sign in
- [ ] Click "New Project"
- [ ] Fill in:
  - [ ] Project name (e.g., "Job Portal Fresh")
  - [ ] Database password (save this somewhere safe!)
  - [ ] Region (choose closest to you)
- [ ] Wait for project to be provisioned (2-3 minutes)
- [ ] Go to **Settings → API**
- [ ] Copy and save these values:
  - [ ] **Project URL** (save as: `NEXT_PUBLIC_SUPABASE_URL`)
  - [ ] **Anon Key** (save as: `NEXT_PUBLIC_SUPABASE_ANON_KEY`)

## Step 3: Database Schema Setup

- [ ] In Supabase, go to **SQL Editor**
- [ ] Click **New Query**
- [ ] Open file: `SQL_SETUP_REFERENCE.md`
- [ ] Copy **Script 1** (Create Tables)
- [ ] Paste into Supabase SQL Editor
- [ ] Click **Run**
- [ ] Wait for success message
- [ ] Go back to SQL Editor
- [ ] Click **New Query**
- [ ] Copy **Script 2** (Create Trigger)
- [ ] Paste into new query
- [ ] Click **Run**
- [ ] Verify both scripts completed without errors

### Verification
- [ ] Go to **Table Editor** in Supabase
- [ ] See `profiles` table
- [ ] See `jobs` table
- [ ] See `applications` table
- [ ] Click each table and verify columns exist

## Step 4: v0 Project Setup

- [ ] Go to v0.app
- [ ] Click **Create new**
- [ ] Choose **Code Project**
- [ ] Connect to your new GitHub repository (from Step 1)
- [ ] Initialize the project
- [ ] Wait for it to finish

## Step 5: Code Setup

Choose **ONE** of these options:

### Option A: Manual File Copy (Recommended)
- [ ] Download this project as ZIP from v0 (top right → ... → Download ZIP)
- [ ] Extract the ZIP file
- [ ] Copy ALL files from extracted folder EXCEPT:
  - [ ] `node_modules/` folder
  - [ ] `.next/` folder
  - [ ] `.git/` folder
  - [ ] `.env.local` file
- [ ] Paste into your new repository (clone locally or use GitHub web interface)
- [ ] Commit and push to main branch
- [ ] Go back to your v0 project - it should auto-sync

### Option B: Manual File by File
- [ ] Go to your new v0 project
- [ ] Create folders: `app/`, `components/`, `lib/`, `scripts/`, `public/`, `styles/`
- [ ] Copy each file from this project to new project (you can view files in v0)
- [ ] Create config files: `next.config.mjs`, `tsconfig.json`, `tailwind.config.ts`, etc.
- [ ] (This is tedious - Option A is recommended)

## Step 6: Environment Variables

- [ ] In your new v0 project, click **Settings** (top right)
- [ ] Go to **Vars** tab
- [ ] Click **Add Variable**
- [ ] Name: `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Value: (paste the value from Step 2)
- [ ] Click **Save**
- [ ] Click **Add Variable** again
- [ ] Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Value: (paste the value from Step 2)
- [ ] Click **Save**
- [ ] Verify both variables are added
- [ ] Restart dev server if it's running

## Step 7: Testing

- [ ] Open your v0 project preview (or local dev server)
- [ ] You should see the home page
- [ ] Go to /auth/signup
- [ ] Create a test account as "HR"
- [ ] You should be logged in
- [ ] Go to /hr/dashboard
- [ ] Create a test job
- [ ] Logout (check for logout button)
- [ ] Create another test account as "Student"
- [ ] Go to /student/jobs
- [ ] See the job you created
- [ ] Click on the job
- [ ] Apply for the job
- [ ] Logout and login as HR
- [ ] Go to /hr/applications
- [ ] See the application you submitted

## Step 8: Deployment (Optional)

- [ ] In v0, click **Publish**
- [ ] Choose to deploy to Vercel (or another platform)
- [ ] Follow deployment wizard
- [ ] Add environment variables to production environment
- [ ] Visit deployed URL
- [ ] Test again to make sure everything works

## Step 9: Customization (Optional)

- [ ] Update branding (logo, colors, company name)
- [ ] Customize UI to match your brand
- [ ] Add additional features as needed
- [ ] Add more job fields or application fields
- [ ] Test everything again

## Troubleshooting

If you encounter issues:

1. **Environment variables not working**
   - [ ] Check variable names are EXACTLY: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - [ ] No extra spaces
   - [ ] Restart dev server
   - [ ] Check browser console for errors

2. **Database connection errors**
   - [ ] Verify credentials are correct (copy-paste from Supabase Settings → API)
   - [ ] Check that all SQL scripts ran successfully
   - [ ] Go to Table Editor in Supabase - can you see tables?
   - [ ] Check RLS policies are enabled

3. **Authentication not working**
   - [ ] Check Supabase Auth is enabled
   - [ ] Verify profiles table exists
   - [ ] Check trigger function exists in Supabase
   - [ ] Try creating an account and check profiles table for new row

4. **Application won't start**
   - [ ] Check browser console for errors
   - [ ] Check v0 console/logs
   - [ ] Verify all environment variables are set
   - [ ] Try restarting dev server

5. **"Permission denied" errors**
   - [ ] Check RLS is enabled on tables
   - [ ] Verify policies exist
   - [ ] Check user role is set in profiles table
   - [ ] Go to Supabase → go to Table Editor → profiles → check your user record has a role set

## Files You Now Have

- [ ] Complete Next.js 16 application
- [ ] Supabase integration setup
- [ ] Database schema with RLS
- [ ] Authentication flows
- [ ] HR and Student dashboards
- [ ] Job management features
- [ ] Application tracking
- [ ] UI components (shadcn/ui)
- [ ] Responsive design

## What's Next?

After completing all steps:

1. ✅ You have a fresh, isolated instance
2. ✅ You have a new Supabase project
3. ✅ Your code is in a new GitHub repo
4. ✅ Your app is deployed and working

Next steps:
- [ ] Share with team members
- [ ] Get feedback on the app
- [ ] Add custom branding
- [ ] Add additional features
- [ ] Deploy to production
- [ ] Monitor and maintain

---

## Quick Reference

**Key URLs**
- Supabase: https://app.supabase.com
- v0: https://v0.app
- GitHub: https://github.com

**Key Credentials**
- `NEXT_PUBLIC_SUPABASE_URL` = (from Supabase Settings → API)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (from Supabase Settings → API)

**Test Accounts**
- Account 1: HR role (can create jobs)
- Account 2: Student role (can browse and apply)

---

**Total Estimated Time**: 30-45 minutes

Good luck! 🚀
