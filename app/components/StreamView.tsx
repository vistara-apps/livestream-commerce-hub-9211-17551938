"use client";

import { useState, useEffect, useRef } from "react";
import { ProductCard } from "./ProductCard";
import { ChatInput } from "./ChatInput";
import { ViewerActionButtons } from "./ViewerActionButtons";
import { BondingCurve } from "./BondingCurve";
import { User, Stream, Product, ChatMessage } from "@/app/lib/types";
import { cn } from "@/app/lib/utils";
import { ArrowLeft, Users, MessageCircle, X } from "lucide-react";
import { Button } from "./ui/Button";
import { Tooltip } from "./ui/Tooltip";

interface StreamViewProps {
  stream: Stream;
  user?: User | null;
  onPurchase?: (productId: string) => void;
  onBack?: () => void;
}

export function StreamView({ stream, user, onPurchase, onBack }: StreamViewProps) {
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
  const [isChatVisible, setIsChatVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Check if mobile on mount and window resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsChatVisible(false);
      }
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  // Auto-scroll chat to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
  };

  const handlePurchase = (productId: string) => {
    if (onPurchase) {
      onPurchase(productId);
    }
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

  const toggleChat = () => {
    setIsChatVisible(!isChatVisible);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-bg">
      {/* Stream Header */}
      <div className="bg-surface border-b border-neutral-200 p-md sticky top-0 z-10 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {onBack && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onBack}
                className="mr-sm"
                icon={<ArrowLeft size={16} />}
                ariaLabel="Go back"
              />
            )}
            <div>
              <h1 className="heading-text text-neutral-900">{stream.title}</h1>
              <div className="flex items-center gap-md mt-xs">
                <span className="text-sm text-neutral-500 flex items-center">
                  <Users size={14} className="mr-xs" />
                  {stream.viewerCount} viewers
                </span>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-error rounded-full animate-pulse mr-xs"></div>
                  <span className="text-sm text-error font-medium">LIVE</span>
                </div>
              </div>
            </div>
          </div>
          
          {isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleChat}
              icon={<MessageCircle size={16} />}
              className={isChatVisible ? "bg-primary-light text-primary" : ""}
              ariaLabel={isChatVisible ? "Hide chat" : "Show chat"}
            />
          )}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Content */}
        <div className={cn(
          "flex-1 flex flex-col overflow-y-auto transition-all duration-300",
          isMobile && isChatVisible && "hidden"
        )}>
          {/* Video Stream Placeholder */}
          <div className="bg-neutral-900 aspect-video flex items-center justify-center">
            <div className="text-center text-white">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-md">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 5v10l7-5-7-5z" />
                </svg>
              </div>
              <p className="body-text text-white">Live Stream</p>
              <p className="text-sm text-white/70">Video feed would appear here</p>
            </div>
          </div>

          {/* Stream description */}
          {stream.description && (
            <div className="p-md border-b border-neutral-200 bg-surface">
              <p className="text-sm text-neutral-700">{stream.description}</p>
            </div>
          )}

          {/* Featured Products */}
          <div className="p-md border-b border-neutral-200">
            <h3 className="heading-text text-neutral-900 mb-md">Featured Products</h3>
            <div className="grid grid-cols-2 gap-md">
              {stream.products && stream.products.map((product) => (
                <ProductCard
                  key={product.productId}
                  product={product}
                  variant="live"
                  onSelect={() => handleProductSelect(product)}
                  onPurchase={() => handlePurchase(product.productId)}
                  hasAccess={true} // Would check token ownership
                />
              ))}
            </div>
          </div>

          {/* Bonding Curve (if applicable) */}
          {selectedProduct && (
            <div className="p-md border-b border-neutral-200">
              <div className="flex items-center justify-between mb-md">
                <h3 className="heading-text text-neutral-900">Dynamic Pricing</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedProduct(null)}
                  icon={<X size={16} />}
                  ariaLabel="Close bonding curve"
                />
              </div>
              <BondingCurve
                product={selectedProduct}
                variant="interactive"
                onPriceUpdate={(price) => console.log('Price updated:', price)}
              />
            </div>
          )}
        </div>

        {/* Chat Sidebar */}
        <div className={cn(
          "w-80 border-l border-neutral-200 flex flex-col bg-surface transition-all duration-300",
          isMobile && !isChatVisible && "hidden",
          isMobile && isChatVisible && "w-full"
        )}>
          <div className="p-md border-b border-neutral-200 flex items-center justify-between">
            <div>
              <h3 className="heading-text text-neutral-900">Live Chat</h3>
              {stream.isTokenGated && (
                <p className="text-sm text-accent mt-xs flex items-center">
                  <Tooltip content="Only token holders can participate in this chat">
                    <span className="flex items-center">
                      <Lock size={14} className="mr-xs" />
                      Token-gated chat active
                    </span>
                  </Tooltip>
                </p>
              )}
            </div>
            
            {isMobile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleChat}
                icon={<X size={16} />}
                ariaLabel="Close chat"
              />
            )}
          </div>

          <div 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-md space-y-md"
          >
            {chatMessages.map((message) => (
              <div key={message.messageId} className="space-y-1 animate-fade-in">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-neutral-900">
                    {message.username}
                  </span>
                  <span className="text-xs text-neutral-500">
                    {new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                  {message.isTokenGatedContent && (
                    <Tooltip content="Token-gated message">
                      <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded">
                        🔒
                      </span>
                    </Tooltip>
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
        <div className="p-md border-t border-neutral-200 bg-surface sticky bottom-0 shadow-md">
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

