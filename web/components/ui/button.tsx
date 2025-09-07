import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-3 whitespace-nowrap rounded-[4px] text-[16px] leading-[24px] font-semibold transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-surface-action focus-visible:ring-offset-2 disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:size-6 [&_svg]:shrink-0 cursor-pointer hover:cursor-pointer active:opacity-30",
  {
    variants: {
      variant: {
        default:
          "bg-surface-action text-text-on-action hover:bg-surface-action-hover focus:bg-surface-action disabled:bg-surface-disabled disabled:text-text-on-disabled",
        primary:
          "bg-surface-action text-text-on-action hover:bg-surface-action-hover focus:bg-surface-action disabled:bg-surface-disabled disabled:text-text-on-disabled",
        secondary:
          "bg-surface-action-secondary text-text-body hover:bg-surface-action-hover-2 focus:bg-surface-action-secondary disabled:bg-surface-action-secondary disabled:text-text-on-disabled",
        ghost:
          "bg-transparent text-text-body hover:bg-surface-action-hover-2 focus:bg-transparent disabled:bg-transparent disabled:text-text-disabled",
        destructive:
          "bg-destructive text-text-on-action hover:bg-destructive/90 focus:bg-destructive disabled:bg-surface-disabled disabled:text-text-on-disabled",
        outline:
          "border border-border-primary bg-surface-primary text-text-body hover:bg-surface-action-hover-2 focus:bg-surface-primary disabled:bg-surface-primary disabled:text-text-disabled disabled:border-border-primary/50",
        link: "text-text-action underline-offset-4 hover:underline hover:text-text-action-hover focus:text-text-action disabled:text-text-disabled disabled:no-underline",
      },
      size: {
        default: "px-6 py-3 min-h-12",
        sm: "px-4 py-2 min-h-8 text-[14px] leading-[20px] gap-2 [&_svg]:size-4",
        lg: "px-8 py-4 min-h-14 text-[18px] leading-[26px]",
        icon: "min-h-12 min-w-12 p-3",
        "icon-sm": "min-h-8 min-w-8 p-2 [&_svg]:size-4",
        "icon-lg": "min-h-14 min-w-14 p-4",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
