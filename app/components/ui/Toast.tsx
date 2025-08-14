"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/app/lib/utils";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

// Toast types
type ToastType = "success" | "error" | "info" | "warning";

// Toast item interface
interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
}

// Context for toast management
interface ToastContextType {
  toasts: ToastItem[];
  addToast: (message: string, type: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Toast provider component
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const addToast = (message: string, type: ToastType = "info", duration = 5000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      {isMounted &&
        createPortal(
          <div className="fixed bottom-0 right-0 z-toast p-4 space-y-2 max-w-sm">
            {toasts.map((toast) => (
              <Toast
                key={toast.id}
                toast={toast}
                onClose={() => removeToast(toast.id)}
              />
            ))}
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  );
}

// Hook to use toast
export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

// Individual toast component
function Toast({ toast, onClose }: { toast: ToastItem; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, toast.duration);

    return () => clearTimeout(timer);
  }, [toast.duration, onClose]);

  const icons = {
    success: <CheckCircle size={18} className="text-success" />,
    error: <AlertCircle size={18} className="text-error" />,
    info: <Info size={18} className="text-primary" />,
    warning: <AlertTriangle size={18} className="text-warning" />,
  };

  const bgColors = {
    success: "bg-success-light border-success/20",
    error: "bg-error-light border-error/20",
    info: "bg-primary-light border-primary/20",
    warning: "bg-warning-light border-warning/20",
  };

  return (
    <div
      className={cn(
        "rounded-lg shadow-md border p-3 flex items-start animate-slide-in",
        bgColors[toast.type]
      )}
      role="alert"
    >
      <div className="flex-shrink-0 mr-3">{icons[toast.type]}</div>
      <div className="flex-1 mr-2">
        <p className="text-sm font-medium text-neutral-900">{toast.message}</p>
      </div>
      <button
        onClick={onClose}
        className="flex-shrink-0 text-neutral-500 hover:text-neutral-900 transition-colors"
        aria-label="Close"
      >
        <X size={16} />
      </button>
    </div>
  );
}

