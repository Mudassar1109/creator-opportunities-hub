interface Props {
  status: string;
}

const statusStyles: Record<string, string> = {
  draft: "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400",
  active: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400",
  paused: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
  closed: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
  expired: "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400",
};

export function OpportunityStatusBadge({ status }: Props) {
  const style = statusStyles[status] ?? statusStyles.draft;

  return (
    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-bold capitalize ${style}`}>
      {status}
    </span>
  );
}
