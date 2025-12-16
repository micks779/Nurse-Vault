# Edge Function Secrets Explained

## ✅ What Just Happened

### Successfully Set:
- ✅ **`GEMINI_API_KEY`** - This is the only secret you need to set manually

### Auto-Provided by Supabase (Cannot Set Manually):
- ✅ **`SUPABASE_URL`** - Automatically available to Edge Functions
- ✅ **`SUPABASE_ANON_KEY`** - Automatically available to Edge Functions
- ✅ **`SUPABASE_SERVICE_ROLE_KEY`** - Automatically available to Edge Functions
- ✅ **`SUPABASE_DB_URL`** - Automatically available to Edge Functions

## Why You Got That Error

When you tried to set `SUPABASE_URL` and `SUPABASE_ANON_KEY`, you got:
```
Env name cannot start with SUPABASE_, skipping: SUPABASE_URL
```

**This is normal!** Supabase prevents you from manually setting secrets that start with `SUPABASE_` because:
1. They're automatically provided to Edge Functions
2. They're already configured for your project
3. Setting them manually could cause conflicts

## What You Actually Need

### ✅ Required (Set Manually):
- **`GEMINI_API_KEY`** - Your Google Gemini API key
  - ✅ **Just set this!** It's the only one you need.

### ✅ Auto-Provided (Don't Set):
- `SUPABASE_URL` - Already available
- `SUPABASE_ANON_KEY` - Already available
- `SUPABASE_SERVICE_ROLE_KEY` - Already available
- `SUPABASE_DB_URL` - Already available

## How Edge Functions Access These

In your Edge Function code (`supabase/functions/gemini-proxy/index.ts`):

```typescript
// ✅ This works - GEMINI_API_KEY is set manually
const geminiApiKey = Deno.env.get("GEMINI_API_KEY");

// ✅ These work - Auto-provided by Supabase
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
```

## Verification

After setting `GEMINI_API_KEY`, verify it's there:

```powershell
npx supabase@latest secrets list
```

You should see:
- ✅ `GEMINI_API_KEY` with a digest (hash)
- ✅ `SUPABASE_URL` (auto-provided)
- ✅ `SUPABASE_ANON_KEY` (auto-provided)
- ✅ Other Supabase keys (auto-provided)

## Next Steps

1. ✅ **GEMINI_API_KEY is set** - You're done with secrets!
2. **Redeploy Edge Function** (if needed):
   ```powershell
   npx supabase@latest functions deploy gemini-proxy
   ```
3. **Test AI features** in your app

## Summary

- ✅ **GEMINI_API_KEY**: Set manually (just did this!)
- ✅ **SUPABASE_* keys**: Auto-provided (don't need to set)
- ✅ **You're all set!** The Edge Function now has access to your Gemini API key

