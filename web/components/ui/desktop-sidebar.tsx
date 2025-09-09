"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { SidebarNavItem } from "@/components/ui/sidebar-nav-item";
import { Home, Users, MessageSquare, Settings, Menu, X } from "lucide-react";
import { Button } from "./button";

export interface DesktopSidebarProps
  extends React.HTMLAttributes<HTMLDivElement> {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  currentPath?: string;
  userName?: string;
  userInitials?: string;
}

const navigationItems = [
  { icon: Home, label: "Dashboard", href: "/protected", badge: undefined },
  {
    icon: Users,
    label: "Prospects",
    href: "/protected/prospects",
    badge: undefined,
  },
  // {
  //   icon: Users,
  //   label: "Clients",
  //   href: "#",
  //   badge: undefined,
  // },
  {
    icon: MessageSquare,
    label: "Templates",
    href: "/protected/templates",
    badge: undefined,
  },
  // {
  //   icon: Calendar,
  //   label: "Schedule",
  //   href: "#",
  //   badge: undefined,
  // },
  // {
  //   icon: CreditCard,
  //   label: "Billing",
  //   href: "#",
  //   badge: undefined,
  // },
];

const DesktopSidebar = React.forwardRef<HTMLDivElement, DesktopSidebarProps>(
  (
    {
      collapsed = false,
      onToggleCollapse,
      currentPath = "/clients",
      userName = "Riki Fujihara",
      userInitials = "RF",
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-surface-primary flex flex-col gap-5 p-4 h-full min-h-screen",
          collapsed ? "items-center" : "items-start",
          className
        )}
        {...props}
      >
        {/* Header - Logo and Menu Toggle */}
        <div
          className={cn(
            "flex items-center w-full",
            collapsed ? "justify-center" : "justify-between gap-7"
          )}
        >
          {!collapsed && (
            <div className="flex items-center">
              <span className="font-heading font-semibold text-[20px] leading-[24px] text-text-headings">
                Trainer
              </span>
              <div className="bg-black rounded-lg px-2 py-2 ml-1">
                <span className="font-heading font-semibold text-[20px] leading-[24px] text-white">
                  Base
                </span>
              </div>
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={(e) => {
              onToggleCollapse?.();
              e.currentTarget.blur(); // Remove focus after click
            }}
          >
            {collapsed ? <Menu size={24} /> : <X size={24} />}
          </Button>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-[#d9d9d9]" />

        {/* Navigation Items */}
        <div className="flex flex-col gap-1 w-full">
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            const isSelected = currentPath === item.href;

            return (
              <SidebarNavItem
                key={`${item.label}`}
                icon={<IconComponent size={24} />}
                label={item.label}
                badge={item.badge}
                collapsed={collapsed}
                selected={isSelected}
                href={item.href}
              />
            );
          })}
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-[#d9d9d9]" />

        {/* Spacer */}
        <div className="flex-1" />

        {/* Settings */}
        <div className="w-full">
          <SidebarNavItem
            icon={<Settings size={24} />}
            label="Settings"
            badge={undefined}
            collapsed={collapsed}
            selected={currentPath === "/protected/settings"}
            href="/protected/settings"
          />
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-[#d9d9d9]" />

        {/* User Avatar */}
        <div
          className={cn(
            "flex items-center",
            collapsed ? "justify-center" : "gap-3"
          )}
        >
          <div className="w-10 h-10 bg-surface-action rounded-[50px] border border-border-primary flex items-center justify-center flex-shrink-0">
            <span className="font-heading font-semibold text-[24px] leading-[28px] text-white">
              {userInitials}
            </span>
          </div>

          {!collapsed && (
            <div className="flex flex-col items-start min-w-0 flex-1">
              <span className="font-heading font-semibold text-[20px] leading-[24px] text-black truncate">
                {userName}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }
);

DesktopSidebar.displayName = "DesktopSidebar";

export { DesktopSidebar };
