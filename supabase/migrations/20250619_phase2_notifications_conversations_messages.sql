-- ============================================================
-- Phase 2: Notifications, Conversations, and Messages
-- Migration for live Supabase database
-- ============================================================

-- 1. Create notification_type ENUM
CREATE TYPE public.notification_type AS ENUM (
  'application_submitted',
  'application_reviewed',
  'application_accepted',
  'application_rejected',
  'message_received'
);

-- 2. Create notifications table
CREATE TABLE public.notifications (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title       text NOT NULL,
  message     text NOT NULL,
  type        public.notification_type NOT NULL,
  is_read     boolean DEFAULT false,
  link        text,
  created_at  timestamptz DEFAULT now() NOT NULL
);

-- 3. Create conversations table
CREATE TABLE public.conversations (
  id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id  uuid NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  creator_id      uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  brand_id        uuid NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
  created_at      timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT unique_conversation_per_application UNIQUE (application_id)
);

-- 4. Create messages table
CREATE TABLE public.messages (
  id               uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id  uuid NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id        uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message          text NOT NULL CHECK (char_length(message) <= 5000),
  created_at       timestamptz DEFAULT now() NOT NULL
);

-- 5. Indexes
CREATE INDEX idx_notifications_user_id    ON public.notifications (user_id);
CREATE INDEX idx_notifications_unread     ON public.notifications (user_id, is_read) WHERE is_read = false;
CREATE INDEX idx_notifications_created    ON public.notifications (created_at DESC);
CREATE INDEX idx_notifications_type       ON public.notifications (type);

CREATE INDEX idx_conversations_creator_id ON public.conversations (creator_id);
CREATE INDEX idx_conversations_brand_id   ON public.conversations (brand_id);
CREATE INDEX idx_conversations_app_id     ON public.conversations (application_id);
CREATE INDEX idx_conversations_created    ON public.conversations (created_at DESC);

CREATE INDEX idx_messages_conversation_id ON public.messages (conversation_id);
CREATE INDEX idx_messages_sender_id       ON public.messages (sender_id);
CREATE INDEX idx_messages_created         ON public.messages (created_at DESC);

-- 6. Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- 7. Notifications RLS policies
CREATE POLICY "notifications_select_own"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "notifications_update_own"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "notifications_insert_auth"
  ON public.notifications FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "notifications_delete_own"
  ON public.notifications FOR DELETE
  USING (auth.uid() = user_id);

-- 8. Conversations RLS policies
CREATE POLICY "conversations_select"
  ON public.conversations FOR SELECT
  USING (
    auth.uid() = creator_id
    OR EXISTS (
      SELECT 1 FROM public.brands b
      WHERE b.id = brand_id AND b.user_id = auth.uid()
    )
  );

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

-- 9. Messages RLS policies
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
