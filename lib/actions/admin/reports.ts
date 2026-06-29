import { createClient, createServiceClient, getAdminUser } from "@/lib/supabase/server";
import type { ReportStatus } from "@/lib/database.types";

function isValidStatus(s: string): s is ReportStatus {
  return ["pending", "under_review", "resolved", "dismissed"].includes(s);
}

export interface AdminReport {
  id: string;
  reporter_name: string;
  reported_entity: string;
  report_type: string;
  reason: string;
  status: string;
  created_at: string;
}

export interface AdminReportsResponse {
  reports: AdminReport[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export async function getAdminReports(params: {
  search?: string;
  status?: string;
  type?: string;
  page?: number;
  pageSize?: number;
}): Promise<AdminReportsResponse> {
  const admin = await getAdminUser();
  if (!admin) {
    return { reports: [], total: 0, page: 1, pageSize: 12, totalPages: 1 };
  }

  const { search, status, type, page = 1, pageSize = 12 } = params;

  try {
    const supabase = createServiceClient();

    let query = supabase
      .from("reports")
      .select("id, reporter_id, reported_type, reported_id, report_type, reason, status, created_at", { count: "exact" });

    if (status && status !== "all" && isValidStatus(status)) {
      query = query.eq("status", status);
    }

    if (type && type !== "all") {
      query = query.eq("report_type", type);
    }

    if (search) {
      query = query.or(`reason.ilike.%${search}%,report_type.ilike.%${search}%`);
    }

    query = query.order("created_at", { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1);

    const { data, count } = await query;

    const reports: AdminReport[] = (data ?? []).map((r) => ({
      id: r.id,
      reporter_name: r.reporter_id?.slice(0, 8) ?? "unknown",
      reported_entity: `${r.reported_type}:${r.reported_id?.slice(0, 8)}`,
      report_type: r.report_type,
      reason: r.reason,
      status: r.status,
      created_at: r.created_at,
    }));

    return {
      reports,
      total: count ?? 0,
      page,
      pageSize,
      totalPages: Math.ceil((count ?? 0) / pageSize) || 1,
    };
  } catch {
    return {
      reports: [],
      total: 0,
      page,
      pageSize,
      totalPages: 1,
    };
  }
}
