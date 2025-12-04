# Quick Check: Is Storage Set Up?

## Verify Storage Bucket Exists

1. Go to Supabase Dashboard: https://app.supabase.com
2. Select your project
3. Click **"Storage"** in left sidebar
4. Check if you see **`vault-files`** bucket
   - ✅ **If YES** - Bucket exists, check policies
   - ❌ **If NO** - Run `supabase/storage-setup.sql` again

## Verify Storage Policies

1. In Storage, click on **`vault-files`** bucket
2. Click **"Policies"** tab
3. You should see 4 policies:
   - ✅ "Users can upload own files"
   - ✅ "Users can view own files"
   - ✅ "Users can delete own files"
   - ✅ "Users can update own files"

**If policies are missing, run `storage-setup.sql` again!**

## Quick Fix

If bucket doesn't exist or policies are missing:

1. Go to **SQL Editor** in Supabase
2. Run `supabase/storage-setup.sql` again
3. Refresh Storage page
4. Try upload again

---

**After checking, try the upload again and watch the browser console!**

