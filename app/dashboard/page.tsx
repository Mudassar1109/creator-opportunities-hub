import { redirect } from "next/navigation";
import { createClient, getUserWithRole } from "@/lib/supabase/server";
import { DashboardLayout } from "@/components/dashboard-layout";
import { WelcomeBanner } from "@/components/welcome-banner";
import { CreatorDashboard } from "@/components/dashboard/creator-dashboard";
import { BrandDashboard } from "@/components/dashboard/brand-dashboard";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Dashboard | CreatorHub",
  description: "Your CreatorHub dashboard - manage your account and opportunities.",
};

export default async function DashboardPage() {
  const result = await getUserWithRole();
  if (!result) redirect("/login");

  const { user, role } = result;
  const supabase = await createClient();

  // Get profile for welcome banner
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <DashboardLayout>
      {/* Welcome Banner */}
      <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6 sm:pt-8 lg:px-8">
        <div className="mb-6 sm:mb-8">
          <WelcomeBanner
            fullName={role === "brand" ? (profile?.full_name ?? user.email?.split("@")[0]) : profile?.full_name}
            avatarUrl={profile?.avatar_url}
            email={user.email}
            role={role}
          />
        </div>
      </div>

      {/* Role-based Dashboard Content */}
      {role === "brand" ? (
        <BrandDashboard user={user} />
      ) : (
        <CreatorDashboard user={user} profile={profile} />
      )}
    </DashboardLayout>
  );
}
