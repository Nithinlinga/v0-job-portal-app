# Job Portal Application

A production-ready full-stack job portal built with **Next.js 16**, **Supabase**, **React 19**, and **Tailwind CSS v4**.

[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white)](https://nextjs.org)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?logo=supabase&logoColor=white)](https://supabase.com)

## 🚀 Fresh Setup Guide

**This project is ready for a completely fresh deployment.** Follow these guides:

1. **[📋 SETUP_SUMMARY.md](./SETUP_SUMMARY.md)** - Start here! Overview of features and quick start
2. **[🔧 FRESH_PROJECT_SETUP.md](./FRESH_PROJECT_SETUP.md)** - Detailed step-by-step instructions
3. **[✅ SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md)** - Checklist to track your progress
4. **[💾 SQL_SETUP_REFERENCE.md](./SQL_SETUP_REFERENCE.md)** - Database schema and setup scripts

### Quick Overview

- ✅ User authentication with role-based access (HR & Student)
- ✅ Job posting and management
- ✅ Job application tracking
- ✅ Secure database with Row Level Security (RLS)
- ✅ Responsive UI with shadcn/ui components
- ✅ Real-time updates with Supabase

## 📦 What You Get

```
├── app/                    # Next.js pages (auth, hr dashboard, student dashboard)
├── components/             # React components (UI, features)
├── lib/supabase/          # Supabase client & middleware
├── scripts/               # SQL migration scripts
├── public/                # Static assets
├── .env.example           # Environment variables template
└── README.md              # This file
```

## 🛠 Tech Stack

- **Frontend**: Next.js 16 + React 19 + TypeScript
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **UI**: shadcn/ui + Tailwind CSS v4
- **Styling**: Responsive design with Tailwind CSS

## 📖 Documentation Files

All guides are in this repository:

| File | Purpose |
|------|---------|
| `SETUP_SUMMARY.md` | Overview, features, and quick start options |
| `FRESH_PROJECT_SETUP.md` | Complete step-by-step setup guide |
| `SETUP_CHECKLIST.md` | Printable checklist for tracking progress |
| `SQL_SETUP_REFERENCE.md` | Database setup scripts |
| `.env.example` | Environment variables template |

## ⚡ Local Development

```bash
# Install dependencies
npm install
# or: pnpm install, yarn install, bun install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Start dev server
npm run dev

# Visit http://localhost:3000
```

## 🔐 Environment Variables Needed

Get these from your Supabase project (Settings → API):

```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

## 🧪 Testing the App

After setup:

1. Create a test HR account
2. Create a test Student account
3. HR: Create a job posting
4. Student: Browse and apply for the job
5. HR: View applications

## 📚 Database Schema

Three main tables with Row Level Security:

- **profiles** - User information and roles
- **jobs** - Job postings
- **applications** - Job applications

See `SQL_SETUP_REFERENCE.md` for complete schema details.

## 🚢 Deployment

Deploy to Vercel (recommended):

1. Push code to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy!

Works on any Node.js 18+ platform (Railway, Render, AWS, etc.)
