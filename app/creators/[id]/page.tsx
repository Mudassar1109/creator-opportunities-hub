import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/navbar";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CreatorProfilePage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (!profile) notFound();
  if (profile.role !== "creator") notFound();
  if (!profile.is_public) notFound();

  const { count: totalApplications } = await supabase
    .from("applications")
    .select("id", { count: "exact", head: true })
    .eq("creator_id", id);

  const { count: completedCampaigns } = await supabase
    .from("applications")
    .select("id", { count: "exact", head: true })
    .eq("creator_id", id)
    .eq("status", "accepted");

  const followerCount = profile.follower_count ?? 0;
  const location = [profile.city, profile.country].filter(Boolean).join(", ");

  const memberSince = new Date(profile.created_at).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const socialLinks: { label: string; url: string; icon: string }[] = [
    { label: "Website", url: profile.website, icon: "M12 21a9 9 0 100-18 9 9 0 000 18z M7.5 10.5h9M10.5 7.5l3 3-3 3" },
    { label: "YouTube", url: profile.youtube_url, icon: "M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29.2 29.2 0 001 12a29.2 29.2 0 00.46 5.58 2.78 2.78 0 001.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 001.94-2A29.2 29.2 0 0023 12a29.2 29.2 0 00-.46-5.58z M9.75 15.02V8.98l5.25 3.02-5.25 3.02z" },
    { label: "TikTok", url: profile.tiktok_url, icon: "M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.88 2.89 2.89 0 01-2.88-2.88 2.89 2.89 0 012.88-2.88c.36 0 .69.07 1 .19V8.87a6.32 6.32 0 00-1-.08A6.33 6.33 0 004.46 15.1a6.33 6.33 0 006.33 6.34 6.33 6.33 0 006.33-6.34V8.74a8.24 8.24 0 004.54-2.05z" },
    { label: "Instagram", url: profile.instagram_url, icon: "M3 7.5C3 5.01 5.01 3 7.5 3h9C18.99 3 21 5.01 21 7.5v9c0 2.49-2.01 4.5-4.5 4.5h-9C5.01 21 3 18.99 3 16.5v-9z M12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z M17.25 7.5h.008v.008h-.008V7.5z" },
    { label: "X", url: profile.twitter_url, icon: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" },
    { label: "LinkedIn", url: profile.linkedin_url, icon: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" },
  ]
    .map((s) => ({ ...s, url: s.url ?? "" }))
    .filter((s) => s.url.length > 0);

  const platforms = profile.platforms ?? [];
  const niches = profile.niches ?? [];

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      {/* ══════════════════════════════════════════════════════
          BREADCRUMB
      ══════════════════════════════════════════════════════ */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center gap-2 px-4 py-3 text-sm text-slate-500 sm:px-6 lg:px-8">
          <Link href="/" className="transition-colors hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded">
            Home
          </Link>
          <svg className="h-3.5 w-3.5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <span className="truncate font-medium text-slate-900">{profile.full_name}</span>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════ */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
          <div className="flex flex-col items-center text-center sm:flex-row sm:text-left sm:items-start sm:gap-8">
            {/* Avatar */}
            <div className="relative mb-6 shrink-0 sm:mb-0">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name}
                  className="h-28 w-28 rounded-3xl border-4 border-white object-cover shadow-xl shadow-indigo-500/10 sm:h-36 sm:w-36"
                />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-100 to-cyan-100 text-4xl font-bold text-indigo-600 shadow-xl shadow-indigo-500/10 sm:h-36 sm:w-36">
                  {profile.full_name[0]?.toUpperCase() ?? "?"}
                </div>
              )}
              {profile.is_verified && (
                <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-blue-500 ring-4 ring-white shadow-sm">
                  <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20" aria-label="Verified creator">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                  {profile.full_name}
                </h1>
                {profile.is_verified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-0.5 text-xs font-bold text-emerald-700 shadow-sm">
                    <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Verified
                  </span>
                )}
              </div>

              {profile.username && (
                <p className="mt-1 text-base text-slate-500">
                  @{profile.username}
                </p>
              )}

              {profile.headline && (
                <p className="mt-3 text-lg font-semibold text-indigo-600">
                  {profile.headline}
                </p>
              )}

              {profile.bio && (
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">
                  {profile.bio}
                </p>
              )}

              {/* Location + member since */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-slate-500 sm:justify-start">
                {location && (
                  <span className="inline-flex items-center gap-1.5">
                    <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {location}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5">
                  <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Member since {memberSince}
                </span>
              </div>

              {/* Social links */}
              {socialLinks.length > 0 && (
                <div className="mt-5 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                  {socialLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
                      aria-label={`${link.label} profile`}
                    >
                      <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d={link.icon} />
                      </svg>
                      {link.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          STATISTICS
      ══════════════════════════════════════════════════════ */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: "Followers", value: followerCount.toLocaleString(), icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
              { label: "Applications", value: (totalApplications ?? 0).toString(), icon: "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" },
              { label: "Completed", value: (completedCampaigns ?? 0).toString(), icon: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
              { label: "Platforms", value: platforms.length.toString(), icon: "M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:border-indigo-200 hover:shadow-md sm:p-6">
                <svg className="mb-2 h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d={stat.icon} />
                </svg>
                <p className="text-2xl font-extrabold text-slate-900 sm:text-3xl">{stat.value}</p>
                <p className="mt-0.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          MAIN CONTENT
      ══════════════════════════════════════════════════════ */}
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Left column — platforms, niches, about */}
          <div className="space-y-8 lg:col-span-3">
            {/* Platforms — Skills */}
            {platforms.length > 0 && (
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="mb-1 text-lg font-extrabold text-slate-900">Platforms &amp; Skills</h2>
                <p className="mb-5 text-sm text-slate-500">Content creation platforms this creator works on.</p>
                <div className="flex flex-wrap gap-2">
                  {platforms.map((p) => (
                    <span
                      key={p}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-3.5 py-2 text-sm font-semibold text-indigo-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-indigo-100 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <svg className="h-3.5 w-3.5 text-indigo-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {p}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Niches — Categories */}
            {niches.length > 0 && (
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="mb-1 text-lg font-extrabold text-slate-900">Content Niches</h2>
                <p className="mb-5 text-sm text-slate-500">Topics and categories this creator specializes in.</p>
                <div className="flex flex-wrap gap-2">
                  {niches.map((n) => (
                    <span
                      key={n}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-200 bg-cyan-50 px-3.5 py-2 text-sm font-semibold text-cyan-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-300 hover:bg-cyan-100 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                      <svg className="h-3.5 w-3.5 text-cyan-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {n}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* About */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="mb-1 text-lg font-extrabold text-slate-900">About</h2>
              <p className="mb-5 text-sm text-slate-500">More about this creator.</p>
              <div className="space-y-4">
                {profile.bio ? (
                  <p className="text-sm leading-relaxed text-slate-600 whitespace-pre-wrap">
                    {profile.bio}
                  </p>
                ) : (
                  <p className="text-sm italic text-slate-400">No bio added yet.</p>
                )}

                <div className="flex flex-col gap-2 text-sm text-slate-600">
                  {location && (
                    <span className="inline-flex items-center gap-2">
                      <svg className="h-4 w-4 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {location}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-2">
                    <svg className="h-4 w-4 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Member since {memberSince}
                  </span>
                </div>
              </div>
            </section>
          </div>

          {/* Right column — Contact */}
          <div className="space-y-8 lg:col-span-2">
            {/* Contact */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="mb-4 text-lg font-extrabold text-slate-900">Contact</h2>

              {profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="mb-4 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-md shadow-indigo-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                  Send Email
                </a>
              )}

              {profile.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  Visit Website
                </a>
              )}

              {/* Social links in contact */}
              {socialLinks.length > 0 && (
                <div className="mt-5 space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Find me on</p>
                  <div className="flex flex-wrap gap-2">
                    {socialLinks.map((link) => (
                      <a
                        key={link.label}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-600 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
                        aria-label={`${link.label} profile`}
                      >
                        <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d={link.icon} />
                        </svg>
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Quick Stats Card */}
            <section className="rounded-2xl border border-slate-200 bg-gradient-to-br from-indigo-600 to-blue-600 p-6 shadow-lg sm:p-8">
              <h2 className="mb-1 text-lg font-extrabold text-white">Creator Stats</h2>
              <p className="mb-5 text-sm text-indigo-100">Quick overview of this creator.</p>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-indigo-100">Followers</span>
                  <span className="text-sm font-extrabold text-white">{followerCount.toLocaleString()}</span>
                </div>
                <div className="h-px bg-indigo-500/30" />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-indigo-100">Applications</span>
                  <span className="text-sm font-extrabold text-white">{totalApplications ?? 0}</span>
                </div>
                <div className="h-px bg-indigo-500/30" />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-indigo-100">Completed</span>
                  <span className="text-sm font-extrabold text-white">{completedCampaigns ?? 0}</span>
                </div>
                <div className="h-px bg-indigo-500/30" />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-indigo-100">Platforms</span>
                  <span className="text-sm font-extrabold text-white">{platforms.length}</span>
                </div>
                <div className="h-px bg-indigo-500/30" />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-indigo-100">Niches</span>
                  <span className="text-sm font-extrabold text-white">{niches.length}</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
