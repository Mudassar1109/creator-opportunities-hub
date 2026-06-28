import type { TopBrand } from "@/lib/actions/admin/analytics";

export function TopBrandsList({ brands }: { brands: TopBrand[] }) {
  return (
    <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 sm:p-6 shadow-sm">
      <h3 className="mb-4 text-sm font-bold text-gray-900 dark:text-gray-100">
        Top Brands
      </h3>
      {brands.length === 0 ? (
        <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-400 dark:text-gray-500">No brands found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {brands.map((brand, i) => (
            <div key={brand.id} className="flex items-center gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-gray-100 dark:bg-gray-800 text-xs font-bold text-gray-500 dark:text-gray-400">
                {i + 1}
              </span>
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-600 to-cyan-400 text-xs font-bold text-white">
                {brand.logo_url ? (
                  <img
                    src={brand.logo_url}
                    alt=""
                    className="h-full w-full rounded-lg object-cover"
                  />
                ) : (
                  brand.company_name?.charAt(0)?.toUpperCase() ?? "?"
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-gray-900 dark:text-gray-100">
                  {brand.company_name}
                </p>
                {brand.industry && (
                  <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                    {brand.industry}
                  </p>
                )}
              </div>
              {brand.is_verified && (
                <span className="shrink-0 rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                  ✓
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
