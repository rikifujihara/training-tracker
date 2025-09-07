"use client";

import { useState } from "react";
import { DesktopSidebar } from "@/components/ui/desktop-sidebar";

export default function SidebarTestingPage() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}>
        <DesktopSidebar
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(!collapsed)}
          currentPath="/clients"
          userName="Riki Fujihara"
          userInitials="RF"
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Sidebar Testing Page</h1>
          
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Sidebar Controls</h2>
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              {collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Current State</h2>
            <p className="text-gray-600">
              Sidebar is currently: <span className="font-semibold">{collapsed ? 'Collapsed' : 'Expanded'}</span>
            </p>
            <p className="text-gray-600 mt-2">
              Active page: <span className="font-semibold">Clients</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}