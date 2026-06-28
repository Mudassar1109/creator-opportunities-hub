import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getAdminUser } from "@/lib/supabase/server";
import { getAdminApplicationById } from "@/lib/actions/admin/application-details";
import { ApplicationStatusBadge } from "@/components/admin/application-status-badge";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminApplicationDetailPage({ params }: Props) {
  const result = await getAdminUser();
  if (!result) redirect("/login");

  const { id } = await params;
  const app = await getAdminApplicationById(id);
  if (!app) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/admin/applications"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Back to Applications
      </Link>

      <div className="mb-8 flex items-start gap-6">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-cyan-500 text-2xl font-bold text-white shadow-lg">
          {app.applicant_avatar ? (
            <img src={app.applicant_avatar} alt="" className="h-full w-full rounded-2xl object-cover" />
          ) : (
            app.applicant_name.charAt(0).toUpperCase()
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{app.applicant_name}</h1>
            <ApplicationStatusBadge status={app.status} />
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{app.applicant_email}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            Applied to &ldquo;{app.opportunity_title}&rdquo; at {app.brand_name}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {app.cover_letter && (
            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
              <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-4">Cover Letter</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{app.cover_letter}</p>
            </div>
          )}

          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
            <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-4">Application Details</h2>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                { label: "Status", value: app.status.replace(/_/g, " ") },
                { label: "Proposed Budget", value: app.proposed_budget ? `${app.currency} ${app.proposed_budget.toLocaleString()}` : "Not specified" },
                { label: "Applied", value: new Date(app.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) },
                { label: "Reviewed At", value: app.reviewed_at ? new Date(app.reviewed_at).toLocaleDateString() : "Not reviewed" },
              ].map(({ label, value }) => (
                <div key={label}>
                  <dt className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</dt>
                  <dd className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100 capitalize">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {app.portfolio_links.length > 0 && (
            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
              <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-4">Portfolio Links</h2>
              <ul className="space-y-2">
                {app.portfolio_links.map((link, i) => (
                  <li key={i}>
                    <a href={link} target="_blank" rel="noopener noreferrer" className="text-sm text-purple-600 dark:text-purple-400 hover:underline break-all">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {app.notes && (
            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
              <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-4">Brand Notes</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{app.notes}</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
            <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-4">About {app.applicant_name}</h2>
            {app.applicant_headline && (
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">{app.applicant_headline}</p>
            )}
            {app.applicant_bio && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">{app.applicant_bio}</p>
            )}
            <dl className="space-y-2">
              <div>
                <dt className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase">Followers</dt>
                <dd className="text-sm font-semibold text-gray-900 dark:text-gray-100">{app.applicant_follower_count.toLocaleString()}</dd>
              </div>
              {app.applicant_platforms.length > 0 && (
                <div>
                  <dt className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase">Platforms</dt>
                  <dd className="flex flex-wrap gap-1 mt-1">
                    {app.applicant_platforms.map((p) => (
                      <span key={p} className="rounded-md bg-gray-100 dark:bg-gray-700 px-2 py-0.5 text-[10px] font-medium text-gray-600 dark:text-gray-400">{p}</span>
                    ))}
                  </dd>
                </div>
              )}
              {app.applicant_niches.length > 0 && (
                <div>
                  <dt className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase">Niches</dt>
                  <dd className="flex flex-wrap gap-1 mt-1">
                    {app.applicant_niches.map((n) => (
                      <span key={n} className="rounded-md bg-purple-50 dark:bg-purple-900/20 px-2 py-0.5 text-[10px] font-medium text-purple-600 dark:text-purple-400">{n}</span>
                    ))}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
            <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-4">Opportunity</h2>
            <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{app.opportunity_title}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{app.brand_name}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{app.opportunity_type.replace(/_/g, " ")}</p>
          </div>

          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
            <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <button disabled className="w-full rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white opacity-50 cursor-not-allowed">Review Application</button>
              <button disabled className="w-full rounded-xl border border-emerald-200 dark:border-emerald-900/30 px-4 py-2.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400 opacity-50 cursor-not-allowed">Accept</button>
              <button disabled className="w-full rounded-xl border border-red-200 dark:border-red-900/30 px-4 py-2.5 text-sm font-semibold text-red-600 dark:text-red-400 opacity-50 cursor-not-allowed">Reject</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
