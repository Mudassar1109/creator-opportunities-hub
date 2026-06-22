-- ============================================================
-- Migration: Add brand owner UPDATE policy on applications
-- 
-- Problem: Brand owners could NOT update application status
-- (accept/reject/review) because the only UPDATE RLS policy
-- restricted updates to auth.uid() = creator_id (creator only).
--
-- Fix: Add a new UPDATE policy allowing the brand owner
-- (user who owns the brand linked to the opportunity)
-- to update applications for their opportunities.
--
-- Run this in Supabase SQL Editor or via: supabase db push
-- ============================================================

-- Safety: drop if it already exists (idempotent)
DROP POLICY IF EXISTS "applications_update_brand" ON public.applications;

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
