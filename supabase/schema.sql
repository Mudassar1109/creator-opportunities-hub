-- ============================================================
-- Creator Opportunities Hub — Supabase Database Schema
-- Production-ready with RLS, indexes, triggers, and policies
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. CUSTOM ENUM TYPES
-- ============================================================

CREATE TYPE public.opportunity_type AS ENUM (
  'brand_deal',
  'affiliate_program',
  'sponsorship',
  'ugc',
  'creator_job',
  'collaboration',
  'ambassador_program',
  'remote_work',
  'paid_campaign'
);

CREATE TYPE public.opportunity_status AS ENUM (
  'draft',
  'active',
  'paused',
  'closed',
  'expired'
);

CREATE TYPE public.application_status AS ENUM (
  'pending',
  'under_review',
  'accepted',
  'rejected',
  'withdrawn'
);

CREATE TYPE public.budget_type AS ENUM (
  'fixed',
  'range',
  'commission',
  'hourly',
  'monthly',
  'negotiable'
);

CREATE TYPE public.location_type AS ENUM (
  'remote',
  'on_site',
  'hybrid'
);

CREATE TYPE public.company_size AS ENUM (
  'startup',
  'small',
  'medium',
  'large',
  'enterprise'
);

CREATE TYPE public.user_role AS ENUM (
  'creator',
  'brand'
);

CREATE TYPE public.notification_type AS ENUM (
  'application_submitted',
  'application_reviewed',
  'application_accepted',
  'application_rejected',
  'message_received'
);

-- ============================================================
-- 2. UTILITY — updated_at trigger
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ============================================================
-- 3. TABLES
-- ============================================================

-- ──────────────────────────────────────────────
-- 3a. PROFILES (creators — extends auth.users)
-- ──────────────────────────────────────────────

CREATE TABLE public.profiles (
  id            uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name     text NOT NULL,
  username      text UNIQUE NOT NULL,
  email         text NOT NULL,
  avatar_url    text,
  bio           text CHECK (char_length(bio) <= 2000),
  headline      text CHECK (char_length(headline) <= 200),
  platforms     text[] DEFAULT '{}',            -- {"youtube","tiktok","instagram",...}
  niches        text[] DEFAULT '{}',            -- {"fitness","tech","beauty",...}
  follower_count int DEFAULT 0 CHECK (follower_count >= 0),
  country       text,
  city          text,
  website       text,
  youtube_url   text,
  tiktok_url    text,
  instagram_url text,
  twitter_url   text,
  linkedin_url  text,
  role          public.user_role DEFAULT 'creator',
  is_verified   boolean DEFAULT false,
  is_public     boolean DEFAULT true,
  created_at    timestamptz DEFAULT now() NOT NULL,
  updated_at    timestamptz DEFAULT now() NOT NULL
);

COMMENT ON TABLE public.profiles IS 'Creator profiles linked to auth.users';

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ──────────────────────────────────────────────
-- 3b. BRANDS
-- ──────────────────────────────────────────────

CREATE TABLE public.brands (
  id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name    text NOT NULL,
  slug            text UNIQUE NOT NULL,
  logo_url        text,
  website         text NOT NULL,
  industry        text,
  description     text CHECK (char_length(description) <= 5000),
  company_size    public.company_size DEFAULT 'small',
  country         text,
  city            text,
  contact_email   text,
  contact_name    text,
  social_twitter  text,
  social_linkedin text,
  social_instagram text,
  is_verified     boolean DEFAULT false,
  is_active       boolean DEFAULT true,
  created_at      timestamptz DEFAULT now() NOT NULL,
  updated_at      timestamptz DEFAULT now() NOT NULL
);

COMMENT ON TABLE public.brands IS 'Brand / company profiles posting opportunities';

CREATE TRIGGER set_brands_updated_at
  BEFORE UPDATE ON public.brands
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ──────────────────────────────────────────────
-- 3c. CATEGORIES
-- ──────────────────────────────────────────────

CREATE TABLE public.categories (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        text UNIQUE NOT NULL,
  slug        text UNIQUE NOT NULL,
  description text,
  icon        text,            -- emoji or icon identifier
  color       text,            -- hex color for UI
  sort_order  int DEFAULT 0,
  is_active   boolean DEFAULT true,
  created_at  timestamptz DEFAULT now() NOT NULL,
  updated_at  timestamptz DEFAULT now() NOT NULL
);

COMMENT ON TABLE public.categories IS 'Opportunity categories (brand deals, affiliate, etc.)';

