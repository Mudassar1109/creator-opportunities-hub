import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient, getUserWithRole } from "@/lib/supabase/server";
import { DashboardLayout } from "@/components/dashboard-layout";
import { OpportunityActions } from "./actions-menu";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Manage Opportunities | CreatorHub",
  description: "Manage your brand opportunities.",
};

export default async function BrandOpportunitiesPage() {
  const result = await getUserWithRole();
  if (!result) redirect("/login");
  if (result.role !== "brand") redirect("/dashboard");

  const supabase = await createClient();
  const user = result.user;

  // Get brands owned by user
  const { data: brands } = await supabase
    .from("brands")
    .select("id, company_name")
    .eq("user_id", user.id);

  if (!brands || brands.length === 0) {
    return (
      <DashboardLayout>
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
          <h1 className="text-2xl font-bold text-gray-900">Your Opportunities</h1>
          <div className="mt-8 rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
            <p className="text-sm font-semibold text-gray-900">No brands registered</p>
            <p className="mt-1 text-sm text-gray-500">You need to register a brand before posting opportunities.</p>
            <Link href="/dashboard/profile" className="mt-4 inline-block text-sm font-semibold text-purple-600 hover:text-purple-700">
              Complete your profile first
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const brandIds = brands.map((b) => b.id);
  const brandMap = Object.fromEntries(brands.map((b) => [b.id, b.company_name]));

  // Get all opportunities for these brands
  const { data: opportunities } = await supabase
    .from("opportunities")
    .select("*")
    .in("brand_id", brandIds)
    .order("created_at", { ascending: false });

  const statusColors: Record<string, string> = {
    draft: "bg-gray-100 text-gray-600",
    active: "bg-green-100 text-green-700",
    paused: "bg-amber-100 text-amber-700",
    closed: "bg-red-100 text-red-700",
    expired: "bg-gray-100 text-gray-500",
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Your Opportunities</h1>
            <p className="mt-1 text-sm text-gray-500">Manage all your brand opportunities.</p>
          </div>
          <Link
            href="/dashboard/opportunities/new"
            className="rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-purple-700"
          >
            + Create Opportunity
          </Link>
        </div>

        {/* Opportunities List */}
        <div className="mt-6 space-y-3">
          {opportunities && opportunities.length > 0 ? (
            opportunities.map((opp) => (
              <div key={opp.id} className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate text-sm font-bold text-gray-900">{opp.title}</h3>
                      <span className={`shrink-0 rounded-md px-2 py-0.5 text-[11px] font-semibold ${statusColors[opp.status] || "bg-gray-100 text-gray-600"}`}>
                        {opp.status}
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                      <span>{brandMap[opp.brand_id] || "Brand"}</span>
                      <span className="capitalize">{opp.opportunity_type.replace(/_/g, " ")}</span>
                      <span>{opp.applications_count} applications</span>
                      <span>{new Date(opp.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/dashboard/opportunities/${opp.id}`}
                      className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:border-purple-300 hover:text-purple-700"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/dashboard/opportunities/${opp.id}/applicants`}
                      className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:border-purple-300 hover:text-purple-700"
                    >
                      Applicants ({opp.applications_count})
                    </Link>
                    <OpportunityActions opportunityId={opp.id} status={opp.status} />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
              <p className="text-sm font-semibold text-gray-900">No opportunities yet</p>
              <p className="mt-1 text-sm text-gray-500">Create your first opportunity to start finding creators.</p>
              <Link href="/dashboard/opportunities/new" className="mt-4 inline-block text-sm font-semibold text-purple-600 hover:text-purple-700">
                Create opportunity
              </Link>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
