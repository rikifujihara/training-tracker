"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, User } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MobileBottomNavProps {
  onMenuClick?: () => void;
}

export function MobileBottomNav({ onMenuClick }: MobileBottomNavProps) {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/protected/prospects",
      icon: User,
      label: "Prospects",
      isActive: pathname === "/protected/prospects",
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border-primary md:hidden">
      <div className="flex items-center justify-center h-[84px] px-0 pt-2">
        {/* Border line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-border-primary" />

        <div className="flex items-center justify-center gap-[52px] flex-1">
          {/* Navigation Items */}
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-12 h-12",
                "transition-colors duration-200"
              )}
            >
              <item.icon
                className={cn(
                  "w-6 h-6 mb-0.5",
                  item.isActive ? "text-text-action" : "text-text-disabled"
                )}
              />
              <span
                className={cn(
                  "text-xs font-normal leading-5",
                  item.isActive ? "text-text-action" : "text-text-disabled"
                )}
              >
                {item.label}
              </span>
            </Link>
          ))}

          {/* Menu Button */}
          <button
            onClick={onMenuClick}
            className={cn(
              "flex flex-col items-center justify-center w-12 h-12",
              "transition-colors duration-200"
            )}
          >
            <Menu className="w-6 h-6 mb-0.5 text-text-disabled" />
            <span className="text-xs font-normal leading-5 text-text-disabled">
              Menu
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
