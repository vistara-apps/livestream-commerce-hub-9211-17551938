"use client";

import { useState, useEffect } from "react";
import { cn } from "@/app/lib/utils";
import { User, Stream } from "@/app/lib/types";
import { StreamView } from "./StreamView";
import { CreatorDashboard } from "./CreatorDashboard";
import { Navigation } from "./Navigation";

interface AppShellProps {
  variant?: "default" | "streamView";
  className?: string;
}

export function AppShell({ variant = "default", className }: AppShellProps) {
  const [currentUser, setCurrentUser] = useState<User | undefined>(undefined);
  const [activeStream, setActiveStream] = useState<Stream | null>(null);
  const [view, setView] = useState<"browse" | "create" | "stream">("browse");

  useEffect(() => {
    // Mock user for demo
    setCurrentUser({
      userId: "user-1",
      walletAddress: "0x1234...5678",
      username: "creator_demo",
      bio: "Digital creator and live commerce enthusiast"
    });
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
                  className="card hover:shadow-lg transition-shadow duration-200 w-full text-left p-xl"
                >
                  <h3 className="heading-text mb-md">Start Live Stream</h3>
                  <p className="body-text text-neutral-500">
                    Go live and showcase your products to engaged viewers
                  </p>
                </button>
              </div>
              
              <div className="col-span-12 md:col-span-6">
                <div className="card p-xl">
                  <h3 className="heading-text mb-md">Browse Live Streams</h3>
                  <p className="body-text text-neutral-500 mb-lg">
                    Discover amazing products from live creators
                  </p>
                  <div className="space-y-md">
                    <div className="bg-neutral-100 rounded-md p-md">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">@tech_creator</span>
                        <span className="live-indicator">LIVE</span>
                      </div>
                      <p className="text-sm text-neutral-500 mt-xs">
                        Latest gadgets showcase
                      </p>
                    </div>
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

