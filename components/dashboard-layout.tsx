import { Sidebar } from "./sidebar";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950">
      <Sidebar />
      {/* Main content area — offset by sidebar width on desktop, top bar on mobile */}
      <main className="pt-14 lg:pt-0 lg:pl-64 transition-all duration-300">
        <div className="min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
}
