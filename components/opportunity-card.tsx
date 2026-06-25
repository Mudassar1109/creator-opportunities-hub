import Link from "next/link";

export interface OpportunityCardProps {
  id: string;
  title: string;
  slug: string;
  brand_name?: string | null;
  brand_logo?: string | null;
  brand_verified?: boolean | null;
  opportunity_type: string;
  budget_min?: number | null;
  budget_max?: number | null;
  budget_type: string;
  currency: string;
  country?: string | null;
  deadline?: string | null;
  is_featured: boolean;
  category_names?: string[] | null;
  applications_count?: number;
  published_at?: string | null;
}

function formatBudget(
  min: number | null | undefined,
  max: number | null | undefined,
  type: string,
  currency: string
): string {
  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(n);

  if (type === "range" && min && max) return `${fmt(min)} – ${fmt(max)}`;
  if (type === "fixed" && (min || max)) return fmt(min ?? max ?? 0);
  if (type === "commission") return "Commission";
  if (type === "hourly" && (min || max)) return `${fmt(min ?? max ?? 0)}/hr`;
  if (type === "monthly" && (min || max)) return `${fmt(min ?? max ?? 0)}/mo`;
  if (min || max) return fmt(min ?? max ?? 0);
  return "Negotiable";
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatType(type: string): string {
  return type
    .split("_")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

const TYPE_COLORS: Record<string, string> = {
  brand_deal: "bg-blue-50 text-blue-700 border-blue-100",
  sponsorship: "bg-indigo-50 text-indigo-700 border-indigo-100",
  ugc: "bg-pink-50 text-pink-700 border-pink-100",
  creator_job: "bg-emerald-50 text-emerald-700 border-emerald-100",
  affiliate_program: "bg-purple-50 text-purple-700 border-purple-100",
  collaboration: "bg-amber-50 text-amber-700 border-amber-100",
  ambassador_program: "bg-rose-50 text-rose-700 border-rose-100",
  remote_work: "bg-cyan-50 text-cyan-700 border-cyan-100",
  paid_campaign: "bg-violet-50 text-violet-700 border-violet-100",
};

export function OpportunityCard({
  title,
  slug,
  brand_name,
  brand_logo,
  brand_verified,
  opportunity_type,
  budget_min,
  budget_max,
  budget_type,
  currency,
  country,
  deadline,
  is_featured,
  category_names,
  applications_count,
  published_at,
}: OpportunityCardProps) {
  const isExpired = deadline ? new Date(deadline) < new Date() : false;
  const typeColor = TYPE_COLORS[opportunity_type] ?? "bg-gray-50 text-gray-600 border-gray-100";

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-purple-200 hover:shadow-[0_8px_32px_rgba(124,58,237,0.12)]">

      {/* Gradient border top accent on hover */}
      <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-purple-500 via-cyan-400 to-purple-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" aria-hidden="true" />

      <div className="flex flex-col flex-1 p-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* Brand logo */}
            <div className="relative shrink-0">
              {brand_logo ? (
                <img
                  src={brand_logo}
                  alt={`${brand_name ?? "Brand"} logo`}
                  className="h-11 w-11 rounded-xl border border-gray-100 object-contain bg-gray-50 shadow-sm"
                  loading="lazy"
                />
              ) : (
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-purple-100 to-cyan-100 text-base font-bold text-purple-600 shadow-sm"
                  aria-hidden="true"
                >
                  {brand_name?.[0]?.toUpperCase() ?? "B"}
                </div>
              )}
            </div>

            {/* Brand name + type */}
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <p className="truncate text-sm font-semibold text-gray-900">
                  {brand_name ?? "Brand"}
                </p>
                {brand_verified && (
                  <svg
                    className="h-3.5 w-3.5 shrink-0 text-blue-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-label="Verified brand"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <span className={`mt-0.5 inline-block rounded border px-2 py-0.5 text-[10px] font-semibold ${typeColor}`}>
                {formatType(opportunity_type)}
              </span>
            </div>
          </div>

          {/* Right badges */}
          <div className="flex shrink-0 flex-col items-end gap-1.5">
            {is_featured && (
              <span className="rounded-md bg-gradient-to-r from-purple-600 to-cyan-500 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white shadow-sm shadow-purple-500/30">
                ★ Featured
              </span>
            )}
            {published_at && (
              <span className="text-[10px] text-gray-400 tabular-nums">{timeAgo(published_at)}</span>
            )}
          </div>
        </div>

        {/* Title */}
        <Link
          href={`/opportunities/${slug}`}
          className="mt-3.5 block focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded-lg"
        >
          <h3 className="line-clamp-2 text-base font-bold leading-snug text-gray-900 transition-colors duration-200 group-hover:text-purple-700">
            {title}
          </h3>
        </Link>

        {/* Categories */}
        {category_names && category_names.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {category_names.slice(0, 3).map((cat) => (
              <span
                key={cat}
                className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-medium text-gray-600"
              >
                {cat}
              </span>
            ))}
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Meta footer */}
        <div className="mt-4 border-t border-gray-100 pt-4">
          {/* Budget + location row */}
          <div className="flex items-end justify-between gap-2">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400">Budget</p>
              <p className="mt-0.5 text-sm font-bold text-gray-900">
                {formatBudget(budget_min, budget_max, budget_type, currency)}
              </p>
            </div>
            <div className="text-right">
              {country && (
                <p className="flex items-center gap-1 justify-end text-xs text-gray-500">
                  <svg className="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {country}
                </p>
              )}
              {deadline && (
                <p className={`mt-0.5 flex items-center gap-1 justify-end text-[11px] ${isExpired ? "text-red-500" : "text-gray-400"}`}>
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {isExpired
                    ? "Expired"
                    : `Due ${new Date(deadline).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`}
                </p>
              )}
            </div>
          </div>

          {/* Applicants */}
          {applications_count !== undefined && (
            <p className="mt-2 flex items-center gap-1 text-[11px] text-gray-400">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {applications_count === 0
                ? "Be the first to apply"
                : `${applications_count} applicant${applications_count !== 1 ? "s" : ""}`}
            </p>
          )}

          {/* Action buttons */}
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Link
              href={`/opportunities/${slug}`}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 py-2.5 text-xs font-semibold text-gray-700 transition-all duration-200 hover:border-purple-200 hover:bg-purple-50 hover:text-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View
            </Link>
            <Link
              href={`/opportunities/${slug}`}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 py-2.5 text-xs font-bold text-white shadow-sm shadow-purple-500/25 transition-all duration-200 hover:from-purple-700 hover:to-purple-800 hover:shadow-md hover:shadow-purple-500/30 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Apply
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
