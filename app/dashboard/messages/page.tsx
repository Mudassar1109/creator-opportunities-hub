import { redirect } from "next/navigation";
import { getUserWithRole } from "@/lib/supabase/server";
import { DashboardLayout } from "@/components/dashboard-layout";
import { ChatInterface } from "./chat-client";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Messages | CreatorHub",
  description: "Chat with brands and creators about accepted applications.",
};

export default async function MessagesPage() {
  const result = await getUserWithRole();
  if (!result) redirect("/login");

  const { user } = result;

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Messages</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Communicate with brands and creators about accepted applications.
          </p>
        </div>
        <ChatInterface userId={user.id} />
      </div>
    </DashboardLayout>
  );
}
