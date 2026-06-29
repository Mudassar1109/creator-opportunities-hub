import { getAdminUser } from "@/lib/supabase/server";

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

const adminNames = [
  "Muhammad Mudassar",
  "Sarah Johnson",
  "Alex Chen",
  "Emily Davis",
  "Marcus Williams",
];

const adminEmails = [
  "admin@creatorhub.com",
  "sarah.j@creatorhub.com",
  "alex.chen@creatorhub.com",
  "emily.d@creatorhub.com",
  "marcus.w@creatorhub.com",
];

const actions: ActivityAction[] = [
  "Login", "Logout", "Create", "Update", "Delete", "Approve", "Reject", "Suspend", "Restore",
];

const modules: ActivityModule[] = [
  "Users", "Brands", "Opportunities", "Applications", "Reports", "Settings", "Referral",
];

const statuses: ActivityStatus[] = ["Success", "Failure", "Pending"];

const targetsByModule: Record<ActivityModule, string[]> = {
  Users: ["John Doe", "Jane Smith", "Robert Kim", "Lisa Park", "David Brown", "Emma Wilson"],
  Brands: ["TechCorp", "FashionHub", "GreenLife", "SmartGear", "PureBeauty", "FitWorld"],
  Opportunities: ["Brand Deal: Summer Campaign", "Affiliate Program Q3", "Sponsored Content", "UGC Job #42", "Creator Collab"],
  Applications: ["Application for Brand Deal", "Application for UGC Job", "Sponsorship Request", "Collab Proposal"],
  Reports: ["Report #1024", "Report #1025", "Report #1026", "Report #1027"],
  Settings: ["Site Settings", "Email Config", "Security Settings", "Feature Flags"],
  Referral: ["Referral Program Settings", "XP Configuration", "Leaderboard Reset"],
};

const detailTemplates: Record<ActivityAction, string> = {
  Login: "Admin logged into the dashboard from {ip}",
  Logout: "Admin logged out of the dashboard",
  Create: "Created new {module} entry: {target}",
  Update: "Updated {module} record: {target}",
  Delete: "Deleted {module} entry: {target}",
  Approve: "Approved {module}: {target}",
  Reject: "Rejected {module}: {target}",
  Suspend: "Suspended {module}: {target}",
  Restore: "Restored {module}: {target}",
};

function randomDate(daysBack: number): string {
  const d = new Date(Date.now() - Math.floor(Math.random() * daysBack * 24 * 60 * 60 * 1000));
  return d.toISOString();
}

function randomIp(): string {
  return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
}

function generateActivity(count: number): ActivityEntry[] {
  return Array.from({ length: count }, (_, i) => {
    const adminIdx = Math.floor(Math.random() * adminNames.length);
    const action = actions[Math.floor(Math.random() * actions.length)];
    const module = modules[Math.floor(Math.random() * modules.length)];
    const targets = targetsByModule[module];
    const target = targets[Math.floor(Math.random() * targets.length)];
    const status = Math.random() > 0.15 ? "Success" : Math.random() > 0.5 ? "Failure" : "Pending";
    const ip = randomIp();

    return {
      id: `act-${String(i + 1).padStart(4, "0")}`,
      adminName: adminNames[adminIdx],
      adminEmail: adminEmails[adminIdx],
      action,
      module,
      target,
      targetId: `${module.toLowerCase().slice(0, 3)}-${Math.floor(Math.random() * 9000 + 1000)}`,
      status: status as ActivityStatus,
      details: detailTemplates[action]
        .replace("{module}", module)
        .replace("{target}", target)
        .replace("{ip}", ip),
      ipAddress: ip,
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      createdAt: randomDate(90),
    };
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

const allActivity = generateActivity(250);

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

  const search = options?.search?.toLowerCase().trim() || "";
  const action = options?.action || "all";
  const module = options?.module || "all";
  const status = options?.status || "all";
  const dateFrom = options?.dateFrom;
  const dateTo = options?.dateTo;
  const page = options?.page || 1;
  const pageSize = options?.pageSize || 15;

  let filtered = [...allActivity];

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

export async function getAdminActivityById(id: string): Promise<ActivityEntry | null> {
  const admin = await getAdminUser();
  if (!admin) return null;

  return allActivity.find((e) => e.id === id) ?? null;
}

export async function getAdminActivitySummary() {
  const admin = await getAdminUser();
  if (!admin) {
    return { total: 0, byAction: {} as Record<string, number>, byModule: {} as Record<string, number>, byStatus: {} as Record<string, number>, last24h: 0 };
  }
  const byAction: Record<string, number> = {};
  const byModule: Record<string, number> = {};
  const byStatus: Record<string, number> = {};

  for (const e of allActivity) {
    byAction[e.action] = (byAction[e.action] || 0) + 1;
    byModule[e.module] = (byModule[e.module] || 0) + 1;
    byStatus[e.status] = (byStatus[e.status] || 0) + 1;
  }

  return {
    total: allActivity.length,
    byAction,
    byModule,
    byStatus,
    last24h: allActivity.filter(
      (e) => new Date(e.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000)
    ).length,
  };
}