CREATE TRIGGER set_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Seed default categories
INSERT INTO public.categories (name, slug, description, icon, color, sort_order) VALUES
  ('Brand Deals',        'brand-deals',        'Paid partnerships and brand deals',           '🤝', '#3b82f6', 1),
  ('Affiliate Programs', 'affiliate-programs', 'Commission-based affiliate opportunities',    '🔗', '#8b5cf6', 2),
  ('Sponsorships',       'sponsorships',       'Sponsored content and campaigns',              '🎯', '#6366f1', 3),
  ('UGC Jobs',           'ugc-jobs',           'User-generated content creation gigs',         '🎬', '#ec4899', 4),
  ('Creator Jobs',       'creator-jobs',       'Full-time and contract creator roles',         '💼', '#10b981', 5),
  ('Collaborations',     'collaborations',     'Creator-to-creator collaboration requests',    '🤜', '#f59e0b', 6),
  ('Ambassador Programs','ambassador-programs','Long-term brand ambassador opportunities',     '⭐', '#f43f5e', 7),
  ('Remote Work',        'remote-work',        'Remote creator and freelance work',            '🌍', '#06b6d4', 8);

-- ──────────────────────────────────────────────
-- 3d. OPPORTUNITIES
-- ──────────────────────────────────────────────

CREATE TABLE public.opportunities (
  id                  uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id            uuid NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
  created_by          uuid NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  title               text NOT NULL CHECK (char_length(title) >= 5 AND char_length(title) <= 200),
  slug                text UNIQUE NOT NULL,
  description         text NOT NULL CHECK (char_length(description) >= 20),
  opportunity_type    public.opportunity_type NOT NULL,
  budget_min          numeric(12,2),
  budget_max          numeric(12,2),
  budget_type         public.budget_type DEFAULT 'negotiable',
  currency            text DEFAULT 'USD' CHECK (char_length(currency) = 3),
  country             text,
  location_type       public.location_type DEFAULT 'remote',
  requirements        text CHECK (char_length(requirements) <= 5000),
  deliverables        text CHECK (char_length(deliverables) <= 5000),
  deadline            timestamptz,
  min_followers       int DEFAULT 0 CHECK (min_followers >= 0),
  platforms           text[] DEFAULT '{}',
  niches              text[] DEFAULT '{}',
  status              public.opportunity_status DEFAULT 'draft',
  is_featured         boolean DEFAULT false,
  is_remote           boolean DEFAULT true,
  views_count         int DEFAULT 0 CHECK (views_count >= 0),
  applications_count  int DEFAULT 0 CHECK (applications_count >= 0),
  published_at        timestamptz,
  expires_at          timestamptz,
  created_at          timestamptz DEFAULT now() NOT NULL,
  updated_at          timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT budget_range_valid CHECK (budget_min IS NULL OR budget_max IS NULL OR budget_min <= budget_max),
  CONSTRAINT deadline_future CHECK (deadline IS NULL OR deadline > now())
);

COMMENT ON TABLE public.opportunities IS 'All creator opportunities posted by brands';

CREATE TRIGGER set_opportunities_updated_at
  BEFORE UPDATE ON public.opportunities
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ──────────────────────────────────────────────
-- 3e. OPPORTUNITY ↔ CATEGORY (many-to-many)
-- ──────────────────────────────────────────────

CREATE TABLE public.opportunity_categories (
  opportunity_id uuid NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
  category_id    uuid NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  PRIMARY KEY (opportunity_id, category_id)
);

COMMENT ON TABLE public.opportunity_categories IS 'Junction: opportunities ↔ categories';

-- ──────────────────────────────────────────────
-- 3f. APPLICATIONS
-- ──────────────────────────────────────────────

CREATE TABLE public.applications (
  id               uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  opportunity_id   uuid NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
  creator_id       uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  cover_letter     text CHECK (char_length(cover_letter) <= 5000),
  portfolio_links  text[] DEFAULT '{}',
  proposed_budget  numeric(12,2),
  currency         text DEFAULT 'USD' CHECK (char_length(currency) = 3),
  status           public.application_status DEFAULT 'pending',
  notes            text,                            -- private notes from brand
  reviewed_at      timestamptz,
  reviewed_by      uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at       timestamptz DEFAULT now() NOT NULL,
  updated_at       timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT unique_application UNIQUE (opportunity_id, creator_id)
);

COMMENT ON TABLE public.applications IS 'Creator applications to opportunities';

CREATE TRIGGER set_applications_updated_at
  BEFORE UPDATE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ──────────────────────────────────────────────
-- 3g. NOTIFICATIONS
-- ──────────────────────────────────────────────

