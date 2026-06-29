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
      <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 py-16">
        <span className="text-4xl" aria-hidden="true">🎨</span>
        <p className="mt-4 text-base font-semibold text-slate-500">No creators have joined yet.</p>
        <p className="mt-1 text-sm text-slate-400">Be among the first to build your creator profile.</p>
        <Link
          href="/signup/role"
          className="mt-5 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-indigo-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
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
          className={`animate-fade-up animate-fade-up-delay-${Math.min(i + 1, 6)} group rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/10`}
          role="article"
        >
          {/* Avatar */}
          <div className="relative mx-auto mb-4 h-20 w-20">
            {creator.avatar_url ? (
              <img
                src={creator.avatar_url}
                alt={creator.full_name}
                className="h-full w-full rounded-full object-cover ring-2 ring-slate-200 ring-offset-2"
                loading="lazy"
              />
            ) : (
              <div
                className="flex h-full w-full items-center justify-center rounded-full bg-indigo-100 text-2xl font-bold text-indigo-600 ring-2 ring-slate-200 ring-offset-2"
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
          <h3 className="text-base font-bold text-slate-900">{creator.full_name}</h3>
          <p className="mt-0.5 text-xs text-slate-500">@{creator.username}</p>

          {/* Followers */}
          {creator.follower_count > 0 && (
            <p className="mt-3 text-base font-bold text-indigo-600">
              {formatFollowers(creator.follower_count)} followers
            </p>
          )}

          {/* Platforms */}
          {creator.platforms.length > 0 && (
            <div className="mt-3 flex flex-wrap justify-center gap-1.5">
              {creator.platforms.slice(0, 4).map((p) => (
                <span
                  key={p}
                  className="text-lg"
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
            <div className="mt-4 flex flex-wrap justify-center gap-1.5">
              {creator.niches.slice(0, 2).map((niche) => (
                <span
                  key={niche}
                  className="rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-semibold text-indigo-700"
                >
                  {niche}
                </span>
              ))}
            </div>
          )}

          {/* Country */}
          {creator.country && (
            <p className="mt-3 text-xs text-slate-400">{creator.country}</p>
          )}
        </div>
      ))}
    </>
  );
}
