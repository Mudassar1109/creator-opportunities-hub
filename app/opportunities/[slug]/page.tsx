import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/navbar";
import { ApplyButton } from "./apply-button";
import { SaveButton } from "@/components/save-button";
import { ShareButton, ShareSection } from "@/components/share-buttons";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(dateStr);
}

function formatType(type: string): string {
  return type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatLocation(type: string): string {
  return type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

const TYPE_COLORS: Record<string, string> = {
  brand_deal: "bg-blue-50 text-blue-700 border-blue-200",
  sponsorship: "bg-indigo-50 text-indigo-700 border-indigo-200",
  ugc: "bg-pink-50 text-pink-700 border-pink-200",
  creator_job: "bg-emerald-50 text-emerald-700 border-emerald-200",
  affiliate_program: "bg-purple-50 text-purple-700 border-purple-200",
  collaboration: "bg-amber-50 text-amber-700 border-amber-200",
  ambassador_program: "bg-rose-50 text-rose-700 border-rose-200",
  remote_work: "bg-cyan-50 text-cyan-700 border-cyan-200",
  paid_campaign: "bg-violet-50 text-violet-700 border-violet-200",
};

export default async function OpportunityDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: opp } = await supabase
    .from("opportunities")
    .select("*, brands(company_name, logo_url, website, is_verified)")
    .eq("slug", slug)
    .maybeSingle();

  if (!opp) notFound();

  const brand = opp.brands as unknown as {
    company_name: string;
    logo_url: string | null;
    website: string | null;
    is_verified: boolean;
  } | null;

  supabase
    .from("opportunities")
    .update({ views_count: (opp.views_count ?? 0) + 1 })
    .eq("id", opp.id)
    .then(() => {}, () => {});

  const { data: oppCategories } = await supabase
    .from("opportunity_categories")
    .select("categories(id, name, slug)")
    .eq("opportunity_id", opp.id);

  const categoryList = oppCategories?.map(
    (oc) => (oc.categories as unknown as { name: string; slug: string })
  ) ?? [];

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: opp.currency || "USD",
      maximumFractionDigits: 0,
    }).format(n);

  let budgetDisplay = "Negotiable";
  if (opp.budget_type === "range" && opp.budget_min && opp.budget_max) {
    budgetDisplay = `${fmt(opp.budget_min)} \u2013 ${fmt(opp.budget_max)}`;
  } else if (opp.budget_min || opp.budget_max) {
    budgetDisplay = fmt(opp.budget_min ?? opp.budget_max ?? 0);
  } else if (opp.budget_type === "commission") {
    budgetDisplay = "Commission-based";
  } else if (opp.budget_type === "fixed" && (opp.budget_min || opp.budget_max)) {
    budgetDisplay = fmt(opp.budget_min ?? opp.budget_max ?? 0);
  }

  const isExpired = opp.deadline ? new Date(opp.deadline) < new Date() : false;
  const isActive = opp.status === "active" && !isExpired;
  const typeColor = TYPE_COLORS[opp.opportunity_type] ?? "bg-slate-50 text-slate-600 border-slate-200";

  function checklistItems(text: string | null): string[] {
    if (!text) return [];
    return text.split("\n").filter((line) => line.trim().length > 0);
  }

  const reqItems = checklistItems(opp.requirements);
  const delItems = checklistItems(opp.deliverables);

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      {/* ══════════════════════════════════════════════════════
          BREADCRUMB
      ══════════════════════════════════════════════════════ */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-3 text-sm text-slate-500 sm:px-6 lg:px-8">
          <Link href="/" className="transition-colors hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded">
            Home
          </Link>
          <svg className="h-3.5 w-3.5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <Link href="/opportunities" className="transition-colors hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded">
            Opportunities
          </Link>
          <svg className="h-3.5 w-3.5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <span className="truncate font-medium text-slate-900">{opp.title}</span>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          HERO HEADER
      ══════════════════════════════════════════════════════ */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Hero content */}
            <div className="lg:col-span-2">
              {/* Logo + company row */}
              <div className="flex items-center gap-4">
                <div className="shrink-0">
                  {brand?.logo_url ? (
                    <img
                      src={brand.logo_url}
                      alt={`${brand.company_name} logo`}
                      className="h-14 w-14 rounded-2xl border border-slate-200 object-contain bg-white shadow-sm sm:h-16 sm:w-16"
                    />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-100 to-cyan-100 text-xl font-bold text-indigo-600 shadow-sm sm:h-16 sm:w-16">
                      {brand?.company_name?.[0]?.toUpperCase() ?? "B"}
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-base font-bold text-slate-700 sm:text-lg">
                      {brand?.company_name || "Brand"}
                    </span>
                    {brand?.is_verified && (
                      <svg
                        className="h-5 w-5 shrink-0 text-blue-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-label="Verified brand"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    <span className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-[11px] font-semibold ${typeColor}`}>
                      {formatType(opp.opportunity_type)}
                    </span>
                    {opp.is_featured && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-gradient-to-r from-indigo-600 to-blue-600 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        Featured
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Title */}
              <h1 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-[2.5rem]">
                {opp.title}
              </h1>

              {/* Categories */}
              {categoryList.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {categoryList.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/opportunities?category=${cat.slug}`}
                      className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 transition-colors hover:bg-indigo-100 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}

              {/* Meta row */}
              <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                  <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {budgetDisplay}
                </div>
                {opp.country && (
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {opp.country}
                  </span>
                )}
                {opp.location_type && (
                  <span className="flex items-center gap-1.5 text-slate-500">
                    {opp.is_remote ? (
                      <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    )}
                    {formatLocation(opp.location_type)}
                  </span>
                )}
                {opp.published_at && (
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {timeAgo(opp.published_at)}
                  </span>
                )}
              </div>

              {/* Stats row */}
              <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-slate-500">
                {opp.deadline && (
                  <span className={`flex items-center gap-1.5 font-medium ${isExpired ? "text-red-500" : "text-slate-500"}`}>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {isExpired ? "Expired" : `Apply by ${formatDate(opp.deadline)}`}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {opp.applications_count ?? 0} application{(opp.applications_count ?? 0) !== 1 ? "s" : ""}
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {opp.views_count ?? 0} view{(opp.views_count ?? 0) !== 1 ? "s" : ""}
                </span>
                {opp.min_followers > 0 && (
                  <span className="flex items-center gap-1.5">
                    <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Min. {opp.min_followers.toLocaleString()} followers
                  </span>
                )}
              </div>
            </div>

            {/* Desktop sidebar CTA */}
            <div className="hidden lg:block">
              <div className="sticky top-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <ApplyButton
                  opportunityId={opp.id}
                  opportunityTitle={opp.title}
                  isActive={isActive}
                  slug={slug}
                />
                <div className="mt-4 flex gap-2">
                  <SaveButton />
                  <ShareButton title={opp.title} />
                </div>

                <div className="mt-5 space-y-3 border-t border-slate-100 pt-5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Budget</span>
                    <span className="font-bold text-slate-900">{budgetDisplay}</span>
                  </div>
                  {opp.deadline && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Deadline</span>
                      <span className={`font-bold ${isExpired ? "text-red-500" : "text-slate-900"}`}>
                        {isExpired ? "Expired" : formatDate(opp.deadline)}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Applications</span>
                    <span className="font-bold text-slate-900">{opp.applications_count ?? 0}</span>
                  </div>
                </div>

                {/* Company in sidebar */}
                <div className="mt-5 border-t border-slate-100 pt-5">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Company</p>
                  <div className="flex items-center gap-3">
                    <div className="shrink-0">
                      {brand?.logo_url ? (
                        <img
                          src={brand.logo_url}
                          alt={`${brand.company_name} logo`}
                          className="h-10 w-10 rounded-xl border border-slate-200 object-contain bg-white"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-sm font-bold text-indigo-600">
                          {brand?.company_name?.[0]?.toUpperCase() ?? "B"}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{brand?.company_name}</p>
                      {brand?.website && (
                        <a
                          href={brand.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-medium text-indigo-600 transition-colors hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
                        >
                          Visit website
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          MAIN CONTENT + SIDEBAR
      ══════════════════════════════════════════════════════ */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left column — main content */}
          <div className="space-y-8 lg:col-span-2">
            {/* Description */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="mb-4 text-lg font-extrabold text-slate-900">Description</h2>
              <div className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-600 prose-headings:text-slate-900 prose-a:text-indigo-600 whitespace-pre-wrap">
                {opp.description}
              </div>
            </section>

            {/* Requirements */}
            {reqItems.length > 0 && (
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="mb-5 text-lg font-extrabold text-slate-900">Requirements</h2>
                <ul className="space-y-3">
                  {reqItems.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                        <svg className="h-3 w-3 text-emerald-600" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                      <span className="text-sm leading-relaxed text-slate-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Deliverables */}
            {delItems.length > 0 && (
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="mb-5 text-lg font-extrabold text-slate-900">Deliverables</h2>
                <ul className="space-y-3">
                  {delItems.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100">
                        <svg className="h-3 w-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                      <span className="text-sm leading-relaxed text-slate-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Platforms */}
            {opp.platforms && opp.platforms.length > 0 && (
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="mb-4 text-lg font-extrabold text-slate-900">Platforms Required</h2>
                <div className="flex flex-wrap gap-2">
                  {opp.platforms.map((p) => (
                    <span
                      key={p}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-3.5 py-1.5 text-sm font-semibold text-indigo-700"
                    >
                      <svg className="h-3.5 w-3.5 text-indigo-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {p}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Niches */}
            {opp.niches && opp.niches.length > 0 && (
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="mb-4 text-lg font-extrabold text-slate-900">Target Niches</h2>
                <div className="flex flex-wrap gap-2">
                  {opp.niches.map((n) => (
                    <span
                      key={n}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-200 bg-cyan-50 px-3.5 py-1.5 text-sm font-semibold text-cyan-700"
                    >
                      <svg className="h-3.5 w-3.5 text-cyan-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {n}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Share section */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="mb-4 text-lg font-extrabold text-slate-900">Share this Opportunity</h2>
              <ShareSection title={opp.title} slug={slug} />
            </section>
          </div>

          {/* Right column — sidebar (desktop, already handled in hero) */}
          <div className="hidden lg:block" />
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          MOBILE STICKY BOTTOM BAR
      ══════════════════════════════════════════════════════ */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white shadow-2xl lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6">
          <div className="flex-1">
            <p className="text-xs font-medium text-slate-500">Budget</p>
            <p className="text-sm font-extrabold text-slate-900">{budgetDisplay}</p>
          </div>
          <div className="flex items-center gap-2">
            <SaveButton />
            <div className="w-40">
              <ApplyButton
                opportunityId={opp.id}
                opportunityTitle={opp.title}
                isActive={isActive}
                slug={slug}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}


