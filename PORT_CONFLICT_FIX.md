# Fix: Port Conflicts & Login Stuck

## The Problem

You had two projects trying to use the same port (3001), which caused conflicts. Now on port 3003, login works but gets stuck after clicking "Sign In".

## What I Just Fixed

1. ✅ **Set default port to 3003** in `vite.config.ts`
2. ✅ **Added `strictPort: true`** - Will fail fast if port is in use
3. ✅ **Better login error handling** - Won't hang if profile fetch fails
4. ✅ **Timeout protection** - Profile fetch has 5-second timeout
5. ✅ **Better logging** - Console shows exactly what's happening

## Why Login Gets Stuck

The login succeeds, but then it tries to:
1. Fetch user profile from database
2. If profile doesn't exist or fetch fails → App hangs

**I've fixed this** - now it will:
- Still authenticate even if profile fetch fails
- Show clear errors in console
- Not hang forever

## Next Steps

### 1. Restart Dev Server

```bash
# Stop current server (Ctrl + C)
npm run dev
```

Should now start on port 3003 automatically.

### 2. Try Login Again

1. Enter email/password
2. Click "Sign In"
3. **Watch browser console** (F12) for logs:
   - ✅ "Login successful"
   - ✅ "Profile loaded" OR ⚠️ "Profile not found"
   - ✅ "Authentication complete"

### 3. If Still Stuck

**Check console for:**
- ❌ "Profile fetch timeout" → Database issue
- ❌ "Not authenticated" → Auth issue
- ❌ Network errors → Supabase connection issue

## Port Management

**To avoid conflicts:**
- Each project should use different ports
- Vite will auto-increment if port is taken
- Or set `strictPort: true` to fail fast

**Current setup:**
- NurseVault: Port 3003 (fixed in vite.config.ts)
- Other projects: Use different ports

---

**Try logging in again and check the console!** The new logging will show exactly what's happening. 🔍

