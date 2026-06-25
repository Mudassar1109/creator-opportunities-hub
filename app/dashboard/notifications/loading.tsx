import { DashboardLayout } from "@/components/dashboard-layout";
import { NotificationListSkeleton, Skeleton } from "@/components/ui/skeleton";

export default function NotificationsLoading() {
  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        {/* Header row */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <Skeleton className="h-7 w-36" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-9 w-32 rounded-xl" />
        </div>

        {/* Stats row */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4"
            >
              <Skeleton className="h-3 w-12 mb-2" />
              <Skeleton className="h-8 w-10" />
            </div>
          ))}
        </div>

        {/* List */}
        <div className="mt-6">
          <NotificationListSkeleton count={6} />
        </div>
      </div>
    </DashboardLayout>
  );
}
