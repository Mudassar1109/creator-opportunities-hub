import { redirect } from "next/navigation";
import Link from "next/link";
import { getAdminUser } from "@/lib/supabase/server";
import { getAdminReports } from "@/lib/actions/admin/reports";
import { ReportsTable } from "@/components/admin/reports-table";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ q?: string; status?: string; type?: string; page?: string }>;
}

const STATUS_TABS = [
  { label: "All", value: "" },
  { label: "Pending", value: "pending" },
  { label: "Under Review", value: "under_review" },
  { label: "Resolved", value: "resolved" },
  { label: "Dismissed", value: "dismissed" },
];

const TYPE_TABS = [
  { label: "All Types", value: "" },
  { label: "User", value: "user_report" },
  { label: "Brand", value: "brand_report" },
  { label: "Opportunity", value: "opportunity_report" },
  { label: "Message", value: "message_report" },
];

export default async function AdminReportsPage({ searchParams }: Props) {
  const result = await getAdminUser();
  if (!result) redirect("/login");

  const params = await searchParams;
  const search = params.q || "";
  const status = params.status || "";
  const type = params.type || "";
  const page = Math.max(1, parseInt(params.page || "1", 10) || 1);

  const { reports, total, page: currentPage, totalPages } = await getAdminReports({
    search: search || undefined,
    status: status || undefined,
    type: type || undefined,
    page,
    pageSize: 12,
  });

  function buildUrl(overrides: Record<string, string | undefined>): string {
    const sp = new URLSearchParams();
    const q = overrides.q ?? search;
    const s = overrides.status ?? status;
    const t = overrides.type ?? type;
    const p = overrides.page ?? String(currentPage);
    if (q) sp.set("q", q);
    if (s) sp.set("status", s);
    if (t) sp.set("type", t);
    if (p !== "1") sp.set("page", p);
    const qs = sp.toString();
    return `/admin/reports${qs ? `?${qs}` : ""}`;
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">Reports</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{total} report{total !== 1 ? "s" : ""} on the platform</p>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <form method="GET" action="/admin/reports" className="flex-1 sm:max-w-xs">
          <div className="relative">
            <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              name="q"
              defaultValue={search}
              placeholder="Search reports…"
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 py-2.5 pl-10 pr-4 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 shadow-sm focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            />
            {status && <input type="hidden" name="status" value={status} />}
            {type && <input type="hidden" name="type" value={type} />}
          </div>
        </form>

        <div className="flex flex-col gap-2 sm:items-end">
          <div className="flex flex-wrap gap-1.5">
            {STATUS_TABS.map((tab) => {
              const isActive = tab.label === "All" ? !status : status === tab.value;
              return (
                <Link
                  key={tab.label}
                  href={buildUrl({ status: tab.value, type, page: "1" })}
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
          <div className="flex flex-wrap gap-1.5">
            {TYPE_TABS.map((tab) => {
              const isActive = tab.label === "All Types" ? !type : type === tab.value;
              return (
                <Link
                  key={tab.label}
                  href={buildUrl({ type: tab.value, status, page: "1" })}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                    isActive
                      ? "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400"
                      : "bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <ReportsTable reports={reports} />

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
