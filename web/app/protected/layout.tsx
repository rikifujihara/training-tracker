"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { DesktopSidebar } from "@/components/ui/desktop-sidebar";
import { MobileBottomNav } from "@/components/navigation/mobile-bottom-nav";
import { MobileSideMenu } from "@/components/navigation/mobile-side-menu";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
        <div className="p-6 pb-24 md:pb-6">{children}</div>
      </main>

      {/* Mobile Navigation - Only visible on small screens */}
      <MobileBottomNav onMenuClick={() => setMobileMenuOpen(true)} />
      
      {/* Mobile Side Menu */}
      <MobileSideMenu 
        open={mobileMenuOpen} 
        onOpenChange={setMobileMenuOpen} 
      />
    </div>
  );
}
