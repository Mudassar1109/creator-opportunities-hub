import Link from "next/link";
import { SaveButton } from "@/components/save-button";

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

  if (type === "range" && min && max) return `${fmt(min)} \u2013 ${fmt(max)}`;
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
  brand_deal: "bg-blue-50 text-blue-700 border-blue-200",
  sponsorship: "bg-indigo-50 text-indigo-700 border-indigo-200",
  ugc: "bg-pink-50 text-pink-700 border-pink-200",
  creator_job: "bg-emerald-50 text-emerald-700 border-emerald-200",
  affiliate_program: "bg-purple-50 text-purple-700 border-purple-200",
  collaboration: "bg-amber-50 text-amber-700 border-amber-200",
  ambassador_program: "bg-rose-50 text-rose-700 border-rose-200",
  remote_work: "bg-cyan-50 text-cyan-700 border-cyan-200",
  paid_campaign: "bg-violet-50 text-violet-700 border-violet-200",
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
  const typeColor = TYPE_COLORS[opportunity_type] ?? "bg-slate-50 text-slate-600 border-slate-200";

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/8">
      {/* Top gradient accent on hover */}
      <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-indigo-500 via-cyan-400 to-indigo-500 opacity-0 transition-opacity duration-200 group-hover:opacity-100" aria-hidden="true" />

      {/* Featured badge */}
      {is_featured && (
        <span className="absolute right-3 top-3 z-10 inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-md">
          <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          Featured
        </span>
      )}

      <div className="flex flex-1 flex-col p-5">
        {/* Header row */}
        <div className="flex items-start gap-3">
          {/* Brand logo */}
          <div className="relative shrink-0">
            {brand_logo ? (
              <img
                src={brand_logo}
                alt={`${brand_name ?? "Brand"} logo`}
                className="h-12 w-12 rounded-xl border border-slate-100 object-contain bg-white shadow-sm"
                loading="lazy"
              />
            ) : (
              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-100 to-cyan-100 text-lg font-bold text-indigo-600 shadow-sm"
                aria-hidden="true"
              >
                {brand_name?.[0]?.toUpperCase() ?? "B"}
              </div>
            )}
          </div>

          {/* Brand name + type */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p className="truncate text-sm font-bold text-slate-900">
                {brand_name ?? "Brand"}
              </p>
              {brand_verified && (
                <svg
                  className="h-4 w-4 shrink-0 text-blue-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-label="Verified brand"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
            <span className={`mt-1 inline-block rounded-md border px-2.5 py-0.5 text-[11px] font-semibold ${typeColor}`}>
              {formatType(opportunity_type)}
            </span>
          </div>

          {/* Time ago */}
          {published_at && (
            <span className="shrink-0 text-[11px] font-medium text-slate-400 tabular-nums">{timeAgo(published_at)}</span>
          )}
        </div>

        {/* Title */}
        <Link
          href={`/opportunities/${slug}`}
          className="mt-3.5 block focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-lg"
        >
          <h3 className="line-clamp-2 text-[15px] font-bold leading-snug text-slate-900 transition-colors duration-200 group-hover:text-indigo-700">
            {title}
          </h3>
        </Link>

        {/* Categories */}
        {category_names && category_names.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {category_names.slice(0, 3).map((cat) => (
              <span
                key={cat}
                className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-600"
              >
                {cat}
              </span>
            ))}
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Budget */}
        <div className="mt-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Budget</p>
          <p className="mt-0.5 text-base font-extrabold text-slate-900">
            {formatBudget(budget_min, budget_max, budget_type, currency)}
          </p>
        </div>

        {/* Meta footer */}
        <div className="mt-3 flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            {/* Country */}
            {country && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500">
                <svg className="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {country}
              </span>
            )}

            {/* Deadline */}
            {deadline && (
              <span className={`inline-flex items-center gap-1 text-[11px] font-medium ${isExpired ? "text-red-500" : "text-slate-500"}`}>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {isExpired ? "Expired" : `Due ${new Date(deadline).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`}
              </span>
            )}

            {/* Applicants */}
            {applications_count !== undefined && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500">
                <svg className="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {applications_count === 0 ? "Be first" : `${applications_count} app${applications_count !== 1 ? "s" : ""}`}
              </span>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-4 grid grid-cols-[auto_1fr] gap-2">
          <SaveButton />
          <Link
            href={`/opportunities/${slug}`}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm shadow-indigo-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:from-indigo-700 hover:to-blue-700 hover:shadow-md hover:shadow-indigo-500/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
          >
            View Details
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}
