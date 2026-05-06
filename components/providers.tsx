"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { ReactNode, useState, useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  // Register Service Worker for WebView-safe updates.
  useEffect(() => {
    let hasReloadedForNewWorker = false;
    let intervalId: ReturnType<typeof setInterval> | null = null;
    let onControllerChange: (() => void) | null = null;

    if ("serviceWorker" in navigator) {
      const ua = navigator.userAgent || "";
      const isWebView =
        /\bwv\b/i.test(ua) ||
        /; wv\)/i.test(ua) ||
        (/\bVersion\/[\d.]+/i.test(ua) && /Chrome\/[\d.]+/i.test(ua) && /Android/i.test(ua));

      // In-app WebViews are prone to stale/partial SW state after deploy.
      // Avoid SW control there to prevent startup deadlocks.
      if (isWebView) {
        navigator.serviceWorker.getRegistrations().then((regs) => {
          regs.forEach((reg) => reg.unregister());
        });
        if ("caches" in window) {
          caches.keys().then((keys) => keys.forEach((key) => caches.delete(key)));
        }
        return () => undefined;
      }

      const buildId =
        typeof window !== "undefined" && (window as any).__NEXT_DATA__?.buildId
          ? String((window as any).__NEXT_DATA__.buildId)
          : "dev";
      const swUrl = `/sw.js?build=${encodeURIComponent(buildId)}`;

      navigator.serviceWorker
        .register(swUrl, { updateViaCache: "none" })
        .then((reg) => {
          const promoteWaitingWorker = () => {
            if (reg.waiting) {
              reg.waiting.postMessage({ type: "SKIP_WAITING" });
            }
          };

          promoteWaitingWorker();
          reg.update();
          intervalId = setInterval(() => {
            reg.update();
          }, 30000);

          reg.addEventListener("updatefound", () => {
            const installing = reg.installing;
            if (!installing) return;
            installing.addEventListener("statechange", () => {
              if (installing.state === "installed") {
                promoteWaitingWorker();
              }
            });
          });
        })
        .catch((err) => {
          console.error("[APP] Service Worker registration failed:", err);
        });

      onControllerChange = () => {
        if (!hasReloadedForNewWorker) {
          hasReloadedForNewWorker = true;
          window.location.reload();
        }
      };
      navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
      if (onControllerChange) navigator.serviceWorker?.removeEventListener("controllerchange", onControllerChange);
    };
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster position="top-center" />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
