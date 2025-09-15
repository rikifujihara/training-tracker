import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex text-xs px-2.5 py-1 items-center gap-1 justify-center border-transparent transition-colors focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-full",
  {
    variants: {
      variant: {
        default: " bg-primary text-primary-foreground shadow-sm",
        secondary: " font-semibold bg-secondary text-secondary-foreground",
        destructive:
          " font-semibold bg-destructive text-destructive-foreground shadow-sm",
        outline: " font-semibold text-foreground border border-border",
        "status-hot":
          "px-1 py-0 text-[12px] leading-[20px] font-normal rounded-[50px] bg-icon-error text-text-on-action whitespace-nowrap",
        "status-warm":
          "px-1 py-0 text-[12px] leading-[20px] font-normal rounded-[50px] bg-icon-warning text-text-on-action whitespace-nowrap",
        "status-cold":
          "px-1 py-0 text-[12px] leading-[20px] font-normal rounded-[50px] bg-blue-500 text-text-on-action whitespace-nowrap",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
