// app/page.tsx — CreatorHub 2026 Premium Homepage
import { Suspense } from "react";
import { Navbar } from "@/components/navbar";
import { OpportunityCard } from "@/components/opportunity-card";
import { AnimatedCounter } from "@/components/animated-counter";
import { NewsletterForm } from "@/components/newsletter-form";
import { HeroSearch } from "@/components/home/hero-search";
import { DashboardPreview } from "@/components/home/dashboard-preview";
import { LiveActivity } from "@/components/home/live-activity";
import { FeaturedBrands } from "@/components/home/featured-brands";
import { TopCreators } from "@/components/home/top-creators";
import { CategoriesBento } from "@/components/home/categories-bento";
import { TrustBar } from "@/components/home/trust-bar";
import { MouseGlow } from "@/components/home/mouse-glow";
import {
  OpportunityGridSkeleton,
  BrandGridSkeleton,
  CreatorGridSkeleton,
  ActivitySkeleton,
  CategoryGridSkeleton,
} from "@/components/home/skeletons";
import {
  getHomepageStats,
  getFeaturedOpportunities,
  getLatestOpportunities,
  getCategoriesWithCounts,
  getFeaturedBrands,
  getTopCreators,
  getLiveActivity,
} from "@/lib/actions/homepage";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Creator Opportunities Hub | Brand Deals, Sponsorships & Creator Jobs",
  description:
    "The premium marketplace where brands post sponsorships, brand deals, and UGC jobs — and creators apply in one click. Join thousands of creators earning from content.",
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
  const [
    stats,
    featuredOpps,
    latestOpps,
    categories,
    featuredBrands,
    topCreators,
    activity,
  ] = await Promise.all([
    getHomepageStats(),
    getFeaturedOpportunities(),
    getLatestOpportunities(),
    getCategoriesWithCounts(),
    getFeaturedBrands(),
    getTopCreators(),
    getLiveActivity(),
  ]);

  return (
    <>
      {/* Mouse glow — client-only, zero layout impact */}
      <MouseGlow />

      <main className="flex-1 bg-white text-gray-900">
        <Navbar />

        {/* ══════════════════════════════════════════════════════
            HERO — Aurora + Dashboard preview + 5-second clarity
        ══════════════════════════════════════════════════════ */}
        <section
          className="aurora-bg relative overflow-hidden pb-24 pt-20 sm:pb-32 sm:pt-28 lg:pb-40 lg:pt-36"
          aria-label="Hero"
        >
          {/* Noise texture for depth */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.025]"
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }}
            aria-hidden="true"
          />

          {/* Floating orbs */}
          <div className="animate-float-slow pointer-events-none absolute -left-40 top-10 h-[500px] w-[500px] rounded-full bg-purple-500/15 blur-3xl" aria-hidden="true" />
          <div className="animate-float-medium pointer-events-none absolute -right-32 top-20 h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl" aria-hidden="true" />
          <div className="animate-float-fast pointer-events-none absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-400/15 blur-3xl" aria-hidden="true" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-20">

              {/* ── Left column: value prop ── */}
              <div className="text-center lg:text-left">

                {/* Live platform badge */}
                <div className="animate-fade-up mb-6 inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md">
                  <span className="animate-live-pulse h-2 w-2 rounded-full bg-emerald-400" aria-hidden="true" />
                  <span className="text-xs font-semibold text-white/90">
                    <AnimatedCounter value={stats.totalCreators} suffix="+" className="font-bold text-white" />
                    {" creators · "}
                    <AnimatedCounter value={stats.publishedOpportunities} suffix="+" className="font-bold text-white" />
                    {" live deals"}
                  </span>
                </div>

                {/* H1 — answers: What is it? */}
                <h1 className="animate-fade-up animate-fade-up-delay-1 text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-[3.75rem] xl:text-7xl">
                  The Marketplace for{" "}
                  <span className="gradient-text-animated">Creator Deals</span>
                </h1>

                {/* Subhead — answers: Who? Why different? */}
                <p className="animate-fade-up animate-fade-up-delay-2 mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg lg:mx-0">
                  Brands post sponsorships, UGC jobs and brand deals. Creators
                  apply in one click. Every opportunity is real, verified, and
                  paid — no DMs, no middlemen.
                </p>

                {/* Dual audience pills */}
                <div className="animate-fade-up animate-fade-up-delay-2 mt-6 flex flex-wrap justify-center gap-3 lg:justify-start">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white/90 backdrop-blur-sm">
                    <svg className="h-3.5 w-3.5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    For Creators — find paid deals
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white/90 backdrop-blur-sm">
                    <svg className="h-3.5 w-3.5 text-cyan-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    For Brands — reach creators fast
                  </span>
                </div>

                {/* CTAs */}
                <div className="animate-fade-up animate-fade-up-delay-3 mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
                  <Link
                    href="/opportunities"
                    className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 text-sm font-bold text-purple-700 shadow-xl shadow-black/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-black/25 sm:w-auto sm:text-base focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-purple-700"
                  >
                    Browse Deals
                    <svg className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                  <Link
                    href="/signup/role"
                    className="inline-flex w-full items-center justify-center rounded-2xl border-2 border-white/30 bg-white/10 px-8 py-4 text-sm font-bold text-white backdrop-blur-sm transition-all duration-200 hover:border-white/50 hover:bg-white/20 sm:w-auto sm:text-base focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-purple-700"
                  >
                    Join Free →
                  </Link>
                </div>

                {/* Trust micro-stats */}
                <div className="animate-fade-up animate-fade-up-delay-4 mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 lg:justify-start">
                  {[
                    { value: stats.verifiedBrands, label: "Verified Brands", suffix: "+" },
                    { value: stats.totalCreators, label: "Creators", suffix: "+" },
                    { value: stats.applicationsToday, label: "Applied Today", suffix: "" },
                  ].map((s) => (
                    <div key={s.label} className="text-center lg:text-left">
                      <p className="text-xl font-extrabold text-white">
                        <AnimatedCounter value={s.value} suffix={s.suffix} />
                      </p>
                      <p className="text-[11px] font-medium uppercase tracking-wide text-white/55">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Right column: Dashboard preview ── */}
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

            {/* Hero search — full width below grid */}
            <div className="animate-fade-up animate-fade-up-delay-5 mt-14">
              <HeroSearch />
            </div>
          </div>

          {/* Scroll cue */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2" aria-hidden="true">
            <div className="flex h-9 w-5 items-start justify-center rounded-full border-2 border-white/30 pt-1.5">
              <div className="animate-float-fast h-1.5 w-1 rounded-full bg-white/60" />
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            TRUST BAR — real DB counts, immediately below hero
        ══════════════════════════════════════════════════════ */}
        <TrustBar
          totalBrands={stats.totalBrands}
          totalCreators={stats.totalCreators}
          publishedOpportunities={stats.publishedOpportunities}
          totalApplications={stats.totalApplications}
          verifiedBrands={stats.verifiedBrands}
        />

        {/* ══════════════════════════════════════════════════════
            PLATFORM STATS — dark section with animated counters
        ══════════════════════════════════════════════════════ */}
        <section
          className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-purple-950/60 to-slate-950 py-16 sm:py-20"
          aria-label="Platform statistics"
        >
          {/* Decorative rotating rings */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.07]" aria-hidden="true">
            <div className="animate-rotate-slow h-[480px] w-[480px] rounded-full border border-purple-500" />
            <div className="animate-rotate-slow absolute h-80 w-80 rounded-full border border-cyan-500" style={{ animationDirection: "reverse", animationDuration: "14s" }} />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
              {[
                { value: stats.publishedOpportunities, label: "Live Opportunities", icon: "🎯", suffix: "+" },
                { value: stats.totalCreators, label: "Registered Creators", icon: "🎨", suffix: "+" },
                { value: stats.totalBrands, label: "Partner Brands", icon: "🏢", suffix: "+" },
                { value: stats.totalApplications, label: "Applications Sent", icon: "✉️", suffix: "+" },
              ].map((s, i) => (
                <div
                  key={s.label}
                  className={`animate-fade-up animate-fade-up-delay-${i + 1} group flex flex-col items-center text-center`}
                >
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-2xl backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                    <span aria-hidden="true">{s.icon}</span>
                  </div>
                  <p className="gradient-text-animated text-3xl font-extrabold tabular-nums sm:text-4xl lg:text-5xl">
                    <AnimatedCounter value={s.value} suffix={s.suffix} />
                  </p>
                  <p className="mt-2 text-sm font-medium text-gray-400">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Wave divider */}
        <div className="relative h-8 overflow-hidden bg-white" aria-hidden="true">
          <svg className="absolute -top-1 w-full" viewBox="0 0 1440 32" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0L1440 0L1440 32C1440 32 1080 8 720 8C360 8 0 32 0 32L0 0Z" fill="#020617" />
          </svg>
        </div>

        {/* ══════════════════════════════════════════════════════
            FEATURED OPPORTUNITIES
        ══════════════════════════════════════════════════════ */}
        <section
          id="opportunities"
          className="relative bg-white px-4 py-20 sm:px-6 sm:py-28 lg:px-8"
          aria-labelledby="featured-heading"
        >
          <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-[600px] -translate-x-1/2 rounded-full bg-purple-50 blur-3xl" aria-hidden="true" />

          <div className="relative mx-auto max-w-7xl">
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <span className="mb-4 inline-block rounded-full border border-purple-200 bg-purple-50 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-purple-700">
                Featured
              </span>
              <h2 id="featured-heading" className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Featured Opportunities
              </h2>
              <p className="mt-3 text-base text-gray-500 sm:text-lg">
                Hand-picked deals from leading brands, paying real budgets.
              </p>
            </div>

            <Suspense fallback={<OpportunityGridSkeleton count={6} />}>
              {featuredOpps.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {featuredOpps.map((opp) => (
                    <OpportunityCard
                      key={opp.id}
                      id={opp.id}
                      title={opp.title}
                      slug={opp.slug}
                      brand_name={opp.brand.company_name}
                      brand_logo={opp.brand.logo_url}
                      brand_verified={opp.brand.is_verified}
                      opportunity_type={opp.opportunity_type}
                      budget_min={opp.budget_min}
                      budget_max={opp.budget_max}
                      budget_type={opp.budget_type}
                      currency={opp.currency}
                      country={opp.country}
                      deadline={opp.deadline}
                      is_featured={opp.is_featured}
                      category_names={opp.categories.map((c) => c.name)}
                      applications_count={opp.applications_count}
                      published_at={opp.published_at}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-purple-200 bg-purple-50/50 py-20 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100 text-3xl" aria-hidden="true">🎯</div>
                  <h3 className="mt-4 text-lg font-semibold text-gray-700">No featured opportunities yet</h3>
                  <p className="mt-2 max-w-xs text-sm text-gray-500">
                    Brands are setting up their profiles. Check back soon for premium deals.
                  </p>
                  <Link
                    href="/dashboard/opportunities/new"
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-purple-500/20 transition hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                  >
                    Post an Opportunity
                  </Link>
                </div>
              )}
            </Suspense>

            <div className="mt-12 text-center">
              <Link
                href="/opportunities"
                className="group inline-flex items-center gap-2 rounded-2xl border-2 border-gray-200 bg-white px-8 py-3.5 text-sm font-bold text-gray-800 shadow-sm transition-all duration-200 hover:border-purple-300 hover:shadow-lg hover:shadow-purple-500/10 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                View All Opportunities
                <svg className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            TRENDING CATEGORIES — Bento grid
        ══════════════════════════════════════════════════════ */}
        <section
          id="categories"
          className="relative overflow-hidden bg-gray-50 px-4 py-20 sm:px-6 sm:py-28 lg:px-8"
          aria-labelledby="categories-heading"
        >
          <div className="pointer-events-none absolute -right-40 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-cyan-100/60 blur-3xl" aria-hidden="true" />
          <div className="pointer-events-none absolute -left-40 bottom-0 h-80 w-80 rounded-full bg-purple-100/40 blur-3xl" aria-hidden="true" />

          <div className="relative mx-auto max-w-7xl">
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <span className="mb-4 inline-block rounded-full border border-cyan-200 bg-cyan-50 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-cyan-700">
                Trending
              </span>
              <h2 id="categories-heading" className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Explore by Category
              </h2>
              <p className="mt-3 text-base text-gray-500 sm:text-lg">
                Brand deals, sponsorships, UGC, ambassador programs and more.
              </p>
            </div>

            <Suspense fallback={<CategoryGridSkeleton />}>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
                <CategoriesBento categories={categories} />
              </div>
            </Suspense>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            LIVE ACTIVITY FEED
        ══════════════════════════════════════════════════════ */}
        <section
          className="relative bg-white px-4 py-20 sm:px-6 sm:py-28 lg:px-8"
          aria-labelledby="activity-heading"
        >
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-16 lg:grid-cols-2 lg:items-start">
              {/* Left */}
              <div className="lg:sticky lg:top-24">
                <span className="mb-4 inline-block rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-emerald-700">
                  Live
                </span>
                <h2 id="activity-heading" className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                  Happening Right Now
                </h2>
                <p className="mt-4 max-w-md text-base leading-relaxed text-gray-500 sm:text-lg">
                  New opportunities, brand partnerships, and creator applications
                  — updated in real time from the database.
                </p>

                <div className="mt-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/80 px-5 py-4">
                  <span className="animate-live-pulse h-3 w-3 shrink-0 rounded-full bg-emerald-500" aria-hidden="true" />
                  <p className="text-sm font-semibold text-emerald-800">
                    Live — new activity pushes automatically
                  </p>
                </div>

                {/* Mini stats from activity */}
                <dl className="mt-8 grid grid-cols-2 gap-4">
                  {[
                    { label: "New this week", value: activity.opportunities.length + activity.applications.length, icon: "📊" },
                    { label: "Applied today", value: stats.applicationsToday, icon: "✉️" },
                    { label: "Brands joined", value: activity.brands.length, icon: "🏢" },
                    { label: "Total creators", value: stats.totalCreators, icon: "🎨" },
                  ].map((item) => (
                    <div key={item.label} className="glass-card-light rounded-xl p-4">
                      <span className="text-xl" aria-hidden="true">{item.icon}</span>
                      <dd className="mt-1.5 text-2xl font-extrabold text-gray-900">
                        {item.value > 1000 ? `${(item.value / 1000).toFixed(1)}K` : item.value}
                        <span className="text-base font-bold text-purple-600">+</span>
                      </dd>
                      <dt className="mt-0.5 text-xs text-gray-500">{item.label}</dt>
                    </div>
                  ))}
                </dl>
              </div>

              {/* Right — live feed */}
              <Suspense fallback={<ActivitySkeleton count={6} />}>
                <LiveActivity
                  initialOpportunities={activity.opportunities}
                  initialApplications={activity.applications}
                  initialBrands={activity.brands}
                />
              </Suspense>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            FEATURED BRANDS
        ══════════════════════════════════════════════════════ */}
        <section
          className="relative overflow-hidden bg-gray-50 px-4 py-20 sm:px-6 sm:py-28 lg:px-8"
          aria-labelledby="brands-heading"
        >
          <div className="pointer-events-none absolute -left-40 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-purple-100/50 blur-3xl" aria-hidden="true" />

          <div className="relative mx-auto max-w-7xl">
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <span className="mb-4 inline-block rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-indigo-700">
                Partners
              </span>
              <h2 id="brands-heading" className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Featured Brands
              </h2>
              <p className="mt-3 text-base text-gray-500 sm:text-lg">
                Real companies with real budgets, actively looking for creators.
              </p>
            </div>

            <Suspense fallback={<BrandGridSkeleton count={8} />}>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
                <FeaturedBrands brands={featuredBrands} />
              </div>
            </Suspense>

            <div className="mt-12 text-center">
              <Link
                href="/signup/role"
                className="group inline-flex items-center gap-2 rounded-2xl border-2 border-gray-200 bg-white px-8 py-3.5 text-sm font-bold text-gray-800 shadow-sm transition-all duration-200 hover:border-purple-300 hover:shadow-lg hover:shadow-purple-500/10 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                List Your Brand
                <svg className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            TOP CREATORS
        ══════════════════════════════════════════════════════ */}
        <section
          className="relative bg-white px-4 py-20 sm:px-6 sm:py-28 lg:px-8"
          aria-labelledby="creators-heading"
        >
          <div className="pointer-events-none absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-cyan-50 blur-3xl" aria-hidden="true" />

          <div className="relative mx-auto max-w-7xl">
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <span className="mb-4 inline-block rounded-full border border-purple-200 bg-purple-50 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-purple-700">
                Creators
              </span>
              <h2 id="creators-heading" className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Top Creators
              </h2>
              <p className="mt-3 text-base text-gray-500 sm:text-lg">
                Verified creators across YouTube, TikTok, Instagram and more.
              </p>
            </div>

            <Suspense fallback={<CreatorGridSkeleton count={8} />}>
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
                <TopCreators creators={topCreators} />
              </div>
            </Suspense>

            <div className="mt-12 text-center">
              <Link
                href="/signup/role"
                className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-500 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-purple-500/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-purple-500/35 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                Join as a Creator
                <svg className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            LATEST OPPORTUNITIES — dark section
        ══════════════════════════════════════════════════════ */}
        <section
          className="relative overflow-hidden bg-slate-950 px-4 py-20 sm:px-6 sm:py-28 lg:px-8"
          aria-labelledby="latest-heading"
        >
          <div className="pointer-events-none absolute -left-32 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-purple-900/50 blur-3xl" aria-hidden="true" />
          <div className="pointer-events-none absolute -right-32 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-cyan-900/40 blur-3xl" aria-hidden="true" />

          <div className="relative mx-auto max-w-7xl">
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <span className="mb-4 inline-block rounded-full border border-cyan-700/50 bg-cyan-900/30 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-cyan-400">
                New
              </span>
              <h2 id="latest-heading" className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Latest Opportunities
              </h2>
              <p className="mt-3 text-base text-gray-400 sm:text-lg">
                Fresh deals posted recently — apply before they close.
              </p>
            </div>

            <Suspense fallback={
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-64 animate-shimmer rounded-2xl bg-white/5" aria-hidden="true" />
                ))}
              </div>
            }>
              {latestOpps.length > 0 ? (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {latestOpps.map((opp) => (
                    <OpportunityCard
                      key={opp.id}
                      id={opp.id}
                      title={opp.title}
                      slug={opp.slug}
                      brand_name={opp.brand.company_name}
                      brand_logo={opp.brand.logo_url}
                      brand_verified={opp.brand.is_verified}
                      opportunity_type={opp.opportunity_type}
                      budget_min={opp.budget_min}
                      budget_max={opp.budget_max}
                      budget_type={opp.budget_type}
                      currency={opp.currency}
                      country={opp.country}
                      deadline={opp.deadline}
                      is_featured={opp.is_featured}
                      category_names={opp.categories.map((c) => c.name)}
                      applications_count={opp.applications_count}
                      published_at={opp.published_at}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 py-20 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-3xl" aria-hidden="true">📭</div>
                  <h3 className="mt-4 text-lg font-semibold text-gray-300">No opportunities yet</h3>
                  <p className="mt-2 max-w-xs text-sm text-gray-500">
                    Brands are onboarding now. Subscribe to the newsletter to be first in line.
                  </p>
                </div>
              )}
            </Suspense>

            <div className="mt-12 text-center">
              <Link
                href="/opportunities"
                className="group inline-flex items-center gap-2 rounded-2xl border-2 border-white/20 bg-white/10 px-8 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition-all duration-200 hover:border-white/30 hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-950"
              >
                View All Opportunities
                <svg className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* Wave divider top of How It Works */}
        <div className="relative h-8 overflow-hidden bg-white" aria-hidden="true">
          <svg className="absolute -top-1 w-full" viewBox="0 0 1440 32" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 32L1440 32L1440 0C1440 0 1080 24 720 24C360 24 0 0 0 0L0 32Z" fill="#020617" />
          </svg>
        </div>

        {/* ══════════════════════════════════════════════════════
            HOW IT WORKS
        ══════════════════════════════════════════════════════ */}
        <section
          id="about"
          className="relative bg-white px-4 py-20 sm:px-6 sm:py-28 lg:px-8"
          aria-labelledby="how-it-works-heading"
        >
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto mb-16 max-w-2xl text-center">
              <span className="mb-4 inline-block rounded-full border border-purple-200 bg-purple-50 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-purple-700">
                Simple
              </span>
              <h2 id="how-it-works-heading" className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                From Profile to Paycheck
              </h2>
              <p className="mt-3 text-base text-gray-500 sm:text-lg">
                Get started in minutes — no complex setup, no intermediaries.
              </p>
            </div>

            <div className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {/* Connector line */}
              <div className="pointer-events-none absolute left-0 right-0 top-14 hidden h-px bg-gradient-to-r from-transparent via-purple-200 to-transparent lg:block" aria-hidden="true" />

              {([
                { step: "01", title: "Create Your Profile", description: "Sign up, pick your role, and showcase your niche, audience, platforms, and past partnerships.", icon: "👤", color: "from-purple-500 to-purple-700" },
                { step: "02", title: "Discover Deals", description: "Browse curated brand deals, UGC jobs, sponsorships, and creator opportunities filtered to your niche.", icon: "🔍", color: "from-indigo-500 to-indigo-700" },
                { step: "03", title: "Apply Instantly", description: "One-click applications using your existing profile. Full application history in your dashboard.", icon: "⚡", color: "from-cyan-500 to-cyan-700" },
                { step: "04", title: "Land the Deal", description: "Get accepted, receive briefs, create content, and build long-term brand relationships.", icon: "🎉", color: "from-emerald-500 to-emerald-700" },
              ] as const).map((s, idx) => (
                <div key={s.step} className={`animate-fade-up animate-fade-up-delay-${idx + 1} group relative`}>
                  <div className="glass-card-light bento-glow flex flex-col items-center rounded-2xl p-6 text-center sm:p-8">
                    <div className={`relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${s.color} text-2xl shadow-lg transition-transform duration-300 group-hover:scale-110`}>
                      <span aria-hidden="true">{s.icon}</span>
                      <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white text-[11px] font-extrabold text-gray-800 shadow-md ring-1 ring-gray-100">
                        {s.step}
                      </span>
                    </div>
                    <h3 className="mt-5 text-base font-bold text-gray-900 sm:text-lg">{s.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray-500">{s.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-14 text-center">
              <Link
                href="/signup/role"
                className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-500 px-10 py-4 text-sm font-bold text-white shadow-xl shadow-purple-500/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-purple-500/35 sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                Get Started Free
                <svg className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <p className="mt-3 text-xs text-gray-400">No credit card required · Free forever for creators</p>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            NEWSLETTER CTA
        ══════════════════════════════════════════════════════ */}
        <section
          className="relative overflow-hidden bg-gray-50 px-4 py-20 sm:px-6 sm:py-28 lg:px-8"
          aria-labelledby="newsletter-heading"
        >
          <div className="mx-auto max-w-5xl">
            <div className="aurora-bg relative overflow-hidden rounded-3xl px-8 py-12 text-center shadow-2xl shadow-purple-500/20 sm:px-12 lg:px-16 lg:py-16">
              {/* Noise overlay */}
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.03]"
                style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }}
                aria-hidden="true"
              />
              <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" aria-hidden="true" />
              <div className="pointer-events-none absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" aria-hidden="true" />

              <div className="relative">
                <h2 id="newsletter-heading" className="sr-only">Newsletter — never miss an opportunity</h2>
                <NewsletterForm creatorCount={stats.totalCreators} />
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            FOOTER
        ══════════════════════════════════════════════════════ */}
        <footer
          id="contact"
          className="border-t border-gray-100 bg-white px-4 py-16 sm:px-6 lg:px-8"
          aria-label="Site footer"
        >
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {/* Brand */}
              <div className="sm:col-span-2 lg:col-span-1">
                <Link href="/" className="inline-flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded-lg" aria-label="CreatorHub home">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-cyan-500 text-sm font-bold text-white shadow-md shadow-purple-500/20" aria-hidden="true">C</span>
                  <span className="text-lg font-bold tracking-tight text-gray-900">Creator<span className="text-purple-600">Hub</span></span>
                </Link>
                <p className="mt-4 max-w-xs text-sm leading-relaxed text-gray-500">
                  The premium marketplace where brands post opportunities and creators apply in one click.
                </p>
                <div className="mt-5 flex gap-3" aria-label="Social links">
                  {[
                    { label: "Twitter / X", href: "#twitter", d: "M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" },
                    { label: "Instagram", href: "#instagram", d: "M16 4H8a4 4 0 00-4 4v8a4 4 0 004 4h8a4 4 0 004-4V8a4 4 0 00-4-4zm-4 11a3 3 0 110-6 3 3 0 010 6zm4.5-7.5a1 1 0 110-2 1 1 0 010 2z" },
                    { label: "LinkedIn", href: "#linkedin", d: "M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 2a2 2 0 110 4 2 2 0 010-4z" },
                  ].map((s) => (
                    <a key={s.label} href={s.href} aria-label={s.label} className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 transition hover:border-purple-200 hover:text-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d={s.d} />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>

              {/* For Creators */}
              <nav aria-label="Creator resources">
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-900">For Creators</h3>
                <ul className="space-y-2.5">
                  {[
                    { label: "Browse Opportunities", href: "/opportunities" },
                    { label: "Brand Deals", href: "/opportunities?category=brand-deals" },
                    { label: "Sponsorships", href: "/opportunities?category=sponsorships" },
                    { label: "Affiliate Programs", href: "/opportunities?category=affiliate-programs" },
                    { label: "Creator Jobs", href: "/opportunities?category=creator-jobs" },
                    { label: "UGC Opportunities", href: "/opportunities?category=ugc-jobs" },
                  ].map((l) => (
                    <li key={l.label}>
                      <Link href={l.href} className="text-sm text-gray-500 transition hover:text-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded">{l.label}</Link>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* For Brands */}
              <nav aria-label="Brand resources">
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-900">For Brands</h3>
                <ul className="space-y-2.5">
                  {[
                    { label: "Post Opportunity", href: "/dashboard/opportunities/new" },
                    { label: "My Dashboard", href: "/dashboard" },
                    { label: "Manage Applications", href: "/dashboard/applicants" },
                    { label: "Company Profile", href: "/dashboard/company" },
                    { label: "Sign Up as Brand", href: "/signup/role" },
                  ].map((l) => (
                    <li key={l.label}>
                      <Link href={l.href} className="text-sm text-gray-500 transition hover:text-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded">{l.label}</Link>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Platform */}
              <nav aria-label="Platform links">
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-900">Platform</h3>
                <ul className="space-y-2.5">
                  {[
                    { label: "Sign Up", href: "/signup/role" },
                    { label: "Log In", href: "/login" },
                    { label: "Settings", href: "/dashboard/settings" },
                    { label: "Privacy Policy", href: "#privacy" },
                    { label: "Terms of Service", href: "#terms" },
                  ].map((l) => (
                    <li key={l.label}>
                      <Link href={l.href} className="text-sm text-gray-500 transition hover:text-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded">{l.label}</Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-100 pt-8 sm:flex-row">
              <p className="text-xs text-gray-400">
                &copy; {new Date().getFullYear()} Creator Opportunities Hub. All rights reserved.
              </p>
              <div className="flex gap-6">
                <a href="#privacy" className="text-xs text-gray-400 transition hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded">Privacy</a>
                <a href="#terms" className="text-xs text-gray-400 transition hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded">Terms</a>
                <a href="#cookies" className="text-xs text-gray-400 transition hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded">Cookies</a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
