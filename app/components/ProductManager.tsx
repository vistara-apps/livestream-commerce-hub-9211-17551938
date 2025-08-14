"use client";

import { useState } from "react";
import { Product } from "@/app/lib/types";
import { formatPrice } from "@/app/lib/utils";
import { Plus, X, Package, Image, DollarSign, Tag, Lock, Info } from "lucide-react";
import { Button } from "./ui/Button";
import { Tooltip } from "./ui/Tooltip";
import { cn } from "@/app/lib/utils";

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
  const [formErrors, setFormErrors] = useState({
    name: "",
    price: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const errors = {
      name: "",
      price: "",
    };
    
    if (!formData.name.trim()) {
      errors.name = "Product name is required";
    }
    
    if (!formData.price) {
      errors.price = "Price is required";
    } else if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) < 0) {
      errors.price = "Price must be a valid positive number";
    }
    
    setFormErrors(errors);
    return !errors.name && !errors.price;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
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

      // Reset form
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-lg">
      <div className="flex items-center justify-between">
        <h2 className="heading-text">Products ({products.length})</h2>
        <Button
          onClick={() => setShowAddForm(true)}
          variant="primary"
          size="sm"
          icon={<Plus size={16} />}
        >
          Add Product
        </Button>
      </div>

      {showAddForm && (
        <div className="card border-primary/20 animate-fade-in">
          <div className="flex items-center justify-between mb-lg">
            <h3 className="font-medium">Add New Product</h3>
            <Button
              onClick={() => setShowAddForm(false)}
              variant="ghost"
              size="sm"
              icon={<X size={16} />}
              ariaLabel="Close form"
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              <div className="space-y-xs">
                <label className="block text-sm font-medium">
                  Product Name <span className="text-error">*</span>
                </label>
                <div>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter product name..."
                    className={cn(
                      "input-field w-full",
                      formErrors.name && "border-error"
                    )}
                    required
                  />
                  {formErrors.name && (
                    <p className="text-xs text-error mt-xs">{formErrors.name}</p>
                  )}
                </div>
              </div>

              <div className="space-y-xs">
                <label className="block text-sm font-medium">
                  Price <span className="text-error">*</span>
                </label>
                <div className="flex space-x-xs">
                  <div className="relative flex-1">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500">
                      <DollarSign size={16} />
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                      placeholder="0.00"
                      className={cn(
                        "input-field pl-9 w-full",
                        formErrors.price && "border-error"
                      )}
                      required
                    />
                  </div>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value as "USDC" | "ETH" }))}
                    className="input-field"
                  >
                    <option value="USDC">USDC</option>
                    <option value="ETH">ETH</option>
                  </select>
                </div>
                {formErrors.price && (
                  <p className="text-xs text-error mt-xs">{formErrors.price}</p>
                )}
              </div>

              <div className="md:col-span-2 space-y-xs">
                <label className="block text-sm font-medium">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your product..."
                  rows={2}
                  className="input-field w-full resize-none"
                />
              </div>

              <div className="space-y-xs">
                <label className="block text-sm font-medium">Image URL</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500">
                    <Image size={16} />
                  </div>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                    placeholder="https://example.com/image.jpg"
                    className="input-field pl-9 w-full"
                  />
                </div>
              </div>

              <div className="space-y-xs">
                <label className="block text-sm font-medium">Stock (optional)</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500">
                    <Tag size={16} />
                  </div>
                  <input
                    type="number"
                    min="1"
                    value={formData.stock}
                    onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                    placeholder="Unlimited"
                    className="input-field pl-9 w-full"
                  />
                </div>
                <p className="text-xs text-neutral-500">Leave empty for unlimited stock</p>
              </div>
            </div>

            <div className="flex items-center space-x-sm">
              <input
                type="checkbox"
                id="productTokenGated"
                checked={formData.isTokenGated}
                onChange={(e) => setFormData(prev => ({ ...prev, isTokenGated: e.target.checked }))}
                className="rounded text-primary focus:ring-primary"
              />
              <label htmlFor="productTokenGated" className="text-sm">
                Token-gated product
              </label>
              <Tooltip content="Only users who hold the required token will be able to purchase this product">
                <div className="text-neutral-500 cursor-help">
                  <Info size={16} />
                </div>
              </Tooltip>
            </div>

            <div className="flex justify-end space-x-md">
              <Button
                type="button"
                onClick={() => setShowAddForm(false)}
                variant="secondary"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="primary"
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                Add Product
              </Button>
            </div>
          </form>
        </div>
      )}

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-md">
          {products.map((product) => (
            <div key={product.productId} className="card-product group">
              <div className="aspect-square bg-neutral-100 flex items-center justify-center relative">
                {product.imageUrl && product.imageUrl !== "/api/placeholder/product" ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Package size={48} className="text-neutral-400" />
                )}
                
                {/* Remove button overlay */}
                <div className="absolute inset-0 bg-neutral-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                  <Button
                    onClick={() => onRemoveProduct(product.productId)}
                    variant="danger"
                    size="sm"
                    icon={<X size={16} />}
                  >
                    Remove
                  </Button>
                </div>
              </div>
              
              <div className="p-md">
                <div className="mb-xs">
                  <h4 className="font-medium text-sm">{product.name}</h4>
                  
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
                      <span className="badge badge-accent">
                        <Lock size={12} className="mr-1" />
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
          <Package size={48} className="mx-auto mb-md text-neutral-400" />
          <h3 className="font-medium mb-sm">No products added yet</h3>
          <p className="text-sm text-neutral-500 mb-lg">
            Add products to showcase during your live stream
          </p>
          <Button
            onClick={() => setShowAddForm(true)}
            variant="primary"
            icon={<Plus size={16} />}
          >
            Add Your First Product
          </Button>
        </div>
      )}
    </div>
  );
}

