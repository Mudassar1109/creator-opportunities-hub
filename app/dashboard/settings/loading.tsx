import { DashboardLayout } from "@/components/dashboard-layout";
import { SettingsSkeleton } from "@/components/ui/skeleton";

export default function SettingsLoading() {
  return (
    <DashboardLayout>
      <SettingsSkeleton />
    </DashboardLayout>
  );
}
