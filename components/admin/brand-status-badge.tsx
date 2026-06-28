interface Props {
  isActive: boolean;
}

export function BrandStatusBadge({ isActive }: Props) {
  if (isActive) {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        Active
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-md bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-xs font-bold text-gray-500 dark:text-gray-400">
      Inactive
    </span>
  );
}
