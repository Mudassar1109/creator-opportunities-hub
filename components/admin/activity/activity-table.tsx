"use client";

import { useState, useCallback } from "react";
import { ActivityFilter } from "./activity-filter";
import { ActivityCard } from "./activity-card";
import { ActivityDetailsModal } from "./activity-details-modal";
import { ActivityEmptyState } from "./activity-empty-state";
import type {
  ActivityEntry,
  ActivityAction,
  ActivityModule,
  ActivityStatus,
} from "@/lib/actions/admin/activity";

interface Props {
  initialEntries: ActivityEntry[];
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
    action?: ActivityAction | "all";
    module?: ActivityModule | "all";
    status?: ActivityStatus | "all";
    dateFrom?: string;
    dateTo?: string;
    page?: number;
  }) => Promise<{
    data: ActivityEntry[];
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

export function ActivityTable({
  initialEntries,
  initialPagination,
  onFetch,
}: Props) {
  const [entries, setEntries] = useState(initialEntries);
  const [pagination, setPagination] = useState(initialPagination);
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState<ActivityAction | "all">("all");
  const [moduleFilter, setModuleFilter] = useState<ActivityModule | "all">("all");
  const [statusFilter, setStatusFilter] = useState<ActivityStatus | "all">("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<ActivityEntry | null>(null);

  const fetchData = useCallback(
    async (extra?: { page?: number }) => {
      setLoading(true);
      const result = await onFetch({
        search: search || undefined,
        action: actionFilter,
        module: moduleFilter,
        status: statusFilter,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
        page: extra?.page || 1,
      });
      setEntries(result.data);
      setPagination(result.pagination);
      setLoading(false);
    },
    [search, actionFilter, moduleFilter, statusFilter, dateFrom, dateTo, onFetch]
  );

  function handleSearchChange(value: string) {
    setSearch(value);
    setTimeout(() => fetchData({ page: 1 }), 300);
  }

  function handleActionChange(value: ActivityAction | "all") {
    setActionFilter(value);
    fetchData({ page: 1 });
  }

  function handleModuleChange(value: ActivityModule | "all") {
    setModuleFilter(value);
    fetchData({ page: 1 });
  }

  function handleStatusChange(value: ActivityStatus | "all") {
    setStatusFilter(value);
    fetchData({ page: 1 });
  }

  function handleDateFromChange(value: string) {
    setDateFrom(value);
    setTimeout(() => fetchData({ page: 1 }), 300);
  }

  function handleDateToChange(value: string) {
    setDateTo(value);
    setTimeout(() => fetchData({ page: 1 }), 300);
  }

  function handlePageChange(page: number) {
    fetchData({ page });
  }

  function handleViewDetails(id: string) {
    const entry = entries.find((e) => e.id === id);
    if (entry) setSelectedEntry(entry);
  }

  return (
    <div className="space-y-6">
      <ActivityFilter
        search={search}
        onSearchChange={handleSearchChange}
        actionFilter={actionFilter}
        onActionChange={handleActionChange}
        moduleFilter={moduleFilter}
        onModuleChange={handleModuleChange}
        statusFilter={statusFilter}
        onStatusChange={handleStatusChange}
        dateFrom={dateFrom}
        dateTo={dateTo}
        onDateFromChange={handleDateFromChange}
        onDateToChange={handleDateToChange}
        totalResults={pagination.total}
      />

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 animate-pulse"
            >
              <div className="h-10 w-10 shrink-0 rounded-xl bg-gray-200 dark:bg-gray-700" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-48 rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-3 w-32 rounded bg-gray-200 dark:bg-gray-700" />
              </div>
              <div className="h-6 w-16 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-6 w-14 rounded bg-gray-200 dark:bg-gray-700" />
            </div>
          ))}
        </div>
      ) : entries.length === 0 ? (
        <ActivityEmptyState
          title={
            search || actionFilter !== "all" || moduleFilter !== "all" || statusFilter !== "all"
              ? "No activity matches your filters"
              : "No activity logs"
          }
          message={
            search || actionFilter !== "all" || moduleFilter !== "all" || statusFilter !== "all"
              ? "Try adjusting your search or filter criteria."
              : "When admin actions are logged, they will appear here."
          }
        />
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <ActivityCard
              key={entry.id}
              entry={entry}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      )}

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-4">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={!pagination.hasPrev}
              className="rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 transition hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).slice(
              Math.max(0, pagination.page - 3),
              Math.min(pagination.totalPages, pagination.page + 2)
            ).map((p) => (
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

      {selectedEntry && (
        <ActivityDetailsModal
          entry={selectedEntry}
          onClose={() => setSelectedEntry(null)}
        />
      )}
    </div>
  );
}
