// app/dashboard/profile/page.tsx — Creator Profile Editor
// Server component: fetches profile data and passes to client form

import { createClient, getUser } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Profile } from "@/lib/database.types";
import { ProfileForm } from "@/components/profile-form";
import { DashboardLayout } from "@/components/dashboard-layout";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Edit Profile | CreatorHub",
  description: "Complete your creator profile to get matched with brand opportunities.",
};

export default async function ProfilePage() {
  const user = await getUser();
  if (!user) redirect("/login?redirect=/dashboard/profile");

  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Compute completion percentage
  const completion = profile ? computeCompletion(profile) : 0;

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-cyan-500 shadow-lg shadow-purple-500/20">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
                Creator Profile
              </h1>
              <p className="mt-0.5 text-sm text-gray-500">
                Complete your profile to unlock brand deals and sponsorships.
              </p>
            </div>
          </div>

          {/* Completion bar */}
          <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700">Profile Completion</span>
              <span className="text-sm font-bold text-purple-600">{completion}%</span>
            </div>
            <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 transition-all duration-700 ease-out"
                style={{ width: `${completion}%` }}
              />
            </div>
            {completion < 100 && (
              <p className="mt-2 text-xs text-gray-500">
                {completion >= 80
                  ? "Almost there! Just a few more fields to go."
                  : completion >= 40
                  ? "Good progress! Add more details to attract brands."
                  : "Get started by filling in your basic information."}
              </p>
            )}
          </div>
        </div>

        {/* Profile Form */}
        <ProfileForm profile={profile} userEmail={user.email ?? ""} />
      </div>
    </DashboardLayout>
  );
}

// ─── Completion calculator ──────────────────────────────────

function computeCompletion(profile: Profile): number {
  const fields = [
    profile.full_name,
    profile.username,
    profile.avatar_url,
    profile.headline,
    profile.bio,
    profile.country,
    profile.city,
    profile.website,
    profile.platforms.length > 0,
    profile.niches.length > 0,
    profile.follower_count > 0,
    profile.youtube_url || profile.tiktok_url || profile.instagram_url || profile.twitter_url,
  ];

  const filled = fields.filter(Boolean).length;
  return Math.round((filled / fields.length) * 100);
}
// app/dashboard/profile/page.tsx — Creator Profile Editor
