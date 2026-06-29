import { Suspense } from "react";
import { Navbar } from "@/components/navbar";
import { OpportunityCard } from "@/components/opportunity-card";
import { AnimatedCounter } from "@/components/animated-counter";
import { NewsletterForm } from "@/components/newsletter-form";
import { HeroSearch } from "@/components/home/hero-search";
import { DashboardPreview } from "@/components/home/dashboard-preview";
import { FeaturedBrands } from "@/components/home/featured-brands";
import { TopCreators } from "@/components/home/top-creators";
import { CategoriesBento } from "@/components/home/categories-bento";
import { MouseGlow } from "@/components/home/mouse-glow";
import {
  OpportunityGridSkeleton,
  BrandGridSkeleton,
  CreatorGridSkeleton,
  CategoryGridSkeleton,
} from "@/components/home/skeletons";
import {
  getHomepageStats,
  getFeaturedOpportunities,
  getLatestOpportunities,
  getCategoriesWithCounts,
  getFeaturedBrands,
  getTopCreators,
  getUserDashboardStats,
} from "@/lib/actions/homepage";
import { getUser } from "@/lib/supabase/server";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Creator Opportunities Hub | Brand Deals, Sponsorships & Creator Jobs",
  description:
    "The premium marketplace where brands post sponsorships, brand deals, and UGC jobs - and creators apply in one click. Join thousands of creators earning from content.",
  keywords: [
    "creator opportunities", "brand deals", "sponsorships", "UGC jobs",
    "creator marketplace", "influencer marketing", "affiliate programs",
    "creator jobs", "paid collaborations", "ambassador programs",
  ],
  openGraph: {
    title: "Creator Opportunities Hub | Brand Deals, Sponsorships & Creator Jobs",
    description: "The marketplace where brands and creators connect. Browse live opportunities and apply instantly.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Creator Opportunities Hub | Brand Deals & Creator Jobs",
    description: "The marketplace where brands and creators connect.",
  },
};

