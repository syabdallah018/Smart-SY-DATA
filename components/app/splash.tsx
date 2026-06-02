"use client";

import { useEffect, useState } from "react";
import { BrandEntryScreen } from "@/components/app/BrandEntry";

export function SplashScreenWrapper({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    const hasSeenSplash = sessionStorage.getItem("splashShown");
    if (!hasSeenSplash) {
      setShowSplash(true);
      sessionStorage.setItem("splashShown", "true");
      const timer = setTimeout(() => setShowSplash(false), 1600);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, []);

  if (showSplash) {
    return (
      <BrandEntryScreen
        subtitle="Welcome back"
        message="Loading your secure dashboard and latest balance."
        accentLabel="SY DATA SUB"
      />
    );
  }

  return <>{children}</>;
}
