-- Add title column to voice_logs table
-- Run this in Supabase SQL Editor if the column doesn't exist

ALTER TABLE voice_logs 
ADD COLUMN IF NOT EXISTS title TEXT;

-- Add comment for clarity
COMMENT ON COLUMN voice_logs.title IS 'User-provided title for the voice log entry';

