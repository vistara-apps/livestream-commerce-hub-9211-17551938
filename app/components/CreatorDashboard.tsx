"use client";

import { useState } from "react";
import { User, Stream, Product } from "@/app/lib/types";
import { generateStreamId } from "@/app/lib/utils";
import { ProductManager } from "./ProductManager";
import { ArrowLeft, Video, Plus, Info, Lock } from "lucide-react";
import { Button } from "./ui/Button";
import { Tooltip } from "./ui/Tooltip";
import { useToast } from "./ui/Toast";

interface CreatorDashboardProps {
  user?: User | null;
  onStreamStart: (stream: Stream) => void;
  onBack: () => void;
}

export function CreatorDashboard({ user, onStreamStart, onBack }: CreatorDashboardProps) {
  const [streamTitle, setStreamTitle] = useState("");
  const [streamDescription, setStreamDescription] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [isTokenGated, setIsTokenGated] = useState(false);
  const [requiredToken, setRequiredToken] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToast } = useToast();

  const handleAddProduct = (product: Omit<Product, "productId" | "streamId">) => {
    const newProduct: Product = {
      ...product,
      productId: `product-${Date.now()}`,
      streamId: "temp-stream-id",
    };
    setProducts(prev => [...prev, newProduct]);
    addToast(`Added product: ${product.name}`, "success");
  };

  const handleRemoveProduct = (productId: string) => {
    const productToRemove = products.find(p => p.productId === productId);
    setProducts(prev => prev.filter(p => p.productId !== productId));
    
    if (productToRemove) {
      addToast(`Removed product: ${productToRemove.name}`, "info");
    }
  };

  const handleStartStream = async () => {
    if (!streamTitle.trim()) {
      addToast("Please enter a stream title", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const stream: Stream = {
        streamId: generateStreamId(),
        creatorId: user?.userId || "anonymous",
        title: streamTitle,
        description: streamDescription,
        startTime: new Date(),
        productIds: products.map(p => p.productId),
        viewerCount: 0,
        isLive: true,
        isTokenGated,
        requiredToken: isTokenGated ? requiredToken : undefined,
      };

      // Update product streamIds
      const updatedProducts = products.map(p => ({
        ...p,
        streamId: stream.streamId,
      }));

      onStreamStart(stream);
      addToast("Stream started successfully!", "success");
    } catch (error) {
      addToast("Failed to start stream. Please try again.", "error");
      console.error("Error starting stream:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-lg">
      <div className="flex items-center space-x-md">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          icon={<ArrowLeft size={20} />}
          ariaLabel="Go back"
        />
        <h1 className="heading-text">Create Live Stream</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg">
        <div className="lg:col-span-8">
          <div className="card space-y-lg">
            <div>
              <label className="block text-sm font-medium mb-sm">Stream Title</label>
              <input
                type="text"
                value={streamTitle}
                onChange={(e) => setStreamTitle(e.target.value)}
                placeholder="Enter your stream title..."
                className="input-field w-full"
                maxLength={100}
              />
              <div className="flex justify-end mt-xs">
                <span className="text-xs text-neutral-500">
                  {streamTitle.length}/100
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-sm">Description</label>
              <textarea
                value={streamDescription}
                onChange={(e) => setStreamDescription(e.target.value)}
                placeholder="Describe what you'll be showcasing..."
                rows={3}
                className="input-field w-full resize-none"
                maxLength={500}
              />
              <div className="flex justify-end mt-xs">
                <span className="text-xs text-neutral-500">
                  {streamDescription.length}/500
                </span>
              </div>
            </div>

            <div className="space-y-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-md">
                  <div className="flex items-center space-x-sm">
                    <input
                      type="checkbox"
                      id="tokenGated"
                      checked={isTokenGated}
                      onChange={(e) => setIsTokenGated(e.target.checked)}
                      className="rounded text-primary focus:ring-primary"
                    />
                    <label htmlFor="tokenGated" className="text-sm font-medium">
                      Enable Token-Gated Chat
                    </label>
                  </div>
                  
                  <Tooltip content="Only users who hold the specified token will be able to participate in the chat">
                    <div className="text-neutral-500 cursor-help">
                      <Info size={16} />
                    </div>
                  </Tooltip>
                </div>
              </div>

              {isTokenGated && (
                <div className="pl-6 animate-fade-in">
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500">
                      <Lock size={16} />
                    </div>
                    <input
                      type="text"
                      value={requiredToken}
                      onChange={(e) => setRequiredToken(e.target.value)}
                      placeholder="Required token contract address..."
                      className="input-field pl-9 w-full"
                    />
                  </div>
                  <p className="text-xs text-neutral-500 mt-xs">
                    Enter the contract address of the token that viewers must hold to participate in chat
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="card sticky top-24">
            <h3 className="heading-text mb-lg">Stream Preview</h3>
            <div className="bg-neutral-100 rounded-md p-lg text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-md">
                <Video size={32} className="text-primary" />
              </div>
              <p className="font-medium">
                {streamTitle || "Your stream title will appear here"}
              </p>
              {streamDescription && (
                <p className="text-sm text-neutral-600 mt-sm line-clamp-3">
                  {streamDescription}
                </p>
              )}
              
              <div className="mt-md pt-md border-t border-neutral-200">
                <div className="flex items-center justify-center space-x-sm text-sm">
                  <span className="text-neutral-600">Products:</span>
                  <span className="font-medium">{products.length}</span>
                </div>
                
                {isTokenGated && (
                  <div className="mt-sm flex items-center justify-center text-xs text-accent">
                    <Lock size={12} className="mr-xs" />
                    Token-gated chat enabled
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-lg">
              <Button
                onClick={handleStartStream}
                disabled={!streamTitle.trim() || isSubmitting}
                loading={isSubmitting}
                variant="primary"
                fullWidth
                icon={<Video size={16} />}
              >
                Start Live Stream
              </Button>
              
              <Button
                onClick={onBack}
                variant="ghost"
                fullWidth
                className="mt-sm"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>

      <ProductManager
        products={products}
        onAddProduct={handleAddProduct}
        onRemoveProduct={handleRemoveProduct}
      />
    </div>
  );
}

