"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

const NAV_LINKS = [
  { label: "Home", href: "/#home" },
  { label: "Opportunities", href: "/#opportunities" },
  { label: "Categories", href: "/#categories" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
] as const;

export function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    // Get current session
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoaded(true);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoaded(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-cyan-500 text-sm font-bold text-white shadow-md shadow-purple-500/20">
            C
          </span>
          <span className="text-lg font-bold tracking-tight text-gray-900 sm:text-xl">
            Creator<span className="text-purple-600">Hub</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
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
              <Link
                href="/dashboard"
                className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard"
                className="rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-purple-500/20 transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/30 hover:-translate-y-0.5"
              >
                My Account
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-purple-500/20 transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/30 hover:-translate-y-0.5"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <details className="relative lg:hidden">
          <summary className="list-none cursor-pointer rounded-lg p-2 text-gray-700 hover:bg-gray-50">
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
          <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-gray-100 bg-white p-4 shadow-xl">
            <ul className="space-y-1">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="block rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-4 space-y-2 border-t border-gray-100 pt-4">
              {loaded && user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="block rounded-lg px-3 py-2.5 text-center text-sm font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/dashboard"
                    className="block rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 px-5 py-2.5 text-center text-sm font-semibold text-white"
                  >
                    My Account
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block rounded-lg px-3 py-2.5 text-center text-sm font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/signup"
                    className="block rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 px-5 py-2.5 text-center text-sm font-semibold text-white"
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
