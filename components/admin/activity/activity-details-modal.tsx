"use client";

import type { ActivityEntry } from "@/lib/actions/admin/activity";
import { ActivityStatusBadge } from "./activity-status-badge";

interface Props {
  entry: ActivityEntry;
  onClose: () => void;
}

export function ActivityDetailsModal({ entry, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100">Activity Details</h2>
          <button onClick={onClose} className="rounded-lg p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="px-6 py-4 space-y-4 max-h-[60vh] overflow-y-auto">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md">{entry.id}</span>
            <ActivityStatusBadge status={entry.status} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <DetailField label="Admin" value={entry.adminName} />
            <DetailField label="Email" value={entry.adminEmail} />
            <DetailField label="Action" value={entry.action} />
            <DetailField label="Module" value={entry.module} />
            <DetailField label="Target" value={entry.target} />
            <DetailField label="Target ID" value={entry.targetId} />
            <DetailField label="Date & Time" value={new Date(entry.createdAt).toLocaleString()} />
            <DetailField label="IP Address" value={entry.ipAddress} />
          </div>

          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Details</p>
            <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900/50 rounded-xl p-3">{entry.details}</p>
          </div>

          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">User Agent</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 break-all bg-gray-50 dark:bg-gray-900/50 rounded-xl p-3">{entry.userAgent}</p>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl bg-purple-600 px-5 py-2 text-sm font-semibold text-white hover:bg-purple-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</p>
      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mt-0.5">{value}</p>
    </div>
  );
}
