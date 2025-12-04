# Feedback Expansion & Implementation Plan

## Overview
This document expands on user feedback to create detailed implementation plans for each requested change.

---

## 1. Passport Section - Clarify Purpose & Remove Mandatory Training

### Current State
- **Page Title:** "My Passport"
- **Subtitle:** "Securely store and manage your professional documents."
- **Categories Available:** All `DocCategory` enum values (likely includes Mandatory Training)

### Feedback
- Make it clear this section is for **personal information documents only**
- Examples: Passport, Right to Work, PIN number, etc.
- **Remove "Mandatory Training"** from the dropdown category options

### Expanded Plan

#### A. Update Page Description
**Current:**
```
"Securely store and manage your professional documents."
```

**Proposed:**
```
"Securely store your personal identification and professional credentials. 
Upload documents like your passport, right to work documents, NMC PIN, 
DBS certificate, and other personal identification documents."
```

#### B. Update Category Options
**Action:** Remove `MANDATORY_TRAINING` from `DocCategory` enum (or filter it out in the Passport page)

**Suggested Categories for Passport Section:**
- Passport / ID
- Right to Work
- NMC PIN / Registration
- DBS Certificate
- Visa / Immigration Documents
- Professional Registration
- Other Personal Documents

#### C. Add Helper Text
Add an info box or tooltip explaining:
- "This section is for personal identification and credential documents"
- "For training certificates and course completion records, use the 'Training & Expiry' section"

#### D. Update Placeholder Text
**Current:** `"e.g., Passport, DBS Certificate"`

**Proposed:** `"e.g., Passport, Right to Work, NMC PIN"`

---

## 2. Training & Expiry - Address Unknown Expiry Dates

### Current State
- **Page Title:** "Mandatory Training"
- **Subtitle:** "Track expiry dates and compliance status."
- **Form:** Requires `expiryDate` as a mandatory field
- **Status Calculation:** Based on expiry date (Valid, Due Soon, Expired)

### Feedback
- Some nurses may not know exactly when courses expire
- Some courses expire in 1-2 years but should be done 3 months before
- Need guidance/explanation about expiry dates

### Expanded Plan

#### A. Make Expiry Date Optional
**Current:** Expiry date is required
**Proposed:** Make expiry date optional with clear indication

#### B. Add Guidance Text
Add an informational section or tooltip explaining:

```
"Training Expiry Guidelines:
• Some courses expire after 1-3 years (check your certificate)
• It's recommended to renew training 3 months before expiry
• If you're unsure of the expiry date, leave it blank and update later
• You can always edit the record once you have the exact date"
```

#### C. Update Form Field
**Current:**
```html
<label>Expiry Date <span className="text-red-500">*</span></label>
```

**Proposed:**
```html
<label>Expiry Date (Optional)</label>
<p className="text-xs text-slate-500 mt-1">
  If unknown, leave blank. You can update this later. 
  Recommended to renew 3 months before expiry.
</p>
```

#### D. Update Status Logic
- If no expiry date: Show as "Valid" or "Unknown Expiry"
- Add a new status badge: "Expiry Unknown" (different from "Valid")
- Still allow status tracking without expiry dates

#### E. Add "Renewal Reminder" Feature (Future Enhancement)
- Calculate "Recommended Renewal Date" = Expiry Date - 3 months
- Show this in the table/card view
- Add a column: "Renew By" (expiry date - 90 days)

---

## 3. Competency Section - Clarify Purpose

### Current State
- **Page Title:** "Competencies"
- **Subtitle:** "Track hands-on clinical and professional skills for your progression."

### Feedback
- Current description is too brief
- Need more detail on what it's for and why it's needed
- Make it clearer what competencies are and their purpose

### Expanded Plan

#### A. Enhanced Description
**Current:**
```
"Track hands-on clinical and professional skills for your progression."
```

**Proposed:**
```
"Document and track your clinical competencies and professional skills. 
Record when you've been assessed on procedures like venepuncture, 
cannulation, or leadership skills. This evidence supports your career 
progression, appraisals, and demonstrates your readiness for promotion. 
Link voice notes or reflections to provide evidence of your practice."
```

#### B. Add Information Section
Add an expandable info box or section explaining:

**"What are Competencies?"**
- Clinical competencies are hands-on skills you've been assessed on
- Examples: Venepuncture, Cannulation, Catheterisation, Wound Care
- Professional competencies: Leadership, Communication, Mentoring

