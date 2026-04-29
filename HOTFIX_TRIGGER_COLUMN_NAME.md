# 🚨 CRITICAL FIX: Database Trigger Column Name Error

## Error Log
```
ERROR: record "new" has no field "user_metadata" (SQLSTATE 42703)
failed to close prepared statement: ERROR: current transaction is aborted
```

## Root Cause
The trigger was trying to access `NEW.raw_user_meta_data` but **Supabase auth.users table uses `user_metadata`** (not `raw_user_meta_data`).

This causes the transaction to be aborted, preventing any new user profiles from being created.

## ⚡ IMMEDIATE FIX (2 minutes)

### Step 1: Apply Hotfix Script
1. Open Supabase Dashboard
2. Go to **SQL Editor** → Create new query
3. Copy entire contents of: `scripts/004_hotfix_trigger.sql`
4. Click **Run**
5. Wait for confirmation message

### Step 2: Test Immediately
```bash
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@1234",
    "fullName": "Test User",
    "role": "student"
  }'
```

Or just go to http://localhost:3000/auth/signup and try signing up.

## Verification
Run this in Supabase SQL Editor to confirm the fix:
```sql
-- Check if trigger function is using correct column
SELECT prosrc FROM pg_proc WHERE proname = 'handle_new_user';

-- Should show: NEW.user_metadata ->> 'role'
-- NOT: NEW.raw_user_meta_data ->> 'role'
```

## What Was Wrong

❌ **Before (Broken)**
```sql
COALESCE(NEW.raw_user_meta_data ->> 'role', 'student')
```

✅ **After (Fixed)**
```sql
COALESCE(NEW.user_metadata ->> 'role', 'student')
```

## Files Updated

| File | Change |
|------|--------|
| `scripts/002_create_profiles_trigger.sql` | Fixed column name |
| `scripts/003_fix_profiles_trigger.sql` | Fixed column name |
| `scripts/004_hotfix_trigger.sql` | ✨ NEW - Apply this now |

## Why This Happened

Supabase changed the column name from `raw_user_meta_data` (old Supabase versions) to `user_metadata` (current versions). The trigger was written for the old column name.

## Prevention

Always check the actual Supabase auth.users table schema:
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'auth' AND table_name = 'users';
```

Look for metadata columns and use the correct one.

---

**Status**: APPLY IMMEDIATELY ⚡  
**Time**: ~2 minutes  
**Risk**: Low - just fixing a typo in the trigger
