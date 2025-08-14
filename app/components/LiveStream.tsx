"use client";

import { Stream } from "@/app/lib/types";
import { Play, Pause, Volume2, Maximize, Users, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "./ui/Button";
import { Tooltip } from "./ui/Tooltip";
import { cn } from "@/app/lib/utils";

interface LiveStreamProps {
  stream: Stream;
  isCreator?: boolean;
  className?: string;
}

export function LiveStream({ stream, isCreator = false, className }: LiveStreamProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(80);
  const [streamDuration, setStreamDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Update stream duration every second
  useEffect(() => {
    if (!stream.isLive) return;
    
    const interval = setInterval(() => {
      const startTime = new Date(stream.startTime).getTime();
      const now = Date.now();
      const duration = Math.floor((now - startTime) / 1000);
      setStreamDuration(duration);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [stream.isLive, stream.startTime]);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={cn("card p-0 overflow-hidden", className)}>
      {/* Video Player */}
      <div className="relative aspect-video bg-neutral-900">
        {stream.isLive ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center text-white">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-md animate-pulse">
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
              {stream.endTime && (
                <p className="text-xs opacity-50 mt-sm">
                  Ended {new Date(stream.endTime).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Stream Controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-md">
              <Tooltip content={isPlaying ? "Pause" : "Play"}>
                <button
                  onClick={togglePlay}
                  className="p-sm rounded-full bg-white/20 hover:bg-white/30 transition-colors duration-200 text-white"
                >
                  {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                </button>
              </Tooltip>
              
              <div className="flex items-center space-x-sm">
                <Tooltip content={`Volume: ${volume}%`}>
                  <Volume2 size={16} className="text-white" />
                </Tooltip>
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

            <div className="flex items-center space-x-md">
              <div className="hidden sm:flex items-center space-x-md">
                <div className="flex items-center text-white/80 text-xs">
                  <Users size={14} className="mr-xs" />
                  <span>{stream.viewerCount.toLocaleString()}</span>
                </div>
                
                {stream.isLive && (
                  <div className="flex items-center text-white/80 text-xs">
                    <Clock size={14} className="mr-xs" />
                    <span>{formatDuration(streamDuration)}</span>
                  </div>
                )}
              </div>
              
              <Tooltip content={isFullscreen ? "Exit fullscreen" : "Fullscreen"}>
                <button 
                  onClick={toggleFullscreen}
                  className="p-sm rounded-full bg-white/20 hover:bg-white/30 transition-colors duration-200 text-white"
                >
                  <Maximize size={16} />
                </button>
              </Tooltip>
            </div>
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
        
        {/* Creator Indicator */}
        {isCreator && (
          <div className="absolute top-md right-md">
            <div className="badge badge-primary">
              CREATOR VIEW
            </div>
          </div>
        )}
      </div>

      {/* Stream Info */}
      <div className="p-lg">
        <h2 className="heading-text mb-sm">{stream.title}</h2>
        {stream.description && (
          <p className="body-text text-neutral-600">{stream.description}</p>
        )}
        
        <div className="flex flex-wrap items-center gap-md mt-md">
          <div className="flex items-center text-sm text-neutral-500">
            <Users size={16} className="mr-xs" />
            <span>{stream.viewerCount.toLocaleString()} viewers</span>
          </div>
          
          {stream.isLive && (
            <div className="flex items-center text-sm text-neutral-500">
              <Clock size={16} className="mr-xs" />
              <span>Live for {formatDuration(streamDuration)}</span>
            </div>
          )}
          
          {stream.isTokenGated && (
            <div className="badge badge-accent ml-auto">
              Token Gated
            </div>
          )}
        </div>
        
        {isCreator && (
          <div className="mt-lg p-md bg-primary-light rounded-md">
            <p className="text-sm font-medium text-primary">Creator View</p>
            <p className="text-sm text-neutral-600">
              You are currently live. Manage your products and engage with viewers.
            </p>
            
            <div className="flex gap-sm mt-md">
              <Button
                variant="primary"
                size="sm"
              >
                Manage Stream
              </Button>
              
              <Button
                variant="secondary"
                size="sm"
              >
                End Stream
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

