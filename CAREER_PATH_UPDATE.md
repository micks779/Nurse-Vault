# Career Pathway Update - Database Migration

## New Features Added

1. ✅ **Editable Career Path** - Users can now edit their current band, target band, and specialty
2. ✅ **Salary Fields** - Optional salary tracking for current and target bands
3. ✅ **Edit Modal** - Full form to update career path information
4. ✅ **Dynamic Salary Calculation** - Shows potential salary increase

## Database Changes Required

### Step 1: Add Salary Columns to Database

Run this SQL in Supabase SQL Editor:

```sql
-- Add salary columns to career_paths table
ALTER TABLE career_paths 
ADD COLUMN IF NOT EXISTS current_salary NUMERIC(10,2),
ADD COLUMN IF NOT EXISTS target_salary NUMERIC(10,2);
```

### Step 2: Verify Changes

After running the SQL, check that the columns exist:
- Go to Supabase Dashboard → Table Editor → `career_paths`
- You should see `current_salary` and `target_salary` columns

## What's New in the UI

1. **"Edit Path" Button** - Top right of the career pathway card
2. **Edit Modal** with fields:
   - Current Band (dropdown: Band 2-9)
   - Target Band (dropdown: Band 2-9)
   - Specialty (text input)
   - Current Salary (optional number)
   - Target Salary (optional number)
3. **Dynamic Display**:
   - Band numbers extracted and shown (e.g., "Band 5" → "B5")
   - Salaries shown under band indicators
   - Salary difference calculated automatically

## How It Works

1. User clicks "Edit Path" button
2. Modal opens with current values pre-filled
3. User updates fields
4. Clicks "Save Changes"
5. Data saved to Supabase
6. Page refreshes with new values

## Next Steps

After running the SQL migration:
1. Refresh the app
2. Go to Career Pathway page
3. Click "Edit Path"
4. Update your information
5. Save!

---

**Important:** Run the SQL migration before using the new features!

