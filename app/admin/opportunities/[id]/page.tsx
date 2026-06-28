import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getAdminUser } from "@/lib/supabase/server";
import { getAdminOpportunityById } from "@/lib/actions/admin/opportunity-details";
import { OpportunityStatusBadge } from "@/components/admin/opportunity-status-badge";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminOpportunityDetailPage({ params }: Props) {
  const result = await getAdminUser();
  if (!result) redirect("/login");

  const { id } = await params;
  const opp = await getAdminOpportunityById(id);
  if (!opp) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/admin/opportunities"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Back to Opportunities
      </Link>

      <div className="mb-8 flex items-start gap-6">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-100 to-cyan-100 dark:from-purple-900/30 dark:to-cyan-900/30">
          <svg className="h-8 w-8 text-purple-500 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.181 2.181 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.181 2.181 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{opp.title}</h1>
            <OpportunityStatusBadge status={opp.status} />
            {opp.is_featured && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 dark:bg-amber-900/30 px-3 py-0.5 text-xs font-bold text-amber-700 dark:text-amber-400">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>
                Featured
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            by {opp.brand_name} &middot; {opp.opportunity_type.replace(/_/g, " ")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
            <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-4">Description</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{opp.description}</p>
          </div>

          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
            <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-4">Opportunity Details</h2>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                { label: "Type", value: opp.opportunity_type.replace(/_/g, " ") },
                { label: "Status", value: opp.status },
                { label: "Budget", value: opp.budget_min ? `${opp.currency} ${opp.budget_min} - ${opp.budget_max ?? "N/A"}` : "Negotiable" },
                { label: "Budget Type", value: opp.budget_type },
                { label: "Location", value: opp.location_type },
                { label: "Country", value: opp.country || "Remote" },
                { label: "Min Followers", value: opp.min_followers.toLocaleString() },
                { label: "Views", value: opp.views_count.toLocaleString() },
                { label: "Applications", value: opp.applications_count.toLocaleString() },
                { label: "Deadline", value: opp.deadline ? new Date(opp.deadline).toLocaleDateString() : "—" },
                { label: "Published", value: opp.published_at ? new Date(opp.published_at).toLocaleDateString() : "Not published" },
                { label: "Created", value: new Date(opp.created_at).toLocaleDateString() },
              ].map(({ label, value }) => (
                <div key={label}>
                  <dt className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</dt>
                  <dd className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100 capitalize">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {(opp.requirements || opp.deliverables) && (
            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
              {opp.requirements && (
                <>
                  <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-2">Requirements</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap mb-4">{opp.requirements}</p>
                </>
              )}
              {opp.deliverables && (
                <>
                  <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-2">Deliverables</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{opp.deliverables}</p>
                </>
              )}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
            <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-4">Brand</h2>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-600 to-cyan-400 text-sm font-bold text-white">
                {opp.brand_logo ? <img src={opp.brand_logo} alt="" className="h-full w-full rounded-xl object-cover" /> : opp.brand_name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{opp.brand_name}</p>
                {opp.brand_website && (
                  <a href={opp.brand_website} target="_blank" rel="noopener noreferrer" className="text-xs text-purple-600 dark:text-purple-400 hover:underline">{opp.brand_website}</a>
                )}
              </div>
            </div>
          </div>

          {opp.platforms.length > 0 && (
            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
              <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-3">Platforms</h2>
              <div className="flex flex-wrap gap-2">
                {opp.platforms.map((p) => (
                  <span key={p} className="rounded-lg bg-gray-100 dark:bg-gray-700 px-2.5 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 capitalize">{p}</span>
                ))}
              </div>
            </div>
          )}

          {opp.niches.length > 0 && (
            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
              <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-3">Niches</h2>
              <div className="flex flex-wrap gap-2">
                {opp.niches.map((n) => (
                  <span key={n} className="rounded-lg bg-purple-50 dark:bg-purple-900/20 px-2.5 py-1 text-xs font-medium text-purple-700 dark:text-purple-300 capitalize">{n}</span>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
            <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <button disabled className="w-full rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white opacity-50 cursor-not-allowed">Edit Opportunity</button>
              <button disabled className="w-full rounded-xl border border-red-200 dark:border-red-900/30 px-4 py-2.5 text-sm font-semibold text-red-600 dark:text-red-400 opacity-50 cursor-not-allowed">Archive Opportunity</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
