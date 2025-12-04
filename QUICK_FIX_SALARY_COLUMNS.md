# Quick Fix: Missing Salary Columns Error

## The Error

```
Could not find the 'current_salary' column of 'career_paths' in the schema cache
```

## The Problem

The database doesn't have the `current_salary` and `target_salary` columns yet. The code is trying to use them, but they don't exist.

## The Solution

Run this SQL migration in Supabase:

### Step 1: Go to Supabase SQL Editor

1. Open Supabase Dashboard
2. Go to **SQL Editor**
3. Click **"New query"**

### Step 2: Run This SQL

Copy and paste this SQL:

```sql
-- Add salary columns to career_paths table
ALTER TABLE career_paths 
ADD COLUMN IF NOT EXISTS current_salary NUMERIC(10,2),
ADD COLUMN IF NOT EXISTS target_salary NUMERIC(10,2);
```

### Step 3: Click "Run"

Click the **"Run"** button (or press Ctrl+Enter)

### Step 4: Verify

You should see:
- ✅ "Success. No rows returned"
- Or check Table Editor → `career_paths` → should see new columns

### Step 5: Refresh App

1. Go back to your app
2. Refresh the page (F5)
3. Try editing the career path again

---

## Alternative: Run the Migration File

I've created `supabase/add-salary-columns.sql` - you can also:
1. Open that file
2. Copy the SQL
3. Paste into Supabase SQL Editor
4. Run it

---

**After running the SQL, the error will be fixed!** ✅

