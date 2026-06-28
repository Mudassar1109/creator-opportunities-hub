import type { LeaderboardEntry } from "@/lib/actions/referrals";

interface Props {
  leaderboard: LeaderboardEntry[];
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const rankColors: Record<number, string> = {
  1: "text-yellow-500",
  2: "text-gray-400",
  3: "text-amber-600",
};

export function LeaderboardCard({ leaderboard }: Props) {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100">Leaderboard</h2>
        <span className="text-xs text-gray-500 dark:text-gray-400">Top 10</span>
      </div>
      {leaderboard.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-cyan-50 dark:bg-cyan-900/20 mb-4">
            <svg className="h-7 w-7 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">No leaderboard data yet</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center max-w-xs">
            The leaderboard will populate as users start earning XP through referrals.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {leaderboard.map((entry) => {
            const isYou = entry.isCurrentUser;
            const rankIcon = rankColors[entry.rank];

            return (
              <div
                key={entry.rank}
                className={`flex items-center gap-3 rounded-xl p-2.5 transition-all ${
                  isYou
                    ? "bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800"
                    : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                }`}
              >
                <div className={`flex h-7 w-7 items-center justify-center rounded-lg text-sm font-bold ${
                  rankIcon ? `${rankIcon}` : "text-gray-500 dark:text-gray-400"
                }`}>
                  {entry.rank <= 3 ? (
                    <span className={rankIcon}>
                      {entry.rank === 1 ? "🥇" : entry.rank === 2 ? "🥈" : "🥉"}
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">#{entry.rank}</span>
                  )}
                </div>
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30 text-[10px] font-bold text-purple-700 dark:text-purple-300">
                  {getInitials(entry.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${isYou ? "text-purple-700 dark:text-purple-300" : "text-gray-900 dark:text-gray-100"}`}>
                    {entry.name}
                    {isYou && " (You)"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{entry.level}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{entry.xp.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{entry.successfulReferrals} refs</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
