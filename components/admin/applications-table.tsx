import Link from "next/link";
import { ApplicationStatusBadge } from "@/components/admin/application-status-badge";
import { AdminConfirmButton } from "@/components/admin/admin-confirm-button";
import type { AdminApplication } from "@/lib/actions/admin/applications";

interface Props {
  applications: AdminApplication[];
}

export function ApplicationsTable({ applications }: Props) {
  if (applications.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-12 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
          <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        </div>
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">No applications found</p>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Try adjusting your search or filter criteria.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {applications.map((app) => (
        <div key={app.id} className="flex items-center gap-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm transition-all hover:shadow-md hover:border-purple-200/50 dark:hover:border-purple-800/50">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-cyan-500 text-sm font-bold text-white shadow-sm">
            {app.applicant_avatar ? (
              <img src={app.applicant_avatar} alt="" className="h-full w-full rounded-xl object-cover" />
            ) : (
              app.applicant_name?.charAt(0)?.toUpperCase() ?? "?"
            )}
          </div>

          <div className="min-w-0 flex-[2]">
            <div className="flex items-center gap-2">
              <p className="truncate text-sm font-bold text-gray-900 dark:text-gray-100">
                {app.applicant_name}
              </p>
            </div>
            <p className="truncate text-xs text-gray-500 dark:text-gray-400">
              {app.applicant_email}
            </p>
          </div>

          <div className="min-w-0 flex-1 hidden md:block">
            <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
              {app.opportunity_title}
            </p>
            <p className="truncate text-xs text-gray-500 dark:text-gray-400">
              {app.brand_name}
            </p>
          </div>

          <div className="hidden sm:block">
            <ApplicationStatusBadge status={app.status} />
          </div>

          <div className="hidden text-right lg:block">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {new Date(app.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <Link
              href={`/admin/applications/${app.id}`}
              className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-1.5 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              View
            </Link>
            <AdminConfirmButton
              label="Review"
              confirmLabel="Review Application"
              confirmDescription={`Reviewing application from "${app.applicant_name}" for "${app.opportunity_title}". This feature is coming soon.`}
            />
            <AdminConfirmButton
              label="Reject"
              variant="danger"
              confirmLabel="Reject Application"
              confirmDescription={`Are you sure you want to reject "${app.applicant_name}"'s application for "${app.opportunity_title}"? This action requires backend moderation logic that has not been implemented yet.`}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
