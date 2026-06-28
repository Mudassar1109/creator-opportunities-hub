"use client";

import type { AdminNotification } from "@/lib/actions/admin/notifications";

interface NotificationCardProps {
  notification: AdminNotification;
  onMarkRead: (id: string) => void;
}

const typeIcons: Record<string, React.ReactNode> = {
  User: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-3.835-1.06-4.342-2.215-.514-1.166.157-2.59 1.46-3.12a8.833 8.833 0 014.633-.395M15 8.25a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Brand: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21" />
    </svg>
  ),
  Opportunity: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.181 2.181 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.181 2.181 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
    </svg>
  ),
  Application: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  ),
  Report: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
  ),
  System: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  ),
};

const typeBg: Record<string, string> = {
  User: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
  Brand: "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400",
  Opportunity: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
  Application: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400",
  Report: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
  System: "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400",
};

const priorityColors: Record<string, string> = {
  Low: "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400",
  Medium: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
  High: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400",
  Critical: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function NotificationCard({ notification, onMarkRead }: NotificationCardProps) {
  return (
    <div
      className={`group flex flex-col gap-3 rounded-xl border p-4 sm:p-5 transition-all hover:shadow-md sm:flex-row sm:items-start sm:justify-between ${
        !notification.isRead
          ? "border-purple-200 dark:border-purple-800/50 bg-purple-50/50 dark:bg-purple-900/10"
          : "border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900"
      }`}
    >
      <div className="flex gap-3 min-w-0 flex-1">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${typeBg[notification.type] || "bg-gray-100 dark:bg-gray-800 text-gray-600"}`}>
          {typeIcons[notification.type] || (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className={`text-sm font-bold ${!notification.isRead ? "text-gray-900 dark:text-gray-100" : "text-gray-700 dark:text-gray-300"}`}>
              {notification.title}
            </h3>
            <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${priorityColors[notification.priority] || "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"}`}>
              {notification.priority}
            </span>
            {!notification.isRead && <span className="h-2 w-2 rounded-full bg-purple-500" />}
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{notification.message}</p>
          <div className="mt-1 flex items-center gap-2">
            <p className="text-xs text-gray-400 dark:text-gray-600">{timeAgo(notification.createdAt)}</p>
            {notification.relatedLabel && (
              <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">{notification.relatedLabel}</span>
            )}
            <span className="rounded-md bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-[10px] font-semibold text-gray-600 dark:text-gray-400">
              {notification.type}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {!notification.isRead && (
          <button
            onClick={() => onMarkRead(notification.id)}
            className="rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 transition hover:border-purple-300 dark:hover:border-purple-700 hover:text-purple-700 dark:hover:text-purple-400"
          >
            Mark read
          </button>
        )}
        <button
          disabled
          className="rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-1.5 text-xs font-medium text-gray-400 dark:text-gray-600 opacity-60 cursor-not-allowed"
        >
          View
        </button>
        <button
          disabled
          className="rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-1.5 text-xs font-medium text-gray-400 dark:text-gray-600 opacity-60 cursor-not-allowed"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
