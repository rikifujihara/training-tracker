import { ReactNode } from "react";

interface ProviderButtonProps {
  onClick: () => void;
  disabled: boolean;
  icon: ReactNode;
  children: ReactNode;
  variant: "google" | "github";
}

const variantStyles = {
  google: "bg-red-600 hover:bg-red-700 focus:ring-red-500 text-red-300 group-hover:text-red-200",
  github: "bg-gray-800 hover:bg-gray-700 focus:ring-gray-500 text-gray-300 group-hover:text-gray-200",
};

export function ProviderButton({ onClick, disabled, icon, children, variant }: ProviderButtonProps) {
  const baseClasses = "group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out";
  const variantClasses = variantStyles[variant];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses}`}
    >
      <span className="absolute left-0 inset-y-0 flex items-center pl-3">
        <span className={`h-5 w-5 ${variant === 'google' ? 'text-red-300 group-hover:text-red-200' : 'text-gray-300 group-hover:text-gray-200'}`}>
          {icon}
        </span>
      </span>
      {children}
    </button>
  );
}