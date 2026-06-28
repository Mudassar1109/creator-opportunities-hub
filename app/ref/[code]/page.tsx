import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createServiceClient, getUser } from "@/lib/supabase/server";
import { getReferralLandingStats } from "@/lib/actions/referrals";
import type { Database } from "@/lib/database.types";

interface PageProps {
  params: Promise<{ code: string }>;
}

interface ReferrerInfo {
  name: string;
  isVerified: boolean;
}

async function getReferrerInfo(code: string): Promise<ReferrerInfo | null> {
  try {
    const supabase = createServiceClient();
    const { data: refCode } = await supabase
      .from("referral_codes")
      .select("id, user_id, is_active")
      .eq("code", code)
      .eq("is_active", true)
      .maybeSingle();

    if (!refCode) return null;

    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, is_verified")
      .eq("id", refCode.user_id)
      .single();

    if (!profile) return null;

    return {
      name: profile.full_name,
      isVerified: profile.is_verified,
    };
  } catch {
    return null;
  }
}

function formatCount(num: number): string {
  if (num >= 1000) {
    return `${Math.floor(num / 1000)}K+`;
  }
  return num.toString();
}

export default async function ReferralLandingPage({ params }: PageProps) {
  const { code } = await params;

  const user = await getUser();
  if (user) {
    redirect("/dashboard");
  }

  const referrer = await getReferrerInfo(code);
  const landingStats = await getReferralLandingStats();

  if (!referrer) {
    return <InvalidReferralPage />;
  }

  return (
    <main className="flex min-h-screen flex-col bg-white">
      {/* Background decoration */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-br from-purple-50/80 via-purple-50/50 to-cyan-50/80 blur-3xl" />
        <div className="absolute -bottom-40 right-1/4 h-[400px] w-[600px] rounded-full bg-gradient-to-br from-purple-50/50 to-cyan-50/50 blur-3xl" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between border-b border-gray-100 px-6 py-4 sm:px-10">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-cyan-500 text-base font-bold text-white shadow-md shadow-purple-500/20">
            C
          </span>
          <span className="text-xl font-bold tracking-tight text-gray-900">
            Creator<span className="text-purple-600">Hub</span>
          </span>
        </Link>
        <Link
          href={`/login?ref=${code}`}
          className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-gray-300 hover:shadow-md"
        >
          Log in
        </Link>
      </nav>

      {/* Hero */}
      <section className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center px-6 pt-16 pb-20 text-center sm:px-10 sm:pt-24">
        {/* Invited by badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-100 bg-purple-50 px-4 py-1.5 text-sm font-medium text-purple-700">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
          </svg>
          Invited by <span className="font-bold">{referrer.name}</span>
          {referrer.isVerified && (
            <svg className="h-4 w-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
            </svg>
          )}
        </div>

        {/* Headline */}
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
          Grow Your Brand
          <br />
          <span className="bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">
            With CreatorHub
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-500 sm:text-xl">
          The marketplace where creators and brands connect for paid partnerships,
          sponsorships, UGC jobs, and long-term collaborations. {referrer.name} is
          already on CreatorHub — join them today.
        </p>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-3 gap-8 sm:gap-16">
          <div className="text-center">
            <p className="text-3xl font-extrabold text-gray-900">{formatCount(landingStats.activeCreators)}</p>
            <p className="mt-1 text-sm text-gray-500">Active Creators</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-extrabold text-gray-900">{formatCount(landingStats.brandPartners)}</p>
            <p className="mt-1 text-sm text-gray-500">Brand Partners</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-extrabold text-gray-900">{formatCount(landingStats.activeOpportunities)}</p>
            <p className="mt-1 text-sm text-gray-500">Active Opportunities</p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:gap-6">
          <Link
            href={`/signup?role=creator&ref=${code}`}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 px-8 py-4 text-base font-bold text-white shadow-lg shadow-purple-500/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-purple-500/30"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
            Join as Creator
          </Link>
          <Link
            href={`/signup?role=brand&ref=${code}`}
            className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-8 py-4 text-base font-bold text-gray-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-purple-300 hover:shadow-md"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25a2.25 2.25 0 01-2.25-2.25V18z" />
            </svg>
            Join as Brand
          </Link>
        </div>

        <p className="mt-6 text-sm text-gray-400">
          Already have an account?{" "}
          <Link href={`/login?ref=${code}`} className="font-semibold text-purple-600 hover:text-purple-700 transition">
            Log in
          </Link>
        </p>
      </section>

      {/* Features */}
      <section className="relative z-10 mx-auto w-full max-w-5xl px-6 pb-24 sm:px-10">
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            {
              icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.181 2.181 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.181 2.181 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
                </svg>
              ),
              title: "Find Paid Opportunities",
              desc: "Discover brand deals, sponsorships, UGC jobs, and collaborations tailored to your niche and audience size.",
            },
            {
              icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              ),
              title: "Connect Directly with Brands",
              desc: "Apply directly to opportunities, message brand partners, and build long-term relationships — all in one place.",
            },
            {
              icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
              title: "Earn What You Deserve",
              desc: "From one-time UGC jobs starting at $500 to long-term ambassador programs paying $4,000+/month.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:border-purple-200/50"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-100 to-cyan-100 text-purple-600 transition-transform group-hover:scale-110">
                {feature.icon}
              </div>
              <h3 className="mt-5 text-lg font-bold text-gray-900">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-100 bg-gray-50/50 px-6 py-8 text-center">
        <p className="text-sm text-gray-400">
          &copy; {new Date().getFullYear()} CreatorHub. All rights reserved.
        </p>
      </footer>
    </main>
  );
}

function InvalidReferralPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-4 py-12">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-gradient-to-br from-purple-50 to-cyan-50 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-md text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 shadow-sm">
          <svg className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>

        <h1 className="mt-6 text-2xl font-extrabold tracking-tight text-gray-900">
          Invalid Referral Link
        </h1>

        <p className="mt-3 text-sm leading-relaxed text-gray-500">
          This referral link is no longer valid or doesn&apos;t exist. Please check
          the link and try again, or visit CreatorHub directly to sign up.
        </p>

        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/signup/role"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-purple-500/25 transition-all hover:-translate-y-0.5 hover:shadow-xl"
          >
            Sign Up
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-bold text-gray-700 shadow-sm transition hover:border-gray-300 hover:shadow-md"
          >
            Log In
          </Link>
        </div>

        <Link href="/" className="mt-6 inline-flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-gray-600 transition">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to home
        </Link>
      </div>
    </main>
  );
}
