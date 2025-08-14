
"use client";

import { Stream } from "@/app/lib/types";
import { Play, Pause, Volume2, Maximize } from "lucide-react";
import { useState } from "react";

interface LiveStreamProps {
  stream: Stream;
  isCreator: boolean;
}

export function LiveStream({ stream, isCreator }: LiveStreamProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(100);

  return (
    <div className="card p-0 overflow-hidden">
      {/* Video Player */}
      <div className="relative aspect-video bg-neutral-900">
        {stream.isLive ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center text-white">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-md">
                <Play size={24} />
              </div>
              <h3 className="font-medium mb-sm">Live Stream</h3>
              <p className="text-sm opacity-75">{stream.title}</p>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center text-white">
              <h3 className="font-medium mb-sm">Stream Ended</h3>
              <p className="text-sm opacity-75">This live stream has ended</p>
            </div>
          </div>
        )}

        {/* Stream Controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-md">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-sm rounded-full bg-white/20 hover:bg-white/30 transition-colors duration-200 text-white"
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              </button>
              
              <div className="flex items-center space-x-sm">
                <Volume2 size={16} className="text-white" />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(parseInt(e.target.value))}
                  className="w-20 accent-white"
                />
              </div>
            </div>

            <button className="p-sm rounded-full bg-white/20 hover:bg-white/30 transition-colors duration-200 text-white">
              <Maximize size={16} />
            </button>
          </div>
        </div>

        {/* Live Indicator */}
        {stream.isLive && (
          <div className="absolute top-md left-md">
            <div className="live-indicator">
              LIVE
            </div>
          </div>
        )}
      </div>

      {/* Stream Info */}
      <div className="p-lg">
        <h2 className="heading-text mb-sm">{stream.title}</h2>
        {stream.description && (
          <p className="body-text text-neutral-500">{stream.description}</p>
        )}
        
        {isCreator && (
          <div className="mt-lg p-md bg-accent/10 rounded-md">
            <p className="text-sm font-medium text-accent">Creator View</p>
            <p className="text-sm text-neutral-500">
              You are currently live. Manage your products and engage with viewers.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
