"use client";

import { useState } from "react";
import { Product } from "@/app/lib/types";
import { ShoppingCart, Heart, Lock, Share2 } from "lucide-react";
import { Button } from "./ui/Button";
import { Tooltip } from "./ui/Tooltip";
import { formatPrice } from "@/app/lib/utils";
import { useToast } from "./ui/Toast";

interface ViewerActionButtonsProps {
  product: Product;
  variant: "buy" | "showInterest";
  onPurchase: () => void;
  onShowInterest: () => void;
}

export function ViewerActionButtons({
  product,
  variant,
  onPurchase,
  onShowInterest,
}: ViewerActionButtonsProps) {
  const [isInterested, setIsInterested] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { addToast } = useToast();

  const handlePurchase = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      onPurchase();
      addToast(`Successfully purchased ${product.name}!`, "success");
    } catch (error) {
      addToast("Failed to complete purchase. Please try again.", "error");
      console.error("Purchase error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleShowInterest = () => {
    setIsInterested(!isInterested);
    onShowInterest();
    
    if (!isInterested) {
      addToast("Added to your interests!", "info");
    }
  };

  const handleShare = () => {
    // Mock share functionality
    navigator.clipboard.writeText(`Check out this product: ${product.name}`);
    addToast("Product link copied to clipboard!", "success");
  };

  return (
    <div className="flex flex-col md:flex-row gap-md">
      <div className="flex-1">
        <h4 className="font-semibold text-neutral-900 mb-sm">{product.name}</h4>
        <p className="text-sm text-neutral-600 mb-md line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-primary">
            {formatPrice(product.price, product.currency)}
          </span>
          {product.isTokenGated && (
            <Tooltip content="Token required to purchase this product">
              <span className="badge badge-accent">
                <Lock size={12} className="mr-1" />
                Token Gated
              </span>
            </Tooltip>
          )}
        </div>
        
        {product.stock && (
          <p className="text-xs text-neutral-500 mt-xs">
            {product.stock} items left
          </p>
        )}
      </div>
      
      <div className="flex flex-col gap-sm min-w-[140px]">
        <Button
          onClick={handlePurchase}
          variant="primary"
          size="md"
          icon={<ShoppingCart size={16} />}
          loading={isProcessing}
          fullWidth
        >
          Buy Now
        </Button>
        
        <div className="flex gap-sm">
          <Button
            onClick={handleShowInterest}
            variant={isInterested ? "accent" : "secondary"}
            size="sm"
            icon={<Heart size={16} className={isInterested ? "fill-current" : ""} />}
            ariaLabel={isInterested ? "Remove interest" : "Show interest"}
            fullWidth
          >
            {isInterested ? "Interested" : "Interest"}
          </Button>
          
          <Tooltip content="Share this product">
            <Button
              onClick={handleShare}
              variant="secondary"
              size="sm"
              icon={<Share2 size={16} />}
              ariaLabel="Share product"
            />
          </Tooltip>
        </div>
      </div>
    </div>
  );
}

