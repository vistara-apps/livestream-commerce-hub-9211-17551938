"use client";

import { useState, useEffect } from "react";
import { cn } from "@/app/lib/utils";
import { User, Stream } from "@/app/lib/types";
import { StreamView } from "./StreamView";
import { CreatorDashboard } from "./CreatorDashboard";
import { Navigation } from "./Navigation";
import { Skeleton, SkeletonText, SkeletonCard } from "./ui/Skeleton";
import { Button } from "./ui/Button";
import { Video, ArrowRight } from "lucide-react";

interface AppShellProps {
  variant?: "default" | "streamView";
  className?: string;
}

export function AppShell({ variant = "default", className }: AppShellProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeStream, setActiveStream] = useState<Stream | null>(null);
  const [view, setView] = useState<"browse" | "create" | "stream">("browse");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      // Mock user for demo
      setCurrentUser({
        userId: "user-1",
        walletAddress: "0x1234...5678",
        username: "creator_demo",
        bio: "Digital creator and live commerce enthusiast"
      });
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleStreamStart = (stream: Stream) => {
    setActiveStream(stream);
    setView("stream");
  };

  const handleCreateStream = () => {
    setView("create");
  };

  const handleBackToBrowse = () => {
    setView("browse");
    setActiveStream(null);
  };

  if (isLoading) {
    return (
      <div className={cn("container-app min-h-screen", className)}>
        <Navigation 
          currentView={view}
          onViewChange={setView}
          user={currentUser}
        />
        
        <main className="py-lg">
          <div className="space-y-lg animate-pulse">
            <div className="text-center space-y-md">
              <Skeleton className="h-10 w-3/4 mx-auto" />
              <Skeleton className="h-5 w-1/2 mx-auto" />
            </div>
            
            <div className="grid-12">
              <div className="col-span-12 md:col-span-6">
                <SkeletonCard hasImage={false} />
              </div>
              
              <div className="col-span-12 md:col-span-6">
                <SkeletonCard hasImage={false} />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={cn("container-app min-h-screen", className)}>
      <Navigation 
        currentView={view}
        onViewChange={setView}
        user={currentUser}
      />
      
      <main className="py-lg">
        {view === "browse" && (
          <div className="space-y-lg">
            <div className="text-center space-y-md">
              <h1 className="display-text">Livestream Commerce Hub</h1>
              <p className="body-text text-neutral-500">
                Turn your live streams into shoppable experiences
              </p>
            </div>
            
            <div className="grid-12">
              <div className="col-span-12 md:col-span-6">
                <button
                  onClick={handleCreateStream}
                  className="card hover:shadow-lg transition-all duration-200 w-full text-left p-xl group"
                >
                  <div className="flex items-center justify-between mb-md">
                    <h3 className="heading-text">Start Live Stream</h3>
                    <div className="bg-primary text-white p-sm rounded-full transform transition-transform group-hover:scale-110">
                      <Video size={20} />
                    </div>
                  </div>
                  <p className="body-text text-neutral-500 mb-md">
                    Go live and showcase your products to engaged viewers
                  </p>
                  <div className="flex items-center text-primary font-medium">
                    <span>Create stream</span>
                    <ArrowRight size={16} className="ml-sm transition-transform group-hover:translate-x-1" />
                  </div>
                </button>
              </div>
              
              <div className="col-span-12 md:col-span-6">
                <div className="card p-xl">
                  <h3 className="heading-text mb-md">Browse Live Streams</h3>
                  <p className="body-text text-neutral-500 mb-lg">
                    Discover amazing products from live creators
                  </p>
                  <div className="space-y-md">
                    <div className="bg-neutral-100 hover:bg-neutral-200 transition-colors duration-200 rounded-md p-md cursor-pointer">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">@tech_creator</span>
                        <span className="live-indicator">LIVE</span>
                      </div>
                      <p className="text-sm text-neutral-500 mt-xs">
                        Latest gadgets showcase
                      </p>
                    </div>
                    
                    <div className="bg-neutral-100 hover:bg-neutral-200 transition-colors duration-200 rounded-md p-md cursor-pointer">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">@fashion_trends</span>
                        <span className="live-indicator">LIVE</span>
                      </div>
                      <p className="text-sm text-neutral-500 mt-xs">
                        Summer collection preview
                      </p>
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full mt-sm"
                      icon={<ArrowRight size={16} />}
                      iconPosition="right"
                    >
                      View all streams
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {view === "create" && (
          <CreatorDashboard
            user={currentUser}
            onStreamStart={handleStreamStart}
            onBack={handleBackToBrowse}
          />
        )}

        {view === "stream" && activeStream && (
          <StreamView
            stream={activeStream}
            user={currentUser}
            onBack={handleBackToBrowse}
          />
        )}
      </main>
    </div>
  );
}

