"use client";

import type { ActivityAction, ActivityModule, ActivityStatus } from "@/lib/actions/admin/activity";

interface Props {
  search: string;
  onSearchChange: (value: string) => void;
  actionFilter: ActivityAction | "all";
  onActionChange: (value: ActivityAction | "all") => void;
  moduleFilter: ActivityModule | "all";
  onModuleChange: (value: ActivityModule | "all") => void;
  statusFilter: ActivityStatus | "all";
  onStatusChange: (value: ActivityStatus | "all") => void;
  dateFrom: string;
  dateTo: string;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  totalResults: number;
}

const actions: (ActivityAction | "all")[] = [
  "all", "Login", "Logout", "Create", "Update", "Delete", "Approve", "Reject", "Suspend", "Restore",
];

const modules: (ActivityModule | "all")[] = [
  "all", "Users", "Brands", "Opportunities", "Applications", "Reports", "Settings", "Referral",
];

const statuses: (ActivityStatus | "all")[] = ["all", "Success", "Failure", "Pending"];

export function ActivityFilter({
  search, onSearchChange,
  actionFilter, onActionChange,
  moduleFilter, onModuleChange,
  statusFilter, onStatusChange,
  dateFrom, dateTo,
  onDateFromChange, onDateToChange,
  totalResults,
}: Props) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by admin, target, action..."
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 py-2.5 pl-10 pr-4 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-colors"
          />
        </div>
        <button disabled className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2.5 text-sm font-semibold text-gray-600 dark:text-gray-400 opacity-50 cursor-not-allowed">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Export
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <select
          value={actionFilter}
          onChange={(e) => onActionChange(e.target.value as ActivityAction | "all")}
          className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
        >
          {actions.map((a) => (
            <option key={a} value={a}>
              {a === "all" ? "All Actions" : a}
            </option>
          ))}
        </select>

        <select
          value={moduleFilter}
          onChange={(e) => onModuleChange(e.target.value as ActivityModule | "all")}
          className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
        >
          {modules.map((m) => (
            <option key={m} value={m}>
              {m === "all" ? "All Modules" : m}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value as ActivityStatus | "all")}
          className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
        >
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s === "all" ? "All Status" : s}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={dateFrom}
          onChange={(e) => onDateFromChange(e.target.value)}
          className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
          title="From date"
        />
        <span className="text-xs text-gray-400">to</span>
        <input
          type="date"
          value={dateTo}
          onChange={(e) => onDateToChange(e.target.value)}
          className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
          title="To date"
        />

        <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">
          {totalResults} result{totalResults !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
}
