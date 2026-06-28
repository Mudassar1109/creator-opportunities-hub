import type { ReferralData } from "@/lib/actions/referrals";
import { ReferralLinkCard } from "./referral-link-card";
import { ReferralStats } from "./referral-stats";
import { ReferralLevelCard } from "./referral-level-card";
import { AchievementCard } from "./achievement-card";
import { LeaderboardCard } from "./leaderboard-card";
import { ReferralHistoryTable } from "./referral-history-table";
import { InviteCard } from "./invite-card";

interface Props {
  data: ReferralData;
}

export function ReferralOverview({ data }: Props) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <ReferralLinkCard code={data.referralCode} link={data.referralLink} />
        <ReferralStats stats={data.stats} />
        <AchievementCard achievements={data.achievements} />
        <ReferralHistoryTable history={data.history} />
      </div>
      <div className="space-y-6">
        <ReferralLevelCard
          levels={data.levels}
          currentXp={data.currentXp}
          currentLevel={data.stats.currentLevel}
          nextLevelXp={data.nextLevelXp}
          nextLevelName={data.nextLevelName}
        />
        <LeaderboardCard leaderboard={data.leaderboard} />
        <InviteCard referralLink={data.referralLink} referralCode={data.referralCode} xpPerReferral={data.xpPerReferral} />
      </div>
    </div>
  );
}
