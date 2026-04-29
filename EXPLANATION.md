# JobHub - Complete Project Workflow & Technology Stack

## Executive Summary
**JobHub** is a modern, full-stack job portal platform that connects students with HR professionals for job opportunities. It's built using cutting-edge web technologies and follows a role-based access control model.

---

## Technology Stack

### Frontend
- **Framework**: Next.js 16 (React 19.2.0)
- **Styling**: Tailwind CSS v4 + shadcn/ui components
- **Form Handling**: React Hook Form + Zod validation
- **Type Safety**: TypeScript
- **Analytics**: Vercel Analytics

### Backend
- **Runtime**: Node.js (Next.js API Routes)
- **Deployment**: Vercel (Production)
- **Environment**: Cloud-based serverless functions

### Database & Authentication
- **Database**: PostgreSQL (Supabase)
- **Auth**: Supabase Auth (Email/Password with JWT)
- **Security**: Row Level Security (RLS) policies
- **ORM**: Direct SQL queries via Supabase client

### Key Libraries
- `@supabase/supabase-js` - Database & auth client
- `@supabase/ssr` - Server-side authentication
- `react-hook-form` - Form state management
- `zod` - Schema validation
- `recharts` - Data visualization
- `lucide-react` - UI icons
- `sonner` - Toast notifications

---

## Database Schema

### Tables

**1. `auth.users` (Supabase Auth)**
- Managed by Supabase
- Stores email, password hash, JWT tokens
- Contains `user_metadata` with `full_name` and `role`

