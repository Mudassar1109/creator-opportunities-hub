import type { PlatformSettings } from "@/lib/actions/admin/settings";

export function SecuritySettings({ settings }: { settings: PlatformSettings }) {
  return (
    <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
      <div className="border-b border-gray-100 dark:border-gray-800 p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </div>
          <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">Security</h2>
        </div>
      </div>
      <div className="p-5 sm:p-6 space-y-5">
        <ToggleField label="Maintenance Mode" value={settings.maintenanceMode} />
        <ToggleField label="Admin Only Mode" value={settings.adminOnlyMode} />
      </div>
    </div>
  );
}

function ToggleField({ label, value }: { label: string; value: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{label}</span>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          {label === "Maintenance Mode"
            ? "Show maintenance page to all visitors except admins"
            : "Only allow admin users to access the platform"}
        </p>
      </div>
      <div className={`relative h-6 w-11 rounded-full transition-colors ${value ? "bg-purple-600" : "bg-gray-200 dark:bg-gray-700"}`}>
        <div className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${value ? "translate-x-5" : ""}`} />
      </div>
    </div>
  );
}
