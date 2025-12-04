# Debugging Upload Issues

## Current Issue: Upload Stuck on "Uploading..."

The upload button shows "Uploading..." but never completes.

## Debugging Steps

### 1. Check Browser Console

Open DevTools (F12) and look for:
- ✅ Green checkmarks (success logs)
- ❌ Red X marks (error logs)
- 📤 Upload progress logs

### 2. Common Issues & Solutions

#### Issue: "Bucket not found"
**Error:** `Bucket vault-files not found`
**Solution:**
1. Go to Supabase Dashboard → Storage
2. Check if `vault-files` bucket exists
3. If not, run `supabase/storage-setup.sql` again

#### Issue: "Permission denied" / "RLS violation"
**Error:** `new row violates row-level security`
**Solution:**
1. Go to Supabase Dashboard → Storage → Policies
2. Check `vault-files` bucket has policies
3. Re-run `supabase/storage-setup.sql`

#### Issue: "Not authenticated"
**Error:** `Not authenticated` or `JWT expired`
**Solution:**
1. Log out and log back in
2. Check `.env.local` has correct Supabase keys
3. Restart dev server

#### Issue: Upload hangs forever
**Possible causes:**
- Network timeout
- File too large (>50MB)
- Supabase project paused (free tier)
- Storage quota exceeded

**Solution:**
- Check Supabase project status
- Try smaller file
- Check network tab in DevTools

### 3. Test Storage Manually

1. Go to Supabase Dashboard → Storage
2. Click `vault-files` bucket
3. Try uploading a file manually
4. If that fails, storage isn't set up correctly

### 4. Check Database

1. Go to Supabase Dashboard → Table Editor
2. Check `documents` table
3. See if any rows were created (even if upload "failed")
4. Check RLS policies are enabled

### 5. Verify Environment Variables

Make sure `.env.local` has:
```env
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

**Restart dev server after changing .env.local!**

---

## What the Console Should Show

**Successful upload:**
```
🚀 Starting upload process...
📤 Starting document upload...
✅ User authenticated: [user-id]
📁 Uploading to storage path: [path]
✅ File uploaded successfully
💾 Saving document metadata...
✅ Document saved successfully
✅ Upload complete!
✅ Documents list refreshed
🏁 Upload process finished
```

**Failed upload:**
```
❌ [Error type]: [Error message]
```

---

**Check your browser console now and share what you see!** 🔍

