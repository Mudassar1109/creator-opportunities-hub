import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient, getUserWithRole } from "@/lib/supabase/server";
import { DashboardLayout } from "@/components/dashboard-layout";
import { ApplicantActions } from "./applicant-actions";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Applicants | CreatorHub",
  description: "Review applicants for your opportunity.",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ApplicantsPage({ params }: PageProps) {
  const { id } = await params;
  const result = await getUserWithRole();
  if (!result) redirect("/login");
  if (result.role !== "brand") redirect("/dashboard");

  const supabase = await createClient();
  const user = result.user;

  // Get opportunity and verify ownership
  const { data: opp } = await supabase
    .from("opportunities")
    .select("*, brands(user_id, company_name)")
    .eq("id", id)
    .single();

  if (!opp) notFound();

  const brand = opp.brands as unknown as { user_id: string; company_name: string };
  if (brand.user_id !== user.id) redirect("/dashboard/opportunities");

  // Get all applications with creator profiles
  const { data: applications } = await supabase
    .from("applications")
    .select("*, profiles(id, full_name, username, avatar_url, bio, headline, follower_count, platforms, niches, youtube_url, tiktok_url, instagram_url, twitter_url, website)")
    .eq("opportunity_id", id)
    .order("created_at", { ascending: false });

  const statusColors: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700",
    under_review: "bg-purple-100 text-purple-700",
    accepted: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
    withdrawn: "bg-gray-100 text-gray-500",
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          <Link href="/dashboard/opportunities" className="text-sm text-purple-600 hover:text-purple-700">
            &larr; Back to Opportunities
          </Link>
        </div>

        <h1 className="text-2xl font-bold text-gray-900">Applicants</h1>
        <p className="mt-1 text-sm text-gray-500">
          {opp.title} &middot; {brand.company_name} &middot; {applications?.length ?? 0} applicant{(applications?.length ?? 0) !== 1 ? "s" : ""}
        </p>

        <div className="mt-6 space-y-4">
          {applications && applications.length > 0 ? (
            applications.map((app) => {
              const creator = app.profiles as unknown as {
                id: string;
                full_name: string;
                username: string;
                avatar_url?: string | null;
                bio?: string | null;
                headline?: string | null;
                follower_count: number;
                platforms: string[];
                niches: string[];
                youtube_url?: string | null;
                tiktok_url?: string | null;
                instagram_url?: string | null;
                twitter_url?: string | null;
                website?: string | null;
              };

              return (
                <div key={app.id} className="rounded-xl border border-gray-200 bg-white p-5">
                  {/* Creator Header */}
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-purple-100 text-sm font-bold text-purple-600 overflow-hidden">
                      {creator?.avatar_url ? (
                        <img src={creator.avatar_url} alt="" className="h-full w-full object-cover" />
                      ) : (
                        creator?.full_name?.[0]?.toUpperCase() || "?"
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-gray-900">{creator?.full_name || "Unknown"}</h3>
                        <span className={`rounded-md px-2 py-0.5 text-[11px] font-semibold ${statusColors[app.status] || "bg-gray-100 text-gray-600"}`}>
                          {app.status.replace(/_/g, " ")}
                        </span>
                      </div>
                      {creator?.username && <p className="text-xs text-gray-500">@{creator.username}</p>}
                      {creator?.headline && <p className="mt-1 text-xs text-gray-600">{creator.headline}</p>}
                    </div>
                    <ApplicantActions applicationId={app.id} currentStatus={app.status} />
                  </div>

                  {/* Creator Stats */}
                  {creator && (
                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                      <div className="rounded-lg bg-gray-50 p-2 text-center">
                        <p className="text-lg font-bold text-gray-900">{(creator.follower_count || 0).toLocaleString()}</p>
                        <p className="text-[10px] uppercase text-gray-500">Followers</p>
                      </div>
                      <div className="rounded-lg bg-gray-50 p-2 text-center">
                        <p className="text-lg font-bold text-gray-900">{creator.platforms?.length || 0}</p>
                        <p className="text-[10px] uppercase text-gray-500">Platforms</p>
                      </div>
                      <div className="rounded-lg bg-gray-50 p-2 text-center">
                        <p className="text-lg font-bold text-gray-900">{creator.niches?.length || 0}</p>
                        <p className="text-[10px] uppercase text-gray-500">Niches</p>
                      </div>
                      <div className="rounded-lg bg-gray-50 p-2 text-center">
                        <p className="text-sm font-bold text-gray-900 truncate">
                          {creator.platforms?.slice(0, 2).join(", ") || "N/A"}
                        </p>
                        <p className="text-[10px] uppercase text-gray-500">Top Platforms</p>
                      </div>
                    </div>
                  )}

                  {/* Platforms & Niches Tags */}
                  {creator && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {creator.platforms?.map((p) => (
                        <span key={p} className="rounded bg-purple-50 px-2 py-0.5 text-[10px] font-medium text-purple-700">{p}</span>
                      ))}
                      {creator.niches?.map((n) => (
                        <span key={n} className="rounded bg-cyan-50 px-2 py-0.5 text-[10px] font-medium text-cyan-700">{n}</span>
                      ))}
                    </div>
                  )}

                  {/* Bio */}
                  {creator?.bio && (
                    <p className="mt-3 text-xs text-gray-600 line-clamp-3">{creator.bio}</p>
                  )}

                  {/* Cover Letter */}
                  {app.cover_letter && (
                    <div className="mt-3 rounded-lg bg-gray-50 p-3">
                      <p className="text-[10px] font-semibold uppercase text-gray-500 mb-1">Cover Letter</p>
                      <p className="text-xs text-gray-700 whitespace-pre-wrap">{app.cover_letter}</p>
                    </div>
                  )}

                  {/* Portfolio Links */}
                  {app.portfolio_links && app.portfolio_links.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {app.portfolio_links.map((url, i) => (
                        <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="text-xs text-purple-600 hover:text-purple-700 underline">
                          Portfolio {app.portfolio_links!.length > 1 ? i + 1 : ""}
                        </a>
                      ))}
                    </div>
                  )}

                  {/* Social Links */}
                  {creator && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {creator.youtube_url && <a href={creator.youtube_url} target="_blank" rel="noopener noreferrer" className="text-xs text-purple-600 hover:text-purple-700">YouTube</a>}
                      {creator.tiktok_url && <a href={creator.tiktok_url} target="_blank" rel="noopener noreferrer" className="text-xs text-purple-600 hover:text-purple-700">TikTok</a>}
                      {creator.instagram_url && <a href={creator.instagram_url} target="_blank" rel="noopener noreferrer" className="text-xs text-purple-600 hover:text-purple-700">Instagram</a>}
                      {creator.twitter_url && <a href={creator.twitter_url} target="_blank" rel="noopener noreferrer" className="text-xs text-purple-600 hover:text-purple-700">Twitter</a>}
                      {creator.website && <a href={creator.website} target="_blank" rel="noopener noreferrer" className="text-xs text-purple-600 hover:text-purple-700">Website</a>}
                    </div>
                  )}

                  <p className="mt-3 text-[10px] text-gray-400">
                    Applied {new Date(app.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  </p>
                </div>
              );
            })
          ) : (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
              <p className="text-sm font-semibold text-gray-900">No applicants yet</p>
              <p className="mt-1 text-sm text-gray-500">Applicants will appear here once they apply.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
