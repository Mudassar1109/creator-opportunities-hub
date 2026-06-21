import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardLayout } from "@/components/dashboard-layout";
import { OpportunityForm } from "../new/opportunity-form";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Edit Opportunity | CreatorHub",
  description: "Edit your brand opportunity.",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditOpportunityPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Get brands owned by user
  const { data: brands } = await supabase
    .from("brands")
    .select("id, company_name")
    .eq("user_id", user.id);

  if (!brands || brands.length === 0) redirect("/dashboard/opportunities");

  // Get opportunity
  const { data: opp } = await supabase
    .from("opportunities")
    .select("*, brands(user_id)")
    .eq("id", id)
    .single();

  if (!opp) notFound();

  const brand = opp.brands as unknown as { user_id: string };
  if (brand.user_id !== user.id) redirect("/dashboard/opportunities");

  // Get categories
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug")
    .eq("is_active", true)
    .order("sort_order");

  // Get current category links
  const { data: oppCats } = await supabase
    .from("opportunity_categories")
    .select("category_id")
    .eq("opportunity_id", id);

  const categoryIds = oppCats?.map((oc) => oc.category_id) ?? [];

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Opportunity</h1>
        <p className="mt-1 text-sm text-gray-500">Update the details of your opportunity.</p>

        <div className="mt-6">
          <OpportunityForm
            brands={brands}
            categories={categories ?? []}
            opportunityId={id}
            initialData={{
              brand_id: opp.brand_id,
              title: opp.title,
              description: opp.description,
              opportunity_type: opp.opportunity_type,
              budget_min: opp.budget_min,
              budget_max: opp.budget_max,
              budget_type: opp.budget_type,
              currency: opp.currency,
              country: opp.country || "",
              location_type: opp.location_type,
              requirements: opp.requirements || "",
              deliverables: opp.deliverables || "",
              deadline: opp.deadline || "",
              min_followers: opp.min_followers,
              platforms: opp.platforms,
              niches: opp.niches,
              is_featured: opp.is_featured,
              is_remote: opp.is_remote,
              category_ids: categoryIds,
            }}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
