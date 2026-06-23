-- ============================================================
-- Phase 2: Notifications, Conversations, Messages
-- PRODUCTION-SAFE IDEMPOTENT MIGRATION (CORRECTED)
-- Safe to run multiple times without errors
-- ============================================================

-- 1. Create notification_type ENUM (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'notification_type') THEN
    CREATE TYPE public.notification_type AS ENUM (
      'application_submitted',
      'application_reviewed',
      'application_accepted',
      'application_rejected',
      'message_received'
    );
  END IF;
END
$$;

-- 2. Create notifications table (idempotent)
CREATE TABLE IF NOT EXISTS public.notifications (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title       text NOT NULL,
  message     text NOT NULL,
  type        public.notification_type NOT NULL,
  is_read     boolean DEFAULT false,
  link        text,
  created_at  timestamptz DEFAULT now() NOT NULL
);

-- 3. Create conversations table (idempotent)
-- FIXED: creator_id now references auth.users(id) instead of profiles(id)
CREATE TABLE IF NOT EXISTS public.conversations (
  id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id  uuid NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  creator_id      uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  brand_id        uuid NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
  created_at      timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT unique_conversation_per_application UNIQUE (application_id)
);

-- 4. Create messages table (idempotent)
CREATE TABLE IF NOT EXISTS public.messages (
  id               uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id  uuid NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id        uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message          text NOT NULL CHECK (char_length(message) <= 5000),
  created_at       timestamptz DEFAULT now() NOT NULL
);

-- 5. Create indexes (idempotent)
CREATE INDEX IF NOT EXISTS idx_notifications_user_id    ON public.notifications (user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread     ON public.notifications (user_id, is_read) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_notifications_created    ON public.notifications (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_type       ON public.notifications (type);

CREATE INDEX IF NOT EXISTS idx_conversations_creator_id ON public.conversations (creator_id);
CREATE INDEX IF NOT EXISTS idx_conversations_brand_id   ON public.conversations (brand_id);
CREATE INDEX IF NOT EXISTS idx_conversations_app_id     ON public.conversations (application_id);
CREATE INDEX IF NOT EXISTS idx_conversations_created    ON public.conversations (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages (conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id       ON public.messages (sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created         ON public.messages (created_at DESC);

-- 6. Enable RLS (safe to run multiple times)
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- 7. Create SECURITY DEFINER function for notification creation
-- This allows server actions to create notifications for other users
-- while maintaining RLS protection on direct inserts
CREATE OR REPLACE FUNCTION public.create_notification(
  p_user_id uuid,
  p_title text,
  p_message text,
  p_type public.notification_type,
  p_link text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_notification_id uuid;
BEGIN
  -- Validate caller is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Insert notification with elevated privileges (bypasses RLS)
  INSERT INTO public.notifications (user_id, title, message, type, link)
  VALUES (p_user_id, p_title, p_message, p_type, p_link)
  RETURNING id INTO v_notification_id;

  RETURN v_notification_id;
END;
$$;

COMMENT ON FUNCTION public.create_notification IS 'SECURITY DEFINER function to create notifications for any authenticated user. Used by server actions to notify other users.';

-- 8. Notifications RLS policies (idempotent with DROP IF EXISTS)
DROP POLICY IF EXISTS "notifications_select_own" ON public.notifications;
CREATE POLICY "notifications_select_own"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "notifications_update_own" ON public.notifications;
CREATE POLICY "notifications_update_own"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Remove notifications_insert_auth policy - replaced by SECURITY DEFINER function
-- Direct inserts are now blocked to enforce use of create_notification() function
DROP POLICY IF EXISTS "notifications_insert_auth" ON public.notifications;

DROP POLICY IF EXISTS "notifications_delete_own" ON public.notifications;
CREATE POLICY "notifications_delete_own"
  ON public.notifications FOR DELETE
  USING (auth.uid() = user_id);

-- 9. Conversations RLS policies (idempotent with DROP IF EXISTS)
DROP POLICY IF EXISTS "conversations_select" ON public.conversations;
CREATE POLICY "conversations_select"
  ON public.conversations FOR SELECT
  USING (
    auth.uid() = creator_id
    OR EXISTS (
      SELECT 1 FROM public.brands b
      WHERE b.id = brand_id AND b.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "conversations_insert_auth" ON public.conversations;
CREATE POLICY "conversations_insert_auth"
  ON public.conversations FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = creator_id
    OR EXISTS (
      SELECT 1 FROM public.brands b
      WHERE b.id = brand_id AND b.user_id = auth.uid()
    )
  );

-- 10. Messages RLS policies (idempotent with DROP IF EXISTS)
DROP POLICY IF EXISTS "messages_select" ON public.messages;
CREATE POLICY "messages_select"
  ON public.messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = conversation_id AND (
        c.creator_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM public.brands b
          WHERE b.id = c.brand_id AND b.user_id = auth.uid()
        )
      )
    )
  );

DROP POLICY IF EXISTS "messages_insert" ON public.messages;
CREATE POLICY "messages_insert"
  ON public.messages FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = conversation_id AND (
        c.creator_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM public.brands b
          WHERE b.id = c.brand_id AND b.user_id = auth.uid()
        )
      )
    )
  );

-- ============================================================
-- Migration complete. Safe to run again if needed.
-- ============================================================