export default async function HomePage() {
  const user = await getUser();

  const [
    stats,
    featuredOpps,
    latestOpps,
    categories,
    featuredBrands,
    topCreators,
    userStats,
  ] = await Promise.all([
    getHomepageStats(),
    getFeaturedOpportunities(),
    getLatestOpportunities(),
    getCategoriesWithCounts(),
    getFeaturedBrands(),
    getTopCreators(),
    user ? getUserDashboardStats(user.id) : null,
  ]);

  return (
    <>
      <MouseGlow />
      <main className="flex-1 bg-white text-slate-900">

        {user && userStats ? (
          <>
            <Navbar />

            <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-slate-900 px-4 pb-28 pt-16 sm:pb-32 sm:pt-20 lg:pb-40 lg:pt-28">
              <div className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-indigo-400/20 blur-3xl" aria-hidden="true" />
              <div className="pointer-events-none absolute -right-32 top-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />
              <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white/90 backdrop-blur-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Welcome back
                  </span>
                  <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                    {userStats.fullName ?? user.email?.split("@")[0] ?? "Creator"}
                  </h1>
                  <p className="mt-3 text-lg text-indigo-200">
                    {userStats.role === "brand" ? "Brand Account" : "Creator Account"}
                  </p>
                </div>
              </div>
            </section>

            <section className="-mt-16 px-4 sm:px-6 lg:px-8">
              <div className="mx-auto max-w-5xl">
                <div className="grid gap-4 sm:grid-cols-3">
                  {userStats.role !== "brand" && (
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                      <p className="text-3xl font-bold text-indigo-600">{userStats.applicationsTotal}</p>
                      <p className="mt-1 text-sm text-slate-500">Applications</p>
                    </div>
                  )}
                  {userStats.role === "brand" && (
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                      <p className="text-3xl font-bold text-indigo-600">{userStats.opportunitiesTotal}</p>
                      <p className="mt-1 text-sm text-slate-500">Opportunities</p>
                    </div>
                  )}
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <p className="text-3xl font-bold text-emerald-600">{stats.publishedOpportunities}</p>
                    <p className="mt-1 text-sm text-slate-500">Live Deals</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <p className="text-3xl font-bold text-indigo-600">{stats.totalCreators}</p>
                    <p className="mt-1 text-sm text-slate-500">Creators</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
              <div className="mx-auto max-w-5xl">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Link
                    href="/opportunities"
                    className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
                      <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-slate-900">Browse Opportunities</p>
                      <p className="text-sm text-slate-500">Find brand deals and sponsorships</p>
                    </div>
                    <svg className="h-5 w-5 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>

                  {userStats.role !== "brand" ? (
                    <Link
                      href="/dashboard/applications"
                      className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all"
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
                        <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-slate-900">My Applications</p>
                        <p className="text-sm text-slate-500">Track your applications</p>
                      </div>
                      <svg className="h-5 w-5 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  ) : (
                    <Link
                      href="/dashboard/opportunities/new"
                      className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all"
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
                        <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-slate-900">Post Opportunity</p>
                        <p className="text-sm text-slate-500">Create a new brand deal</p>
                      </div>
                      <svg className="h-5 w-5 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  )}

                  <Link
                    href="/dashboard"
                    className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
                      <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-slate-900">Go to Dashboard</p>
                      <p className="text-sm text-slate-500">Manage everything in one place</p>
                    </div>
                    <svg className="h-5 w-5 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>

                  <Link
                    href="/dashboard/settings"
                    className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
                      <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-slate-900">Settings</p>
                      <p className="text-sm text-slate-500">Manage your profile and preferences</p>
                    </div>
                    <svg className="h-5 w-5 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </section>

            <footer className="border-t border-slate-100 bg-white px-4 py-8 text-center">
              <p className="text-xs text-slate-400">
                &copy; {new Date().getFullYear()} Creator Opportunities Hub. All rights reserved.
              </p>
            </footer>
          </>
        ) : (
          <>
            <style>{`
              @keyframes marquee-rtl {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
              .announcement-wrapper:hover .announcement-track {
                animation-play-state: paused !important;
              }
            `}</style>
            <div className="announcement-wrapper relative flex h-[42px] w-full items-center overflow-hidden bg-indigo-600 text-white" role="banner" aria-label="Announcement">
              <div className="announcement-track flex shrink-0 items-center gap-6 whitespace-nowrap px-4 text-[13px] font-medium tracking-wide" style={{ animation: "marquee-rtl 30s linear infinite", willChange: "transform" }}>
                <span>Creator Opportunities Hub 2026</span>
                <span className="text-white/30">&#8226;</span>
                <span>Join Early Access</span>
                <span className="text-white/30">&#8226;</span>
                <span>Brands &amp; Creators Welcome</span>
                <span className="text-white/30">&#8226;</span>
                <span>Creator Opportunities Hub 2026</span>
                <span className="text-white/30">&#8226;</span>
                <span>Join Early Access</span>
                <span className="text-white/30">&#8226;</span>
                <span>Brands &amp; Creators Welcome</span>
              </div>
            </div>
            <Navbar />

            <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50 to-white pb-20 pt-16 sm:pb-28 sm:pt-24 lg:pb-36 lg:pt-32" aria-label="Hero">
              <div className="pointer-events-none absolute -left-40 top-10 h-[500px] w-[500px] rounded-full bg-indigo-500/5 blur-3xl" aria-hidden="true" />
              <div className="pointer-events-none absolute -right-32 top-20 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl" aria-hidden="true" />
              <div className="pointer-events-none absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-400/5 blur-3xl" aria-hidden="true" />

              <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-20">

                  <div className="text-center lg:text-left">
                    <div className="animate-fade-up mb-6 inline-flex items-center gap-2.5 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2">
                      <span className="animate-live-pulse h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
                      <span className="text-xs font-semibold text-indigo-700">
                        <AnimatedCounter value={stats.totalCreators} suffix="+" className="font-bold text-indigo-700" />
                        {" creators \u00B7 "}
                        <AnimatedCounter value={stats.publishedOpportunities} suffix="+" className="font-bold text-indigo-700" />
                        {" live deals"}
                      </span>
                    </div>

                    <h1 className="animate-fade-up animate-fade-up-delay-1 text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-[3.75rem] xl:text-7xl">
                      The Marketplace for{" "}
                      <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent">Creator Deals</span>
                    </h1>

                    <p className="animate-fade-up animate-fade-up-delay-2 mx-auto mt-5 max-w-xl text-base leading-relaxed text-slate-500 sm:text-lg lg:mx-0">
                      Brands post sponsorships, UGC jobs and brand deals. Creators apply in one click. Every opportunity is real, verified, and paid - no DMs, no middlemen.
                    </p>

                    <div className="animate-fade-up animate-fade-up-delay-2 mt-6 flex flex-wrap justify-center gap-3 lg:justify-start">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3.5 py-1.5 text-xs font-semibold text-indigo-700">
                        <svg className="h-3.5 w-3.5 text-indigo-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        For Creators
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-200 bg-cyan-50 px-3.5 py-1.5 text-xs font-semibold text-cyan-700">
                        <svg className="h-3.5 w-3.5 text-cyan-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        For Brands
                      </span>
                    </div>

                    <div className="animate-fade-up animate-fade-up-delay-3 mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
                      <Link href="/opportunities" className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-indigo-700 transition">
                        Browse Deals
                      </Link>
                      <Link href="/signup/role" className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 shadow-sm hover:border-indigo-200 hover:text-indigo-600 transition">
                        Join Free
                      </Link>
                    </div>

                    <div className="animate-fade-up animate-fade-up-delay-4 mt-10 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 lg:justify-start">
                      {[
                        { value: stats.publishedOpportunities, label: "Live Deals", color: "text-indigo-600" },
                        { value: stats.totalCreators, label: "Creators", color: "text-indigo-600" },
                        { value: stats.verifiedBrands, label: "Verified Brands", color: "text-indigo-600" },
                        { value: stats.totalApplications, label: "Applications", color: "text-indigo-600" },
                      ].map((s) => (
                        <div key={s.label} className="text-center lg:text-left">
                          <p className={`text-2xl font-extrabold tabular-nums ${s.color}`}>
                            <AnimatedCounter value={s.value} suffix="+" />
                          </p>
                          <p className="text-xs font-medium text-slate-400">{s.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="animate-fade-up animate-fade-up-delay-3">
                    <DashboardPreview
                      opportunities={featuredOpps.slice(0, 3).map((o) => ({
                        title: o.title,
                        brand_name: o.brand.company_name,
                        budget_type: o.budget_type,
                        budget_min: o.budget_min,
                        budget_max: o.budget_max,
                        currency: o.currency,
                        opportunity_type: o.opportunity_type,
                        brand_verified: o.brand.is_verified,
                      }))}
                      stats={stats}
                    />
                  </div>
                </div>

                <div className="animate-fade-up animate-fade-up-delay-5 mt-14">
                  <HeroSearch />
                </div>
              </div>

              <div className="absolute bottom-6 left-1/2 -translate-x-1/2" aria-hidden="true">
                <div className="flex h-9 w-5 items-start justify-center rounded-full border-2 border-slate-300 pt-1.5">
                  <div className="animate-float-fast h-1.5 w-1 rounded-full bg-slate-400" />
                </div>
              </div>
            </section>

            <section id="opportunities" className="bg-white px-4 py-16 sm:px-6 sm:py-24 lg:px-8" aria-labelledby="opportunities-heading">
              <div className="mx-auto max-w-7xl">
                <div className="mx-auto mb-12 max-w-2xl text-center">
                  <span className="mb-4 inline-block rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-indigo-700">Live</span>
                  <h2 id="opportunities-heading" className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Live Opportunities</h2>
                  <p className="mt-3 text-base text-slate-500 sm:text-lg">Fresh brand deals, sponsorships and UGC jobs - updated daily.</p>
                </div>

                <Suspense fallback={<OpportunityGridSkeleton count={6} />}>
                  {featuredOpps.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {featuredOpps.map((opp) => (
                        <OpportunityCard key={opp.id} id={opp.id} title={opp.title} slug={opp.slug} brand_name={opp.brand.company_name} brand_logo={opp.brand.logo_url} brand_verified={opp.brand.is_verified} opportunity_type={opp.opportunity_type} budget_min={opp.budget_min} budget_max={opp.budget_max} budget_type={opp.budget_type} currency={opp.currency} country={opp.country} deadline={opp.deadline} is_featured={opp.is_featured} category_names={opp.categories.map((c) => c.name)} applications_count={opp.applications_count} published_at={opp.published_at} />
                      ))}
                    </div>
                  ) : latestOpps.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {latestOpps.slice(0, 6).map((opp) => (
                        <OpportunityCard key={opp.id} id={opp.id} title={opp.title} slug={opp.slug} brand_name={opp.brand.company_name} brand_logo={opp.brand.logo_url} brand_verified={opp.brand.is_verified} opportunity_type={opp.opportunity_type} budget_min={opp.budget_min} budget_max={opp.budget_max} budget_type={opp.budget_type} currency={opp.currency} country={opp.country} deadline={opp.deadline} is_featured={opp.is_featured} category_names={opp.categories.map((c) => c.name)} applications_count={opp.applications_count} published_at={opp.published_at} />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-20 text-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm" aria-hidden="true">
                        <svg className="h-7 w-7 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                      </div>
                      <h3 className="mt-4 text-lg font-semibold text-slate-700">No opportunities yet</h3>
                      <p className="mt-2 max-w-xs text-sm text-slate-500">Brands are onboarding now. Check back soon for premium deals.</p>
                    </div>
                  )}
                </Suspense>

                <div className="mt-12 text-center">
                  <Link href="/opportunities" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-2.5 text-sm font-bold text-slate-700 shadow-sm hover:border-indigo-200 hover:text-indigo-600 transition">
                    View All Opportunities
                    <svg className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </section>

            <section id="categories" className="relative overflow-hidden bg-slate-50 px-4 py-16 sm:px-6 sm:py-24 lg:px-8" aria-labelledby="categories-heading">
              <div className="pointer-events-none absolute -right-40 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-indigo-100/60 blur-3xl" aria-hidden="true" />
              <div className="pointer-events-none absolute -left-40 bottom-0 h-80 w-80 rounded-full bg-cyan-100/40 blur-3xl" aria-hidden="true" />
              <div className="relative mx-auto max-w-7xl">
                <div className="mx-auto mb-12 max-w-2xl text-center">
                  <span className="mb-4 inline-block rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-indigo-700">Browse</span>
                  <h2 id="categories-heading" className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Explore by Category</h2>
                  <p className="mt-3 text-base text-slate-500 sm:text-lg">Brand deals, sponsorships, UGC, ambassador programs and more.</p>
                </div>
                <Suspense fallback={<CategoryGridSkeleton />}>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
                    <CategoriesBento categories={categories} />
                  </div>
                </Suspense>
              </div>
            </section>

            <section className="relative overflow-hidden bg-slate-50 px-4 py-16 sm:px-6 sm:py-24 lg:px-8" aria-labelledby="brands-heading">
              <div className="pointer-events-none absolute -left-40 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-indigo-100/50 blur-3xl" aria-hidden="true" />
              <div className="relative mx-auto max-w-7xl">
                <div className="mx-auto mb-12 max-w-2xl text-center">
                  <span className="mb-4 inline-block rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-indigo-700">Partners</span>
                  <h2 id="brands-heading" className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Featured Brands</h2>
                  <p className="mt-3 text-base text-slate-500 sm:text-lg">Real companies with real budgets, actively looking for creators.</p>
                </div>
                <Suspense fallback={<BrandGridSkeleton count={8} />}>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
                    <FeaturedBrands brands={featuredBrands} />
                  </div>
                </Suspense>
                <div className="mt-12 text-center">
                  <Link href="/signup/role" className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 shadow-sm hover:border-indigo-200 hover:text-indigo-600 transition">List Your Brand</Link>
                </div>
              </div>
            </section>

            <section className="relative bg-white px-4 py-16 sm:px-6 sm:py-24 lg:px-8" aria-labelledby="creators-heading">
              <div className="pointer-events-none absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-blue-50 blur-3xl" aria-hidden="true" />
              <div className="relative mx-auto max-w-7xl">
                <div className="mx-auto mb-12 max-w-2xl text-center">
                  <span className="mb-4 inline-block rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-indigo-700">Creators</span>
                  <h2 id="creators-heading" className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Top Creators</h2>
                  <p className="mt-3 text-base text-slate-500 sm:text-lg">Verified creators across YouTube, TikTok, Instagram and more.</p>
                </div>
                <Suspense fallback={<CreatorGridSkeleton count={8} />}>
                  <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
                    <TopCreators creators={topCreators} />
                  </div>
                </Suspense>
                <div className="mt-12 text-center">
                  <Link href="/signup/role" className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-indigo-700 transition">Join as a Creator</Link>
                </div>
              </div>
            </section>

            <section id="about" className="relative bg-white px-4 py-16 sm:px-6 sm:py-24 lg:px-8" aria-labelledby="how-it-works-heading">
              <div className="mx-auto max-w-7xl">
                <div className="mx-auto mb-14 max-w-2xl text-center">
                  <span className="mb-4 inline-block rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-indigo-700">Simple</span>
                  <h2 id="how-it-works-heading" className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">From Profile to Paycheck</h2>
                  <p className="mt-3 text-base text-slate-500 sm:text-lg">Get started in minutes - no complex setup, no intermediaries.</p>
                </div>
                <div className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="pointer-events-none absolute left-0 right-0 top-14 hidden h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent lg:block" aria-hidden="true" />
                  {([
                    { step: "01", title: "Create Your Profile", description: "Sign up, pick your role, and showcase your niche, audience, platforms.", icon: "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" },
                    { step: "02", title: "Discover Deals", description: "Browse curated brand deals, UGC jobs, and sponsorships filtered to your niche.", icon: "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" },
                    { step: "03", title: "Apply Instantly", description: "One-click applications using your existing profile with full history.", icon: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" },
                    { step: "04", title: "Land the Deal", description: "Get accepted, receive briefs, create content, and build relationships.", icon: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
                  ] as const).map((s, idx) => (
                    <div key={s.step} className={`animate-fade-up animate-fade-up-delay-${idx + 1} group relative`}>
                      <div className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg sm:p-8">
                        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 shadow-sm transition-transform duration-300 group-hover:scale-110">
                          <svg className="h-7 w-7 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d={s.icon} />
                          </svg>
                          <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white text-[11px] font-extrabold text-slate-700 shadow-sm ring-1 ring-slate-200">{s.step}</span>
                        </div>
                        <h3 className="mt-5 text-base font-bold text-slate-900 sm:text-lg">{s.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-slate-500">{s.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-14 text-center">
                  <Link href="/signup/role" className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-indigo-700 transition">Get Started Free</Link>
                  <p className="mt-3 text-xs text-slate-400">No credit card required &middot; Free forever for creators</p>
                </div>
              </div>
            </section>

            <section className="relative overflow-hidden bg-slate-50 px-4 py-16 sm:px-6 sm:py-24 lg:px-8" aria-labelledby="newsletter-heading">
              <div className="pointer-events-none absolute -left-40 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-indigo-100/60 blur-3xl" aria-hidden="true" />
              <div className="pointer-events-none absolute -right-40 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-indigo-100/60 blur-3xl" aria-hidden="true" />
              <div className="relative mx-auto max-w-3xl">
                <div className="rounded-2xl border border-slate-200 bg-white px-8 py-14 text-center shadow-sm sm:px-12 lg:px-16 lg:py-16">
                  <h2 id="newsletter-heading" className="sr-only">Newsletter</h2>
                  <NewsletterForm creatorCount={stats.totalCreators} />
                </div>
              </div>
            </section>

            <footer id="contact" className="border-t border-slate-100 bg-white px-4 py-16 sm:px-6 lg:px-8" aria-label="Site footer">
              <div className="mx-auto max-w-7xl">
                <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="sm:col-span-2 lg:col-span-1">
                    <Link href="/" className="inline-flex items-center gap-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" aria-label="CreatorHub home">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold text-white shadow-md" aria-hidden="true">C</span>
                      <span className="text-lg font-bold tracking-tight text-slate-900">Creator<span className="text-indigo-600">Hub</span></span>
                    </Link>
                    <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-500">The premium marketplace where brands post opportunities and creators apply in one click.</p>
                  </div>
                  <nav aria-label="Creator resources">
                    <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-900">For Creators</h3>
                    <ul className="space-y-2.5">
                      {[{ label: "Browse Opportunities", href: "/opportunities" }, { label: "Brand Deals", href: "/opportunities?category=brand-deals" }, { label: "Sponsorships", href: "/opportunities?category=sponsorships" }].map((l) => (
                        <li key={l.label}><Link href={l.href} className="text-sm text-slate-500 transition hover:text-indigo-600">{l.label}</Link></li>
                      ))}
                    </ul>
                  </nav>
                  <nav aria-label="Brand resources">
                    <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-900">For Brands</h3>
                    <ul className="space-y-2.5">
                      {[{ label: "Post Opportunity", href: "/dashboard/opportunities/new" }, { label: "My Dashboard", href: "/dashboard" }, { label: "Sign Up as Brand", href: "/signup/role" }].map((l) => (
                        <li key={l.label}><Link href={l.href} className="text-sm text-slate-500 transition hover:text-indigo-600">{l.label}</Link></li>
                      ))}
                    </ul>
                  </nav>
                  <nav aria-label="Platform links">
                    <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-900">Platform</h3>
                    <ul className="space-y-2.5">
                      {[{ label: "About Us", href: "/about" }, { label: "Privacy Policy", href: "/privacy" }, { label: "Terms of Service", href: "/terms" }].map((l) => (
                        <li key={l.label}><Link href={l.href} className="text-sm text-slate-500 transition hover:text-indigo-600">{l.label}</Link></li>
                      ))}
                    </ul>
                  </nav>
                </div>
                <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-8 sm:flex-row">
                  <p className="text-xs text-slate-400">&copy; {new Date().getFullYear()} Creator Opportunities Hub. All rights reserved.</p>
                  <div className="flex gap-6">
                    <a href="/privacy" className="text-xs text-slate-400 transition hover:text-slate-600">Privacy</a>
                    <a href="/terms" className="text-xs text-slate-400 transition hover:text-slate-600">Terms</a>
                    <a href="/cookies" className="text-xs text-slate-400 transition hover:text-slate-600">Cookies</a>
                  </div>
                </div>
              </div>
            </footer>
          </>
        )}
      </main>
    </>
  );
}
