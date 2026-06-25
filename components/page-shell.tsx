import Link from "next/link";
import { Navbar } from "@/components/navbar";

interface PageShellProps {
  children: React.ReactNode;
  /** Breadcrumb label for this page */
  label: string;
}

/**
 * Shared wrapper for all static/legal/content pages.
 * Renders Navbar + a top breadcrumb bar + footer back-link.
 * Keeps the design system consistent with zero duplication.
 */
export function PageShell({ children, label }: PageShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      {/* Breadcrumb strip */}
      <div className="border-b border-gray-100 bg-gray-50/60 px-4 py-3 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <nav className="flex items-center gap-2 text-xs text-gray-500" aria-label="Breadcrumb">
            <Link
              href="/"
              className="transition hover:text-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded"
            >
              Home
            </Link>
            <svg className="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <span className="font-medium text-gray-700">{label}</span>
          </nav>
        </div>
      </div>

      {/* Page content */}
      <main className="flex-1">{children}</main>

      {/* Minimal footer */}
      <footer className="border-t border-gray-100 bg-gray-50/60 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <Link href="/" className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-lg" aria-label="CreatorHub home">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-cyan-500 text-xs font-bold text-white" aria-hidden="true">C</span>
            <span className="text-sm font-bold text-gray-900">Creator<span className="text-purple-600">Hub</span></span>
          </Link>
          <p className="text-xs text-gray-400">&copy; {new Date().getFullYear()} Creator Opportunities Hub. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { label: "Privacy", href: "/privacy" },
              { label: "Terms", href: "/terms" },
              { label: "Cookies", href: "/cookies" },
              { label: "Contact", href: "/contact" },
            ].map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="text-xs text-gray-400 transition hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
