
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, currency = "USDC"): string {
  return `$${price.toFixed(2)} ${currency}`;
}

export function formatViewerCount(count: number): string {
  if (count < 1000) return count.toString();
  if (count < 1000000) return `${(count / 1000).toFixed(1)}K`;
  return `${(count / 1000000).toFixed(1)}M`;
}

export function truncateAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function generateStreamId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export function calculateBondingCurvePrice(supply: number, basePrice: number = 1): number {
  // Simple bonding curve: price = basePrice * (1 + supply/100)
  return basePrice * (1 + supply / 100);
}
