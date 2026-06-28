import Link from "next/link";
import { BrandStatusBadge } from "@/components/admin/brand-status-badge";
import { AdminConfirmButton } from "@/components/admin/admin-confirm-button";
import type { AdminBrand } from "@/lib/actions/admin/brands";

interface Props {
  brands: AdminBrand[];
}

export function BrandsTable({ brands }: Props) {
  if (brands.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-12 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
          <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
          </svg>
        </div>
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">No brands found</p>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Try adjusting your search or filter criteria.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {brands.map((brand) => (
        <div key={brand.id} className="flex items-center gap-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm transition-all hover:shadow-md hover:border-purple-200/50 dark:hover:border-purple-800/50">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-600 to-cyan-400 text-sm font-bold text-white shadow-sm">
            {brand.logo_url ? (
              <img src={brand.logo_url} alt="" className="h-full w-full rounded-xl object-cover" />
            ) : (
              brand.company_name?.charAt(0)?.toUpperCase() ?? "?"
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="truncate text-sm font-bold text-gray-900 dark:text-gray-100">
                {brand.company_name}
              </p>
            </div>
            <p className="truncate text-xs text-gray-500 dark:text-gray-400">
              {brand.contact_email || brand.website}
            </p>
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <BrandStatusBadge isActive={brand.is_active} />
            {brand.is_verified && (
              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                Verified
              </span>
            )}
          </div>

          <div className="hidden text-right lg:block">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {new Date(brand.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <Link
              href={`/admin/brands/${brand.id}`}
              className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-1.5 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              View
            </Link>
            <AdminConfirmButton
              label="Edit"
              confirmLabel="Edit Brand"
              confirmDescription={`Editing "${brand.company_name}" requires additional permissions. This feature is coming soon.`}
            />
            <AdminConfirmButton
              label="Suspend"
              variant="danger"
              confirmLabel="Suspend Brand"
              confirmDescription={`Are you sure you want to suspend "${brand.company_name}"? This action requires backend moderation logic that has not been implemented yet.`}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
