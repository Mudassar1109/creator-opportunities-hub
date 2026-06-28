import type { PlatformSettings } from "@/lib/actions/admin/settings";

export function SEOSettings({ settings }: { settings: PlatformSettings }) {
  return (
    <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
      <div className="border-b border-gray-100 dark:border-gray-800 p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
            </svg>
          </div>
          <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">SEO</h2>
        </div>
      </div>
      <div className="p-5 sm:p-6 space-y-5">
        <Field label="Meta Title" value={settings.metaTitle} />
        <TextareaField label="Meta Description" value={settings.metaDescription} />
        <Field label="Keywords" value={settings.keywords} />
        <Field label="OG Image URL" value={settings.ogImage || "—"} placeholder="No image set" />
      </div>
    </div>
  );
}

function Field({ label, value, placeholder }: { label: string; value: string; placeholder?: string }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</label>
      <input
        readOnly
        type="text"
        value={value}
        placeholder={placeholder}
        className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 cursor-not-allowed opacity-60"
      />
    </div>
  );
}

function TextareaField({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</label>
      <textarea
        readOnly
        value={value}
        rows={3}
        className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 cursor-not-allowed opacity-60 resize-none"
      />
    </div>
  );
}
