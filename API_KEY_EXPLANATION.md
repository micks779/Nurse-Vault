# API Keys: Same or Different?

## Quick Answer

**For Gemini API Key:**
- ✅ **Should be the SAME** (same Google API key)
- ⚠️ **But you DON'T need it in `.env` anymore** (since we use Edge Functions)

**For Supabase Keys:**
- ✅ **Should MATCH** (same project = same keys)

---

## Detailed Explanation

### 1. Gemini API Key

#### Current Setup:
- **`.env` file**: `GEMINI_API_KEY=AIzaSyDVe-7kkRRxj7uwJE9NE4_BbtY6f1DV900`
- **Edge Function secret**: Set via `npx supabase@latest secrets set GEMINI_API_KEY=...`

#### Should They Match?
✅ **YES - They should be the SAME key** (same Google API key from https://makersuite.google.com/app/apikey)

#### Do You Need It in `.env`?
❌ **NO - You DON'T need it in `.env` anymore!**

**Why?**
- Your code now uses Edge Functions for ALL AI calls
- Edge Functions get the key from Supabase secrets (server-side)
- The `.env` key is NOT used by the frontend anymore
- Having it in `.env` is just leftover/optional

**Current Code Flow:**
```
Frontend → Edge Function → Gemini API
         (no API key needed)
```

**Old Code Flow (insecure):**
```
Frontend → Gemini API (with API key exposed) ❌
```

### 2. Supabase Keys

#### Current Setup:
- **`.env` file**: 
  - `VITE_SUPABASE_URL=https://ufxyzzjhmkyzuljmohqd.supabase.co`
  - `VITE_SUPABASE_ANON_KEY=eyJhbGc...`
- **Edge Function secrets**: 
  - `SUPABASE_URL` (auto-provided by Supabase)
  - `SUPABASE_ANON_KEY` (auto-provided by Supabase)

#### Should They Match?
✅ **YES - They should MATCH** (same project = same values)

**Why?**
- Both point to the same Supabase project
- Edge Functions automatically get these from Supabase
- Frontend needs them to connect to the database

---

## What You Should Do

### Option 1: Keep It Simple (Recommended)
1. **Remove `GEMINI_API_KEY` from `.env`** (not needed anymore)
2. **Keep only Supabase keys in `.env`**:
   ```env
   VITE_SUPABASE_URL=https://ufxyzzjhmkyzuljmohqd.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
3. **Set Edge Function secret** (if not already done):
   ```powershell
   npx supabase@latest secrets set GEMINI_API_KEY=AIzaSyDVe-7kkRRxj7uwJE9NE4_BbtY6f1DV900
   ```

### Option 2: Keep Both (Optional)
- Keep `GEMINI_API_KEY` in `.env` for reference/backup
- Make sure Edge Function secret matches it
- The `.env` key won't be used, but it's harmless

---

## Summary Table

| Key | `.env` File | Edge Function Secret | Should Match? | Required? |
|-----|-------------|---------------------|---------------|-----------|
| **Gemini API Key** | `GEMINI_API_KEY=...` | `GEMINI_API_KEY=...` | ✅ Yes (same Google key) | ❌ Not in `.env` (only Edge Function) |
| **Supabase URL** | `VITE_SUPABASE_URL=...` | `SUPABASE_URL=...` (auto) | ✅ Yes (same project) | ✅ Yes (both) |
| **Supabase Anon Key** | `VITE_SUPABASE_ANON_KEY=...` | `SUPABASE_ANON_KEY=...` (auto) | ✅ Yes (same project) | ✅ Yes (both) |

---

## Current Status

Based on your setup:
- ✅ `.env` has: `GEMINI_API_KEY=AIzaSyDVe-7kkRRxj7uwJE9NE4_BbtY6f1DV900`
- ❓ Edge Function secret: Unknown (might be different or outdated)
- ✅ Supabase keys: Should match (same project)

**Action Needed:**
1. Update Edge Function secret to match your `.env` key:
   ```powershell
   npx supabase@latest secrets set GEMINI_API_KEY=AIzaSyDVe-7kkRRxj7uwJE9NE4_BbtY6f1DV900
   ```
2. (Optional) Remove `GEMINI_API_KEY` from `.env` since it's not used anymore

---

## Why This Matters

- **Security**: Edge Function keeps API key server-side (secure)
- **Consistency**: Same key = same API access = consistent behavior
- **Simplicity**: One key to manage (in Edge Function secret)

