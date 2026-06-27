-- ============================================================
-- One-time admin bootstrap
-- Promotes a single user to super_admin by email.
-- Run this once in the Supabase SQL Editor (Dashboard > SQL Editor).
-- ============================================================

-- Preview the target user before modifying
SELECT id, email, raw_app_meta_data
FROM auth.users
WHERE email = 'elahimudassasr1@gmail.com';

-- Update: merge admin_role into existing app_metadata
UPDATE auth.users
SET raw_app_meta_data = raw_app_meta_data || '{"admin_role": "super_admin"}'::jsonb
WHERE email = 'elahimudassasr1@gmail.com';

-- Confirm the result
SELECT id, email, raw_app_meta_data
FROM auth.users
WHERE email = 'elahimudassasr1@gmail.com';
