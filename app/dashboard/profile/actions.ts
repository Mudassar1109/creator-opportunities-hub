"use server";

/**
 * Profile server actions for Creator Opportunities Hub
 *
 * Handles:
 *   1. Saving/updating profile data (upsert into profiles table)
 *   2. Uploading profile image to Supabase Storage
 */

import { createClient, getUser } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// ─── Types ──────────────────────────────────────────────────

export interface ProfileFormData {
  full_name: string;
  username: string;
  headline: string;
  bio: string;
  country: string;
  city: string;
  website: string;
  platforms: string[];
  niches: string[];
  follower_count: number;
  youtube_url: string;
  tiktok_url: string;
  instagram_url: string;
  twitter_url: string;
  linkedin_url: string;
  is_public: boolean;
}

export interface ActionResult {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
}

// ─── Validation ─────────────────────────────────────────────

function validateUrl(url: string): boolean {
  if (!url) return true; // empty is OK
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function validate(data: ProfileFormData): Record<string, string> | null {
  const errors: Record<string, string> = {};

  if (!data.full_name.trim()) {
    errors.full_name = "Full name is required";
  } else if (data.full_name.trim().length < 2) {
    errors.full_name = "Full name must be at least 2 characters";
  }

  if (!data.username.trim()) {
    errors.username = "Username is required";
  } else if (!/^[a-zA-Z0-9_-]+$/.test(data.username)) {
    errors.username = "Username can only contain letters, numbers, hyphens, and underscores";
  }

  if (data.headline && data.headline.length > 120) {
    errors.headline = "Headline must be 120 characters or less";
  }

  if (data.bio && data.bio.length > 1000) {
    errors.bio = "Bio must be 1000 characters or less";
  }

  if (data.follower_count < 0) {
    errors.follower_count = "Follower count cannot be negative";
  }

  const urlFields = ["website", "youtube_url", "tiktok_url", "instagram_url", "twitter_url", "linkedin_url"] as const;
  for (const field of urlFields) {
    if (data[field] && !validateUrl(data[field])) {
      errors[field] = "Please enter a valid URL";
    }
  }

  return Object.keys(errors).length > 0 ? errors : null;
}

// ─── Save Profile ───────────────────────────────────────────

export async function saveProfile(data: ProfileFormData): Promise<ActionResult> {
  const user = await getUser();
  if (!user) {
    return { success: false, error: "You must be logged in to save your profile" };
  }

  // Validate
  const fieldErrors = validate(data);
  if (fieldErrors) {
    return { success: false, error: "Please fix the errors below", fieldErrors };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("profiles")
    .upsert(
      {
        id: user.id,
        full_name: data.full_name.trim(),
        username: data.username.trim().toLowerCase(),
        email: user.email ?? "",
        headline: data.headline.trim() || null,
        bio: data.bio.trim() || null,
        country: data.country.trim() || null,
        city: data.city.trim() || null,
        website: data.website.trim() || null,
        platforms: data.platforms,
        niches: data.niches,
        follower_count: data.follower_count || 0,
        youtube_url: data.youtube_url.trim() || null,
        tiktok_url: data.tiktok_url.trim() || null,
        instagram_url: data.instagram_url.trim() || null,
        twitter_url: data.twitter_url.trim() || null,
        linkedin_url: data.linkedin_url.trim() || null,
        is_public: data.is_public,
      },
      { onConflict: "id" }
    );

  if (error) {
    if (error.code === "23505") {
      return {
        success: false,
        error: "Username is already taken",
        fieldErrors: { username: "This username is already taken" },
      };
    }
    return { success: false, error: `Failed to save profile: ${error.message}` };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/profile");
  return { success: true };
}

// ─── Upload Avatar ──────────────────────────────────────────

export async function uploadAvatar(
  formData: FormData
): Promise<{ success: boolean; avatarUrl?: string; error?: string }> {
  const user = await getUser();
  if (!user) {
    return { success: false, error: "You must be logged in" };
  }

  const file = formData.get("avatar") as File | null;
  if (!file) {
    return { success: false, error: "No file provided" };
  }

  // Validate file type
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowedTypes.includes(file.type)) {
    return { success: false, error: "Only JPG, PNG, WebP, and GIF files are allowed" };
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    return { success: false, error: "File must be smaller than 5MB" };
  }

  const supabase = await createClient();

  // Upload to storage
  const ext = file.name.split(".").pop() || "jpg";
  const filePath = `${user.id}/avatar.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (uploadError) {
    return { success: false, error: `Upload failed: ${uploadError.message}` };
  }

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from("avatars").getPublicUrl(filePath);

  // Update profile with avatar URL
  const { error: updateError } = await supabase
    .from("profiles")
    .update({ avatar_url: publicUrl })
    .eq("id", user.id);

  if (updateError) {
    return { success: false, error: `Failed to update avatar: ${updateError.message}` };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/profile");
  return { success: true, avatarUrl: publicUrl };
}
