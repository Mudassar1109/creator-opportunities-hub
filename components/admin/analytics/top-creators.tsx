import type { TopCreator } from "@/lib/actions/admin/analytics";

export function TopCreatorsList({ creators }: { creators: TopCreator[] }) {
  return (
    <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 sm:p-6 shadow-sm">
      <h3 className="mb-4 text-sm font-bold text-gray-900 dark:text-gray-100">
        Top Creators
      </h3>
      {creators.length === 0 ? (
        <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-400 dark:text-gray-500">No creators found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {creators.map((creator, i) => (
            <div key={creator.id} className="flex items-center gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-gray-100 dark:bg-gray-800 text-xs font-bold text-gray-500 dark:text-gray-400">
                {i + 1}
              </span>
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-cyan-500 text-xs font-bold text-white">
                {creator.avatar_url ? (
                  <img
                    src={creator.avatar_url}
                    alt=""
                    className="h-full w-full rounded-lg object-cover"
                  />
                ) : (
                  creator.full_name?.charAt(0)?.toUpperCase() ?? "?"
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-gray-900 dark:text-gray-100">
                  {creator.full_name}
                </p>
              </div>
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400">
                {creator.follower_count.toLocaleString()} followers
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
