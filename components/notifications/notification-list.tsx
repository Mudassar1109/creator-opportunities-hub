"use client";

import { useState, useMemo } from "react";
import { NotificationCard, type NotificationCardData } from "./notification-card";

interface NotificationListProps {
  notifications: NotificationCardData[];
  unreadCount: number;
  onMarkRead: (id: string) => Promise<void>;
  onMarkAllRead: () => Promise<void>;
  loading?: boolean;
}

const NOTIF_TYPES = [
  { label: "All", value: "all" },
  { label: "Applications", value: "application_submitted" },
  { label: "Reviews", value: "application_reviewed" },
  { label: "Accepted", value: "application_accepted" },
  { label: "Rejected", value: "application_rejected" },
  { label: "Messages", value: "message_received" },
] as const;

export function NotificationList({
  notifications,
  unreadCount,
  onMarkRead,
  onMarkAllRead,
  loading,
}: NotificationListProps) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const filtered = useMemo(() => {
    let result = notifications;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (n) =>
          n.title.toLowerCase().includes(q) || n.message.toLowerCase().includes(q)
      );
    }
    if (typeFilter !== "all") {
      result = result.filter((n) => n.type === typeFilter);
    }
    return result;
  }, [notifications, search, typeFilter]);

  const readCount = notifications.length - unreadCount;

  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
          <p className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Total</p>
          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100">
            {notifications.length}
          </p>
        </div>
        <div className="rounded-xl border border-purple-100 dark:border-purple-800/50 bg-purple-50 dark:bg-purple-900/10 p-4">
          <p className="text-xs font-medium uppercase text-purple-600 dark:text-purple-400">
            Unread
          </p>
          <p className="mt-1 text-2xl font-bold text-purple-700 dark:text-purple-400">
            {unreadCount}
          </p>
        </div>
        <div className="rounded-xl border border-emerald-100 dark:border-emerald-800/50 bg-emerald-50 dark:bg-emerald-900/10 p-4 hidden sm:block">
          <p className="text-xs font-medium uppercase text-emerald-600 dark:text-emerald-400">
            Read
          </p>
          <p className="mt-1 text-2xl font-bold text-emerald-700 dark:text-emerald-400">
            {readCount}
          </p>
        </div>
      </div>

      {/* Search + filter + mark all read */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <svg
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notifications..."
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 py-2.5 pl-10 pr-4 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-400"
          />
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllRead}
              className="rounded-xl bg-purple-100 dark:bg-purple-900/30 px-4 py-2 text-xs font-bold text-purple-700 dark:text-purple-400 transition hover:bg-purple-200 dark:hover:bg-purple-900/50"
            >
              Mark all as read
            </button>
          )}
        </div>
      </div>

      {/* Type filter tabs */}
      <div className="flex flex-wrap gap-1">
        {NOTIF_TYPES.map((t) => (
          <button
            key={t.value}
            onClick={() => setTypeFilter(t.value)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              typeFilter === t.value
                ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400"
                : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Notification list */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex items-start gap-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 animate-pulse"
            >
              <div className="h-10 w-10 shrink-0 rounded-xl bg-gray-200 dark:bg-gray-700" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-48 rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-3 w-full max-w-sm rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-3 w-20 rounded bg-gray-200 dark:bg-gray-700" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-100 to-cyan-100 dark:from-purple-900/30 dark:to-cyan-900/30">
            <svg
              className="h-8 w-8 text-purple-500 dark:text-purple-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
              />
            </svg>
          </div>
          <h3 className="mt-4 text-sm font-bold text-gray-900 dark:text-gray-100">
            {search || typeFilter !== "all"
              ? "No notifications match your search."
              : "No notifications yet"}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {search || typeFilter !== "all"
              ? "Try a different search term or filter."
              : "When there is activity on the platform, notifications will appear here."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((notif) => (
            <NotificationCard key={notif.id} notification={notif} onMarkRead={onMarkRead} />
          ))}
        </div>
      )}
    </div>
  );
}
