import { createClient, createServiceClient } from "@/lib/supabase/server";

export interface ApplicationDetails {
  id: string;
  cover_letter: string | null;
  portfolio_links: string[];
  proposed_budget: number | null;
  currency: string;
  status: string;
  notes: string | null;
  reviewed_at: string | null;
  created_at: string;
  applicant_name: string;
  applicant_email: string;
  applicant_avatar: string | null;
  applicant_bio: string | null;
  applicant_headline: string | null;
  applicant_follower_count: number;
  applicant_platforms: string[];
  applicant_niches: string[];
  opportunity_title: string;
  opportunity_description: string;
  opportunity_type: string;
  brand_name: string;
  brand_logo: string | null;
}

export async function getAdminApplicationById(id: string): Promise<ApplicationDetails | null> {
  try {
    const supabase = createServiceClient();

    const { data: app } = await supabase
      .from("applications")
      .select("*")
      .eq("id", id)
      .single();

    if (!app) return null;

    const [profileResult, oppResult] = await Promise.all([
      supabase
        .from("profiles")
        .select("full_name, email, avatar_url, bio, headline, follower_count, platforms, niches")
        .eq("id", app.creator_id)
        .single(),
      supabase
        .from("opportunities")
        .select("title, description, opportunity_type, brand_id")
        .eq("id", app.opportunity_id)
        .single(),
    ]);

    const profile = profileResult.data;
    const opp = oppResult.data;
    let brandName = "Unknown";
    let brandLogo: string | null = null;

    if (opp?.brand_id) {
      const { data: brand } = await supabase
        .from("brands")
        .select("company_name, logo_url")
        .eq("id", opp.brand_id)
        .single();
      if (brand) {
        brandName = brand.company_name;
        brandLogo = brand.logo_url;
      }
    }

    return {
      id: app.id,
      cover_letter: app.cover_letter,
      portfolio_links: app.portfolio_links,
      proposed_budget: app.proposed_budget,
      currency: app.currency,
      status: app.status,
      notes: app.notes,
      reviewed_at: app.reviewed_at,
      created_at: app.created_at,
      applicant_name: profile?.full_name ?? "Unknown",
      applicant_email: profile?.email ?? "",
      applicant_avatar: profile?.avatar_url ?? null,
      applicant_bio: profile?.bio ?? null,
      applicant_headline: profile?.headline ?? null,
      applicant_follower_count: profile?.follower_count ?? 0,
      applicant_platforms: profile?.platforms ?? [],
      applicant_niches: profile?.niches ?? [],
      opportunity_title: opp?.title ?? "Unknown",
      opportunity_description: opp?.description ?? "",
      opportunity_type: opp?.opportunity_type ?? "",
      brand_name: brandName,
      brand_logo: brandLogo,
    };
  } catch {
    return null;
  }
}
