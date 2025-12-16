# Rate Limiting Setup Instructions

## ✅ Implementation Complete!

Rate limiting has been fully implemented. Follow these steps to activate it:

---

## 🚀 Quick Setup (3 Steps)

### Step 1: Create Database Table

**Option A: Via Supabase Dashboard (Recommended)**
1. Go to: https://supabase.com/dashboard/project/ufxyzzjhmkyzuljmohqd/sql/new
2. Open the file: `supabase/add-api-usage-table.sql`
3. Copy the entire SQL content
4. Paste into Supabase SQL Editor
5. Click "Run"

**Option B: Via Supabase CLI**
```powershell
# If you have Supabase CLI set up locally
npx supabase@latest db push
```

### Step 2: Deploy Updated Edge Function

```powershell
npx supabase@latest functions deploy gemini-proxy
```

You should see:
```
Deploying function gemini-proxy...
Function gemini-proxy deployed successfully
```

### Step 3: Test It!

1. **Open your app** (localhost:3003 or deployed URL)
2. **Go to Learning & Dev → Reflections tab**
3. **Check usage display** - Should show "X / 10 calls left"
4. **Make an AI call** - Generate reflection prompts
5. **Check usage updates** - Should decrease by 1
6. **Make 10 calls** - Test the limit
7. **11th call should fail** - With rate limit message

---

## 📋 What Was Implemented

### ✅ Database
- `api_usage` table to track all AI calls
- RLS policies for security
- Helper functions for quick lookups

### ✅ Edge Function
- Checks daily limit (10 calls/user/day) before processing
- Returns 429 error if limit exceeded
- Tracks usage after successful calls
- Includes usage info in response

### ✅ Frontend
- `getApiUsage()` service function
- Usage display in Reflections tab
- Error handling for rate limits
- Button disabling when limit reached
- Automatic usage refresh

---

## ⚙️ Configuration

### Change Daily Limit

Edit `supabase/functions/gemini-proxy/index.ts`:
```typescript
const dailyLimit = 10; // Change to your desired limit
```

Then redeploy:
```powershell
npx supabase@latest functions deploy gemini-proxy
```

### Recommended Limits:
- **MVP/Beta:** 10 calls/day
- **Production:** 15-20 calls/day
- **Premium Users:** 50+ calls/day (future feature)

---

## 🎯 Features

### What Users See:
- **Usage Counter:** "5 / 10 calls left" in Reflections tab
- **Disabled Button:** When limit reached
- **Error Message:** Clear message when limit exceeded
- **Auto-Refresh:** Usage updates after each call

### What Gets Tracked:
- User ID
- Call type (transcribe, chat, analyze_jd, recommendations)
- Tokens used (estimated)
- Timestamp

---

## 🐛 Troubleshooting

### Issue: "Function not found" error
**Solution:** Make sure you deployed the Edge Function:
```powershell
npx supabase@latest functions deploy gemini-proxy
```

### Issue: "RPC function not found"
**Solution:** Make sure you ran the SQL migration to create the helper functions.

### Issue: Usage not displaying
**Check:**
1. SQL migration ran successfully
2. User is logged in
3. Check browser console for errors
4. Verify `getApiUsage()` is imported

### Issue: Rate limit not working
**Check:**
1. Edge Function is deployed
2. Database table exists
3. RLS policies allow inserts
4. Check Edge Function logs in Supabase dashboard

---

## 📊 Monitoring Usage

### View Usage in Database:
```sql
-- See all usage for current user
SELECT * FROM api_usage 
WHERE user_id = auth.uid()
ORDER BY created_at DESC;

-- Daily summary
SELECT 
  DATE(created_at) as date,
  type,
  COUNT(*) as calls,
  SUM(tokens_used) as total_tokens
FROM api_usage
WHERE user_id = auth.uid()
GROUP BY DATE(created_at), type
ORDER BY date DESC;
```

### Check Edge Function Logs:
1. Go to: https://supabase.com/dashboard/project/ufxyzzjhmkyzuljmohqd/functions/gemini-proxy/logs
2. Look for rate limit errors (429 status)
3. Check for any other errors

---

## ✅ Success Checklist

After setup, verify:
- [ ] SQL migration ran successfully
- [ ] Edge Function deployed
- [ ] Usage display shows in Reflections tab
- [ ] Can make AI calls successfully
- [ ] Usage counter decreases after each call
- [ ] 11th call shows rate limit error
- [ ] Button disabled when limit reached

---

## 🎉 You're Done!

Rate limiting is now fully implemented and will:
- ✅ Prevent users from hitting Gemini API rate limits
- ✅ Track usage for cost analysis
- ✅ Provide clear feedback to users
- ✅ Protect your API costs

**Next:** Test it thoroughly and adjust limits based on user feedback!

