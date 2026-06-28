import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/supabase/server";
import { getAdminNotifications, getAdminNotificationSummary } from "@/lib/actions/admin/notifications";
import { NotificationList } from "@/components/admin/notifications/notification-list";

export const dynamic = "force-dynamic";

export default async function AdminNotificationsPage() {
  const result = await getAdminUser();
  if (!result) redirect("/login");

  const { data, pagination } = await getAdminNotifications({ page: 1, pageSize: 10 });
  const summary = await getAdminNotificationSummary();

  const summaryCards = [
    { label: "Total", value: summary.total, color: "text-gray-900 dark:text-gray-100", border: "" },
    { label: "Unread", value: summary.unread, color: "text-purple-600 dark:text-purple-400", border: "border-purple-200 dark:border-purple-800/50 bg-purple-50 dark:bg-purple-900/10" },
    { label: "Read", value: summary.read, color: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-200 dark:border-emerald-800/50 bg-emerald-50 dark:bg-emerald-900/10" },
    { label: "Critical", value: summary.byPriority.Critical || 0, color: "text-red-600 dark:text-red-400", border: "border-red-200 dark:border-red-800/50 bg-red-50 dark:bg-red-900/10" },
    { label: "High", value: summary.byPriority.High || 0, color: "text-orange-600 dark:text-orange-400", border: "border-orange-200 dark:border-orange-800/50 bg-orange-50 dark:bg-orange-900/10" },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">
          Notification Center
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Platform alerts and activity feed
        </p>
      </div>

      {/* Summary cards */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className={`rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 ${
              card.border || ""
            }`}
          >
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              {card.label}
            </p>
            <p className={`mt-1 text-2xl font-extrabold ${card.color}`}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      <NotificationList
        initialNotifications={data}
        initialPagination={pagination}
        onFetch={getAdminNotifications}
      />
    </div>
  );
}
