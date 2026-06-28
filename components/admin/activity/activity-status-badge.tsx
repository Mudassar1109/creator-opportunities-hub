import type { ActivityStatus } from "@/lib/actions/admin/activity";

interface Props {
  status: ActivityStatus;
}

const config: Record<ActivityStatus, { label: string; class: string }> = {
  Success: {
    label: "Success",
    class: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300",
  },
  Failure: {
    label: "Failure",
    class: "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300",
  },
  Pending: {
    label: "Pending",
    class: "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300",
  },
};

export function ActivityStatusBadge({ status }: Props) {
  const c = config[status];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${c.class}`}>
      {status === "Success" && (
        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      )}
      {status === "Failure" && (
        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      )}
      {status === "Pending" && (
        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )}
      {c.label}
    </span>
  );
}
