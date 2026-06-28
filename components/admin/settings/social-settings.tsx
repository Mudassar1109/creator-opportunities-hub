import type { PlatformSettings } from "@/lib/actions/admin/settings";

export function SocialSettings({ settings }: { settings: PlatformSettings }) {
  return (
    <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
      <div className="border-b border-gray-100 dark:border-gray-800 p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-2.27a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
            </svg>
          </div>
          <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">Social Links</h2>
        </div>
      </div>
      <div className="p-5 sm:p-6 space-y-5">
        <Field label="Facebook" value={settings.facebook} icon="F" />
        <Field label="Instagram" value={settings.instagram} icon="I" />
        <Field label="LinkedIn" value={settings.linkedin} icon="in" />
        <Field label="X (Twitter)" value={settings.x} icon="X" />
        <Field label="YouTube" value={settings.youtube} icon="YT" />
      </div>
    </div>
  );
}

function Field({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</label>
      <div className="flex items-center gap-2">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 text-xs font-bold text-gray-500 dark:text-gray-400">
          {icon}
        </span>
        <input
          readOnly
          type="url"
          value={value}
          className="flex-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 cursor-not-allowed opacity-60"
        />
      </div>
    </div>
  );
}
