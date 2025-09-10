"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { DesktopSidebar } from "@/components/ui/desktop-sidebar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-surface-page">
      {/* Sidebar - Hidden on mobile (sm breakpoint and below) */}
      <div
        className={`hidden sm:block transition-all duration-300 ${
          sidebarCollapsed ? "w-20" : "w-64"
        } flex-shrink-0`}
      >
        <DesktopSidebar
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          currentPath={pathname}
        />
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
