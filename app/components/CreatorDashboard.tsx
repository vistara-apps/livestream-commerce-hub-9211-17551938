"use client";

import { useState } from "react";
import { User, Stream, Product } from "@/app/lib/types";
import { generateStreamId } from "@/app/lib/utils";
import { ProductManager } from "./ProductManager";
import { ArrowLeft, Video, Plus } from "lucide-react";

interface CreatorDashboardProps {
  user?: User;
  onStreamStart: (stream: Stream) => void;
  onBack: () => void;
}

export function CreatorDashboard({ user, onStreamStart, onBack }: CreatorDashboardProps) {
  const [streamTitle, setStreamTitle] = useState("");
  const [streamDescription, setStreamDescription] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [isTokenGated, setIsTokenGated] = useState(false);
  const [requiredToken, setRequiredToken] = useState("");

  const handleAddProduct = (product: Omit<Product, "productId" | "streamId">) => {
    const newProduct: Product = {
      ...product,
      productId: `product-${Date.now()}`,
      streamId: "temp-stream-id",
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const handleRemoveProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.productId !== productId));
  };

  const handleStartStream = () => {
    if (!streamTitle.trim()) return;

    const streamId = generateStreamId();
    
    const stream: Stream = {
      streamId,
      creatorId: user?.userId || "anonymous",
      title: streamTitle,
      description: streamDescription,
      startTime: new Date(),
      productIds: products.map(p => p.productId),
      viewerCount: 0,
      isLive: true,
      isTokenGated,
      requiredToken: isTokenGated ? requiredToken : undefined,
      products: products.map(p => ({
        ...p,
        streamId
      }))
    };

    onStreamStart(stream);
  };

  return (
    <div className="space-y-lg">
      <div className="flex items-center space-x-md">
        <button
          onClick={onBack}
          className="p-md rounded-md hover:bg-neutral-100 transition-colors duration-200"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="heading-text">Create Live Stream</h1>
      </div>

      <div className="grid-12 gap-lg">
        <div className="col-span-12 lg:col-span-8">
          <div className="card space-y-lg">
            <div>
              <label className="block text-sm font-medium mb-sm">Stream Title</label>
              <input
                type="text"
                value={streamTitle}
                onChange={(e) => setStreamTitle(e.target.value)}
                placeholder="Enter your stream title..."
                className="input-field w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-sm">Description</label>
              <textarea
                value={streamDescription}
                onChange={(e) => setStreamDescription(e.target.value)}
                placeholder="Describe what you'll be showcasing..."
                rows={3}
                className="input-field w-full resize-none"
              />
            </div>

            <div className="space-y-md">
              <div className="flex items-center space-x-md">
                <input
                  type="checkbox"
                  id="tokenGated"
                  checked={isTokenGated}
                  onChange={(e) => setIsTokenGated(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="tokenGated" className="text-sm font-medium">
                  Enable Token-Gated Chat
                </label>
              </div>

              {isTokenGated && (
                <input
                  type="text"
                  value={requiredToken}
                  onChange={(e) => setRequiredToken(e.target.value)}
                  placeholder="Required token contract address..."
                  className="input-field w-full"
                />
              )}
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4">
          <div className="card">
            <h3 className="heading-text mb-lg">Stream Preview</h3>
            <div className="bg-neutral-100 rounded-md p-lg text-center">
              <Video size={48} className="mx-auto mb-md text-neutral-500" />
              <p className="text-sm text-neutral-500">
                {streamTitle || "Your stream title will appear here"}
              </p>
              {streamDescription && (
                <p className="text-xs text-neutral-500 mt-xs">
                  {streamDescription}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <ProductManager
        products={products}
        onAddProduct={handleAddProduct}
        onRemoveProduct={handleRemoveProduct}
      />

      <div className="flex justify-end space-x-md">
        <button onClick={onBack} className="btn-secondary">
          Cancel
        </button>
        <button
          onClick={handleStartStream}
          disabled={!streamTitle.trim()}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Start Live Stream
        </button>
      </div>
    </div>
  );
}

