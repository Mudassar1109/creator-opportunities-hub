import { DashboardLayout } from "@/components/dashboard-layout";
import { WelcomeBannerSkeleton, DashboardPageSkeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <DashboardLayout>
      <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6 sm:pt-8 lg:px-8">
        <div className="mb-6 sm:mb-8">
          <WelcomeBannerSkeleton />
        </div>
      </div>
      <DashboardPageSkeleton rows={4} title={false} />
    </DashboardLayout>
  );
}
