"use client";

import { useState, useRef, useEffect, ReactNode } from "react";
import { cn } from "@/app/lib/utils";

interface TooltipProps {
  children: ReactNode;
  content: string;
  position?: "top" | "right" | "bottom" | "left";
  delay?: number;
  className?: string;
  maxWidth?: string;
}

export function Tooltip({
  children,
  content,
  position = "top",
  delay = 300,
  className,
  maxWidth = "200px",
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);
  const childRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const positionClasses = {
    top: "bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 mb-2",
    right: "left-full top-1/2 transform -translate-y-1/2 translate-x-2 ml-2",
    bottom: "top-full left-1/2 transform -translate-x-1/2 translate-y-2 mt-2",
    left: "right-full top-1/2 transform -translate-y-1/2 -translate-x-2 mr-2",
  };

  const arrowClasses = {
    top: "bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full border-t-neutral-800 border-l-transparent border-r-transparent border-b-transparent",
    right: "left-0 top-1/2 transform -translate-y-1/2 -translate-x-full border-r-neutral-800 border-t-transparent border-b-transparent border-l-transparent",
    bottom: "top-0 left-1/2 transform -translate-x-1/2 -translate-y-full border-b-neutral-800 border-l-transparent border-r-transparent border-t-transparent",
    left: "right-0 top-1/2 transform -translate-y-1/2 translate-x-full border-l-neutral-800 border-t-transparent border-b-transparent border-r-transparent",
  };

  const handleMouseEnter = () => {
    timerRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
      ref={childRef}
    >
      {children}
      
      {isVisible && (
        <div
          ref={tooltipRef}
          className={cn(
            "absolute z-50 px-md py-sm rounded-md bg-neutral-800 text-white text-xs font-medium shadow-lg animate-fade-in",
            positionClasses[position],
            className
          )}
          style={{ maxWidth }}
          role="tooltip"
        >
          {content}
          <div
            className={cn(
              "absolute w-0 h-0 border-4",
              arrowClasses[position]
            )}
          />
        </div>
      )}
    </div>
  );
}