CREATE TABLE public.notifications (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title       text NOT NULL,
  message     text NOT NULL,
  type        public.notification_type NOT NULL,
  is_read     boolean DEFAULT false,
  link        text,                            -- optional deep link (e.g. /dashboard/applications)
  created_at  timestamptz DEFAULT now() NOT NULL
);

COMMENT ON TABLE public.notifications IS 'User notifications triggered by application and messaging events';

-- ──────────────────────────────────────────────
-- 3h. CONVERSATIONS
-- ──────────────────────────────────────────────

CREATE TABLE public.conversations (
  id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id  uuid NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  creator_id      uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  brand_id        uuid NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
  created_at      timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT unique_conversation_per_application UNIQUE (application_id)
);

COMMENT ON TABLE public.conversations IS 'Chat conversations created when an application is accepted';

-- ──────────────────────────────────────────────
-- 3i. MESSAGES
-- ──────────────────────────────────────────────

CREATE TABLE public.messages (
  id               uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id  uuid NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id        uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message          text NOT NULL CHECK (char_length(message) <= 5000),
  created_at       timestamptz DEFAULT now() NOT NULL
);

COMMENT ON TABLE public.messages IS 'Individual chat messages within a conversation';

-- ============================================================
-- 4. INDEXES
-- ============================================================

-- Profiles
CREATE INDEX idx_profiles_username       ON public.profiles (username);
CREATE INDEX idx_profiles_country        ON public.profiles (country) WHERE country IS NOT NULL;
CREATE INDEX idx_profiles_is_public      ON public.profiles (is_public) WHERE is_public = true;
CREATE INDEX idx_profiles_niches         ON public.profiles USING gin (niches);
CREATE INDEX idx_profiles_platforms      ON public.profiles USING gin (platforms);
CREATE INDEX idx_profiles_full_name      ON public.profiles (lower(full_name));

-- Brands
CREATE INDEX idx_brands_user_id     ON public.brands (user_id);
CREATE INDEX idx_brands_slug        ON public.brands (slug);
CREATE INDEX idx_brands_industry    ON public.brands (industry) WHERE industry IS NOT NULL;
CREATE INDEX idx_brands_country     ON public.brands (country) WHERE country IS NOT NULL;
CREATE INDEX idx_brands_is_active   ON public.brands (is_active) WHERE is_active = true;

-- Categories
CREATE INDEX idx_categories_slug     ON public.categories (slug);
CREATE INDEX idx_categories_active   ON public.categories (is_active) WHERE is_active = true;
CREATE INDEX idx_categories_sort     ON public.categories (sort_order);

-- Opportunities
CREATE INDEX idx_opportunities_brand_id       ON public.opportunities (brand_id);
CREATE INDEX idx_opportunities_created_by     ON public.opportunities (created_by);
CREATE INDEX idx_opportunities_status         ON public.opportunities (status);
CREATE INDEX idx_opportunities_type           ON public.opportunities (opportunity_type);
CREATE INDEX idx_opportunities_country        ON public.opportunities (country) WHERE country IS NOT NULL;
CREATE INDEX idx_opportunities_budget_type    ON public.opportunities (budget_type);
CREATE INDEX idx_opportunities_location       ON public.opportunities (location_type);
CREATE INDEX idx_opportunities_is_featured    ON public.opportunities (is_featured) WHERE is_featured = true;
CREATE INDEX idx_opportunities_published      ON public.opportunities (published_at DESC) WHERE status = 'active';
CREATE INDEX idx_opportunities_platforms      ON public.opportunities USING gin (platforms);
CREATE INDEX idx_opportunities_niches         ON public.opportunities USING gin (niches);
CREATE INDEX idx_opportunities_title         ON public.opportunities (lower(title));
CREATE INDEX idx_opportunities_slug           ON public.opportunities (slug);
CREATE INDEX idx_opportunities_deadline       ON public.opportunities (deadline) WHERE deadline IS NOT NULL;

-- Composite: active + type + published
CREATE INDEX idx_opportunities_active_type
  ON public.opportunities (opportunity_type, published_at DESC)
  WHERE status = 'active';

-- Applications
CREATE INDEX idx_applications_opportunity_id ON public.applications (opportunity_id);
CREATE INDEX idx_applications_creator_id     ON public.applications (creator_id);
CREATE INDEX idx_applications_status         ON public.applications (status);
CREATE INDEX idx_applications_created        ON public.applications (created_at DESC);
CREATE INDEX idx_applications_unique         ON public.applications (opportunity_id, creator_id);

