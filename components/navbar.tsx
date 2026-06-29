"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

const NAV_LINKS = [
  { label: "Home", href: "/#home" },
  { label: "Opportunities", href: "/opportunities" },
  { label: "Categories", href: "/#categories" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
] as const;

export function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [userRole, setUserRole] = useState<"creator" | "brand">("creator");

  useEffect(() => {
    const supabase = createClient();

    // Get current session
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoaded(true);
      if (user) {
        supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single()
          .then(({ data }) => {
            if (data?.role) setUserRole(data.role as "creator" | "brand");
          });
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoaded(true);
      if (session?.user) {
        supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single()
          .then(({ data }) => {
            if (data?.role) setUserRole(data.role as "creator" | "brand");
          });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const roleBadge = userRole === "brand"
    ? "bg-indigo-50 text-indigo-700 border-indigo-200"
    : "bg-cyan-50 text-cyan-700 border-cyan-200";

  const roleLabel = userRole === "brand" ? "Brand" : "Creator";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold text-white shadow-md">
            C
          </span>
          <span className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
            Creator<span className="text-indigo-600">Hub</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-50 hover:text-indigo-600"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA Buttons — Desktop */}
        <div className="hidden items-center gap-3 lg:flex">
          {loaded && user ? (
            <>
              <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold ${roleBadge}`}>
                {roleLabel}
              </span>
              <Link
                href="/dashboard"
                className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition"
              >
                Dashboard
              </Link>
              <Link
                href={userRole === "brand" ? "/dashboard/opportunities" : "/dashboard/applications"}
                className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-indigo-700 transition"
              >
                {userRole === "brand" ? "My Opportunities" : "My Applications"}
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition"
              >
                Log In
              </Link>
              <Link
                href="/signup/role"
                className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-indigo-700 transition"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <details className="relative lg:hidden">
          <summary className="list-none cursor-pointer rounded-lg p-2 text-slate-500 hover:bg-slate-50">
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </summary>
          <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
            <ul className="space-y-1">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-indigo-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-4 space-y-2 border-t border-slate-100 pt-4">
              {loaded && user ? (
                <>
                  <div className="px-3 py-1">
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold ${roleBadge}`}>
                      {roleLabel}
                    </span>
                  </div>
                  <Link
                    href="/dashboard"
                    className="block rounded-lg px-3 py-2.5 text-center text-sm font-bold text-slate-500 hover:bg-slate-50 hover:text-indigo-600"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href={userRole === "brand" ? "/dashboard/opportunities" : "/dashboard/applications"}
                    className="block rounded-xl bg-indigo-600 px-5 py-2.5 text-center text-sm font-bold text-white shadow-sm hover:bg-indigo-700"
                  >
                    {userRole === "brand" ? "My Opportunities" : "My Applications"}
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block rounded-lg px-3 py-2.5 text-center text-sm font-bold text-slate-500 hover:bg-slate-50 hover:text-indigo-600"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/signup/role"
                    className="block rounded-xl bg-indigo-600 px-5 py-2.5 text-center text-sm font-bold text-white shadow-sm hover:bg-indigo-700"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </details>
      </nav>
    </header>
  );
}
