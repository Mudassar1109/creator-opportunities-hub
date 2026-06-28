import { createClient, createServiceClient } from "@/lib/supabase/server";

export interface BrandDetails {
  id: string;
  company_name: string;
  slug: string;
  logo_url: string | null;
  website: string;
  industry: string | null;
  description: string | null;
  company_size: string;
  country: string | null;
  city: string | null;
  contact_email: string | null;
  contact_name: string | null;
  social_twitter: string | null;
  social_linkedin: string | null;
  social_instagram: string | null;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
  opportunity_count: number;
}

export async function getAdminBrandById(id: string): Promise<BrandDetails | null> {
  try {
    const supabase = createServiceClient();

    const [{ data: brand }, { count: oppCount }] = await Promise.all([
      supabase.from("brands").select("*").eq("id", id).single(),
      supabase.from("opportunities").select("*", { count: "exact", head: true }).eq("brand_id", id),
    ]);

    if (!brand) return null;

    return {
      id: brand.id,
      company_name: brand.company_name,
      slug: brand.slug,
      logo_url: brand.logo_url,
      website: brand.website,
      industry: brand.industry,
      description: brand.description,
      company_size: brand.company_size,
      country: brand.country,
      city: brand.city,
      contact_email: brand.contact_email,
      contact_name: brand.contact_name,
      social_twitter: brand.social_twitter,
      social_linkedin: brand.social_linkedin,
      social_instagram: brand.social_instagram,
      is_verified: brand.is_verified,
      is_active: brand.is_active,
      created_at: brand.created_at,
      opportunity_count: oppCount ?? 0,
    };
  } catch {
    return null;
  }
}
