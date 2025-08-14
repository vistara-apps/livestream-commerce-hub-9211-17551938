"use client";

import {
  useMiniKit,
  useAddFrame,
  useOpenUrl,
} from "@coinbase/onchainkit/minikit";
import { useEffect, useState, useCallback, useMemo } from "react";
import { AppShell } from "./components/AppShell";
import { Button } from "./components/ui/Button";
import { Icon } from "./components/ui/Icon";
import { Tooltip } from "./components/ui/Tooltip";
import { useToast } from "./components/ui/Toast";

export default function App() {
  const { setFrameReady, isFrameReady, context } = useMiniKit();
  const [frameAdded, setFrameAdded] = useState(false);
  const { addToast } = useToast();

  const addFrame = useAddFrame();
  const openUrl = useOpenUrl();

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  const handleAddFrame = useCallback(async () => {
    try {
      const frameAdded = await addFrame();
      setFrameAdded(Boolean(frameAdded));
      
      if (frameAdded) {
        addToast("Frame saved successfully!", "success");
      }
    } catch (error) {
      addToast("Failed to save frame. Please try again.", "error");
      console.error("Error adding frame:", error);
    }
  }, [addFrame, addToast]);

  const saveFrameButton = useMemo(() => {
    if (context && !context.client.added) {
      return (
        <Tooltip content="Save this app to your Farcaster frames">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleAddFrame}
            className="text-accent"
            icon={<Icon name="plus" size="sm" />}
          >
            Save Frame
          </Button>
        </Tooltip>
      );
    }

    if (frameAdded) {
      return (
        <div className="flex items-center space-x-1 text-sm font-medium text-success animate-fade-in">
          <Icon name="check" size="sm" className="text-success" />
          <span>Saved</span>
        </div>
      );
    }

    return null;
  }, [context, frameAdded, handleAddFrame]);

  return (
    <div className="min-h-screen bg-bg">
      <div className="container-app">
        {/* Header */}
        <header className="flex justify-between items-center py-lg">
          <div>
            <h1 className="display-text">Commerce Hub</h1>
            <p className="text-sm text-neutral-500">Live shopping platform</p>
          </div>
          <div>{saveFrameButton}</div>
        </header>

        {/* Main App */}
        <AppShell />

        {/* Footer */}
        <footer className="py-lg text-center">
          <Button
            variant="ghost"
            size="sm"
            className="text-neutral-500 text-xs"
            onClick={() => openUrl("https://base.org/builders/minikit")}
          >
            Built on Base with MiniKit
          </Button>
        </footer>
      </div>
    </div>
  );
}

