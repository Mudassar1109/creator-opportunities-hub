import { DashboardLayout } from "@/components/dashboard-layout";

export default function ReferralsLoading() {
  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 animate-pulse">
          <div className="h-8 w-48 rounded-lg bg-gray-200 dark:bg-gray-700" />
          <div className="mt-2 h-4 w-72 rounded bg-gray-200 dark:bg-gray-700" />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 animate-pulse">
              <div className="h-5 w-32 rounded bg-gray-200 dark:bg-gray-700 mb-4" />
              <div className="h-10 w-64 rounded bg-gray-200 dark:bg-gray-700 mb-3" />
              <div className="h-4 w-48 rounded bg-gray-200 dark:bg-gray-700" />
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 animate-pulse">
                  <div className="h-4 w-16 rounded bg-gray-200 dark:bg-gray-700 mb-2" />
                  <div className="h-8 w-20 rounded bg-gray-200 dark:bg-gray-700" />
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 animate-pulse">
              <div className="h-5 w-40 rounded bg-gray-200 dark:bg-gray-700 mb-4" />
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
                  <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700" />
                  <div className="flex-1">
                    <div className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-700 mb-1" />
                    <div className="h-3 w-24 rounded bg-gray-200 dark:bg-gray-700" />
                  </div>
                  <div className="h-6 w-16 rounded bg-gray-200 dark:bg-gray-700" />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 animate-pulse">
              <div className="h-5 w-36 rounded bg-gray-200 dark:bg-gray-700 mb-4" />
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 py-2">
                  <div className="h-8 w-8 rounded-lg bg-gray-200 dark:bg-gray-700" />
                  <div className="flex-1">
                    <div className="h-4 w-20 rounded bg-gray-200 dark:bg-gray-700 mb-1" />
                    <div className="h-3 w-32 rounded bg-gray-200 dark:bg-gray-700" />
                  </div>
                  <div className="h-5 w-16 rounded-full bg-gray-200 dark:bg-gray-700" />
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 animate-pulse">
              <div className="h-5 w-32 rounded bg-gray-200 dark:bg-gray-700 mb-4" />
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                  <div className="h-6 w-6 rounded bg-gray-200 dark:bg-gray-700" />
                  <div className="flex-1">
                    <div className="h-4 w-28 rounded bg-gray-200 dark:bg-gray-700 mb-1" />
                    <div className="h-3 w-20 rounded bg-gray-200 dark:bg-gray-700" />
                  </div>
                  <div className="h-4 w-12 rounded bg-gray-200 dark:bg-gray-700" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
