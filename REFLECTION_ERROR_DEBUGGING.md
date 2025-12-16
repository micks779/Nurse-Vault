# Reflection Generation Error - Debugging Guide

## 🔍 Possible Causes

The error "Error generating reflection. Please try again." can occur for several reasons:

### 1. **Rate Limiting** (Most Likely)
- User has exceeded 10 calls/day limit
- Edge Function returns 429 status
- **Check:** Browser console for rate limit errors

### 2. **Edge Function Not Deployed**
- Edge Function code updated but not deployed
- **Fix:** Run `npx supabase@latest functions deploy gemini-proxy`

### 3. **API Key Issues**
- Gemini API key invalid or expired
- Edge Function can't access the secret
- **Check:** Supabase Edge Function logs

### 4. **Response Format Mismatch**
- Edge Function returns unexpected format
- Response parsing fails
- **Check:** Browser console for response structure

### 5. **Missing Answers or Code Themes**
- User didn't fill all 4 questions
- No Code themes selected
- **Fix:** Added validation to prevent this

### 6. **Network/Connection Issues**
- Request times out
- Supabase connection fails
- **Check:** Browser Network tab

---

## 🐛 How to Debug

### Step 1: Check Browser Console
1. Open DevTools (F12)
2. Go to Console tab
3. Look for errors when clicking "Generate Structured Reflection"
4. Common errors:
   - `Edge Function error: ...`
   - `Rate limit exceeded`
   - `401 Unauthorized`
   - `404 Not Found`

### Step 2: Check Network Tab
1. Open DevTools → Network tab
2. Click "Generate Structured Reflection"
3. Look for request to `/functions/v1/gemini-proxy`
4. Check:
   - Status code (200 = success, 429 = rate limit, 500 = server error)
   - Response body (what did it return?)

### Step 3: Check Edge Function Logs
1. Go to: https://supabase.com/dashboard/project/ufxyzzjhmkyzuljmohqd/functions/gemini-proxy/logs
2. Look for errors when you tried to generate reflection
3. Check for:
   - Rate limit errors
   - API key errors
   - Response parsing errors

### Step 4: Verify Setup
1. **Edge Function deployed?**
   ```powershell
   npx supabase@latest functions list
   ```
   Should show `gemini-proxy` as ACTIVE

2. **API key set?**
   ```powershell
   npx supabase@latest secrets list
   ```
   Should show `GEMINI_API_KEY`

3. **Database table exists?**
   - Check if `api_usage` table exists
   - Check if `get_user_api_usage_today` function exists

---

## 🔧 Quick Fixes

### Fix 1: Check Rate Limits
- If you see "429" or "rate limit" errors
- Wait a few minutes for limits to reset
- Or add billing to increase limits

### Fix 2: Redeploy Edge Function
```powershell
npx supabase@latest functions deploy gemini-proxy
```

### Fix 3: Check API Key
- Verify key is correct in Supabase secrets
- Check if key has expired or been revoked

### Fix 4: Clear Browser Cache
- Hard refresh: Ctrl + Shift + R
- Clear cache and reload

---

## 📋 What to Check First

1. **Browser Console** - Most errors show here
2. **Network Tab** - See actual API response
3. **Edge Function Logs** - Server-side errors
4. **Rate Limit Status** - Check if limit reached

---

## 💡 Most Likely Issue

Based on the error message, it's probably:
1. **Rate limiting** - You've hit the 10 calls/day limit
2. **Edge Function error** - Check Supabase logs
3. **Response format** - Edge Function returning unexpected format

**Check the browser console first - it will show the exact error!**