**2. `profiles`**
\`\`\`sql
- id (UUID, PK, FK to auth.users)
- full_name (text)
- email (text)
- role (enum: 'student', 'hr')
- created_at (timestamp)
\`\`\`

**3. `jobs`**
\`\`\`sql
- id (UUID, PK)
- hr_id (UUID, FK to profiles)
- title (text)
- description (text)
- company (text)
- location (text)
- salary_min/max (numeric)
- required_skills (text array)
- posted_at (timestamp)
\`\`\`

**4. `applications`**
\`\`\`sql
- id (UUID, PK)
- job_id (UUID, FK to jobs)
- student_id (UUID, FK to profiles)
- status (enum: 'pending', 'shortlisted', 'accepted', 'rejected')
- applied_at (timestamp)
\`\`\`

### Row Level Security (RLS)
- **HR Users**: Can only view their own posted jobs and applications
- **Students**: Can only view their own applications and all public job postings
- **Cross-user access**: Prevented at database level for data isolation

---

## Application Architecture

### User Flows

#### 1. Authentication Flow
\`\`\`
User Sign Up
    ↓
Enter Email, Password, Full Name, Role
    ↓
Supabase Auth (auth.users table)
    ↓
Profile Trigger (auto-creates profiles entry)
    ↓
JWT Token Generated & Stored in Cookies
    ↓
Redirect to Dashboard
\`\`\`

#### 2. HR Workflow
\`\`\`
HR Login
    ↓
HR Dashboard (View all posted jobs)
    ↓
Create New Job Posting
    ↓
View Applications (Applications page)
    ↓
Review Applications (Job detail page)
    ↓
Shortlist/Accept/Reject Candidates
\`\`\`

#### 3. Student Workflow
\`\`\`
Student Login
    ↓
Browse Jobs (Jobs page with filters)
    ↓
View Job Details
    ↓
Submit Application
    ↓
Track Application Status (Applications page)
    ↓
View Accept/Reject Status
\`\`\`

---

## Project Structure

\`\`\`
v0-job-portal-app/
├── app/
│   ├── page.tsx                    # Landing/Home page
│   ├── layout.tsx                  # Root layout
│   ├── globals.css                 # Global styles (Tailwind v4)
│   ├── auth/
│   │   ├── login/page.tsx          # Login page
│   │   ├── signup/page.tsx         # Sign up page
│   │   └── signup-success/page.tsx # Success page
│   ├── hr/
│   │   ├── layout.tsx              # HR protected layout
│   │   ├── dashboard/page.tsx      # HR job listing & creation
│   │   ├── applications/page.tsx   # All applications view
│   │   └── job/[id]/page.tsx       # Job detail with applications
│   └── student/
│       ├── layout.tsx              # Student protected layout
│       ├── jobs/page.tsx           # Browse all jobs
│       ├── job/[id]/page.tsx       # Job detail with apply button
│       └── applications/page.tsx   # Student's applications
│
├── components/
│   ├── ui/                         # shadcn UI components
│   ├── hr-nav.tsx                  # HR navigation
│   ├── student-nav.tsx             # Student navigation
│   ├── create-job-dialog.tsx       # Job creation modal
│   ├── jobs-table.tsx              # HR jobs listing
│   ├── job-card.tsx                # Job card component
│   ├── job-details.tsx             # Job detail display
│   ├── applications-list.tsx       # Student applications
│   └── job-applications-list.tsx   # HR applications for job
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts               # Browser client
│   │   ├── server.ts               # Server client (SSR)
│   │   └── middleware.ts           # Auth middleware
│   └── utils.ts                    # Utility functions
│
├── scripts/
│   ├── 001_create_tables.sql       # Database schema
│   └── 002_create_profiles_trigger.sql  # Auto profile creation
│
├── proxy.ts                        # Next.js 16 auth proxy
├── middleware.ts                   # Deprecated (now proxy.ts)
├── package.json                    # Dependencies
├── next.config.mjs                 # Next.js config
├── tailwind.config.js              # Tailwind config
├── postcss.config.js               # PostCSS config
└── tsconfig.json                   # TypeScript config
\`\`\`

---

## Key Features

### 1. Authentication & Authorization
- **JWT-based**: Secure token stored in httpOnly cookies
- **Role-based**: Student vs HR Recruiter roles
- **Protected Routes**: Middleware checks auth status
- **Auto Session**: Automatic refresh via Supabase SSR

### 2. HR Features
- **Job Management**: Create, edit, delete job postings
- **Application Tracking**: View all applications per job
- **Candidate Evaluation**: Shortlist, accept, or reject candidates
- **Dashboard**: Overview of posted jobs and application stats
- **Filter & Search**: Find jobs and applications easily

### 3. Student Features
- **Job Browse**: Discover all available job postings
- **Advanced Filters**: Search by company, location, skills
- **Apply**: One-click application submission
- **Track Applications**: View application status in real-time
- **Profile Management**: Store full name and contact info

### 4. Data Security
- **RLS Policies**: Database-level access control
- **No Cross-User Data**: Users only see their own data
- **Encrypted Auth**: JWT tokens + httpOnly cookies
- **XSS Protection**: React/Next.js built-in protections

---

## Data Flow Diagram

\`\`\`
┌─────────────────┐
│  User Browser   │
└────────┬────────┘
         │
    HTTP/HTTPS
         │
    ┌────▼─────────────────┐
    │   Next.js 16 App     │
    │  (Vercel Serverless) │
    │                      │
    ├─ Pages & Routes     │
    ├─ API Routes         │
    └────┬─────────────────┘
         │
    ┌────▼────────────────────┐
    │  Supabase Client SDK    │
    │  (Browser & Server)     │
    └────┬────────────────────┘
         │
    ┌────▼──────────────────────┐
    │   Supabase Backend       │
    │                          │
    ├─ Auth Service           │
    ├─ PostgreSQL Database    │
    ├─ RLS Policies           │
    └──────────────────────────┘
\`\`\`

---

## Authentication Flow (Detailed)

### Sign Up Process
1. User fills form (email, password, full_name, role)
2. Form validated with Zod schema
3. `supabase.auth.signUp()` called with metadata
4. Supabase creates auth record + sends confirmation email
5. Database trigger creates profile entry from auth data
6. User redirected to success page
7. Session automatically established

### Login Process
1. User enters email & password
2. `supabase.auth.signInWithPassword()` called
3. Supabase validates credentials
4. JWT token generated
5. Middleware verifies token on page requests
6. User redirected to appropriate dashboard (HR or Student)

### Session Management
- **Token Refresh**: Automatic via Supabase middleware
- **Expiry**: Default 1 hour, refresh token extends session
- **Logout**: Clears session & cookies via Supabase client

---

## Key Technical Implementations

### 1. Server Component for Auth Check
\`\`\`typescript
// Protects routes at build time
const supabase = createServerClient();
const { data: { user } } = await supabase.auth.getUser();

if (!user) redirect('/auth/login');
\`\`\`

### 2. Database Join with Foreign Keys
\`\`\`typescript
// Fetch applications with student details
const { data: applications } = await supabase
  .from('applications')
  .select('*, profiles:student_id(full_name, email)')
  .eq('job_id', jobId);
\`\`\`

### 3. Row Level Security Policy
\`\`\`sql
-- Only HR can see their own jobs
CREATE POLICY "hr_view_own_jobs" ON jobs
  FOR SELECT
  USING (auth.uid() = hr_id);
\`\`\`

### 4. Form Validation
\`\`\`typescript
// Zod schema for validation
const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().min(2),
  role: z.enum(['student', 'hr'])
});
\`\`\`

---

## Deployment

### Environment Variables (Required)
\`\`\`
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
\`\`\`

### Hosting
- **Platform**: Vercel (Recommended)
- **Database**: Supabase (Managed PostgreSQL)
- **Build**: Next.js 16 optimized build
- **CDN**: Vercel Edge Network

### Production Checklist
- Environment variables set in Vercel
- Database RLS policies enabled
- SSL/HTTPS enforced
- Analytics enabled
- Error monitoring configured

---

## Security Considerations

1. **Authentication**: JWT tokens with secure storage
2. **Database**: RLS policies prevent unauthorized access
3. **Input Validation**: Zod schemas validate all user inputs
4. **Environment**: Sensitive keys never exposed to client
5. **CORS**: API routes handle cross-origin safely
6. **SQL Injection**: Parameterized queries via Supabase client

---

## Performance Optimizations

- **Server Components**: Reduce client-side JavaScript
- **Tailwind CSS**: CSS-in-JS with purging
- **Image Optimization**: Next.js automatic handling
- **Code Splitting**: Route-based splitting
- **Caching**: Vercel edge caching for faster delivery

---

## Future Enhancements

1. Email notifications for applications
2. Advanced filtering & recommendation engine
3. Resume upload & parsing
4. Video interview integration
5. Admin dashboard for platform management
6. Real-time chat between HR and students
7. Analytics dashboard for recruiters
8. Mobile app (React Native)

---

## Submission Summary

This project demonstrates a complete modern full-stack application with:
- **Secure authentication** and role-based authorization
- **Production-grade database** design with RLS
- **Clean architecture** with separated concerns
- **Professional UI/UX** with responsive design
- **Best practices** in Next.js 16 and TypeScript
- **Scalable deployment** on Vercel

The application is fully functional, deployed live, and ready for real-world use!
