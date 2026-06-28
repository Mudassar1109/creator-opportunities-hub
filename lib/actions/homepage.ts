/**
 * Homepage Data Fetching
 * Server-side data fetching for the homepage with parallel queries
 */

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/database.types";

export interface HomepageStats {
  totalCreators: number;
  totalBrands: number;
  publishedOpportunities: number;
  totalApplications: number;
  verifiedBrands: number;
  applicationsToday: number;
}

export interface CategoryWithCount {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  color: string | null;
  count: number;
}

export interface OpportunityWithBrand {
  id: string;
  title: string;
  slug: string;
  opportunity_type: string;
  budget_min: number | null;
  budget_max: number | null;
  budget_type: string;
  currency: string;
  country: string | null;
  deadline: string | null;
  is_featured: boolean;
  applications_count: number;
  published_at: string | null;
  expires_at: string | null;
  brand: {
    id: string;
    company_name: string;
    logo_url: string | null;
    is_verified: boolean;
  };
  categories: {
    id: string;
    name: string;
    slug: string;
  }[];
}

export interface RecentCreator {
  id: string;
  full_name: string;
  username: string;
  avatar_url: string | null;
  follower_count: number;
  niches: string[];
  platforms: string[];
  is_verified: boolean;
}

export interface RecentBrand {
  id: string;
  company_name: string;
  logo_url: string | null;
  is_verified: boolean;
  industry: string | null;
}

/**
 * Fetch all homepage statistics in parallel
 */
export async function getHomepageStats(): Promise<HomepageStats> {
  const supabase = await createClient();

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [
    { count: creatorsCount },
    { count: brandsCount },
    { count: opportunitiesCount },
    { count: applicationsCount },
    { count: verifiedBrandsCount },
    { count: appsTodayCount },
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "creator"),
    supabase
      .from("brands")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true),
    supabase
      .from("opportunities")
      .select("*", { count: "exact", head: true })
      .eq("status", "active")
      .not("published_at", "is", null)
      .or("expires_at.is.null,expires_at.gt." + new Date().toISOString()),
    supabase
      .from("applications")
      .select("*", { count: "exact", head: true }),
    supabase
      .from("brands")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true)
      .eq("is_verified", true),
    supabase
      .from("applications")
      .select("*", { count: "exact", head: true })
      .gte("created_at", todayStart.toISOString()),
  ]);

  return {
    totalCreators: creatorsCount ?? 0,
    totalBrands: brandsCount ?? 0,
    publishedOpportunities: opportunitiesCount ?? 0,
    totalApplications: applicationsCount ?? 0,
    verifiedBrands: verifiedBrandsCount ?? 0,
    applicationsToday: appsTodayCount ?? 0,
  };
}

/**
 * Fetch featured opportunities (max 6, published, not expired, ordered by newest)
 */
export async function getFeaturedOpportunities(): Promise<OpportunityWithBrand[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("opportunities")
    .select(`
      id,
      title,
      slug,
      opportunity_type,
      budget_min,
      budget_max,
      budget_type,
      currency,
      country,
      deadline,
      is_featured,
      applications_count,
      published_at,
      expires_at,
      brand:brands(
        id,
        company_name,
        logo_url,
        is_verified
      ),
      categories:opportunity_categories(
        categories(
          id,
          name,
          slug
        )
      )
    `)
    .eq("status", "active")
    .not("published_at", "is", null)
    .or("expires_at.is.null,expires_at.gt." + new Date().toISOString())
    .order("is_featured", { ascending: false })
    .order("published_at", { ascending: false })
    .limit(6);

  if (error) {
    console.error("Error fetching featured opportunities:", error);
    return [];
  }

  return (data || []).map((opp) => ({
    id: opp.id,
    title: opp.title,
    slug: opp.slug,
    opportunity_type: opp.opportunity_type,
    budget_min: opp.budget_min,
    budget_max: opp.budget_max,
    budget_type: opp.budget_type,
    currency: opp.currency,
    country: opp.country,
    deadline: opp.deadline,
    is_featured: opp.is_featured,
    applications_count: opp.applications_count,
    published_at: opp.published_at,
    expires_at: opp.expires_at,
    brand: opp.brand as Database["public"]["Tables"]["brands"]["Row"],
    categories: (opp.categories as { categories: Database["public"]["Tables"]["categories"]["Row"] }[]).map((c) => c.categories),
  }));
}

/**
 * Fetch latest opportunities (max 12, published, not expired, ordered by newest)
 */
export async function getLatestOpportunities(): Promise<OpportunityWithBrand[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("opportunities")
    .select(`
      id,
      title,
      slug,
      opportunity_type,
      budget_min,
      budget_max,
      budget_type,
      currency,
      country,
      deadline,
      is_featured,
      applications_count,
      published_at,
      expires_at,
      brand:brands(
        id,
        company_name,
        logo_url,
        is_verified
      ),
      categories:opportunity_categories(
        categories(
          id,
          name,
          slug
        )
      )
    `)
    .eq("status", "active")
    .not("published_at", "is", null)
    .or("expires_at.is.null,expires_at.gt." + new Date().toISOString())
    .order("published_at", { ascending: false })
    .limit(12);

  if (error) {
    console.error("Error fetching latest opportunities:", error);
    return [];
  }

  return (data || []).map((opp) => ({
    id: opp.id,
    title: opp.title,
    slug: opp.slug,
    opportunity_type: opp.opportunity_type,
    budget_min: opp.budget_min,
    budget_max: opp.budget_max,
    budget_type: opp.budget_type,
    currency: opp.currency,
    country: opp.country,
    deadline: opp.deadline,
    is_featured: opp.is_featured,
    applications_count: opp.applications_count,
    published_at: opp.published_at,
    expires_at: opp.expires_at,
    brand: opp.brand as Database["public"]["Tables"]["brands"]["Row"],
    categories: (opp.categories as { categories: Database["public"]["Tables"]["categories"]["Row"] }[]).map((c) => c.categories),
  }));
}

