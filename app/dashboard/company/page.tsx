import { redirect } from "next/navigation";
import { createClient, getUserWithRole } from "@/lib/supabase/server";
import { DashboardLayout } from "@/components/dashboard-layout";
import { CompanyProfileForm } from "./company-profile-form";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Company Profile | CreatorHub",
  description: "Manage your brand and company information.",
};

export default async function CompanyProfilePage() {
  const result = await getUserWithRole();
  if (!result) redirect("/login?redirect=/dashboard/company");
  if (result.role !== "brand") redirect("/dashboard");

  const supabase = await createClient();

  // Get existing brand for this user
  const { data: brand } = await supabase
    .from("brands")
    .select("*")
    .eq("user_id", result.user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  // Get user profile for contact info
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", result.user.id)
    .single();

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-cyan-500 shadow-lg shadow-purple-500/20">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
                Company Profile
              </h1>
              <p className="mt-0.5 text-sm text-gray-500">
                Manage your brand information to attract creators and post opportunities.
              </p>
            </div>
          </div>
        </div>

        {/* Company Profile Form */}
        <CompanyProfileForm
          brand={brand}
          profile={profile}
          userEmail={result.user.email ?? ""}
          userId={result.user.id}
        />
      </div>
    </DashboardLayout>
  );
}
