/**
 * DashboardPreview — Floating dashboard mockup built from real DB data shapes.
 * Rendered as a Server Component parent, this is a pure presentational component.
 * No fake data — either shows real shapes or nothing.
 */

interface PreviewOpportunity {
  title: string;
  brand_name: string;
  budget_type: string;
  budget_min: number | null;
  budget_max: number | null;
  currency: string;
  opportunity_type: string;
  brand_verified?: boolean;
}

interface DashboardPreviewProps {
  opportunities: PreviewOpportunity[];
  stats: {
    totalCreators: number;
    totalBrands: number;
    publishedOpportunities: number;
    totalApplications: number;
  };
}

function fmtBudget(min: number | null, max: number | null, type: string, currency: string): string {
  const sym = currency === "USD" ? "$" : currency === "EUR" ? "€" : currency === "GBP" ? "£" : currency;
  if (type === "commission") return "Commission";
  if (type === "negotiable") return "Negotiable";
  if (min && max) return `${sym}${(min / 1000).toFixed(0)}K–${sym}${(max / 1000).toFixed(0)}K`;
  if (max) return `${sym}${(max / 1000).toFixed(0)}K`;
  if (min) return `${sym}${(min / 1000).toFixed(0)}K`;
  return "TBD";
}

function formatType(type: string): string {
  return type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

const TYPE_COLORS: Record<string, string> = {
  brand_deal: "bg-blue-100 text-blue-700",
  sponsorship: "bg-indigo-100 text-indigo-700",
  ugc: "bg-pink-100 text-pink-700",
  creator_job: "bg-emerald-100 text-emerald-700",
  affiliate_program: "bg-purple-100 text-purple-700",
  collaboration: "bg-amber-100 text-amber-700",
  ambassador_program: "bg-rose-100 text-rose-700",
  remote_work: "bg-cyan-100 text-cyan-700",
  paid_campaign: "bg-violet-100 text-violet-700",
};

export function DashboardPreview({ opportunities, stats }: DashboardPreviewProps) {
  const topOpps = opportunities.slice(0, 3);

  return (
    <div className="relative">
      {/* Outer glow ring */}
      <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-purple-600/20 via-cyan-500/20 to-purple-600/20 blur-2xl" aria-hidden="true" />

      {/* Main dashboard window */}
      <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-gray-900/95 shadow-2xl shadow-purple-900/40">
        {/* Scan line effect */}
        <div className="scan-line" aria-hidden="true" />

        {/* Window chrome */}
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div className="flex items-center gap-2" aria-hidden="true">
            <div className="h-3 w-3 rounded-full bg-red-400/80" />
            <div className="h-3 w-3 rounded-full bg-amber-400/80" />
            <div className="h-3 w-3 rounded-full bg-emerald-400/80" />
          </div>
          <div className="flex items-center gap-2 rounded-md bg-white/10 px-3 py-1">
            <svg className="h-3 w-3 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
            </svg>
            <span className="text-[10px] text-white/50 font-medium">dashboard.creatorhub.io</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 animate-live-pulse rounded-full bg-emerald-400" aria-label="Live" />
            <span className="text-[10px] font-semibold text-emerald-400">LIVE</span>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-px bg-white/5 px-0">
          {[
            { label: "Opportunities", value: stats.publishedOpportunities, color: "text-purple-400" },
            { label: "Creators", value: stats.totalCreators, color: "text-cyan-400" },
            { label: "Brands", value: stats.totalBrands, color: "text-indigo-400" },
            { label: "Applications", value: stats.totalApplications, color: "text-emerald-400" },
          ].map((s) => (
            <div key={s.label} className="bg-gray-900/90 px-3 py-2.5 text-center">
              <p className={`text-sm font-bold tabular-nums ${s.color}`}>
                {s.value > 1000 ? `${(s.value / 1000).toFixed(1)}K` : s.value}
              </p>
              <p className="mt-0.5 text-[9px] font-medium uppercase tracking-wide text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Opportunities list */}
        <div className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Recent Opportunities</span>
            <span className="rounded-full bg-purple-500/20 px-2 py-0.5 text-[10px] font-semibold text-purple-300">
              {stats.publishedOpportunities} active
            </span>
          </div>

          <div className="space-y-2">
            {topOpps.length > 0 ? (
              topOpps.map((opp, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-3 rounded-lg bg-white/5 px-3 py-2.5 transition hover:bg-white/8"
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600/60 to-cyan-500/60 text-xs font-bold text-white">
                      {opp.brand_name[0]?.toUpperCase() ?? "B"}
                    </div>
                    <div className="min-w-0">
                      <p className="flex items-center gap-1 truncate text-xs font-semibold text-white/90">
                        {opp.title}
                        {opp.brand_verified && (
                          <svg className="h-3 w-3 shrink-0 text-blue-400" fill="currentColor" viewBox="0 0 20 20" aria-label="Verified">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                      </p>
                      <p className="text-[10px] text-gray-500">{opp.brand_name}</p>
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase ${TYPE_COLORS[opp.opportunity_type] ?? "bg-gray-100 text-gray-600"}`}>
                      {formatType(opp.opportunity_type).split(" ")[0]}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-400">
                      {fmtBudget(opp.budget_min, opp.budget_max, opp.budget_type, opp.currency)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-lg border border-dashed border-white/10 py-6 text-center">
                <p className="text-xs text-gray-500">No opportunities yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom action bar */}
        <div className="border-t border-white/10 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500" aria-hidden="true" />
              <span className="text-xs font-medium text-gray-400">Your Dashboard</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-lg bg-purple-600/80 px-3 py-1.5">
              <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-[10px] font-bold text-white">Apply Now</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating notification card 1 — accepted application */}
      <div
        className="animate-float-medium absolute -right-6 top-8 z-10 hidden rounded-xl border border-emerald-200/70 bg-white/96 p-3 shadow-xl shadow-emerald-500/10 backdrop-blur-sm xl:block"
        aria-hidden="true"
      >
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 text-sm shadow-sm">
            ✅
          </div>
          <div>
            <p className="text-xs font-bold text-gray-900">Application Accepted</p>
            <p className="text-[10px] text-gray-500">Brand Deal opportunity</p>
          </div>
        </div>
      </div>

      {/* Floating notification card 2 — new opportunity */}
      <div
        className="animate-float-slow absolute -left-6 bottom-12 z-10 hidden rounded-xl border border-purple-200/70 bg-white/96 p-3 shadow-xl shadow-purple-500/10 backdrop-blur-sm xl:block"
        aria-hidden="true"
      >
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 text-sm shadow-sm">
            🚀
          </div>
          <div>
            <p className="text-xs font-bold text-gray-900">New opportunity posted</p>
            <p className="text-[10px] text-gray-500">Sponsorship · Just now</p>
          </div>
        </div>
      </div>
    </div>
  );
}
