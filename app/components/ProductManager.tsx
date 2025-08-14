
"use client";

import { useState } from "react";
import { Product } from "@/app/lib/types";
import { formatPrice } from "@/app/lib/utils";
import { Plus, X, Package } from "lucide-react";

interface ProductManagerProps {
  products: Product[];
  onAddProduct: (product: Omit<Product, "productId" | "streamId">) => void;
  onRemoveProduct: (productId: string) => void;
}

export function ProductManager({ products, onAddProduct, onRemoveProduct }: ProductManagerProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    currency: "USDC" as "USDC" | "ETH",
    imageUrl: "",
    isTokenGated: false,
    stock: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.price) return;

    onAddProduct({
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      currency: formData.currency,
      imageUrl: formData.imageUrl || "/api/placeholder/product",
      isTokenGated: formData.isTokenGated,
      stock: formData.stock ? parseInt(formData.stock) : undefined,
      isPinned: false,
    });

    setFormData({
      name: "",
      description: "",
      price: "",
      currency: "USDC",
      imageUrl: "",
      isTokenGated: false,
      stock: "",
    });
    setShowAddForm(false);
  };

  return (
    <div className="space-y-lg">
      <div className="flex items-center justify-between">
        <h2 className="heading-text">Products ({products.length})</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn-primary flex items-center space-x-xs"
        >
          <Plus size={16} />
          <span>Add Product</span>
        </button>
      </div>

      {showAddForm && (
        <div className="card">
          <div className="flex items-center justify-between mb-lg">
            <h3 className="font-medium">Add New Product</h3>
            <button
              onClick={() => setShowAddForm(false)}
              className="p-xs rounded hover:bg-neutral-100 transition-colors duration-200"
            >
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-md">
            <div className="grid-12 gap-md">
              <div className="col-span-12 md:col-span-6">
                <label className="block text-sm font-medium mb-xs">Product Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter product name..."
                  className="input-field w-full"
                  required
                />
              </div>

              <div className="col-span-12 md:col-span-6">
                <label className="block text-sm font-medium mb-xs">Price</label>
                <div className="flex space-x-xs">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="0.00"
                    className="input-field flex-1"
                    required
                  />
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value as "USDC" | "ETH" }))}
                    className="input-field"
                  >
                    <option value="USDC">USDC</option>
                    <option value="ETH">ETH</option>
                  </select>
                </div>
              </div>

              <div className="col-span-12">
                <label className="block text-sm font-medium mb-xs">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your product..."
                  rows={2}
                  className="input-field w-full resize-none"
                />
              </div>

              <div className="col-span-12 md:col-span-6">
                <label className="block text-sm font-medium mb-xs">Image URL</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                  className="input-field w-full"
                />
              </div>

              <div className="col-span-12 md:col-span-6">
                <label className="block text-sm font-medium mb-xs">Stock (optional)</label>
                <input
                  type="number"
                  min="1"
                  value={formData.stock}
                  onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                  placeholder="Unlimited"
                  className="input-field w-full"
                />
              </div>
            </div>

            <div className="flex items-center space-x-xs">
              <input
                type="checkbox"
                id="productTokenGated"
                checked={formData.isTokenGated}
                onChange={(e) => setFormData(prev => ({ ...prev, isTokenGated: e.target.checked }))}
                className="rounded"
              />
              <label htmlFor="productTokenGated" className="text-sm">
                Token-gated product
              </label>
            </div>

            <div className="flex justify-end space-x-md">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Add Product
              </button>
            </div>
          </form>
        </div>
      )}

      {products.length > 0 ? (
        <div className="grid-12 gap-md">
          {products.map((product) => (
            <div key={product.productId} className="col-span-12 md:col-span-6 lg:col-span-4">
              <div className="card-product">
                <div className="aspect-square bg-neutral-100 flex items-center justify-center">
                  {product.imageUrl && product.imageUrl !== "/api/placeholder/product" ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Package size={48} className="text-neutral-500" />
                  )}
                </div>
                
                <div className="p-md">
                  <div className="flex items-start justify-between mb-xs">
                    <h4 className="font-medium text-sm">{product.name}</h4>
                    <button
                      onClick={() => onRemoveProduct(product.productId)}
                      className="p-xs rounded hover:bg-neutral-100 transition-colors duration-200"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  
                  {product.description && (
                    <p className="text-xs text-neutral-500 mb-sm line-clamp-2">
                      {product.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-primary">
                      {formatPrice(product.price, product.currency)}
                    </span>
                    {product.isTokenGated && (
                      <span className="text-xs bg-accent/10 text-accent px-xs py-xs rounded">
                        Token Gated
                      </span>
                    )}
                  </div>
                  
                  {product.stock && (
                    <p className="text-xs text-neutral-500 mt-xs">
                      Stock: {product.stock}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-xl">
          <Package size={48} className="mx-auto mb-md text-neutral-500" />
          <h3 className="font-medium mb-sm">No products added yet</h3>
          <p className="text-sm text-neutral-500 mb-lg">
            Add products to showcase during your live stream
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-primary"
          >
            Add Your First Product
          </button>
        </div>
      )}
    </div>
  );
}
