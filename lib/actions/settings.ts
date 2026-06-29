"use server";

import { createServiceClient, getUser } from "@/lib/supabase/server";

export async function deleteAccount(): Promise<{
  success: boolean;
  error?: string;
}> {
  const user = await getUser();
  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    const supabase = createServiceClient();
    const { error } = await supabase.auth.admin.deleteUser(user.id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to delete account",
    };
  }
}