-- Notifications
CREATE INDEX idx_notifications_user_id    ON public.notifications (user_id);
CREATE INDEX idx_notifications_unread     ON public.notifications (user_id, is_read) WHERE is_read = false;
CREATE INDEX idx_notifications_created    ON public.notifications (created_at DESC);
CREATE INDEX idx_notifications_type       ON public.notifications (type);

-- Conversations
CREATE INDEX idx_conversations_creator_id ON public.conversations (creator_id);
CREATE INDEX idx_conversations_brand_id   ON public.conversations (brand_id);
CREATE INDEX idx_conversations_app_id     ON public.conversations (application_id);
CREATE INDEX idx_conversations_created    ON public.conversations (created_at DESC);

-- Messages
CREATE INDEX idx_messages_conversation_id ON public.messages (conversation_id);
CREATE INDEX idx_messages_sender_id       ON public.messages (sender_id);
CREATE INDEX idx_messages_created         ON public.messages (created_at DESC);

-- ============================================================
-- 5. AUTO-INCREMENT applications_count TRIGGER
-- ============================================================

CREATE OR REPLACE FUNCTION public.increment_applications_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.opportunities
  SET applications_count = applications_count + 1
  WHERE id = NEW.opportunity_id;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.decrement_applications_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.opportunities
  SET applications_count = GREATEST(applications_count - 1, 0)
  WHERE id = OLD.opportunity_id;
  RETURN OLD;
END;
$$;

CREATE TRIGGER trg_app_insert
  AFTER INSERT ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.increment_applications_count();

CREATE TRIGGER trg_app_delete
  AFTER DELETE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.decrement_applications_count();

-- ============================================================
-- 6. AUTO-CREATE PROFILE ON SIGNUP
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, username, avatar_url, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'username', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data ->> 'avatar_url',
    COALESCE(
      (NEW.raw_user_meta_data ->> 'role')::public.user_role,
      'creator'::public.user_role
    )
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 7. ROW LEVEL SECURITY
-- ============================================================

-- ─── PROFILES ───────────────────────────────

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Public profiles are readable by anyone
CREATE POLICY "profiles_select_public"
  ON public.profiles FOR SELECT
  USING (is_public = true OR auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "profiles_insert_own"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Users can delete their own profile
CREATE POLICY "profiles_delete_own"
  ON public.profiles FOR DELETE
  USING (auth.uid() = id);

-- ─── BRANDS ─────────────────────────────────

ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;

-- Anyone can read active brands
CREATE POLICY "brands_select_active"
  ON public.brands FOR SELECT
  USING (is_active = true OR auth.uid() = user_id);

-- Authenticated users can create brands
CREATE POLICY "brands_insert_auth"
  ON public.brands FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Brand owners can update their brands
CREATE POLICY "brands_update_owner"
  ON public.brands FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Brand owners can delete their brands
CREATE POLICY "brands_delete_owner"
  ON public.brands FOR DELETE
  USING (auth.uid() = user_id);

-- ─── CATEGORIES ─────────────────────────────

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Everyone can read active categories
CREATE POLICY "categories_select_active"
  ON public.categories FOR SELECT
  USING (is_active = true);

-- Only service_role can manage categories (admin via backend)
CREATE POLICY "categories_admin_manage"
  ON public.categories FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ─── OPPORTUNITIES ──────────────────────────

ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;

-- Anyone can read active/published opportunities
CREATE POLICY "opportunities_select_active"
  ON public.opportunities FOR SELECT
  USING (
    status = 'active'
    OR auth.uid() = created_by
    OR auth.uid() IN (
      SELECT b.user_id FROM public.brands b WHERE b.id = brand_id
    )
  );

-- Authenticated users can create opportunities (if they own a brand)
CREATE POLICY "opportunities_insert_auth"
  ON public.opportunities FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = created_by
    AND auth.uid() IN (
      SELECT b.user_id FROM public.brands b WHERE b.id = brand_id
    )
  );

-- Brand owners can update their opportunities
CREATE POLICY "opportunities_update_owner"
  ON public.opportunities FOR UPDATE
  USING (
    auth.uid() = created_by
    OR auth.uid() IN (
      SELECT b.user_id FROM public.brands b WHERE b.id = brand_id
    )
  )
  WITH CHECK (
    auth.uid() = created_by
    OR auth.uid() IN (
      SELECT b.user_id FROM public.brands b WHERE b.id = brand_id
    )
  );

-- Brand owners can delete their opportunities
CREATE POLICY "opportunities_delete_owner"
  ON public.opportunities FOR DELETE
  USING (
    auth.uid() = created_by
    OR auth.uid() IN (
      SELECT b.user_id FROM public.brands b WHERE b.id = brand_id
    )
  );

