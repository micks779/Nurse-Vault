-- Migration: Add salary columns to career_paths table
-- Run this in Supabase SQL Editor

ALTER TABLE career_paths 
ADD COLUMN IF NOT EXISTS current_salary NUMERIC(10,2),
ADD COLUMN IF NOT EXISTS target_salary NUMERIC(10,2);

-- Verify the columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'career_paths' 
AND column_name IN ('current_salary', 'target_salary');

