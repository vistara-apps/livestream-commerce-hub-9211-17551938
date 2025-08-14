"use client";

import { useState, useEffect, useRef } from "react";
import { User } from "@/app/lib/types";
import { ConnectWallet, Wallet, WalletDropdown, WalletDropdownDisconnect } from "@coinbase/onchainkit/wallet";
import { Identity, Avatar, Name, Address } from "@coinbase/onchainkit/identity";
import { Home, Video, User as UserIcon, Menu, X } from "lucide-react";
import { cn } from "@/app/lib/utils";
import { Button } from "./ui/Button";

interface NavigationProps {
  currentView: "browse" | "create" | "stream";
  onViewChange: (view: "browse" | "create" | "stream") => void;
  user?: User | null;
}

export function Navigation({ currentView, onViewChange, user }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Check if mobile on mount and window resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.addEventListener('resize', checkIfMobile);
    };
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleViewChange = (view: "browse" | "create" | "stream") => {
    onViewChange(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-header bg-surface border-b border-neutral-200 shadow-sm">
      <div className="container-app">
        <div className="flex items-center justify-between py-md">
          <div className="flex items-center space-x-md">
            <h2 className="heading-text">Commerce Hub</h2>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-sm">
              <Button
                onClick={() => handleViewChange("browse")}
                variant={currentView === "browse" ? "primary" : "ghost"}
                size="sm"
                icon={<Home size={16} />}
              >
                Browse
              </Button>
              
              <Button
                onClick={() => handleViewChange("create")}
                variant={currentView === "create" ? "primary" : "ghost"}
                size="sm"
                icon={<Video size={16} />}
              >
                Create
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-md">
            {/* Wallet Connection */}
            <Wallet className="z-dropdown">
              <ConnectWallet>
                <Button
                  variant="secondary"
                  size="sm"
                  icon={<UserIcon size={16} />}
                >
                  Connect
                </Button>
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

            {/* Mobile Menu Button */}
            {isMobile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMobileMenu}
                icon={isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                ariaLabel={isMobileMenuOpen ? "Close menu" : "Open menu"}
              />
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobile && (
        <div
          ref={mobileMenuRef}
          className={cn(
            "fixed inset-0 bg-neutral-900/50 z-dropdown transition-opacity duration-300",
            isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
        >
          <div 
            className={cn(
              "absolute right-0 top-0 h-full w-64 bg-surface shadow-lg transition-transform duration-300 transform",
              isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
            )}
          >
            <div className="p-md border-b border-neutral-200">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Menu</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleMobileMenu}
                  icon={<X size={16} />}
                  ariaLabel="Close menu"
                />
              </div>
            </div>
            
            <div className="p-md space-y-sm">
              <Button
                onClick={() => handleViewChange("browse")}
                variant={currentView === "browse" ? "primary" : "secondary"}
                size="sm"
                icon={<Home size={16} />}
                fullWidth
              >
                Browse Streams
              </Button>
              
              <Button
                onClick={() => handleViewChange("create")}
                variant={currentView === "create" ? "primary" : "secondary"}
                size="sm"
                icon={<Video size={16} />}
                fullWidth
              >
                Create Stream
              </Button>
            </div>
            
            {user && (
              <div className="p-md border-t border-neutral-200 mt-md">
                <div className="text-sm font-medium mb-sm">Account</div>
                <div className="text-sm text-neutral-500 mb-xs">
                  {user.username}
                </div>
                <div className="text-xs text-neutral-400 break-all">
                  {user.walletAddress}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

