import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { DashboardLayout } from "@/components/dashboard-layout";
import { WelcomeBanner } from "@/components/welcome-banner";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Dashboard | CreatorHub",
  description: "Your creator dashboard - manage profile, applications, and opportunities.",
};

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: applications } = await supabase
    .from("applications")
    .select("*, opportunities(title, brand_id, opportunity_type, status)")
    .eq("creator_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  const { data: brands } = await supabase
    .from("brands")
    .select("id, company_name, slug, is_active, is_verified")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const { count: totalApplications } = await supabase
    .from("applications")
    .select("*", { count: "exact", head: true })
    .eq("creator_id", user.id);

  // Application status breakdown
  const { data: allAppStatuses } = await supabase
    .from("applications")
    .select("status")
    .eq("creator_id", user.id);

  const appCounts = {
    pending: allAppStatuses?.filter((a) => a.status === "pending").length ?? 0,
    under_review: allAppStatuses?.filter((a) => a.status === "under_review").length ?? 0,
    accepted: allAppStatuses?.filter((a) => a.status === "accepted").length ?? 0,
    rejected: allAppStatuses?.filter((a) => a.status === "rejected").length ?? 0,
  };

  const { count: activeOpportunities } = await supabase
    .from("opportunities")
    .select("*", { count: "exact", head: true })
    .eq("status", "active");

  const followerCount = profile?.follower_count ?? 0;

  const profileCompletion = profile
    ? (() => {
        const fields = [
          profile.full_name, profile.username, profile.avatar_url,
          profile.headline, profile.bio, profile.country, profile.city,
          profile.website, profile.platforms.length > 0, profile.niches.length > 0,
          profile.follower_count > 0,
          profile.youtube_url || profile.tiktok_url || profile.instagram_url || profile.twitter_url,
        ];
        return Math.round((fields.filter(Boolean).length / fields.length) * 100);
      })()
    : 0;

  const hasNoProfile = !profile?.full_name && !profile?.username;
  const hasNoApplications = !applications || applications.length === 0;

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* Welcome Banner */}
        <div className="mb-6 sm:mb-8">
          <WelcomeBanner
            fullName={profile?.full_name}
            avatarUrl={profile?.avatar_url}
            email={user.email}
          />
        </div>

        {/* No Profile Warning */}
        {hasNoProfile && (
          <div className="mb-6 rounded-2xl border border-amber-200 dark:border-amber-800/40 bg-amber-50 dark:bg-amber-900/10 p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30">
                <svg className="h-5 w-5 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-amber-900 dark:text-amber-200">Complete your profile</h3>
                <p className="mt-0.5 text-sm text-amber-700 dark:text-amber-400">
                  Set up your creator profile to unlock brand deals and get matched with opportunities.
                </p>
                <Link
                  href="/dashboard/profile"
                  className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 px-4 py-2 text-xs font-bold text-white shadow-md shadow-purple-500/20 transition-all hover:shadow-lg hover:-translate-y-0.5"
                >
                  Set up profile
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
              label: "Applications",
              value: totalApplications ?? 0,
              icon: (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              ),
              color: "purple",
            },
            {
              label: "Opportunities",
              value: activeOpportunities ?? 0,
              icon: (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.181 2.181 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.181 2.181 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
                </svg>
              ),
              color: "cyan",
            },
            {
              label: "Followers",
              value: followerCount > 999 ? `${(followerCount / 1000).toFixed(1)}K` : followerCount,
              icon: (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-3.835-1.06-4.342-2.215-.514-1.166.157-2.59 1.46-3.12a8.833 8.833 0 014.633-.395M18 9.75a3 3 0 11-6 0 3 3 0 016 0zM6.75 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              ),
              color: "indigo",
            },
            {
              label: "Profile",
              value: `${profileCompletion}%`,
              icon: (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              ),
              color: profileCompletion >= 80 ? "emerald" : profileCompletion >= 40 ? "amber" : "red",
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

        {/* Application Status Breakdown */}
        {(appCounts.pending > 0 || appCounts.accepted > 0 || appCounts.rejected > 0) && (
          <div className="mb-6 grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-center">
              <p className="text-2xl font-bold text-amber-700">{appCounts.pending + appCounts.under_review}</p>
              <p className="text-xs font-medium text-amber-600">Pending</p>
            </div>
            <div className="rounded-xl border border-green-200 bg-green-50 p-3 text-center">
              <p className="text-2xl font-bold text-green-700">{appCounts.accepted}</p>
              <p className="text-xs font-medium text-green-600">Accepted</p>
            </div>
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-center">
              <p className="text-2xl font-bold text-red-700">{appCounts.rejected}</p>
              <p className="text-xs font-medium text-red-600">Rejected</p>
            </div>
          </div>
        )}

        {/* Profile Card */}
        {profile?.full_name && (
          <section className="mb-6 sm:mb-8">
            <div className="group relative overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-purple-200/50 dark:hover:border-purple-800/50">
              <div className="h-20 sm:h-24 bg-gradient-to-r from-purple-600 via-purple-500 to-cyan-500" />
              <div className="px-5 pb-5 sm:px-8 sm:pb-8">
                <div className="-mt-8 sm:-mt-10 flex flex-col gap-4 sm:flex-row sm:items-end">
                  {/* Avatar */}
                  <div className="flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-2xl border-4 border-white dark:border-gray-900 bg-gradient-to-br from-purple-600 to-cyan-500 text-xl sm:text-2xl font-bold text-white shadow-lg">
                    {profile.avatar_url ? (
                      <img src={profile.avatar_url} alt="" className="h-full w-full rounded-xl object-cover" />
                    ) : profile.full_name ? (
                      profile.full_name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
                    ) : (
                      user.email?.[0]?.toUpperCase() ?? "?"
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
                        {profile.full_name}
                      </h3>
                      {profile.is_verified && (
                        <span className="rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">Verified</span>
                      )}
                    </div>
                    <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                      @{profile.username || user.email?.split("@")[0]}
                    </p>
                  </div>

                  <Link
                    href="/dashboard/profile"
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-purple-500/20 transition-all duration-200 hover:shadow-xl hover:shadow-purple-500/30 hover:-translate-y-0.5"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>
                    Edit Profile
                  </Link>
                </div>

                {profile.headline && (
                  <p className="mt-3 text-sm font-medium text-gray-700 dark:text-gray-300">{profile.headline}</p>
                )}
                {profile.bio && (
                  <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">{profile.bio}</p>
                )}

                {/* Tags */}
                {(profile.platforms?.length || profile.niches?.length) ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {profile.platforms?.map((p) => (
                      <span key={p} className="rounded-lg bg-purple-50 dark:bg-purple-900/20 px-2.5 py-1 text-xs font-semibold text-purple-700 dark:text-purple-400">{p}</span>
                    ))}
                    {profile.niches?.map((n) => (
                      <span key={n} className="rounded-lg bg-cyan-50 dark:bg-cyan-900/20 px-2.5 py-1 text-xs font-semibold text-cyan-700 dark:text-cyan-400">{n}</span>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </section>
        )}

        {/* Recent Applications */}
        <section className="mb-6 sm:mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Recent Applications</h2>
            {applications && applications.length > 0 && (
              <Link href="/dashboard/applications" className="text-sm font-semibold text-purple-600 dark:text-purple-400 transition hover:text-purple-700 dark:hover:text-purple-300">
                View all
              </Link>
            )}
          </div>
          {hasNoApplications ? (
            <div className="rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-8 sm:p-12 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-100 to-cyan-100 dark:from-purple-900/30 dark:to-cyan-900/30">
                <svg className="h-8 w-8 text-purple-500 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <h3 className="mt-4 text-sm font-bold text-gray-900 dark:text-gray-100">No applications yet</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                You haven&apos;t applied to any opportunities yet. Browse available opportunities and start applying.
              </p>
              <Link href="/" className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-purple-500/20 transition-all hover:shadow-lg hover:-translate-y-0.5">
                Browse opportunities
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {applications.map((app) => {
                const opp = app.opportunities as { title?: string; opportunity_type?: string } | null;
                return (
                  <div key={app.id} className="group flex flex-col gap-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 sm:p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:border-purple-200/50 dark:hover:border-purple-800/50 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <h4 className="truncate text-sm font-bold text-gray-900 dark:text-gray-100">{opp?.title || "Opportunity"}</h4>
                      <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                        {opp?.opportunity_type?.replace(/_/g, " ") || "�"}
                        {" � "}
                        {new Date(app.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    </div>
                    <span className={`inline-flex w-fit rounded-lg px-3 py-1 text-xs font-bold ${
                      app.status === "accepted" ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                        : app.status === "rejected" ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                        : app.status === "under_review" ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400"
                        : app.status === "withdrawn" ? "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                        : "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                    }`}>
                      {app.status.replace(/_/g, " ")}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Brands */}
        {brands && brands.length > 0 && (
          <section className="mb-6 sm:mb-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Your Brands</h2>
              <Link href="/dashboard/brands" className="text-sm font-semibold text-purple-600 dark:text-purple-400 transition hover:text-purple-700">
                Manage brands
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

        {/* Recommended Opportunities - Empty state */}
        {(!profile?.platforms?.length && !profile?.niches?.length) && (
          <section className="mb-6 sm:mb-8">
            <div className="rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-8 sm:p-12 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-100 to-purple-100 dark:from-cyan-900/30 dark:to-purple-900/30">
                <svg className="h-8 w-8 text-cyan-500 dark:text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.181 2.181 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.181 2.181 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
                </svg>
              </div>
              <h3 className="mt-4 text-sm font-bold text-gray-900 dark:text-gray-100">No opportunities recommended</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Add platforms and niches to your profile so we can match you with relevant opportunities.
              </p>
              <Link href="/dashboard/profile" className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-purple-600 dark:text-purple-400 transition hover:text-purple-700">
                Complete your profile
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </section>
        )}

        {/* Quick Actions */}
        <section className="pb-8">
          <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-gray-100">Quick Actions</h2>
          <div className="grid gap-3 sm:gap-4 sm:grid-cols-3">
            {[
              { title: "Browse Opportunities", desc: "Find brand deals, sponsorships, and creator jobs", href: "/", from: "from-purple-600", to: "to-cyan-500" },
              { title: "Complete Your Profile", desc: "Add platforms, niches, and portfolio links", href: "/dashboard/profile", from: "from-purple-700", to: "to-purple-500" },
              { title: "Post an Opportunity", desc: "Are you a brand? Find creators for your campaign", href: "/post", from: "from-cyan-600", to: "to-cyan-400" },
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
    </DashboardLayout>
  );
}
