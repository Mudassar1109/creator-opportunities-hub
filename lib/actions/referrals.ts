export interface ReferralStats {
  totalReferrals: number;
  successfulReferrals: number;
  pendingReferrals: number;
  totalXp: number;
  currentLevel: string;
  conversionRate: number;
}

export interface ReferralLevel {
  name: string;
  minXp: number;
  maxXp: number | null;
  icon: string;
  color: string;
  requirements: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  progress: number;
  target: number;
  earned: boolean;
  xpReward: number;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  avatarUrl: string | null;
  xp: number;
  successfulReferrals: number;
  level: string;
}

export interface ReferralHistoryEntry {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  role: "creator" | "brand";
  status: "pending" | "active" | "completed";
  joinedDate: string;
  xpEarned: number;
}

export interface ReferralData {
  stats: ReferralStats;
  referralCode: string;
  referralLink: string;
  levels: ReferralLevel[];
  achievements: Achievement[];
  leaderboard: LeaderboardEntry[];
  history: ReferralHistoryEntry[];
  currentXp: number;
  nextLevelXp: number | null;
  nextLevelName: string | null;
}

export async function getReferralData(): Promise<ReferralData> {
  const stats: ReferralStats = {
    totalReferrals: 27,
    successfulReferrals: 18,
    pendingReferrals: 9,
    totalXp: 4250,
    currentLevel: "Gold",
    conversionRate: 66.7,
  };

  const levels: ReferralLevel[] = [
    { name: "Bronze", minXp: 0, maxXp: 99, icon: "🥉", color: "amber", requirements: "0+ XP" },
    { name: "Silver", minXp: 100, maxXp: 499, icon: "🥈", color: "gray", requirements: "100+ XP" },
    { name: "Gold", minXp: 500, maxXp: 1999, icon: "🥇", color: "yellow", requirements: "500+ XP" },
    { name: "Platinum", minXp: 2000, maxXp: 4999, icon: "💎", color: "cyan", requirements: "2,000+ XP" },
    { name: "Diamond", minXp: 5000, maxXp: 9999, icon: "🔷", color: "blue", requirements: "5,000+ XP" },
    { name: "Legend", minXp: 10000, maxXp: null, icon: "👑", color: "purple", requirements: "10,000+ XP" },
  ];

  const achievements: Achievement[] = [
    { id: "first", name: "First Referral", description: "Refer your first user", icon: "🎯", progress: 1, target: 1, earned: true, xpReward: 100 },
    { id: "invite-10", name: "Invite 10 Users", description: "Refer 10 users to the platform", icon: "🌟", progress: 10, target: 10, earned: true, xpReward: 250 },
    { id: "invite-25", name: "Invite 25 Users", description: "Refer 25 users to the platform", icon: "🔥", progress: 18, target: 25, earned: false, xpReward: 500 },
    { id: "invite-50", name: "Invite 50 Users", description: "Refer 50 users to the platform", icon: "💫", progress: 18, target: 50, earned: false, xpReward: 1000 },
    { id: "invite-100", name: "Invite 100 Users", description: "Refer 100 users to the platform", icon: "🏆", progress: 18, target: 100, earned: false, xpReward: 2500 },
    { id: "invite-500", name: "Invite 500 Users", description: "Refer 500 users to the platform", icon: "👑", progress: 18, target: 500, earned: false, xpReward: 10000 },
  ];

  const leaderboard: LeaderboardEntry[] = [
    { rank: 1, name: "Alex Rivera", avatarUrl: null, xp: 15200, successfulReferrals: 48, level: "Legend" },
    { rank: 2, name: "Sarah Chen", avatarUrl: null, xp: 12100, successfulReferrals: 36, level: "Legend" },
    { rank: 3, name: "Marcus Johnson", avatarUrl: null, xp: 8900, successfulReferrals: 29, level: "Diamond" },
    { rank: 4, name: "Emily Watson", avatarUrl: null, xp: 7200, successfulReferrals: 24, level: "Diamond" },
    { rank: 5, name: "David Kim", avatarUrl: null, xp: 5800, successfulReferrals: 19, level: "Diamond" },
    { rank: 6, name: "You", avatarUrl: null, xp: 4250, successfulReferrals: 18, level: "Gold" },
    { rank: 7, name: "Lisa Thompson", avatarUrl: null, xp: 3900, successfulReferrals: 15, level: "Platinum" },
    { rank: 8, name: "James Brown", avatarUrl: null, xp: 2800, successfulReferrals: 12, level: "Platinum" },
    { rank: 9, name: "Amanda Garcia", avatarUrl: null, xp: 1900, successfulReferrals: 8, level: "Gold" },
    { rank: 10, name: "Chris Martinez", avatarUrl: null, xp: 1100, successfulReferrals: 5, level: "Gold" },
  ];

  const history: ReferralHistoryEntry[] = [
    { id: "1", name: "Olivia Parker", email: "olivia@example.com", avatarUrl: null, role: "creator", status: "completed", joinedDate: "2026-06-25", xpEarned: 500 },
    { id: "2", name: "Ethan Brooks", email: "ethan@example.com", avatarUrl: null, role: "brand", status: "completed", joinedDate: "2026-06-23", xpEarned: 750 },
    { id: "3", name: "Sophia Adams", email: "sophia@example.com", avatarUrl: null, role: "creator", status: "active", joinedDate: "2026-06-20", xpEarned: 200 },
    { id: "4", name: "Liam Foster", email: "liam@example.com", avatarUrl: null, role: "brand", status: "completed", joinedDate: "2026-06-18", xpEarned: 750 },
    { id: "5", name: "Isabella Reed", email: "isabella@example.com", avatarUrl: null, role: "creator", status: "active", joinedDate: "2026-06-15", xpEarned: 200 },
    { id: "6", name: "Noah Mitchell", email: "noah@example.com", avatarUrl: null, role: "brand", status: "completed", joinedDate: "2026-06-12", xpEarned: 750 },
    { id: "7", name: "Mia Cooper", email: "mia@example.com", avatarUrl: null, role: "creator", status: "pending", joinedDate: "2026-06-10", xpEarned: 0 },
    { id: "8", name: "Lucas Hayes", email: "lucas@example.com", avatarUrl: null, role: "brand", status: "active", joinedDate: "2026-06-08", xpEarned: 200 },
    { id: "9", name: "Ava Morgan", email: "ava@example.com", avatarUrl: null, role: "creator", status: "completed", joinedDate: "2026-06-05", xpEarned: 500 },
    { id: "10", name: "Jackson Lee", email: "jackson@example.com", avatarUrl: null, role: "brand", status: "completed", joinedDate: "2026-06-03", xpEarned: 750 },
  ];

  return {
    stats,
    referralCode: "CREATOR2026",
    referralLink: "https://creatorhub.com/ref/CREATOR2026",
    levels,
    achievements,
    leaderboard,
    history,
    currentXp: 4250,
    nextLevelXp: 4999,
    nextLevelName: "Platinum",
  };
}
