import { DashboardLayout } from "@/components/dashboard-layout";
import { ChatSkeleton, Skeleton } from "@/components/ui/skeleton";

export default function MessagesLoading() {
  return (
    <DashboardLayout>
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <div className="mb-4 space-y-2">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-4 w-72" />
        </div>
        <ChatSkeleton />
      </div>
    </DashboardLayout>
  );
}
