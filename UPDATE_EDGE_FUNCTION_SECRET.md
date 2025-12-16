# How Edge Function Secrets Work

## The Difference

### `.env` File (Frontend/Local Dev)
- Used by your **frontend code** running in the browser
- Located in your project root: `.env` or `.env.local`
- Contains: `GEMINI_API_KEY=AIzaSyDVe-7kkRRxj7uwJE9NE4_BbtY6f1DV900`
- **NOT used by Edge Functions** (for security - we don't want API keys in frontend)

### Edge Function Secrets (Server-Side)
- Used by **Supabase Edge Functions** (server-side code)
- Stored securely in Supabase's infrastructure
- Set using Supabase CLI: `npx supabase@latest secrets set GEMINI_API_KEY=value`
- **Separate from `.env` file** - they're completely independent

## Why They're Different

1. **Security**: Edge Functions run on Supabase's servers, not in your browser
2. **Isolation**: Frontend `.env` is for client-side, Edge Function secrets are for server-side
3. **Best Practice**: API keys should NEVER be in frontend code (even in `.env`)

## Where Edge Function Secrets Come From

Edge Function secrets are set using the Supabase CLI:

```powershell
npx supabase@latest secrets set GEMINI_API_KEY=your-actual-key-here
```

This command:
- Stores the secret in Supabase's secure vault
- Makes it available to Edge Functions via `Deno.env.get("GEMINI_API_KEY")`
- Is completely separate from your local `.env` file

## How to Update the Edge Function Secret

If your `.env` file has a different (or newer) API key than what's in the Edge Function:

1. **Get your API key from `.env`:**
   - Open `.env` or `.env.local`
   - Copy the value of `GEMINI_API_KEY`

2. **Update the Edge Function secret:**
   ```powershell
   npx supabase@latest secrets set GEMINI_API_KEY=AIzaSyDVe-7kkRRxj7uwJE9NE4_BbtY6f1DV900
   ```
   (Replace with your actual key from `.env`)

3. **Verify it's set:**
   ```powershell
   npx supabase@latest secrets list
   ```
   You should see `GEMINI_API_KEY` in the list

4. **Redeploy the Edge Function (if needed):**
   ```powershell
   npx supabase@latest functions deploy gemini-proxy
   ```

## Current Situation

Based on your setup:
- ✅ Your `.env` has: `GEMINI_API_KEY=AIzaSyDVe-7kkRRxj7uwJE9NE4_BbtY6f1DV900`
- ❓ Edge Function secret might be different or outdated
- ❌ Edge Function is getting a 404 error (model not found)

## Additional Issue Found

Looking at the error logs, there's also a **model name issue**:
- Error: `"models/gemini-1.5-flash is not found"`
- The Edge Function code uses `gemini-2.5-flash` and `gemini-1.5-flash`
- These model names might be incorrect or deprecated

**Possible fixes:**
1. Update model names to valid Gemini models (e.g., `gemini-1.5-flash-latest` or `gemini-pro`)
2. Check Google's Gemini API documentation for correct model names

## Summary

**Edge Function secrets are NOT from `.env`** - they're set separately using:
```powershell
npx supabase@latest secrets set GEMINI_API_KEY=your-key
```

To sync them, copy your `.env` key and set it as an Edge Function secret using the command above.

