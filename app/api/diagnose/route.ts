/**
 * Diagnostic endpoint — tests all database queries used by the opportunities system.
 * Visit /api/diagnose to see what's working and what's broken.
 * DELETE THIS FILE after debugging.
 */
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const results: Record<string, unknown> = {};
  const supabase = await createClient();

  // 1. Test: categories table
  const { data: categories, error: catErr } = await supabase
    .from("categories")
    .select("id, name, slug, is_active")
    .eq("is_active", true)
    .limit(20);
  results.categories = { count: categories?.length ?? 0, error: catErr?.message ?? null, data: categories };

  // 2. Test: opportunities table (all statuses)
  const { data: allOpps, error: oppErr } = await supabase
    .from("opportunities")
    .select("id, title, slug, status, published_at, brand_id")
    .limit(20);
  results.opportunities_all = { count: allOpps?.length ?? 0, error: oppErr?.message ?? null, data: allOpps };

  // 3. Test: opportunities table (active only)
  const { data: activeOpps, error: activeErr } = await supabase
    .from("opportunities")
    .select("id, title, slug, status, published_at")
    .eq("status", "active")
    .limit(20);
  results.opportunities_active = { count: activeOpps?.length ?? 0, error: activeErr?.message ?? null, data: activeOpps };

  // 4. Test: brands table
  const { data: brands, error: brandErr } = await supabase
    .from("brands")
    .select("id, company_name, slug, is_active, user_id")
    .limit(20);
  results.brands = { count: brands?.length ?? 0, error: brandErr?.message ?? null, data: brands };

  // 5. Test: opportunity_details view
  const { data: details, error: detailsErr } = await supabase
    .from("opportunity_details")
    .select("*")
    .limit(5);
  results.opportunity_details_view = { count: details?.length ?? 0, error: detailsErr?.message ?? null, data: details?.slice(0, 2) };

  // 6. Test: featured_opportunities view
  const { data: featured, error: featuredErr } = await supabase
    .from("featured_opportunities")
    .select("*")
    .limit(5);
  results.featured_opportunities_view = { count: featured?.length ?? 0, error: featuredErr?.message ?? null, data: featured?.slice(0, 2) };

  // 7. Test: applications table
  const { data: apps, error: appsErr } = await supabase
    .from("applications")
    .select("id, opportunity_id, creator_id, status, created_at")
    .limit(10);
  results.applications = { count: apps?.length ?? 0, error: appsErr?.message ?? null, data: apps };

  // 8. Test: opportunity_categories junction
  const { data: oppCats, error: oppCatsErr } = await supabase
    .from("opportunity_categories")
    .select("opportunity_id, category_id")
    .limit(10);
  results.opportunity_categories = { count: oppCats?.length ?? 0, error: oppCatsErr?.message ?? null, data: oppCats };

  // 9. Test: auth user
  const { data: { user }, error: userErr } = await supabase.auth.getUser();
  results.auth_user = { id: user?.id ?? null, email: user?.email ?? null, error: userErr?.message ?? null };

  // 10. Test: profiles
  const { data: profiles, error: profErr } = await supabase
    .from("profiles")
    .select("id, full_name, username, email")
    .limit(5);
  results.profiles = { count: profiles?.length ?? 0, error: profErr?.message ?? null, data: profiles };

  return NextResponse.json(results, { status: 200 });
}
