import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const inputVariants = cva(
  [
    // Base styles
    "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground",
    "flex min-w-0 w-full rounded-md border bg-transparent text-base shadow-xs transition-[color,box-shadow] outline-none",
    "file:inline-flex file:border-0 file:bg-transparent file:font-medium",
    "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
    // Focus styles
    "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
    // Invalid styles
    "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  ],
  {
    variants: {
      variant: {
        default: "border-input dark:bg-input/30",
        filled: "bg-muted border-muted dark:bg-muted/50 dark:border-muted/50",
        ghost:
          "border-transparent bg-transparent hover:bg-muted/50 dark:hover:bg-muted/30",
        destructive:
          "border-destructive bg-destructive/10 dark:bg-destructive/20 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
      },
      size: {
        sm: "h-8 px-2.5 py-1 text-sm file:h-6 file:text-xs md:text-xs",
        default: "h-9 px-3 py-1 text-base file:h-7 file:text-sm md:text-sm",
        lg: "h-10 px-4 py-2 text-base file:h-8 file:text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Input({
  className,
  variant,
  size,
  type,
  ...props
}: React.ComponentProps<"input"> & VariantProps<typeof inputVariants>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(inputVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Input, inputVariants };
