import type { PlatformSettings } from "@/lib/actions/admin/settings";

export function FeatureFlags({ settings }: { settings: PlatformSettings }) {
  return (
    <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
      <div className="border-b border-gray-100 dark:border-gray-800 p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" />
            </svg>
          </div>
          <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">Feature Flags</h2>
        </div>
      </div>
      <div className="p-5 sm:p-6 space-y-5">
        <ToggleField
          label="Referral System"
          value={settings.referralEnabled}
          description="Allow users to refer others and earn rewards"
        />
        <ToggleField
          label="Blog"
          value={settings.blogEnabled}
          description="Enable the platform blog and articles section"
        />
        <ToggleField
          label="Notifications"
          value={settings.notificationsEnabled}
          description="Send email and in-app notifications to users"
        />
      </div>
    </div>
  );
}

function ToggleField({ label, value, description }: { label: string; value: boolean; description: string }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{label}</span>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>
      </div>
      <div className={`relative h-6 w-11 rounded-full transition-colors ${value ? "bg-purple-600" : "bg-gray-200 dark:bg-gray-700"}`}>
        <div className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${value ? "translate-x-5" : ""}`} />
      </div>
    </div>
  );
}
