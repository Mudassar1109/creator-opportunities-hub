import { createClient, createServiceClient, getAdminUser } from "@/lib/supabase/server";

export interface OpportunityDetails {
  id: string;
  title: string;
  slug: string;
  description: string;
  opportunity_type: string;
  budget_min: number | null;
  budget_max: number | null;
  budget_type: string;
  currency: string;
  country: string | null;
  location_type: string;
  requirements: string | null;
  deliverables: string | null;
  deadline: string | null;
  min_followers: number;
  platforms: string[];
  niches: string[];
  status: string;
  is_featured: boolean;
  is_remote: boolean;
  views_count: number;
  applications_count: number;
  published_at: string | null;
  expires_at: string | null;
  created_at: string;
  brand_name: string;
  brand_logo: string | null;
  brand_website: string | null;
  brand_verified: boolean;
}

export async function getAdminOpportunityById(id: string): Promise<OpportunityDetails | null> {
  const admin = await getAdminUser();
  if (!admin) return null;

  try {
    const supabase = createServiceClient();

    const { data: opp } = await supabase
      .from("opportunities")
      .select("*")
      .eq("id", id)
      .single();

    if (!opp) return null;

    const { data: brand } = await supabase
      .from("brands")
      .select("company_name, logo_url, website, is_verified")
      .eq("id", opp.brand_id)
      .single();

    return {
      id: opp.id,
      title: opp.title,
      slug: opp.slug,
      description: opp.description,
      opportunity_type: opp.opportunity_type,
      budget_min: opp.budget_min,
      budget_max: opp.budget_max,
      budget_type: opp.budget_type,
      currency: opp.currency,
      country: opp.country,
      location_type: opp.location_type,
      requirements: opp.requirements,
      deliverables: opp.deliverables,
      deadline: opp.deadline,
      min_followers: opp.min_followers,
      platforms: opp.platforms,
      niches: opp.niches,
      status: opp.status,
      is_featured: opp.is_featured,
      is_remote: opp.is_remote,
      views_count: opp.views_count,
      applications_count: opp.applications_count,
      published_at: opp.published_at,
      expires_at: opp.expires_at,
      created_at: opp.created_at,
      brand_name: brand?.company_name ?? "Unknown",
      brand_logo: brand?.logo_url ?? null,
      brand_website: brand?.website ?? null,
      brand_verified: brand?.is_verified ?? false,
    };
  } catch {
    return null;
  }
}
