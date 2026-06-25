import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "About | Creator Opportunities Hub",
  description:
    "Learn about Creator Opportunities Hub — the premium marketplace connecting content creators with brand deals, sponsorships, UGC jobs and creator opportunities worldwide.",
};

const STATS = [
  { value: "10K+", label: "Creators registered" },
  { value: "500+", label: "Brands partnered" },
  { value: "50K+", label: "Applications sent" },
  { value: "8", label: "Opportunity categories" },
];

const VALUES = [
  {
    icon: "🎯",
    title: "Real Opportunities Only",
    description:
      "Every listing is posted by a verified brand. No scams, no fake sponsorships, no pay-to-play schemes.",
  },
  {
    icon: "⚡",
    title: "Apply in One Click",
    description:
      "Your profile is your application. Build it once, apply to any opportunity instantly without filling out long forms.",
  },
  {
    icon: "🔒",
    title: "Safe & Transparent",
    description:
      "Budgets are disclosed upfront. You know exactly what you're applying for before you spend a second of your time.",
  },
  {
    icon: "🌍",
    title: "Global Reach",
    description:
      "Opportunities from brands worldwide — remote, on-site, and hybrid — across every creator niche.",
  },
];

const TEAM_ROLES = [
  { role: "Founder & CEO", area: "Platform Strategy" },
  { role: "Head of Product", area: "Creator Experience" },
  { role: "Head of Partnerships", area: "Brand Relations" },
  { role: "Lead Engineer", area: "Platform Infrastructure" },
];

export default function AboutPage() {
  return (
    <PageShell label="About">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-purple-700 to-cyan-600 px-4 py-20 text-center sm:px-6 sm:py-28 lg:px-8">
        <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-white/5 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl" aria-hidden="true" />
        <div className="relative mx-auto max-w-3xl">
          <span className="mb-4 inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white/90">
            Our Mission
          </span>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Connecting Creators with Real Brand Deals
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
            Creator Opportunities Hub was built on one belief: content creators
            deserve a direct, transparent marketplace to find paid work —
            without agents, without gatekeepers, without the noise.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-gray-100 bg-white px-4 py-12 sm:px-6 lg:px-8" aria-label="Platform statistics">
        <div className="mx-auto max-w-7xl">
          <dl className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <dd className="text-3xl font-extrabold text-purple-600 sm:text-4xl">{s.value}</dd>
                <dt className="mt-1 text-sm text-gray-500">{s.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Story */}
      <section className="px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">Our Story</h2>
          <div className="mt-6 space-y-5 text-base leading-relaxed text-gray-600">
            <p>
              Creator Opportunities Hub started from a simple frustration: finding brand deals as a creator
              meant scrolling through DMs, cold-emailing brands with no response, or paying expensive
              agencies to act as intermediaries.
            </p>
            <p>
              We built a platform where brands post real, budgeted opportunities — sponsorships, UGC jobs,
              ambassador programs, brand deals — and creators apply with a single click using their existing
              profile. No middlemen. No mystery budgets. No wasted time.
            </p>
            <p>
              Today, thousands of creators and hundreds of brands use CreatorHub to form lasting partnerships
              that work for both sides.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-gray-50 px-4 py-20 sm:px-6 sm:py-24 lg:px-8" aria-labelledby="values-heading">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <h2 id="values-heading" className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
              What We Stand For
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v) => (
              <div
                key={v.title}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <span className="text-3xl" aria-hidden="true">{v.icon}</span>
                <h3 className="mt-4 text-base font-bold text-gray-900">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team placeholder */}
      <section className="px-4 py-20 sm:px-6 sm:py-24 lg:px-8" aria-labelledby="team-heading">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <h2 id="team-heading" className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
              The Team
            </h2>
            <p className="mt-3 text-base text-gray-500">
              A small team obsessed with creator success.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM_ROLES.map((m) => (
              <div
                key={m.role}
                className="flex flex-col items-center rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-100 to-cyan-100 text-2xl" aria-hidden="true">
                  👤
                </div>
                <p className="mt-4 text-sm font-bold text-gray-900">{m.role}</p>
                <p className="mt-1 text-xs text-gray-500">{m.area}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-purple-600 to-cyan-500 px-4 py-16 text-center sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
            Ready to find your next deal?
          </h2>
          <p className="mt-3 text-base text-white/80">
            Join thousands of creators already earning from brand partnerships.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/opportunities"
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-3.5 text-sm font-bold text-purple-700 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-purple-700"
            >
              Browse Opportunities
            </Link>
            <Link
              href="/signup/role"
              className="inline-flex items-center gap-2 rounded-2xl border-2 border-white/30 bg-white/10 px-8 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-purple-700"
            >
              Join Free
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
