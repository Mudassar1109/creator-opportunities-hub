import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getAdminUser } from "@/lib/supabase/server";
import { getAdminUserById } from "@/lib/actions/admin/user-details";
import { UserProfileCard } from "@/components/admin/user-profile-card";
import { UserActivityCard } from "@/components/admin/user-activity-card";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminUserDetailPage({ params }: Props) {
  const result = await getAdminUser();
  if (!result) redirect("/login");

  const { id } = await params;
  const data = await getAdminUserById(id);
  if (!data) notFound();

  const { profile, applicationCount, opportunityCount } = data;

  return (
    <div className="mx-auto max-w-6xl">
      <Link
        href="/admin/users"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Back to Users
      </Link>

      <div className="space-y-6">
        <UserProfileCard profile={profile} />
        <UserActivityCard
          applicationCount={applicationCount}
          opportunityCount={opportunityCount}
        />
      </div>
    </div>
  );
}
