"use client";

import { useState, useEffect } from "react";
import { Product } from "@/app/lib/types";
import { TrendingUp, Info } from "lucide-react";
import { cn } from "@/app/lib/utils";
import { Tooltip } from "./ui/Tooltip";

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

  // Generate points for the curve visualization
  const generateCurvePoints = () => {
    const points = [];
    const width = 300;
    const height = 100;
    const padding = 10;
    
    for (let i = 0; i < 20; i++) {
      const x = padding + (i / 19) * (width - 2 * padding);
      const factor = 1 + Math.sin(i * 0.3) * 0.2 + i * 0.05;
      const y = height - padding - ((factor - 1) / 0.8) * (height - 2 * padding);
      points.push({ x, y });
    }
    
    return points;
  };
  
  const curvePoints = generateCurvePoints();
  const pathD = curvePoints.map((point, i) => 
    `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  ).join(' ');

  if (variant === "display") {
    return (
      <div className="card">
        <div className="flex items-center justify-between mb-md">
          <h4 className="heading-text text-neutral-900">Price Curve</h4>
          <Tooltip content="Price increases as more people purchase this product">
            <div className="text-neutral-500 cursor-help">
              <Info size={16} />
            </div>
          </Tooltip>
        </div>
        
        <div className="flex items-center justify-between mb-md">
          <span className="text-sm text-neutral-500">Current Price</span>
          <span className="text-lg font-bold text-primary">
            ${currentPrice.toFixed(2)} {product.currency}
          </span>
        </div>
        
        <div className="h-32 bg-neutral-100 rounded-md overflow-hidden relative">
          <svg width="100%" height="100%" viewBox="0 0 300 100" preserveAspectRatio="none">
            {/* Grid lines */}
            <line x1="0" y1="25" x2="300" y2="25" stroke="#e5e7eb" strokeWidth="1" />
            <line x1="0" y1="50" x2="300" y2="50" stroke="#e5e7eb" strokeWidth="1" />
            <line x1="0" y1="75" x2="300" y2="75" stroke="#e5e7eb" strokeWidth="1" />
            
            {/* Curve */}
            <path 
              d={pathD} 
              fill="none" 
              stroke="hsl(240 70% 50%)" 
              strokeWidth="2"
              strokeLinecap="round"
            />
            
            {/* Fill under curve */}
            <path 
              d={`${pathD} L 300 100 L 10 100 Z`} 
              fill="hsl(240 70% 95%)" 
              fillOpacity="0.5"
            />
            
            {/* Current point */}
            <circle 
              cx={curvePoints[Math.floor(demand / 5)].x} 
              cy={curvePoints[Math.floor(demand / 5)].y} 
              r="4" 
              fill="hsl(240 70% 50%)" 
            />
          </svg>
          
          <div className="absolute bottom-2 left-2 text-xs text-neutral-500">Supply</div>
          <div className="absolute top-2 right-2 text-xs text-neutral-500">Price</div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-md">
        <h4 className="heading-text text-neutral-900">Dynamic Pricing</h4>
        <Tooltip content="Adjust the sliders to see how supply and demand affect price">
          <div className="text-neutral-500 cursor-help">
            <Info size={16} />
          </div>
        </Tooltip>
      </div>
      
      <div className="grid grid-cols-2 gap-md mb-md">
        <div>
          <label className="text-sm text-neutral-700 flex items-center justify-between mb-sm">
            <span>Supply: {supply}</span>
            <span className="text-xs text-neutral-500">Available units</span>
          </label>
          <input
            type="range"
            min="50"
            max="200"
            value={supply}
            onChange={(e) => setSupply(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>
        <div>
          <label className="text-sm text-neutral-700 flex items-center justify-between mb-sm">
            <span>Demand: {demand}</span>
            <span className="text-xs text-neutral-500">Market interest</span>
          </label>
          <input
            type="range"
            min="10"
            max="100"
            value={demand}
            onChange={(e) => setDemand(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>
      </div>

      <div className="flex items-center justify-between p-md bg-primary-light rounded-md">
        <span className="text-sm text-neutral-700">Live Price</span>
        <span className="text-xl font-bold text-primary">
          ${currentPrice.toFixed(2)} {product.currency}
        </span>
      </div>

      <div className="mt-md h-24 rounded-md overflow-hidden relative">
        <svg width="100%" height="100%" viewBox="0 0 300 100" preserveAspectRatio="none">
          {/* Grid lines */}
          <line x1="0" y1="25" x2="300" y2="25" stroke="#e5e7eb" strokeWidth="1" />
          <line x1="0" y1="50" x2="300" y2="50" stroke="#e5e7eb" strokeWidth="1" />
          <line x1="0" y1="75" x2="300" y2="75" stroke="#e5e7eb" strokeWidth="1" />
          
          {/* Curve */}
          <path 
            d={pathD} 
            fill="none" 
            stroke="hsl(240 70% 50%)" 
            strokeWidth="2"
            strokeLinecap="round"
          />
          
          {/* Fill under curve */}
          <path 
            d={`${pathD} L 300 100 L 10 100 Z`} 
            fill="url(#gradient)" 
            fillOpacity="0.5"
          />
          
          {/* Current point */}
          <circle 
            cx={curvePoints[Math.floor(demand / 5)].x} 
            cy={curvePoints[Math.floor(demand / 5)].y} 
            r="6" 
            fill="hsl(240 70% 50%)" 
          />
          
          {/* Gradient definition */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(240 70% 95%)" />
              <stop offset="100%" stopColor="hsl(30 90% 85%)" />
            </linearGradient>
          </defs>
        </svg>
        
        <div className="absolute bottom-1 left-2 text-xs text-neutral-500">Low Demand</div>
        <div className="absolute bottom-1 right-2 text-xs text-neutral-500">High Demand</div>
      </div>
      
      <div className="mt-md text-xs text-neutral-500 flex items-center">
        <TrendingUp size={14} className="mr-xs text-accent" />
        <span>Price increases as demand rises and supply decreases</span>
      </div>
    </div>
  );
}

