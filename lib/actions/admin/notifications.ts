"use server";

import { createServiceClient, getAdminUser } from "@/lib/supabase/server";

export type AdminNotificationType = "User" | "Brand" | "Opportunity" | "Application" | "Report" | "System";
export type PriorityLevel = "Low" | "Medium" | "High" | "Critical";

export interface AdminNotification {
  id: string;
  type: AdminNotificationType;
  priority: PriorityLevel;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  relatedId?: string;
  relatedLabel?: string;
}

function eventToNotification(event: { id: string; event_type: string; event_data: any; created_at: string }): AdminNotification {
  const typeMap: Record<string, AdminNotificationType> = {
    user_registered: "User",
    brand_registered: "Brand",
    opportunity_created: "Opportunity",
    application_submitted: "Application",
    report_created: "Report",
  };
  const ntype = typeMap[event.event_type] ?? "System";
  const titleMap: Record<string, string> = {
    user_registered: "New user registered",
    brand_registered: "New brand registered",
    opportunity_created: "New opportunity created",
    application_submitted: "New application submitted",
    report_created: "New report filed",
  };
  return {
    id: event.id,
    type: ntype,
    priority: "Medium" as PriorityLevel,
    title: titleMap[event.event_type] ?? event.event_type,
    message: typeof event.event_data === "object" && event.event_data !== null
      ? JSON.stringify(event.event_data).slice(0, 200)
      : `Event: ${event.event_type}`,
    isRead: false,
    createdAt: event.created_at,
  };
}

function reportToNotification(report: { id: string; report_type: string; reason: string; status: string; created_at: string }): AdminNotification {
  return {
    id: report.id,
    type: "Report" as AdminNotificationType,
    priority: report.report_type === "violation" ? "High" as PriorityLevel : "Medium" as PriorityLevel,
    title: `Report filed: ${report.report_type}`,
    message: report.reason.slice(0, 200),
    isRead: report.status !== "pending",
    createdAt: report.created_at,
    relatedId: report.id,
    relatedLabel: `#${report.id.slice(0, 8)}`,
  };
}

export async function getAdminNotifications(options?: {
  search?: string;
  type?: AdminNotificationType | "all";
  status?: "all" | "read" | "unread";
  priority?: PriorityLevel | "all";
  page?: number;
  pageSize?: number;
}) {
  const admin = await getAdminUser();
  if (!admin) {
    return { data: [], pagination: { page: 1, pageSize: 10, total: 0, totalPages: 1, hasNext: false, hasPrev: false } };
  }

  const supabase = createServiceClient();

  const [eventsResult, reportsResult] = await Promise.all([
    supabase.from("analytics_events").select("id, event_type, event_data, created_at").order("created_at", { ascending: false }).limit(100),
    supabase.from("reports").select("id, report_type, reason, status, created_at").in("status", ["pending", "under_review"]).order("created_at", { ascending: false }).limit(50),
  ]);

  let notifications: AdminNotification[] = [];
  if (eventsResult.data) {
    notifications = notifications.concat(eventsResult.data.map(eventToNotification));
  }
  if (reportsResult.data) {
    notifications = notifications.concat(reportsResult.data.map(reportToNotification));
  }
  notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const search = options?.search?.toLowerCase().trim() || "";
  const type = options?.type || "all";
  const status = options?.status || "all";
  const priority = options?.priority || "all";
  const page = options?.page || 1;
  const pageSize = options?.pageSize || 10;

  let filtered = [...notifications];
  if (search) {
    filtered = filtered.filter(
      (n) =>
        n.title.toLowerCase().includes(search) ||
        n.message.toLowerCase().includes(search) ||
        n.type.toLowerCase().includes(search)
    );
  }
  if (type !== "all") {
    filtered = filtered.filter((n) => n.type === type);
  }
  if (priority !== "all") {
    filtered = filtered.filter((n) => n.priority === priority);
  }
  if (status === "read") {
    filtered = filtered.filter((n) => n.isRead);
  } else if (status === "unread") {
    filtered = filtered.filter((n) => !n.isRead);
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

export async function getAdminNotificationSummary() {
  const admin = await getAdminUser();
  if (!admin) {
    return { total: 0, unread: 0, read: 0, byType: {} as Record<AdminNotificationType, number>, byPriority: {} as Record<PriorityLevel, number> };
  }

  const supabase = createServiceClient();
  const [eventsResult, reportsResult] = await Promise.all([
    supabase.from("analytics_events").select("id, event_type, created_at").order("created_at", { ascending: false }).limit(100),
    supabase.from("reports").select("id, report_type, status, created_at").in("status", ["pending", "under_review"]).order("created_at", { ascending: false }).limit(50),
  ]);

  const typeMap: Record<string, AdminNotificationType> = {
    user_registered: "User",
    brand_registered: "Brand",
    opportunity_created: "Opportunity",
    application_submitted: "Application",
    report_created: "Report",
  };

  let total = 0;
  const byType: Record<AdminNotificationType, number> = { User: 0, Brand: 0, Opportunity: 0, Application: 0, Report: 0, System: 0 };
  const byPriority: Record<PriorityLevel, number> = { Low: 0, Medium: 0, High: 0, Critical: 0 };

  if (eventsResult.data) {
    for (const ev of eventsResult.data) {
      const nt = typeMap[ev.event_type] ?? "System";
      byType[nt] = (byType[nt] || 0) + 1;
      byPriority.Medium++;
      total++;
    }
  }
  if (reportsResult.data) {
    for (const rp of reportsResult.data) {
      byType.Report = (byType.Report || 0) + 1;
      byPriority[rp.report_type === "violation" ? "High" : "Medium"]++;
      total++;
    }
  }

  return { total, unread: total, read: 0, byType, byPriority };
}
