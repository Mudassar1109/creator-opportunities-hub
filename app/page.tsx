// app/page.tsx — Creator Opportunities Hub
// Production-ready landing page with all 10 sections

import { Navbar } from "@/components/navbar";

/* ─── Data ─── */

const STATS = [
  { value: "12,400+", label: "Active Opportunities" },
  { value: "85,000+", label: "Registered Creators" },
  { value: "3,200+", label: "Brands" },
  { value: "48,000+", label: "Monthly Applications" },
] as const;

const OPPORTUNITIES = [
  {
    company: "Nike",
    type: "Sponsorship",
    budget: "$5,000 – $25,000",
    category: "Fitness & Lifestyle",
    badge: "Featured",
  },
  {
    company: "Adobe",
    type: "Brand Deal",
    budget: "$2,000 – $15,000",
    category: "Software & Tech",
    badge: "New",
  },
  {
    company: "Gymshark",
    type: "Ambassador Program",
    budget: "$1,000 – $8,000/mo",
    category: "Fitness",
    badge: "Hot",
  },
  {
    company: "Skillshare",
    type: "Affiliate Program",
    budget: "30% Commission",
    category: "Education",
    badge: "Evergreen",
  },
  {
    company: "Samsung",
    type: "UGC Opportunity",
    budget: "$3,000 – $12,000",
    category: "Technology",
    badge: "Featured",
  },
  {
    company: "Fiverr",
    type: "Creator Job",
    budget: "$500 – $5,000",
    category: "Freelance & Services",
    badge: "Remote",
  },
] as const;

const CATEGORIES = [
  {
    name: "Brand Deals",
    count: "2,400+",
    icon: "🤝",
    gradient: "from-blue-500 to-blue-600",
  },
  {
    name: "Affiliate Programs",
    count: "1,800+",
    icon: "🔗",
    gradient: "from-purple-500 to-purple-600",
  },
  {
    name: "Sponsorships",
    count: "3,100+",
    icon: "🎯",
    gradient: "from-indigo-500 to-indigo-600",
  },
  {
    name: "UGC Jobs",
    count: "980+",
    icon: "🎬",
    gradient: "from-pink-500 to-pink-600",
  },
  {
    name: "Creator Jobs",
    count: "1,500+",
    icon: "💼",
    gradient: "from-emerald-500 to-emerald-600",
  },
  {
    name: "Collaborations",
    count: "760+",
    icon: "🤜",
    gradient: "from-amber-500 to-amber-600",
  },
  {
    name: "Ambassador Programs",
    count: "540+",
    icon: "⭐",
    gradient: "from-rose-500 to-rose-600",
  },
  {
    name: "Remote Work",
    count: "2,200+",
    icon: "🌍",
    gradient: "from-cyan-500 to-cyan-600",
  },
] as const;

const STEPS = [
  {
    step: "01",
    title: "Create Profile",
    description:
      "Sign up and build your creator profile showcasing your niche, audience size, platforms, and past work.",
  },
  {
    step: "02",
    title: "Find Opportunities",
    description:
      "Browse curated brand deals, sponsorships, affiliate programs, and creator jobs matched to your niche.",
  },
  {
    step: "03",
    title: "Apply Instantly",
    description:
      "Submit applications with one click. Track all your applications in a single dashboard.",
  },
  {
    step: "04",
    title: "Get Paid",
    description:
      "Land deals, create content, and get paid directly through our secure platform. No middlemen.",
  },
] as const;

const TESTIMONIALS = [
  {
    name: "Sarah Chen",
    handle: "@sarahcreates",
    platform: "YouTube · 420K subscribers",
    quote:
      "I landed 3 brand deals in my first month. The quality of opportunities here is unmatched — real brands, real budgets, real results.",
    avatar: "SC",
  },
  {
    name: "Marcus Rivera",
    handle: "@marcusrivera",
    platform: "TikTok · 1.2M followers",
    quote:
      "This platform changed how I approach sponsorships. The ambassador program I found here now pays me $4k/month on autopilot.",
    avatar: "MR",
  },
  {
    name: "Priya Sharma",
    handle: "@priyasharma",
    platform: "Instagram · 280K followers",
    quote:
      "As a micro-influencer I always struggled to find legit opportunities. Within 2 weeks I had my first paid UGC deal. Life changing.",
    avatar: "PS",
  },
] as const;

const COUNTRIES = [
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "India",
  "Brazil",
  "Japan",
  "UAE",
  "Singapore",
  "Netherlands",
] as const;

