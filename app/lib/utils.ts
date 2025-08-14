import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names using clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a price with the appropriate currency symbol
 */
export function formatPrice(price: number, currency: string = "USDC") {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const formattedPrice = formatter.format(price).replace("$", "");

  switch (currency) {
    case "ETH":
      return `${formattedPrice} ETH`;
    case "USDC":
    default:
      return `$${formattedPrice}`;
  }
}

/**
 * Generates a unique stream ID
 */
export function generateStreamId() {
  return `stream-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Calculates the price based on a bonding curve
 * As more items are sold, the price increases
 */
export function calculateBondingCurvePrice(soldCount: number, basePrice: number) {
  // Simple bonding curve: price increases by 5% for each item sold
  const multiplier = 1 + (soldCount * 0.05);
  return basePrice * multiplier;
}

/**
 * Truncates a string to a specified length and adds ellipsis
 */
export function truncateString(str: string, maxLength: number) {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + "...";
}

/**
 * Formats a date to a readable string
 */
export function formatDate(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Formats a time to a readable string
 */
export function formatTime(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Formats a wallet address to a readable string
 */
export function formatWalletAddress(address: string) {
  if (!address) return "";
  if (address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Debounces a function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function(...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttles a function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  
  return function(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

