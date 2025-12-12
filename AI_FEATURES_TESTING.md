# AI Features Testing Guide

## 🎯 All AI Features in NurseVault

### 1. **Voice Note Transcription** ⭐ (Currently Erroring)
**Location:** Learning & Dev → Voice Notes tab
**What it does:** 
- Records audio from microphone
- Transcribes speech to text using Gemini AI
- Suggests category (CPD, Reflection, or Competency)

**How to test:**
1. Go to Learning & Dev page
2. Click "Voice Notes" tab
3. Click microphone icon in any text field
4. Speak for 5-10 seconds
5. Click stop/record button
6. Should see transcribed text appear

**Expected result:** Audio transcribed to text, category suggested
**Current status:** ❌ Error - "Error transcribing audio"

---

### 2. **Job Description Analysis** 
**Location:** Career Pathway → Smart Recommendations
**What it does:**
- Analyzes uploaded/pasted job description
- Creates personalized career path requirements
- Identifies skills, qualifications, and training needed

**How to test:**
1. Go to Career Pathway page
2. Scroll to "Smart Recommendations" section
3. Click "Upload Job Description" or "Paste Job Description Text"
4. Enter/paste a job description
5. Click "Analyze"

**Expected result:** 
- Analysis summary appears
- Requirements added to "Core Requirements" section
- Shows number of requirements added

**Current status:** ✅ Should work (needs testing)

---

### 3. **Reflection Prompt Generation**
**Location:** Learning & Dev → Reflections tab
**What it does:**
- Generates personalized reflection questions based on context
- Helps structure NMC revalidation reflections

**How to test:**
1. Go to Learning & Dev → Reflections tab
2. Enter some context (e.g., "I attended a training on patient safety")
3. Click "Generate Questions" (if available)
4. Or use voice note transcription, then create reflection

**Expected result:** Relevant reflection questions generated
**Current status:** ✅ Should work (needs testing)

---

### 4. **Structured Reflection Generation**
**Location:** Learning & Dev → Reflections tab
**What it does:**
- Takes your answers to reflection questions
- Generates a formal, structured reflection using "What? So What? Now What?" model
- Formats for NMC portfolio

**How to test:**
1. Go to Learning & Dev → Reflections tab
2. Fill in reflection questions
3. Click "Generate Reflection" or similar button
4. Review generated reflection

**Expected result:** Well-structured reflection text generated
**Current status:** ✅ Should work (needs testing)

---

### 5. **CPD Recommendations**
**Location:** Learning & Dev → Recommendations tab
**What it does:**
- Analyzes your current band, target band, and specialty
- Suggests relevant CPD activities, courses, and training
- Personalized to your career goals

**How to test:**
1. Go to Learning & Dev → Recommendations tab
2. Ensure your profile has current/target band set
3. Click "Generate Recommendations" or similar
4. Review suggested CPD activities

**Expected result:** List of personalized CPD recommendations
**Current status:** ✅ Should work (needs testing)

---

## 🔍 Testing Checklist

### Pre-Testing Setup:
- [ ] Edge Function deployed (`gemini-proxy`)
- [ ] API key set as Supabase secret
- [ ] User logged in
- [ ] Browser console open (F12) to see errors

### Test Each Feature:
- [ ] **Voice Transcription** - Record and transcribe audio
- [ ] **JD Analysis** - Upload/paste job description
- [ ] **Reflection Prompts** - Generate questions
- [ ] **Structured Reflection** - Generate reflection text
- [ ] **CPD Recommendations** - Get personalized suggestions

### Verify Security:
- [ ] Open DevTools → Network tab
- [ ] Use an AI feature
- [ ] Check requests - should go to `/functions/v1/gemini-proxy`
- [ ] Verify NO API key visible in requests
- [ ] Verify Authorization header present

---

## 🐛 Troubleshooting

### Voice Transcription Error:
**Error:** "Error transcribing audio"
**Possible causes:**
1. Edge Function not deployed
2. API key not set as secret
3. Response format mismatch
4. Authentication issue

**Fix steps:**
1. Check Edge Function logs in Supabase dashboard
2. Verify secret is set: `npx supabase@latest secrets list`
3. Check browser console for detailed error
4. Verify user is logged in

### All AI Features Failing:
**Check:**
1. Edge Function deployed: `npx supabase@latest functions list`
2. API key secret set: `npx supabase@latest secrets list`
3. User authenticated (check login status)
4. Supabase URL correct in `.env.local`

### Network Errors:
**Check:**
1. CORS issues (should be handled by Edge Function)
2. Authentication token valid
3. Supabase project active (not paused)

---

## 📊 Expected Response Times

- **Voice Transcription:** 2-5 seconds
- **JD Analysis:** 5-10 seconds
- **Reflection Generation:** 3-6 seconds
- **CPD Recommendations:** 3-6 seconds

---

## ✅ Success Criteria

All features should:
- ✅ Work without exposing API key
- ✅ Require user authentication
- ✅ Return relevant, helpful results
- ✅ Handle errors gracefully
- ✅ Show loading states during processing

