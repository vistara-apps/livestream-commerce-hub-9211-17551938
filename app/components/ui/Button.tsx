"use client";

import { type ReactNode } from "react";
import { cn } from "@/app/lib/utils";

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "accent" | "ghost" | "danger";
  size?: "xs" | "sm" | "md" | "lg";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  type?: "button" | "submit" | "reset";
  loading?: boolean;
  ariaLabel?: string;
}

export function Button({ 
  children, 
  variant = "primary", 
  size = "md", 
  onClick, 
  disabled = false,
  className,
  icon,
  iconPosition = "left",
  fullWidth = false,
  type = "button",
  loading = false,
  ariaLabel,
}: ButtonProps) {
  const baseClasses = "inline-flex items-center justify-center font-medium transition-all duration-200 rounded-md focus:outline-none";
  
  const variantClasses = {
    primary: "bg-primary hover:bg-primary/90 active:bg-primary/80 text-white shadow-sm hover:shadow focus:ring-2 focus:ring-primary/30 focus:ring-offset-1",
    secondary: "bg-surface hover:bg-neutral-100 active:bg-neutral-200 text-neutral-900 border border-neutral-200 focus:ring-2 focus:ring-neutral-300 focus:ring-offset-1",
    accent: "bg-accent hover:bg-accent/90 active:bg-accent/80 text-white shadow-sm hover:shadow focus:ring-2 focus:ring-accent/30 focus:ring-offset-1",
    ghost: "bg-transparent hover:bg-neutral-100 active:bg-neutral-200 text-neutral-700 focus:ring-2 focus:ring-neutral-200 focus:ring-offset-1",
    danger: "bg-error hover:bg-error/90 active:bg-error/80 text-white shadow-sm hover:shadow focus:ring-2 focus:ring-error/30 focus:ring-offset-1",
  };

  const sizeClasses = {
    xs: "px-sm py-xs text-xs",
    sm: "px-md py-sm text-sm",
    md: "px-lg py-md text-base",
    lg: "px-xl py-lg text-lg",
  };

  const disabledClasses = disabled || loading 
    ? "opacity-50 cursor-not-allowed pointer-events-none" 
    : "";
  
  const widthClasses = fullWidth ? "w-full" : "";

  // Loading spinner
  const loadingSpinner = (
    <svg 
      className="animate-spin -ml-1 mr-2 h-4 w-4" 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      ></circle>
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        disabledClasses,
        widthClasses,
        className
      )}
      aria-label={ariaLabel}
    >
      {loading && loadingSpinner}
      {icon && iconPosition === "left" && !loading && <span className="mr-sm">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === "right" && <span className="ml-sm">{icon}</span>}
    </button>
  );
}

