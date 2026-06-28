import type { Achievement } from "@/lib/actions/referrals";

interface Props {
  achievements: Achievement[];
}

export function AchievementCard({ achievements }: Props) {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
      <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-4">Achievements</h2>
      {achievements.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 dark:bg-amber-900/20 mb-4">
            <svg className="h-7 w-7 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0016.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.023 6.023 0 01-2.77.896m0 0a6.023 6.023 0 01-2.77-.896m0 0A6.004 6.004 0 005.25 4.5" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">No achievements available</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center max-w-xs">
            Achievements will appear here once they are configured on the platform.
          </p>
        </div>
      ) : (
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
      )}
    </div>
  );
}
