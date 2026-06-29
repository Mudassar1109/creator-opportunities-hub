import { Suspense } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/navbar";
import { OpportunityCard } from "@/components/opportunity-card";
import { OpportunitiesFilters } from "@/components/opportunities-filters";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Opportunities | CreatorHub - Find Brand Deals & Creator Jobs",
  description: "Browse brand deals, sponsorships, affiliate programs, UGC jobs, and creator opportunities worldwide.",
};

const PER_PAGE = 12;

interface PageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    country?: string;
    budget?: string;
    page?: string;
    sort?: string;
  }>;
}

export default async function OpportunitiesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const search = params.search || "";
  const category = params.category || "";
  const country = params.country || "";
  const budget = params.budget || "";
  const sort = params.sort || "newest";
  const page = Math.max(1, parseInt(params.page || "1", 10));

  const supabase = await createClient();

  // Fetch categories for filters
  const { data: categories } = await supabase
    .from("categories")
    .select("name, slug")
    .eq("is_active", true)
    .order("sort_order");

  // Fetch total count (unpaginated) for hero stat
  const { count: totalActive } = await supabase
    .from("opportunity_details")
    .select("*", { count: "exact", head: true })
    .eq("status", "active");

  // Build opportunity query
  let query = supabase
    .from("opportunity_details")
    .select("*", { count: "exact" })
    .eq("status", "active");

  // Apply sort
  if (sort === "budget_high") {
    query = query.order("budget_max", { ascending: false });
  } else if (sort === "budget_low") {
    query = query.order("budget_max", { ascending: true });
  } else if (sort === "deadline") {
    query = query.order("deadline", { ascending: true });
  } else {
    // default: newest
    query = query.order("is_featured", { ascending: false }).order("published_at", { ascending: false });
  }

  // Text search
  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
  }

  // Country filter
  if (country) {
    query = query.eq("country", country);
  }

  // Budget filter
  if (budget) {
    if (budget.endsWith("+")) {
      const min = parseInt(budget, 10);
      query = query.gte("budget_max", min);
    } else {
      const [min, max] = budget.split("-").map(Number);
      if (min !== undefined && max !== undefined) {
        query = query.gte("budget_max", min).lte("budget_min", max);
      }
    }
  }

  // Category filter
  if (category) {
    const cat = categories?.find((c) => c.slug === category);
    if (cat) {
      query = query.contains("category_names", [cat.name]);
    }
  }

  // Pagination
  const from = (page - 1) * PER_PAGE;
  const to = from + PER_PAGE - 1;
  query = query.range(from, to);

  const { data: opportunities, count } = await query;

  const totalPages = Math.ceil((count ?? 0) / PER_PAGE);

  // Featured opportunities for top section (first page only)
  const featured = sort === "newest" && page === 1 && !search && !category && !country && !budget
    ? (opportunities ?? []).filter((o) => o.is_featured).slice(0, 3)
    : [];

  const regular = (opportunities ?? []).filter(
    (o) => !featured.includes(o)
  );

  const hasActiveFilters = search || category || country || budget;

  function buildPaginationUrl(p: number): string {
    const sp = new URLSearchParams();
    if (search) sp.set("search", search);
    if (category) sp.set("category", category);
    if (country) sp.set("country", country);
    if (budget) sp.set("budget", budget);
    if (sort && sort !== "newest") sp.set("sort", sort);
    sp.set("page", String(p));
    return `/opportunities?${sp.toString()}`;
  }

  function buildClearUrl(): string {
    if (sort && sort !== "newest") return `/opportunities?sort=${sort}`;
    return "/opportunities";
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      {/* ══════════════════════════════════════════════════════
          HERO — Page header
      ══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-white to-slate-50 pb-12 pt-8 sm:pb-16 sm:pt-12 lg:pb-20 lg:pt-16">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -right-32 top-0 h-[400px] w-[400px] rounded-full bg-indigo-100/60 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -left-40 bottom-0 h-[300px] w-[300px] rounded-full bg-cyan-100/40 blur-3xl" aria-hidden="true" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            {/* Live count badge */}
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-xs font-semibold text-indigo-700">
                {totalActive !== null ? `${totalActive} live opportunities` : "Loading opportunities..."}
              </span>
            </div>

            <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Find Your Next{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent">Creator Deal</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-500 sm:text-lg">
              Browse brand deals, sponsorships, UGC jobs, and affiliate programs from companies worldwide. Filter by category, budget, and location.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8">
        {/* Filters */}
        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <Suspense fallback={
            <div className="flex h-[42px] items-center justify-center text-sm text-slate-400">
              <svg className="h-5 w-5 animate-spin text-indigo-600" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span className="ml-2">Loading filters...</span>
            </div>
          }>
            <OpportunitiesFilters categories={categories ?? []} />
          </Suspense>
        </div>

        {/* Featured Section */}
        {featured.length > 0 && (
          <section className="mb-10">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-sm">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-slate-900">Featured Opportunities</h2>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((opp) => (
                <OpportunityCard
                  key={opp.id}
                  id={opp.id}
                  title={opp.title}
                  slug={opp.slug}
                  brand_name={opp.brand_name}
                  brand_logo={opp.brand_logo}
                  brand_verified={opp.brand_verified}
                  opportunity_type={opp.opportunity_type}
                  budget_min={opp.budget_min}
                  budget_max={opp.budget_max}
                  budget_type={opp.budget_type}
                  currency={opp.currency}
                  country={opp.country}
                  deadline={(opp as unknown as { deadline?: string }).deadline}
                  is_featured={opp.is_featured}
                  category_names={opp.category_names}
                  applications_count={opp.applications_count}
                />
              ))}
            </div>
          </section>
        )}

        {/* Results header */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-medium text-slate-500">
            {count !== null
              ? <><span className="font-bold text-slate-900">{count}</span> {count === 1 ? "opportunity" : "opportunities"} found</>
              : "Searching..."}
            {hasActiveFilters && (
              <Link
                href={buildClearUrl()}
                className="ml-3 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                Clear filters
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Link>
            )}
          </p>
          {totalPages > 1 && (
            <p className="text-xs font-medium text-slate-400">
              Page <span className="font-bold text-slate-700">{page}</span> of {totalPages}
            </p>
          )}
        </div>

        {/* Opportunity Grid */}
        {regular.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {regular.map((opp) => (
              <OpportunityCard
                key={opp.id}
                id={opp.id}
                title={opp.title}
                slug={opp.slug}
                brand_name={opp.brand_name}
                brand_logo={opp.brand_logo}
                brand_verified={opp.brand_verified}
                opportunity_type={opp.opportunity_type}
                budget_min={opp.budget_min}
                budget_max={opp.budget_max}
                budget_type={opp.budget_type}
                currency={opp.currency}
                country={opp.country}
                deadline={(opp as unknown as { deadline?: string }).deadline}
                is_featured={opp.is_featured}
                category_names={opp.category_names}
                applications_count={opp.applications_count}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-3xl" aria-hidden="true">
              <svg className="h-8 w-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="mt-5 text-lg font-bold text-slate-900">No opportunities match your filters</h3>
            <p className="mt-2 max-w-sm text-sm text-slate-500">
              Try adjusting your search criteria or removing some filters to see more results.
            </p>
            <Link
              href={buildClearUrl()}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-indigo-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset Filters
            </Link>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Pagination">
            {page > 1 && (
              <Link
                href={buildPaginationUrl(page - 1)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </Link>
            )}
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <Link
                    key={pageNum}
                    href={buildPaginationUrl(pageNum)}
                    className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                      pageNum === page
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                        : "border border-slate-200 bg-white text-slate-700 shadow-sm hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                    }`}
                    aria-current={pageNum === page ? "page" : undefined}
                  >
                    {pageNum}
                  </Link>
                );
              })}
            </div>
            {page < totalPages && (
              <Link
                href={buildPaginationUrl(page + 1)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Next
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )}
          </nav>
        )}
      </div>
    </main>
  );
}
