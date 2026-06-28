import { createClient } from "@/lib/supabase/server";
import type { OpportunityStatus } from "@/lib/database.types";

function isValidStatus(s: string): s is OpportunityStatus {
  return ["draft", "active", "paused", "closed", "expired"].includes(s);
}

export interface AdminOpportunity {
  id: string;
  title: string;
  slug: string;
  opportunity_type: string;
  status: string;
  applications_count: number;
  deadline: string | null;
  created_at: string;
  brand_name: string;
}

export interface AdminOpportunitiesResponse {
  opportunities: AdminOpportunity[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export async function getAdminOpportunities(params: {
  search?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): Promise<AdminOpportunitiesResponse> {
  const supabase = await createClient();
  const { search, status, page = 1, pageSize = 12 } = params;

  let query = supabase
    .from("opportunities")
    .select("id, title, slug, opportunity_type, status, applications_count, deadline, created_at, brand_id", { count: "exact" });

  if (search) {
    query = query.ilike("title", `%${search}%`);
  }

  if (status && isValidStatus(status)) {
    query = query.eq("status", status);
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  const opportunities = (data ?? []) as Array<{
    id: string;
    title: string;
    slug: string;
    opportunity_type: string;
    status: string;
    applications_count: number;
    deadline: string | null;
    created_at: string;
    brand_id: string;
  }>;

  const brandIds = [...new Set(opportunities.map((o) => o.brand_id))];

  const brandMap: Record<string, string> = {};
  if (brandIds.length > 0) {
    const { data: brands } = await supabase
      .from("brands")
      .select("id, company_name")
      .in("id", brandIds);

    if (brands) {
      for (const brand of brands) {
        brandMap[brand.id] = brand.company_name;
      }
    }
  }

  return {
    opportunities: opportunities.map((opp) => ({
      id: opp.id,
      title: opp.title,
      slug: opp.slug,
      opportunity_type: opp.opportunity_type,
      status: opp.status,
      applications_count: opp.applications_count,
      deadline: opp.deadline,
      created_at: opp.created_at,
      brand_name: brandMap[opp.brand_id] ?? "Unknown",
    })),
    total: count ?? 0,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil((count ?? 0) / pageSize)),
  };
}
