"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface AdminNavItem {
  label: string;
  href: string;
  exact?: boolean;
}

const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { label: "Dashboard", href: "/admin", exact: true },
  { label: "Users", href: "/admin/users" },
  { label: "Brands", href: "/admin/brands" },
  { label: "Opportunities", href: "/admin/opportunities" },
  { label: "Applications", href: "/admin/applications" },
  { label: "Reports", href: "/admin/reports" },
  { label: "Analytics", href: "/admin/analytics" },
  { label: "Settings", href: "/admin/settings" },
  { label: "Notifications", href: "/admin/notifications" },
  { label: "Activity", href: "/admin/activity" },
];

export function AdminNav() {
  const pathname = usePathname();

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  return (
    <nav className="mb-6 flex flex-wrap gap-1.5 border-b border-gray-200 dark:border-gray-800 pb-3">
      {ADMIN_NAV_ITEMS.map((item) => {
        const active = isActive(item.href, item.exact);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              active
                ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