-- ─── OPPORTUNITY_CATEGORIES ─────────────────

ALTER TABLE public.opportunity_categories ENABLE ROW LEVEL SECURITY;

-- Anyone can read junction records for active opportunities
CREATE POLICY "opp_categories_select"
  ON public.opportunity_categories FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.opportunities o
      WHERE o.id = opportunity_id AND o.status = 'active'
    )
    OR EXISTS (
      SELECT 1 FROM public.opportunities o
      WHERE o.id = opportunity_id AND o.created_by = auth.uid()
    )
  );

-- Only opportunity owners can manage categories
CREATE POLICY "opp_categories_manage_owner"
  ON public.opportunity_categories FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.opportunities o
      WHERE o.id = opportunity_id AND (
        o.created_by = auth.uid()
        OR auth.uid() IN (SELECT b.user_id FROM public.brands b WHERE b.id = o.brand_id)
      )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.opportunities o
      WHERE o.id = opportunity_id AND (
        o.created_by = auth.uid()
        OR auth.uid() IN (SELECT b.user_id FROM public.brands b WHERE b.id = o.brand_id)
      )
    )
  );

-- ─── APPLICATIONS ───────────────────────────

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Creators see their own applications; brand owners see applications to their opportunities
CREATE POLICY "applications_select"
  ON public.applications FOR SELECT
  USING (
    auth.uid() = creator_id
    OR EXISTS (
      SELECT 1 FROM public.opportunities o
      JOIN public.brands b ON b.id = o.brand_id
      WHERE o.id = opportunity_id AND b.user_id = auth.uid()
    )
  );

-- Creators can apply (insert) to opportunities
CREATE POLICY "applications_insert_creator"
  ON public.applications FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = creator_id);

-- Creators can update (withdraw) their own applications
CREATE POLICY "applications_update_creator"
  ON public.applications FOR UPDATE
  USING (auth.uid() = creator_id)
  WITH CHECK (auth.uid() = creator_id);

-- Brand owners can update application status for their opportunities
CREATE POLICY "applications_update_brand"
  ON public.applications FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.opportunities o
      JOIN public.brands b ON b.id = o.brand_id
      WHERE o.id = opportunity_id AND b.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.opportunities o
      JOIN public.brands b ON b.id = o.brand_id
      WHERE o.id = opportunity_id AND b.user_id = auth.uid()
    )
  );

-- Creators can delete (withdraw) their own applications
CREATE POLICY "applications_delete_creator"
  ON public.applications FOR DELETE
  USING (auth.uid() = creator_id);

-- ─── NOTIFICATIONS ─────────────────────────

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- SECURITY DEFINER function for creating notifications for other users
-- This allows server actions to notify users about application status changes
-- while bypassing RLS that would otherwise block cross-user inserts
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

-- Users can only read their own notifications
CREATE POLICY "notifications_select_own"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

-- Users can update (mark read) their own notifications
CREATE POLICY "notifications_update_own"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- NOTE: Direct INSERT policy removed - use create_notification() function instead
-- This enforces that notifications can only be created via the SECURITY DEFINER function
-- which validates authentication and allows cross-user notification delivery

-- Users can delete their own notifications
CREATE POLICY "notifications_delete_own"
  ON public.notifications FOR DELETE
  USING (auth.uid() = user_id);

-- ─── CONVERSATIONS ─────────────────────────

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- Creator sees conversations where they are the creator
-- Brand user sees conversations where they own the brand
CREATE POLICY "conversations_select"
  ON public.conversations FOR SELECT
  USING (
    auth.uid() = creator_id
    OR EXISTS (
      SELECT 1 FROM public.brands b
      WHERE b.id = brand_id AND b.user_id = auth.uid()
    )
  );

-- Conversations are created by server actions (brand accepts application)
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

-- ─── MESSAGES ──────────────────────────────

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Users can read messages in conversations they belong to
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

-- Users in the conversation can send messages
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
-- 8. HELPER VIEWS
-- ============================================================

-- Featured active opportunities for the landing page
CREATE OR REPLACE VIEW public.featured_opportunities AS
SELECT
  o.*,
  b.company_name  AS brand_name,
  b.logo_url      AS brand_logo,
  b.is_verified   AS brand_verified,
  c_agg.names     AS category_names
