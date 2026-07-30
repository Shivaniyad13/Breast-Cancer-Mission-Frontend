"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error for tracking
    console.error("Next.js Runtime Error Boundary caught:", error);

    // Check if the error is a ChunkLoadError
    // This happens when build hashes change or when port/dev-server states mismatch
    if (
      error.message?.includes("ChunkLoadError") ||
      error.name === "ChunkLoadError" ||
      error.message?.includes("Loading chunk") ||
      error.message?.includes("Failed to fetch dynamically imported module")
    ) {
      console.warn("ChunkLoadError or script load failure detected. Performing a hard reload...");
      // Trigger a reload to fetch current build assets from the active server
      window.location.reload();
    }
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center space-y-5">
      <div className="p-4 rounded-full bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-10 h-10"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
          />
        </svg>
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Application Error
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
          An unexpected dynamic script load failure or rendering issue occurred. Reloading the page usually resolves this.
        </p>
      </div>
      <div className="flex gap-3 justify-center">
        <Button
          onClick={() => window.location.reload()}
          className="bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:hover:bg-slate-200 dark:text-slate-900 font-semibold rounded-lg px-5 py-2 cursor-pointer transition-all duration-300"
        >
          Refresh Page
        </Button>
        <Button
          variant="outline"
          onClick={() => reset()}
          className="border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 font-semibold rounded-lg px-5 py-2 cursor-pointer transition-all duration-300"
        >
          Try Again
        </Button>
      </div>
    </div>
  );
}
