import { UserRoleBadge } from "@/components/admin/user-role-badge";
import { UserStatusBadge } from "@/components/admin/user-status-badge";
import type { AdminUserDetails } from "@/lib/actions/admin/user-details";

interface Props {
  profile: AdminUserDetails;
}

export function UserProfileCard({ profile }: Props) {
  const socialLinks = [
    { label: "YouTube", url: profile.youtube_url, icon: "YT" },
    { label: "TikTok", url: profile.tiktok_url, icon: "TT" },
    { label: "Instagram", url: profile.instagram_url, icon: "IG" },
    { label: "Twitter", url: profile.twitter_url, icon: "TW" },
    { label: "LinkedIn", url: profile.linkedin_url, icon: "LI" },
  ].filter((s) => s.url);

  return (
    <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
      {/* Header */}
      <div className="border-b border-gray-100 dark:border-gray-800 p-6 sm:p-8">
        <div className="flex items-start gap-5">
          <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-2xl font-bold text-white shadow-lg ${
            profile.role === "brand" ? "bg-gradient-to-br from-cyan-600 to-cyan-400" : "bg-gradient-to-br from-purple-600 to-cyan-500"
          }`}>
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="h-full w-full rounded-2xl object-cover" />
            ) : (
              profile.full_name?.charAt(0)?.toUpperCase() ?? "?"
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="truncate text-xl font-extrabold text-gray-900 dark:text-gray-100">
                {profile.full_name || "Unknown"}
              </h1>
              <UserRoleBadge role={profile.role} />
              <UserStatusBadge isVerified={profile.is_verified} />
            </div>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{profile.email}</p>
            {profile.headline && (
              <p className="mt-1 text-sm font-medium text-purple-600 dark:text-purple-400">{profile.headline}</p>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-2">
        {/* Profile Information */}
        <div className="space-y-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Profile Information</h2>

          <div className="space-y-4">
            <DetailRow label="Full Name" value={profile.full_name} />
            <DetailRow label="Username" value={`@${profile.username}`} />
            {profile.bio && <DetailRow label="Bio" value={profile.bio} />}
            {profile.country && (
              <DetailRow label="Location" value={[profile.city, profile.country].filter(Boolean).join(", ")} />
            )}
            {profile.website && (
              <DetailRow label="Website" value={profile.website} />
            )}
            {socialLinks.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-medium text-gray-400 dark:text-gray-500">Social Links</p>
                <div className="flex flex-wrap gap-2">
                  {socialLinks.map((link) => (
                    <span key={link.label} className="inline-flex items-center gap-1 rounded-lg bg-gray-100 dark:bg-gray-800 px-2.5 py-1 text-xs font-bold text-gray-600 dark:text-gray-400">
                      {link.icon}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Account Information */}
        <div className="space-y-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Account Information</h2>

          <div className="space-y-4">
            <DetailRow label="User ID" value={profile.id} mono />
            <DetailRow label="Email" value={profile.email} />
            <DetailRow
              label="Join Date"
              value={new Date(profile.created_at).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            />
            <DetailRow
              label="Last Updated"
              value={new Date(profile.updated_at).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            />
            <DetailRow
              label="Public Profile"
              value={profile.is_public ? "Yes" : "No"}
              valueColor={profile.is_public ? "text-emerald-600 dark:text-emerald-400" : "text-gray-500 dark:text-gray-400"}
            />
          </div>
        </div>
      </div>

      {/* Platform Statistics (creators only) */}
      {profile.role === "creator" && (
        <div className="border-t border-gray-100 dark:border-gray-800 p-6 sm:p-8">
          <h2 className="mb-5 text-sm font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Platform Statistics</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatBox label="Follower Count" value={profile.follower_count.toLocaleString()} icon={
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-3.835-1.06-4.342-2.215-.514-1.166.157-2.59 1.46-3.12a8.833 8.833 0 014.633-.395M15 8.25a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            } />
            <StatBox label="Platforms" value={profile.platforms.length > 0 ? profile.platforms.join(", ") : "None"} icon={
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
              </svg>
            } />
            <StatBox label="Niches" value={profile.niches.length > 0 ? profile.niches.slice(0, 3).join(", ") : "None"} icon={
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
              </svg>
            } />
            <StatBox label="Platforms Connected" value={socialLinks.length.toString()} icon={
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            } />
          </div>
        </div>
      )}
    </div>
  );
}

function DetailRow({
  label,
  value,
  mono,
  valueColor,
}: {
  label: string;
  value: string;
  mono?: boolean;
  valueColor?: string;
}) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-400 dark:text-gray-500">{label}</p>
      <p className={`mt-0.5 text-sm font-semibold text-gray-900 dark:text-gray-100 ${mono ? "font-mono text-xs" : ""} ${valueColor ?? ""}`}>
        {value}
      </p>
    </div>
  );
}

function StatBox({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 p-4">
      <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
        {icon}
      </div>
      <p className="text-lg font-extrabold text-gray-900 dark:text-gray-100 truncate">{value}</p>
      <p className="text-xs font-medium text-gray-400 dark:text-gray-500">{label}</p>
    </div>
  );
}
