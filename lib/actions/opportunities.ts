"use server";

import { createClient, getUser } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { OpportunityType, BudgetType, LocationType } from "@/lib/database.types";

export interface OpportunityFormData {
  brand_id: string;
  title: string;
  description: string;
  opportunity_type: OpportunityType;
  budget_min: number | null;
  budget_max: number | null;
  budget_type: BudgetType;
  currency: string;
  country: string;
  location_type: LocationType;
  requirements: string;
  deliverables: string;
  deadline: string;
  min_followers: number;
  platforms: string[];
  niches: string[];
  is_featured: boolean;
  is_remote: boolean;
  category_ids: string[];
  status: "draft" | "active";
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 100) + "-" + Date.now().toString(36);
}

export async function createOpportunity(
  data: OpportunityFormData
): Promise<{ success: boolean; error?: string; opportunityId?: string; slug?: string }> {
  const user = await getUser();
  if (!user) return { success: false, error: "You must be logged in." };

  const supabase = await createClient();

  // Verify brand ownership
  const { data: brand } = await supabase
    .from("brands")
    .select("id, user_id")
    .eq("id", data.brand_id)
    .eq("user_id", user.id)
    .single();

  if (!brand) return { success: false, error: "Brand not found or you don't have access." };

  if (!data.title.trim()) return { success: false, error: "Title is required." };
  if (!data.description.trim()) return { success: false, error: "Description is required." };

  const slug = slugify(data.title);

  const { data: opp, error } = await supabase
    .from("opportunities")
    .insert({
      brand_id: data.brand_id,
      created_by: user.id,
      title: data.title.trim(),
      slug,
      description: data.description.trim(),
      opportunity_type: data.opportunity_type,
      budget_min: data.budget_min,
      budget_max: data.budget_max,
      budget_type: data.budget_type || "fixed",
      currency: data.currency || "USD",
      country: data.country || null,
      location_type: data.location_type || "remote",
      requirements: data.requirements || null,
      deliverables: data.deliverables || null,
      deadline: data.deadline || null,
      min_followers: data.min_followers || 0,
      platforms: data.platforms || [],
      niches: data.niches || [],
      is_featured: data.is_featured || false,
      is_remote: data.is_remote || false,
      status: data.status || "draft",
      published_at: data.status === "active" ? new Date().toISOString() : null,
    })
    .select("id, slug")
    .single();

  if (error) {
    return { success: false, error: `Failed to create opportunity: ${error.message}` };
  }

  // Insert category links
  if (data.category_ids.length > 0) {
    await supabase.from("opportunity_categories").insert(
      data.category_ids.map((catId) => ({
        opportunity_id: opp.id,
        category_id: catId,
      }))
    );
  }

  revalidatePath("/dashboard/opportunities");
  revalidatePath("/opportunities");
  return { success: true, opportunityId: opp.id, slug: opp.slug };
}

export async function updateOpportunity(
  id: string,
  data: Partial<OpportunityFormData>
): Promise<{ success: boolean; error?: string }> {
  const user = await getUser();
  if (!user) return { success: false, error: "You must be logged in." };

  const supabase = await createClient();

  // Verify ownership
  const { data: opp } = await supabase
    .from("opportunities")
    .select("id, brand_id, brands(user_id)")
    .eq("id", id)
    .single();

  if (!opp) return { success: false, error: "Opportunity not found." };

  const brand = opp.brands as unknown as { user_id: string };
  if (brand.user_id !== user.id) {
    return { success: false, error: "You don't have permission to edit this." };
  }

  const updateData: Record<string, unknown> = {};
  if (data.title !== undefined) updateData.title = data.title.trim();
  if (data.description !== undefined) updateData.description = data.description.trim();
  if (data.opportunity_type !== undefined) updateData.opportunity_type = data.opportunity_type;
  if (data.budget_min !== undefined) updateData.budget_min = data.budget_min;
  if (data.budget_max !== undefined) updateData.budget_max = data.budget_max;
  if (data.budget_type !== undefined) updateData.budget_type = data.budget_type;
  if (data.currency !== undefined) updateData.currency = data.currency;
  if (data.country !== undefined) updateData.country = data.country || null;
  if (data.location_type !== undefined) updateData.location_type = data.location_type;
  if (data.requirements !== undefined) updateData.requirements = data.requirements || null;
  if (data.deliverables !== undefined) updateData.deliverables = data.deliverables || null;
  if (data.deadline !== undefined) updateData.deadline = data.deadline || null;
  if (data.min_followers !== undefined) updateData.min_followers = data.min_followers;
  if (data.platforms !== undefined) updateData.platforms = data.platforms;
  if (data.niches !== undefined) updateData.niches = data.niches;
  if (data.is_featured !== undefined) updateData.is_featured = data.is_featured;
  if (data.is_remote !== undefined) updateData.is_remote = data.is_remote;

  if (Object.keys(updateData).length > 0) {
    const { error } = await supabase
      .from("opportunities")
      .update(updateData as never)
      .eq("id", id);

    if (error) return { success: false, error: `Update failed: ${error.message}` };
  }

  // Update categories if provided
  if (data.category_ids !== undefined) {
    await supabase.from("opportunity_categories").delete().eq("opportunity_id", id);
    if (data.category_ids.length > 0) {
      await supabase.from("opportunity_categories").insert(
        data.category_ids.map((catId) => ({
          opportunity_id: id,
          category_id: catId,
        }))
      );
    }
  }

  revalidatePath("/dashboard/opportunities");
  revalidatePath(`/dashboard/opportunities/${id}`);
  revalidatePath("/opportunities");
  return { success: true };
}

export async function deleteOpportunity(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const user = await getUser();
  if (!user) return { success: false, error: "You must be logged in." };

  const supabase = await createClient();

  const { data: opp } = await supabase
    .from("opportunities")
    .select("id, brand_id, brands(user_id)")
    .eq("id", id)
    .single();

  if (!opp) return { success: false, error: "Opportunity not found." };

  const brand = opp.brands as unknown as { user_id: string };
  if (brand.user_id !== user.id) {
    return { success: false, error: "You don't have permission to delete this." };
  }

  // Delete category links first
  await supabase.from("opportunity_categories").delete().eq("opportunity_id", id);

  const { error } = await supabase
    .from("opportunities")
    .delete()
    .eq("id", id);

  if (error) return { success: false, error: `Delete failed: ${error.message}` };

  revalidatePath("/dashboard/opportunities");
  revalidatePath("/opportunities");
  return { success: true };
}

export async function publishOpportunity(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const user = await getUser();
  if (!user) return { success: false, error: "You must be logged in." };

  const supabase = await createClient();

  const { data: opp } = await supabase
    .from("opportunities")
    .select("id, brand_id, status, brands(user_id)")
    .eq("id", id)
    .single();

  if (!opp) return { success: false, error: "Opportunity not found." };

  const brand = opp.brands as unknown as { user_id: string };
  if (brand.user_id !== user.id) {
    return { success: false, error: "You don't have permission." };
  }

  const { error } = await supabase
    .from("opportunities")
    .update({
      status: "active",
      published_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) return { success: false, error: `Publish failed: ${error.message}` };

  revalidatePath("/dashboard/opportunities");
  revalidatePath("/opportunities");
  return { success: true };
}
