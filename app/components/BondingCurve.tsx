"use client";

import { useState, useEffect } from "react";
import { Product } from "@/app/lib/types";

interface BondingCurveProps {
  product: Product;
  variant: "display" | "interactive";
  onPriceUpdate?: (price: number) => void;
}

export function BondingCurve({
  product,
  variant,
  onPriceUpdate,
}: BondingCurveProps) {
  const [currentPrice, setCurrentPrice] = useState(product.price);
  const [supply, setSupply] = useState(100); // Mock supply
  const [demand, setDemand] = useState(50); // Mock demand

  // Simulate bonding curve pricing
  useEffect(() => {
    const basePrice = product.price;
    const demandMultiplier = 1 + (demand / 100);
    const supplyMultiplier = 1 + (supply / 1000);
    const newPrice = basePrice * demandMultiplier * supplyMultiplier;
    
    setCurrentPrice(newPrice);
    onPriceUpdate?.(newPrice);
  }, [demand, supply, product.price, onPriceUpdate]);

  // Mock data for the curve visualization
  const priceHistory = Array.from({ length: 20 }, (_, i) => ({
    x: i,
    y: product.price * (1 + Math.sin(i * 0.3) * 0.2 + i * 0.05),
  }));

  if (variant === "display") {
    return (
      <div className="card">
        <h4 className="heading text-neutral-900 mb-md">Price Curve</h4>
        <div className="flex items-center justify-between mb-md">
          <span className="text-sm text-neutral-500">Current Price</span>
          <span className="text-lg font-bold text-primary">
            ${currentPrice.toFixed(2)} {product.currency}
          </span>
        </div>
        <div className="h-32 bg-neutral-100 rounded-md flex items-center justify-center">
          <span className="text-sm text-neutral-500">Price Chart</span>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h4 className="heading text-neutral-900 mb-md">Dynamic Pricing</h4>
      
      <div className="grid grid-cols-2 gap-md mb-md">
        <div>
          <label className="text-sm text-neutral-500 block mb-sm">
            Supply: {supply}
          </label>
          <input
            type="range"
            min="50"
            max="200"
            value={supply}
            onChange={(e) => setSupply(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <label className="text-sm text-neutral-500 block mb-sm">
            Demand: {demand}
          </label>
          <input
            type="range"
            min="10"
            max="100"
            value={demand}
            onChange={(e) => setDemand(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      <div className="flex items-center justify-between p-md bg-neutral-100 rounded-md">
        <span className="text-sm text-neutral-500">Live Price</span>
        <span className="text-xl font-bold text-primary">
          ${currentPrice.toFixed(2)} {product.currency}
        </span>
      </div>

      <div className="mt-md h-24 bg-gradient-to-r from-primary/20 to-accent/20 rounded-md flex items-center justify-center">
        <span className="text-sm text-neutral-600">Bonding Curve Visualization</span>
      </div>
    </div>
  );
}

