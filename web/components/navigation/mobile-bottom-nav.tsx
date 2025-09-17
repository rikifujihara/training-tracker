"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDeviceInfo } from "@/lib/hooks/use-device-info";

export interface MobileBottomNavProps {
  onMenuClick?: () => void;
}

export function MobileBottomNav({ onMenuClick }: MobileBottomNavProps) {
  const pathname = usePathname();
  const { isPWA, isIOS, isAndroid, hasHomeIndicator } = useDeviceInfo();

  const navItems = [
    {
      href: "/protected/prospects",
      icon: User,
      label: "Prospects",
      isActive: pathname === "/protected/prospects",
    },
  ];

  // Calculate dynamic styling based on device and PWA status
  const getNavStyles = () => {
    let containerClasses =
      "fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border-primary md:hidden";
    let heightClasses = "h-22";
    let paddingClasses = "px-0 py-0";

    if (isPWA) {
      if (isIOS) {
        // iOS PWA: Use CSS environment variables for proper safe area handling
        if (hasHomeIndicator) {
          // Modern iOS devices with Face ID - use CSS env() for precise spacing
          paddingClasses = "px-0 pt-0 pb-2";
        } else {
          // Older iOS devices with home button
          heightClasses = "h-safe-nav";
          paddingClasses = "px-0 pt-2 pb-2";
        }
      }
    } else if (!isPWA) {
      if (isAndroid) {
        paddingClasses = "px-0 pt-0 pb-2";
      }
    }

    return { containerClasses, heightClasses, paddingClasses };
  };

  const { containerClasses, heightClasses, paddingClasses } = getNavStyles();

  return (
    <div className={containerClasses}>
      <div
        className={cn(
          "flex items-center justify-center",
          heightClasses,
          paddingClasses
        )}
      >
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
                "transition-colors duration-200",
                // Add subtle visual adjustment for PWA mode
                isPWA && "transform translate-y-[-2px]"
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
              "transition-colors duration-200",
              // Add subtle visual adjustment for PWA mode
              isPWA && "transform translate-y-[-2px]"
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
