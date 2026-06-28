import { createClient } from "@/lib/supabase/server";
import type { ApplicationStatus } from "@/lib/database.types";

function isValidStatus(s: string): s is ApplicationStatus {
  return ["pending", "under_review", "accepted", "rejected", "withdrawn"].includes(s);
}

export interface AdminApplication {
  id: string;
  opportunity_id: string;
  creator_id: string;
  status: string;
  created_at: string;
  applicant_name: string;
  applicant_email: string;
  applicant_avatar: string | null;
  opportunity_title: string;
  brand_name: string;
}

export interface AdminApplicationsResponse {
  applications: AdminApplication[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export async function getAdminApplications(params: {
  search?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): Promise<AdminApplicationsResponse> {
  const supabase = await createClient();
  const { search, status, page = 1, pageSize = 12 } = params;

  let query = supabase
    .from("applications")
    .select("id, opportunity_id, creator_id, status, created_at", { count: "exact" });

  if (status && isValidStatus(status)) {
    query = query.eq("status", status);
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  const rows = (data ?? []) as Array<{
    id: string;
    opportunity_id: string;
    creator_id: string;
    status: string;
    created_at: string;
  }>;

  if (rows.length === 0) {
    return {
      applications: [],
      total: 0,
      page,
      pageSize,
      totalPages: 1,
    };
  }

  const creatorIds = [...new Set(rows.map((r) => r.creator_id))];
  const opportunityIds = [...new Set(rows.map((r) => r.opportunity_id))];

  const [profilesResult, opportunitiesResult, brandsResult] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, full_name, email, avatar_url")
      .in("id", creatorIds),
    supabase
      .from("opportunities")
      .select("id, title, brand_id")
      .in("id", opportunityIds),
    creatorIds.length > 0
      ? supabase
          .from("brands")
          .select("id, company_name")
          .in("id", [])
      : Promise.resolve({ data: [] }),
  ]);

  const profileMap: Record<string, { full_name: string; email: string; avatar_url: string | null }> = {};
  if (profilesResult.data) {
    for (const p of profilesResult.data) {
      profileMap[p.id] = {
        full_name: p.full_name,
        email: p.email,
        avatar_url: p.avatar_url,
      };
    }
  }

  const oppMap: Record<string, { title: string; brand_id: string }> = {};
  if (opportunitiesResult.data) {
    for (const o of opportunitiesResult.data) {
      oppMap[o.id] = { title: o.title, brand_id: o.brand_id };
    }
  }

  const brandIds = [...new Set(Object.values(oppMap).map((o) => o.brand_id))];
  const brandMap: Record<string, string> = {};
  if (brandIds.length > 0) {
    const { data: brands } = await supabase
      .from("brands")
      .select("id, company_name")
      .in("id", brandIds);

    if (brands) {
      for (const b of brands) {
        brandMap[b.id] = b.company_name;
      }
    }
  }

  let applications: AdminApplication[] = rows.map((row) => {
    const profile = profileMap[row.creator_id] ?? { full_name: "Unknown", email: "", avatar_url: null };
    const opp = oppMap[row.opportunity_id] ?? { title: "Unknown", brand_id: "" };
    return {
      id: row.id,
      opportunity_id: row.opportunity_id,
      creator_id: row.creator_id,
      status: row.status,
      created_at: row.created_at,
      applicant_name: profile.full_name,
      applicant_email: profile.email,
      applicant_avatar: profile.avatar_url,
      opportunity_title: opp.title,
      brand_name: brandMap[opp.brand_id] ?? "Unknown",
    };
  });

  if (search) {
    const q = search.toLowerCase();
    applications = applications.filter(
      (a) =>
        a.applicant_name.toLowerCase().includes(q) ||
        a.applicant_email.toLowerCase().includes(q) ||
        a.opportunity_title.toLowerCase().includes(q) ||
        a.brand_name.toLowerCase().includes(q)
    );
  }

  return {
    applications,
    total: count ?? 0,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil((count ?? 0) / pageSize)),
  };
}
