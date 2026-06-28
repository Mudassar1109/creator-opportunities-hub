"use server";

import { createClient, getUser } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { createNotification } from "./notifications";
import type { Database } from "@/lib/database.types";

// ─── Helper: format a raw conversation row into a summary ──
interface ConversationSummary {
  id: string;
  application_id: string;
  creator_id: string;
  brand_id: string;
  created_at: string;
  opportunity_title: string;
  other_party_name: string;
  other_party_avatar: string | null;
  last_message: string | null;
  last_message_time: string | null;
  unread_count: number;
}

interface ConversationRow {
  id: string;
  application_id: string;
  creator_id: string;
  brand_id: string;
  created_at: string;
  applications: {
    opportunity_id: string;
    opportunities: { title: string } | null;
    creator_id?: string;
    profiles?: { full_name: string; avatar_url: string | null } | null;
  } | null;
  brands: { company_name: string } | null;
  messages: {
    id: string;
    message: string;
    sender_id: string;
    is_read: boolean;
    created_at: string;
  }[];
}

async function formatConversation(
  conv: ConversationRow,
  userId: string
): Promise<ConversationSummary> {
  const msgs = conv.messages ?? [];
  const lastMsg = msgs.length > 0 ? msgs[msgs.length - 1] : null;
  const app = conv.applications;
  const opp = app?.opportunities;
  const brand = conv.brands;
  const profile = app?.profiles;

  const isCreator = conv.creator_id === userId;
  const otherName = isCreator
    ? brand?.company_name ?? "Brand"
    : profile?.full_name ?? "Creator";
  const otherAvatar = isCreator ? null : profile?.avatar_url ?? null;

  const unread_count = msgs.filter(
    (m) => m.sender_id !== userId && !m.is_read
  ).length;

  return {
    id: conv.id,
    application_id: conv.application_id,
    creator_id: conv.creator_id,
    brand_id: conv.brand_id,
    created_at: conv.created_at,
    opportunity_title: opp?.title ?? "Opportunity",
    other_party_name: otherName,
    other_party_avatar: otherAvatar,
    last_message: lastMsg?.message ?? null,
    last_message_time: lastMsg?.created_at ?? null,
    unread_count,
  };
}

// ─── Get formatted conversation summaries for the current user ──
export async function getUserConversations(): Promise<{
  data: ConversationSummary[] | null;
  error: string | null;
}> {
  const user = await getUser();
  if (!user) return { data: null, error: "Not authenticated" };

  const supabase = await createClient();

  const { data: creatorConvs, error: err1 } = await supabase
    .from("conversations")
    .select(
      `id, application_id, creator_id, brand_id, created_at,
       applications(opportunity_id, opportunities(title)),
       brands(company_name),
       messages(id, message, sender_id, is_read, created_at)`
    )
    .eq("creator_id", user.id)
    .order("created_at", { ascending: false });

  if (err1) return { data: null, error: err1.message };

  const { data: userBrands } = await supabase
    .from("brands")
    .select("id")
    .eq("user_id", user.id);

  const brandIds = userBrands?.map((b) => b.id) ?? [];
  let brandConvs: ConversationRow[] = [];
  if (brandIds.length > 0) {
    const { data, error: err2 } = await supabase
      .from("conversations")
      .select(
        `id, application_id, creator_id, brand_id, created_at,
         applications(opportunity_id, creator_id, opportunities(title), profiles(full_name, avatar_url)),
         brands(company_name),
         messages(id, message, sender_id, is_read, created_at)`
      )
      .in("brand_id", brandIds)
      .order("created_at", { ascending: false });
    if (err2) return { data: null, error: err2.message };
    brandConvs = data ?? [];
  }

  const allConvs = [...(creatorConvs ?? []), ...brandConvs];
  const seen = new Set<string>();
  const unique = allConvs.filter((c) => {
    if (seen.has(c.id)) return false;
    seen.add(c.id);
    return true;
  });

  const formatted = await Promise.all(
    unique.map((c) => formatConversation(c, user.id))
  );

  formatted.sort((a, b) => {
    const aTime = a.last_message_time ?? a.created_at;
    const bTime = b.last_message_time ?? b.created_at;
    return new Date(bTime).getTime() - new Date(aTime).getTime();
  });

  return { data: formatted, error: null };
}

