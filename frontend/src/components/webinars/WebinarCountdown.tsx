"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

interface WebinarCountdownProps {
  startTime: string | Date;
  onLive?: () => void;
}

export default function WebinarCountdown({ startTime, onLive }: WebinarCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<string | null>(null);

  useEffect(() => {
    const target = new Date(startTime).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft("Live Now");
        if (onLive) onLive();
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      const parts = [];
      if (days > 0) parts.push(`${days}d`);
      if (hours > 0 || days > 0) parts.push(`${hours}h`);
      parts.push(`${minutes}m`);
      parts.push(`${seconds}s`);

      setTimeLeft(parts.join(" "));
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  if (!timeLeft) return null;

  const isLive = timeLeft === "Live Now";

  return (
    <div className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md ${
      isLive 
        ? "bg-emerald-50 text-emerald-600 border border-emerald-100 animate-pulse" 
        : "bg-pink-50 text-primary border border-pink-100"
    }`}>
      <Clock className="h-3.5 w-3.5" />
      <span>{isLive ? timeLeft : `Starts in ${timeLeft}`}</span>
    </div>
  );
}
