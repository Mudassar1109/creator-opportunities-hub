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
  }>;
}

export default async function OpportunitiesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const search = params.search || "";
  const category = params.category || "";
  const country = params.country || "";
  const budget = params.budget || "";
  const page = Math.max(1, parseInt(params.page || "1", 10));

  const supabase = await createClient();

  // Fetch categories for filters
  const { data: categories } = await supabase
    .from("categories")
    .select("name, slug")
    .eq("is_active", true)
    .order("sort_order");

  // Build opportunity query
  let query = supabase
    .from("opportunity_details")
    .select("*", { count: "exact" })
    .eq("status", "active")
    .order("is_featured", { ascending: false })
    .order("published_at", { ascending: false });

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
    // Find category name from slug
    const cat = categories?.find((c) => c.slug === category);
    if (cat) {
      // Use ilike to match within the category_names array
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
  const featured = page === 1 && !search && !category && !country && !budget
    ? (opportunities ?? []).filter((o) => o.is_featured).slice(0, 3)
    : [];

  const regular = (opportunities ?? []).filter(
    (o) => !featured.includes(o)
  );

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Browse Opportunities</h1>
          <p className="mt-2 text-gray-500">
            Discover brand deals, sponsorships, and creator jobs from companies worldwide.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <Suspense fallback={<div className="py-4 text-center text-sm text-gray-500">Loading filters...</div>}>
            <OpportunitiesFilters categories={categories ?? []} />
          </Suspense>
        </div>

        {/* Featured Section */}
        {featured.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-4 text-lg font-bold text-gray-900">Featured Opportunities</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

        {/* Results count */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {count !== null ? `${count} opportunities found` : "Loading..."}
          </p>
          {totalPages > 1 && (
            <p className="text-sm text-gray-500">Page {page} of {totalPages}</p>
          )}
        </div>

        {/* Opportunity Grid */}
        {regular.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
            <p className="text-sm font-semibold text-gray-900">No opportunities found</p>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your filters or check back later.</p>
            <Link href="/opportunities" className="mt-4 inline-block text-sm font-semibold text-purple-600 hover:text-purple-700">
              Clear filters
            </Link>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            {page > 1 && (
              <Link
                href={`/opportunities?${new URLSearchParams({ ...Object.fromEntries(Object.entries(params).filter(([, v]) => v)), page: String(page - 1) }).toString()}`}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Previous
              </Link>
            )}
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <Link
                  key={pageNum}
                  href={`/opportunities?${new URLSearchParams({ ...Object.fromEntries(Object.entries(params).filter(([, v]) => v)), page: String(pageNum) }).toString()}`}
                  className={`rounded-lg px-4 py-2 text-sm font-medium ${
                    pageNum === page
                      ? "bg-purple-600 text-white"
                      : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {pageNum}
                </Link>
              );
            })}
            {page < totalPages && (
              <Link
                href={`/opportunities?${new URLSearchParams({ ...Object.fromEntries(Object.entries(params).filter(([, v]) => v)), page: String(page + 1) }).toString()}`}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Next
              </Link>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