// ─── Get user's conversations with last message ─────────────
export async function getConversations() {
  const user = await getUser();
  if (!user) return { data: null, error: "Not authenticated" };

  const supabase = await createClient();

  // Get conversations where user is creator or owns the brand
  const { data, error } = await supabase
    .from("conversations")
    .select(
      `*,
      applications!inner(opportunity_id, creator_id, opportunities(title, brand_id, brands(company_name, user_id))),
      messages(id, message, sender_id, created_at)`
    )
    .or(`creator_id.eq.${user.id},brand_id.in.(SELECT id FROM brands WHERE user_id = '${user.id}')`)
    .order("created_at", { ascending: false });

  if (error) {
    console.log("[getConversations] Error:", error.message);
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

// ─── Get messages for a specific conversation ────────────────
export async function getConversationMessages(conversationId: string) {
  const user = await getUser();
  if (!user) return { data: null, error: "Not authenticated" };

  const supabase = await createClient();

  // Verify user belongs to this conversation
  const { data: conv, error: convError } = await supabase
    .from("conversations")
    .select("id, creator_id, brand_id, brands(user_id)")
    .eq("id", conversationId)
    .single();

  if (convError || !conv) {
    return { data: null, error: "Conversation not found." };
  }

  const brand = conv.brands as unknown as { user_id: string } | null;
  const isCreator = conv.creator_id === user.id;
  const isBrand = brand?.user_id === user.id;

  if (!isCreator && !isBrand) {
    return { data: null, error: "You don't have access to this conversation." };
  }

  // Fetch messages
  const { data: messages, error: msgError } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (msgError) {
    console.log("[getConversationMessages] Error:", msgError.message);
    return { data: null, error: msgError.message };
  }

  return { data: messages, error: null };
}

// ─── Send a message in a conversation ────────────────────────
export async function sendMessage(
  conversationId: string,
  message: string
): Promise<{ success: boolean; error?: string }> {
  console.log("[sendMessage] Conversation ID:", conversationId);

  const user = await getUser();
  if (!user) {
    return { success: false, error: "You must be logged in." };
  }

  if (!message.trim()) {
    return { success: false, error: "Message cannot be empty." };
  }

  if (message.trim().length > 5000) {
    return { success: false, error: "Message is too long (max 5000 characters)." };
  }

  try {
    const supabase = await createClient();

    // Verify user belongs to this conversation
    const { data: conv, error: convError } = await supabase
      .from("conversations")
      .select("id, creator_id, brand_id, application_id, brands(user_id, company_name)")
      .eq("id", conversationId)
      .single();

    if (convError || !conv) {
      return { success: false, error: "Conversation not found." };
    }

    const brand = conv.brands as unknown as { user_id: string; company_name: string } | null;
    const isCreator = conv.creator_id === user.id;
    const isBrand = brand?.user_id === user.id;

    if (!isCreator && !isBrand) {
      console.log("[sendMessage] Permission denied. User:", user.id);
      return { success: false, error: "You don't have access to this conversation." };
    }

    // Insert the message
    const { error: msgError } = await supabase.from("messages").insert({
      conversation_id: conversationId,
      sender_id: user.id,
      message: message.trim(),
    });

    if (msgError) {
      console.log("[sendMessage] Insert error:", msgError.message);
      return { success: false, error: `Failed to send message: ${msgError.message}` };
    }

    console.log("[sendMessage] Message sent successfully");

    // Send notification to the other party
    if (isCreator) {
      // Creator sent message → notify brand user
      if (brand?.user_id) {
        await createNotification(
          brand.user_id,
          "New message",
          `You received a new message in your conversation.`,
          "message_received",
          `/dashboard/messages?conversation=${conversationId}`
        );
      }
    } else if (isBrand) {
      // Brand sent message → notify creator
      await createNotification(
        conv.creator_id,
        "New message",
        `You received a new message from ${brand?.company_name || "the brand"}.`,
        "message_received",
        `/dashboard/messages?conversation=${conversationId}`
      );
    }

    revalidatePath("/dashboard/messages");
    return { success: true };
  } catch (err) {
    console.log("[sendMessage] Exception:", err);
    return { success: false, error: "Failed to send message." };
  }
}
