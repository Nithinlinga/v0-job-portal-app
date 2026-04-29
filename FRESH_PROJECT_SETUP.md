# Fresh Project Setup Guide - Job Portal App

This guide will help you set up a completely fresh instance of the Job Portal application with a new Supabase database connection.

## Step 1: Create a New GitHub Repository

1. Go to [github.com](https://github.com) and create a new repository
2. Name it something like `job-portal-app-fresh` or your preferred name
3. Initialize with README (optional)
4. Copy the repository URL

## Step 2: Set Up Fresh Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in/sign up
2. Click "New Project"
3. Choose a name (e.g., "Job Portal Fresh")
4. Choose a password (save this somewhere safe)
5. Select your region
6. Click "Create new project" and wait for it to be provisioned (2-3 minutes)

### Step 2a: Get Your Supabase Credentials

1. Once your project is created, go to **Project Settings** → **API**
2. Copy these values (you'll need them soon):
   - **Project URL** (shown as "Project URL")
   - **Anon Key** (shown as "anon public")
   
Example:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

## Step 3: Set Up Database Schema

1. In your Supabase project, go to **SQL Editor**
2. Click **"New Query"**
3. Copy and paste the entire contents of the SQL script below
4. Click **"Run"** to execute
5. Repeat the process for the second SQL script

### SQL Script 1: Create Tables and Policies

```sql
-- Create tables for job portal application

-- Profiles table to store user information
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL CHECK (role IN ('hr', 'student')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Jobs table to store job postings
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  company_name TEXT NOT NULL,
  salary_min NUMERIC,
  salary_max NUMERIC,
  location TEXT NOT NULL,
  job_type TEXT CHECK (job_type IN ('full-time', 'part-time', 'internship', 'contract')),
  required_skills TEXT[] DEFAULT '{}',
  qualifications TEXT,
  deadline DATE NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Applications table to store job applications
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  resume_url TEXT NOT NULL,
  cover_letter TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'shortlisted', 'rejected', 'accepted')),
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Profiles RLS policies
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "students_view_hr_profiles" ON public.profiles FOR SELECT USING (role = 'hr' OR auth.uid() = id);

-- Jobs RLS policies
CREATE POLICY "jobs_select_all_open" ON public.jobs FOR SELECT USING (status = 'open' OR created_by = auth.uid());
CREATE POLICY "jobs_insert_hr_only" ON public.jobs FOR INSERT WITH CHECK (
  auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'hr')
);
CREATE POLICY "jobs_update_hr_own" ON public.jobs FOR UPDATE USING (created_by = auth.uid());
CREATE POLICY "jobs_delete_hr_own" ON public.jobs FOR DELETE USING (created_by = auth.uid());

-- Applications RLS policies
CREATE POLICY "applications_student_own" ON public.applications FOR SELECT USING (student_id = auth.uid());
CREATE POLICY "applications_hr_view_own" ON public.applications FOR SELECT USING (
  job_id IN (SELECT id FROM public.jobs WHERE created_by = auth.uid())
);
CREATE POLICY "applications_insert_student" ON public.applications FOR INSERT WITH CHECK (
  auth.uid() = student_id AND
  auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'student')
);
CREATE POLICY "applications_update_hr_own" ON public.applications FOR UPDATE USING (
  job_id IN (SELECT id FROM public.jobs WHERE created_by = auth.uid())
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_jobs_created_by ON public.jobs(created_by);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON public.jobs(status);
CREATE INDEX IF NOT EXISTS idx_applications_job_id ON public.applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_student_id ON public.applications(student_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications(status);
```

### SQL Script 2: Create Profiles Auto-Trigger

```sql
-- Auto-create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'student')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

## Step 4: Create New v0 Project

1. Go to [v0.app](https://v0.app)
2. Click **"Create new"**
3. Choose **"Code Project"**
4. Connect to your new GitHub repository (you created in Step 1)
5. Initialize the project

## Step 5: Add Application Code

Once your new v0 project is created with the GitHub connection, the easiest way is to:

1. **Download** this current project as a ZIP from v0 (click the three dots in top right → Download ZIP)
2. **Extract** the ZIP file
3. **Copy all files** from the extracted folder to your new repository (except: node_modules, .next, .git, .env.local)
4. **Push to GitHub** - v0 will automatically sync and detect the new files
5. The project will build automatically

## Step 6: Set Environment Variables in v0

1. Open your new v0 project
2. Click **Settings** (top right)
3. Go to **Vars** tab
4. Add these environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

Replace with the credentials you copied in Step 2a.

## Step 7: Deploy to Vercel (Optional)

1. In v0, click the **Publish** button
2. Choose to deploy to Vercel
3. Your app will be live!

## Step 8: Test the Application

1. Visit your deployed URL or local dev environment
2. Create a test account as a student
3. Create a test account as an HR
4. Verify you can post jobs and apply for jobs

## Troubleshooting

### Environment Variables Not Working
- Make sure you're using the exact variable names: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Restart the dev server after adding environment variables
- Check that no extra spaces are included in the values

### Database Connection Errors
- Verify your Supabase credentials are correct
- Check that all SQL scripts ran successfully in Supabase
- Ensure RLS policies are enabled and correct

### Authentication Issues
- Check that Supabase Auth is enabled in your project
- Verify the profiles table and trigger are created properly
- Make sure the metadata is being passed correctly during signup

## What You Have

This is a complete **Job Portal Application** with:

- **User Roles**: HR (employers) and Students (job seekers)
- **Features**:
  - User authentication with role-based signup
  - HR can create and manage job postings
  - Students can browse jobs and apply with resume/cover letter
  - Application tracking and status updates
  - Secure database with Row Level Security (RLS)
- **Tech Stack**:
  - Next.js 16 with React 19
  - Supabase for authentication and database
  - shadcn/ui components with Tailwind CSS
  - TypeScript for type safety

You now have a fresh, fully functional job portal application ready to customize!
