"use server";

import { createClient, getUser } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { createNotification } from "./notifications";

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