const CATEGORY_FILTER_OPTIONS = [
  "All Categories",
  "Brand Deals",
  "Affiliate Programs",
  "Sponsorships",
  "UGC Jobs",
  "Creator Jobs",
  "Collaborations",
  "Ambassador Programs",
  "Remote Work",
] as const;

/* ─── Helpers ─── */
function BadgeColor(badge: string) {
  switch (badge) {
    case "Featured":
      return "bg-blue-100 text-blue-700";
    case "New":
      return "bg-emerald-100 text-emerald-700";
    case "Hot":
      return "bg-orange-100 text-orange-700";
    case "Evergreen":
      return "bg-purple-100 text-purple-700";
    case "Remote":
      return "bg-cyan-100 text-cyan-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

/* ─── Page Component ─── */
export default function HomePage() {
  return (
    <main id="home" className="flex-1 bg-white text-gray-900">
      {/* ═══════════════════════════════════════════
          1 · STICKY NAVBAR
      ═══════════════════════════════════════════ */}
      <Navbar />

      {/* ═══════════════════════════════════════════
          2 · HERO SECTION
      ═══════════════════════════════════════════ */}
      <section className="relative overflow-hidden pb-20 pt-24 sm:pb-28 sm:pt-32 lg:pb-36 lg:pt-40">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -top-32 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-br from-blue-100/60 via-purple-100/40 to-indigo-100/60 blur-3xl" />
        <div className="pointer-events-none absolute -left-40 top-20 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl" />
        <div className="pointer-events-none absolute -right-40 top-40 h-72 w-72 rounded-full bg-purple-200/30 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          {/* Pill badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-semibold text-blue-700 sm:text-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            Trusted by 85,000+ creators worldwide
          </div>

          <h1 className="mx-auto max-w-4xl text-4xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-7xl">
            Find Your Next{" "}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Creator Opportunity
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-gray-500 sm:text-lg md:text-xl">
            Discover sponsorships, affiliate programs, brand deals, collaborations
            and creator jobs from companies worldwide.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#opportunities"
              className="w-full rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-blue-500/25 transition hover:shadow-2xl hover:shadow-blue-500/30 sm:w-auto sm:text-lg"
            >
              Explore Opportunities
            </a>
            <a
              href="#post"
              className="w-full rounded-2xl border-2 border-gray-200 bg-white px-8 py-4 text-base font-bold text-gray-800 shadow-sm transition hover:border-gray-300 hover:shadow-md sm:w-auto sm:text-lg"
            >
              Post Opportunity
            </a>
          </div>

          {/* Trust logos */}
          <p className="mt-14 text-xs font-medium uppercase tracking-widest text-gray-400">
            Featured by brands like
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm font-semibold text-gray-300">
            {["Nike", "Adobe", "Samsung", "Gymshark", "Skillshare", "Fiverr"].map((b) => (
              <span key={b} className="text-gray-300 transition hover:text-gray-500">{b}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          3 · SEARCH SECTION
      ═══════════════════════════════════════════ */}
      <section className="relative -mt-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-3xl border border-gray-100 bg-white p-4 shadow-xl shadow-gray-200/60 sm:p-6">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {/* Keyword */}
            <div className="relative lg:col-span-1">
              <label htmlFor="keyword" className="sr-only">Search keyword</label>
              <svg
                className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
              </svg>
              <input
                id="keyword"
                type="text"
                placeholder="Search opportunities…"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="sr-only">Category</label>
              <select
                id="category"
                className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                defaultValue="All Categories"
              >
                {CATEGORY_FILTER_OPTIONS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Country */}
            <div>
              <label htmlFor="country" className="sr-only">Country</label>
              <select
                id="country"
                className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                defaultValue="All Countries"
              >
                <option>All Countries</option>
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Search Button */}
            <button
              type="button"
              className="rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition hover:shadow-xl hover:shadow-blue-500/30"
            >
              Search
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          4 · STATISTICS SECTION
      ═══════════════════════════════════════════ */}
      <section className="px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-4">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm transition hover:border-blue-200 hover:shadow-lg sm:p-8"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 via-purple-50/0 to-indigo-50/0 transition group-hover:from-blue-50/80 group-hover:via-purple-50/60 group-hover:to-indigo-50/80" />
                <div className="relative">
                  <p className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-3xl font-extrabold text-transparent sm:text-4xl lg:text-5xl">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-sm font-medium text-gray-500">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          5 · FEATURED OPPORTUNITIES
      ═══════════════════════════════════════════ */}
      <section id="opportunities" className="bg-gray-50/60 px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <span className="mb-3 inline-block rounded-full bg-blue-100 px-4 py-1 text-xs font-bold uppercase tracking-wider text-blue-700">
              Featured
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Featured Opportunities
            </h2>
            <p className="mt-3 text-base text-gray-500 sm:text-lg">
              Hand-picked brand deals and creator jobs from top companies.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {OPPORTUNITIES.map((opp) => (
              <article
                key={opp.company}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:border-blue-200 hover:shadow-xl"
              >
                {/* Badge */}
                <span className={`mb-4 inline-flex w-fit rounded-lg px-3 py-1 text-xs font-bold ${BadgeColor(opp.badge)}`}>
                  {opp.badge}
                </span>

                {/* Company */}
                <h3 className="text-xl font-bold text-gray-900">{opp.company}</h3>
                <p className="mt-1 text-sm font-semibold text-blue-600">{opp.type}</p>

                {/* Details */}
                <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Budget</p>
                    <p className="mt-0.5 text-sm font-bold text-gray-900">{opp.budget}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Category</p>
                    <p className="mt-0.5 text-sm font-medium text-gray-600">{opp.category}</p>
                  </div>
                </div>

                {/* Apply */}
                <a
                  href="#apply"
                  className="mt-6 block rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 py-3 text-center text-sm font-bold text-white shadow-md shadow-blue-500/20 transition group-hover:shadow-lg group-hover:shadow-blue-500/30"
                >
                  Apply Now
                </a>
              </article>
            ))}
          </div>

          <div className="mt-12 text-center">
            <a
              href="#all-opportunities"
              className="inline-flex items-center gap-2 rounded-2xl border-2 border-gray-200 bg-white px-8 py-3.5 text-sm font-bold text-gray-800 shadow-sm transition hover:border-gray-300 hover:shadow-md"
            >
              View All Opportunities
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          6 · CATEGORIES GRID
      ═══════════════════════════════════════════ */}
      <section id="categories" className="px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <span className="mb-3 inline-block rounded-full bg-purple-100 px-4 py-1 text-xs font-bold uppercase tracking-wider text-purple-700">
              Browse
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Explore Categories
            </h2>
            <p className="mt-3 text-base text-gray-500 sm:text-lg">
              Find the perfect opportunity type for your creator career.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
            {CATEGORIES.map((cat) => (
              <a
                key={cat.name}
                href={`#cat-${cat.name.replace(/\s+/g, "-").toLowerCase()}`}
                className="group relative flex flex-col items-center overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm transition hover:border-transparent hover:shadow-xl sm:p-8"
              >
                {/* Hover gradient bg */}
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-0 transition group-hover:opacity-100`} />

                <span className="relative text-3xl sm:text-4xl">{cat.icon}</span>
                <h3 className="relative mt-3 text-sm font-bold text-gray-900 transition group-hover:text-white sm:text-base">
                  {cat.name}
                </h3>
                <p className="relative mt-1 text-xs font-medium text-gray-400 transition group-hover:text-white/80 sm:text-sm">
                  {cat.count} listings
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          7 · HOW IT WORKS
      ═══════════════════════════════════════════ */}
      <section id="about" className="bg-gray-50/60 px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <span className="mb-3 inline-block rounded-full bg-indigo-100 px-4 py-1 text-xs font-bold uppercase tracking-wider text-indigo-700">
              Simple
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-3 text-base text-gray-500 sm:text-lg">
              Get started in minutes — from profile to paycheck.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, idx) => (
              <div key={s.step} className="group relative">
                {/* Connector line (hidden on last) */}
                {idx < STEPS.length - 1 && (
                  <div className="absolute right-0 top-12 hidden h-0.5 w-full translate-x-1/2 bg-gradient-to-r from-blue-200 to-purple-200 lg:block" />
                )}

                <div className="relative flex flex-col items-center rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm transition hover:border-blue-200 hover:shadow-lg sm:p-8">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 text-lg font-extrabold text-white shadow-md shadow-blue-500/25">
                    {s.step}
                  </span>
                  <h3 className="mt-5 text-lg font-bold text-gray-900">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">{s.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          8 · TESTIMONIALS
      ═══════════════════════════════════════════ */}
      <section className="px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <span className="mb-3 inline-block rounded-full bg-rose-100 px-4 py-1 text-xs font-bold uppercase tracking-wider text-rose-700">
              Loved by Creators
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              What Creators Say
            </h2>
            <p className="mt-3 text-base text-gray-500 sm:text-lg">
              Real results from real creators using our platform.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <blockquote
                key={t.name}
                className="flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-lg sm:p-8"
              >
                {/* Stars */}
                <div className="mb-4 flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-5 w-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
                    </svg>
                  ))}
                </div>

                <p className="flex-1 text-sm leading-relaxed text-gray-600 sm:text-base">
                  &ldquo;{t.quote}&rdquo;
                </p>

                <footer className="mt-6 flex items-center gap-3 border-t border-gray-100 pt-5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 text-xs font-bold text-white">
                    {t.avatar}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.platform}</p>
                  </div>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          9 · NEWSLETTER
      ═══════════════════════════════════════════ */}
      <section className="px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 p-8 text-center shadow-2xl shadow-purple-500/25 sm:p-12 lg:p-16">
          {/* Decorative circles */}
          <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />

          <div className="relative">
            <h2 className="text-2xl font-extrabold text-white sm:text-3xl lg:text-4xl">
              Never Miss an Opportunity
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-white/80 sm:text-base">
              Join 85,000+ creators and get the best brand deals, sponsorships and
              creator jobs delivered to your inbox every week.
            </p>

            <form className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                type="email"
                required
                placeholder="you@example.com"
                className="flex-1 rounded-xl border-2 border-white/20 bg-white/10 px-5 py-3.5 text-sm text-white placeholder-white/60 outline-none backdrop-blur-sm transition focus:border-white/40 focus:bg-white/20"
              />
              <button
                type="submit"
                className="rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-blue-700 shadow-lg transition hover:bg-gray-100 hover:shadow-xl"
              >
                Subscribe Free
              </button>
            </form>

            <p className="mt-4 text-xs text-white/60">
              No spam. Unsubscribe anytime. We respect your privacy.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          10 · PREMIUM FOOTER
      ═══════════════════════════════════════════ */}
      <footer id="contact" className="border-t border-gray-100 bg-gray-50/60 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <a href="#home" className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 text-sm font-bold text-white shadow-md">
                  C
                </span>
                <span className="text-lg font-bold tracking-tight text-gray-900">
                  Creator<span className="text-blue-600">Hub</span>
                </span>
              </a>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-gray-500">
                The #1 platform for content creators to discover brand deals,
                sponsorships, affiliate programs, and creator jobs worldwide.
              </p>
              {/* Social */}
              <div className="mt-5 flex gap-3">
                {[
                  { label: "Twitter", path: "M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" },
                  { label: "Instagram", path: "M16 4H8a4 4 0 00-4 4v8a4 4 0 004 4h8a4 4 0 004-4V8a4 4 0 00-4-4zm-4 11a3 3 0 110-6 3 3 0 010 6zm4.5-7.5a1 1 0 110-2 1 1 0 010 2z" },
                  { label: "LinkedIn", path: "M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 2a2 2 0 110 4 2 2 0 010-4z" },
                ].map((social) => (
                  <a
                    key={social.label}
                    href={`#${social.label.toLowerCase()}`}
                    aria-label={social.label}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 transition hover:border-blue-200 hover:text-blue-600"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={social.path} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            {/* For Creators */}
            <div>
              <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-900">For Creators</h4>
              <ul className="space-y-2.5">
                {["Browse Opportunities", "Brand Deals", "Sponsorships", "Affiliate Programs", "Creator Jobs", "UGC Opportunities"].map((l) => (
                  <li key={l}>
                    <a href="#" className="text-sm text-gray-500 transition hover:text-blue-600">{l}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* For Brands */}
            <div>
              <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-900">For Brands</h4>
              <ul className="space-y-2.5">
                {["Post Opportunity", "Pricing", "Enterprise Plans", "Creator Search", "Campaign Tools", "Analytics"].map((l) => (
                  <li key={l}>
                    <a href="#" className="text-sm text-gray-500 transition hover:text-blue-600">{l}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-900">Company</h4>
              <ul className="space-y-2.5">
                {["About Us", "Blog", "Careers", "Press", "Privacy Policy", "Terms of Service", "Contact"].map((l) => (
                  <li key={l}>
                    <a href="#" className="text-sm text-gray-500 transition hover:text-blue-600">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-8 sm:flex-row">
            <p className="text-xs text-gray-400">
              &copy; {new Date().getFullYear()} Creator Opportunities Hub. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#privacy" className="text-xs text-gray-400 transition hover:text-gray-600">Privacy</a>
              <a href="#terms" className="text-xs text-gray-400 transition hover:text-gray-600">Terms</a>
              <a href="#cookies" className="text-xs text-gray-400 transition hover:text-gray-600">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
