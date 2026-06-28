import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/supabase/server";
import { getAdminSettings } from "@/lib/actions/admin/settings";
import { GeneralSettings } from "@/components/admin/settings/general-settings";
import { SecuritySettings } from "@/components/admin/settings/security-settings";
import { EmailSettings } from "@/components/admin/settings/email-settings";
import { SocialSettings } from "@/components/admin/settings/social-settings";
import { SEOSettings } from "@/components/admin/settings/seo-settings";
import { FeatureFlags } from "@/components/admin/settings/feature-flags";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const result = await getAdminUser();
  if (!result) redirect("/login");

  const settings = await getAdminSettings();

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">Settings</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage platform configuration</p>
      </div>
      <div className="mx-auto max-w-4xl space-y-6">
        <GeneralSettings settings={settings} />
        <SecuritySettings settings={settings} />
        <EmailSettings settings={settings} />
        <SocialSettings settings={settings} />
        <SEOSettings settings={settings} />
        <FeatureFlags settings={settings} />
      </div>
    </div>
  );
}
