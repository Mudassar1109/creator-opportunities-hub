import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { User } from "@supabase/supabase-js";

interface Props {
  user: User;
}

export async function BrandDashboard({ user }: Props) {
  const supabase = await createClient();

  // Get brands owned by user
  const { data: brands } = await supabase
    .from("brands")
    .select("id, company_name, slug, is_active, is_verified")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const brandIds = brands?.map((b) => b.id) ?? [];

  // Get opportunities for user's brands
  const { data: opportunities } = await supabase
    .from("opportunities")
    .select("*")
    .in("brand_id", brandIds.length > 0 ? brandIds : ["00000000-0000-0000-0000-000000000000"])
    .order("created_at", { ascending: false });

  const totalOpportunities = opportunities?.length ?? 0;
  const activeOpportunities = opportunities?.filter((o) => o.status === "active").length ?? 0;
  const totalApplications = opportunities?.reduce((sum, o) => sum + (o.applications_count ?? 0), 0) ?? 0;

  // Get recent applicants across all brand opportunities
  let recentApplicants: Array<{
    id: string;
    status: string;
    created_at: string;
    cover_letter: string | null;
    opportunity_title: string;
    creator_name: string;
    creator_email: string;
  }> = [];

  if (brandIds.length > 0) {
    const { data: apps } = await supabase
      .from("applications")
      .select("*, opportunities(title), profiles(full_name, email)")
      .in("opportunity_id", opportunities?.map((o) => o.id) ?? [])
      .order("created_at", { ascending: false })
      .limit(5);

    recentApplicants = (apps ?? []).map((app) => {
      const opp = app.opportunities as unknown as { title: string } | null;
      const creator = app.profiles as unknown as { full_name: string; email: string } | null;
      return {
        id: app.id,
        status: app.status,
        created_at: app.created_at,
        cover_letter: app.cover_letter,
        opportunity_title: opp?.title ?? "Opportunity",
        creator_name: creator?.full_name ?? creator?.email ?? "Unknown",
        creator_email: creator?.email ?? "",
      };
    });
  }

  const hasNoBrand = !brands || brands.length === 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      {/* No Brand Warning */}
      {hasNoBrand && (
        <div className="mb-6 rounded-2xl border border-amber-200 dark:border-amber-800/40 bg-amber-50 dark:bg-amber-900/10 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30">
              <svg className="h-5 w-5 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-amber-900 dark:text-amber-200">Set up your company profile</h3>
              <p className="mt-0.5 text-sm text-amber-700 dark:text-amber-400">
                Register your brand to start posting opportunities and finding creators.
              </p>
              <Link
                href="/dashboard/company"
                className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 px-4 py-2 text-xs font-bold text-white shadow-md shadow-purple-500/20 transition-all hover:shadow-lg hover:-translate-y-0.5"
              >
                Set up company
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-4">
        {[
          {
            label: "Total Opps",
            value: totalOpportunities,
            icon: (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.181 2.181 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.181 2.181 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
              </svg>
            ),
            color: "purple",
          },
          {
            label: "Active Opps",
            value: activeOpportunities,
            icon: (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ),
            color: "emerald",
          },
          {
            label: "Applications",
            value: totalApplications,
            icon: (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-3.835-1.06-4.342-2.215-.514-1.166.157-2.59 1.46-3.12a8.833 8.833 0 014.633-.395M18 9.75a3 3 0 11-6 0 3 3 0 016 0zM6.75 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            ),
            color: "cyan",
          },
          {
            label: "Brands",
            value: brands?.length ?? 0,
            icon: (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
              </svg>
            ),
            color: "indigo",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="group relative overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 sm:p-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-purple-200/50 dark:hover:border-purple-800/50 hover:-translate-y-0.5"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50/0 to-cyan-50/0 dark:from-purple-900/0 dark:to-cyan-900/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative">
              <div className="flex items-center gap-2">
                <span className={`shrink-0 ${
                  stat.color === "purple" ? "text-purple-500"
                    : stat.color === "emerald" ? "text-emerald-500"
                    : stat.color === "cyan" ? "text-cyan-500"
                    : "text-indigo-500"
                }`}>{stat.icon}</span>
                <p className="text-[10px] sm:text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">{stat.label}</p>
              </div>
              <p className={`mt-2 sm:mt-3 text-2xl sm:text-3xl font-extrabold ${
                stat.color === "purple" ? "text-purple-600 dark:text-purple-400"
                  : stat.color === "emerald" ? "text-emerald-600 dark:text-emerald-400"
                  : stat.color === "cyan" ? "text-cyan-600 dark:text-cyan-400"
                  : "text-indigo-600 dark:text-indigo-400"
              }`}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Brands */}
      {brands && brands.length > 0 && (
        <section className="mb-6 sm:mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Your Brands</h2>
            <Link href="/dashboard/company" className="text-sm font-semibold text-purple-600 dark:text-purple-400 transition hover:text-purple-700 dark:hover:text-purple-300">
              Manage company
            </Link>
          </div>
          <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {brands.map((brand) => (
              <div key={brand.id} className="group flex items-center gap-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 sm:p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:border-purple-200/50 dark:hover:border-purple-800/50">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-cyan-500 text-sm font-bold text-white shadow-md">
                  {brand.company_name[0]?.toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="truncate text-sm font-bold text-gray-900 dark:text-gray-100">{brand.company_name}</h4>
                  <div className="mt-0.5 flex items-center gap-2">
                    {brand.is_verified && <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Verified</span>}
                    <span className={`text-xs ${brand.is_active ? "text-gray-500 dark:text-gray-400" : "text-red-500 dark:text-red-400"}`}>
                      {brand.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recent Applicants */}
      <section className="mb-6 sm:mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Recent Applicants</h2>
          {recentApplicants.length > 0 && (
            <Link href="/dashboard/applicants" className="text-sm font-semibold text-purple-600 dark:text-purple-400 transition hover:text-purple-700 dark:hover:text-purple-300">
              View all
            </Link>
          )}
        </div>
        {recentApplicants.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-8 sm:p-12 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-100 to-cyan-100 dark:from-purple-900/30 dark:to-cyan-900/30">
              <svg className="h-8 w-8 text-purple-500 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-3.835-1.06-4.342-2.215-.514-1.166.157-2.59 1.46-3.12a8.833 8.833 0 014.633-.395M18 9.75a3 3 0 11-6 0 3 3 0 016 0zM6.75 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="mt-4 text-sm font-bold text-gray-900 dark:text-gray-100">No applicants yet</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Once creators apply to your opportunities, they&apos;ll appear here.
            </p>
            <Link href="/dashboard/opportunities/new" className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-purple-500/20 transition-all hover:shadow-lg hover:-translate-y-0.5">
              Create opportunity
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentApplicants.map((app) => (
              <div key={app.id} className="group flex flex-col gap-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 sm:p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:border-purple-200/50 dark:hover:border-purple-800/50 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 flex-1">
                  <h4 className="truncate text-sm font-bold text-gray-900 dark:text-gray-100">{app.creator_name}</h4>
                  <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                    {app.opportunity_title}
                    {" · "}
                    {new Date(app.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
                <span className={`inline-flex w-fit rounded-lg px-3 py-1 text-xs font-bold ${
                  app.status === "accepted" ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                    : app.status === "rejected" ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                    : app.status === "under_review" ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400"
                    : "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                }`}>
                  {app.status.replace(/_/g, " ")}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Quick Actions */}
      <section className="pb-8">
        <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-gray-100">Quick Actions</h2>
        <div className="grid gap-3 sm:gap-4 sm:grid-cols-3">
          {[
            { title: "Create Opportunity", desc: "Post a new opportunity for creators", href: "/dashboard/opportunities/new", from: "from-purple-600", to: "to-cyan-500" },
            { title: "Manage Opportunities", desc: "Edit, pause, or close your opportunities", href: "/dashboard/opportunities", from: "from-purple-700", to: "to-purple-500" },
            { title: "Company Profile", desc: "Update your brand and company info", href: "/dashboard/company", from: "from-cyan-600", to: "to-cyan-400" },
          ].map((action) => (
            <Link
              key={action.title}
              href={action.href}
              className="group relative overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 sm:p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-purple-200/50 dark:hover:border-purple-800/50 hover:-translate-y-0.5"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50/0 to-cyan-50/0 dark:from-purple-900/0 dark:to-cyan-900/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="relative">
                <div className={`mb-3 sm:mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${action.from} ${action.to} shadow-lg shadow-purple-500/20 transition-transform duration-200 group-hover:scale-110`}>
                  <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">{action.title}</h3>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{action.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
