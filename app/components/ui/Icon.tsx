
"use client";

import { 
  Plus, 
  Check, 
  X, 
  ArrowLeft, 
  Home, 
  Video, 
  User, 
  ShoppingCart,
  Package,
  Send,
  Lock,
  MessageCircle,
  Play,
  Pause,
  Volume2,
  Maximize,
  Users,
  Clock,
  TrendingUp
} from "lucide-react";

const iconMap = {
  plus: Plus,
  check: Check,
  x: X,
  "arrow-left": ArrowLeft,
  home: Home,
  video: Video,
  user: User,
  "shopping-cart": ShoppingCart,
  package: Package,
  send: Send,
  lock: Lock,
  "message-circle": MessageCircle,
  play: Play,
  pause: Pause,
  "volume-2": Volume2,
  maximize: Maximize,
  users: Users,
  clock: Clock,
  "trending-up": TrendingUp,
} as const;

interface IconProps {
  name: keyof typeof iconMap;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Icon({ name, size = "md", className }: IconProps) {
  const IconComponent = iconMap[name];
  
  const sizeMap = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return <IconComponent size={sizeMap[size]} className={className} />;
}
