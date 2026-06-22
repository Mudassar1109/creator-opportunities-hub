"use server";

import { createClient, getUser } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { ApplicationStatus } from "@/lib/database.types";
import { createNotification } from "./notifications";

export interface SubmitApplicationResult {
  success: boolean;
  error?: string;
  applicationId?: string;
}

export async function submitApplication(
  opportunityId: string,
  coverLetter: string,
  portfolioUrl: string
): Promise<SubmitApplicationResult> {
  const user = await getUser();
  if (!user) return { success: false, error: "You must be logged in to apply." };

  if (!coverLetter.trim()) {
    return { success: false, error: "Cover letter is required." };
  }

  const supabase = await createClient();

  // Verify profile exists
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name")
    .eq("id", user.id)
    .single();

  if (!profile?.full_name) {
    return { success: false, error: "Please complete your profile before applying." };
  }

  // Verify opportunity exists and is active
  const { data: opp } = await supabase
    .from("opportunities")
    .select("id, status, title, slug")
    .eq("id", opportunityId)
    .single();

  if (!opp) return { success: false, error: "Opportunity not found." };
  if (opp.status !== "active") return { success: false, error: "This opportunity is no longer accepting applications." };

  // Check for duplicate application
  const { data: existing } = await supabase
    .from("applications")
    .select("id")
    .eq("opportunity_id", opportunityId)
    .eq("creator_id", user.id)
    .maybeSingle();

  if (existing) {
    return { success: false, error: "You have already applied to this opportunity." };
  }

  // Validate portfolio URL if provided
  if (portfolioUrl) {
    try { new URL(portfolioUrl); } catch {
      return { success: false, error: "Please enter a valid portfolio URL." };
    }
  }

  // Insert application
  const { data: application, error } = await supabase
    .from("applications")
    .insert({
      opportunity_id: opportunityId,
      creator_id: user.id,
      cover_letter: coverLetter.trim(),
      portfolio_links: portfolioUrl ? [portfolioUrl.trim()] : [],
      status: "pending",
    })
    .select("id")
    .single();

  if (error) {
    return { success: false, error: `Failed to submit application: ${error.message}` };
  }

  // applications_count is auto-incremented by the trg_app_insert trigger

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/applications");
  revalidatePath(`/opportunities/${opp.slug}`);

  // Notify brand owner about new application
  const { data: brandInfo } = await supabase
    .from("opportunities")
    .select("brand_id, brands(user_id, company_name)")
    .eq("id", opportunityId)
    .single();

  if (brandInfo) {
    const brandData = brandInfo.brands as unknown as { user_id: string; company_name: string } | null;
    if (brandData?.user_id) {
      await createNotification(
        brandData.user_id,
        "New application received",
        `A creator has applied to your opportunity "${opp.title}".`,
        "application_submitted",
        `/dashboard/opportunities/${opportunityId}/applicants`
      );
    }
  }

  return { success: true, applicationId: application.id };
}