**"Why Track Them?"**
- Required for career progression (e.g., Band 5 → Band 6)
- Evidence for appraisals and performance reviews
- Demonstrates readiness for promotion
- Links to your Career Pathway requirements
- Can be used in job applications and interviews

**"How to Use This Section"**
- Add competencies you've been assessed on
- Mark status: Not Started → In Progress → Signed Off
- Link evidence (voice notes, reflections)
- Track which competencies are required for your target band

#### C. Add Examples Section
Show example competencies with brief explanations:
- **Clinical:** Venepuncture, Cannulation, Catheterisation
- **Communication:** SBAR Escalation, Safeguarding Referral
- **Leadership:** Shift Leadership, Mentoring Students

#### D. Link to Career Pathway
Add a note: "See your Career Pathway to view which competencies are required for your target band."

---

## 4. Career Pathway - Reference NCL Training Hub

### Current State
- **Page Title:** "Career Progression Pathway"
- **Subtitle:** "Tracking your journey from [current] to [target] in [specialty]."
- No external references or resources

### Feedback
- Can reference/bank on the NCL Training Hub Career Pathway Tool
- Link: https://www.ncltraininghub.org/career-pathway-tool
- This site has information on how to map careers

### Expanded Plan

#### A. Add Resource Reference Section
Add a new section or info box:

**"Career Pathway Resources"**
```
"Explore comprehensive career pathways in health and social care through 
the North Central London Training Hub Career Pathway Tool. This resource 
provides detailed information on:
• Over 350 career opportunities in health and care
• Role descriptions and requirements
• Progression pathways between bands
• Entry requirements and qualifications
• Apprenticeship opportunities"
```

**Link:** [Visit NCL Career Pathway Tool](https://www.ncltraininghub.org/career-pathway-tool)

#### B. Integrate Pathway Information
Based on the NCL site, add information about:

**Career Levels:**
- Pre-Employment
- Entry Level
- Early Career
- Mid Career
- Leadership

**Progression Information:**
- Band progression requirements
- Required qualifications
- Competencies needed
- Training opportunities
- Apprenticeship pathways

#### C. Add "Learn More" Section
Add a collapsible section or modal with:
- Links to NCL Training Hub resources
- Information about apprenticeships
- Functional skills requirements
- Job opportunities links
- Pre-employment courses

#### D. Update Requirements List
Enhance the requirements list to reference NCL pathway information:
- Add tooltips explaining why each requirement is needed
- Link to relevant NCL resources
- Show progression examples from the NCL tool

#### E. Add Help Text
Add contextual help throughout the page:
- "Not sure what's required for your target band? Check the NCL Career Pathway Tool"
- "See example progression pathways and role descriptions"

---

## Implementation Priority

### High Priority (Core Functionality)
1. ✅ **Passport Section:** Remove Mandatory Training, clarify purpose
2. ✅ **Training & Expiry:** Make expiry date optional, add guidance
3. ✅ **Competency Section:** Enhanced description and explanation

### Medium Priority (User Experience)
4. ⚠️ **Career Pathway:** Add NCL resource references and links
5. ⚠️ **Training & Expiry:** Add "Renewal Reminder" calculation

### Low Priority (Future Enhancements)
6. 📋 **Competency Section:** Add examples and interactive guides
7. 📋 **Career Pathway:** Deep integration with NCL pathway data

---

## Technical Considerations

### For Passport Section
- Update `DocCategory` enum or filter categories in the Passport page
- Update type definitions if needed
- Ensure Training section still has access to training-related categories

### For Training & Expiry
- Update form validation to make expiry date optional
- Update status calculation logic to handle missing expiry dates
- Add new status type: "Expiry Unknown" (optional)

### For Competency Section
- Add informational components/sections
- No database changes needed (just UI/text updates)

### For Career Pathway
- Add external link components
- No database changes needed (just UI/text updates)
- Consider adding a "Resources" section to the page

---

## Next Steps

1. **Review this expansion** with stakeholders
2. **Prioritize** which changes to implement first
3. **Create detailed implementation** for each prioritized item
4. **Implement changes** incrementally
5. **Test** each change before moving to the next

---

## Questions to Clarify

1. **Passport Categories:** Should we create a separate category enum for Passport vs. other document types?
2. **Training Expiry:** Should "Expiry Unknown" be a separate status, or just show as "Valid"?
3. **Competency Description:** How detailed should the explanation be? (Brief vs. Comprehensive)
4. **NCL Integration:** Should we just link to NCL, or try to import/display some of their pathway data?

