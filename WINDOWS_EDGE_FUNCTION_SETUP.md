# Edge Function Setup for Windows

## Quick Setup (Using npx - Easiest Method)

Since global npm installation doesn't work, use `npx` to run Supabase CLI commands:

### Step 1: Login to Supabase

```powershell
npx supabase@latest login
```

This will open your browser to authenticate.

### Step 2: Link Your Project

1. Go to your Supabase dashboard: https://app.supabase.com
2. Select your project
3. Check the URL - it will be: `https://app.supabase.com/project/xxxxx`
4. Copy the project ref (the `xxxxx` part)

Then run:
```powershell
npx supabase@latest link --project-ref your-project-ref-here
```

### Step 3: Set Your Gemini API Key as a Secret

```powershell
npx supabase@latest secrets set GEMINI_API_KEY=your-actual-gemini-api-key
```

**Important:** Replace `your-actual-gemini-api-key` with your real key from https://makersuite.google.com/app/apikey

### Step 4: Deploy the Edge Function

```powershell
npx supabase@latest functions deploy gemini-proxy
```

You should see:
```
Deploying function gemini-proxy...
Function gemini-proxy deployed successfully
```

### Step 5: Verify It Works

1. Restart your dev server: `npm run dev`
2. Log in to the app
3. Try using an AI feature (e.g., upload a job description)
4. Check the browser console - you should see successful API calls

---

## Alternative: Install Supabase CLI Properly (Optional)

If you want to install the CLI permanently instead of using `npx`:

### Using Scoop (Recommended for Windows)

```powershell
# Install Scoop if you don't have it
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
irm get.scoop.sh | iex

# Add Supabase bucket
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git

# Install Supabase CLI
scoop install supabase
```

Then you can use `supabase` commands directly:
```powershell
supabase login
supabase link --project-ref your-project-ref
supabase secrets set GEMINI_API_KEY=your-key
supabase functions deploy gemini-proxy
```

### Using Chocolatey (Alternative)

```powershell
choco install supabase
```

---

## Troubleshooting

### "npx supabase@latest" is slow
- This is normal - npx downloads the CLI each time
- Consider installing via Scoop for faster commands

### "Project not found" error
- Double-check your project ref from the Supabase dashboard URL
- Ensure you're logged in: `npx supabase@latest login`

### "Secret not found" error
- Verify the secret was set: `npx supabase@latest secrets list`
- Check spelling: `GEMINI_API_KEY` (all caps, with underscores)

### Function deployment fails
- Ensure you're in the project root directory
- Check that `supabase/functions/gemini-proxy/index.ts` exists
- Verify you're linked: `npx supabase@latest projects list`

---

## Quick Reference

```powershell
# Login
npx supabase@latest login

# Link project
npx supabase@latest link --project-ref YOUR_PROJECT_REF

# Set secret
npx supabase@latest secrets set GEMINI_API_KEY=YOUR_KEY

# Deploy function
npx supabase@latest functions deploy gemini-proxy

# Check status
npx supabase@latest functions list

# View logs
npx supabase@latest functions logs gemini-proxy
```

