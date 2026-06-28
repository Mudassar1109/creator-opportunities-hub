import { createClient, createServiceClient } from "@/lib/supabase/server";

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
  isCurrentUser: boolean;
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
  xpPerReferral: number;
}

const XP_PER_REFERRAL = 500;

const LEVELS: ReferralLevel[] = [
  { name: "Bronze", minXp: 0, maxXp: 99, icon: "🥉", color: "amber", requirements: "0+ XP" },
  { name: "Silver", minXp: 100, maxXp: 499, icon: "🥈", color: "gray", requirements: "100+ XP" },
  { name: "Gold", minXp: 500, maxXp: 1999, icon: "🥇", color: "yellow", requirements: "500+ XP" },
  { name: "Platinum", minXp: 2000, maxXp: 4999, icon: "💎", color: "cyan", requirements: "2,000+ XP" },
  { name: "Diamond", minXp: 5000, maxXp: 9999, icon: "🔷", color: "blue", requirements: "5,000+ XP" },
  { name: "Legend", minXp: 10000, maxXp: null, icon: "👑", color: "purple", requirements: "10,000+ XP" },
];

function getLevel(totalXp: number) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (totalXp >= LEVELS[i].minXp) {
      const nextLevel = LEVELS[i + 1];
      return {
        currentLevel: LEVELS[i].name,
        nextLevelXp: nextLevel?.minXp ?? null,
        nextLevelName: nextLevel?.name ?? null,
      };
    }
  }
  return {
    currentLevel: LEVELS[0].name,
    nextLevelXp: LEVELS[1].minXp,
    nextLevelName: LEVELS[1].name,
  };
}

function generateCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

async function ensureReferralCode(userId: string): Promise<string> {
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("referral_codes")
    .select("code")
    .eq("user_id", userId)
    .eq("is_active", true)
    .maybeSingle();

  if (existing) return existing.code;

  let code = generateCode();
  let attempts = 0;
  while (attempts < 10) {
    const { data: conflict } = await supabase
      .from("referral_codes")
      .select("id")
      .eq("code", code)
      .maybeSingle();

    if (!conflict) break;
    code = generateCode();
    attempts++;
  }

  const { error } = await supabase.from("referral_codes").insert({
    user_id: userId,
    code,
    is_active: true,
  });

  if (error) {
    const { data: fallback } = await supabase
      .from("referral_codes")
      .select("code")
      .eq("user_id", userId)
      .eq("is_active", true)
      .maybeSingle();

    if (fallback) return fallback.code;
    throw error;
  }

  return code;
}

