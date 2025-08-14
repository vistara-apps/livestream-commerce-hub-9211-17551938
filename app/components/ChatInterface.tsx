"use client";

import { useState, useRef, useEffect } from "react";
import { ChatMessage, User } from "@/app/lib/types";
import { Send, Lock, MessageCircle, AlertCircle, User as UserIcon } from "lucide-react";
import { cn } from "@/app/lib/utils";
import { Button } from "./ui/Button";
import { Tooltip } from "./ui/Tooltip";

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (content: string) => void;
  isTokenGated: boolean;
  hasAccess: boolean;
  user?: User | null;
  className?: string;
}

export function ChatInterface({ 
  messages, 
  onSendMessage, 
  isTokenGated, 
  hasAccess, 
  user,
  className
}: ChatInterfaceProps) {
  const [newMessage, setNewMessage] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const maxLength = 200;

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current && hasAccess && user) {
      inputRef.current.focus();
    }
  }, [hasAccess, user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !hasAccess || !user) return;

    onSendMessage(newMessage);
    setNewMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Don't submit if user is composing (for IME input methods)
    if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={cn("card p-0 h-96 flex flex-col", className)}>
      {/* Chat Header */}
      <div className="px-lg py-md border-b border-neutral-200 bg-surface sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-sm">
            <MessageCircle size={16} className="text-primary" />
            <h3 className="font-medium">Live Chat</h3>
            <span className="badge badge-primary ml-sm text-xs">
              {messages.length}
            </span>
          </div>
          {isTokenGated && (
            <Tooltip content="Only token holders can participate in this chat">
              <div className="flex items-center space-x-xs text-xs text-accent">
                <Lock size={12} />
                <span>Token Gated</span>
              </div>
            </Tooltip>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-lg py-md space-y-md">
        {messages.length === 0 ? (
          <div className="text-center text-neutral-500 py-lg">
            <MessageCircle size={32} className="mx-auto mb-sm opacity-50" />
            <p className="text-sm">No messages yet</p>
            <p className="text-xs">Be the first to say something!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div 
              key={message.messageId} 
              className={cn(
                "space-y-xs animate-fade-in",
                message.userId === user?.userId ? "ml-auto max-w-[80%]" : "mr-auto max-w-[80%]"
              )}
            >
              <div className="flex items-center space-x-sm">
                <div className="w-6 h-6 rounded-full bg-neutral-200 flex items-center justify-center text-xs font-medium">
                  {message.username.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-primary">
                  {message.username}
                </span>
                <span className="text-xs text-neutral-500">
                  {formatTime(new Date(message.timestamp))}
                </span>
                {message.isTokenGatedContent && (
                  <Tooltip content="Token-gated message">
                    <Lock size={10} className="text-accent" />
                  </Tooltip>
                )}
              </div>
              <div className={cn(
                "p-sm rounded-lg text-sm leading-relaxed",
                message.userId === user?.userId 
                  ? "bg-primary-light text-primary rounded-tr-none" 
                  : "bg-neutral-100 text-neutral-800 rounded-tl-none"
              )}>
                {message.content}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t border-neutral-200 p-md">
        {!user ? (
          <div className="text-center py-md">
            <div className="flex items-center justify-center mb-sm">
              <UserIcon size={16} className="text-neutral-500 mr-sm" />
              <p className="text-sm text-neutral-500">Connect your wallet to join the chat</p>
            </div>
            <Button variant="primary" size="sm" icon={<UserIcon size={14} />}>
              Connect Wallet
            </Button>
          </div>
        ) : !hasAccess && isTokenGated ? (
          <div className="text-center py-md">
            <div className="flex items-center justify-center mb-sm">
              <Lock size={16} className="text-accent mr-sm" />
              <p className="text-sm font-medium text-accent">Token Required</p>
            </div>
            <p className="text-xs text-neutral-500 mb-sm">
              You need to hold the required token to chat
            </p>
            <Button variant="accent" size="sm">
              Get Access Token
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex space-x-sm">
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                onCompositionStart={() => setIsComposing(true)}
                onCompositionEnd={() => setIsComposing(false)}
                placeholder={isTokenGated ? "Send token-gated message..." : "Type a message..."}
                className={cn(
                  "input-field w-full text-sm pr-12",
                  newMessage.length > maxLength - 20 && "border-warning",
                  newMessage.length > maxLength && "border-error"
                )}
                maxLength={maxLength}
              />
              {newMessage.length > 0 && (
                <div className={cn(
                  "absolute right-2 bottom-2 text-xs",
                  newMessage.length > maxLength - 20 ? "text-warning" : "text-neutral-400",
                  newMessage.length > maxLength && "text-error"
                )}>
                  {newMessage.length}/{maxLength}
                </div>
              )}
            </div>
            <Button
              type="submit"
              disabled={!newMessage.trim() || newMessage.length > maxLength}
              variant="primary"
              size="sm"
              icon={<Send size={16} />}
              ariaLabel="Send message"
            />
          </form>
        )}
        
        {newMessage.length > maxLength && (
          <div className="mt-xs flex items-center text-xs text-error">
            <AlertCircle size={12} className="mr-xs" />
            Message exceeds maximum length
          </div>
        )}
      </div>
    </div>
  );
}

