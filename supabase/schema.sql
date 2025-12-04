-- NurseVault Database Schema with Row Level Security (RLS)
-- Run this in Supabase SQL Editor: https://app.supabase.com/project/_/sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  "current_role" TEXT NOT NULL,
  "current_band" TEXT NOT NULL,
  nmc_pin TEXT,
  revalidation_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only read/update their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================
-- DOCUMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  upload_date DATE NOT NULL DEFAULT CURRENT_DATE,
  expiry_date DATE,
  file_type TEXT NOT NULL,
  size TEXT,
  tags TEXT[] DEFAULT '{}',
  storage_path TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on documents
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own documents"
  ON documents FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own documents"
  ON documents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own documents"
  ON documents FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own documents"
  ON documents FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- TRAINING RECORDS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS training_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_name TEXT NOT NULL,
  provider TEXT NOT NULL,
  date_completed DATE NOT NULL,
  expiry_date DATE NOT NULL,
  category TEXT NOT NULL,
  status TEXT NOT NULL,
  linked_doc_id UUID REFERENCES documents(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE training_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own training records"
  ON training_records FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own training records"
  ON training_records FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own training records"
  ON training_records FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own training records"
  ON training_records FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- CPD ENTRIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS cpd_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  hours NUMERIC(5,2) NOT NULL,
  participatory BOOLEAN NOT NULL DEFAULT false,
  reflection TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  evidence_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE cpd_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own CPD entries"
  ON cpd_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own CPD entries"
  ON cpd_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own CPD entries"
  ON cpd_entries FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own CPD entries"
  ON cpd_entries FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- COMPETENCIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS competencies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  category TEXT NOT NULL,
  date_assessed DATE,
  assessor_name TEXT,
  assessor_role TEXT,
  status TEXT NOT NULL,
  setting TEXT,
  notes TEXT,
  evidence_voice_log_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE competencies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own competencies"
  ON competencies FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own competencies"
  ON competencies FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own competencies"
  ON competencies FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own competencies"
  ON competencies FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- CAREER PATHS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS career_paths (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  "current_band" TEXT NOT NULL,
  "target_band" TEXT NOT NULL,
  specialty TEXT NOT NULL,
  current_salary NUMERIC(10,2),
  target_salary NUMERIC(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

ALTER TABLE career_paths ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own career path"
  ON career_paths FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own career path"
  ON career_paths FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own career path"
  ON career_paths FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- CAREER REQUIREMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS career_requirements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  career_path_id UUID NOT NULL REFERENCES career_paths(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  status TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE career_requirements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own career requirements"
  ON career_requirements FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM career_paths
      WHERE career_paths.id = career_requirements.career_path_id
      AND career_paths.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own career requirements"
  ON career_requirements FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM career_paths
      WHERE career_paths.id = career_requirements.career_path_id
      AND career_paths.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own career requirements"
  ON career_requirements FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM career_paths
      WHERE career_paths.id = career_requirements.career_path_id
      AND career_paths.user_id = auth.uid()
    )
  );

-- ============================================
-- VOICE LOGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS voice_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  duration_seconds INTEGER NOT NULL,
  transcription TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Draft',
  suggested_type TEXT,
  storage_path TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE voice_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own voice logs"
  ON voice_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own voice logs"
  ON voice_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own voice logs"
  ON voice_logs FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own voice logs"
  ON voice_logs FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- REFLECTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS reflections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  method TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE reflections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own reflections"
  ON reflections FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reflections"
  ON reflections FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reflections"
  ON reflections FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reflections"
  ON reflections FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- RECOMMENDATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending',
  provider TEXT,
  estimated_hours INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own recommendations"
  ON recommendations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own recommendations"
  ON recommendations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own recommendations"
  ON recommendations FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, "current_role", "current_band")
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'New User'),
    COALESCE(NEW.raw_user_meta_data->>'current_role', 'Staff Nurse'),
    COALESCE(NEW.raw_user_meta_data->>'current_band', 'Band 5')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call function on new user
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers to all tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_training_records_updated_at BEFORE UPDATE ON training_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cpd_entries_updated_at BEFORE UPDATE ON cpd_entries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_competencies_updated_at BEFORE UPDATE ON competencies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_career_paths_updated_at BEFORE UPDATE ON career_paths FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_career_requirements_updated_at BEFORE UPDATE ON career_requirements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_voice_logs_updated_at BEFORE UPDATE ON voice_logs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reflections_updated_at BEFORE UPDATE ON reflections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_recommendations_updated_at BEFORE UPDATE ON recommendations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

