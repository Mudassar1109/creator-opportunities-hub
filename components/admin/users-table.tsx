import Link from "next/link";
import { UserRoleBadge } from "@/components/admin/user-role-badge";
import { UserStatusBadge } from "@/components/admin/user-status-badge";
import { AdminConfirmButton } from "@/components/admin/admin-confirm-button";
import type { AdminUser } from "@/lib/actions/admin/users";

interface Props {
  users: AdminUser[];
}

export function UsersTable({ users }: Props) {
  if (users.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-12 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
          <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-3.835-1.06-4.342-2.215-.514-1.166.157-2.59 1.46-3.12a8.833 8.833 0 014.633-.395M15 8.25a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">No users found</p>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Try adjusting your search or filter criteria.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {users.map((user) => (
        <div key={user.id} className="flex items-center gap-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm transition-all hover:shadow-md hover:border-purple-200/50 dark:hover:border-purple-800/50">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white shadow-sm ${
            user.role === "brand" ? "bg-gradient-to-br from-cyan-600 to-cyan-400" : "bg-gradient-to-br from-purple-600 to-cyan-500"
          }`}>
            {user.avatar_url ? (
              <img src={user.avatar_url} alt="" className="h-full w-full rounded-xl object-cover" />
            ) : (
              user.full_name?.charAt(0)?.toUpperCase() ?? "?"
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="truncate text-sm font-bold text-gray-900 dark:text-gray-100">
                {user.full_name || user.email?.split("@")[0] || "Unknown"}
              </p>
            </div>
            <p className="truncate text-xs text-gray-500 dark:text-gray-400">
              {user.email}
            </p>
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <UserRoleBadge role={user.role} />
            <UserStatusBadge isVerified={user.is_verified} />
          </div>

          <div className="hidden text-right lg:block">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {new Date(user.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <Link
              href={`/admin/users/${user.id}`}
              className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-1.5 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              View
            </Link>
            <AdminConfirmButton
              label="Edit"
              confirmLabel="Edit User"
              confirmDescription={`Editing user "${user.full_name || user.email}" requires additional permissions. This feature is coming soon.`}
            />
            <AdminConfirmButton
              label="Ban"
              variant="danger"
              confirmLabel="Ban User"
              confirmDescription={`Are you sure you want to ban "${user.full_name || user.email}"? This action requires backend moderation logic that has not been implemented yet.`}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
