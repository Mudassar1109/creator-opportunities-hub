import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { DashboardLayout } from "@/components/dashboard-layout";
import { WithdrawButton } from "./withdraw-button";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "My Applications | CreatorHub",
  description: "Track all your opportunity applications.",
};

interface PageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function ApplicationsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const statusFilter = params.status || "all";

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Get all applications with opportunity info
  let query = supabase
    .from("applications")
    .select("*, opportunities(title, slug, brand_id, opportunity_type, status)")
    .eq("creator_id", user.id)
    .order("created_at", { ascending: false });

  if (statusFilter !== "all") {
    query = query.eq("status", statusFilter as import("@/lib/database.types").ApplicationStatus);
  }

  const { data: applications } = await query;

  // Get counts by status
  const { data: allApps } = await supabase
    .from("applications")
    .select("status")
    .eq("creator_id", user.id);

  const counts = {
    all: allApps?.length ?? 0,
    pending: allApps?.filter((a) => a.status === "pending").length ?? 0,
    under_review: allApps?.filter((a) => a.status === "under_review").length ?? 0,
    accepted: allApps?.filter((a) => a.status === "accepted").length ?? 0,
    rejected: allApps?.filter((a) => a.status === "rejected").length ?? 0,
    withdrawn: allApps?.filter((a) => a.status === "withdrawn").length ?? 0,
  };

  // Fetch brand names for all unique brand_ids
  const brandIds = [...new Set(
    applications
      ?.map((a) => (a.opportunities as unknown as { brand_id?: string })?.brand_id)
      .filter(Boolean) as string[]
  )];

  let brandMap: Record<string, string> = {};
  if (brandIds.length > 0) {
    const { data: brands } = await supabase
      .from("brands")
      .select("id, company_name")
      .in("id", brandIds);
    brandMap = Object.fromEntries((brands ?? []).map((b) => [b.id, b.company_name]));
  }

  const tabs = [
    { key: "all", label: "All", count: counts.all },
    { key: "pending", label: "Pending", count: counts.pending },
    { key: "under_review", label: "Under Review", count: counts.under_review },
    { key: "accepted", label: "Accepted", count: counts.accepted },
    { key: "rejected", label: "Rejected", count: counts.rejected },
  ];

  const statusColors: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700",
    under_review: "bg-purple-100 text-purple-700",
    accepted: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
    withdrawn: "bg-gray-100 text-gray-600",
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
        <p className="mt-1 text-sm text-gray-500">Track and manage all your opportunity applications.</p>

        {/* Stats Row */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Total", value: counts.all, color: "text-gray-900" },
            { label: "Pending", value: counts.pending, color: "text-amber-600" },
            { label: "Accepted", value: counts.accepted, color: "text-green-600" },
            { label: "Rejected", value: counts.rejected, color: "text-red-600" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-gray-200 bg-white p-4">
              <p className="text-xs font-medium uppercase text-gray-500">{stat.label}</p>
              <p className={`mt-1 text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="mt-6 flex gap-1 overflow-x-auto border-b border-gray-200 pb-px">
          {tabs.map((tab) => (
            <Link
              key={tab.key}
              href={tab.key === "all" ? "/dashboard/applications" : `/dashboard/applications?status=${tab.key}`}
              className={`whitespace-nowrap rounded-t-lg px-4 py-2.5 text-sm font-medium transition ${
                statusFilter === tab.key
                  ? "border-b-2 border-purple-600 text-purple-700 bg-purple-50/50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              {tab.label} ({tab.count})
            </Link>
          ))}
        </div>

        {/* Applications List */}
        <div className="mt-6 space-y-3">
          {applications && applications.length > 0 ? (
            applications.map((app) => {
              const opp = app.opportunities as unknown as {
                title?: string;
                slug?: string;
                brand_id?: string;
                opportunity_type?: string;
              } | null;
              const brandName = opp?.brand_id ? brandMap[opp.brand_id] : undefined;

              return (
                <div key={app.id} className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="truncate text-sm font-bold text-gray-900">
                          {opp?.title || "Opportunity"}
                        </h3>
                        <span className={`shrink-0 rounded-md px-2 py-0.5 text-[11px] font-semibold ${statusColors[app.status] || "bg-gray-100 text-gray-600"}`}>
                          {app.status.replace(/_/g, " ")}
                        </span>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                        {brandName && <span>{brandName}</span>}
                        {opp?.opportunity_type && (
                          <span className="capitalize">{opp.opportunity_type.replace(/_/g, " ")}</span>
                        )}
                        <span>{new Date(app.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                      </div>
                      {app.cover_letter && (
                        <p className="mt-2 text-xs text-gray-500 line-clamp-2">{app.cover_letter}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {opp?.slug && (
                        <Link
                          href={`/opportunities/${opp.slug}`}
                          className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:border-purple-300 hover:text-purple-700"
                        >
                          View
                        </Link>
                      )}
                      {(app.status === "pending" || app.status === "under_review") && (
                        <WithdrawButton applicationId={app.id} />
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
              <p className="text-sm font-semibold text-gray-900">No applications found</p>
              <p className="mt-1 text-sm text-gray-500">
                {statusFilter !== "all" ? "Try changing the filter." : "Start applying to opportunities."}
              </p>
              <Link href="/opportunities" className="mt-4 inline-block text-sm font-semibold text-purple-600 hover:text-purple-700">
                Browse opportunities
              </Link>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
