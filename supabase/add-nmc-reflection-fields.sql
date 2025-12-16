-- Add NMC Revalidation format fields to reflections table
-- This allows reflections to be stored in NMC's required 4-question format

ALTER TABLE reflections 
ADD COLUMN IF NOT EXISTS nmc_question1 TEXT,
ADD COLUMN IF NOT EXISTS nmc_question2 TEXT,
ADD COLUMN IF NOT EXISTS nmc_question3 TEXT,
ADD COLUMN IF NOT EXISTS nmc_question4 TEXT,
ADD COLUMN IF NOT EXISTS code_themes TEXT[]; -- Array of Code theme strings

-- Add comment explaining the NMC format
COMMENT ON COLUMN reflections.nmc_question1 IS 'NMC Question 1: What was the nature of the CPD activity and/or practice-related feedback and/or event or experience in your practice?';
COMMENT ON COLUMN reflections.nmc_question2 IS 'NMC Question 2: What did you learn from the CPD activity and/or feedback and/or event or experience in your practice?';
COMMENT ON COLUMN reflections.nmc_question3 IS 'NMC Question 3: How did you change or improve your practice as a result?';
COMMENT ON COLUMN reflections.nmc_question4 IS 'NMC Question 4: How is this relevant to the Code?';
COMMENT ON COLUMN reflections.code_themes IS 'Array of selected Code themes: Prioritise people, Practise effectively, Preserve safety, Promote professionalism and trust';

-- Note: The existing 'content' column is kept for backwards compatibility
-- New reflections will use nmc_question1-4, old reflections will use 'content'

