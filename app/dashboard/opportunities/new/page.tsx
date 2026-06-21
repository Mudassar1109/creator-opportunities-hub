import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardLayout } from "@/components/dashboard-layout";
import { OpportunityForm } from "./opportunity-form";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Create Opportunity | CreatorHub",
  description: "Create a new brand opportunity.",
};

export default async function CreateOpportunityPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: brands } = await supabase
    .from("brands")
    .select("id, company_name")
    .eq("user_id", user.id);

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug")
    .eq("is_active", true)
    .order("sort_order");

  if (!brands || brands.length === 0) {
    redirect("/dashboard/opportunities");
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <h1 className="text-2xl font-bold text-gray-900">Create Opportunity</h1>
        <p className="mt-1 text-sm text-gray-500">Fill in the details to post a new opportunity for creators.</p>

        <div className="mt-6">
          <OpportunityForm
            brands={brands}
            categories={categories ?? []}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
