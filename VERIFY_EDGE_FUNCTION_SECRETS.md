# Verifying Edge Function Secrets Match .env

## Current Edge Function Secrets (from Supabase Dashboard)

Based on the screenshot, these secrets are set:
- ✅ `GEMINI_API_KEY` - Updated: 11 Dec 2025 22:00:25
- ✅ `SUPABASE_URL` - Updated: 11 Dec 2025 21:53:13
- ✅ `SUPABASE_ANON_KEY` - Updated: 11 Dec 2025 21:53:13
- ✅ `SUPABASE_SERVICE_ROLE_KEY` - Updated: 11 Dec 2025 21:53:13
- ✅ `SUPABASE_DB_URL` - Updated: 11 Dec 2025 21:53:13

## What You Need to Verify

Your `.env` file should have (lines 1-3):
1. `VITE_SUPABASE_URL=...`
2. `VITE_SUPABASE_ANON_KEY=...`
3. `GEMINI_API_KEY=...`

## How to Verify They Match

Since we can only see **digests** (hashes) in the dashboard, not the actual values, we need to:

1. **Check your `.env` file** - Note the values for:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `GEMINI_API_KEY`

2. **Update Edge Function secrets** to match your `.env`:
   ```powershell
   # Update Gemini API Key (if different)
   npx supabase@latest secrets set GEMINI_API_KEY=your-key-from-env
   
   # Note: SUPABASE_URL and SUPABASE_ANON_KEY are usually auto-set
   # But you can verify/update them if needed:
   npx supabase@latest secrets set SUPABASE_URL=your-url-from-env
   npx supabase@latest secrets set SUPABASE_ANON_KEY=your-anon-key-from-env
   ```

3. **Verify after updating**:
   ```powershell
   npx supabase@latest secrets list
   ```
   The digests will change if the values changed.

## Important Notes

### Edge Function Secrets vs .env

- **`.env` file**: Used by frontend (React app)
  - `VITE_SUPABASE_URL` → Frontend connects to Supabase
  - `VITE_SUPABASE_ANON_KEY` → Frontend authentication
  - `GEMINI_API_KEY` → **NOT USED** (we use Edge Functions now)

- **Edge Function Secrets**: Used by server-side Edge Functions
  - `GEMINI_API_KEY` → **THIS IS WHAT MATTERS** for AI features
  - `SUPABASE_URL` → Edge Function connects to Supabase
  - `SUPABASE_ANON_KEY` → Edge Function authentication

### Which Keys Need to Match?

1. **Gemini API Key**: 
   - Should be the **SAME** Google API key
   - Edge Function secret is what's used (not `.env`)

2. **Supabase Keys**:
   - Should **MATCH** (same project = same values)
   - Edge Function gets these automatically, but you can set them explicitly

## Quick Update Command

If your `.env` has the correct keys, update the Edge Function secrets:

```powershell
# Replace with your actual values from .env
npx supabase@latest secrets set GEMINI_API_KEY=AIzaSyDVe-7kkRRxj7uwJE9NE4_BbtY6f1DV900
```

Then verify:
```powershell
npx supabase@latest secrets list
```

## After Updating

1. **Redeploy Edge Function** (if needed):
   ```powershell
   npx supabase@latest functions deploy gemini-proxy
   ```

2. **Test AI features** in your app to verify they work

3. **Check Edge Function logs** if there are still errors:
   - Go to: https://supabase.com/dashboard/project/ufxyzzjhmkyzuljmohqd/functions/gemini-proxy/logs

