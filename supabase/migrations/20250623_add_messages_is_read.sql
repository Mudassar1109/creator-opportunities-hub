-- ============================================================
-- Add is_read column to messages table for unread tracking
-- PRODUCTION-SAFE IDEMPOTENT MIGRATION
-- ============================================================

-- Add is_read column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'messages' AND column_name = 'is_read'
  ) THEN
    ALTER TABLE public.messages ADD COLUMN is_read boolean DEFAULT false;
  END IF;
END
$$;

-- Add index for unread message queries
CREATE INDEX IF NOT EXISTS idx_messages_unread 
ON public.messages (conversation_id, is_read) 
WHERE is_read = false;

-- ============================================================
-- Migration complete
-- ============================================================
