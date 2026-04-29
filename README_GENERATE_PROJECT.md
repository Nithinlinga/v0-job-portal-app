# Generate a Job Portal Project Like This

This guide explains how to generate a full-stack Job Portal application similar to the one in this repository.

## What this project includes

- Next.js 16 + React 19 + TypeScript frontend
- Supabase backend with authentication and PostgreSQL database
- Role-based access for `HR` and `Student`
- Job posting, browsing, and application workflow
- Responsive UI built with shadcn/ui + Tailwind CSS v4
- SQL migration scripts for schema creation
- Database Row Level Security (RLS) for secure access control

## Prerequisites

- GitHub account
- Supabase account
- Node.js 18+ installed locally
- A new GitHub repository to host the generated project

## Generate a new project

### 1. Create a new GitHub repository

1. Open GitHub and create a new repository.
2. Clone the new repository locally.
3. Copy the files from this project into your repository.

### 2. Create a new Supabase project

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Use a secure password and provide a project name.
3. Wait for the Supabase project to finish provisioning.

### 3. Initialize the database schema

1. Open the Supabase SQL editor.
2. Create the required tables and triggers by running the scripts in `scripts/`:
   - `001_create_tables.sql`
   - `002_create_profiles_trigger.sql`
3. Confirm the tables are created successfully.

### 4. Add environment variables

Create a `.env.local` file in the project root with the values from your Supabase project settings.

For this app, the required values are:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

If your deployment or database setup requires additional Supabase credentials, also collect these from the Supabase dashboard:

- `SUPABASE_DB_HOST` (database host)
- `SUPABASE_DB_USER` (database user name)
- `SUPABASE_DB_PASSWORD` (database password)
- `SUPABASE_DB_NAME` (database name)
- `SUPABASE_SERVICE_ROLE_KEY` (service role key)

> Use the Supabase `Settings → API` area to copy the URL and anon key, and `Settings → Database` to get connection details.

### 5. Install dependencies

```bash
npm install
```

### 6. Run the development server

```bash
npm run dev
```

Open `http://localhost:3000` to confirm the app loads.

## Project structure

- `app/` — Next.js routes and pages
- `components/` — UI and feature components
- `lib/supabase/` — Supabase client, middleware, and server helpers
- `scripts/` — SQL setup scripts
- `public/` — Static assets
- `styles/` — Global styling

## Recommended setup flow

1. Review `README.md` for project overview.
2. Use `QUICK_START.txt` for the fastest setup path.
3. Follow `FRESH_PROJECT_SETUP.md` for a complete step-by-step walkthrough.
4. Use `SETUP_CHECKLIST.md` to track progress and verify key steps.
5. Reference `SQL_SETUP_REFERENCE.md` for database details.

## Deploying the generated project

1. Push your code to the new GitHub repository.
2. Deploy to Vercel, Railway, Render, or any Node.js hosting provider.
3. Add the Supabase environment variables in your deployment settings.
4. Launch and test the HR and Student flows.

## Notes

- Keep Supabase API keys private.
- Ensure your database scripts run in the correct order.
- If you use v0.app, link the new GitHub repository to the project.

---

This file is intended as a generation guide for creating a new instance of the job portal application architecture shown in this repository.