FROM public.opportunities o
JOIN public.brands b ON b.id = o.brand_id
LEFT JOIN LATERAL (
  SELECT array_agg(c.name) AS names
  FROM public.opportunity_categories oc
  JOIN public.categories c ON c.id = oc.category_id
  WHERE oc.opportunity_id = o.id
) c_agg ON true
WHERE o.status = 'active'
  AND o.is_featured = true
  AND o.published_at IS NOT NULL
ORDER BY o.published_at DESC;

-- Opportunity detail with brand + categories
CREATE OR REPLACE VIEW public.opportunity_details AS
SELECT
  o.*,
  b.company_name   AS brand_name,
  b.logo_url       AS brand_logo,
  b.website        AS brand_website,
  b.is_verified    AS brand_verified,
  b.contact_email  AS brand_contact_email,
  c_agg.category_ids,
  c_agg.category_names
FROM public.opportunities o
JOIN public.brands b ON b.id = o.brand_id
LEFT JOIN LATERAL (
  SELECT
    array_agg(c.id)   AS category_ids,
    array_agg(c.name)  AS category_names
  FROM public.opportunity_categories oc
  JOIN public.categories c ON c.id = oc.category_id
  WHERE oc.opportunity_id = o.id
) c_agg ON true;

-- ============================================================
-- 9. STORAGE BUCKETS (for avatars, logos, attachments)
-- ============================================================

-- Create public avatars bucket for profile photos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  5242880,  -- 5 MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Create public brand-logos bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'brand-logos',
  'brand-logos',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO NOTHING;

-- Create private portfolios bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('portfolios', 'portfolios', false, 10485760)  -- 10 MB
ON CONFLICT (id) DO NOTHING;

-- ── Storage RLS: avatars bucket ──────────────────────────────

-- Drop existing policies (safe to re-run)
DROP POLICY IF EXISTS "avatars_select_public" ON storage.objects;
DROP POLICY IF EXISTS "avatars_insert_own" ON storage.objects;
DROP POLICY IF EXISTS "avatars_update_own" ON storage.objects;
DROP POLICY IF EXISTS "avatars_delete_own" ON storage.objects;

-- SELECT: anyone can view avatars (public bucket)
CREATE POLICY "avatars_select_public"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

-- INSERT: authenticated users can upload to their own folder
-- Path format: {user_id}/avatar.{ext}
CREATE POLICY "avatars_insert_own"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- UPDATE: authenticated users can overwrite files in their own folder
-- Required for upsert: true in supabase-js upload()
CREATE POLICY "avatars_update_own"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  )
  WITH CHECK (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- DELETE: authenticated users can remove files from their own folder
CREATE POLICY "avatars_delete_own"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- ============================================================
-- 10. NEW TABLES (Phase 12)
-- ============================================================

-- ──────────────────────────────────────────────
-- 10a. REPORTS
-- ──────────────────────────────────────────────

CREATE TABLE public.reports (
  id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reported_type   text NOT NULL CHECK (reported_type IN ('user', 'brand', 'opportunity', 'message')),
  reported_id     uuid NOT NULL,
  report_type     text NOT NULL CHECK (report_type IN ('spam', 'harassment', 'fake', 'violation', 'other')),
  reason          text NOT NULL CHECK (char_length(reason) <= 2000),
  status          text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'resolved', 'dismissed')),
  reviewed_by     uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at     timestamptz,
  created_at      timestamptz DEFAULT now() NOT NULL,
  updated_at      timestamptz DEFAULT now() NOT NULL
);

COMMENT ON TABLE public.reports IS 'User-generated reports for moderation';

CREATE TRIGGER set_reports_updated_at
  BEFORE UPDATE ON public.reports
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX idx_reports_status       ON public.reports (status);
CREATE INDEX idx_reports_reporter_id  ON public.reports (reporter_id);
CREATE INDEX idx_reports_reported_type ON public.reports (reported_type);
CREATE INDEX idx_reports_created      ON public.reports (created_at DESC);

ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Admins (via service_role) can read all reports
CREATE POLICY "reports_select_admin"
  ON public.reports FOR SELECT
  TO service_role
  USING (true);

-- Authenticated users can create reports
CREATE POLICY "reports_insert_auth"
  ON public.reports FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = reporter_id);

-- Service role can update reports (admin moderation)
CREATE POLICY "reports_update_service"
  ON public.reports FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ──────────────────────────────────────────────
-- 10b. PLATFORM SETTINGS
-- ──────────────────────────────────────────────

