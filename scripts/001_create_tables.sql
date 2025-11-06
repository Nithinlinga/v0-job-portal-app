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
