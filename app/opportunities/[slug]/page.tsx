import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/navbar";
import { ApplyButton } from "./apply-button";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function OpportunityDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  // Fetch opportunity from table directly (has all fields)
  const { data: opp } = await supabase
    .from("opportunities")
    .select("*, brands(company_name, logo_url, website, is_verified)")
    .eq("slug", slug)
    .single();

  if (!opp) notFound();

  const brand = opp.brands as unknown as { company_name: string; logo_url: string | null; website: string | null; is_verified: boolean } | null;

  // Increment views (fire and forget)
  supabase
    .from("opportunities")
    .update({ views_count: (opp.views_count ?? 0) + 1 })
    .eq("id", opp.id)
    .then(() => {});

  // Fetch categories
  const { data: oppCategories } = await supabase
    .from("opportunity_categories")
    .select("categories(id, name, slug)")
    .eq("opportunity_id", opp.id);

  const categoryList = oppCategories?.map(
    (oc) => (oc.categories as unknown as { name: string; slug: string })
  ) ?? [];

  // Format budget
  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: opp.currency || "USD",
      maximumFractionDigits: 0,
    }).format(n);

  let budgetDisplay = "Negotiable";
  if (opp.budget_type === "range" && opp.budget_min && opp.budget_max) {
    budgetDisplay = `${fmt(opp.budget_min)} - ${fmt(opp.budget_max)}`;
  } else if (opp.budget_min || opp.budget_max) {
    budgetDisplay = fmt(opp.budget_min ?? opp.budget_max ?? 0);
  } else if (opp.budget_type === "commission") {
    budgetDisplay = "Commission-based";
  }

  const isExpired = opp.deadline ? new Date(opp.deadline) < new Date() : false;
  const isActive = opp.status === "active" && !isExpired;

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/opportunities" className="hover:text-purple-600">Opportunities</Link>
          <span>/</span>
          <span className="text-gray-900 truncate">{opp.title}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <div className="flex items-start gap-4">
                {brand?.logo_url ? (
                  <img src={brand.logo_url} alt="" className="h-14 w-14 rounded-xl object-cover" />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-purple-100 text-xl font-bold text-purple-600">
                    {brand?.company_name?.[0]?.toUpperCase() ?? "B"}
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold text-gray-900">{opp.title}</h1>
                    {opp.is_featured && (
                      <span className="rounded-md bg-purple-100 px-2 py-0.5 text-[10px] font-bold uppercase text-purple-700">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-500 flex items-center gap-1">
                    {brand?.company_name || "Brand"}
                    {brand?.is_verified && (
                      <svg className="h-4 w-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </p>
                  <p className="mt-1 text-xs text-gray-400 capitalize">
                    {opp.opportunity_type.replace(/_/g, " ")}
                  </p>
                </div>
              </div>

              {/* Categories */}
              {categoryList.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {categoryList.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/opportunities?category=${cat.slug}`}
                      className="rounded-lg bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-purple-100 hover:text-purple-700"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="mb-3 text-base font-bold text-gray-900">Description</h2>
              <div className="prose prose-sm max-w-none text-gray-600 whitespace-pre-wrap">
                {opp.description}
              </div>
            </div>

            {/* Requirements */}
            {opp.requirements && (
              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <h2 className="mb-3 text-base font-bold text-gray-900">Requirements</h2>
                <div className="prose prose-sm max-w-none text-gray-600 whitespace-pre-wrap">
                  {opp.requirements}
                </div>
              </div>
            )}

            {/* Deliverables */}
            {opp.deliverables && (
              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <h2 className="mb-3 text-base font-bold text-gray-900">Deliverables</h2>
                <div className="prose prose-sm max-w-none text-gray-600 whitespace-pre-wrap">
                  {opp.deliverables}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Apply Card */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <ApplyButton
                opportunityId={opp.id}
                opportunityTitle={opp.title}
                isActive={isActive}
              />
            </div>

            {/* Details Card */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h3 className="mb-4 text-sm font-bold text-gray-900">Opportunity Details</h3>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Budget</dt>
                  <dd className="font-semibold text-gray-900">{budgetDisplay}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Type</dt>
                  <dd className="font-medium text-gray-900 capitalize">{opp.opportunity_type.replace(/_/g, " ")}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Location</dt>
                  <dd className="font-medium text-gray-900 capitalize">{opp.location_type.replace(/_/g, " ")}</dd>
                </div>
                {opp.country && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Country</dt>
                    <dd className="font-medium text-gray-900">{opp.country}</dd>
                  </div>
                )}
                {opp.min_followers > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Min. Followers</dt>
                    <dd className="font-medium text-gray-900">{opp.min_followers.toLocaleString()}</dd>
                  </div>
                )}
                {opp.deadline && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Deadline</dt>
                    <dd className={`font-medium ${isExpired ? "text-red-600" : "text-gray-900"}`}>
                      {isExpired ? "Expired" : new Date(opp.deadline).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                    </dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-gray-500">Applications</dt>
                  <dd className="font-medium text-gray-900">{opp.applications_count ?? 0}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Views</dt>
                  <dd className="font-medium text-gray-900">{opp.views_count ?? 0}</dd>
                </div>
              </dl>
            </div>

            {/* Platforms */}
            {opp.platforms && opp.platforms.length > 0 && (
              <div className="rounded-xl border border-gray-200 bg-white p-5">
                <h3 className="mb-3 text-sm font-bold text-gray-900">Platforms Required</h3>
                <div className="flex flex-wrap gap-2">
                  {opp.platforms.map((p) => (
                    <span key={p} className="rounded-lg bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700">{p}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Niches */}
            {opp.niches && opp.niches.length > 0 && (
              <div className="rounded-xl border border-gray-200 bg-white p-5">
                <h3 className="mb-3 text-sm font-bold text-gray-900">Target Niches</h3>
                <div className="flex flex-wrap gap-2">
                  {opp.niches.map((n) => (
                    <span key={n} className="rounded-lg bg-cyan-50 px-3 py-1 text-xs font-medium text-cyan-700">{n}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Brand Info */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h3 className="mb-3 text-sm font-bold text-gray-900">Brand Information</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Name</dt>
                  <dd className="font-medium text-gray-900">{brand?.company_name}</dd>
                </div>
                {brand?.website && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Website</dt>
                    <dd>
                      <a href={brand.website} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-700">
                        Visit
                      </a>
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
