"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { SidebarNavItem } from "@/components/ui/sidebar-nav-item";
import { MessageSquare, Settings, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface MobileSideMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const navigationItems = [
  { icon: Phone, label: "Prospects", href: "/protected/prospects" },
  { icon: MessageSquare, label: "Templates", href: "/protected/templates" },
];

export function MobileSideMenu({ open, onOpenChange }: MobileSideMenuProps) {
  const pathname = usePathname();

  const handleNavigation = () => {
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-80 max-w-[320px] p-0 bg-surface-primary pt-[env(safe-area-inset-top)]"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Mobile Navigation Menu</SheetTitle>
          <SheetDescription>
            Navigation menu for mobile devices
          </SheetDescription>
        </SheetHeader>

        {/* Mobile Side Menu Content */}
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[#d9d9d9]">
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
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-10 w-10"
            >
              <X size={24} />
            </Button>
          </div>

          {/* Navigation Items */}
          <div className="flex flex-col gap-1 p-4 flex-1">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              const isSelected = pathname === item.href;

              return (
                <div key={item.label} onClick={handleNavigation}>
                  <SidebarNavItem
                    icon={<IconComponent size={24} />}
                    label={item.label}
                    selected={isSelected}
                    href={item.href}
                    className="w-full"
                  />
                </div>
              );
            })}

            {/* Divider */}
            <div className="w-full h-px bg-[#d9d9d9] my-4" />

            {/* Settings */}
            <div onClick={handleNavigation}>
              <SidebarNavItem
                icon={<Settings size={24} />}
                label="Settings"
                selected={pathname === "/protected/settings"}
                href="/protected/settings"
                className="w-full"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-[#d9d9d9]">
            <div className="text-sm text-text-disabled text-center">
              Training Tracker v1.0
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
