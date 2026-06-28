interface Props {
  isVerified: boolean;
}

export function UserStatusBadge({ isVerified }: Props) {
  if (isVerified) {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
        Verified
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-md bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-xs font-bold text-gray-500 dark:text-gray-400">
      Unverified
    </span>
  );
}
