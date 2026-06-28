import { createClient } from "@/lib/supabase/server";

export interface AdminUserDetails {
  id: string;
  full_name: string;
  username: string;
  email: string;
  avatar_url: string | null;
  bio: string | null;
  headline: string | null;
  platforms: string[];
  niches: string[];
  follower_count: number;
  country: string | null;
  city: string | null;
  website: string | null;
  youtube_url: string | null;
  tiktok_url: string | null;
  instagram_url: string | null;
  twitter_url: string | null;
  linkedin_url: string | null;
  role: string;
  is_verified: boolean;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminUserDetailsResponse {
  profile: AdminUserDetails;
  applicationCount: number;
  opportunityCount: number;
}

export async function getAdminUserById(
  id: string
): Promise<AdminUserDetailsResponse | null> {
  const supabase = await createClient();

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !profile) return null;

  const [
    { count: applicationCount },
    { count: opportunityCount },
  ] = await Promise.all([
    supabase
      .from("applications")
      .select("*", { count: "exact", head: true })
      .eq("creator_id", id),
    supabase
      .from("opportunities")
      .select("*", { count: "exact", head: true })
      .eq("created_by", id),
  ]);

  return {
    profile: profile as AdminUserDetails,
    applicationCount: applicationCount ?? 0,
    opportunityCount: opportunityCount ?? 0,
  };
}
