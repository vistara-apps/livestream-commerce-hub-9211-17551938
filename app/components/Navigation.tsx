
"use client";

import { User } from "@/app/lib/types";
import { ConnectWallet, Wallet, WalletDropdown, WalletDropdownDisconnect } from "@coinbase/onchainkit/wallet";
import { Identity, Avatar, Name, Address } from "@coinbase/onchainkit/identity";
import { Home, Video, User as UserIcon } from "lucide-react";
import { cn } from "@/app/lib/utils";

interface NavigationProps {
  currentView: "browse" | "create" | "stream";
  onViewChange: (view: "browse" | "create" | "stream") => void;
  user?: User | null;
}

export function Navigation({ currentView, onViewChange, user }: NavigationProps) {
  return (
    <nav className="flex items-center justify-between py-lg border-b border-neutral-100">
      <div className="flex items-center space-x-lg">
        <h2 className="heading-text">Commerce Hub</h2>
        
        <div className="hidden md:flex items-center space-x-md">
          <button
            onClick={() => onViewChange("browse")}
            className={cn(
              "flex items-center space-x-xs px-md py-sm rounded-md transition-colors duration-200",
              currentView === "browse" 
                ? "bg-primary text-white" 
                : "text-neutral-500 hover:text-neutral-900"
            )}
          >
            <Home size={16} />
            <span>Browse</span>
          </button>
          
          <button
            onClick={() => onViewChange("create")}
            className={cn(
              "flex items-center space-x-xs px-md py-sm rounded-md transition-colors duration-200",
              currentView === "create" 
                ? "bg-primary text-white" 
                : "text-neutral-500 hover:text-neutral-900"
            )}
          >
            <Video size={16} />
            <span>Create</span>
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-md">
        <Wallet className="z-10">
          <ConnectWallet>
            <div className="flex items-center space-x-xs">
              <UserIcon size={16} />
              <span>Connect</span>
            </div>
          </ConnectWallet>
          <WalletDropdown>
            <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
              <Avatar />
              <Name />
              <Address />
            </Identity>
            <WalletDropdownDisconnect />
          </WalletDropdown>
        </Wallet>
      </div>
    </nav>
  );
}
