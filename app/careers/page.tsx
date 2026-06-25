import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Careers | Creator Opportunities Hub",
  description:
    "Join the Creator Opportunities Hub team. We're building the premium marketplace for creators and brands. View open roles and learn about working with us.",
};

const PERKS = [
  { icon: "🌍", title: "Fully Remote", body: "Work from anywhere in the world." },
  { icon: "🧠", title: "Learning Budget", body: "Annual budget for courses, books, and conferences." },
  { icon: "⚡", title: "Modern Stack", body: "Next.js, Supabase, TypeScript, Tailwind — no legacy cruft." },
  { icon: "🎯", title: "Real Impact", body: "Small team means every contribution ships to users fast." },
  { icon: "🕐", title: "Async-First", body: "Flexible hours, no unnecessary meetings." },
  { icon: "📈", title: "Equity", body: "Competitive equity packages for early team members." },
];

export default function CareersPage() {
  return (
    <PageShell label="Careers">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-purple-700 to-cyan-600 px-4 py-20 text-center sm:px-6 sm:py-28 lg:px-8">
        <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-white/5 blur-3xl" aria-hidden="true" />
        <div className="relative mx-auto max-w-3xl">
          <span className="mb-4 inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white/90">
            We&apos;re Hiring
          </span>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Build the Future of Creator Commerce
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
            We&apos;re a small, ambitious team building the premium marketplace where brands and
            creators connect. If you care deeply about product and creator culture, we want to hear from you.
          </p>
        </div>
      </section>

      {/* Coming soon banner */}
      <section className="border-b border-dashed border-amber-200 bg-amber-50 px-4 py-8 text-center sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <span className="text-2xl" aria-hidden="true">🔜</span>
          <h2 className="mt-2 text-lg font-bold text-amber-900">Open roles coming soon</h2>
          <p className="mt-2 text-sm text-amber-700">
            We&apos;re not actively hiring right now, but we&apos;re always interested in talking to
            exceptional people. Send us a note through the{" "}
            <Link href="/contact" className="font-semibold underline underline-offset-2 hover:text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 rounded">
              Contact page
            </Link>{" "}
            with &quot;Career Enquiry&quot; as the subject.
          </p>
        </div>
      </section>

      {/* Perks */}
      <section className="px-4 py-20 sm:px-6 sm:py-24 lg:px-8" aria-labelledby="perks-heading">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <h2 id="perks-heading" className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
              Why Join Us
            </h2>
            <p className="mt-3 text-base text-gray-500">
              We offer a remote-first, async culture with real ownership and growth.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PERKS.map((p) => (
              <div
                key={p.title}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <span className="text-3xl" aria-hidden="true">{p.icon}</span>
                <h3 className="mt-4 text-base font-bold text-gray-900">{p.title}</h3>
                <p className="mt-1 text-sm text-gray-500">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-50 px-4 py-16 text-center sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl">
          <h2 className="text-xl font-bold text-gray-900">Interested in working with us?</h2>
          <p className="mt-3 text-sm text-gray-500">
            Even if no roles are listed, we read every thoughtful message. Tell us what you&apos;d build.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-500 px-8 py-3.5 text-sm font-bold text-white shadow-md shadow-purple-500/20 transition hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
