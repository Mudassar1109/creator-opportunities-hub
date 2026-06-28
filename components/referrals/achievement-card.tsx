import type { Achievement } from "@/lib/actions/referrals";

interface Props {
  achievements: Achievement[];
}

export function AchievementCard({ achievements }: Props) {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
      <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-4">Achievements</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {achievements.map((achievement) => {
          const progressPercent = Math.min(Math.round((achievement.progress / achievement.target) * 100), 100);

          return (
            <div
              key={achievement.id}
              className={`rounded-xl border p-4 transition-all ${
                achievement.earned
                  ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/10"
                  : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/30"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white dark:bg-gray-800 text-lg shadow-sm">
                  {achievement.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={`text-sm font-semibold ${
                      achievement.earned ? "text-emerald-700 dark:text-emerald-300" : "text-gray-900 dark:text-gray-100"
                    }`}>
                      {achievement.name}
                    </p>
                    {achievement.earned && (
                      <span className="inline-flex items-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">
                        +{achievement.xpReward} XP
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{achievement.description}</p>
                  {!achievement.earned && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400">
                          {achievement.progress}/{achievement.target}
                        </span>
                        <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400">{progressPercent}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-purple-500 transition-all"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