export async function getReferralData(userId: string): Promise<ReferralData> {
  const supabase = await createClient();

  const referralCode = await ensureReferralCode(userId);
  const referralLink = `/ref/${referralCode}`;

  const { data: referralsList } = await supabase
    .from("referrals")
    .select("status, xp_earned")
    .eq("referrer_id", userId);

  const totalReferrals = referralsList?.length ?? 0;
  const successfulReferrals = referralsList?.filter(r => r.status === "completed").length ?? 0;
  const pendingReferrals = referralsList?.filter(r => r.status === "pending").length ?? 0;
  const conversionRate = totalReferrals > 0 ? Math.round((successfulReferrals / totalReferrals) * 100 * 10) / 10 : 0;

  const referralXp = referralsList
    ?.filter(r => r.status === "completed")
    .reduce((sum, r) => sum + r.xp_earned, 0) ?? 0;

  const { data: xpTransactions } = await supabase
    .from("xp_transactions")
    .select("xp_amount")
    .eq("user_id", userId);

  const transactionXp = xpTransactions?.reduce((sum, t) => sum + t.xp_amount, 0) ?? 0;
  const totalXp = Math.max(referralXp, transactionXp);

  const { currentLevel, nextLevelXp, nextLevelName } = getLevel(totalXp);

  const stats: ReferralStats = {
    totalReferrals,
    successfulReferrals,
    pendingReferrals,
    totalXp,
    currentLevel,
    conversionRate,
  };

  const [achievementsResult, userAchievementsResult] = await Promise.all([
    supabase.from("achievements").select("*").order("target_count", { ascending: true }),
    supabase.from("user_achievements").select("achievement_id").eq("user_id", userId),
  ]);

  const allAchievements = achievementsResult.data ?? [];
  let earnedIds = new Set(userAchievementsResult.data?.map(ua => ua.achievement_id) ?? []);

  const achievementsToUnlock = allAchievements.filter(
    a => !earnedIds.has(a.id) && successfulReferrals >= a.target_count
  );

  if (achievementsToUnlock.length > 0) {
    const newEntries = achievementsToUnlock.map(a => ({
      user_id: userId,
      achievement_id: a.id,
    }));

    const { error: insertError } = await supabase
      .from("user_achievements")
      .insert(newEntries);

    if (!insertError) {
      const xpRewardEntries = achievementsToUnlock.map(a => ({
        user_id: userId,
        xp_amount: a.xp_reward,
        reason: `Achievement unlocked: ${a.name}`,
      }));

      await supabase.from("xp_transactions").insert(xpRewardEntries);

      const { data: updatedUa } = await supabase
        .from("user_achievements")
        .select("achievement_id")
        .eq("user_id", userId);

      if (updatedUa) {
        earnedIds = new Set(updatedUa.map(ua => ua.achievement_id));
      }
    }
  }

  const achievements: Achievement[] = allAchievements.map(a => ({
    id: a.id,
    name: a.name,
    description: a.description,
    icon: a.icon || "🎯",
    progress: Math.min(successfulReferrals, a.target_count),
    target: a.target_count,
    earned: earnedIds.has(a.id),
    xpReward: a.xp_reward,
  }));

  const { data: leaderboardData } = await supabase
    .from("leaderboard")
    .select("*")
    .order("rank", { ascending: true })
    .limit(10);

  const leaderboardUserIds = [...new Set((leaderboardData ?? []).map(l => l.user_id))];

  const leaderboardProfilesMap = new Map<string, { full_name: string; avatar_url: string | null }>();
  if (leaderboardUserIds.length > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name, avatar_url")
      .in("id", leaderboardUserIds);

    if (profiles) {
      for (const p of profiles) {
        leaderboardProfilesMap.set(p.id, { full_name: p.full_name, avatar_url: p.avatar_url });
      }
    }
  }

  const leaderboard: LeaderboardEntry[] = (leaderboardData ?? [])
    .filter(l => l.rank !== null)
    .map(l => {
      const profile = leaderboardProfilesMap.get(l.user_id);
      const { currentLevel: level } = getLevel(l.total_xp);
      return {
        rank: l.rank!,
        name: profile?.full_name ?? "Unknown",
        avatarUrl: profile?.avatar_url ?? null,
        xp: l.total_xp,
        successfulReferrals: l.successful_refs,
        level,
        isCurrentUser: l.user_id === userId,
      };
    })
    .sort((a, b) => a.rank - b.rank);

  const { data: historyData } = await supabase
    .from("referrals")
    .select("id, referred_id, status, xp_earned, created_at")
    .eq("referrer_id", userId)
    .order("created_at", { ascending: false })
    .limit(20);

  const referredIds = [...new Set(historyData?.map(r => r.referred_id) ?? [])];

  const referredProfilesMap = new Map<string, { full_name: string; email: string; avatar_url: string | null; role: "creator" | "brand" }>();
  if (referredIds.length > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name, email, avatar_url, role")
      .in("id", referredIds);

    if (profiles) {
      for (const p of profiles) {
        referredProfilesMap.set(p.id, {
          full_name: p.full_name,
          email: p.email,
          avatar_url: p.avatar_url,
          role: p.role as "creator" | "brand",
        });
      }
    }
  }

  const history: ReferralHistoryEntry[] = (historyData ?? []).map(r => {
    const profile = referredProfilesMap.get(r.referred_id);
    return {
      id: r.id,
      name: profile?.full_name ?? "Unknown",
      email: profile?.email ?? "",
      avatarUrl: profile?.avatar_url ?? null,
      role: profile?.role ?? "creator",
      status: r.status as "pending" | "active" | "completed",
      joinedDate: r.created_at.split("T")[0],
      xpEarned: r.xp_earned,
    };
  });

  return {
    stats,
    referralCode,
    referralLink,
    levels: LEVELS,
    achievements,
    leaderboard,
    history,
    currentXp: totalXp,
    nextLevelXp,
    nextLevelName,
    xpPerReferral: XP_PER_REFERRAL,
  };
}

export interface ReferralLandingStats {
  activeCreators: number;
  brandPartners: number;
  activeOpportunities: number;
}

export async function getReferralLandingStats(): Promise<ReferralLandingStats> {
  const supabase = createServiceClient();

  const [{ count: creatorCount }, { count: brandCount }, { count: opportunityCount }] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "creator"),
    supabase.from("brands").select("*", { count: "exact", head: true }),
    supabase.from("opportunities").select("*", { count: "exact", head: true }).eq("status", "active"),
  ]);

  return {
    activeCreators: creatorCount ?? 0,
    brandPartners: brandCount ?? 0,
    activeOpportunities: opportunityCount ?? 0,
  };
}
