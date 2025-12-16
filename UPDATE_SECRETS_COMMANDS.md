# Commands to Update Edge Function Secrets

## Step 1: Get Your Keys from .env

Open your `.env` file and copy these values:
- Line 1: `VITE_SUPABASE_URL=...` (copy the URL part)
- Line 2: `VITE_SUPABASE_ANON_KEY=...` (copy the key part)
- Line 3: `GEMINI_API_KEY=...` (copy the key part)

## Step 2: Update Edge Function Secrets

Run these commands (replace with your actual values):

```powershell
# Update Gemini API Key (most important for AI features)
npx supabase@latest secrets set GEMINI_API_KEY=YOUR_GEMINI_KEY_FROM_ENV

# Update Supabase URL (if needed)
npx supabase@latest secrets set SUPABASE_URL=YOUR_SUPABASE_URL_FROM_ENV

# Update Supabase Anon Key (if needed)
npx supabase@latest secrets set SUPABASE_ANON_KEY=YOUR_ANON_KEY_FROM_ENV
```

## Step 3: Verify They're Set

```powershell
npx supabase@latest secrets list
```

You should see all three secrets listed.

## Step 4: Redeploy Edge Function

```powershell
npx supabase@latest functions deploy gemini-proxy
```

## Example (Replace with Your Actual Values)

```powershell
# Example - replace with YOUR actual values from .env
npx supabase@latest secrets set GEMINI_API_KEY=AIzaSyDVe-7kkRRxj7uwJE9NE4_BbtY6f1DV900
npx supabase@latest secrets set SUPABASE_URL=https://ufxyzzjhmkyzuljmohqd.supabase.co
npx supabase@latest secrets set SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Important Notes

1. **GEMINI_API_KEY** - This is the most critical one for AI features to work
2. **SUPABASE_URL** and **SUPABASE_ANON_KEY** - These are usually auto-provided, but setting them explicitly ensures they match your `.env`
3. After updating, the **digests will change** in the dashboard (this is normal - it means the values were updated)

## After Updating

1. Test AI features in your app
2. Check Edge Function logs if there are errors
3. The digests in the dashboard will be different (confirming the update worked)

