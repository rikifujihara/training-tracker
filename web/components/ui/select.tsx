"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

const SelectContext = React.createContext<{
  value?: string;
  onValueChange?: (value: string) => void;
  onOpenChange: (open: boolean) => void;
} | null>(null);

export function Select({ value, onValueChange, children, ...props }: SelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <SelectContext.Provider
      value={{
        value,
        onValueChange,
        onOpenChange: setIsOpen,
      }}
    >
      <div className="relative">
        {React.Children.map(children, child =>
          React.isValidElement(child) ? React.cloneElement(child, { isOpen, ...props }) : child
        )}
      </div>
    </SelectContext.Provider>
  );
}

export function SelectTrigger({
  className,
  placeholder,
  isOpen,
  disabled,
  ...props
}: {
  className?: string;
  placeholder?: string;
  isOpen?: boolean;
  disabled?: boolean;
}) {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error("SelectTrigger must be used within Select");

  const { value, onOpenChange } = context;

  return (
    <button
      type="button"
      className={cn(
        "flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      onClick={() => onOpenChange(!isOpen)}
      disabled={disabled}
      {...props}
    >
      <span className={value ? "" : "text-muted-foreground"}>
        {value || placeholder}
      </span>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </button>
  );
}

export function SelectContent({
  className,
  isOpen,
  children,
  ...props
}: {
  className?: string;
  isOpen?: boolean;
  children: React.ReactNode;
}) {
  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "absolute top-full z-50 w-full rounded-md border bg-popover mt-1 shadow-md",
        className
      )}
      {...props}
    >
      <div className="max-h-60 overflow-auto p-1">
        {children}
      </div>
    </div>
  );
}

export function SelectItem({ value, className, children, ...props }: SelectItemProps) {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error("SelectItem must be used within Select");

  const { onValueChange, onOpenChange } = context;

  return (
    <button
      type="button"
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      onClick={() => {
        onValueChange?.(value);
        onOpenChange(false);
      }}
      {...props}
    >
      {children}
    </button>
  );
}

export function SelectValue({ placeholder }: { placeholder?: string }) {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error("SelectValue must be used within Select");

  const { value } = context;
  return <>{value || placeholder}</>;
}