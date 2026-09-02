"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import WebinarRegisterButton from "@/components/webinars/WebinarRegisterButton";
import { Clock, ShieldCheck, Video, AlertCircle } from "lucide-react";

interface WebinarJoinWidgetProps {
  webinarId: string;
  webinarTitle: string;
  startTimeStr: string;
  endTimeStr: string;
  isRegistered: boolean;
  isLoggedIn: boolean;
  currentUser?: {
    id: string;
    name?: string | null;
    email?: string | null;
    role?: string;
  } | null;
}

export default function WebinarJoinWidget({
  webinarId,
  webinarTitle,
  startTimeStr,
  endTimeStr,
  isRegistered,
  isLoggedIn,
  currentUser,
}: WebinarJoinWidgetProps) {
  const router = useRouter();
  const startTime = new Date(startTimeStr);
  const endTime = new Date(endTimeStr);
  
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [isPast, setIsPast] = useState(false);
  // isPending state removed since registration is managed by WebinarRegisterButton

  useEffect(() => {
    const checkTime = () => {
      const now = new Date();
      
      if (now >= startTime && now <= endTime) {
        setIsLive(true);
        setIsPast(false);
        setTimeLeft(null);
      } else if (now > endTime) {
        setIsLive(false);
        setIsPast(true);
        setTimeLeft(null);
      } else {
        setIsLive(false);
        setIsPast(false);
        
        const diffMs = startTime.getTime() - now.getTime();
        const diffHours = Math.floor(diffMs / 3600000);
        const diffMinutes = Math.floor((diffMs % 3600000) / 60000);
        const diffSeconds = Math.floor((diffMs % 60000) / 1000);
        
        setTimeLeft({ hours: diffHours, minutes: diffMinutes, seconds: diffSeconds });
      }
    };

    checkTime();
    const interval = setInterval(checkTime, 1000);
    return () => clearInterval(interval);
  }, [startTimeStr, endTimeStr]);

  // handleRegister removed (replaced by WebinarRegisterButton client component)

  const handleJoin = () => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    router.push(`/webinars/${webinarId}/join`);
  };

  if (!isRegistered && !isPast) {
    return (
      <div className="bg-pink-50/50 border border-pink-100 rounded-2xl p-6 text-center space-y-4 shadow-sm">
        <div className="flex justify-center text-primary">
          <Clock className="h-10 w-10 stroke-[1.5] animate-pulse" />
        </div>
        <div>
          <h3 className="font-heading text-lg font-bold text-slate-800">Secure Your Slot</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            You are not registered for this webinar yet. Reserve your seat now to get details and attendance access.
          </p>
        </div>
        <WebinarRegisterButton
          webinarId={webinarId}
          webinarTitle={webinarTitle}
          currentUser={currentUser}
          buttonText="Register Now"
          className="w-full bg-primary hover:bg-primary/95 text-white font-bold rounded-xl transition-all shadow-sm py-2.5 h-auto text-xs"
        />
      </div>
    );
  }

  if (isPast) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center space-y-3 shadow-sm">
        <div className="flex justify-center text-slate-400">
          <AlertCircle className="h-10 w-10 stroke-[1.5]" />
        </div>
        <div>
          <h3 className="font-heading text-lg font-bold text-slate-700">Webinar Completed</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            This webinar has already ended. Past webinars materials and recording links are available inside your dashboard.
          </p>
        </div>
      </div>
    );
  }

  if (isLive) {
    return (
      <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 text-center space-y-4 shadow-sm animate-pulse">
        <div className="flex justify-center text-emerald-500">
          <Video className="h-10 w-10 stroke-[1.5]" />
        </div>
        <div>
          <h3 className="font-heading text-lg font-bold text-emerald-800">Webinar is Live!</h3>
          <p className="text-xs text-emerald-600 mt-1 max-w-sm mx-auto">
            The meeting room has opened. Click below to join the stream and track your attendance.
          </p>
        </div>
        <Button
          onClick={handleJoin}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all uppercase tracking-wider"
        >
          Join Live Webinar
        </Button>
      </div>
    );
  }

  // Upcoming countdown display
  return (
    <div className="bg-pink-50/50 border border-pink-100 rounded-2xl p-6 text-center space-y-4 shadow-sm">
      <div className="flex justify-center text-primary">
        <Clock className="h-10 w-10 stroke-[1.5]" />
      </div>
      <div>
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-pink-100 text-primary border border-pink-200 uppercase tracking-widest">
          <ShieldCheck className="h-3 w-3" /> Reservation Locked
        </span>
        <h3 className="font-heading text-base font-bold text-slate-800 mt-2.5">Webinar starts in:</h3>
      </div>
      
      {timeLeft && (
        <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
          <div className="bg-white border border-pink-100/60 rounded-xl p-2.5 shadow-sm">
            <span className="block text-2xl font-black text-primary font-mono">{timeLeft.hours.toString().padStart(2, "0")}</span>
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Hours</span>
          </div>
          <div className="bg-white border border-pink-100/60 rounded-xl p-2.5 shadow-sm">
            <span className="block text-2xl font-black text-primary font-mono">{timeLeft.minutes.toString().padStart(2, "0")}</span>
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Mins</span>
          </div>
          <div className="bg-white border border-pink-100/60 rounded-xl p-2.5 shadow-sm">
            <span className="block text-2xl font-black text-primary font-mono">{timeLeft.seconds.toString().padStart(2, "0")}</span>
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Secs</span>
          </div>
        </div>
      )}

      <Button
        disabled
        className="w-full bg-slate-100 border border-slate-200 text-slate-400 font-bold rounded-xl select-none"
      >
        Meeting Link Locked
      </Button>
    </div>
  );
}
