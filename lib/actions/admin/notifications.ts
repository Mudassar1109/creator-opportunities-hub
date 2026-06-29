"use server";

import { getAdminUser } from "@/lib/supabase/server";

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

function randomDate(daysBack: number): string {
  const d = new Date(Date.now() - Math.floor(Math.random() * daysBack) * 24 * 60 * 60 * 1000);
  return d.toISOString();
}

const titles: Record<AdminNotificationType, string[]> = {
  User: [
    "New creator registered",
    "New brand account created",
    "User profile updated",
    "Account flagged for review",
  ],
  Brand: [
    "Brand verification requested",
    "Brand profile completed",
    "Brand reached 10 opportunities",
    "Brand account deactivated",
  ],
  Opportunity: [
    "New opportunity published",
    "Opportunity reached 50 applications",
    "Opportunity expired",
    "Featured opportunity approved",
  ],
  Application: [
    "Application submitted for review",
    "Application accepted by brand",
    "Application rejected",
    "Bulk applications received",
  ],
  Report: [
    "Content reported by user",
    "Multiple reports received",
    "Report resolved",
    "Report escalated to admin",
  ],
  System: [
    "System backup completed",
    "Cache cleared successfully",
    "Scheduled maintenance in 1 hour",
    "New update available",
  ],
};

function generateNotifications(count: number): AdminNotification[] {
  const types: AdminNotificationType[] = ["User", "Brand", "Opportunity", "Application", "Report", "System"];
  const priorities: PriorityLevel[] = ["Low", "Medium", "High", "Critical"];

  return Array.from({ length: count }, (_, i) => {
    const type = types[Math.floor(Math.random() * types.length)];
    const typeTitles = titles[type];
    const createdAt = randomDate(30);

    return {
      id: `notif-${i + 1}`,
      type,
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      title: typeTitles[Math.floor(Math.random() * typeTitles.length)],
      message: `This is a sample ${type.toLowerCase()} notification generated for the admin dashboard.`,
      isRead: Math.random() > 0.4,
      createdAt,
      relatedId: i % 3 === 0 ? `ref-${Math.floor(Math.random() * 100)}` : undefined,
      relatedLabel: i % 3 === 0 ? `#REF-${Math.floor(Math.random() * 100)}` : undefined,
    };
  });
}

const allNotifications = generateNotifications(50);

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

  const search = options?.search?.toLowerCase().trim() || "";
  const type = options?.type || "all";
  const status = options?.status || "all";
  const priority = options?.priority || "all";
  const page = options?.page || 1;
  const pageSize = options?.pageSize || 10;

  let filtered = [...allNotifications];

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

  filtered.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const total = filtered.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const data = filtered.slice(start, start + pageSize);

  return {
    data,
    pagination: {
      page,
      pageSize,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}

export async function getAdminNotificationSummary() {
  const admin = await getAdminUser();
  if (!admin) {
    return { total: 0, unread: 0, read: 0, byType: {} as Record<AdminNotificationType, number>, byPriority: {} as Record<PriorityLevel, number> };
  }

  const unread = allNotifications.filter((n) => !n.isRead).length;
  const byType = {} as Record<AdminNotificationType, number>;
  const byPriority = {} as Record<PriorityLevel, number>;

  for (const n of allNotifications) {
    byType[n.type] = (byType[n.type] || 0) + 1;
    byPriority[n.priority] = (byPriority[n.priority] || 0) + 1;
  }

  return {
    total: allNotifications.length,
    unread,
    read: allNotifications.length - unread,
    byType,
    byPriority,
  };
}
