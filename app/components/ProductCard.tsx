"use client";

import { Product } from "@/app/lib/types";
import { formatPrice, calculateBondingCurvePrice } from "@/app/lib/utils";
import { ShoppingCart, Lock, Package, TrendingUp, Eye } from "lucide-react";
import { cn } from "@/app/lib/utils";
import { useState } from "react";
import { Tooltip } from "./ui/Tooltip";

interface ProductCardProps {
  product: Product;
  variant?: "live" | "preview";
  onPurchase: (productId: string) => void;
  onSelect?: (product: Product) => void;
  hasAccess?: boolean;
  isLoading?: boolean;
}

export function ProductCard({ 
  product, 
  variant = "preview", 
  onPurchase, 
  onSelect,
  hasAccess = true,
  isLoading = false
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Mock bonding curve data
  const soldCount = Math.floor(Math.random() * 20);
  const bondingCurvePrice = calculateBondingCurvePrice(soldCount, product.price);
  const showBondingCurve = variant === "live" && soldCount > 0;

  const handlePurchaseClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasAccess) {
      onPurchase(product.productId);
    }
  };

  const handleCardClick = () => {
    if (onSelect && !isLoading) {
      onSelect(product);
    }
  };

  if (isLoading) {
    return (
      <div className="card-product animate-pulse">
        <div className="aspect-square bg-neutral-200"></div>
        <div className="p-md space-y-sm">
          <div className="h-5 bg-neutral-200 rounded w-3/4"></div>
          <div className="h-4 bg-neutral-200 rounded w-full"></div>
          <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
          <div className="h-9 bg-neutral-200 rounded w-full mt-md"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "card-product cursor-pointer",
        variant === "live" && "ring-2 ring-accent/20",
        !hasAccess && "opacity-60",
        onSelect && "hover:translate-y-[-4px]"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* Product Image */}
      <div className="relative aspect-square bg-neutral-100 overflow-hidden">
        {product.imageUrl && product.imageUrl !== "/api/placeholder/400/400" ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300"
            style={{ transform: isHovered ? "scale(1.05)" : "scale(1)" }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package size={48} className="text-neutral-400" />
          </div>
        )}

        {/* Overlays */}
        {product.isTokenGated && (
          <Tooltip content="Token required to purchase this product" position="top">
            <div className="absolute top-sm right-sm">
              <div className="badge badge-accent">
                <Lock size={12} className="mr-1" />
                <span>Token Gated</span>
              </div>
            </div>
          </Tooltip>
        )}

        {variant === "live" && product.isPinned && (
          <div className="absolute top-sm left-sm">
            <div className="badge badge-primary">
              FEATURED
            </div>
          </div>
        )}

        {showBondingCurve && (
          <Tooltip content="Price increases with demand" position="bottom">
            <div className="absolute bottom-sm left-sm">
              <div className="bg-neutral-900/75 text-white px-sm py-xs rounded-md flex items-center space-x-xs text-xs">
                <TrendingUp size={12} />
                <span>{soldCount} sold</span>
              </div>
            </div>
          </Tooltip>
        )}

        {/* Quick view overlay on hover */}
        {isHovered && onSelect && (
          <div className="absolute inset-0 bg-neutral-900/40 flex items-center justify-center animate-fade-in">
            <button 
              className="bg-white text-neutral-900 px-md py-sm rounded-md text-sm font-medium flex items-center"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(product);
              }}
            >
              <Eye size={16} className="mr-sm" />
              Quick View
            </button>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-md space-y-sm">
        <div>
          <h4 className="font-medium text-sm line-clamp-1">{product.name}</h4>
          {product.description && (
            <p className="text-xs text-neutral-500 line-clamp-2 mt-xs">
              {product.description}
            </p>
          )}
        </div>

        {/* Price and Bonding Curve */}
        <div className="space-y-xs">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-semibold text-primary">
                {formatPrice(showBondingCurve ? bondingCurvePrice : product.price, product.currency)}
              </span>
              {showBondingCurve && product.price !== bondingCurvePrice && (
                <span className="text-xs text-neutral-500 line-through ml-xs">
                  {formatPrice(product.price, product.currency)}
                </span>
              )}
            </div>
            
            {product.stock && (
              <span className="text-xs text-neutral-500">
                {product.stock} left
              </span>
            )}
          </div>

          {showBondingCurve && (
            <div className="text-xs text-accent flex items-center">
              <TrendingUp size={12} className="mr-xs" />
              Price increases with demand
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={handlePurchaseClick}
          disabled={!hasAccess}
          className={cn(
            "w-full flex items-center justify-center space-x-xs py-sm px-md rounded-md font-medium transition-all duration-200",
            hasAccess
              ? "bg-primary hover:bg-primary/90 active:bg-primary/80 text-white shadow-sm hover:shadow"
              : "bg-neutral-200 text-neutral-500 cursor-not-allowed"
          )}
        >
          {product.isTokenGated && !hasAccess ? (
            <>
              <Lock size={14} />
              <span>Token Required</span>
            </>
          ) : (
            <>
              <ShoppingCart size={14} />
              <span>Buy Now</span>
            </>
          )}
        </button>

        {variant === "live" && hasAccess && (
          <p className="text-xs text-center text-neutral-500">
            Secure checkout with {product.currency}
          </p>
        )}
      </div>
    </div>
  );
}

