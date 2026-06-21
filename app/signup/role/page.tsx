"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RoleSelectionPage() {
  const router = useRouter();

  function handleRoleSelect(role: "creator" | "brand") {
    router.push(`/signup?role=${role}`);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-4 py-12 sm:px-6 lg:px-8">
      {/* Background decoration */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-gradient-to-br from-purple-50 via-purple-50 to-cyan-50 blur-3xl" />
      </div>

      <div className="relative w-full max-w-2xl">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-cyan-500 text-base font-bold text-white shadow-md shadow-purple-500/20">
              C
            </span>
            <span className="text-xl font-bold tracking-tight text-gray-900">
              Creator<span className="text-purple-600">Hub</span>
            </span>
          </Link>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-xl shadow-gray-200/60 sm:p-10">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
              Choose your account type
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Select how you want to use CreatorHub
            </p>
          </div>

          {/* Role Selection Cards */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Creator Card */}
            <button
              onClick={() => handleRoleSelect("creator")}
              className="group relative rounded-2xl border-2 border-gray-200 bg-white p-6 text-left transition-all duration-200 hover:border-purple-500 hover:shadow-lg hover:shadow-purple-500/10"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-md shadow-purple-500/20 transition-transform group-hover:scale-110">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                    Join as Creator
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Find and apply to brand deals, sponsorships, and paid opportunities
                  </p>
                </div>
              </div>
            </button>

            {/* Brand Card */}
            <button
              onClick={() => handleRoleSelect("brand")}
              className="group relative rounded-2xl border-2 border-gray-200 bg-white p-6 text-left transition-all duration-200 hover:border-cyan-500 hover:shadow-lg hover:shadow-cyan-500/10"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 text-white shadow-md shadow-cyan-500/20 transition-transform group-hover:scale-110">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25a2.25 2.25 0 01-2.25-2.25V18z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-cyan-600 transition-colors">
                    Join as Brand
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Post opportunities and find talented creators for your campaigns
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Footer link */}
        <p className="mt-8 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-bold text-purple-600 transition hover:text-purple-700"
          >
            Log in
          </Link>
        </p>

        {/* Back to home */}
        <p className="mt-4 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs font-medium text-gray-400 transition hover:text-gray-600"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to home
          </Link>
        </p>
      </div>
    </main>
  );
}
