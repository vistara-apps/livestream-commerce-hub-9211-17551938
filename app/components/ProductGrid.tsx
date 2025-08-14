"use client";

import { useState } from "react";
import { Product } from "@/app/lib/types";
import { ProductCard } from "./ProductCard";
import { Skeleton, SkeletonCard } from "./ui/Skeleton";
import { Package, Filter, Search } from "lucide-react";
import { cn } from "@/app/lib/utils";

interface ProductGridProps {
  products: Product[];
  onPurchase: (productId: string) => void;
  onSelect?: (product: Product) => void;
  userTokens: string[];
  isLoading?: boolean;
}

export function ProductGrid({ 
  products, 
  onPurchase, 
  onSelect,
  userTokens,
  isLoading = false
}: ProductGridProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "newest">("featured");
  
  // Filter products based on search query
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Sort products based on selected sort option
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "newest":
        // Assuming newer products have higher IDs
        return b.productId.localeCompare(a.productId);
      case "featured":
      default:
        // Featured products first, then alphabetical
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return a.name.localeCompare(b.name);
    }
  });
  
  // Separate pinned products for featured display
  const pinnedProducts = sortedProducts.filter(p => p.isPinned);
  const otherProducts = sortedProducts.filter(p => !p.isPinned);

  if (isLoading) {
    return (
      <div className="space-y-lg">
        <div className="flex items-center justify-between mb-md">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-10 w-60" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-md">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-lg">
      {/* Search and Filter Controls */}
      <div className="flex flex-col md:flex-row gap-md items-start md:items-center justify-between">
        <h3 className="heading-text">Products ({products.length})</h3>
        
        <div className="flex flex-col sm:flex-row gap-sm w-full md:w-auto">
          <div className="relative flex-1">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500">
              <Search size={16} />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-9 w-full"
            />
          </div>
          
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500">
              <Filter size={16} />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="input-field pl-9 appearance-none pr-8"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">Newest</option>
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products Section */}
      {pinnedProducts.length > 0 && (
        <div className="animate-fade-in">
          <h3 className="heading-text mb-md">Featured Products</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
            {pinnedProducts.map((product) => (
              <ProductCard
                key={product.productId}
                product={product}
                variant="live"
                onPurchase={onPurchase}
                onSelect={onSelect}
                hasAccess={!product.isTokenGated || userTokens.length > 0}
              />
            ))}
          </div>
        </div>
      )}

      {/* All Products Section */}
      {otherProducts.length > 0 && (
        <div className="animate-fade-in">
          <h3 className="heading-text mb-md">
            {pinnedProducts.length > 0 ? "All Products" : "Products"} ({otherProducts.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-md">
            {otherProducts.map((product) => (
              <ProductCard
                key={product.productId}
                product={product}
                variant="preview"
                onPurchase={onPurchase}
                onSelect={onSelect}
                hasAccess={!product.isTokenGated || userTokens.length > 0}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {sortedProducts.length === 0 && (
        <div className="card text-center py-xl animate-fade-in">
          <Package size={48} className="mx-auto mb-md text-neutral-400" />
          <h3 className="font-medium mb-sm">No products found</h3>
          {searchQuery ? (
            <p className="text-sm text-neutral-500">
              No products match your search for "{searchQuery}"
            </p>
          ) : (
            <p className="text-sm text-neutral-500">
              The creator hasn't added any products to this stream yet.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

