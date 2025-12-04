# Quick Fix for Stuck Upload

## Most Likely Issue: Storage Not Set Up

The upload is probably failing because the storage bucket or policies aren't configured.

## Quick Fix (2 minutes)

### Step 1: Verify Storage Bucket

1. Go to: https://app.supabase.com → Your Project → **Storage**
2. Do you see **`vault-files`** bucket?
   - ✅ **YES** → Go to Step 2
   - ❌ **NO** → Run `supabase/storage-setup.sql` in SQL Editor

### Step 2: Re-run Storage Setup

1. Go to **SQL Editor** in Supabase
2. Click **"New query"**
3. Copy ALL contents from `supabase/storage-setup.sql`
4. Paste and click **"Run"**
5. Should see "Success" message

### Step 3: Test Upload Again

1. Refresh your app (F5)
2. Try uploading again
3. **Watch browser console** (F12) for detailed logs

## What to Look For in Console

**Good signs:**
```
🚀 Starting upload process...
📤 Starting document upload...
✅ User authenticated: [id]
📁 Uploading to storage path: [path]
✅ File uploaded successfully
💾 Saving document metadata...
✅ Document saved successfully
```

**Bad signs:**
```
❌ Error: Bucket not found
❌ Error: Permission denied
❌ Error: Not authenticated
```

## If Still Stuck

**Check these:**

1. **Are you logged in?**
   - Try logging out and back in

2. **Is Supabase project active?**
   - Free tier projects pause after inactivity
   - Check Supabase dashboard

3. **Check Network tab:**
   - Open DevTools → Network tab
   - Try upload
   - Look for failed requests (red)
   - Click on failed request to see error

4. **Storage quota:**
   - Free tier has 1GB limit
   - Check in Supabase Dashboard → Storage

---

**After re-running storage-setup.sql, try again and check the console!** 🔍

