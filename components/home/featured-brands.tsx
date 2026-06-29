import Link from "next/link";

interface FeaturedBrand {
  id: string;
  company_name: string;
  logo_url: string | null;
  is_verified: boolean;
  industry: string | null;
  active_opportunities_count: number;
}

export function FeaturedBrands({ brands }: { brands: FeaturedBrand[] }) {
  if (brands.length === 0) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 py-16">
        <span className="text-4xl" aria-hidden="true">🏢</span>
        <p className="mt-4 text-base font-semibold text-slate-500">No brands have joined yet.</p>
        <p className="mt-1 text-sm text-slate-400">Check back soon — great brands are on their way.</p>
        <Link
          href="/signup/role"
          className="mt-5 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-indigo-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Join as a Brand
        </Link>
      </div>
    );
  }

  return (
    <>
      {brands.map((brand, i) => (
        <div
          key={brand.id}
          className={`animate-fade-up animate-fade-up-delay-${Math.min(i + 1, 6)} group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/10`}
          role="article"
        >
          <div className="flex items-start gap-4">
            {/* Logo */}
            <div className="shrink-0">
              {brand.logo_url ? (
                <img
                  src={brand.logo_url}
                  alt={`${brand.company_name} logo`}
                  className="h-14 w-14 rounded-xl object-contain"
                  loading="lazy"
                />
              ) : (
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-100 text-xl font-bold text-indigo-600"
                  aria-hidden="true"
                >
                  {brand.company_name[0]?.toUpperCase()}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h3 className="truncate text-base font-bold text-slate-900">{brand.company_name}</h3>
                {brand.is_verified && (
                  <svg
                    className="h-4 w-4 shrink-0 text-blue-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-label="Verified brand"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              {brand.industry && (
                <p className="mt-1 text-xs font-medium text-slate-500">{brand.industry}</p>
              )}
            </div>
          </div>

          {/* Active opportunities count */}
          <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
            <span className="text-xs font-medium text-slate-500">Active opportunities</span>
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
              {brand.active_opportunities_count}
            </span>
          </div>
        </div>
      ))}
    </>
  );
}
