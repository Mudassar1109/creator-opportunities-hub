"use server";

import { createClient, getUser } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { ApplicationStatus } from "@/lib/database.types";

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

  return { success: true, applicationId: application.id };
}

export async function updateApplicationStatus(
  applicationId: string,
  status: ApplicationStatus
): Promise<{ success: boolean; error?: string }> {
  const user = await getUser();
  if (!user) return { success: false, error: "You must be logged in." };

  const supabase = await createClient();

  // Get the application and verify the brand owns the opportunity
  const { data: app } = await supabase
    .from("applications")
    .select("id, opportunity_id, opportunities(brand_id, brands(user_id))")
    .eq("id", applicationId)
    .single();

  if (!app) return { success: false, error: "Application not found." };

  const opp = app.opportunities as unknown as { brand_id: string; brands: { user_id: string } };
  if (!opp?.brands || opp.brands.user_id !== user.id) {
    return { success: false, error: "You don't have permission to review this application." };
  }

  const { error } = await supabase
    .from("applications")
    .update({
      status,
      reviewed_at: new Date().toISOString(),
      reviewed_by: user.id,
    })
    .eq("id", applicationId);

  if (error) {
    return { success: false, error: `Failed to update status: ${error.message}` };
  }

  revalidatePath("/dashboard/opportunities");
  revalidatePath("/dashboard/applications");
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
