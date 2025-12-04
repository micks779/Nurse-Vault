# Environment Variables Setup Guide

## Required Environment Variables

For full functionality, you need to set up these environment variables:

### 1. Supabase Keys (Required for Database Features)

**Where to get them:**
1. Go to https://app.supabase.com
2. Create a new project (or use existing)
3. Go to **Settings** > **API**
4. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon/public key** → `VITE_SUPABASE_ANON_KEY`

### 2. Gemini API Key (Required for AI Features)

**Where to get it:**
1. Go to https://makersuite.google.com/app/apikey
2. Create a new API key
3. Copy the key → `GEMINI_API_KEY`

---

## Setup Steps

### Step 1: Create `.env.local` File

In your project root, create a file named `.env.local`:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
GEMINI_API_KEY=your-gemini-api-key-here
```

**Important:** 
- `.env.local` is already in `.gitignore` (secrets won't be committed)
- Never commit `.env.local` to Git!

### Step 2: Restart Dev Server

After creating `.env.local`, restart your dev server:

```bash
# Stop the server (Ctrl + C)
# Then restart:
npm run dev
```

### Step 3: Verify

Check the browser console - you should NOT see the Supabase warning anymore.

---

## What Each Variable Does

| Variable | Purpose | Required For |
|----------|---------|--------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Database, Auth, Storage |
| `VITE_SUPABASE_ANON_KEY` | Public Supabase key | Database, Auth, Storage |
| `GEMINI_API_KEY` | Google Gemini API key | Voice notes, AI features |

---

## Current Functionality Without Keys

**Without Supabase keys:**
- ❌ Real authentication (uses mock)
- ❌ Cloud database (uses localStorage)
- ❌ File uploads to cloud (uses localStorage)
- ✅ All UI features work
- ✅ Mock data works perfectly

**Without Gemini key:**
- ❌ Voice note transcription (uses mock)
- ❌ AI reflection coaching (uses mock)
- ❌ AI recommendations (uses mock)
- ✅ All other features work

---

## Next Steps After Adding Keys

Once you add the keys, you'll need to:

1. **Set up Supabase Database:**
   - Run the SQL schema (we'll create this)
   - Set up storage bucket
   - Configure authentication

2. **Deploy Edge Function (for Gemini):**
   - Move Gemini API key to Supabase secrets
   - Deploy edge function
   - Update aiService to use edge function

**But for now, adding the keys to `.env.local` is the first step!**

---

## Troubleshooting

**"Supabase URL and Anon Key must be set" warning:**
- Check `.env.local` file exists in project root
- Verify variable names are exactly: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Restart dev server after creating/editing `.env.local`

**Variables not loading?**
- Make sure variable names start with `VITE_` (required for Vite)
- Check for typos in variable names
- Restart dev server

**Still not working?**
- Check `.env.local` is in the root directory (same level as `package.json`)
- Verify no extra spaces or quotes around values
- Check browser console for specific errors

---

## Security Notes

✅ **DO:**
- Use `.env.local` for local development
- Add `.env.local` to `.gitignore` (already done)
- Use Supabase secrets for production API keys

❌ **DON'T:**
- Commit `.env.local` to Git
- Share your API keys publicly
- Use production keys in development

---

**Ready to set up? Create `.env.local` and add your keys!** 🔑

