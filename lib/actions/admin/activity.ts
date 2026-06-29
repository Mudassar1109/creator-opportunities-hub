import { createServiceClient, getAdminUser } from "@/lib/supabase/server";

export type ActivityAction =
  | "Login"
  | "Logout"
  | "Create"
  | "Update"
  | "Delete"
  | "Approve"
  | "Reject"
  | "Suspend"
  | "Restore";

export type ActivityModule =
  | "Users"
  | "Brands"
  | "Opportunities"
  | "Applications"
  | "Reports"
  | "Settings"
  | "Referral";

export type ActivityStatus = "Success" | "Failure" | "Pending";

export interface ActivityEntry {
  id: string;
  adminName: string;
  adminEmail: string;
  action: ActivityAction;
  module: ActivityModule;
  target: string;
  targetId: string;
  status: ActivityStatus;
  details: string;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
}

const eventActionMap: Record<string, ActivityAction> = {
  user_registered: "Create",
  brand_registered: "Create",
  opportunity_created: "Create",
  application_submitted: "Create",
  report_created: "Create",
};

const eventModuleMap: Record<string, ActivityModule> = {
  user_registered: "Users",
  brand_registered: "Brands",
  opportunity_created: "Opportunities",
  application_submitted: "Applications",
  report_created: "Reports",
};

function eventToActivity(event: { id: string; event_type: string; event_data: any; user_id: string | null; created_at: string }): ActivityEntry {
  return {
    id: event.id,
    adminName: "System",
    adminEmail: "system@creatorhub.com",
    action: eventActionMap[event.event_type] ?? "Create",
    module: eventModuleMap[event.event_type] ?? "Settings",
    target: event.event_type,
    targetId: event.id,
    status: "Success" as ActivityStatus,
    details: `Event: ${event.event_type}`,
    ipAddress: "0.0.0.0",
    userAgent: "System",
    createdAt: event.created_at,
  };
}

function reportToActivity(report: { id: string; report_type: string; reason: string; status: string; created_at: string }): ActivityEntry {
  const actionMap: Record<string, ActivityAction> = {
    pending: "Create",
    under_review: "Update",
    resolved: "Approve",
    dismissed: "Reject",
  };
  return {
    id: report.id,
    adminName: "System",
    adminEmail: "system@creatorhub.com",
    action: actionMap[report.status] ?? "Update",
    module: "Reports" as ActivityModule,
    target: `Report: ${report.report_type}`,
    targetId: report.id,
    status: report.status === "dismissed" ? "Failure" as ActivityStatus : "Success" as ActivityStatus,
    details: report.reason.slice(0, 200),
    ipAddress: "0.0.0.0",
    userAgent: "System",
    createdAt: report.created_at,
  };
}

