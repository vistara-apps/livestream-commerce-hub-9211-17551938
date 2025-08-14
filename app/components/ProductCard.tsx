"use client";

import { Product } from "@/app/lib/types";
import { formatPrice, calculateBondingCurvePrice } from "@/app/lib/utils";
import { ShoppingCart, Lock, Package, TrendingUp } from "lucide-react";
import { cn } from "@/app/lib/utils";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
  variant?: "live" | "preview";
  onPurchase: (productId: string) => void;
  onSelect?: (product: Product) => void;
  hasAccess?: boolean;
}

export function ProductCard({ 
  product, 
  variant = "preview", 
  onPurchase, 
  onSelect,
  hasAccess = true
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Mock bonding curve data
  const soldCount = Math.floor(Math.random() * 20);
  const bondingCurvePrice = calculateBondingCurvePrice(soldCount, product.price);
  const showBondingCurve = variant === "live" && soldCount > 0;

  const handlePurchaseClick = () => {
    if (hasAccess) {
      onPurchase(product.productId);
    }
  };

  const handleCardClick = () => {
    if (onSelect && hasAccess) {
      onSelect(product);
    }
  };

  return (
    <div
      className={cn(
        "card-product",
        variant === "live" && "ring-2 ring-accent/20",
        !hasAccess && "opacity-60",
        onSelect && hasAccess && "cursor-pointer"
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
            className="w-full h-full object-cover transition-transform duration-200"
            style={{ transform: isHovered ? "scale(1.05)" : "scale(1)" }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package size={48} className="text-neutral-500" />
          </div>
        )}

        {/* Overlays */}
        {product.isTokenGated && (
          <div className="absolute top-sm right-sm">
            <div className="bg-accent text-white p-xs rounded-full">
              <Lock size={12} />
            </div>
          </div>
        )}

        {variant === "live" && product.isPinned && (
          <div className="absolute top-sm left-sm">
            <div className="bg-primary text-white px-xs py-xs rounded text-xs font-medium">
              FEATURED
            </div>
          </div>
        )}

        {showBondingCurve && (
          <div className="absolute bottom-sm left-sm">
            <div className="bg-neutral-900/75 text-white px-xs py-xs rounded flex items-center space-x-xs text-xs">
              <TrendingUp size={12} />
              <span>{soldCount} sold</span>
            </div>
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
            <div className="text-xs text-accent">
              Price increases with demand ↗
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePurchaseClick();
          }}
          disabled={!hasAccess}
          className={cn(
            "w-full flex items-center justify-center space-x-xs py-sm px-md rounded-md font-medium transition-colors duration-200",
            hasAccess
              ? "bg-primary hover:bg-primary/90 text-white"
              : "bg-neutral-100 text-neutral-500 cursor-not-allowed"
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
            Secure checkout with USDC
          </p>
        )}
      </div>
    </div>
  );
}

