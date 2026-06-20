import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./_components/logout-button";

// Dashboard requires runtime env vars + auth — never prerender statically
export const dynamic = "force-dynamic";

// ─── Metadata ────────────────────────────────────────────────
export const metadata = {
  title: "Dashboard | Creator Opportunities Hub",
  description: "Your creator dashboard — manage profile, applications, and opportunities.",
};

// ─── Dashboard Page (Server Component) ───────────────────────
export default async function DashboardPage() {
  const supabase = await createClient();

  // Fetch verified user (middleware already checked session,
  // but getUser() validates the token server-side)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch the creator profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Fetch user's applications
  const { data: applications } = await supabase
    .from("applications")
    .select("*, opportunities(title, brand_id, opportunity_type, status)")
    .eq("creator_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  // Fetch user's brands (if they are a brand owner)
  const { data: brands } = await supabase
    .from("brands")
    .select("id, company_name, slug, is_active, is_verified")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // Count stats
  const { count: totalApplications } = await supabase
    .from("applications")
    .select("*", { count: "exact", head: true })
    .eq("creator_id", user.id);

  const { count: activeOpportunities } = await supabase
    .from("opportunities")
    .select("*", { count: "exact", head: true })
    .eq("status", "active");

  // Compute profile completion percentage
  const profileCompletion = profile
    ? (() => {
        const fields = [
          profile.full_name,
          profile.username,
          profile.avatar_url,
          profile.headline,
          profile.bio,
          profile.country,
          profile.city,
          profile.website,
          profile.platforms.length > 0,
          profile.niches.length > 0,
          profile.follower_count > 0,
          profile.youtube_url || profile.tiktok_url || profile.instagram_url || profile.twitter_url,
        ];
        const filled = fields.filter(Boolean).length;
        return Math.round((filled / fields.length) * 100);
      })()
    : 0;

  return (
    <main className="min-h-screen bg-white">
      {/* ── Navbar ───────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 text-sm font-bold text-white shadow-md">
              C
            </span>
            <span className="text-lg font-bold tracking-tight text-gray-900">
              Creator<span className="text-blue-600">Hub</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/profile"
              className="hidden text-sm font-medium text-gray-500 transition hover:text-gray-900 sm:block"
            >
              Edit Profile
            </Link>
            <Link
              href="/"
              className="hidden text-sm font-medium text-gray-500 transition hover:text-gray-900 sm:block"
            >
              Browse Opportunities
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {/* Back to Home */}
        <Link
          href="/"
          className="group mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 transition-colors hover:text-blue-600"
        >
          <svg
            className="h-4 w-4 transition-transform group-hover:-translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>

        {/* ── Welcome Section ─────────────────────────────────── */}
        <div className="mb-10">
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
            Welcome back{profile?.full_name ? `, ${profile.full_name}` : ""}
          </h1>
          <p className="mt-2 text-sm text-gray-500 sm:text-base">
            Here&apos;s an overview of your creator activity.
          </p>
        </div>

        {/* ── Stats Grid ──────────────────────────────────────── */}
        <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {[
            { label: "My Applications", value: totalApplications ?? 0, color: "blue" },
            { label: "Active Opportunities", value: activeOpportunities ?? 0, color: "purple" },
            { label: "My Brands", value: brands?.length ?? 0, color: "indigo" },
            {
              label: "Profile Completion",
              value: `${profileCompletion}%`,
              color: profileCompletion >= 80 ? "emerald" : profileCompletion >= 40 ? "amber" : "red",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6"
            >
              <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                {stat.label}
              </p>
              <p
                className={`mt-2 text-2xl font-extrabold sm:text-3xl ${
                  stat.color === "blue"
                    ? "text-blue-600"
                    : stat.color === "purple"
                      ? "text-purple-600"
                      : stat.color === "indigo"
                        ? "text-indigo-600"
                        : stat.color === "emerald"
                          ? "text-emerald-600"
                          : stat.color === "red"
                            ? "text-red-600"
                            : "text-amber-600"
                }`}
              >
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* ── Profile Card ────────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="mb-4 text-lg font-bold text-gray-900">Your Profile</h2>
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
              {/* Avatar */}
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 text-xl font-bold text-white shadow-md">
                {profile?.full_name
                  ? profile.full_name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)
                  : user.email?.[0]?.toUpperCase() ?? "?"}
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-xl font-bold text-gray-900">
                    {profile?.full_name || "Set your name"}
                  </h3>
                  {profile?.is_verified && (
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                      Verified
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-sm text-gray-500">
                  @{profile?.username || user.email?.split("@")[0]}
                </p>
                <p className="mt-1 text-sm text-gray-400">{user.email}</p>

                {profile?.headline && (
                  <p className="mt-3 text-sm text-gray-600">{profile.headline}</p>
                )}

                {profile?.bio && (
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">
                    {profile.bio}
                  </p>
                )}

                {/* Platforms */}
                {profile?.platforms && profile.platforms.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {profile.platforms.map((p) => (
                      <span
                        key={p}
                        className="rounded-lg bg-gray-100 px-3 py-1 text-xs font-semibold capitalize text-gray-600"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                )}

                {/* Niches */}
                {profile?.niches && profile.niches.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {profile.niches.map((n) => (
                      <span
                        key={n}
                        className="rounded-lg bg-blue-50 px-3 py-1 text-xs font-semibold capitalize text-blue-600"
                      >
                        {n}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-5">
                  <Link
                    href="/dashboard/profile"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-500/20 transition hover:shadow-lg hover:shadow-blue-500/30"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Profile
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Recent Applications ─────────────────────────────── */}
        <section className="mb-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Recent Applications</h2>
            <Link
              href="/dashboard/applications"
              className="text-sm font-semibold text-blue-600 transition hover:text-blue-700"
            >
              View all
            </Link>
          </div>

          {!applications || applications.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 p-8 text-center">
              <p className="text-sm text-gray-500">
                You haven&apos;t applied to any opportunities yet.
              </p>
              <Link
                href="/"
                className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-blue-600 transition hover:text-blue-700"
              >
                Browse opportunities
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {applications.map((app) => {
                const opp = app.opportunities as
                  | { title?: string; opportunity_type?: string; status?: string }
                  | null;

                return (
                  <div
                    key={app.id}
                    className="flex flex-col gap-3 rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0 flex-1">
                      <h4 className="truncate text-sm font-bold text-gray-900">
                        {opp?.title || "Opportunity"}
                      </h4>
                      <p className="mt-0.5 text-xs text-gray-500">
                        {opp?.opportunity_type
                          ? opp.opportunity_type.replace(/_/g, " ")
                          : "—"}
                        {" · "}
                        {new Date(app.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>

                    <span
                      className={`inline-flex w-fit rounded-lg px-3 py-1 text-xs font-bold ${
                        app.status === "accepted"
                          ? "bg-emerald-100 text-emerald-700"
                          : app.status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : app.status === "under_review"
                              ? "bg-blue-100 text-blue-700"
                              : app.status === "withdrawn"
                                ? "bg-gray-100 text-gray-600"
                                : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {app.status.replace(/_/g, " ")}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ── Brands (if any) ─────────────────────────────────── */}
        {brands && brands.length > 0 && (
          <section className="mb-10">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Your Brands</h2>
              <Link
                href="/dashboard/brands"
                className="text-sm font-semibold text-blue-600 transition hover:text-blue-700"
              >
                Manage brands
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {brands.map((brand) => (
                <div
                  key={brand.id}
                  className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-bold text-white">
                    {brand.company_name[0]?.toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="truncate text-sm font-bold text-gray-900">
                      {brand.company_name}
                    </h4>
                    <div className="mt-0.5 flex items-center gap-2">
                      {brand.is_verified && (
                        <span className="text-xs font-semibold text-emerald-600">Verified</span>
                      )}
                      <span
                        className={`text-xs ${brand.is_active ? "text-gray-400" : "text-red-400"}`}
                      >
                        {brand.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Quick Actions ───────────────────────────────────── */}
        <section>
          <h2 className="mb-4 text-lg font-bold text-gray-900">Quick Actions</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Browse Opportunities",
                desc: "Find brand deals, sponsorships, and creator jobs",
                href: "/",
                gradient: "from-blue-600 to-blue-700",
              },
              {
                title: "Complete Your Profile",
                desc: "Add platforms, niches, and portfolio links",
                href: "/dashboard/profile",
                gradient: "from-purple-600 to-purple-700",
              },
              {
                title: "Post an Opportunity",
                desc: "Are you a brand? Find creators for your campaign",
                href: "/post",
                gradient: "from-indigo-600 to-indigo-700",
              },
            ].map((action) => (
              <Link
                key={action.title}
                href={action.href}
                className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:border-blue-200 hover:shadow-lg"
              >
                <div
                  className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${action.gradient} shadow-md`}
                >
                  <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
                <h3 className="text-sm font-bold text-gray-900">{action.title}</h3>
                <p className="mt-1 text-xs text-gray-500">{action.desc}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
