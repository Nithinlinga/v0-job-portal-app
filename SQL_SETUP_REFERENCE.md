# SQL Setup Reference

Copy and paste these scripts into your Supabase SQL Editor to set up your fresh database.

## How to Run

1. Go to your Supabase project: https://app.supabase.com/
2. Click **SQL Editor** on the left sidebar
3. Click **New Query**
4. Copy one of the scripts below
5. Paste it into the editor
6. Click **Run** (or Ctrl+Enter)
7. Wait for success message
8. Repeat for the second script

---

## Script 1: Create Tables and RLS Policies

Copy everything below and paste into a new SQL query:

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

---

## Script 2: Create Auto-Trigger for Profile Creation

Copy everything below and paste into a **new** SQL query:

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

---

## Verification

After running both scripts, verify everything is set up:

### Check Tables
1. Go to **Table Editor** in Supabase
2. You should see:
   - `profiles`
   - `jobs`
   - `applications`

### Check Policies
1. Click on any table
2. Go to **Policies** tab
3. You should see policies like:
   - `profiles_select_own`
   - `jobs_select_all_open`
   - `applications_student_own`
   - etc.

### Check Function/Trigger
1. Go to **Functions** in Supabase
2. You should see `handle_new_user`
3. Click it to verify the trigger is attached

---

## If Something Goes Wrong

### "Permission denied" error
- This is normal if you don't have the right role set in metadata
- The trigger will auto-create your profile on signup

### "Relation 'profiles' does not exist"
- The first script didn't run successfully
- Try running it again
- Check for error messages in Supabase

### "Function already exists"
- The script is idempotent (safe to run multiple times)
- This message is fine, the function was already created

---

## Table Schemas

### profiles
```
- id (UUID, PK) → references auth.users
- email (TEXT)
- full_name (TEXT, nullable)
- role (TEXT) → 'hr' or 'student'
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### jobs
```
- id (UUID, PK)
- created_by (UUID, FK) → profiles.id
- title (TEXT)
- description (TEXT)
- company_name (TEXT)
- salary_min (NUMERIC, nullable)
- salary_max (NUMERIC, nullable)
- location (TEXT)
- job_type (TEXT) → 'full-time', 'part-time', 'internship', 'contract'
- required_skills (TEXT[], default=[])
- qualifications (TEXT, nullable)
- deadline (DATE)
- status (TEXT) → 'open' or 'closed'
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### applications
```
- id (UUID, PK)
- job_id (UUID, FK) → jobs.id
- student_id (UUID, FK) → profiles.id
- resume_url (TEXT)
- cover_letter (TEXT, nullable)
- status (TEXT) → 'pending', 'shortlisted', 'rejected', 'accepted'
- applied_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

---

You're all set! Once these scripts run successfully, your database is ready for the application.
