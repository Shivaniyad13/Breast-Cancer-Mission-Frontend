"use client";

import { ArrowUp } from "lucide-react";

export default function BackToTopButton({
  variant,
}: {
  variant: "link" | "icon";
}) {
  const className =
    variant === "link"
      ? "w-full text-left text-sm font-semibold text-slate-700 hover:text-primary hover:bg-pink-50 rounded-lg px-3 py-1.5 -mx-3 transition-colors duration-150 cursor-pointer"
      : "flex items-center justify-center h-7 w-7 rounded-full bg-pink-500 hover:bg-pink-600 text-white transition-all duration-200 shadow-sm shadow-pink-500/20 cursor-pointer";

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label={variant === "icon" ? "Back to top" : undefined}
      className={className}
    >
      {variant === "icon" ? <ArrowUp className="h-3.5 w-3.5" /> : "Back to Top"}
    </button>
  );
}
