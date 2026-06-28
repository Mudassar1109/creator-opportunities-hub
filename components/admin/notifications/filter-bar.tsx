"use client";

import type { AdminNotificationType, PriorityLevel } from "@/lib/actions/admin/notifications";

const NOTIF_TYPES = [
  { label: "All Types", value: "all" },
  { label: "User", value: "User" },
  { label: "Brand", value: "Brand" },
  { label: "Opportunity", value: "Opportunity" },
  { label: "Application", value: "Application" },
  { label: "Report", value: "Report" },
  { label: "System", value: "System" },
] as const;

const PRIORITIES = [
  { label: "All Priority", value: "all" },
  { label: "Low", value: "Low" },
  { label: "Medium", value: "Medium" },
  { label: "High", value: "High" },
  { label: "Critical", value: "Critical" },
] as const;

const STATUSES = [
  { label: "All", value: "all" },
  { label: "Unread", value: "unread" },
  { label: "Read", value: "read" },
] as const;

interface FilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  typeFilter: AdminNotificationType | "all";
  onTypeChange: (value: AdminNotificationType | "all") => void;
  priorityFilter: PriorityLevel | "all";
  onPriorityChange: (value: PriorityLevel | "all") => void;
  statusFilter: "all" | "read" | "unread";
  onStatusChange: (value: "all" | "read" | "unread") => void;
  totalResults: number;
}

export function FilterBar({
  search,
  onSearchChange,
  typeFilter,
  onTypeChange,
  priorityFilter,
  onPriorityChange,
  statusFilter,
  onStatusChange,
  totalResults,
}: FilterBarProps) {
  return (
    <div className="space-y-4">
      {/* Search row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <svg
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search notifications..."
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 py-2.5 pl-10 pr-4 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-400"
          />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {totalResults} notification{totalResults !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Filter chips row */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Status */}
        <div className="flex items-center gap-1 rounded-lg border border-gray-200 dark:border-gray-700 p-0.5">
          {STATUSES.map((s) => (
            <button
              key={s.value}
              onClick={() => onStatusChange(s.value as "all" | "read" | "unread")}
              className={`rounded-md px-3 py-1 text-xs font-medium transition ${
                statusFilter === s.value
                  ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Type filter */}
        <select
          value={typeFilter}
          onChange={(e) => onTypeChange(e.target.value as AdminNotificationType | "all")}
          className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-purple-400"
        >
          {NOTIF_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>

        {/* Priority filter */}
        <select
          value={priorityFilter}
          onChange={(e) => onPriorityChange(e.target.value as PriorityLevel | "all")}
          className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-purple-400"
        >
          {PRIORITIES.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
