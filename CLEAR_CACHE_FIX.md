# Fix for Career Pathway White Screen (Cache Issue)

## Problem
The browser is running cached/old JavaScript code, causing:
- `ReferenceError: showChat is not defined`
- `ReferenceError: setCompetencies is not defined`
- Service worker trying to cache chrome-extension URLs

## Solution Applied

### 1. Service Worker Fixes
- ✅ Updated cache version to `v3` (forces cache refresh)
- ✅ Added filtering for chrome-extension URLs (prevents caching errors)
- ✅ Added error handling for cache operations

### 2. Clear Browser Cache

**Option A: Hard Refresh (Quick Fix)**
1. Open the Career Pathway page
2. Press `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
3. This forces a hard refresh and clears cached resources

**Option B: Clear Site Data (Complete Fix)**
1. Open Chrome DevTools (F12)
2. Go to **Application** tab
3. Click **Clear storage** in the left sidebar
4. Check:
   - ✅ Cache storage
   - ✅ Service Workers
   - ✅ Local Storage (optional)
5. Click **Clear site data**
6. Refresh the page

**Option C: Unregister Service Worker**
1. Open Chrome DevTools (F12)
2. Go to **Application** tab
3. Click **Service Workers** in the left sidebar
4. Click **Unregister** next to the service worker
5. Refresh the page

**Option D: Clear All Browser Cache**
1. Press `Ctrl + Shift + Delete` (Windows) or `Cmd + Shift + Delete` (Mac)
2. Select **Cached images and files**
3. Choose time range: **All time**
4. Click **Clear data**
5. Refresh the page

## After Clearing Cache

1. The new service worker (v3) will register
2. Fresh JavaScript will load (no more `showChat` errors)
3. Chrome extension URLs won't be cached (no more TypeError)

## Verify It's Fixed

1. Open Career Pathway page
2. Check browser console (F12)
3. Should see: `SW registered: ServiceWorkerRegistration`
4. No more `ReferenceError` or `TypeError` messages
5. Page should load correctly

---

**If issues persist after clearing cache:**
- Restart the dev server: `npm run dev`
- Check that you're running the latest code
- Verify the build completed successfully

