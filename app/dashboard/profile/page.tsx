// app/dashboard/profile/page.tsx — Creator Profile Editor
// Server component: fetches profile data and passes to client form

import { createClient, getUser } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Profile } from "@/lib/database.types";
import { ProfileForm } from "@/components/profile-form";
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
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back to Dashboard */}
      <Link
        href="/dashboard"
        className="group mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 transition-colors hover:text-blue-600"
      >
        <svg
          className="h-4 w-4 transition-transform group-hover:-translate-x-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Dashboard
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Creator Profile
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Complete your profile to unlock brand deals and sponsorships.
        </p>

        {/* Completion bar */}
        <div className="mt-4 flex items-center gap-3">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-500"
              style={{ width: `${completion}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-gray-700">
            {completion}%
          </span>
        </div>
      </div>

      {/* Profile Form */}
      <ProfileForm profile={profile} userEmail={user.email ?? ""} />
    </div>
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
