"use client";

interface Product {
  productId: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  onChainLink?: string;
  isTokenGated: boolean;
}

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
  return (
    <div className="flex gap-md">
      <div className="flex-1">
        <h4 className="font-semibold text-neutral-900 mb-sm">{product.name}</h4>
        <p className="text-sm text-neutral-500 mb-md">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-primary">
            ${product.price} USDC
          </span>
          {product.isTokenGated && (
            <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded">
              🔒 Token Gated
            </span>
          )}
        </div>
      </div>
      
      <div className="flex flex-col gap-sm">
        <button
          onClick={onPurchase}
          className="btn-primary px-lg py-md"
        >
          Buy Now
        </button>
        <button
          onClick={onShowInterest}
          className="bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-lg py-md rounded-md font-medium transition-colors"
        >
          Show Interest
        </button>
      </div>
    </div>
  );
}
