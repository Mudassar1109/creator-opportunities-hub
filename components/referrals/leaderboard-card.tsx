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
      <div className="space-y-2">
        {leaderboard.map((entry) => {
          const isYou = entry.name === "You";
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
    </div>
  );
}
