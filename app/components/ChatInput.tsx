"use client";

import { useState } from "react";
import { User } from "@/app/lib/types";

interface ChatMessage {
  messageId: string;
  userId: string;
  username: string;
  content: string;
  timestamp: string;
  isTokenGatedContent: boolean;
}

interface ChatInputProps {
  variant: "default" | "tokenGated";
  messages: ChatMessage[];
  onSendMessage: (content: string) => void;
  isTokenGated: boolean;
  hasAccess: boolean;
  user?: User;
}

export function ChatInput({
  variant,
  onSendMessage,
  isTokenGated,
  hasAccess,
  user,
}: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !user) return;

    onSendMessage(message);
    setMessage("");
  };

  if (isTokenGated && !hasAccess) {
    return (
      <div className="p-md border-t border-neutral-100 bg-neutral-100">
        <div className="text-center">
          <p className="text-sm text-neutral-500 mb-sm">
            🔒 Token required to chat
          </p>
          <button className="btn-primary text-sm">
            Get Access Token
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-md border-t border-neutral-100 bg-neutral-100">
        <div className="text-center">
          <p className="text-sm text-neutral-500 mb-sm">
            Connect wallet to chat
          </p>
          <button className="btn-primary text-sm">
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-md border-t border-neutral-100">
      <form onSubmit={handleSubmit} className="flex gap-sm">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={isTokenGated ? "Send token-gated message..." : "Type a message..."}
          className="input-field flex-1 text-sm"
        />
        <button
          type="submit"
          disabled={!message.trim()}
          className="bg-primary hover:bg-primary/90 text-white px-md py-sm rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  );
}

