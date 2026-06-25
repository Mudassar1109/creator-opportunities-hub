import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Blog | Creator Opportunities Hub",
  description:
    "Creator tips, brand deal guides, platform updates and creator economy insights from the Creator Opportunities Hub team.",
};

const UPCOMING_TOPICS = [
  { icon: "🎯", topic: "How to land your first brand deal" },
  { icon: "📊", topic: "Negotiating rates as a micro-creator" },
  { icon: "🤝", topic: "What brands actually look for in a creator" },
  { icon: "📸", topic: "Building a portfolio that converts" },
  { icon: "🌍", topic: "Global brand deals: opportunities outside the US" },
  { icon: "⚡", topic: "UGC vs sponsored content — which pays more?" },
];

export default function BlogPage() {
  return (
    <PageShell label="Blog">
      {/* Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-purple-700 to-cyan-600 px-4 py-20 text-center sm:px-6 sm:py-24 lg:px-8">
        <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-white/5 blur-3xl" aria-hidden="true" />
        <div className="relative mx-auto max-w-3xl">
          <span className="mb-4 inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white/90">
            Creator Resources
          </span>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            The CreatorHub Blog
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
            Practical guides, deal breakdowns, and creator economy insights —
            from people who live and breathe this industry.
          </p>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-purple-100 to-cyan-100 text-4xl" aria-hidden="true">
            ✍️
          </div>
          <h2 className="mt-6 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
            Coming Soon
          </h2>
          <p className="mx-auto mt-4 max-w-md text-base text-gray-500">
            Our editorial team is writing the first batch of guides. Subscribe to
            the newsletter to be notified when they go live.
          </p>
          <Link
            href="/#newsletter-heading"
            className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-500 px-8 py-3.5 text-sm font-bold text-white shadow-md shadow-purple-500/20 transition hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            Subscribe for Updates
          </Link>
        </div>

        {/* Upcoming topics */}
        <div className="mx-auto mt-16 max-w-4xl">
          <h2 className="mb-8 text-center text-lg font-bold text-gray-900">Topics we&apos;re covering</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {UPCOMING_TOPICS.map((t) => (
              <div
                key={t.topic}
                className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3.5 shadow-sm"
              >
                <span className="text-xl" aria-hidden="true">{t.icon}</span>
                <p className="text-sm font-medium text-gray-700">{t.topic}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Browse deals CTA */}
      <section className="bg-gray-50 px-4 py-16 text-center sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl">
          <h2 className="text-xl font-bold text-gray-900">While you wait — find real deals</h2>
          <p className="mt-3 text-sm text-gray-500">
            Browse active brand deals and creator opportunities on the platform right now.
          </p>
          <Link
            href="/opportunities"
            className="mt-6 inline-flex items-center gap-2 rounded-2xl border-2 border-gray-200 bg-white px-8 py-3.5 text-sm font-bold text-gray-800 shadow-sm transition hover:border-purple-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            Browse Opportunities
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
