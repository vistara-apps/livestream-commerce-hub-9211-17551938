
"use client";

import { Product } from "@/app/lib/types";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  onPurchase: (productId: string) => void;
  userTokens: string[];
}

export function ProductGrid({ products, onPurchase, userTokens }: ProductGridProps) {
  const pinnedProducts = products.filter(p => p.isPinned);
  const otherProducts = products.filter(p => !p.isPinned);

  return (
    <div className="space-y-lg">
      {pinnedProducts.length > 0 && (
        <div>
          <h3 className="heading-text mb-md">Featured Products</h3>
          <div className="grid-12 gap-md">
            {pinnedProducts.map((product) => (
              <div key={product.productId} className="col-span-12 md:col-span-6">
                <ProductCard
                  product={product}
                  variant="live"
                  onPurchase={onPurchase}
                  hasAccess={!product.isTokenGated || userTokens.length > 0}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {otherProducts.length > 0 && (
        <div>
          <h3 className="heading-text mb-md">All Products ({otherProducts.length})</h3>
          <div className="grid-12 gap-md">
            {otherProducts.map((product) => (
              <div key={product.productId} className="col-span-12 sm:col-span-6 lg:col-span-4">
                <ProductCard
                  product={product}
                  variant="preview"
                  onPurchase={onPurchase}
                  hasAccess={!product.isTokenGated || userTokens.length > 0}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {products.length === 0 && (
        <div className="card text-center py-xl">
          <h3 className="font-medium mb-sm">No products available</h3>
          <p className="text-sm text-neutral-500">
            The creator hasn't added any products to this stream yet.
          </p>
        </div>
      )}
    </div>
  );
}
