-- Add AI summary column to memos table
ALTER TABLE public.memos ADD COLUMN IF NOT EXISTS ai_summary TEXT;

-- Add index for summary searches
CREATE INDEX IF NOT EXISTS idx_memos_ai_summary ON public.memos (ai_summary);
