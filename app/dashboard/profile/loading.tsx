import { DashboardLayout } from "@/components/dashboard-layout";
import { ProfileSkeleton } from "@/components/ui/skeleton";

export default function ProfileLoading() {
  return (
    <DashboardLayout>
      <ProfileSkeleton />
    </DashboardLayout>
  );
}
