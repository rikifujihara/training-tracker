"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const sidebarNavItemVariants = cva(
  "flex items-center rounded px-4 py-3 transition-colors cursor-pointer",
  {
    variants: {
      status: {
        default: "hover:bg-surface-action-secondary",
        selected: "bg-surface-action text-text-on-action",
        hover: "bg-surface-action-secondary",
      },
      collapsed: {
        default: "gap-3",
        collapsed: "gap-3 justify-center",
      },
    },
    defaultVariants: {
      status: "default",
      collapsed: "default",
    },
  }
);

export interface SidebarNavItemProps
  extends React.HTMLAttributes<HTMLDivElement>,
    Omit<VariantProps<typeof sidebarNavItemVariants>, 'collapsed'> {
  icon: React.ReactNode;
  label: string;
  badge?: string | number;
  collapsed?: boolean;
  selected?: boolean;
  href?: string;
}

const SidebarNavItem = React.forwardRef<HTMLDivElement, SidebarNavItemProps>(
  ({ className, icon, label, badge, collapsed, selected, href, ...props }, ref) => {
    const status = selected ? "selected" : "default";
    const collapsedState = collapsed ? "collapsed" : "default";

    const content = (
      <div
        ref={ref}
        className={cn(
          sidebarNavItemVariants({ status, collapsed: collapsedState }),
          className
        )}
        {...props}
      >
        {/* Icon */}
        <div className="flex-shrink-0 w-6 h-6 text-current">
          {icon}
        </div>

        {/* Label - hidden when collapsed */}
        {!collapsed && (
          <span className="flex-1 text-[16px] leading-[24px] font-semibold min-w-0">
            {label}
          </span>
        )}

        {/* Badge */}
        {badge && (
          <div
            className={cn(
              "flex-shrink-0",
              collapsed && "absolute left-10 top-0.5"
            )}
          >
            <Badge
              variant={selected ? "default" : "secondary"}
              className={cn(
                "h-6 w-6 min-w-6 p-0 text-[12px] leading-[20px] font-semibold rounded-[50px]",
                selected
                  ? "bg-surface-action-hover text-text-on-action"
                  : "bg-surface-action-hover-2 text-text-body"
              )}
            >
              {badge}
            </Badge>
          </div>
        )}
      </div>
    );

    if (href) {
      return (
        <a href={href} className="block">
          {content}
        </a>
      );
    }

    return content;
  }
);

SidebarNavItem.displayName = "SidebarNavItem";

export { SidebarNavItem, sidebarNavItemVariants };