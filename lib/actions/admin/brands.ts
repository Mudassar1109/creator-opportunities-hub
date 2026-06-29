import { createClient, getAdminUser } from "@/lib/supabase/server";

export interface AdminBrand {
  id: string;
  user_id: string;
  company_name: string;
  slug: string;
  logo_url: string | null;
  website: string;
  industry: string | null;
  contact_email: string | null;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
}

export interface AdminBrandsResponse {
  brands: AdminBrand[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export async function getAdminBrands(params: {
  search?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): Promise<AdminBrandsResponse> {
  const admin = await getAdminUser();
  if (!admin) {
    return { brands: [], total: 0, page: 1, pageSize: 12, totalPages: 1 };
  }

  const supabase = await createClient();
  const { search, status, page = 1, pageSize = 12 } = params;

  let query = supabase
    .from("brands")
    .select("id, user_id, company_name, slug, logo_url, website, industry, contact_email, is_verified, is_active, created_at", { count: "exact" });

  if (search) {
    query = query.or(`company_name.ilike.%${search}%,contact_email.ilike.%${search}%`);
  }

  if (status === "active") {
    query = query.eq("is_active", true);
  } else if (status === "inactive") {
    query = query.eq("is_active", false);
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  return {
    brands: (data ?? []) as AdminBrand[],
    total: count ?? 0,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil((count ?? 0) / pageSize)),
  };
}