/**
 * Fetch categories with opportunity counts
 */
export async function getCategoriesWithCounts(): Promise<CategoryWithCount[]> {
  const supabase = await createClient();

  const { data: categories, error } = await supabase
    .from("categories")
    .select(`
      id,
      name,
      slug,
      icon,
      color
    `)
    .eq("is_active", true)
    .order("sort_order");

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }

  // Get opportunity counts for each category
  const categoriesWithCounts = await Promise.all(
    (categories || []).map(async (cat) => {
      const { count } = await supabase
        .from("opportunity_categories")
        .select("opportunity_id", { count: "exact", head: true })
        .eq("category_id", cat.id)
        .in(
          "opportunity_id",
          (
            await supabase
              .from("opportunities")
              .select("id")
              .eq("status", "active")
              .not("published_at", "is", null)
              .or("expires_at.is.null,expires_at.gt." + new Date().toISOString())
          ).data?.map((o) => o.id) || []
        );

      return {
        ...cat,
        count: count || 0,
      };
    })
  );

  return categoriesWithCounts;
}

/**
 * Fetch recent creators (max 8, verified, public profiles)
 */
export async function getRecentCreators(): Promise<RecentCreator[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, username, avatar_url, follower_count, niches, platforms, is_verified")
    .eq("role", "creator")
    .eq("is_public", true)
    .order("created_at", { ascending: false })
    .limit(8);

  if (error) {
    console.error("Error fetching recent creators:", error);
    return [];
  }

  return data || [];
}

/**
 * Fetch recent brands (max 8, active, verified)
 */
export async function getRecentBrands(): Promise<RecentBrand[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("brands")
    .select("id, company_name, logo_url, is_verified, industry")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(8);

  if (error) {
    console.error("Error fetching recent brands:", error);
    return [];
  }

  return data || [];
}

export interface FeaturedBrandWithCount {
  id: string;
  company_name: string;
  logo_url: string | null;
  is_verified: boolean;
  industry: string | null;
  active_opportunities_count: number;
}

/**
 * Fetch featured brands with their active opportunity counts (max 8)
 */
export async function getFeaturedBrands(): Promise<FeaturedBrandWithCount[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("brands")
    .select("id, company_name, logo_url, is_verified, industry")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(8);

  if (error) return [];

  const brandsWithCounts = await Promise.all(
    (data ?? []).map(async (brand) => {
      const { count } = await supabase
        .from("opportunities")
        .select("*", { count: "exact", head: true })
        .eq("brand_id", brand.id)
        .eq("status", "active")
        .not("published_at", "is", null);

      return { ...brand, active_opportunities_count: count ?? 0 };
    })
  );

  return brandsWithCounts;
}

export interface TopCreatorProfile {
  id: string;
  full_name: string;
  username: string;
  avatar_url: string | null;
  follower_count: number;
  niches: string[];
  platforms: string[];
  country: string | null;
  is_verified: boolean;
}

/**
 * Fetch top creators sorted by follower count (max 8, public profiles only)
 */
export async function getTopCreators(): Promise<TopCreatorProfile[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, username, avatar_url, follower_count, niches, platforms, country, is_verified")
    .eq("role", "creator")
    .eq("is_public", true)
    .order("follower_count", { ascending: false })
    .limit(8);

  if (error) return [];
  return data ?? [];
}

export interface ActivityOpportunity {
  id: string;
  title: string;
  opportunity_type: string;
  published_at: string | null;
  brands: { company_name: string } | null;
}

export interface ActivityApplication {
  id: string;
  created_at: string;
  opportunities: { title: string } | null;
  profiles: { full_name: string } | null;
}

export interface ActivityBrand {
  id: string;
  company_name: string;
  created_at: string;
  industry: string | null;
}

/**
 * Fetch recent activity for the live activity feed
 */
export async function getLiveActivity(): Promise<{
  opportunities: ActivityOpportunity[];
  applications: ActivityApplication[];
  brands: ActivityBrand[];
}> {
  const supabase = await createClient();

  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const [{ data: opps }, { data: apps }, { data: brands }] = await Promise.all([
    supabase
      .from("opportunities")
      .select("id, title, opportunity_type, published_at, brands(company_name)")
      .eq("status", "active")
      .not("published_at", "is", null)
      .gte("published_at", since)
      .order("published_at", { ascending: false })
      .limit(5),
    supabase
      .from("applications")
      .select("id, created_at, opportunities(title), profiles(full_name)")
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("brands")
      .select("id, company_name, created_at, industry")
      .eq("is_active", true)
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(3),
  ]);

  return {
    opportunities: (opps ?? []) as ActivityOpportunity[],
    applications: (apps ?? []) as ActivityApplication[],
    brands: (brands ?? []) as ActivityBrand[],
  };
}
