# Secure AI Setup: Edge Function Deployment Guide

## Why This Matters

Previously, the Gemini API key was exposed in the frontend code (visible in browser DevTools). This is a **security risk** because:
- Anyone can view and steal your API key
- Unauthorized usage can rack up costs
- API keys should never be in client-side code

## Solution: Supabase Edge Function

We've created a secure server-side proxy that:
- ✅ Keeps the API key hidden on the server
- ✅ Requires user authentication
- ✅ Prevents API key theft
- ✅ Follows security best practices

## Quick Setup (5 minutes)

### Step 1: Install Supabase CLI (Windows)

**Option A: Using Scoop (Recommended for Windows)**
```powershell
# Install Scoop if you don't have it
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
irm get.scoop.sh | iex

# Install Supabase CLI
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

**Option B: Using npx (No installation needed)**
```powershell
# Use npx to run commands without installing
npx supabase@latest login
npx supabase@latest link --project-ref your-project-ref
npx supabase@latest secrets set GEMINI_API_KEY=your-key
npx supabase@latest functions deploy gemini-proxy
```

**Option C: Download Standalone Binary**
1. Go to https://github.com/supabase/cli/releases
2. Download `supabase_windows_amd64.zip`
3. Extract and add to PATH, or use full path to executable

### Step 2: Login to Supabase

**Use npx (recommended for Windows):**
```powershell
npx supabase@latest login
```

**Or if you installed via Scoop:**
```powershell
supabase login
```

This will open your browser to authenticate.

### Step 3: Link Your Project

1. Go to your Supabase dashboard: https://app.supabase.com
2. Select your project
3. Check the URL - it will be: `https://app.supabase.com/project/xxxxx`
4. Copy the project ref (the `xxxxx` part)

Then run:
```powershell
npx supabase@latest link --project-ref your-project-ref-here
```

### Step 4: Set Your Gemini API Key as a Secret

```powershell
npx supabase@latest secrets set GEMINI_API_KEY=your-actual-gemini-api-key
```

**Important:** Replace `your-actual-gemini-api-key` with your real key from https://makersuite.google.com/app/apikey

### Step 5: Deploy the Edge Function

```powershell
npx supabase@latest functions deploy gemini-proxy
```

You should see:
```
Deploying function gemini-proxy...
Function gemini-proxy deployed successfully
```

### Step 6: Verify It Works

1. Restart your dev server: `npm run dev`
2. Log in to the app
3. Try using an AI feature (e.g., upload a job description)
4. Check the browser console - you should see successful API calls

## What Changed in the Code

### Before (Insecure):
```typescript
// API key visible in frontend bundle ❌
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
fetch(`https://gemini-api.com?key=${apiKey}`)
```

### After (Secure):
```typescript
// API key hidden on server ✅
fetch(`${supabaseUrl}/functions/v1/gemini-proxy`, {
  headers: { Authorization: `Bearer ${session.access_token}` }
})
```

## Verification Checklist

- [ ] Supabase CLI installed
- [ ] Logged in to Supabase
- [ ] Project linked
- [ ] `GEMINI_API_KEY` secret set
- [ ] Edge Function deployed
- [ ] App restarted
- [ ] AI features work without errors
- [ ] No API key visible in browser DevTools

## Troubleshooting

### "Function not found" error
- Ensure you deployed: `npx supabase@latest functions deploy gemini-proxy`
- Check the function name is exactly `gemini-proxy`

### "Unauthorized" error
- Make sure you're logged in to the app
- Check your session is valid

### "AI service not configured" error
- Verify the secret is set: `npx supabase@latest secrets list`
- Ensure the key is valid

### Still seeing API key in DevTools?
- Good! The key should NOT be visible anymore
- If you see it, clear cache and hard refresh (Ctrl+Shift+R)

## Production Deployment

When deploying to Vercel:
1. **Do NOT** set `VITE_GEMINI_API_KEY` in Vercel environment variables
2. The Edge Function handles the API key server-side
3. Only set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Vercel

## Security Benefits

✅ **API key protection** - Never exposed to clients
✅ **Authentication required** - Only logged-in users can use AI
✅ **Rate limiting ready** - Can add limits in Edge Function
✅ **Cost control** - Monitor usage in Supabase dashboard
✅ **GDPR compliant** - Server-side processing

## Next Steps

After deployment:
1. Test all AI features (voice notes, JD analysis, career chat)
2. Monitor Edge Function logs in Supabase dashboard
3. Set up usage alerts if needed
4. Consider adding rate limiting per user

---

**Need help?** Check the Edge Function logs in Supabase dashboard → Edge Functions → gemini-proxy → Logs

