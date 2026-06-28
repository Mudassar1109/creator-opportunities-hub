"use client";

export interface NotificationCardData {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  link: string | null;
  createdAt: string;
}

interface NotificationCardProps {
  notification: NotificationCardData;
  onMarkRead: (id: string) => Promise<void>;
}

const typeColors: Record<string, string> = {
  application_submitted: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400",
  application_reviewed: "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400",
  application_accepted: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400",
  application_rejected: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
  message_received: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
};

const typeLabels: Record<string, string> = {
  application_submitted: "Application",
  application_reviewed: "Review",
  application_accepted: "Accepted",
  application_rejected: "Rejected",
  message_received: "Message",
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
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function NotificationCard({ notification, onMarkRead }: NotificationCardProps) {
  return (
    <div
      className={`group flex flex-col gap-3 rounded-xl border p-4 sm:p-5 transition-all duration-200 hover:shadow-md sm:flex-row sm:items-start sm:justify-between ${
        !notification.isRead
          ? "border-purple-200 dark:border-purple-800/50 bg-purple-50/50 dark:bg-purple-900/10"
          : "border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900"
      }`}
    >
      <div className="flex gap-3 min-w-0 flex-1">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
            typeColors[notification.type] || "bg-gray-100 dark:bg-gray-800 text-gray-600"
          }`}
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
            />
          </svg>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3
              className={`text-sm font-bold ${
                !notification.isRead
                  ? "text-gray-900 dark:text-gray-100"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              {notification.title}
            </h3>
            <span className="rounded-md bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-[10px] font-semibold text-gray-600 dark:text-gray-400">
              {typeLabels[notification.type] || notification.type}
            </span>
            {!notification.isRead && <span className="h-2 w-2 rounded-full bg-purple-500" />}
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{notification.message}</p>
          <p className="mt-1 text-xs text-gray-400 dark:text-gray-600">{timeAgo(notification.createdAt)}</p>
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
        {notification.link && (
          <a
            href={notification.link}
            className="rounded-lg bg-purple-100 dark:bg-purple-900/30 px-3 py-1.5 text-xs font-medium text-purple-700 dark:text-purple-400 transition hover:bg-purple-200 dark:hover:bg-purple-900/50"
          >
            View
          </a>
        )}
        <button
          disabled
          className="rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-1.5 text-xs font-medium text-gray-400 dark:text-gray-600 opacity-60 cursor-not-allowed"
        >
          Archive
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
