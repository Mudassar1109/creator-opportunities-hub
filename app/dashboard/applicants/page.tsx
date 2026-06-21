import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient, getUserWithRole } from "@/lib/supabase/server";
import { DashboardLayout } from "@/components/dashboard-layout";
import { ApplicantActions } from "../opportunities/[id]/applicants/applicant-actions";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "All Applicants | CreatorHub",
  description: "View all applicants across your brand opportunities.",
};

export default async function BrandApplicantsPage() {
  const result = await getUserWithRole();
  if (!result) redirect("/login");
  if (result.role !== "brand") redirect("/dashboard");

  const supabase = await createClient();

  // Get brands owned by user
  const { data: brands } = await supabase
    .from("brands")
    .select("id, company_name")
    .eq("user_id", result.user.id);

  if (!brands || brands.length === 0) {
    return (
      <DashboardLayout>
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
          <h1 className="text-2xl font-bold text-gray-900">All Applicants</h1>
          <div className="mt-8 rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
            <p className="text-sm font-semibold text-gray-900">No brands registered</p>
            <p className="mt-1 text-sm text-gray-500">Register your brand first to start receiving applications.</p>
            <Link href="/dashboard/company" className="mt-4 inline-block text-sm font-semibold text-purple-600 hover:text-purple-700">
              Set up company profile
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const brandIds = brands.map((b) => b.id);

  // Get all opportunities for these brands
  const { data: opportunities } = await supabase
    .from("opportunities")
    .select("id, title")
    .in("brand_id", brandIds);

  const oppIds = opportunities?.map((o) => o.id) ?? [];
  const oppMap = Object.fromEntries((opportunities ?? []).map((o) => [o.id, o.title]));

  // Get all applications across these opportunities
  const { data: applications } = oppIds.length > 0
    ? await supabase
        .from("applications")
        .select("*, profiles(id, full_name, username, avatar_url, bio, headline, follower_count, platforms, niches)")
        .in("opportunity_id", oppIds)
        .order("created_at", { ascending: false })
    : { data: [] };

  const statusColors: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700",
    under_review: "bg-purple-100 text-purple-700",
    accepted: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
    withdrawn: "bg-gray-100 text-gray-500",
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <h1 className="text-2xl font-bold text-gray-900">All Applicants</h1>
        <p className="mt-1 text-sm text-gray-500">
          {(applications?.length ?? 0)} applicant{(applications?.length ?? 0) !== 1 ? "s" : ""} across all your opportunities.
        </p>

        <div className="mt-6 space-y-4">
          {applications && applications.length > 0 ? (
            applications.map((app) => {
              const creator = app.profiles as unknown as {
                id: string;
                full_name: string;
                username: string;
                avatar_url?: string | null;
                bio?: string | null;
                headline?: string | null;
                follower_count: number;
                platforms: string[];
                niches: string[];
              };

              return (
                <div key={app.id} className="rounded-xl border border-gray-200 bg-white p-5">
                  {/* Creator Header */}
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-purple-100 text-sm font-bold text-purple-600 overflow-hidden">
                      {creator?.avatar_url ? (
                        <img src={creator.avatar_url} alt="" className="h-full w-full object-cover" />
                      ) : (
                        creator?.full_name?.[0]?.toUpperCase() || "?"
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-gray-900">{creator?.full_name || "Unknown"}</h3>
                        <span className={`rounded-md px-2 py-0.5 text-[11px] font-semibold ${statusColors[app.status] || "bg-gray-100 text-gray-600"}`}>
                          {app.status.replace(/_/g, " ")}
                        </span>
                      </div>
                      {creator?.username && <p className="text-xs text-gray-500">@{creator.username}</p>}
                      <p className="mt-1 text-xs font-medium text-purple-600">
                        {oppMap[app.opportunity_id] || "Opportunity"}
                      </p>
                    </div>
                    <ApplicantActions applicationId={app.id} currentStatus={app.status} />
                  </div>

                  {/* Creator Stats */}
                  {creator && (
                    <div className="mt-4 grid grid-cols-3 gap-3">
                      <div className="rounded-lg bg-gray-50 p-2 text-center">
                        <p className="text-lg font-bold text-gray-900">{(creator.follower_count || 0).toLocaleString()}</p>
                        <p className="text-[10px] uppercase text-gray-500">Followers</p>
                      </div>
                      <div className="rounded-lg bg-gray-50 p-2 text-center">
                        <p className="text-lg font-bold text-gray-900">{creator.platforms?.length || 0}</p>
                        <p className="text-[10px] uppercase text-gray-500">Platforms</p>
                      </div>
                      <div className="rounded-lg bg-gray-50 p-2 text-center">
                        <p className="text-lg font-bold text-gray-900">{creator.niches?.length || 0}</p>
                        <p className="text-[10px] uppercase text-gray-500">Niches</p>
                      </div>
                    </div>
                  )}

                  {/* Cover Letter */}
                  {app.cover_letter && (
                    <div className="mt-3 rounded-lg bg-gray-50 p-3">
                      <p className="text-[10px] font-semibold uppercase text-gray-500 mb-1">Cover Letter</p>
                      <p className="text-xs text-gray-700 whitespace-pre-wrap line-clamp-3">{app.cover_letter}</p>
                    </div>
                  )}

                  <p className="mt-3 text-[10px] text-gray-400">
                    Applied {new Date(app.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  </p>
                </div>
              );
            })
          ) : (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
              <p className="text-sm font-semibold text-gray-900">No applicants yet</p>
              <p className="mt-1 text-sm text-gray-500">Applicants will appear here once they apply to your opportunities.</p>
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
