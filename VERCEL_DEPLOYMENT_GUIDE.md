# Vercel Deployment Guide

## ✅ Pre-Deployment Checklist

### 1. Code Ready ✅
- ✅ All features implemented
- ✅ Security and compliance documentation added
- ✅ Privacy Policy and Terms of Service created
- ✅ Build process works (`npm run build`)

### 2. Database Setup ✅
- ✅ Supabase database schema run (`supabase/schema.sql`)
- ✅ Storage bucket created (`supabase/storage-setup.sql`)
- ✅ Salary columns added (`supabase/add-salary-columns.sql`)
- ✅ RLS policies enabled on all tables

### 3. Environment Variables Needed
You'll need to add these in Vercel:
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anon key
- `GEMINI_API_KEY` - (Optional) For AI features

## 🚀 Deploy to Vercel

### Method 1: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel**
   - Visit: https://vercel.com
   - Sign in with GitHub

2. **Import Your Project**
   - Click "Add New..." → "Project"
   - Select your GitHub repository: `micks779/Nurse-Vault`
   - Click "Import"

3. **Configure Project**
   - **Framework Preset:** Vite (should auto-detect)
   - **Root Directory:** `./` (leave as default)
   - **Build Command:** `npm run build` (auto-filled)
   - **Output Directory:** `dist` (auto-filled)
   - **Install Command:** `npm install` (auto-filled)

4. **Add Environment Variables**
   - Click "Environment Variables"
   - Add each variable:
     ```
     VITE_SUPABASE_URL = https://your-project-id.supabase.co
     VITE_SUPABASE_ANON_KEY = eyJ...
     GEMINI_API_KEY = your-gemini-key (optional)
     ```
   - Select "Production", "Preview", and "Development" for each
   - Click "Save"

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (~2-3 minutes)
   - Your app will be live at: `https://your-project.vercel.app`

### Method 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```
   
   Follow the prompts:
   - Link to existing project? No (first time)
   - Project name: nursevault (or your choice)
   - Directory: ./
   - Override settings? No

4. **Add Environment Variables**
   ```bash
   vercel env add VITE_SUPABASE_URL
   vercel env add VITE_SUPABASE_ANON_KEY
   vercel env add GEMINI_API_KEY
   ```

5. **Deploy to Production**
   ```bash
   vercel --prod
   ```

## 🔧 Post-Deployment Steps

### 1. Update Supabase Settings

**Add Vercel URL to Supabase:**
1. Go to Supabase Dashboard → Settings → API
2. Under "Site URL", add your Vercel URL: `https://your-project.vercel.app`
3. Under "Redirect URLs", add: `https://your-project.vercel.app/*`

### 2. Test Your Deployment

✅ **Test these:**
- [ ] Login/Signup works
- [ ] Documents upload successfully
- [ ] Training records save
- [ ] Career pathway saves
- [ ] All pages load correctly
- [ ] PWA works (try installing)

### 3. Custom Domain (Optional)

1. In Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Follow DNS setup instructions
4. SSL certificate auto-provisions

## 🔒 Security Checklist for Production

- ✅ Environment variables set in Vercel (not in code)
- ✅ Supabase RLS policies enabled
- ✅ Storage bucket is private
- ✅ API keys not exposed in frontend
- ✅ HTTPS enabled (Vercel default)
- ✅ Privacy Policy and Terms accessible
- ✅ Security information available to users

## 📋 Environment Variables Reference

| Variable | Required | Description | Where to Get |
|----------|----------|-------------|--------------|
| `VITE_SUPABASE_URL` | ✅ Yes | Supabase project URL | Supabase Dashboard → Settings → API |
| `VITE_SUPABASE_ANON_KEY` | ✅ Yes | Supabase anon key | Supabase Dashboard → Settings → API |
| `GEMINI_API_KEY` | ⚠️ Optional | Google Gemini API key | https://makersuite.google.com/app/apikey |

## 🐛 Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Verify all dependencies are in `package.json`
- Ensure `npm run build` works locally first

### Environment Variables Not Working
- Make sure variables start with `VITE_` (Vite requirement)
- Redeploy after adding variables
- Check variable names match exactly

### App Works Locally But Not on Vercel
- Check environment variables are set
- Verify Supabase URL allows your Vercel domain
- Check browser console for errors

### Authentication Not Working
- Add Vercel URL to Supabase redirect URLs
- Check Supabase project is active (not paused)
- Verify environment variables are correct

## 🎉 You're Ready!

Your app is production-ready! Just:
1. ✅ Deploy to Vercel
2. ✅ Add environment variables
3. ✅ Update Supabase settings
4. ✅ Test everything

**Your app will be live and secure!** 🚀

