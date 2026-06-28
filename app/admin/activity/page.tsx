import { getAdminUser } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ActivityTable } from "@/components/admin/activity/activity-table";
import { getAdminActivity, type ActivityAction, type ActivityModule, type ActivityStatus } from "@/lib/actions/admin/activity";

export const metadata = {
  title: "Activity Logs — Admin",
};

export default async function AdminActivityPage() {
  const result = await getAdminUser();
  if (!result) redirect("/admin");

  const { data: initialEntries, pagination } = await getAdminActivity({ page: 1, pageSize: 10 });

  async function handleFetch(options: {
    search?: string;
    action?: string;
    module?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
  }) {
    "use server";

    const result = await getAdminActivity({
      search: options.search,
      action: options.action === "all" ? undefined : (options.action as ActivityAction),
      module: options.module === "all" ? undefined : (options.module as ActivityModule),
      status: options.status === "all" ? undefined : (options.status as ActivityStatus),
      dateFrom: options.dateFrom,
      dateTo: options.dateTo,
      page: options.page || 1,
      pageSize: 10,
    });

    return result;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Activity Logs</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Track all admin actions and system events
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
          <div className="flex h-2 w-2 rounded-full bg-emerald-500" />
          Live
        </div>
      </div>

      <ActivityTable
        initialEntries={initialEntries}
        initialPagination={pagination}
        onFetch={handleFetch}
      />
    </div>
  );
}
