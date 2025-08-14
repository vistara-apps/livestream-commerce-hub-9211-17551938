"use client";

import { cn } from "@/app/lib/utils";
import * as LucideIcons from "lucide-react";

type IconName = keyof typeof LucideIcons;

interface IconProps {
  name: IconName;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeMap = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
};

export function Icon({ name, size = "md", className }: IconProps) {
  const LucideIcon = LucideIcons[name];
  
  if (!LucideIcon) {
    console.error(`Icon "${name}" not found`);
    return null;
  }
  
  return (
    <LucideIcon 
      size={sizeMap[size]} 
      className={cn("inline-block", className)} 
    />
  );
}

