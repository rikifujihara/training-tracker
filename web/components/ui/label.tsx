"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";
import { HelpCircle } from "lucide-react";

import { cn } from "@/lib/utils";

const labelVariants = cva(
  "text-[16px] leading-[24px] font-semibold text-text-headings peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
);

interface LabelProps extends 
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>,
  VariantProps<typeof labelVariants> {
  showHelp?: boolean;
  onHelpClick?: () => void;
}

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps
>(({ className, children, showHelp, onHelpClick, ...props }, ref) => (
  <div className="flex items-center gap-3">
    <LabelPrimitive.Root
      ref={ref}
      className={cn(labelVariants(), className)}
      {...props}
    >
      {children}
    </LabelPrimitive.Root>
    {showHelp && (
      <button
        type="button"
        onClick={onHelpClick}
        className="w-6 h-6 text-icon-information hover:opacity-75 transition-opacity"
      >
        <HelpCircle className="w-6 h-6" />
      </button>
    )}
  </div>
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
