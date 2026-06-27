import Link from "next/link";
import { Navbar } from "@/components/navbar";

export const metadata = {
  title: "Admin Panel | CreatorHub",
  description: "Admin panel for Creator Opportunities Hub.",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
              Admin Panel
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Platform management and moderation
            </p>
          </div>
          <Link
            href="/dashboard"
            className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Back to Dashboard
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}
