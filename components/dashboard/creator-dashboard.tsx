import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { User } from "@supabase/supabase-js";
import type { Profile } from "@/lib/database.types";

interface Props {
  user: User;
  profile: Profile | null;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export async function CreatorDashboard({ user, profile }: Props) {
  const supabase = await createClient();

  const { data: applications } = await supabase
    .from("applications")
    .select("*, opportunities(title, brand_id, opportunity_type, status)")
    .eq("creator_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  const { count: totalApplications } = await supabase
    .from("applications")
    .select("*", { count: "exact", head: true })
    .eq("creator_id", user.id);

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

  const { count: unreadNotifs } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("is_read", false);

  const { count: totalConversations } = await supabase
    .from("conversations")
    .select("*", { count: "exact", head: true })
    .eq("creator_id", user.id);

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

  const displayName = profile?.full_name || user.email?.split("@")[0] || "Creator";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const greeting = getGreeting();

  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (profileCompletion / 100) * circumference;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="mb-6 sm:mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 sm:h-16 sm:w-16">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="h-full w-full rounded-xl object-cover" />
              ) : (
                <span className="text-xl font-bold text-slate-400 sm:text-2xl">{initials}</span>
              )}
            </div>
            <div>
              <p className="text-sm text-slate-500">
                {greeting}
              </p>
              <h1 className="mt-0.5 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                {displayName}
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Here&apos;s what&apos;s happening with your creator profile today.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/notifications"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 transition-all hover:text-indigo-600 hover:border-indigo-200"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
              {unreadNotifs !== null && unreadNotifs > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm">
                  {unreadNotifs > 9 ? "9+" : unreadNotifs}
                </span>
              )}
            </Link>
            <span className="hidden text-sm text-slate-400 sm:block">{today}</span>
          </div>
        </div>
      </div>

      {hasNoProfile && (
        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100">
              <svg className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-amber-900">Complete your profile</h3>
              <p className="mt-0.5 text-sm text-amber-700">
                Set up your creator profile to unlock brand deals and get matched with opportunities.
              </p>
              <Link
                href="/dashboard/profile"
                className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-indigo-700"
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

      <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {[
          { label: "Applications", value: totalApplications ?? 0, color: "indigo",
            icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg> },
          { label: "Pending", value: appCounts.pending + appCounts.under_review, color: "amber",
            icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
          { label: "Accepted", value: appCounts.accepted, color: "emerald",
            icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
          { label: "Unread", value: unreadNotifs ?? 0, color: "rose",
            icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg> },
          { label: "Messages", value: totalConversations ?? 0, color: "blue",
            icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" /></svg> },
          { label: "Profile", value: `${profileCompletion}%`, color: profileCompletion >= 80 ? "emerald" : profileCompletion >= 40 ? "amber" : "rose",
            icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg> },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:border-indigo-200 hover:-translate-y-0.5 sm:p-5"
          >
            <div className="flex items-center gap-2">
              <span className={`shrink-0 ${
                stat.color === "indigo" ? "text-indigo-500"
                  : stat.color === "amber" ? "text-amber-500"
                  : stat.color === "emerald" ? "text-emerald-500"
                  : stat.color === "blue" ? "text-blue-500"
                  : "text-rose-500"
              }`}>{stat.icon}</span>
              <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400 sm:text-xs">{stat.label}</p>
            </div>
            <p className={`mt-2 text-2xl font-extrabold sm:mt-3 sm:text-3xl ${
              stat.color === "indigo" ? "text-indigo-600"
                : stat.color === "amber" ? "text-amber-600"
                : stat.color === "emerald" ? "text-emerald-600"
                : stat.color === "blue" ? "text-blue-600"
                : "text-rose-600"
            }`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {(appCounts.pending > 0 || appCounts.accepted > 0 || appCounts.rejected > 0 || appCounts.under_review > 0) && (
        <div className="mb-6 grid grid-cols-3 gap-2 sm:gap-3">
          {[
            { label: "Pending", count: appCounts.pending + appCounts.under_review, cls: "bg-amber-50 text-amber-700 border-amber-200" },
            { label: "Accepted", count: appCounts.accepted, cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
            { label: "Rejected", count: appCounts.rejected, cls: "bg-rose-50 text-rose-700 border-rose-200" },
          ].filter((s) => s.count > 0).map((s) => (
            <div key={s.label} className={`rounded-xl border px-4 py-3 text-center ${s.cls}`}>
              <p className="text-lg font-bold">{s.count}</p>
              <p className="text-xs font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Recent Applications</h2>
              {applications && applications.length > 0 && (
                <Link href="/dashboard/applications" className="text-sm font-semibold text-indigo-600 transition hover:text-indigo-700">
                  View all
                </Link>
              )}
            </div>
            {hasNoApplications ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center sm:p-12">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50">
                  <svg className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-sm font-bold text-slate-900">No applications yet</h3>
                <p className="mt-1 text-sm text-slate-500">
                  You haven&apos;t applied to any opportunities yet. Browse available opportunities and start applying.
                </p>
                <Link
                  href="/opportunities"
                  className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-indigo-700"
                >
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
                    <Link
                      key={app.id}
                      href={`/opportunities/${app.opportunity_id}`}
                      className="group flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:border-indigo-200 hover:-translate-y-0.5 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="min-w-0 flex-1">
                        <h4 className="truncate text-sm font-bold text-slate-900 group-hover:text-indigo-600">{opp?.title || "Opportunity"}</h4>
                        <p className="mt-0.5 text-xs text-slate-500">
                          {opp?.opportunity_type?.replace(/_/g, " ") || "—"}
                          {" · "}
                          {new Date(app.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </p>
                      </div>
                      <span className={`inline-flex w-fit items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-bold ${
                        app.status === "accepted" ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : app.status === "rejected" ? "bg-rose-50 text-rose-700 border border-rose-200"
                          : app.status === "under_review" ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : app.status === "withdrawn" ? "bg-slate-100 text-slate-600 border border-slate-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}>
                        {app.status === "accepted" && (
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        )}
                        {app.status === "rejected" && (
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                        {app.status === "pending" && (
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                        {app.status === "under_review" && (
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
                          </svg>
                        )}
                        {app.status.replace(/_/g, " ")}
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>

          {(!profile?.platforms?.length && !profile?.niches?.length) && (
            <section>
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center sm:p-12">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50">
                  <svg className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.181 2.181 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.181 2.181 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.007v.008H12v-.008z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-sm font-bold text-slate-900">No opportunities recommended</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Add platforms and niches to your profile so we can match you with relevant opportunities.
                </p>
                <Link
                  href="/dashboard/profile"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 transition hover:text-indigo-700"
                >
                  Complete your profile
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </section>
          )}
        </div>

        <div className="space-y-6">
          {profile?.full_name && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-xl font-bold text-slate-400 shadow-sm">
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt="" className="h-full w-full rounded-xl object-cover" />
                  ) : (
                    profile.full_name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
                  )}
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">
                      {profile.full_name}
                    </h3>
                    {profile.is_verified && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100">
                        <svg className="h-3 w-3 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                        </svg>
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-sm text-slate-500">
                    @{profile.username || user.email?.split("@")[0]}
                  </p>
                </div>
                {profile.headline && (
                  <p className="mt-2 text-sm font-medium text-slate-700">{profile.headline}</p>
                )}
              </div>

              <div className="mt-5 flex flex-col items-center">
                <div className="relative">
                  <svg className="h-20 w-20 -rotate-90" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r={radius} className="stroke-slate-200" fill="none" strokeWidth="6" />
                    <circle
                      cx="40" cy="40" r={radius}
                      className={`${profileCompletion >= 80 ? "stroke-emerald-500" : profileCompletion >= 40 ? "stroke-amber-500" : "stroke-rose-500"}`}
                      fill="none" strokeWidth="6"
                      strokeDasharray={circumference}
                      strokeDashoffset={offset}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-lg font-extrabold ${profileCompletion >= 80 ? "text-emerald-600" : profileCompletion >= 40 ? "text-amber-600" : "text-rose-600"}`}>
                      {profileCompletion}%
                    </span>
                  </div>
                </div>
                <p className="mt-1.5 text-xs font-medium text-slate-500">Profile completed</p>
              </div>

              {(profile.platforms?.length || profile.niches?.length) ? (
                <div className="mt-4 flex flex-wrap justify-center gap-1.5">
                  {profile.platforms?.map((p) => (
                    <span key={p} className="rounded-lg bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700">{p}</span>
                  ))}
                  {profile.niches?.map((n) => (
                    <span key={n} className="rounded-lg bg-cyan-50 px-2 py-0.5 text-xs font-semibold text-cyan-700">{n}</span>
                  ))}
                </div>
              ) : null}

              <div className="mt-5">
                <Link
                  href="/dashboard/profile"
                  className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition-all hover:border-indigo-200 hover:text-indigo-600 hover:shadow-md hover:-translate-y-0.5"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                  </svg>
                  Edit Profile
                </Link>
              </div>
            </div>
          )}

          <section>
            <h3 className="mb-3 text-sm font-bold text-slate-900">Quick Actions</h3>
            <div className="space-y-3">
              {[
                { title: "Browse Opportunities", desc: "Find brand deals and sponsorships", href: "/opportunities" },
                { title: "Complete Profile", desc: "Add platforms, niches, and links", href: "/dashboard/profile" },
                { title: "View Applications", desc: "Track your application statuses", href: "/dashboard/applications" },
              ].map((action) => (
                <Link
                  key={action.title}
                  href={action.href}
                  className="group flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:border-indigo-200 hover:-translate-y-0.5"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 shadow-sm transition-transform duration-200 group-hover:scale-110">
                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-bold text-slate-900">{action.title}</h4>
                    <p className="text-xs text-slate-500">{action.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
