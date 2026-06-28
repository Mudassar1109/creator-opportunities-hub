import { redirect } from "next/navigation";
import Link from "next/link";
import { getAdminUser } from "@/lib/supabase/server";
import { getAdminUsers } from "@/lib/actions/admin/users";
import { UsersTable } from "@/components/admin/users-table";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ q?: string; role?: string; page?: string }>;
}

export default async function AdminUsersPage({ searchParams }: Props) {
  const result = await getAdminUser();
  if (!result) redirect("/login");

  const params = await searchParams;
  const search = params.q || "";
  const role = params.role || "";
  const page = Math.max(1, parseInt(params.page || "1", 10) || 1);

  const { users, total, page: currentPage, totalPages } = await getAdminUsers({
    search: search || undefined,
    role: role || undefined,
    page,
    pageSize: 12,
  });

  function buildUrl(overrides: Record<string, string | undefined>): string {
    const sp = new URLSearchParams();
    const q = overrides.q ?? search;
    const r = overrides.role ?? role;
    const p = overrides.page ?? String(currentPage);
    if (q) sp.set("q", q);
    if (r) sp.set("role", r);
    if (p !== "1") sp.set("page", p);
    const qs = sp.toString();
    return `/admin/users${qs ? `?${qs}` : ""}`;
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">Users</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{total} user{total !== 1 ? "s" : ""} on the platform</p>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <form method="GET" action="/admin/users" className="flex-1 sm:max-w-xs">
          <div className="relative">
            <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              name="q"
              defaultValue={search}
              placeholder="Search users…"
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 py-2.5 pl-10 pr-4 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 shadow-sm focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            />
            {role && <input type="hidden" name="role" value={role} />}
          </div>
        </form>

        <div className="flex gap-1.5">
          {[
            { label: "All", href: buildUrl({ role: "", page: "1" }) },
            { label: "Creators", href: buildUrl({ role: "creator", page: "1" }) },
            { label: "Brands", href: buildUrl({ role: "brand", page: "1" }) },
          ].map((tab) => {
            const isActive = tab.label === "All" ? !role : role === tab.label.toLowerCase();
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

      <UsersTable users={users} />

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
