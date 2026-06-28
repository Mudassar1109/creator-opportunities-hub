"use client";

import { useState, useCallback } from "react";
import { FilterBar } from "./filter-bar";
import { NotificationCard } from "./notification-card";
import { EmptyState } from "./empty-state";
import type {
  AdminNotification,
  AdminNotificationType,
  PriorityLevel,
} from "@/lib/actions/admin/notifications";

interface NotificationListProps {
  initialNotifications: AdminNotification[];
  initialPagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  onFetch: (options: {
    search?: string;
    type?: AdminNotificationType | "all";
    status?: "all" | "read" | "unread";
    priority?: PriorityLevel | "all";
    page?: number;
  }) => Promise<{
    data: AdminNotification[];
    pagination: {
      page: number;
      pageSize: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }>;
}

export function NotificationList({
  initialNotifications,
  initialPagination,
  onFetch,
}: NotificationListProps) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [pagination, setPagination] = useState(initialPagination);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<AdminNotificationType | "all">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "read" | "unread">("all");
  const [priorityFilter, setPriorityFilter] = useState<PriorityLevel | "all">("all");
  const [loading, setLoading] = useState(false);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  const fetchData = useCallback(
    async (extra?: { page?: number }) => {
      setLoading(true);
      const result = await onFetch({
        search: search || undefined,
        type: typeFilter,
        status: statusFilter,
        priority: priorityFilter,
        page: extra?.page || 1,
      });
      setNotifications(result.data);
      setPagination(result.pagination);
      setLoading(false);
    },
    [search, typeFilter, statusFilter, priorityFilter, onFetch]
  );

  function handleSearchChange(value: string) {
    setSearch(value);
    setTimeout(() => fetchData({ page: 1 }), 300);
  }

  function handleTypeChange(value: AdminNotificationType | "all") {
    setTypeFilter(value);
    fetchData({ page: 1 });
  }

  function handleStatusChange(value: "all" | "read" | "unread") {
    setStatusFilter(value);
    fetchData({ page: 1 });
  }

  function handlePriorityChange(value: PriorityLevel | "all") {
    setPriorityFilter(value);
    fetchData({ page: 1 });
  }

  function handlePageChange(page: number) {
    fetchData({ page });
  }

  function handleMarkRead(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    setReadIds((prev) => new Set(prev).add(id));
  }

  function handleMarkAllRead() {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, isRead: true }))
    );
    setReadIds(new Set(notifications.map((n) => n.id)));
  }

  return (
    <div className="space-y-6">
      <FilterBar
        search={search}
        onSearchChange={handleSearchChange}
        typeFilter={typeFilter}
        onTypeChange={handleTypeChange}
        priorityFilter={priorityFilter}
        onPriorityChange={handlePriorityChange}
        statusFilter={statusFilter}
        onStatusChange={handleStatusChange}
        totalResults={pagination.total}
      />

      {/* Mark all read */}
      <div className="flex items-center justify-end">
        {notifications.some((n) => !n.isRead) && (
          <button
            onClick={handleMarkAllRead}
            className="rounded-xl bg-purple-100 dark:bg-purple-900/30 px-4 py-2 text-xs font-bold text-purple-700 dark:text-purple-400 transition hover:bg-purple-200 dark:hover:bg-purple-900/50"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Notification cards */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-start gap-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 animate-pulse"
            >
              <div className="h-10 w-10 shrink-0 rounded-xl bg-gray-200 dark:bg-gray-700" />
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-48 rounded bg-gray-200 dark:bg-gray-700" />
                  <div className="h-4 w-14 rounded bg-gray-200 dark:bg-gray-700" />
                </div>
                <div className="h-3 w-full max-w-sm rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-3 w-32 rounded bg-gray-200 dark:bg-gray-700" />
              </div>
            </div>
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <EmptyState
          title={
            search || typeFilter !== "all" || statusFilter !== "all" || priorityFilter !== "all"
              ? "No notifications match your filters"
              : "No notifications yet"
          }
          message={
            search || typeFilter !== "all" || statusFilter !== "all" || priorityFilter !== "all"
              ? "Try adjusting your search or filter criteria."
              : "When there is activity on the platform, notifications will appear here."
          }
        />
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <NotificationCard
              key={notif.id}
              notification={notif}
              onMarkRead={handleMarkRead}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-4">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Page {pagination.page} of {pagination.totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={!pagination.hasPrev}
              className="rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 transition hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => handlePageChange(p)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  p === pagination.page
                    ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400"
                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={!pagination.hasNext}
              className="rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 transition hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
