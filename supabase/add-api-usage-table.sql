-- Create API usage tracking table for rate limiting
CREATE TABLE IF NOT EXISTS api_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('transcribe', 'chat', 'analyze_jd', 'recommendations')),
  tokens_used INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for fast lookups by user and date
CREATE INDEX IF NOT EXISTS idx_api_usage_user_date ON api_usage(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_api_usage_user_type_date ON api_usage(user_id, type, created_at DESC);

-- Enable Row Level Security
ALTER TABLE api_usage ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only see their own usage
CREATE POLICY "Users can view their own API usage"
  ON api_usage
  FOR SELECT
  USING (auth.uid() = user_id);

-- RLS Policy: System can insert usage records (via service role)
-- Note: Edge Function uses service role, so this allows inserts
CREATE POLICY "Service role can insert API usage"
  ON api_usage
  FOR INSERT
  WITH CHECK (true);

-- Function to get user's API call count for today
CREATE OR REPLACE FUNCTION get_user_api_usage_today(p_user_id UUID)
RETURNS INTEGER AS $$
  SELECT COUNT(*)::INTEGER
  FROM api_usage
  WHERE user_id = p_user_id
    AND created_at >= CURRENT_DATE
    AND created_at < CURRENT_DATE + INTERVAL '1 day';
$$ LANGUAGE SQL SECURITY DEFINER;

-- Function to get user's API call count for last hour
CREATE OR REPLACE FUNCTION get_user_api_usage_last_hour(p_user_id UUID)
RETURNS INTEGER AS $$
  SELECT COUNT(*)::INTEGER
  FROM api_usage
  WHERE user_id = p_user_id
    AND created_at >= NOW() - INTERVAL '1 hour';
$$ LANGUAGE SQL SECURITY DEFINER;

-- Add comment
COMMENT ON TABLE api_usage IS 'Tracks API usage for rate limiting purposes';
COMMENT ON COLUMN api_usage.type IS 'Type of API call: transcribe, chat, analyze_jd, or recommendations';
COMMENT ON COLUMN api_usage.tokens_used IS 'Number of tokens used in this API call (optional, for cost tracking)';

