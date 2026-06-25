import Link from "next/link";

interface TopCreator {
  id: string;
  full_name: string;
  username: string;
  avatar_url: string | null;
  follower_count: number;
  niches: string[];
  platforms: string[];
  country: string | null;
  is_verified: boolean;
}

function formatFollowers(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(0)}K`;
  return count.toString();
}

const PLATFORM_ICONS: Record<string, string> = {
  youtube: "📺",
  tiktok: "🎵",
  instagram: "📸",
  twitter: "🐦",
  linkedin: "💼",
  twitch: "🎮",
  podcast: "🎙️",
  blog: "✍️",
};

export function TopCreators({ creators }: { creators: TopCreator[] }) {
  if (creators.length === 0) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 py-16">
        <span className="text-4xl" aria-hidden="true">🎨</span>
        <p className="mt-4 text-base font-semibold text-gray-500">No creators have joined yet.</p>
        <p className="mt-1 text-sm text-gray-400">Be among the first to build your creator profile.</p>
        <Link
          href="/signup/role"
          className="mt-5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-purple-500/20 transition hover:shadow-lg"
        >
          Join as a Creator
        </Link>
      </div>
    );
  }

  return (
    <>
      {creators.map((creator, i) => (
        <div
          key={creator.id}
          className={`animate-fade-up animate-fade-up-delay-${Math.min(i + 1, 6)} glass-card-light bento-glow group rounded-2xl p-5 text-center`}
          role="article"
        >
          {/* Avatar */}
          <div className="relative mx-auto mb-3 h-16 w-16">
            {creator.avatar_url ? (
              <img
                src={creator.avatar_url}
                alt={creator.full_name}
                className="h-full w-full rounded-full object-cover ring-2 ring-purple-200 ring-offset-2"
                loading="lazy"
              />
            ) : (
              <div
                className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 text-xl font-bold text-white ring-2 ring-purple-200 ring-offset-2"
                aria-hidden="true"
              >
                {creator.full_name[0]?.toUpperCase() ?? "?"}
              </div>
            )}
            {creator.is_verified && (
              <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 ring-2 ring-white">
                <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20" aria-label="Verified creator">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </div>

          {/* Name */}
          <h3 className="text-sm font-bold text-gray-900">{creator.full_name}</h3>
          <p className="text-xs text-gray-500">@{creator.username}</p>

          {/* Followers */}
          {creator.follower_count > 0 && (
            <p className="mt-2 text-sm font-bold text-purple-600">
              {formatFollowers(creator.follower_count)} followers
            </p>
          )}

          {/* Platforms */}
          {creator.platforms.length > 0 && (
            <div className="mt-2 flex flex-wrap justify-center gap-1">
              {creator.platforms.slice(0, 4).map((p) => (
                <span
                  key={p}
                  className="text-base"
                  title={p}
                  aria-label={p}
                >
                  {PLATFORM_ICONS[p.toLowerCase()] ?? "🌐"}
                </span>
              ))}
            </div>
          )}

          {/* Niches */}
          {creator.niches.length > 0 && (
            <div className="mt-3 flex flex-wrap justify-center gap-1.5">
              {creator.niches.slice(0, 2).map((niche) => (
                <span
                  key={niche}
                  className="rounded-full bg-purple-50 px-2.5 py-0.5 text-[10px] font-semibold text-purple-700"
                >
                  {niche}
                </span>
              ))}
            </div>
          )}

          {/* Country */}
          {creator.country && (
            <p className="mt-2 text-xs text-gray-400">{creator.country}</p>
          )}
        </div>
      ))}
    </>
  );
}
