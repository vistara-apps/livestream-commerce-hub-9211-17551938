"use client";

import { cn } from "@/app/lib/utils";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular" | "card" | "image";
  width?: string | number;
  height?: string | number;
  animation?: "pulse" | "wave" | "none";
}

export function Skeleton({
  className,
  variant = "text",
  width,
  height,
  animation = "pulse",
}: SkeletonProps) {
  const baseClasses = "bg-neutral-200";
  
  const variantClasses = {
    text: "h-4 w-full rounded",
    circular: "rounded-full",
    rectangular: "rounded-md",
    card: "rounded-lg",
    image: "rounded-md",
  };
  
  const animationClasses = {
    pulse: "animate-pulse",
    wave: "skeleton-wave",
    none: "",
  };
  
  const style: React.CSSProperties = {
    width: width || (variant === "circular" ? "40px" : "100%"),
    height: height || (variant === "circular" ? "40px" : variant === "text" ? "1rem" : "100px"),
  };
  
  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        animationClasses[animation],
        className
      )}
      style={style}
      aria-hidden="true"
    />
  );
}

export function SkeletonText({
  className,
  lines = 3,
  lastLineWidth = "70%",
  animation = "pulse",
}: {
  className?: string;
  lines?: number;
  lastLineWidth?: string;
  animation?: "pulse" | "wave" | "none";
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          animation={animation}
          className={i === lines - 1 ? "w-[70%]" : ""}
          style={i === lines - 1 ? { width: lastLineWidth } : {}}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({
  className,
  hasImage = true,
  imageHeight = "200px",
  lines = 3,
  animation = "pulse",
}: {
  className?: string;
  hasImage?: boolean;
  imageHeight?: string;
  lines?: number;
  animation?: "pulse" | "wave" | "none";
}) {
  return (
    <div className={cn("rounded-lg overflow-hidden border border-neutral-200", className)}>
      {hasImage && (
        <Skeleton
          variant="rectangular"
          height={imageHeight}
          animation={animation}
          className="rounded-t-lg rounded-b-none"
        />
      )}
      <div className="p-4 space-y-3">
        <Skeleton
          variant="text"
          animation={animation}
          className="w-3/4"
        />
        <SkeletonText
          lines={lines}
          animation={animation}
        />
      </div>
    </div>
  );
}

