# Rate Limiting Status in NurseVault

## ❌ **NO RATE LIMITING CURRENTLY IMPLEMENTED**

---

## 🔍 What We Currently Have

### ✅ Basic Protections:
1. **Authentication Required** ✅
   - Only logged-in users can call AI features
   - Edge Function verifies user session

2. **Loading States** ✅
   - Frontend buttons disabled while processing
   - Prevents multiple simultaneous calls from same user

3. **Input Validation** ✅
   - Checks if inputs are empty before calling
   - Prevents unnecessary API calls

### ❌ What's Missing:
1. **No Per-User Rate Limits** ❌
   - Users can make unlimited AI calls
   - No tracking of calls per user per day/hour

2. **No Global Rate Limiting** ❌
   - Edge Function doesn't limit total requests
   - No queuing system for rate limit errors

3. **No Call Tracking** ❌
   - No database table tracking API calls
   - No way to see who's using how much

4. **No Retry Logic** ❌
   - If rate limit hit, request just fails
   - No automatic retry with backoff

---

## 🚨 Why This Is a Problem

### Current Situation:
- **No limits** = Users can spam AI features
- **Hits Gemini rate limits quickly** (15 req/min, 250 TPM)
- **Causes failures** for all users when limits hit
- **No way to prevent abuse**

### What Happens:
1. User makes multiple AI calls quickly
2. Hits Gemini's 15 requests/minute limit
3. All subsequent calls fail with rate limit errors
4. Other users also affected (shared API key limits)

---

## ✅ What Should Be Added

### Option 1: Per-User Rate Limiting (Recommended)
**Track calls per user:**
- Limit: 10 AI calls per user per day
- Or: 3 calls per user per hour
- Store in database: `api_usage` table

**Implementation:**
```typescript
// In Edge Function, before processing:
const { data: usage } = await supabase
  .from('api_usage')
  .select('*')
  .eq('user_id', user.id)
  .gte('created_at', new Date(Date.now() - 24*60*60*1000).toISOString());

if (usage.length >= 10) {
  return new Response(
    JSON.stringify({ error: "Daily limit reached. Try again tomorrow." }),
    { status: 429 }
  );
}

// Record the call
await supabase.from('api_usage').insert({
  user_id: user.id,
  type: type,
  created_at: new Date().toISOString()
});
```

### Option 2: Simple In-Memory Rate Limiting
**Track in Edge Function memory:**
- Use a Map to track calls per user
- Reset every hour/day
- Simpler but lost on function restart

### Option 3: Queue System
**Queue requests when limits hit:**
- If rate limit hit, queue the request
- Process when limit resets
- More complex but better UX

### Option 4: Frontend Rate Limiting
**Limit in frontend:**
- Track calls in localStorage
- Show "You've used X calls today" message
- Can be bypassed (not secure)

---

## 📋 Recommended Implementation

### Step 1: Create API Usage Table
```sql
CREATE TABLE api_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'transcribe', 'chat', 'analyze_jd', 'recommendations'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  tokens_used INTEGER
);

CREATE INDEX idx_api_usage_user_date ON api_usage(user_id, created_at);
```

### Step 2: Add Rate Limiting to Edge Function
- Check user's call count for today
- If limit reached, return 429 error
- Otherwise, record the call and proceed

### Step 3: Add Frontend Feedback
- Show remaining calls to user
- Display error message if limit reached
- Add "Upgrade" option if needed

---

## 🎯 Quick Fix Options

### Immediate (No Code Changes):
1. **Add billing to Gemini** - Increases rate limits
2. **Monitor usage** - Check Supabase logs
3. **Manual limits** - Tell users to limit usage

### Short Term (Simple Code):
1. **Add loading cooldown** - 2-3 second delay between calls
2. **Disable button for 30 seconds** after each call
3. **Show "Please wait" message**

### Long Term (Proper Solution):
1. **Database tracking** - Track calls per user
2. **Rate limiting logic** - Enforce limits
3. **User dashboard** - Show usage stats

---

## 📊 Current Protection Level

| Protection | Status | Effectiveness |
|------------|--------|---------------|
| Authentication | ✅ Yes | Prevents anonymous calls |
| Loading States | ✅ Yes | Prevents duplicate calls |
| Input Validation | ✅ Yes | Prevents empty calls |
| Per-User Limits | ❌ No | **Users can spam** |
| Global Limits | ❌ No | **No protection** |
| Call Tracking | ❌ No | **No visibility** |
| Retry Logic | ❌ No | **Fails immediately** |

**Overall:** ⚠️ **Vulnerable to rate limit issues**

---

## 🚀 Next Steps

1. **Immediate:** Add billing to Gemini (increases limits)
2. **Short term:** Add simple cooldown/delay
3. **Long term:** Implement proper rate limiting with database tracking

**Would you like me to implement rate limiting?**

