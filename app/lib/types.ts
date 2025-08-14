export interface User {
  userId: string;
  farcasterId?: string;
  walletAddress: string;
  username: string;
  bio?: string;
}

export interface Stream {
  streamId: string;
  creatorId: string;
  title: string;
  description: string;
  startTime: Date;
  endTime?: Date;
  productIds: string[];
  viewerCount: number;
  isLive: boolean;
  isTokenGated?: boolean;
  requiredToken?: string;
  products?: Product[]; // Added products property to fix type error
}

export interface Product {
  productId: string;
  streamId: string;
  name: string;
  description: string;
  price: number;
  currency: 'USDC' | 'ETH';
  imageUrl: string;
  onChainLink?: string;
  isTokenGated: boolean;
  stock?: number;
  isPinned?: boolean;
}

export interface Purchase {
  purchaseId: string;
  userId: string;
  productId: string;
  streamId: string;
  transactionHash: string;
  amount: number;
  timestamp: Date;
  paymentMethod: 'USDC' | 'ETH';
}

export interface ChatMessage {
  messageId: string;
  streamId: string;
  userId: string;
  username: string;
  content: string;
  timestamp: Date;
  isTokenGatedContent: boolean;
}

export interface AppState {
  currentUser?: User;
  activeStream?: Stream;
  products: Product[];
  chatMessages: ChatMessage[];
  isCreator: boolean;
}
