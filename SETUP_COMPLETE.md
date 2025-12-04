# Complete Setup Guide for Full Functionality

## ✅ What You've Done

1. ✅ App works locally with mock data
2. ✅ Environment variables configured
3. ✅ Supabase client created
4. ✅ AI service updated

## 🔑 Step 1: Create `.env.local` File

Create a file named `.env.local` in your project root with:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
GEMINI_API_KEY=your-gemini-api-key-here
```

**Get your keys:**
- **Supabase**: https://app.supabase.com → Settings → API
- **Gemini**: https://makersuite.google.com/app/apikey

## 🗄️ Step 2: Set Up Supabase Database

### 2.1 Create Supabase Project
1. Go to https://app.supabase.com
2. Click "New Project"
3. Fill in details and wait for setup (~2 minutes)

### 2.2 Run Database Schema

1. Go to **SQL Editor** in Supabase dashboard
2. Create a new query
3. Copy and paste the schema (we'll create this file)
4. Click "Run"

### 2.3 Set Up Storage

1. Go to **Storage** in Supabase dashboard
2. Create bucket named `vault-files`
3. Make it **private**
4. Set up storage policies (we'll provide SQL)

## 🤖 Step 3: Set Up AI Features (Optional)

### Option A: Use Direct API (Development Only)
- Already configured! Just add `GEMINI_API_KEY` to `.env.local`
- ⚠️ **Warning**: API key will be visible in browser (OK for dev, not production)

### Option B: Use Edge Function (Production)
1. Deploy Supabase Edge Function
2. Store API key in Supabase secrets
3. Update `aiService.ts` to call edge function

## 📋 What's Needed for Full Functionality

### Minimum (Current State)
- ✅ `.env.local` with Supabase keys → Enables real database
- ✅ Supabase database schema → Enables data persistence
- ✅ Storage bucket setup → Enables file uploads

### Full Features
- ✅ All of the above
- ✅ Gemini API key → Enables AI features
- ✅ Edge Function (optional) → Secures API key in production

## 🚀 Quick Setup Checklist

- [ ] Create `.env.local` file
- [ ] Add `VITE_SUPABASE_URL`
- [ ] Add `VITE_SUPABASE_ANON_KEY`
- [ ] Add `GEMINI_API_KEY` (optional for AI)
- [ ] Create Supabase project
- [ ] Run database schema SQL
- [ ] Set up storage bucket
- [ ] Restart dev server: `npm run dev`

## 📝 Next Steps

1. **Create `.env.local`** (see ENV_SETUP.md)
2. **Set up Supabase** (we'll create the SQL files)
3. **Test locally** with real database
4. **Deploy to Vercel** when ready

---

**Once you add the keys, we can set up the database schema!** 🎯

