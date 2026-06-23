import { createClient } from "@/lib/supabase/client";

/**
 * Get application badge count for a user
 * - For Brands: count of pending applications
 * - For Creators: count of applications with status changes (accepted/rejected/reviewed)
 */
export async function getApplicationBadgeCount(userId: string, userRole: "creator" | "brand"): Promise<number> {
  const supabase = createClient();

  if (userRole === "brand") {
    // Brand: count pending applications for their opportunities
    const { data: userBrands } = await supabase
      .from("brands")
      .select("id")
      .eq("user_id", userId);

    const brandIds = userBrands?.map((b) => b.id) ?? [];

    if (brandIds.length === 0) return 0;

    const { data: opportunities } = await supabase
      .from("opportunities")
      .select("id")
      .in("brand_id", brandIds);

    const opportunityIds = opportunities?.map((o) => o.id) ?? [];

    if (opportunityIds.length === 0) return 0;

    const { count } = await supabase
      .from("applications")
      .select("*", { count: "exact", head: true })
      .in("opportunity_id", opportunityIds)
      .eq("status", "pending");

    return count ?? 0;
  } else {
    // Creator: count applications with status changes (accepted/rejected/under_review)
    const { count } = await supabase
      .from("applications")
      .select("*", { count: "exact", head: true })
      .eq("creator_id", userId)
      .in("status", ["accepted", "rejected", "under_review"]);

    return count ?? 0;
  }
}