CREATE TABLE public.platform_settings (
  id                        uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_name                 text NOT NULL DEFAULT 'Creator Opportunities Hub',
  logo_url                  text DEFAULT '',
  favicon_url               text DEFAULT '',
  support_email             text DEFAULT '',
  phone                     text DEFAULT '',
  address                   text DEFAULT '',
  creator_registration_open boolean DEFAULT true,
  brand_registration_open   boolean DEFAULT true,
  maintenance_mode          boolean DEFAULT false,
  admin_only_mode           boolean DEFAULT false,
  reply_email               text DEFAULT '',
  notification_email        text DEFAULT '',
  facebook                  text DEFAULT '',
  instagram                 text DEFAULT '',
  linkedin                  text DEFAULT '',
  x                         text DEFAULT '',
  youtube                   text DEFAULT '',
  meta_title                text DEFAULT '',
  meta_description          text DEFAULT '',
  keywords                  text DEFAULT '',
  og_image                  text DEFAULT '',
  referral_enabled          boolean DEFAULT true,
  blog_enabled              boolean DEFAULT false,
  notifications_enabled     boolean DEFAULT true,
  updated_at                timestamptz DEFAULT now() NOT NULL,
  updated_by                uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

COMMENT ON TABLE public.platform_settings IS 'Singleton table for platform-wide settings';

CREATE TRIGGER set_platform_settings_updated_at
  BEFORE UPDATE ON public.platform_settings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

-- Service role can read settings
CREATE POLICY "settings_select_service"
  ON public.platform_settings FOR SELECT
  TO service_role
  USING (true);

-- Service role can update settings
CREATE POLICY "settings_update_service"
  ON public.platform_settings FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Seed default settings row
INSERT INTO public.platform_settings (id, site_name, support_email, reply_email, notification_email)
VALUES (uuid_generate_v4(), 'Creator Opportunities Hub',
  'support@creatoropportunitieshub.com',
  'noreply@creatoropportunitieshub.com',
  'notifications@creatoropportunitieshub.com')
ON CONFLICT DO NOTHING;

-- ──────────────────────────────────────────────
-- 10c. ANALYTICS TIME-SERIES
-- ──────────────────────────────────────────────

CREATE TABLE public.analytics_events (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type  text NOT NULL,
  event_data  jsonb DEFAULT '{}',
  user_id     uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at  timestamptz DEFAULT now() NOT NULL
);

COMMENT ON TABLE public.analytics_events IS 'Time-series analytics events for dashboard charts';

CREATE INDEX idx_analytics_events_type    ON public.analytics_events (event_type);
CREATE INDEX idx_analytics_events_created ON public.analytics_events (created_at DESC);
CREATE INDEX idx_analytics_events_date    ON public.analytics_events (date_trunc('day', created_at));

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "analytics_select_service"
  ON public.analytics_events FOR SELECT
  TO service_role
  USING (true);

CREATE POLICY "analytics_insert_auth"
  ON public.analytics_events FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- ──────────────────────────────────────────────
-- 10d. REFERRAL SYSTEM
-- ──────────────────────────────────────────────

CREATE TABLE public.referral_codes (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  code        text UNIQUE NOT NULL CHECK (char_length(code) >= 4),
  is_active   boolean DEFAULT true,
  created_at  timestamptz DEFAULT now() NOT NULL,
  updated_at  timestamptz DEFAULT now() NOT NULL
);

COMMENT ON TABLE public.referral_codes IS 'Unique referral codes per user';

CREATE TRIGGER set_referral_codes_updated_at
  BEFORE UPDATE ON public.referral_codes
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX idx_referral_codes_user ON public.referral_codes (user_id);
CREATE INDEX idx_referral_codes_code ON public.referral_codes (code);

ALTER TABLE public.referral_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ref_codes_select_own"
  ON public.referral_codes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "ref_codes_insert_own"
  ON public.referral_codes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.referrals (
  id                  uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id         uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_id         uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referral_code_id    uuid NOT NULL REFERENCES public.referral_codes(id) ON DELETE CASCADE,
  status              text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed')),
  xp_earned           int DEFAULT 0 CHECK (xp_earned >= 0),
  completed_at        timestamptz,
  created_at          timestamptz DEFAULT now() NOT NULL,
  updated_at          timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT unique_referral UNIQUE (referrer_id, referred_id)
);

COMMENT ON TABLE public.referrals IS 'Referral tracking records';

CREATE TRIGGER set_referrals_updated_at
  BEFORE UPDATE ON public.referrals
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX idx_referrals_referrer  ON public.referrals (referrer_id);
CREATE INDEX idx_referrals_referred  ON public.referrals (referred_id);
CREATE INDEX idx_referrals_status    ON public.referrals (status);

ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "referrals_select_own"
  ON public.referrals FOR SELECT
  USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

CREATE POLICY "referrals_insert_auth"
  ON public.referrals FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = referrer_id);

