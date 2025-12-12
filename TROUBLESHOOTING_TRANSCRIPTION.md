# Troubleshooting Voice Transcription Error

## Issue: "API key not valid" error

### Root Cause
The browser has **cached the old code** that called Gemini API directly. Even though we've updated the code to use the Edge Function, your browser is still running the old version.

### Solution Steps

#### Step 1: Clear Browser Cache
1. Open DevTools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"
   
   **OR**
   
   - Press `Ctrl + Shift + R` (Windows)
   - Press `Cmd + Shift + R` (Mac)

#### Step 2: Restart Dev Server
```powershell
# Stop the server (Ctrl + C)
# Then restart:
npm run dev
```

#### Step 3: Verify Edge Function is Working
1. Open DevTools → Network tab
2. Try recording voice again
3. Look for a request to: `/functions/v1/gemini-proxy`
4. If you see `generativelanguage.googleapis.com`, the cache wasn't cleared

#### Step 4: Check Edge Function Logs
Go to Supabase Dashboard:
- https://supabase.com/dashboard/project/ufxyzzjhmkyzuljmohqd/functions
- Click on `gemini-proxy`
- Check the "Logs" tab for any errors

### Verification Checklist

✅ **Code is correct:**
- `services/aiService.ts` calls Edge Function (not Gemini directly)
- Edge Function is deployed
- API key secret is set

✅ **Browser cache cleared:**
- Hard refresh done
- DevTools shows requests to `/functions/v1/gemini-proxy`

✅ **Edge Function working:**
- No errors in Supabase logs
- API key secret accessible

### If Still Not Working

1. **Check Supabase Dashboard:**
   - Go to: https://supabase.com/dashboard/project/ufxyzzjhmkyzuljmohqd/functions/gemini-proxy
   - Check "Logs" tab for errors
   - Verify function is "Active"

2. **Verify Secret:**
   ```powershell
   npx supabase@latest secrets list
   ```
   Should show `GEMINI_API_KEY` with a digest

3. **Test Edge Function Directly:**
   - Open browser console
   - Try the transcription
   - Check Network tab for the request
   - Look at the response

4. **Check API Key:**
   - Verify the key works: https://aistudio.google.com/api-keys
   - Make sure it's not restricted or expired

### Expected Behavior After Fix

When working correctly:
- Network tab shows: `POST /functions/v1/gemini-proxy`
- Response contains transcription text
- No errors about "API key not valid"
- Audio is transcribed successfully

