"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  size?: "sm" | "md";
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, size = "md", ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      // Base styles
      "relative shrink-0 rounded-[4px] border-2 transition-colors cursor-pointer",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#398af0] focus-visible:ring-offset-2",
      "disabled:cursor-not-allowed disabled:bg-[#ecedee] disabled:border-[#a1a4aa]",

      // Default state (unchecked)
      "bg-white border-[#d0d1d4]",

      // Hover state
      "hover:bg-[#d7e8fc] hover:border-[#2d6ec0]",

      // Checked state
      "data-[state=checked]:bg-[#398af0] data-[state=checked]:border-[#398af0] data-[state=checked]:text-white",
      "data-[state=checked]:hover:bg-[#2d6ec0] data-[state=checked]:hover:border-[#2d6ec0]",

      // Size variants
      size === "sm" ? "h-4 w-4" : "h-6 w-6",

      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      <Check className={size === "sm" ? "h-3 w-3" : "h-4 w-4"} />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
