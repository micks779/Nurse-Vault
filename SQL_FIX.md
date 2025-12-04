# SQL Syntax Error Fix

## Problem
The error `syntax error at or near "current_role"` occurs because `current_role` is a **reserved keyword** in PostgreSQL.

## Solution
I've updated the schema to quote reserved keywords with double quotes:
- `current_role` → `"current_role"`
- `current_band` → `"current_band"`
- `target_band` → `"target_band"`

## What Changed

### In `profiles` table:
```sql
"current_role" TEXT NOT NULL,
"current_band" TEXT NOT NULL,
```

### In `career_paths` table:
```sql
"current_band" TEXT NOT NULL,
"target_band" TEXT NOT NULL,
```

### In trigger function:
```sql
INSERT INTO public.profiles (id, name, "current_role", "current_band")
```

## Try Again

1. **Clear the SQL Editor** (or start a new query)
2. **Copy the ENTIRE updated `supabase/schema.sql` file**
3. **Paste into SQL Editor**
4. **Click "Run"**

The schema should now run without errors! ✅

