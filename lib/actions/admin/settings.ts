"use server";

import { createServiceClient } from "@/lib/supabase/server";
import { getAdminUser } from "@/lib/supabase/server";
import type { Database } from "@/lib/database.types";

export interface PlatformSettings {
  siteName: string;
  logoUrl: string;
  faviconUrl: string;
  supportEmail: string;
  phone: string;
  address: string;
  creatorRegistrationOpen: boolean;
  brandRegistrationOpen: boolean;
  maintenanceMode: boolean;
  adminOnlyMode: boolean;
  replyEmail: string;
  notificationEmail: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  x: string;
  youtube: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  ogImage: string;
  referralEnabled: boolean;
  blogEnabled: boolean;
  notificationsEnabled: boolean;
}

function mapRowToSettings(row: Database["public"]["Tables"]["platform_settings"]["Row"]): PlatformSettings {
  return {
    siteName: row.site_name ?? "Creator Opportunities Hub",
    logoUrl: row.logo_url ?? "",
    faviconUrl: row.favicon_url ?? "",
    supportEmail: row.support_email ?? "",
    phone: row.phone ?? "",
    address: row.address ?? "",
    creatorRegistrationOpen: row.creator_registration_open ?? true,
    brandRegistrationOpen: row.brand_registration_open ?? true,
    maintenanceMode: row.maintenance_mode ?? false,
    adminOnlyMode: row.admin_only_mode ?? false,
    replyEmail: row.reply_email ?? "",
    notificationEmail: row.notification_email ?? "",
    facebook: row.facebook ?? "",
    instagram: row.instagram ?? "",
    linkedin: row.linkedin ?? "",
    x: row.x ?? "",
    youtube: row.youtube ?? "",
    metaTitle: row.meta_title ?? "",
    metaDescription: row.meta_description ?? "",
    keywords: row.keywords ?? "",
    ogImage: row.og_image ?? "",
    referralEnabled: row.referral_enabled ?? true,
    blogEnabled: row.blog_enabled ?? false,
    notificationsEnabled: row.notifications_enabled ?? true,
  };
}

const fallbackSettings: PlatformSettings = {
  siteName: "Creator Opportunities Hub",
  logoUrl: "",
  faviconUrl: "",
  supportEmail: "support@creatoropportunitieshub.com",
  phone: "+1 (555) 123-4567",
  address: "123 Creator Lane, Digital City, DC 10001",
  creatorRegistrationOpen: true,
  brandRegistrationOpen: true,
  maintenanceMode: false,
  adminOnlyMode: false,
  replyEmail: "noreply@creatoropportunitieshub.com",
  notificationEmail: "notifications@creatoropportunitieshub.com",
  facebook: "https://facebook.com/creatorhub",
  instagram: "https://instagram.com/creatorhub",
  linkedin: "https://linkedin.com/company/creatorhub",
  x: "https://x.com/creatorhub",
  youtube: "https://youtube.com/@creatorhub",
  metaTitle: "Creator Opportunities Hub",
  metaDescription: "Find paid partnerships, sponsorships, and collaborations between creators and brands.",
  keywords: "creator opportunities, brand deals, sponsorships, influencer marketing, UGC",
  ogImage: "",
  referralEnabled: true,
  blogEnabled: false,
  notificationsEnabled: true,
};

export async function getAdminSettings(): Promise<PlatformSettings> {
  const admin = await getAdminUser();
  if (!admin) return fallbackSettings;

  try {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("platform_settings")
      .select("*")
      .limit(1)
      .single();

    if (data) {
      return mapRowToSettings(data);
    }
  } catch {
    // fallback to hardcoded defaults
  }

  return fallbackSettings;
}

export async function saveAdminSettings(
  settings: Partial<PlatformSettings>
): Promise<{ success: boolean; error?: string }> {
  try {
    const admin = await getAdminUser();
    if (!admin) {
      return { success: false, error: "Unauthorized" };
    }

    const supabase = createServiceClient();

    const dbFields: Database["public"]["Tables"]["platform_settings"]["Update"] = {};
    if (settings.siteName !== undefined) dbFields.site_name = settings.siteName;
    if (settings.logoUrl !== undefined) dbFields.logo_url = settings.logoUrl;
    if (settings.faviconUrl !== undefined) dbFields.favicon_url = settings.faviconUrl;
    if (settings.supportEmail !== undefined) dbFields.support_email = settings.supportEmail;
    if (settings.phone !== undefined) dbFields.phone = settings.phone;
    if (settings.address !== undefined) dbFields.address = settings.address;
    if (settings.creatorRegistrationOpen !== undefined) dbFields.creator_registration_open = settings.creatorRegistrationOpen;
    if (settings.brandRegistrationOpen !== undefined) dbFields.brand_registration_open = settings.brandRegistrationOpen;
    if (settings.maintenanceMode !== undefined) dbFields.maintenance_mode = settings.maintenanceMode;
    if (settings.adminOnlyMode !== undefined) dbFields.admin_only_mode = settings.adminOnlyMode;
    if (settings.replyEmail !== undefined) dbFields.reply_email = settings.replyEmail;
    if (settings.notificationEmail !== undefined) dbFields.notification_email = settings.notificationEmail;
    if (settings.facebook !== undefined) dbFields.facebook = settings.facebook;
    if (settings.instagram !== undefined) dbFields.instagram = settings.instagram;
    if (settings.linkedin !== undefined) dbFields.linkedin = settings.linkedin;
    if (settings.x !== undefined) dbFields.x = settings.x;
    if (settings.youtube !== undefined) dbFields.youtube = settings.youtube;
    if (settings.metaTitle !== undefined) dbFields.meta_title = settings.metaTitle;
    if (settings.metaDescription !== undefined) dbFields.meta_description = settings.metaDescription;
    if (settings.keywords !== undefined) dbFields.keywords = settings.keywords;
    if (settings.ogImage !== undefined) dbFields.og_image = settings.ogImage;
    if (settings.referralEnabled !== undefined) dbFields.referral_enabled = settings.referralEnabled;
    if (settings.blogEnabled !== undefined) dbFields.blog_enabled = settings.blogEnabled;
    if (settings.notificationsEnabled !== undefined) dbFields.notifications_enabled = settings.notificationsEnabled;
    dbFields.updated_by = admin.user.id;

    const { error } = await supabase
      .from("platform_settings")
      .update(dbFields)
      .eq("id", (await supabase.from("platform_settings").select("id").limit(1).single()).data?.id ?? "");

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to save settings" };
  }
}
