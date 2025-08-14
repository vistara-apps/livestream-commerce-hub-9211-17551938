"use client";

import { useState, useEffect } from "react";
import { ProductCard } from "./ProductCard";
import { ChatInput } from "./ChatInput";
import { ViewerActionButtons } from "./ViewerActionButtons";
import { BondingCurve } from "./BondingCurve";
import { User, Stream, Product } from "@/app/lib/types";

interface ChatMessage {
  messageId: string;
  userId: string;
  username: string;
  content: string;
  timestamp: string;
  isTokenGatedContent: boolean;
}

interface StreamViewProps {
  stream: Stream;
  user?: User;
  onPurchase?: (productId: string) => void;
  onBack?: () => void;
}

export function StreamView({ stream, user, onPurchase = () => {} }: StreamViewProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      messageId: "1",
      userId: "creator",
      username: "Creator",
      content: "Welcome to my live stream! Check out these amazing products!",
      timestamp: new Date().toISOString(),
      isTokenGatedContent: false,
    },
    {
      messageId: "2",
      userId: "viewer1",
      username: "Viewer1",
      content: "Love the first product! How much is shipping?",
      timestamp: new Date().toISOString(),
      isTokenGatedContent: false,
    },
  ]);

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
  };

  const handlePurchase = (productId: string) => {
    onPurchase(productId);
    setSelectedProduct(null);
  };

  const handleNewMessage = (content: string) => {
    if (!user) return;

    const newMessage: ChatMessage = {
      messageId: Date.now().toString(),
      userId: user.userId,
      username: user.username,
      content,
      timestamp: new Date().toISOString(),
      isTokenGatedContent: false,
    };

    setChatMessages(prev => [...prev, newMessage]);
  };

  return (
    <div className="flex flex-col h-screen bg-bg">
      {/* Stream Header */}
      <div className="bg-surface border-b border-neutral-100 p-md">
        <h1 className="heading text-neutral-900">{stream.title}</h1>
        <p className="body text-neutral-500 mt-sm">{stream.description}</p>
        <div className="flex items-center gap-md mt-sm">
          <span className="text-sm text-neutral-500">
            {stream.viewerCount} viewers
          </span>
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-red-500 font-medium">LIVE</span>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Video Stream Placeholder */}
          <div className="bg-neutral-900 aspect-video flex items-center justify-center">
            <div className="text-center text-white">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-md">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 5v10l7-5-7-5z" />
                </svg>
              </div>
              <p className="body">Live Stream</p>
              <p className="text-sm text-white/70">Video feed would appear here</p>
            </div>
          </div>

          {/* Featured Products */}
          <div className="p-md border-b border-neutral-100">
            <h3 className="heading text-neutral-900 mb-md">Featured Products</h3>
            <div className="grid grid-cols-2 gap-md">
              {stream.products && stream.products.map((product) => (
                <ProductCard
                  key={product.productId}
                  product={product}
                  variant="live"
                  onSelect={() => handleProductSelect(product)}
                  onPurchase={() => handlePurchase(product.productId)}
                />
              ))}
            </div>
          </div>

          {/* Bonding Curve (if applicable) */}
          {selectedProduct && (
            <div className="p-md border-b border-neutral-100">
              <BondingCurve
                product={selectedProduct}
                variant="interactive"
                onPriceUpdate={(price) => console.log('Price updated:', price)}
              />
            </div>
          )}
        </div>

        {/* Chat Sidebar */}
        <div className="w-80 border-l border-neutral-100 flex flex-col">
          <div className="p-md border-b border-neutral-100">
            <h3 className="heading text-neutral-900">Live Chat</h3>
            {stream.isTokenGated && (
              <p className="text-sm text-accent mt-sm">
                🔒 Token-gated chat active
              </p>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-md space-y-md">
            {chatMessages.map((message) => (
              <div key={message.messageId} className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-neutral-900">
                    {message.username}
                  </span>
                  <span className="text-xs text-neutral-500">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                  {message.isTokenGatedContent && (
                    <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded">
                      🔒
                    </span>
                  )}
                </div>
                <p className="text-sm text-neutral-700">{message.content}</p>
              </div>
            ))}
          </div>

          <ChatInput
            variant={stream.isTokenGated ? "tokenGated" : "default"}
            messages={chatMessages}
            onSendMessage={handleNewMessage}
            isTokenGated={stream.isTokenGated || false}
            hasAccess={true} // Would check token ownership
            user={user}
          />
        </div>
      </div>

      {/* Action Buttons */}
      {selectedProduct && (
        <div className="p-md border-t border-neutral-100 bg-surface">
          <ViewerActionButtons
            product={selectedProduct}
            variant="buy"
            onPurchase={() => handlePurchase(selectedProduct.productId)}
            onShowInterest={() => console.log('Show interest')}
          />
        </div>
      )}
    </div>
  );
}

