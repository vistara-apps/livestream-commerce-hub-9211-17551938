/**
 * User type definition
 */
export interface User {
  userId: string;
  walletAddress: string;
  username: string;
  bio?: string;
  avatarUrl?: string;
  tokens?: string[];
}

/**
 * Stream type definition
 */
export interface Stream {
  streamId: string;
  creatorId: string;
  title: string;
  description?: string;
  startTime: Date | string;
  endTime?: Date | string;
  isLive: boolean;
  viewerCount: number;
  productIds?: string[];
  products?: Product[];
  isTokenGated?: boolean;
  requiredToken?: string;
}

/**
 * Product type definition
 */
export interface Product {
  productId: string;
  streamId: string;
  name: string;
  description?: string;
  price: number;
  currency: "USDC" | "ETH";
  imageUrl?: string;
  isTokenGated?: boolean;
  isPinned?: boolean;
  stock?: number;
  soldCount?: number;
}

/**
 * Chat message type definition
 */
export interface ChatMessage {
  messageId: string;
  userId: string;
  username: string;
  content: string;
  timestamp: string;
  isTokenGatedContent?: boolean;
}

/**
 * Purchase type definition
 */
export interface Purchase {
  purchaseId: string;
  userId: string;
  productId: string;
  streamId: string;
  price: number;
  currency: "USDC" | "ETH";
  timestamp: string;
  status: "pending" | "completed" | "failed";
  transactionHash?: string;
}

/**
 * Token type definition
 */
export interface Token {
  tokenId: string;
  contractAddress: string;
  name: string;
  symbol: string;
  decimals: number;
  balance: number;
}

/**
 * Notification type definition
 */
export interface Notification {
  id: string;
  userId: string;
  type: "purchase" | "stream_start" | "stream_end" | "message" | "system";
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  data?: Record<string, any>;
}

/**
 * Theme type definition
 */
export type ThemeMode = "light" | "dark" | "system";

/**
 * User settings type definition
 */
export interface UserSettings {
  userId: string;
  theme: ThemeMode;
  notifications: {
    purchases: boolean;
    streams: boolean;
    messages: boolean;
    system: boolean;
  };
  privacy: {
    showWalletAddress: boolean;
    showPurchaseHistory: boolean;
  };
}

