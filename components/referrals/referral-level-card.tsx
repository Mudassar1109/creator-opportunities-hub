import type { ReferralLevel } from "@/lib/actions/referrals";

interface Props {
  levels: ReferralLevel[];
  currentXp: number;
  currentLevel: string;
  nextLevelXp: number | null;
  nextLevelName: string | null;
}

const colorMap: Record<string, string> = {
  amber: "text-amber-500 dark:text-amber-400",
  gray: "text-gray-400 dark:text-gray-500",
  yellow: "text-yellow-500 dark:text-yellow-400",
  cyan: "text-cyan-500 dark:text-cyan-400",
  blue: "text-blue-500 dark:text-blue-400",
  purple: "text-purple-500 dark:text-purple-400",
};

const bgColorMap: Record<string, string> = {
  amber: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800",
  gray: "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700",
  yellow: "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800",
  cyan: "bg-cyan-50 dark:bg-cyan-900/20 border-cyan-200 dark:border-cyan-800",
  blue: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
  purple: "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800",
};

export function ReferralLevelCard({ levels, currentXp, currentLevel, nextLevelXp, nextLevelName }: Props) {
  const progressPercent = nextLevelXp
    ? Math.min(Math.round((currentXp / nextLevelXp) * 100), 100)
    : 100;

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
      <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-4">Referral Levels</h2>

      {nextLevelName && (
        <div className="mb-4 rounded-xl bg-gradient-to-r from-purple-50 to-cyan-50 dark:from-purple-900/10 dark:to-cyan-900/10 border border-purple-100 dark:border-purple-900/30 p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Current Level</span>
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400">{currentLevel}</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Next: {nextLevelName}</span>
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              {currentXp.toLocaleString()} / {nextLevelXp?.toLocaleString()} XP
            </span>
          </div>
          <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      <div className="space-y-2">
        {levels.map((level) => {
          const isCurrent = level.name === currentLevel;
          const isUnlocked = level.maxXp === null || currentXp >= level.minXp;
          const isNext = level.name === nextLevelName;

          return (
            <div
              key={level.name}
              className={`flex items-center gap-3 rounded-xl border p-3 transition-all ${
                isCurrent
                  ? "border-purple-300 dark:border-purple-700 bg-purple-50 dark:bg-purple-900/20"
                  : isNext
                  ? "border-cyan-200 dark:border-cyan-800 bg-cyan-50 dark:bg-cyan-900/10"
                  : isUnlocked
                  ? "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
                  : "border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/30 opacity-60"
              }`}
            >
              <span className={`flex h-9 w-9 items-center justify-center rounded-lg text-lg ${bgColorMap[level.color] || ""}`}>
                {level.icon}
              </span>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold ${isCurrent ? "text-purple-700 dark:text-purple-300" : "text-gray-900 dark:text-gray-100"}`}>
                  {level.name}
                  {isCurrent && " (Current)"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{level.requirements}</p>
              </div>
              {isUnlocked && (
                <svg className="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              )}
              {!isUnlocked && (
                <svg className="h-4 w-4 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
