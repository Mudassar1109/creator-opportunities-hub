import Link from "next/link";
import { OpportunityStatusBadge } from "@/components/admin/opportunity-status-badge";
import { AdminConfirmButton } from "@/components/admin/admin-confirm-button";
import type { AdminOpportunity } from "@/lib/actions/admin/opportunities";

interface Props {
  opportunities: AdminOpportunity[];
}

export function OpportunitiesTable({ opportunities }: Props) {
  if (opportunities.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-12 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
          <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.181 2.181 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.181 2.181 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">No opportunities found</p>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Try adjusting your search or filter criteria.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {opportunities.map((opp) => (
        <div key={opp.id} className="flex items-center gap-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm transition-all hover:shadow-md hover:border-purple-200/50 dark:hover:border-purple-800/50">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-100 to-cyan-100 dark:from-purple-900/30 dark:to-cyan-900/30">
            <svg className="h-4 w-4 text-purple-500 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25" />
            </svg>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="truncate text-sm font-bold text-gray-900 dark:text-gray-100">
                {opp.title}
              </p>
            </div>
            <p className="truncate text-xs text-gray-500 dark:text-gray-400">
              {opp.brand_name}
            </p>
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <span className="rounded-md bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-xs font-medium text-gray-600 dark:text-gray-400 capitalize">
              {opp.opportunity_type.replace(/_/g, " ")}
            </span>
          </div>

          <div className="hidden sm:block">
            <OpportunityStatusBadge status={opp.status} />
          </div>

          <div className="hidden text-right lg:block">
            <p className="text-xs font-medium text-gray-900 dark:text-gray-100">
              {opp.applications_count}
            </p>
            <p className="text-[10px] text-gray-400 dark:text-gray-500">apps</p>
          </div>

          <div className="hidden text-right xl:block">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {opp.deadline
                ? new Date(opp.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                : "—"}
            </p>
            <p className="text-[10px] text-gray-400 dark:text-gray-500">deadline</p>
          </div>

          <div className="hidden text-right lg:block">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {new Date(opp.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <Link
              href={`/admin/opportunities/${opp.id}`}
              className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-1.5 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              View
            </Link>
            <AdminConfirmButton
              label="Edit"
              confirmLabel="Edit Opportunity"
              confirmDescription={`Editing "${opp.title}" requires additional permissions. This feature is coming soon.`}
            />
            <AdminConfirmButton
              label="Archive"
              variant="danger"
              confirmLabel="Archive Opportunity"
              confirmDescription={`Are you sure you want to archive "${opp.title}"? This action requires backend moderation logic that has not been implemented yet.`}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
