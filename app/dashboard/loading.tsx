import { DashboardLayout } from "@/components/dashboard-layout";
import { DashboardPageSkeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <DashboardLayout>
      <DashboardPageSkeleton rows={4} title />
    </DashboardLayout>
  );
}