CREATE TABLE public.xp_transactions (
  id            uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  xp_amount     int NOT NULL CHECK (xp_amount != 0),
  reason        text NOT NULL,
  referral_id   uuid REFERENCES public.referrals(id) ON DELETE SET NULL,
  created_at    timestamptz DEFAULT now() NOT NULL
);

COMMENT ON TABLE public.xp_transactions IS 'XP earn/spend ledger for referral rewards';

CREATE INDEX idx_xp_transactions_user ON public.xp_transactions (user_id);
CREATE INDEX idx_xp_transactions_created ON public.xp_transactions (created_at DESC);

ALTER TABLE public.xp_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "xp_select_own"
  ON public.xp_transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE TABLE public.achievements (
  id            uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          text UNIQUE NOT NULL,
  description   text NOT NULL,
  icon          text DEFAULT '',
  target_count  int NOT NULL CHECK (target_count > 0),
  xp_reward     int NOT NULL DEFAULT 0 CHECK (xp_reward >= 0),
  created_at    timestamptz DEFAULT now() NOT NULL
);

COMMENT ON TABLE public.achievements IS 'Achievement definitions';

ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "achievements_select_all"
  ON public.achievements FOR SELECT
  TO authenticated
  USING (true);

-- Seed achievements
INSERT INTO public.achievements (name, description, icon, target_count, xp_reward) VALUES
  ('First Referral',    'Refer your first user',         '🎯', 1,   100),
  ('Invite 10 Users',   'Refer 10 users to the platform','🌟', 10,  250),
  ('Invite 25 Users',   'Refer 25 users to the platform','🔥', 25,  500),
  ('Invite 50 Users',   'Refer 50 users to the platform','💫', 50,  1000),
  ('Invite 100 Users',  'Refer 100 users to the platform','🏆', 100, 2500),
  ('Invite 500 Users',  'Refer 500 users to the platform','👑', 500, 10000)
ON CONFLICT (name) DO NOTHING;

CREATE TABLE public.user_achievements (
  id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id  uuid NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  earned_at       timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT unique_user_achievement UNIQUE (user_id, achievement_id)
);

COMMENT ON TABLE public.user_achievements IS 'Junction: which users earned which achievements';

ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_achievements_select_own"
  ON public.user_achievements FOR SELECT
  USING (auth.uid() = user_id);

CREATE TABLE public.leaderboard (
  id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total_xp        int DEFAULT 0 CHECK (total_xp >= 0),
  successful_refs int DEFAULT 0 CHECK (successful_refs >= 0),
  rank            int,
  updated_at      timestamptz DEFAULT now() NOT NULL
);

COMMENT ON TABLE public.leaderboard IS 'Leaderboard snapshot for referral rankings';

CREATE TRIGGER set_leaderboard_updated_at
  BEFORE UPDATE ON public.leaderboard
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE UNIQUE INDEX idx_leaderboard_user ON public.leaderboard (user_id);
CREATE INDEX idx_leaderboard_rank ON public.leaderboard (rank);

ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;

CREATE POLICY "leaderboard_select_all"
  ON public.leaderboard FOR SELECT
  TO authenticated
  USING (true);

-- ============================================================
-- 11. USEFUL FUNCTIONS
-- ============================================================

-- Search opportunities by keyword (ILIKE pattern matching)
CREATE OR REPLACE FUNCTION public.search_opportunities(query text, limit_count int DEFAULT 20)
RETURNS SETOF public.opportunities
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT *
  FROM public.opportunities
  WHERE status = 'active'
    AND (
      title ILIKE '%' || query || '%'
      OR description ILIKE '%' || query || '%'
    )
  ORDER BY
    CASE WHEN title ILIKE '%' || query || '%' THEN 0 ELSE 1 END,
    published_at DESC NULLS LAST
  LIMIT limit_count;
$$;

-- Get opportunities by category slug
CREATE OR REPLACE FUNCTION public.opportunities_by_category(cat_slug text, limit_count int DEFAULT 20)
RETURNS SETOF public.opportunity_details
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT od.*
  FROM public.opportunity_details od
  JOIN public.opportunity_categories oc ON oc.opportunity_id = od.id
  JOIN public.categories c ON c.id = oc.category_id
  WHERE c.slug = cat_slug
    AND od.status = 'active'
    AND od.published_at IS NOT NULL
  ORDER BY od.published_at DESC
  LIMIT limit_count;
$$;
