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
}

function formatBudget(min: number | null | undefined, max: number | null | undefined, type: string, currency: string): string {
  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(n);

  if (type === "range" && min && max) return `${fmt(min)} - ${fmt(max)}`;
  if (type === "fixed" && (min || max)) return fmt(min ?? max ?? 0);
  if (type === "commission") return "Commission-based";
  if (type === "hourly" && (min || max)) return `${fmt(min ?? max ?? 0)}/hr`;
  if (type === "monthly" && (min || max)) return `${fmt(min ?? max ?? 0)}/mo`;
  if (min || max) return fmt(min ?? max ?? 0);
  return "Negotiable";
}

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
}: OpportunityCardProps) {
  const isExpired = deadline ? new Date(deadline) < new Date() : false;

  return (
    <article className="group flex flex-col rounded-xl border border-gray-200 bg-white p-5 transition hover:border-purple-300 hover:shadow-md">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          {brand_logo ? (
            <img src={brand_logo} alt="" className="h-10 w-10 rounded-lg object-cover" />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-sm font-bold text-purple-600">
              {brand_name?.[0]?.toUpperCase() ?? "B"}
            </div>
          )}
          <div>
            <p className="text-sm font-semibold text-gray-900 flex items-center gap-1">
              {brand_name || "Brand"}
              {brand_verified && (
                <svg className="h-4 w-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </p>
            <p className="text-xs text-gray-500">{opportunity_type.replace(/_/g, " ")}</p>
          </div>
        </div>
        {is_featured && (
          <span className="shrink-0 rounded-md bg-purple-100 px-2 py-0.5 text-[10px] font-bold uppercase text-purple-700">
            Featured
          </span>
        )}
      </div>

      {/* Title */}
      <Link href={`/opportunities/${slug}`} className="mt-3 block">
        <h3 className="text-base font-bold text-gray-900 group-hover:text-purple-700 transition line-clamp-2">
          {title}
        </h3>
      </Link>

      {/* Categories */}
      {category_names && category_names.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {category_names.slice(0, 3).map((cat) => (
            <span key={cat} className="rounded bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600">
              {cat}
            </span>
          ))}
        </div>
      )}

      {/* Meta */}
      <div className="mt-auto pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm">
          <div>
            <p className="text-xs text-gray-500">Budget</p>
            <p className="font-semibold text-gray-900">
              {formatBudget(budget_min, budget_max, budget_type, currency)}
            </p>
          </div>
          <div className="text-right">
            {country && (
              <p className="text-xs text-gray-500">{country}</p>
            )}
            {deadline && (
              <p className={`text-xs ${isExpired ? "text-red-500" : "text-gray-500"}`}>
                {isExpired ? "Expired" : `Due ${new Date(deadline).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`}
              </p>
            )}
          </div>
        </div>

        {applications_count !== undefined && (
          <p className="mt-2 text-xs text-gray-400">{applications_count} application{applications_count !== 1 ? "s" : ""}</p>
        )}

        {/* Actions */}
        <div className="mt-3 flex gap-2">
          <Link
            href={`/opportunities/${slug}`}
            className="flex-1 rounded-lg border border-gray-200 py-2 text-center text-xs font-semibold text-gray-700 transition hover:border-purple-300 hover:text-purple-700"
          >
            View Details
          </Link>
          <Link
            href={`/opportunities/${slug}`}
            className="flex-1 rounded-lg bg-purple-600 py-2 text-center text-xs font-semibold text-white transition hover:bg-purple-700"
          >
            Apply
          </Link>
        </div>
      </div>
    </article>
  );
}
