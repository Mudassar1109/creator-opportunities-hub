import { redirect } from "next/navigation";
import { getUserWithRole } from "@/lib/supabase/server";
import { DashboardLayout } from "@/components/dashboard-layout";
import { getReferralData } from "@/lib/actions/referrals";
import { ReferralOverview } from "@/components/referrals/referral-overview";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Referral System | CreatorHub",
  description: "Manage your referral program and track earnings.",
};

export default async function ReferralsPage() {
  const result = await getUserWithRole();
  if (!result) redirect("/login");

  const data = await getReferralData();

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Referral Program</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Invite creators and brands to earn XP and unlock rewards.
          </p>
        </div>
        <ReferralOverview data={data} />
      </div>
    </DashboardLayout>
  );
}
