
"use client";

import { useState, useRef, useEffect } from "react";
import { ChatMessage, User } from "@/app/lib/types";
import { Send, Lock, MessageCircle } from "lucide-react";
import { cn } from "@/app/lib/utils";

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (content: string) => void;
  isTokenGated: boolean;
  hasAccess: boolean;
  user?: User | null;
}

export function ChatInterface({ 
  messages, 
  onSendMessage, 
  isTokenGated, 
  hasAccess, 
  user 
}: ChatInterfaceProps) {
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !hasAccess) return;

    onSendMessage(newMessage);
    setNewMessage("");
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="card p-0 h-96 flex flex-col">
      {/* Chat Header */}
      <div className="px-lg py-md border-b border-neutral-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-sm">
            <MessageCircle size={16} className="text-primary" />
            <h3 className="font-medium">Live Chat</h3>
          </div>
          {isTokenGated && (
            <div className="flex items-center space-x-xs text-xs text-accent">
              <Lock size={12} />
              <span>Token Gated</span>
            </div>
          )}
        </div>
        <p className="text-xs text-neutral-500 mt-xs">
          {messages.length} messages
        </p>
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
            <div key={message.messageId} className="space-y-xs">
              <div className="flex items-center space-x-sm">
                <span className="text-sm font-medium text-primary">
                  {message.username}
                </span>
                <span className="text-xs text-neutral-500">
                  {formatTime(message.timestamp)}
                </span>
                {message.isTokenGatedContent && (
                  <Lock size={10} className="text-accent" />
                )}
              </div>
              <p className="text-sm text-neutral-900 leading-relaxed">
                {message.content}
              </p>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t border-neutral-100 p-md">
        {!user ? (
          <div className="text-center py-md">
            <p className="text-sm text-neutral-500 mb-sm">
              Connect your wallet to join the chat
            </p>
            <button className="btn-primary text-sm">
              Connect Wallet
            </button>
          </div>
        ) : !hasAccess && isTokenGated ? (
          <div className="text-center py-md">
            <div className="flex items-center justify-center space-x-sm mb-sm">
              <Lock size={16} className="text-accent" />
              <p className="text-sm font-medium text-accent">Token Required</p>
            </div>
            <p className="text-xs text-neutral-500 mb-sm">
              You need to hold the required token to chat
            </p>
            <button className="btn-accent text-sm">
              Get Access Token
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex space-x-sm">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="input-field flex-1 text-sm"
              maxLength={200}
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className={cn(
                "p-sm rounded-md transition-colors duration-200",
                newMessage.trim()
                  ? "bg-primary hover:bg-primary/90 text-white"
                  : "bg-neutral-100 text-neutral-500"
              )}
            >
              <Send size={16} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
