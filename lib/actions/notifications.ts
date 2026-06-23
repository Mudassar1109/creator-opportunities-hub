"use server";

import { createClient, getUser } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { NotificationType } from "@/lib/database.types";

// ─── Internal helper: create a notification ─────────────────
// Uses SECURITY DEFINER function to create notifications for other users
export async function createNotification(
  userId: string,
  title: string,
  message: string,
  type: NotificationType,
  link?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    // Use SECURITY DEFINER function to bypass RLS (allows notifying other users)
    const { error } = await supabase.rpc("create_notification", {
      p_user_id: userId,
      p_title: title,
      p_message: message,
      p_type: type,
      p_link: link || null,
    });

    if (error) {
      console.log("[createNotification] Error:", error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.log("[createNotification] Exception:", err);
    return { success: false, error: "Failed to create notification." };
  }
}

// ─── Get user's notifications ────────────────────────────────
export async function getNotifications(limit = 20) {
  const user = await getUser();
  if (!user) return { data: null, error: "Not authenticated" };

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.log("[getNotifications] Error:", error.message);
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

// ─── Get unread notification count ───────────────────────────
export async function getUnreadNotificationCount() {
  const user = await getUser();
  if (!user) return { count: 0 };

  const supabase = await createClient();

  const { count, error } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("is_read", false);

  if (error) {
    console.log("[getUnreadNotificationCount] Error:", error.message);
    return { count: 0 };
  }

  return { count: count ?? 0 };
}

// ─── Mark a single notification as read ──────────────────────
export async function markNotificationAsRead(
  notificationId: string
): Promise<{ success: boolean; error?: string }> {
  const user = await getUser();
  if (!user) return { success: false, error: "Not authenticated" };

  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notificationId)
      .eq("user_id", user.id); // ownership check

    if (error) {
      console.log("[markNotificationAsRead] Error:", error.message);
      return { success: false, error: error.message };
    }

    revalidatePath("/dashboard/notifications");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (err) {
    console.log("[markNotificationAsRead] Exception:", err);
    return { success: false, error: "Failed to mark notification as read." };
  }
}

// ─── Mark all notifications as read ──────────────────────────
export async function markAllNotificationsAsRead(): Promise<{
  success: boolean;
  error?: string;
}> {
  const user = await getUser();
  if (!user) return { success: false, error: "Not authenticated" };

  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", user.id)
      .eq("is_read", false);

    if (error) {
      console.log("[markAllNotificationsAsRead] Error:", error.message);
      return { success: false, error: error.message };
    }

    revalidatePath("/dashboard/notifications");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (err) {
    console.log("[markAllNotificationsAsRead] Exception:", err);
    return { success: false, error: "Failed to mark all as read." };
  }
}
