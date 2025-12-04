# Document Upload Troubleshooting

## How Document Upload Works

**User specifies document details** (not AI):
- User selects file
- Modal opens asking for:
  - **Title** (required) - User enters what the document is
  - **Category** (required) - User selects from dropdown (Passport, DBS, NMC, etc.)
  - **Expiry Date** (optional) - User enters if document expires

**Upload Process:**
1. File uploads to Supabase Storage (`vault-files` bucket)
2. Document metadata saves to database
3. Document appears in list

## Common Issues

### "Uploading..." Stuck Forever

**Check Browser Console:**
- Open DevTools (F12)
- Look for red error messages
- Common errors:

**"Bucket not found"**
- Solution: Run `supabase/storage-setup.sql` in Supabase SQL Editor

**"new row violates row-level security"**
- Solution: Check storage policies are set correctly
- Re-run `supabase/storage-setup.sql`

**"Not authenticated"**
- Solution: Make sure you're logged in
- Check Supabase keys in `.env.local`
- Restart dev server after adding keys

**Network errors**
- Solution: Check internet connection
- Check Supabase project is active
- Verify Supabase URL is correct

### File Not Appearing After Upload

**Check:**
1. Browser console for errors
2. Supabase Dashboard → Storage → `vault-files` bucket
3. Supabase Dashboard → Table Editor → `documents` table

**If file is in storage but not showing:**
- Refresh the page
- Check RLS policies on `documents` table
- Verify user is authenticated

### Upload Fails Immediately

**Possible causes:**
1. **File too large** - Max 50MB
2. **Wrong file type** - Only PDF, JPG, PNG allowed
3. **Storage bucket doesn't exist** - Run storage-setup.sql
4. **Not authenticated** - Login first

## Testing Upload

1. **Open Browser Console** (F12)
2. **Click "Upload Document"**
3. **Select a file** (PDF, JPG, or PNG)
4. **Fill in the form:**
   - Title: "Test Document"
   - Category: Select one
   - Expiry: Optional
5. **Click "Upload"**
6. **Watch console** for any errors

## Expected Behavior

✅ **Success:**
- Modal closes
- Document appears in list immediately
- No errors in console

❌ **Failure:**
- Error message appears
- Modal stays open
- Error details in console

## Future: AI Categorization (Optional)

We could add AI to:
- Auto-suggest category based on filename
- Extract text from PDF to suggest title
- Detect expiry dates in documents

**But for now, user specifies everything manually** - this is more reliable and gives users control.

---

**If upload is still stuck, check the browser console and share the error message!** 🔍

