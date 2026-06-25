import { DashboardLayout } from "@/components/dashboard-layout";
import { ProfileSkeleton } from "@/components/ui/skeleton";

export default function NewOpportunityLoading() {
  return (
    <DashboardLayout>
      <ProfileSkeleton />
    </DashboardLayout>
  );
}
