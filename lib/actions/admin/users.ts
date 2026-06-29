import { createClient, getAdminUser } from "@/lib/supabase/server";

export interface AdminUser {
  id: string;
  full_name: string;
  email: string;
  role: string;
  avatar_url: string | null;
  is_verified: boolean;
  is_public: boolean;
  created_at: string;
}

export interface AdminUsersResponse {
  users: AdminUser[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export async function getAdminUsers(params: {
  search?: string;
  role?: string;
  page?: number;
  pageSize?: number;
}): Promise<AdminUsersResponse> {
  const admin = await getAdminUser();
  if (!admin) {
    return { users: [], total: 0, page: 1, pageSize: 12, totalPages: 1 };
  }

  const supabase = await createClient();
  const { search, role, page = 1, pageSize = 12 } = params;

  let query = supabase
    .from("profiles")
    .select("id, full_name, email, role, avatar_url, is_verified, is_public, created_at", { count: "exact" });

  if (search) {
    query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
  }

  if (role === "creator" || role === "brand") {
    query = query.eq("role", role);
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  return {
    users: (data ?? []) as AdminUser[],
    total: count ?? 0,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil((count ?? 0) / pageSize)),
  };
}
