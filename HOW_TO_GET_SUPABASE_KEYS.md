# How to Get Your Supabase Keys

## Step-by-Step Guide

### Step 1: Go to Supabase Dashboard

1. Visit: **https://app.supabase.com**
2. Sign in (or create a free account)

### Step 2: Create or Select a Project

**If you don't have a project yet:**
1. Click **"New Project"** button
2. Fill in:
   - **Name**: `nursevault` (or any name)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to you
   - **Pricing Plan**: Free tier is fine
3. Click **"Create new project"**
4. Wait 2-3 minutes for setup to complete

**If you already have a project:**
- Click on your project name from the dashboard

### Step 3: Get Your Keys

1. In your project dashboard, click **"Settings"** (gear icon in left sidebar)
2. Click **"API"** in the settings menu
3. You'll see two important values:

#### 🔑 Project URL
- Look for **"Project URL"** or **"URL"**
- It looks like: `https://xxxxxxxxxxxxx.supabase.co`
- Copy this → This is your `VITE_SUPABASE_URL`

#### 🔑 Anon/Public Key
- Look for **"anon public"** or **"Project API keys"**
- Find the key labeled **"anon"** or **"public"**
- It's a long string starting with `eyJ...`
- Copy this → This is your `VITE_SUPABASE_ANON_KEY`

### Step 4: Add to `.env.local`

Create or edit `.env.local` in your project root:

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Replace with your actual values!**

## Visual Guide

```
Supabase Dashboard
├── Settings (⚙️ icon)
    └── API
        ├── Project URL: https://xxxxx.supabase.co  ← Copy this
        └── Project API keys
            └── anon public: eyJ...  ← Copy this
```

## Quick Access Link

Once you're in your project:
**Direct link**: `https://app.supabase.com/project/_/settings/api`

(Replace `_` with your project ID if you know it)

## Security Note

✅ **Safe to use:**
- `anon` key - This is the public key, safe for frontend use
- It's protected by Row Level Security (RLS) policies

❌ **Never use:**
- `service_role` key - This is secret, only for backend
- Database password - Keep this private

## Troubleshooting

**Can't find Settings?**
- Make sure you're logged in
- Make sure you've selected a project
- Settings is in the left sidebar (gear icon)

**Project still setting up?**
- Wait a few more minutes
- Check the project status in dashboard
- Keys won't be available until setup completes

**Keys not showing?**
- Make sure you're in the correct project
- Try refreshing the page
- Check you have access to the project

---

**Once you have both keys, add them to `.env.local` and restart your dev server!** 🚀

