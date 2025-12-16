# Rate Limiting Implementation Guide

## ✅ What Was Implemented

### 1. Database Table (`api_usage`)
- Tracks all AI API calls per user
- Stores: user_id, type, tokens_used, created_at
- Includes RLS policies for security
- Has helper functions for quick lookups

### 2. Edge Function Rate Limiting
- Checks user's daily call count before processing
- Default limit: **10 calls per user per day**
- Returns 429 error if limit exceeded
- Tracks usage after successful calls
- Includes usage info in response

### 3. Frontend Service Updates
- `getApiUsage()` function to check current usage
- Enhanced error handling for rate limit errors
- Extracts usage info from API responses

### 4. UI Updates
- Usage display in Reflections tab
- Shows remaining calls (e.g., "5 / 10 calls left")
- Disables buttons when limit reached
- Shows helpful error messages

---

## 📋 Setup Steps

### Step 1: Run SQL Migration
Run the SQL file to create the `api_usage` table:

```sql
-- Run this in Supabase SQL Editor:
-- File: supabase/add-api-usage-table.sql
```

Or via CLI:
```powershell
# Copy SQL content and run in Supabase Dashboard → SQL Editor
```

### Step 2: Deploy Updated Edge Function
```powershell
npx supabase@latest functions deploy gemini-proxy
```

### Step 3: Test the Implementation
1. Make an AI call (e.g., generate reflection prompts)
2. Check usage display shows remaining calls
3. Make 10 calls to test limit
4. Verify 11th call shows rate limit error

---

## ⚙️ Configuration

### Change Daily Limit
In `supabase/functions/gemini-proxy/index.ts`:
```typescript
const dailyLimit = 10; // Change this number
```

### Add Hourly Limits (Optional)
You can also add hourly limits:
```typescript
const { data: usageLastHour } = await supabaseClient
  .rpc('get_user_api_usage_last_hour', { p_user_id: user.id });

const hourlyLimit = 3;
if (usageLastHour >= hourlyLimit) {
  // Return rate limit error
}
```

---

## 📊 Usage Tracking

### What Gets Tracked:
- **User ID** - Who made the call
- **Type** - What type of call (transcribe, chat, analyze_jd, recommendations)
- **Tokens Used** - Estimated token count
- **Timestamp** - When the call was made

### View Usage Stats:
```sql
-- See all usage for a user
SELECT * FROM api_usage 
WHERE user_id = 'user-uuid-here'
ORDER BY created_at DESC;

-- See daily usage summary
SELECT 
  DATE(created_at) as date,
  COUNT(*) as calls,
  SUM(tokens_used) as total_tokens
FROM api_usage
WHERE user_id = 'user-uuid-here'
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

---

## 🎯 Features

### ✅ Implemented:
- [x] Per-user daily rate limiting (10 calls/day)
- [x] Database tracking of all API calls
- [x] Usage display in UI
- [x] Error messages for rate limits
- [x] Button disabling when limit reached
- [x] Automatic usage refresh

### 🔮 Future Enhancements:
- [ ] Hourly rate limits
- [ ] Different limits per feature type
- [ ] Usage dashboard for admins
- [ ] Email notifications when limit reached
- [ ] Premium tier with higher limits
- [ ] Usage analytics

---

## 🐛 Troubleshooting

### Issue: Rate limit not working
**Check:**
1. SQL migration ran successfully
2. Edge Function redeployed
3. RLS policies allow inserts
4. User is authenticated

### Issue: Usage not displaying
**Check:**
1. `getApiUsage()` function imported
2. useEffect hook is running
3. API response includes `_usage` field
4. localStorage is accessible

### Issue: False rate limit errors
**Check:**
1. Database queries are correct
2. Timezone issues (UTC vs local)
3. RPC function returns correct count

---

## 📈 Monitoring

### Check Usage in Supabase:
1. Go to Supabase Dashboard
2. Navigate to Table Editor
3. Open `api_usage` table
4. Filter by user_id to see individual usage

### Check Edge Function Logs:
1. Go to Supabase Dashboard
2. Navigate to Edge Functions → gemini-proxy
3. Check Logs tab for rate limit errors

---

## 💡 Best Practices

1. **Set Reasonable Limits**
   - 10 calls/day is good for MVP
   - Adjust based on user feedback
   - Consider premium tiers for power users

2. **Monitor Usage**
   - Check logs regularly
   - Track which features are used most
   - Adjust limits based on actual usage

3. **User Communication**
   - Clear error messages
   - Show when limits reset
   - Consider upgrade options

4. **Cost Management**
   - Rate limiting prevents abuse
   - Tracks tokens for cost analysis
   - Helps predict scaling needs

---

## ✅ Success Criteria

After implementation, you should have:
- ✅ Users limited to 10 AI calls per day
- ✅ Usage tracked in database
- ✅ UI shows remaining calls
- ✅ Clear error messages
- ✅ Buttons disabled when limit reached
- ✅ No more rate limit errors from Gemini API

---

## 🚀 Next Steps

1. **Run SQL migration** - Create the table
2. **Deploy Edge Function** - Update with rate limiting
3. **Test thoroughly** - Make sure it works
4. **Monitor usage** - Check logs and database
5. **Adjust limits** - Based on user feedback

**Rate limiting is now properly implemented!** 🎉

