"use client";

export default function AdminActivityError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 dark:bg-red-900/20">
        <svg className="h-8 w-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
      </div>
      <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">Failed to load activity logs</h2>
      <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 max-w-md text-center">
        {error.message || "An unexpected error occurred while loading activity logs."}
      </p>
      <button
        onClick={reset}
        className="rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-purple-700 transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
