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

export function Select({ value, onValueChange, children }: SelectProps) {
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
        {React.Children.map(children, (child) =>
          React.isValidElement(child)
            ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
              React.cloneElement(child, { isOpen } as any)
            : child
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
  children,
  leftIcon,
  rightIcon,
  ...props
}: {
  className?: string;
  placeholder?: string;
  isOpen?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}) {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error("SelectTrigger must be used within Select");

  const { value, onOpenChange } = context;

  return (
    <button
      type="button"
      className={cn(
        "flex h-12 w-full items-center gap-2 rounded border border-border-primary bg-surface-primary px-3 py-2 text-[16px] leading-[24px] text-text-body placeholder:text-text-disabled focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      onClick={() => onOpenChange(!isOpen)}
      disabled={disabled}
      {...props}
    >
      {leftIcon && (
        <div className="flex-shrink-0 text-text-body">{leftIcon}</div>
      )}
      <span
        className={cn(
          "flex-1 text-left",
          value ? "text-text-body" : "text-text-disabled"
        )}
      >
        {children || value || placeholder}
      </span>
      <div className="flex items-center gap-2 flex-shrink-0">
        {rightIcon ? (
          <div className="w-6 h-6 text-text-body">{rightIcon}</div>
        ) : (
          <ChevronDown className="h-6 w-6 text-text-disabled" />
        )}
      </div>
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
        "absolute top-full z-50 w-full rounded border border-border-primary bg-surface-primary mt-1 shadow-md",
        className
      )}
      {...props}
    >
      <div className="max-h-60 overflow-auto p-1">{children}</div>
    </div>
  );
}

export function SelectItem({
  value,
  className,
  children,
  ...props
}: SelectItemProps) {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error("SelectItem must be used within Select");

  const { onValueChange, onOpenChange } = context;

  return (
    <button
      type="button"
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center px-3 py-2 text-[16px] leading-[24px] text-text-body outline-none hover:bg-surface-action-secondary focus:bg-surface-action-secondary data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
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
