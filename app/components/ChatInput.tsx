"use client";

import { useState, useRef, useEffect } from "react";
import { User, ChatMessage } from "@/app/lib/types";
import { Send, Lock, AlertCircle } from "lucide-react";
import { cn } from "@/app/lib/utils";
import { Button } from "./ui/Button";
import { Tooltip } from "./ui/Tooltip";

interface ChatInputProps {
  variant: "default" | "tokenGated";
  messages: ChatMessage[];
  onSendMessage: (content: string) => void;
  isTokenGated: boolean;
  hasAccess: boolean;
  user?: User | null;
}

export function ChatInput({
  variant,
  onSendMessage,
  isTokenGated,
  hasAccess,
  user,
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const maxLength = 200;

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current && hasAccess && user) {
      inputRef.current.focus();
    }
  }, [hasAccess, user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !user) return;

    onSendMessage(message);
    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Don't submit if user is composing (for IME input methods)
    if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  if (isTokenGated && !hasAccess) {
    return (
      <div className="p-md border-t border-neutral-200 bg-neutral-100">
        <div className="text-center">
          <div className="flex items-center justify-center mb-sm">
            <Lock size={16} className="text-accent mr-sm" />
            <p className="text-sm font-medium text-accent">Token required to chat</p>
          </div>
          <p className="text-xs text-neutral-500 mb-md">
            You need to hold the required token to participate in this chat
          </p>
          <Button variant="accent" size="sm">
            Get Access Token
          </Button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-md border-t border-neutral-200 bg-neutral-100">
        <div className="text-center">
          <p className="text-sm text-neutral-500 mb-sm">
            Connect wallet to chat
          </p>
          <Button variant="primary" size="sm" icon={<Lock size={14} />}>
            Connect Wallet
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-md border-t border-neutral-200">
      <form onSubmit={handleSubmit} className="flex gap-sm">
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={() => setIsComposing(false)}
            placeholder={isTokenGated ? "Send token-gated message..." : "Type a message..."}
            className={cn(
              "input-field w-full text-sm pr-12",
              message.length > maxLength - 20 && "border-warning",
              message.length > maxLength && "border-error"
            )}
            maxLength={maxLength}
          />
          {message.length > 0 && (
            <div className={cn(
              "absolute right-2 bottom-2 text-xs",
              message.length > maxLength - 20 ? "text-warning" : "text-neutral-400",
              message.length > maxLength && "text-error"
            )}>
              {message.length}/{maxLength}
            </div>
          )}
        </div>
        <Button
          type="submit"
          disabled={!message.trim() || message.length > maxLength}
          variant="primary"
          size="sm"
          icon={<Send size={16} />}
          ariaLabel="Send message"
        />
      </form>
      
      {message.length > maxLength && (
        <div className="mt-xs flex items-center text-xs text-error">
          <AlertCircle size={12} className="mr-xs" />
          Message exceeds maximum length
        </div>
      )}
    </div>
  );
}

