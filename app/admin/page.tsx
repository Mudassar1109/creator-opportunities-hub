import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/supabase/server";
import { AdminDashboard } from "@/components/admin/admin-dashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const result = await getAdminUser();
  if (!result) redirect("/login");

  const { user, adminRole } = result;

  return <AdminDashboard user={user} adminRole={adminRole} />;
}
