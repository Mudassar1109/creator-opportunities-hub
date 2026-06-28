import { redirect } from "next/navigation";
import Link from "next/link";
import { getAdminUser } from "@/lib/supabase/server";
import { getAdminBrands } from "@/lib/actions/admin/brands";
import { BrandsTable } from "@/components/admin/brands-table";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}

export default async function AdminBrandsPage({ searchParams }: Props) {
  const result = await getAdminUser();
  if (!result) redirect("/login");

  const params = await searchParams;
  const search = params.q || "";
  const status = params.status || "";
  const page = Math.max(1, parseInt(params.page || "1", 10) || 1);

  const { brands, total, page: currentPage, totalPages } = await getAdminBrands({
    search: search || undefined,
    status: status || undefined,
    page,
    pageSize: 12,
  });

  function buildUrl(overrides: Record<string, string | undefined>): string {
    const sp = new URLSearchParams();
    const q = overrides.q ?? search;
    const s = overrides.status ?? status;
    const p = overrides.page ?? String(currentPage);
    if (q) sp.set("q", q);
    if (s) sp.set("status", s);
    if (p !== "1") sp.set("page", p);
    const qs = sp.toString();
    return `/admin/brands${qs ? `?${qs}` : ""}`;
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">Brands</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{total} brand{total !== 1 ? "s" : ""} on the platform</p>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <form method="GET" action="/admin/brands" className="flex-1 sm:max-w-xs">
          <div className="relative">
            <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              name="q"
              defaultValue={search}
              placeholder="Search brands…"
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 py-2.5 pl-10 pr-4 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 shadow-sm focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            />
            {status && <input type="hidden" name="status" value={status} />}
          </div>
        </form>

        <div className="flex gap-1.5">
          {[
            { label: "All", href: buildUrl({ status: "", page: "1" }) },
            { label: "Active", href: buildUrl({ status: "active", page: "1" }) },
            { label: "Inactive", href: buildUrl({ status: "inactive", page: "1" }) },
          ].map((tab) => {
            const isActive = tab.label === "All" ? !status : status === tab.label.toLowerCase();
            return (
              <Link
                key={tab.label}
                href={tab.href}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                  isActive
                    ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
      </div>

      <BrandsTable brands={brands} />

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          {currentPage > 1 && (
            <Link
              href={buildUrl({ page: String(currentPage - 1) })}
              className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-1.5 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Previous
            </Link>
          )}
          <span className="px-3 py-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">
            Page {currentPage} of {totalPages}
          </span>
          {currentPage < totalPages && (
            <Link
              href={buildUrl({ page: String(currentPage + 1) })}
              className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-1.5 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Next
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
