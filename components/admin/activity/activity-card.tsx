"use client";

import React from "react";
import type { ActivityEntry } from "@/lib/actions/admin/activity";
import { ActivityStatusBadge } from "./activity-status-badge";

interface Props {
  entry: ActivityEntry;
  onViewDetails: (id: string) => void;
}

const actionIcons: Record<string, React.ReactNode> = {
  Login: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
    </svg>
  ),
  Logout: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M3 12h12m0 0l-3 3m3-3l-3-3" />
    </svg>
  ),
  Create: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  ),
  Update: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
    </svg>
  ),
  Delete: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
  ),
  Approve: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Reject: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Suspend: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
    </svg>
  ),
  Restore: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
    </svg>
  ),
};

const actionColors: Record<string, string> = {
  Login: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
  Logout: "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400",
  Create: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400",
  Update: "bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400",
  Delete: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400",
  Approve: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400",
  Reject: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400",
  Suspend: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400",
  Restore: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
};

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export function ActivityCard({ entry, onViewDetails }: Props) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm transition-all hover:shadow-md hover:border-purple-200/50 dark:hover:border-purple-800/50">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-cyan-500 text-xs font-bold text-white shadow-sm">
        {getInitials(entry.adminName)}
      </div>

      <div className="min-w-0 flex-[2]">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-bold text-gray-900 dark:text-gray-100">{entry.adminName}</p>
          <span className="text-xs text-gray-400 dark:text-gray-500 hidden sm:inline">{entry.adminEmail}</span>
        </div>
        <p className="truncate text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          {entry.action} &mdash; {entry.target}
        </p>
      </div>

      <div className="hidden items-center gap-1.5 md:flex">
        <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${actionColors[entry.action] || "bg-gray-100 dark:bg-gray-800"}`}>
          {actionIcons[entry.action] || null}
        </div>
        <span className="text-xs font-medium text-gray-600 dark:text-gray-400 capitalize">{entry.action}</span>
      </div>

      <div className="hidden lg:block">
        <span className="rounded-md bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-xs font-medium text-gray-600 dark:text-gray-400">
          {entry.module}
        </span>
      </div>

      <div className="hidden md:block">
        <ActivityStatusBadge status={entry.status} />
      </div>

      <div className="hidden xl:block text-right">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
          {new Date(entry.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onViewDetails(entry.id)}
          className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-1.5 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          View
        </button>
      </div>
    </div>
  );
}
