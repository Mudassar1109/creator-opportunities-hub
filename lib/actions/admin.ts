import { createClient } from "@/lib/supabase/server";

export interface AdminStats {
  totalUsers: number;
  totalCreators: number;
  totalBrands: number;
  totalOpportunities: number;
  pendingApplications: number;
  activeOpportunities: number;
  totalReports: number;
  totalMessages: number;
}

export interface LatestRegistration {
  id: string;
  full_name: string;
  email: string;
  role: string;
  avatar_url: string | null;
  is_verified: boolean;
  created_at: string;
}

export interface LatestOpportunity {
  id: string;
  title: string;
  slug: string;
  opportunity_type: string;
  status: string;
  created_at: string;
  brand_name: string;
}

export async function getAdminStats(): Promise<AdminStats> {
  const supabase = await createClient();

  const [
    { count: totalUsers },
    { count: totalCreators },
    { count: totalBrands },
    { count: totalOpportunities },
    { count: pendingApplications },
    { count: activeOpportunities },
    { count: totalMessages },
    { count: totalConversations },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "creator"),
    supabase.from("brands").select("*", { count: "exact", head: true }),
    supabase.from("opportunities").select("*", { count: "exact", head: true }),
    supabase.from("applications").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("opportunities").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("messages").select("*", { count: "exact", head: true }),
    supabase.from("conversations").select("*", { count: "exact", head: true }),
  ]);

  return {
    totalUsers: totalUsers ?? 0,
    totalCreators: totalCreators ?? 0,
    totalBrands: totalBrands ?? 0,
    totalOpportunities: totalOpportunities ?? 0,
    pendingApplications: pendingApplications ?? 0,
    activeOpportunities: activeOpportunities ?? 0,
    totalReports: totalConversations ?? 0,
    totalMessages: totalMessages ?? 0,
  };
}

export async function getLatestRegistrations(): Promise<LatestRegistration[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, avatar_url, is_verified, created_at")
    .order("created_at", { ascending: false })
    .limit(8);

  return (data ?? []) as LatestRegistration[];
}

export async function getAdminLatestOpportunities(): Promise<LatestOpportunity[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("opportunities")
    .select("id, title, slug, opportunity_type, status, created_at")
    .order("created_at", { ascending: false })
    .limit(8);

  return (data ?? []).map((opp) => ({
    id: opp.id,
    title: opp.title,
    slug: opp.slug,
    opportunity_type: opp.opportunity_type,
    status: opp.status,
    created_at: opp.created_at,
    brand_name: "",
  }));
}
