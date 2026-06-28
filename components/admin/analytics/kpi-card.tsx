import type { AnalyticsKPI } from "@/lib/actions/admin/analytics";

const valueColorMap: Record<string, string> = {
  users: "text-purple-600 dark:text-purple-400",
  creators: "text-cyan-600 dark:text-cyan-400",
  brands: "text-indigo-600 dark:text-indigo-400",
  opportunities: "text-purple-600 dark:text-purple-400",
  pending: "text-amber-600 dark:text-amber-400",
  active: "text-emerald-600 dark:text-emerald-400",
  reports: "text-red-600 dark:text-red-400",
  messages: "text-indigo-600 dark:text-indigo-400",
};

export function KPICard({ kpi }: { kpi: AnalyticsKPI }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 sm:p-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-purple-200/50 dark:hover:border-purple-800/50 hover:-translate-y-0.5">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50/0 to-cyan-50/0 dark:from-purple-900/0 dark:to-cyan-900/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[10px] sm:text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">
            {kpi.label}
          </p>
          <span
            className={`text-[10px] font-bold ${
              kpi.growth >= 0 ? "text-emerald-500" : "text-red-500"
            }`}
          >
            {kpi.growth >= 0 ? "+" : ""}
            {kpi.growth}%
          </span>
        </div>
        <p
          className={`mt-2 sm:mt-3 text-2xl sm:text-3xl font-extrabold ${
            valueColorMap[kpi.icon] ?? "text-gray-900 dark:text-gray-100"
          }`}
        >
          {kpi.value}
        </p>
      </div>
    </div>
  );
}
