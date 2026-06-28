import { ReportStatusBadge } from "@/components/admin/report-status-badge";
import { AdminConfirmButton } from "@/components/admin/admin-confirm-button";
import type { AdminReport } from "@/lib/actions/admin/reports";

interface Props {
  reports: AdminReport[];
}

const typeLabels: Record<string, string> = {
  user_report: "User Report",
  brand_report: "Brand Report",
  opportunity_report: "Opportunity Report",
  message_report: "Message Report",
};

export function ReportsTable({ reports }: Props) {
  if (reports.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-12 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
          <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
          </svg>
        </div>
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">No reports found</p>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">No reports match your criteria.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {reports.map((report) => (
        <div key={report.id} className="flex items-center gap-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm transition-all hover:shadow-md hover:border-purple-200/50 dark:hover:border-purple-800/50">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-100 to-amber-100 dark:from-red-900/30 dark:to-amber-900/30">
            <svg className="h-4 w-4 text-red-500 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>

          <div className="min-w-0 flex-[2]">
            <div className="flex items-center gap-2">
              <p className="truncate text-xs font-mono font-bold text-gray-500 dark:text-gray-400">
                #{report.id.slice(0, 8)}
              </p>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <p className="truncate text-sm font-bold text-gray-900 dark:text-gray-100">
                {report.reporter_name}
              </p>
              <svg className="h-3 w-3 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
              <p className="truncate text-sm font-medium text-gray-700 dark:text-gray-300">
                {report.reported_entity}
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <span className="rounded-md bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-xs font-medium text-gray-600 dark:text-gray-400">
              {typeLabels[report.report_type] ?? report.report_type.replace(/_/g, " ")}
            </span>
          </div>

          <div className="hidden max-w-[160px] xl:block">
            <p className="truncate text-xs text-gray-500 dark:text-gray-400">
              {report.reason}
            </p>
          </div>

          <div className="hidden sm:block">
            <ReportStatusBadge status={report.status} />
          </div>

          <div className="hidden text-right lg:block">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {new Date(report.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <AdminConfirmButton
              label="View"
              confirmLabel="View Report"
              confirmDescription={`Viewing report #${report.id.slice(0, 8)}. This feature is coming soon.`}
            />
            <AdminConfirmButton
              label="Resolve"
              confirmLabel="Resolve Report"
              confirmDescription={`Are you sure you want to resolve report #${report.id.slice(0, 8)}? This requires backend moderation logic.`}
            />
            <AdminConfirmButton
              label="Dismiss"
              confirmLabel="Dismiss Report"
              confirmDescription={`Dismiss report #${report.id.slice(0, 8)}? This requires backend moderation logic.`}
            />
            <AdminConfirmButton
              label="Suspend"
              variant="danger"
              confirmLabel="Suspend Entity"
              confirmDescription={`Suspend the entity reported in #${report.id.slice(0, 8)}? This requires backend moderation logic.`}
            />
            <AdminConfirmButton
              label="Delete"
              variant="danger"
              confirmLabel="Delete Report"
              confirmDescription={`Permanently delete report #${report.id.slice(0, 8)}? This action cannot be undone.`}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
