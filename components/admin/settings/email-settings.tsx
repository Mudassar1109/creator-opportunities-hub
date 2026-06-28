import type { PlatformSettings } from "@/lib/actions/admin/settings";

export function EmailSettings({ settings }: { settings: PlatformSettings }) {
  return (
    <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
      <div className="border-b border-gray-100 dark:border-gray-800 p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          </div>
          <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">Email</h2>
        </div>
      </div>
      <div className="p-5 sm:p-6 space-y-5">
        <Field label="Support Email" value={settings.supportEmail} />
        <Field label="Reply Email" value={settings.replyEmail} />
        <Field label="Notification Email" value={settings.notificationEmail} />
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</label>
      <input
        readOnly
        type="email"
        value={value}
        className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 cursor-not-allowed opacity-60"
      />
    </div>
  );
}
