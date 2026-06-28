interface ActivityProps {
  activity: {
    opportunities: Array<{ id: string; title: string; opportunity_type: string; published_at: string | null; brands: { company_name: string } | null }>;
    applications: Array<{ id: string; created_at: string; opportunities: { title: string } | null; profiles: { full_name: string } | null }>;
    brands: Array<{ id: string; company_name: string; created_at: string; industry: string | null }>;
  };
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function RecentActivity({ activity }: ActivityProps) {
  const hasActivity =
    activity.opportunities.length > 0 ||
    activity.applications.length > 0 ||
    activity.brands.length > 0;

  if (!hasActivity) {
    return (
      <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 sm:p-6 shadow-sm">
        <h3 className="mb-4 text-sm font-bold text-gray-900 dark:text-gray-100">
          Recent Activity
        </h3>
        <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            No recent activity in the last 7 days
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 sm:p-6 shadow-sm">
      <h3 className="mb-4 text-sm font-bold text-gray-900 dark:text-gray-100">
        Recent Activity
      </h3>
      <div className="space-y-4">
        {activity.opportunities.slice(0, 3).map((opp) => (
          <div key={opp.id} className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <svg className="h-4 w-4 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.181 2.181 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.181 2.181 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {opp.title}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {opp.brands?.company_name ?? "Unknown brand"} &middot;{" "}
                {opp.published_at ? timeAgo(opp.published_at) : ""}
              </p>
            </div>
          </div>
        ))}
        {activity.applications.slice(0, 3).map((app) => (
          <div key={app.id} className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-100 dark:bg-cyan-900/30">
              <svg className="h-4 w-4 text-cyan-600 dark:text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {app.profiles?.full_name ?? "Someone"} applied
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {app.opportunities?.title ?? "Unknown opportunity"} &middot;{" "}
                {timeAgo(app.created_at)}
              </p>
            </div>
          </div>
        ))}
        {activity.brands.slice(0, 2).map((brand) => (
          <div key={brand.id} className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
              <svg className="h-4 w-4 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {brand.company_name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                New brand registered &middot; {timeAgo(brand.created_at)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
