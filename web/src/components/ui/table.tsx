"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const tableVariants = cva("w-full caption-bottom text-sm", {
  variants: {
    variant: {
      default: "",
      striped: "",
      bordered: "border border-border",
    },
    size: {
      default: "",
      sm: "text-xs",
      lg: "text-base",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

const tableRowVariants = cva("border-b transition-colors", {
  variants: {
    variant: {
      default: "hover:bg-muted/50 data-[state=selected]:bg-muted",
      striped:
        "even:bg-muted/25 hover:bg-muted/50 data-[state=selected]:bg-muted",
      bordered: "hover:bg-muted/50 data-[state=selected]:bg-muted",
      ghost:
        "hover:bg-muted/30 data-[state=selected]:bg-muted/50 border-transparent",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const tableCellVariants = cva(
  "align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
  {
    variants: {
      size: {
        default: "p-2 whitespace-nowrap",
        sm: "p-1 text-xs whitespace-nowrap",
        lg: "p-4 whitespace-nowrap",
        wrap: "p-2", // Allows text wrapping
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

const tableHeadVariants = cva(
  "text-foreground text-left align-middle font-medium [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
  {
    variants: {
      size: {
        default: "h-10 px-2 whitespace-nowrap",
        sm: "h-8 px-1 text-xs whitespace-nowrap",
        lg: "h-12 px-4 whitespace-nowrap",
        wrap: "px-2 py-3", // Allows text wrapping
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

function Table({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<"table"> & VariantProps<typeof tableVariants>) {
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto"
    >
      <table
        data-slot="table"
        className={cn(tableVariants({ variant, size }), className)}
        {...props}
      />
    </div>
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b", className)}
      {...props}
    />
  );
}

function TableBody({
  className,
  variant,
  ...props
}: React.ComponentProps<"tbody"> &
  Pick<VariantProps<typeof tableRowVariants>, "variant">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn(
        "[&_tr:last-child]:border-0",
        variant === "striped" && "[&_tr:nth-child(even)]:bg-muted/25",
        className
      )}
      {...props}
    />
  );
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "bg-muted/50 border-t font-medium [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  );
}

function TableRow({
  className,
  variant,
  ...props
}: React.ComponentProps<"tr"> & VariantProps<typeof tableRowVariants>) {
  return (
    <tr
      data-slot="table-row"
      className={cn(tableRowVariants({ variant }), className)}
      {...props}
    />
  );
}

function TableHead({
  className,
  size,
  ...props
}: React.ComponentProps<"th"> & VariantProps<typeof tableHeadVariants>) {
  return (
    <th
      data-slot="table-head"
      className={cn(tableHeadVariants({ size }), className)}
      {...props}
    />
  );
}

function TableCell({
  className,
  size,
  ...props
}: React.ComponentProps<"td"> & VariantProps<typeof tableCellVariants>) {
  return (
    <td
      data-slot="table-cell"
      className={cn(tableCellVariants({ size }), className)}
      {...props}
    />
  );
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("text-muted-foreground mt-4 text-sm", className)}
      {...props}
    />
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  tableVariants,
  tableRowVariants,
  tableCellVariants,
  tableHeadVariants,
};
