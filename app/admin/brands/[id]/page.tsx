import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getAdminUser } from "@/lib/supabase/server";
import { getAdminBrandById } from "@/lib/actions/admin/brand-details";
import { BrandStatusBadge } from "@/components/admin/brand-status-badge";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminBrandDetailPage({ params }: Props) {
  const result = await getAdminUser();
  if (!result) redirect("/login");

  const { id } = await params;
  const brand = await getAdminBrandById(id);
  if (!brand) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/admin/brands"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Back to Brands
      </Link>

      <div className="mb-8 flex items-start gap-6">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-600 to-cyan-400 text-2xl font-bold text-white shadow-lg">
          {brand.logo_url ? (
            <img src={brand.logo_url} alt="" className="h-full w-full rounded-2xl object-cover" />
          ) : (
            brand.company_name.charAt(0).toUpperCase()
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{brand.company_name}</h1>
            <BrandStatusBadge isActive={brand.is_active} />
            {brand.is_verified && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-3 py-0.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                Verified
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{brand.website}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            {brand.industry ?? "N/A"} &middot; {brand.company_size} &middot; {brand.country ?? "N/A"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
            <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-4">Brand Information</h2>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                { label: "Contact Name", value: brand.contact_name },
                { label: "Contact Email", value: brand.contact_email },
                { label: "Country", value: brand.country },
                { label: "City", value: brand.city },
                { label: "Industry", value: brand.industry },
                { label: "Company Size", value: brand.company_size },
                { label: "Opportunities Posted", value: brand.opportunity_count.toString() },
                { label: "Member Since", value: new Date(brand.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) },
              ].map(({ label, value }) => (
                <div key={label}>
                  <dt className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</dt>
                  <dd className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">{value || "—"}</dd>
                </div>
              ))}
            </dl>
          </div>

          {brand.description && (
            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
              <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-4">Description</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{brand.description}</p>
            </div>
          )}

          {(brand.social_twitter || brand.social_linkedin || brand.social_instagram) && (
            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
              <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-4">Social Links</h2>
              <div className="flex flex-wrap gap-3">
                {brand.social_twitter && (
                  <a href={brand.social_twitter} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-gray-100 dark:bg-gray-700 px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    Twitter / X
                  </a>
                )}
                {brand.social_linkedin && (
                  <a href={brand.social_linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-gray-100 dark:bg-gray-700 px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    LinkedIn
                  </a>
                )}
                {brand.social_instagram && (
                  <a href={brand.social_instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-gray-100 dark:bg-gray-700 px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 016.11 2.525c.636-.247 1.363-.416 2.427-.465C8.83 2.013 9.184 2 11.615 2h.7z"/></svg>
                    Instagram
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
            <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <button disabled className="w-full rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white opacity-50 cursor-not-allowed">Edit Brand</button>
              <button disabled className="w-full rounded-xl border border-red-200 dark:border-red-900/30 px-4 py-2.5 text-sm font-semibold text-red-600 dark:text-red-400 opacity-50 cursor-not-allowed">Suspend Brand</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
