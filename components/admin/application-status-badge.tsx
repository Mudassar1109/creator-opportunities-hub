interface Props {
  status: string;
}

const statusStyles: Record<string, string> = {
  pending: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
  under_review: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
  accepted: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400",
  rejected: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
  withdrawn: "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400",
};

const statusLabels: Record<string, string> = {
  pending: "Pending",
  under_review: "Under Review",
  accepted: "Accepted",
  rejected: "Rejected",
  withdrawn: "Withdrawn",
};

export function ApplicationStatusBadge({ status }: Props) {
  const style = statusStyles[status] ?? statusStyles.pending;
  const label = statusLabels[status] ?? status;

  return (
    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-bold ${style}`}>
      {label}
    </span>
  );
}
