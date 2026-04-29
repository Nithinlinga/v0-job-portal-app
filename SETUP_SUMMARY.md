# Job Portal App - Fresh Setup Summary

Your project is ready to be deployed as a fresh instance. Here's what you have and what to do next.

## What's Included

This is a **complete, production-ready Job Portal application** with:

### Features
- ✅ User Authentication (Email/Password)
- ✅ Role-based Access (HR & Student)
- ✅ Job Postings Management
- ✅ Job Applications Tracking
- ✅ Responsive Dashboard
- ✅ Real-time Updates with Supabase
- ✅ Row Level Security (RLS) for data protection

### Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Frontend**: React 19 with TypeScript
- **UI**: shadcn/ui Components
- **Styling**: Tailwind CSS v4
- **Deployment**: Vercel (optional)

## Quick Start

### Option A: Fresh Setup (Recommended)

Follow the **FRESH_PROJECT_SETUP.md** file step-by-step:

1. ✅ Create new GitHub repo
2. ✅ Create new Supabase project
3. ✅ Run SQL scripts to set up database
4. ✅ Create new v0 project connected to your repo
5. ✅ Copy files from this project
6. ✅ Add environment variables
7. ✅ Deploy and test

**Estimated time**: 30 minutes

### Option B: Use Current Project with New DB

If you want to use this project directly with a new database:

1. Create a new Supabase project
2. Run the SQL scripts from `scripts/` folder in your new Supabase
3. Update environment variables with new Supabase credentials
4. Restart dev server

**Estimated time**: 10 minutes

## Key Credentials You'll Need

```
NEXT_PUBLIC_SUPABASE_URL = https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGc...
```

These go in:
- v0 Settings → Vars (for deployed/preview)
- `.env.local` file (for local development)

See `.env.example` for the template.

## Project Structure

```
├── app/
│   ├── auth/              # Authentication pages
│   ├── hr/                # HR dashboard
│   ├── student/           # Student dashboard
│   └── layout.tsx         # Root layout
├── components/
│   ├── ui/                # shadcn/ui components
│   └── ...                # Feature components
├── lib/
│   └── supabase/          # Supabase client & middleware
├── scripts/               # SQL setup scripts
├── public/                # Static assets
└── package.json
```

## Database Schema

### Tables
1. **profiles** - User information and role
2. **jobs** - Job postings
3. **applications** - Job applications

### Row Level Security
- Students can only see open jobs and own applications
- HR can only manage own jobs and see applications for own jobs
- Profiles are semi-public (HRs visible to students)

## Running Locally

```bash
# Install dependencies
npm install
# or pnpm install / yarn install

# Start dev server
npm run dev

# Visit
http://localhost:3000
```

## Testing Accounts

After setup, create test accounts:
- **HR Account**: Sign up with role "HR"
- **Student Account**: Sign up with role "Student"

Test the flow:
1. Login as HR
2. Create a job posting
3. Logout and login as Student
4. Browse and apply for the job
5. Logout and check as HR - see applications

## Deployment

### To Vercel
1. In v0, click **Publish**
2. Select Vercel deployment
3. Add environment variables in Vercel project settings
4. Deploy!

### To Other Platforms
- The app is a standard Next.js app
- Works on: Railway, Render, AWS, Azure, etc.
- Requires Node.js 18+

## Troubleshooting

### "Connection failed" or "Cannot read properties of undefined"
- Check that NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set
- Verify they're correct in Supabase Settings → API
- Restart the dev server

### "User not found" during signup
- Check that profiles table exists
- Verify the trigger is created (check Functions in Supabase)
- Check RLS policies are correct

### "Permission denied" errors
- Verify RLS policies are enabled on tables
- Check that user has correct role in profiles table
- Ensure the policies match the queries being run

## What to Customize

1. **Branding**: Update logo, colors, company name
2. **Features**: Add resume storage, notifications, etc.
3. **Fields**: Add more job details, application fields, etc.
4. **Styling**: Customize Tailwind colors and layout

## Next Steps

1. Follow **FRESH_PROJECT_SETUP.md** to create your fresh instance
2. Test authentication and core features
3. Customize branding and features as needed
4. Deploy to Vercel or your preferred platform
5. Share with users!

## Support

For issues:
1. Check the FRESH_PROJECT_SETUP.md troubleshooting section
2. Verify Supabase configuration
3. Check browser console for errors
4. Review database logs in Supabase dashboard

---

**You're all set! Follow the FRESH_PROJECT_SETUP.md guide to get started.** 🚀
