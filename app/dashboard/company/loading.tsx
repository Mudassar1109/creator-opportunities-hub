import { DashboardLayout } from "@/components/dashboard-layout";
import { ProfileSkeleton } from "@/components/ui/skeleton";

export default function CompanyLoading() {
  return (
    <DashboardLayout>
      {/* Company profile form has similar layout to creator profile */}
      <ProfileSkeleton />
    </DashboardLayout>
  );
}
