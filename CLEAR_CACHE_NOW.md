# Quick Fix: Clear Browser Cache for Career Chat

## The Issue
The browser is showing old cached JavaScript code instead of the new Career Chat component.

## Quick Fix (Do This Now)

### Step 1: Hard Refresh Browser
1. Open the Career Pathway page
2. Press **`Ctrl + Shift + R`** (Windows) or **`Cmd + Shift + R`** (Mac)
3. This forces a hard refresh

### Step 2: Clear Browser Cache (If Step 1 Doesn't Work)
1. Open Chrome DevTools (F12)
2. Right-click the refresh button
3. Select **"Empty Cache and Hard Reload"**

### Step 3: Clear Service Worker Cache
1. Open Chrome DevTools (F12)
2. Go to **Application** tab
3. Click **Service Workers** in left sidebar
4. Click **Unregister** next to the service worker
5. Go to **Cache Storage** in left sidebar
6. Right-click each cache → **Delete**
7. Refresh the page

### Step 4: Restart Dev Server
1. Stop the current dev server (Ctrl + C)
2. Run: `npm run dev`
3. Wait for it to start
4. Hard refresh the browser (Ctrl + Shift + R)

## What Should Appear
After clearing cache, you should see:
- "AI Career Assistant" section with a "Start Chat" button
- When you click "Start Chat", the chat interface should appear
- Chat should have input field, upload button, and message history

## If Still Not Working
1. Check browser console (F12) for errors
2. Verify `.env.local` has `GEMINI_API_KEY` set
3. Make sure you're on `http://localhost:3003/#/career`
4. Try incognito/private window to bypass all cache

