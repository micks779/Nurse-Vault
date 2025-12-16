# Edge Function Diagnosis - Possible Issues

## ✅ What's Confirmed Working:
- Edge Function is **deployed** and **ACTIVE** (version 3)
- `GEMINI_API_KEY` secret is **set**
- Code is using `supabase.functions.invoke()` (correct method)
- Function name is correct: `gemini-proxy`

## 🔍 Possible Reasons for 404/Non-2xx Errors:

### 1. **Edge Function Code Errors**
**Check:** Edge Function might be crashing due to code errors
- Go to: https://supabase.com/dashboard/project/ufxyzzjhmkyzuljmohqd/functions/gemini-proxy/logs
- Look for error messages in the logs
- Common issues: syntax errors, missing imports, Deno compatibility

### 2. **API Key Not Accessible in Edge Function**
**Check:** The secret might not be accessible
- Edge Function uses: `Deno.env.get("GEMINI_API_KEY")`
- If this returns `null`, the function will return 500 error
- Verify secret is accessible: Check logs for "GEMINI_API_KEY not found"

### 3. **Authentication Issues**
**Check:** User session might not be valid
- Edge Function verifies: `supabaseClient.auth.getUser()`
- If this fails, returns 401 Unauthorized
- Check if user is actually logged in
- Check if session token is valid

### 4. **CORS Issues**
**Check:** Browser might be blocking the request
- Edge Function has CORS headers, but might need adjustment
- Check Network tab in DevTools for CORS errors
- Look for "Access-Control-Allow-Origin" errors

### 5. **Request Format Issues**
**Check:** The request body format might be wrong
- Edge Function expects: `{ type: 'chat' | 'transcribe' | ..., data: {...} }`
- Check Network tab to see what's actually being sent
- Verify the body structure matches what Edge Function expects

### 6. **Project Paused**
**Check:** Supabase project might be paused
- Go to: https://supabase.com/dashboard/project/ufxyzzjhmkyzuljmohqd
- Check if project status is "Active" or "Paused"
- Paused projects won't respond to Edge Function calls

### 7. **Edge Function Deployment Issue**
**Check:** Function might need redeployment
- Even though it shows "ACTIVE", it might have deployment issues
- Try redeploying: `npx supabase@latest functions deploy gemini-proxy`

### 8. **Environment Variable Issues**
**Check:** Edge Function might not have access to Supabase env vars
- Edge Function uses: `Deno.env.get("SUPABASE_URL")` and `Deno.env.get("SUPABASE_ANON_KEY")`
- These should be auto-provided, but might be missing

### 9. **Rate Limiting**
**Check:** Too many requests might be hitting rate limits
- Supabase has rate limits on Edge Functions
- Check if you're hitting limits in dashboard

### 10. **Browser Cache**
**Check:** Old code might still be cached
- Hard refresh: Ctrl + Shift + R
- Clear browser cache completely
- Check if Network tab shows the correct URL

## 🔧 Diagnostic Steps (In Order):

1. **Check Edge Function Logs:**
   - Go to: https://supabase.com/dashboard/project/ufxyzzjhmkyzuljmohqd/functions/gemini-proxy/logs
   - Look for recent errors when you try to use AI features
   - This will tell you exactly what's failing

2. **Check Network Tab:**
   - Open DevTools → Network tab
   - Try using an AI feature
   - Look for the request to `gemini-proxy`
   - Check:
     - Request URL (should be correct)
     - Request headers (Authorization, apikey)
     - Response status code
     - Response body (error message)

3. **Verify Authentication:**
   - Check if user is logged in
   - Check if session is valid
   - Try logging out and back in

4. **Test Edge Function Directly:**
   - Use the Supabase dashboard to test the function
   - Or use curl/Postman to test directly

5. **Check Project Status:**
   - Verify project is not paused
   - Check project health in dashboard

## 📋 Most Likely Issues (Based on 404 Error):

1. **Edge Function code has errors** → Check logs
2. **API key not accessible** → Check logs for "GEMINI_API_KEY not found"
3. **Authentication failing** → Check if user is logged in
4. **Request format wrong** → Check Network tab for actual request

## 🎯 Next Steps:

1. **Check Supabase Dashboard Logs** - This will show the exact error
2. **Check Browser Network Tab** - See what's being sent/received
3. **Verify user is logged in** - Authentication is required
4. **Check Edge Function code** - Look for syntax/logic errors

The logs in the Supabase dashboard will tell you exactly what's wrong!

