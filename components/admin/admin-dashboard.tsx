import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { getAdminStats, getLatestRegistrations, getAdminLatestOpportunities } from "@/lib/actions/admin";
import { getLiveActivity } from "@/lib/actions/homepage";

interface Props {
  user: User;
  adminRole: string;
}

export async function AdminDashboard({ user, adminRole }: Props) {
  const stats = await getAdminStats();
  const registrations = await getLatestRegistrations();
  const latestOpportunities = await getAdminLatestOpportunities();
  const activity = await getLiveActivity();

  return (
    <div className="mx-auto max-w-6xl">
      {/* Stats Grid */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {[
          {
            label: "Total Users",
            value: stats.totalUsers,
            icon: (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-3.835-1.06-4.342-2.215-.514-1.166.157-2.59 1.46-3.12a8.833 8.833 0 014.633-.395M15 8.25a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            ),
            color: "purple",
          },
          {
            label: "Total Creators",
            value: stats.totalCreators,
            icon: (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            ),
            color: "cyan",
          },
          {
            label: "Total Brands",
            value: stats.totalBrands,
            icon: (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
              </svg>
            ),
            color: "indigo",
          },
          {
            label: "Total Opps",
            value: stats.totalOpportunities,
            icon: (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.181 2.181 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.181 2.181 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
              </svg>
            ),
            color: "purple",
          },
          {
            label: "Pending Apps",
            value: stats.pendingApplications,
            icon: (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ),
            color: "amber",
          },
          {
            label: "Active Opps",
            value: stats.activeOpportunities,
            icon: (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ),
            color: "emerald",
          },
          {
            label: "Total Reports",
            value: stats.totalReports,
            icon: (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
              </svg>
            ),
            color: "red",
          },
          {
            label: "Total Messages",
            value: stats.totalMessages,
            icon: (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
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
                    : stat.color === "cyan" ? "text-cyan-500"
                    : stat.color === "indigo" ? "text-indigo-500"
                    : stat.color === "emerald" ? "text-emerald-500"
                    : stat.color === "red" ? "text-red-500"
                    : "text-amber-500"
                }`}>{stat.icon}</span>
                <p className="text-[10px] sm:text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">{stat.label}</p>
              </div>
              <p className={`mt-2 sm:mt-3 text-2xl sm:text-3xl font-extrabold ${
                stat.color === "purple" ? "text-purple-600 dark:text-purple-400"
                  : stat.color === "cyan" ? "text-cyan-600 dark:text-cyan-400"
                  : stat.color === "indigo" ? "text-indigo-600 dark:text-indigo-400"
                  : stat.color === "emerald" ? "text-emerald-600 dark:text-emerald-400"
                  : stat.color === "red" ? "text-red-600 dark:text-red-400"
                  : "text-amber-600 dark:text-amber-400"
              }`}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity + Latest Registrations Row */}
      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Recent Activity</h2>
          </div>
          <div className="space-y-3">
            {activity.opportunities.length === 0 && activity.applications.length === 0 && activity.brands.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-8 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">No recent activity</p>
              </div>
            ) : (
              <>
                {activity.opportunities.slice(0, 3).map((opp) => {
                  const brand = opp.brands as unknown as { company_name: string } | null;
                  return (
                    <div key={opp.id} className="flex items-start gap-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm transition-all hover:shadow-md">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                        <svg className="h-4 w-4 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{opp.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {brand?.company_name ?? "Unknown brand"} · {opp.published_at ? new Date(opp.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : ""}
                        </p>
                      </div>
                    </div>
                  );
                })}
                {activity.applications.slice(0, 2).map((app) => {
                  const opp = app.opportunities as unknown as { title: string } | null;
                  const profile = app.profiles as unknown as { full_name: string } | null;
                  return (
                    <div key={app.id} className="flex items-start gap-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm transition-all hover:shadow-md">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
                        <svg className="h-4 w-4 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-3.835-1.06-4.342-2.215-.514-1.166.157-2.59 1.46-3.12a8.833 8.833 0 014.633-.395" />
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{profile?.full_name ?? "A user"} applied</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {opp?.title ?? "an opportunity"} · {new Date(app.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </p>
                      </div>
                    </div>
                  );
                })}
                {activity.brands.slice(0, 1).map((brand) => (
                  <div key={brand.id} className="flex items-start gap-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm transition-all hover:shadow-md">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-100 dark:bg-cyan-900/30">
                      <svg className="h-4 w-4 text-cyan-600 dark:text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75" />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{brand.company_name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        New brand registered · {new Date(brand.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </p>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </section>

        {/* Latest Registrations */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Latest Registrations</h2>
          </div>
          <div className="space-y-3">
            {registrations.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-8 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">No registrations yet</p>
              </div>
            ) : (
              registrations.map((profile) => (
                <div key={profile.id} className="flex items-center gap-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm transition-all hover:shadow-md">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white shadow-sm ${
                    profile.role === "brand" ? "bg-gradient-to-br from-cyan-600 to-cyan-400" : "bg-gradient-to-br from-purple-600 to-cyan-500"
                  }`}>
                    {profile.avatar_url ? (
                      <img src={profile.avatar_url} alt="" className="h-full w-full rounded-xl object-cover" />
                    ) : (
                      profile.full_name?.charAt(0)?.toUpperCase() ?? "?"
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-bold text-gray-900 dark:text-gray-100">
                        {profile.full_name || profile.email?.split("@")[0] || "Unknown"}
                      </p>
                      {profile.is_verified && (
                        <span className="shrink-0 rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                          ✓
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {profile.role === "brand" ? "Brand" : "Creator"} · {new Date(profile.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      {/* Latest Opportunities + Quick Actions Row */}
      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        {/* Latest Opportunities */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Latest Opportunities</h2>
          </div>
          <div className="space-y-3">
            {latestOpportunities.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-8 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">No opportunities yet</p>
              </div>
            ) : (
              latestOpportunities.map((opp) => (
                <div key={opp.id} className="flex items-center gap-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm transition-all hover:shadow-md">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-100 to-cyan-100 dark:from-purple-900/30 dark:to-cyan-900/30">
                    <svg className="h-4 w-4 text-purple-500 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-gray-900 dark:text-gray-100">{opp.title}</p>
                    <div className="mt-0.5 flex items-center gap-2">
                      <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{opp.opportunity_type?.replace(/_/g, " ")}</p>
                      <span className={`inline-flex rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                        opp.status === "active" ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                          : opp.status === "draft" ? "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                          : opp.status === "paused" ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                          : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                      }`}>
                        {opp.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-gray-100">Quick Actions</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { title: "View All Users", desc: "Browse platform users and their roles", href: "/admin/users", from: "from-purple-600", to: "to-cyan-500" },
              { title: "View All Brands", desc: "See all brand accounts and their status", href: "/admin/brands", from: "from-cyan-600", to: "to-cyan-400" },
              { title: "View Opportunities", desc: "Monitor all platform opportunities", href: "/admin/opportunities", from: "from-purple-700", to: "to-purple-500" },
              { title: "View Applications", desc: "Review pending and submitted applications", href: "/admin/applications", from: "from-amber-600", to: "to-amber-400" },
            ].map((action) => (
              <Link
                key={action.title}
                href={action.href}
                className="group relative overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-purple-200/50 dark:hover:border-purple-800/50 hover:-translate-y-0.5"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50/0 to-cyan-50/0 dark:from-purple-900/0 dark:to-cyan-900/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="relative">
                  <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${action.from} ${action.to} shadow-lg shadow-purple-500/20 transition-transform duration-200 group-hover:scale-110`}>
                    <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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

      {/* Admin Info */}
      <div className="mb-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg shadow-amber-500/20">
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Signed in as <span className="text-amber-600 dark:text-amber-400">{adminRole.replace(/_/g, " ")}</span>
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {user.email}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
