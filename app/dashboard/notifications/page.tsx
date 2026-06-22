import { redirect } from "next/navigation";
import { createClient, getUserWithRole } from "@/lib/supabase/server";
import { DashboardLayout } from "@/components/dashboard-layout";
import { NotificationActions, NotificationItem } from "./notification-client";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Notifications | CreatorHub",
  description: "Your notifications and activity updates.",
};

export default async function NotificationsPage() {
  const result = await getUserWithRole();
  if (!result) redirect("/login");

  const supabase = await createClient();
  const user = result.user;

  // Fetch all notifications
  const { data: notifications } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  // Count unread
  const { count: unreadCount } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("is_read", false);

  const hasUnread = (unreadCount ?? 0) > 0;

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Notifications</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Stay updated on your applications, messages, and activity.
            </p>
          </div>
          <NotificationActions hasUnread={hasUnread} />
        </div>

        {/* Stats Row */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
            <p className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Total</p>
            <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100">{notifications?.length ?? 0}</p>
          </div>
          <div className="rounded-xl border border-purple-100 dark:border-purple-800/50 bg-purple-50 dark:bg-purple-900/10 p-4">
            <p className="text-xs font-medium uppercase text-purple-600 dark:text-purple-400">Unread</p>
            <p className="mt-1 text-2xl font-bold text-purple-700 dark:text-purple-400">{unreadCount ?? 0}</p>
          </div>
          <div className="rounded-xl border border-emerald-100 dark:border-emerald-800/50 bg-emerald-50 dark:bg-emerald-900/10 p-4 hidden sm:block">
            <p className="text-xs font-medium uppercase text-emerald-600 dark:text-emerald-400">Read</p>
            <p className="mt-1 text-2xl font-bold text-emerald-700 dark:text-emerald-400">
              {(notifications?.length ?? 0) - (unreadCount ?? 0)}
            </p>
          </div>
        </div>

        {/* Notification List */}
        <div className="mt-6 space-y-3">
          {notifications && notifications.length > 0 ? (
            notifications.map((notif) => (
              <NotificationItem
                key={notif.id}
                notification={{
                  id: notif.id,
                  title: notif.title,
                  message: notif.message,
                  type: notif.type,
                  is_read: notif.is_read,
                  link: notif.link,
                  created_at: notif.created_at,
                }}
              />
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-12 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-100 to-cyan-100 dark:from-purple-900/30 dark:to-cyan-900/30">
                <svg className="h-8 w-8 text-purple-500 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
              </div>
              <h3 className="mt-4 text-sm font-bold text-gray-900 dark:text-gray-100">No notifications yet</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                When brands review your applications or send you messages, notifications will appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
