
"use client";

import { type ReactNode } from "react";
import { cn } from "@/app/lib/utils";

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "accent" | "ghost";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  icon?: ReactNode;
}

export function Button({ 
  children, 
  variant = "primary", 
  size = "md", 
  onClick, 
  disabled = false,
  className,
  icon
}: ButtonProps) {
  const baseClasses = "inline-flex items-center justify-center font-medium transition-colors duration-200 rounded-md";
  
  const variantClasses = {
    primary: "bg-primary hover:bg-primary/90 text-white",
    secondary: "bg-surface hover:bg-neutral-100 text-neutral-900 border border-neutral-100",
    accent: "bg-accent hover:bg-accent/90 text-white",
    ghost: "hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900",
  };

  const sizeClasses = {
    sm: "px-md py-sm text-sm",
    md: "px-lg py-md text-base",
    lg: "px-xl py-lg text-lg",
  };

  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        disabledClasses,
        className
      )}
    >
      {icon && <span className="mr-xs">{icon}</span>}
      {children}
    </button>
  );
}