export async function getAdminActivity(options?: {
  search?: string;
  action?: ActivityAction | "all";
  module?: ActivityModule | "all";
  status?: ActivityStatus | "all";
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  pageSize?: number;
}) {
  const admin = await getAdminUser();
  if (!admin) {
    return { data: [], pagination: { page: 1, pageSize: 15, total: 0, totalPages: 1, hasNext: false, hasPrev: false } };
  }

  const supabase = createServiceClient();

  const [eventsResult, reportsResult] = await Promise.all([
    supabase.from("analytics_events").select("id, event_type, event_data, user_id, created_at").order("created_at", { ascending: false }).limit(250),
    supabase.from("reports").select("id, report_type, reason, status, created_at").order("created_at", { ascending: false }).limit(100),
  ]);

  let activity: ActivityEntry[] = [];
  if (eventsResult.data) {
    activity = activity.concat(eventsResult.data.map(eventToActivity));
  }
  if (reportsResult.data) {
    activity = activity.concat(reportsResult.data.map(reportToActivity));
  }
  activity.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const search = options?.search?.toLowerCase().trim() || "";
  const action = options?.action || "all";
  const module = options?.module || "all";
  const status = options?.status || "all";
  const dateFrom = options?.dateFrom;
  const dateTo = options?.dateTo;
  const page = options?.page || 1;
  const pageSize = options?.pageSize || 15;

  let filtered = [...activity];

  if (search) {
    filtered = filtered.filter(
      (e) =>
        e.adminName.toLowerCase().includes(search) ||
        e.adminEmail.toLowerCase().includes(search) ||
        e.target.toLowerCase().includes(search) ||
        e.action.toLowerCase().includes(search) ||
        e.module.toLowerCase().includes(search) ||
        e.id.toLowerCase().includes(search)
    );
  }

  if (action !== "all") {
    filtered = filtered.filter((e) => e.action === action);
  }
  if (module !== "all") {
    filtered = filtered.filter((e) => e.module === module);
  }
  if (status !== "all") {
    filtered = filtered.filter((e) => e.status === status);
  }
  if (dateFrom) {
    const from = new Date(dateFrom);
    filtered = filtered.filter((e) => new Date(e.createdAt) >= from);
  }
  if (dateTo) {
    const to = new Date(dateTo);
    to.setHours(23, 59, 59, 999);
    filtered = filtered.filter((e) => new Date(e.createdAt) <= to);
  }

  const total = filtered.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const data = filtered.slice(start, start + pageSize);

  return {
    data,
    pagination: { page, pageSize, total, totalPages, hasNext: page < totalPages, hasPrev: page > 1 },
  };
}

export async function getAdminActivityById(id: string): Promise<ActivityEntry | null> {
  const admin = await getAdminUser();
  if (!admin) return null;

  const supabase = createServiceClient();

  const [evResult, rpResult] = await Promise.all([
    supabase.from("analytics_events").select("id, event_type, event_data, user_id, created_at").eq("id", id).single(),
    supabase.from("reports").select("id, report_type, reason, status, created_at").eq("id", id).single(),
  ]);

  if (evResult.data) return eventToActivity(evResult.data);
  if (rpResult.data) return reportToActivity(rpResult.data);

  return null;
}

export async function getAdminActivitySummary() {
  const admin = await getAdminUser();
  if (!admin) {
    return { total: 0, byAction: {} as Record<string, number>, byModule: {} as Record<string, number>, byStatus: {} as Record<string, number>, last24h: 0 };
  }

  const supabase = createServiceClient();
  const [eventsResult, reportsResult] = await Promise.all([
    supabase.from("analytics_events").select("id, event_type, created_at").order("created_at", { ascending: false }).limit(250),
    supabase.from("reports").select("id, report_type, status, created_at").order("created_at", { ascending: false }).limit(100),
  ]);

  const byAction: Record<string, number> = {};
  const byModule: Record<string, number> = {};
  const byStatus: Record<string, number> = {};

  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  let last24h = 0;

  if (eventsResult.data) {
    for (const ev of eventsResult.data) {
      const action = eventActionMap[ev.event_type] ?? "Create";
      const mod = eventModuleMap[ev.event_type] ?? "Settings";
      byAction[action] = (byAction[action] || 0) + 1;
      byModule[mod] = (byModule[mod] || 0) + 1;
      byStatus.Success = (byStatus.Success || 0) + 1;
      if (new Date(ev.created_at) > twentyFourHoursAgo) last24h++;
    }
  }

  if (reportsResult.data) {
    for (const rp of reportsResult.data) {
      const actionMap: Record<string, string> = {
        pending: "Create", under_review: "Update", resolved: "Approve", dismissed: "Reject",
      };
      const action = actionMap[rp.status] ?? "Update";
      byAction[action] = (byAction[action] || 0) + 1;
      byModule.Reports = (byModule.Reports || 0) + 1;
      byStatus[rp.status === "dismissed" ? "Failure" : "Success"] = (byStatus[rp.status === "dismissed" ? "Failure" : "Success"] || 0) + 1;
      if (new Date(rp.created_at) > twentyFourHoursAgo) last24h++;
    }
  }

  return {
    total: (eventsResult.data?.length ?? 0) + (reportsResult.data?.length ?? 0),
    byAction,
    byModule,
    byStatus,
    last24h,
  };
}