export async function updateApplicationStatus(
  applicationId: string,
  status: ApplicationStatus
): Promise<{ success: boolean; error?: string }> {
  console.log("[updateApplicationStatus] Application ID:", applicationId);
  console.log("[updateApplicationStatus] New Status:", status);

  const user = await getUser();
  if (!user) {
    console.log("[updateApplicationStatus] Error: User not logged in");
    return { success: false, error: "You must be logged in." };
  }

  console.log("[updateApplicationStatus] User ID:", user.id);

  const supabase = await createClient();

  // Get the application and verify the brand owns the opportunity
  const { data: app, error: fetchError } = await supabase
    .from("applications")
    .select("id, opportunity_id, creator_id, opportunities(title, brand_id, brands(user_id, company_name))")
    .eq("id", applicationId)
    .single();

  if (fetchError) {
    console.log("[updateApplicationStatus] Fetch error:", fetchError);
    return { success: false, error: `Failed to fetch application: ${fetchError.message}` };
  }

  if (!app) {
    console.log("[updateApplicationStatus] Error: Application not found");
    return { success: false, error: "Application not found." };
  }

  console.log("[updateApplicationStatus] Application data:", JSON.stringify(app, null, 2));

  const opp = app.opportunities as unknown as { title: string; brand_id: string; brands: { user_id: string; company_name: string } };
  if (!opp?.brands || opp.brands.user_id !== user.id) {
    console.log("[updateApplicationStatus] Permission denied. Brand user_id:", opp?.brands?.user_id, "Current user:", user.id);
    return { success: false, error: "You don't have permission to review this application." };
  }

  console.log("[updateApplicationStatus] Updating status to:", status);

  const { error } = await supabase
    .from("applications")
    .update({
      status,
      reviewed_at: new Date().toISOString(),
      reviewed_by: user.id,
    })
    .eq("id", applicationId);

  if (error) {
    console.log("[updateApplicationStatus] Update error:", error);
    return { success: false, error: `Failed to update status: ${error.message}` };
  }

  console.log("[updateApplicationStatus] Status updated successfully");

  revalidatePath("/dashboard/opportunities", "layout");
  revalidatePath("/dashboard/applicants");
  revalidatePath("/dashboard/applications");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/notifications");

  const opportunityTitle = opp.title || "Opportunity";
  const brandCompanyName = opp.brands.company_name || "The brand";
  const creatorId = app.creator_id;

  // Send notifications based on status
  try {
    if (status === "accepted") {
      // Notify creator: application accepted
      await createNotification(
        creatorId,
        "Application accepted!",
        `Your application for "${opportunityTitle}" has been accepted by ${brandCompanyName}. You can now message them.`,
        "application_accepted",
        "/dashboard/applications"
      );

      // Notify brand: confirmation
      await createNotification(
        user.id,
        "Application accepted",
        `You accepted a creator's application for "${opportunityTitle}". A conversation has been opened.`,
        "application_accepted",
        "/dashboard/messages"
      );

      // Create conversation (only if one doesn't already exist)
      const { data: existingConv } = await supabase
        .from("conversations")
        .select("id")
        .eq("application_id", applicationId)
        .maybeSingle();

      if (!existingConv) {
        const { error: convError } = await supabase.from("conversations").insert({
          application_id: applicationId,
          creator_id: creatorId,
          brand_id: opp.brand_id,
        });

        if (convError) {
          console.log("[updateApplicationStatus] Conversation creation error:", convError.message);
        } else {
          console.log("[updateApplicationStatus] Conversation created for application:", applicationId);
        }
      }

      revalidatePath("/dashboard/messages");
    } else if (status === "rejected") {
      // Notify creator: application rejected
      await createNotification(
        creatorId,
        "Application not selected",
        `Your application for "${opportunityTitle}" was not accepted by ${brandCompanyName}.`,
        "application_rejected",
        "/dashboard/applications"
      );
    } else if (status === "under_review") {
      // Notify creator: application under review
      await createNotification(
        creatorId,
        "Application under review",
        `${brandCompanyName} is reviewing your application for "${opportunityTitle}".`,
        "application_reviewed",
        "/dashboard/applications"
      );
    }
  } catch (notifError) {
    // Don't fail the whole operation if notifications fail
    console.log("[updateApplicationStatus] Notification error:", notifError);
  }

  return { success: true };
}

export async function withdrawApplication(
  applicationId: string
): Promise<{ success: boolean; error?: string }> {
  const user = await getUser();
  if (!user) return { success: false, error: "You must be logged in." };

  const supabase = await createClient();

  const { data: app } = await supabase
    .from("applications")
    .select("id, creator_id")
    .eq("id", applicationId)
    .single();

  if (!app) return { success: false, error: "Application not found." };
  if (app.creator_id !== user.id) return { success: false, error: "You can only withdraw your own applications." };

  const { error } = await supabase
    .from("applications")
    .update({ status: "withdrawn" })
    .eq("id", applicationId);

  if (error) {
    return { success: false, error: `Failed to withdraw: ${error.message}` };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/applications");
  return { success: true };
}
