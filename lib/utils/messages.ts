import { createClient } from "@/lib/supabase/client";

/**
 * Get unread message count for a user
 * Counts messages where sender_id != current user and is_read = false
 */
export async function getUnreadMessageCount(userId: string): Promise<number> {
  const supabase = createClient();

  // Get conversations where user is creator
  const { data: creatorConvs } = await supabase
    .from("conversations")
    .select("id")
    .eq("creator_id", userId);

  // Get conversations where user owns the brand
  const { data: userBrands } = await supabase
    .from("brands")
    .select("id")
    .eq("user_id", userId);

  const brandIds = userBrands?.map((b) => b.id) ?? [];

  let brandConvs: { id: string }[] = [];
  if (brandIds.length > 0) {
    const { data } = await supabase
      .from("conversations")
      .select("id")
      .in("brand_id", brandIds);
    brandConvs = data ?? [];
  }

  const allConvIds = [
    ...(creatorConvs?.map((c) => c.id) ?? []),
    ...brandConvs.map((c) => c.id),
  ];

  if (allConvIds.length === 0) return 0;

  // Count unread messages (not sent by current user)
  const { count } = await supabase
    .from("messages")
    .select("*", { count: "exact", head: true })
    .in("conversation_id", allConvIds)
    .neq("sender_id", userId)
    .eq("is_read", false);

  return count ?? 0;
}

/**
 * Mark all messages in a conversation as read for the current user
 */
export async function markConversationRead(conversationId: string): Promise<void> {
  const supabase = createClient();

  await supabase
    .from("messages")
    .update({ is_read: true })
    .eq("conversation_id", conversationId);
}
