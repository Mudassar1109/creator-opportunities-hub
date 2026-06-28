import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/supabase/server";
import { getAdminAnalytics } from "@/lib/actions/admin/analytics";
import { KPICard } from "@/components/admin/analytics/kpi-card";
import { ChartPlaceholder } from "@/components/admin/analytics/chart-placeholder";
import { RecentActivity } from "@/components/admin/analytics/recent-activity";
import { TopCreatorsList } from "@/components/admin/analytics/top-creators";
import { TopBrandsList } from "@/components/admin/analytics/top-brands";
import type { ChartData } from "@/lib/actions/admin/analytics";

export const dynamic = "force-dynamic";

function BarChart({ data, gradientFrom, gradientTo }: { data: ChartData[]; gradientFrom: string; gradientTo: string }) {
  const maxVal = Math.max(...data.map((p) => p.value), 1);
  return (
    <div className="flex h-48 items-end gap-2">
      {data.map((point) => {
        const height = (point.value / maxVal) * 100;
        return (
          <div key={point.label} className="flex flex-1 flex-col items-center gap-1">
            <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400">
              {point.value}
            </span>
            <div
              className="w-full rounded-t-md bg-gradient-to-t"
              style={{
                height: `${height}%`,
                background: `linear-gradient(to top, ${gradientFrom}, ${gradientTo})`,
              }}
            />
            <span className="text-[10px] text-gray-400 dark:text-gray-500">
              {point.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default async function AdminAnalyticsPage() {
  const result = await getAdminUser();
  if (!result) redirect("/login");

  const data = await getAdminAnalytics();

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">Analytics</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Platform performance and growth metrics
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {data.kpis.map((kpi) => (
          <KPICard key={kpi.label} kpi={kpi} />
        ))}
      </div>

      {/* Growth Summary */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {data.growthSummary.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4"
          >
            <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">
              {item.label}
            </p>
            <p className="mt-1 text-lg font-extrabold text-gray-900 dark:text-gray-100">
              {item.current}
            </p>
            <p
              className={`mt-0.5 text-xs font-bold ${
                item.change >= 0 ? "text-emerald-500" : "text-red-500"
              }`}
            >
              {item.change >= 0 ? "+" : ""}
              {item.change}% vs last week
            </p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartPlaceholder title="User Growth" description="New users over the last 6 months">
          <BarChart data={data.userGrowth} gradientFrom="#a855f7" gradientTo="#22d3ee" />
        </ChartPlaceholder>
        <ChartPlaceholder title="Application Growth" description="Applications over the last 6 months">
          <BarChart data={data.applicationGrowth} gradientFrom="#f59e0b" gradientTo="#fb923c" />
        </ChartPlaceholder>
      </div>

      {/* Recent Activity + Top Creators */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RecentActivity activity={data.recentActivity} />
        <TopCreatorsList creators={data.topCreators} />
      </div>

      {/* Top Brands + Additional Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <TopBrandsList brands={data.topBrands} />
        <div className="space-y-6">
          <ChartPlaceholder title="Platform Distribution" description="Breakdown by user role" />
          <ChartPlaceholder title="Revenue Overview" description="Monthly revenue projection" />
        </div>
      </div>
    </div>
  );
}
