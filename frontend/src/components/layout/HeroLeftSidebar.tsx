"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Sparkles,
  ArrowRight,
  Video,
  Quote,
  Star,
  Heart,
  MapPin,
  Calendar,
  Radio,
  Clock,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Interfaces
interface SuccessStory {
  id: string;
  fullName: string;
  city: string;
  state: string;
  age: number | null;
  roleType: string;
  storyTitle: string;
  completeStory: string;
  videoUrl: string | null;
}

interface LiveUpdate {
  id: string;
  category: string;
  imageUrl: string | null;
  title: string;
  shortDescription: string;
  fullDescription: string | null;
  eventDate: Date | null;
  eventTime: string | null;
  venue: string | null;
  speakerName: string | null;
  registrationLink: string | null;
  externalLink: string | null;
  isFeatured: boolean;
  createdAt: Date;
}

interface HeroLeftSidebarProps {
  stories: SuccessStory[];
  updates: LiveUpdate[];
}

// 1. Success Story Video Player Widget
export function StoryPlayerWidget({ stories }: { stories: SuccessStory[] }) {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const activeStory = stories[activeIndex];

  useEffect(() => {
    if (stories.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % stories.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [stories.length]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      }
    }
  }, [activeIndex]);

  if (!activeStory) return null;

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="relative overflow-hidden bg-white/10 dark:bg-slate-900/30 backdrop-blur-lg border border-white/20 dark:border-slate-800/40 rounded-3xl p-4 shadow-xl flex flex-col justify-between min-h-[260px] group">

      {/* Pink Accent Line */}
      <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-500" />

      <div className="space-y-3">
        {/* Header Title */}
        <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
          <span className="text-[10px] font-black uppercase tracking-widest text-pink-300 flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5 animate-pulse fill-pink-300 text-pink-300" /> Patient Story
          </span>
          <span className="text-[9px] bg-white/10 px-1.5 py-0.5 rounded text-white/80 border border-white/5 font-semibold">
            {activeStory.roleType === "Patient" ? "Survivor" : "Family"}
          </span>
        </div>

        {/* Video Player */}
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-950/85 border border-white/10 shadow-inner group/player">
          {activeStory.videoUrl ? (
            <video
              ref={videoRef}
              src={activeStory.videoUrl}
              autoPlay
              muted={isMuted}
              playsInline
              loop
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-pink-500/20 to-purple-600/20 flex items-center justify-center">
              <Heart className="h-8 w-8 text-pink-400 fill-pink-500/10" />
            </div>
          )}

          {activeStory.videoUrl && (
            <button
              onClick={toggleMute}
              className="absolute bottom-2 right-2 h-7 w-7 rounded-full bg-black/45 backdrop-blur text-white flex items-center justify-center hover:bg-black/60 active:scale-95 transition-all cursor-pointer z-10 opacity-0 group-hover/player:opacity-100 transition-opacity duration-200"
            >
              {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
            </button>
          )}
        </div>

        {/* Info */}
        <div className="space-y-1 text-white/95">
          <h4 className="font-extrabold text-xs text-pink-200">{activeStory.fullName}</h4>
          <div className="flex items-center gap-0.5 text-[9px] text-pink-100/70">
            <MapPin className="h-2.5 w-2.5 text-pink-400" />
            <span>{activeStory.city}, {activeStory.state}</span>
          </div>
          <p className="text-[10px] leading-relaxed text-white/80 line-clamp-2 pt-1 border-t border-white/5 italic">
            "{activeStory.completeStory.split(/[.!?]/)[0]}."
          </p>
        </div>
      </div>

      {/* Button */}
      <Button
        onClick={() => router.push(`/success-stories/${activeStory.id}`)}
        className="w-full bg-white/10 hover:bg-white/20 text-white hover:text-white border border-white/15 rounded-xl text-[10px] h-7.5 cursor-pointer mt-2 transition-all active:scale-95 flex items-center justify-center gap-1 font-bold"
      >
        View Story
        <ArrowRight className="h-3 w-3" />
      </Button>
    </div>
  );
}

// 2. Countdown Timer helper
function LiveCountdownTimer({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const calculateTime = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime();
      if (difference <= 0) {
        setTimeLeft("Ongoing");
        return;
      }
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) {
        setTimeLeft(`Starts in: ${days}d ${hours}h`);
      } else if (hours > 0) {
        setTimeLeft(`Starts in: ${hours}h ${minutes}m`);
      } else {
        setTimeLeft(`Starts in: ${minutes}m`);
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 60000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <span className="text-[9px] bg-pink-600/35 border border-pink-500/40 text-pink-200 px-2 py-0.5 rounded font-black tracking-wide flex items-center gap-0.5">
      <Clock className="h-2.5 w-2.5 text-pink-300" />
      {timeLeft}
    </span>
  );
}

// Helper: check if event is today
function isEventLive(eventDate: Date | null) {
  if (!eventDate) return false;
  const today = new Date();
  const d = new Date(eventDate);
  return d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear();
}

// Helper: check if new update (within last 3 days)
function isNewUpdate(createdAt: Date) {
  const diff = new Date().getTime() - new Date(createdAt).getTime();
  const threeDays = 3 * 24 * 60 * 60 * 1000;
  return diff < threeDays;
}

// Helper: resolve tag colors
function getCategoryTagStyle(category: string) {
  switch (category.toLowerCase()) {
    case "webinar":
      return "bg-emerald-500/20 text-emerald-250 border-emerald-500/20";
    case "campaign":
      return "bg-rose-500/20 text-rose-200 border-rose-500/20";
    case "news":
      return "bg-sky-500/20 text-sky-200 border-sky-500/20";
    case "event":
      return "bg-amber-500/20 text-amber-200 border-amber-500/20";
    default:
      return "bg-purple-500/20 text-purple-200 border-purple-500/20";
  }
}

// 3. Live Updates Hub Ticker Widget
export function LiveUpdatesWidget({ updates }: { updates: LiveUpdate[] }) {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto rotate updates every 6 seconds
  useEffect(() => {
    if (updates.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % updates.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [updates.length]);

  if (updates.length === 0) return null;

  const activeUpdate = updates[activeIndex];

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev + 1) % updates.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev - 1 + updates.length) % updates.length);
  };

  // Determine registration status
  let isClosed = false;
  let statusText = "Open";
  if (activeUpdate.eventDate) {
    const passed = new Date(activeUpdate.eventDate).getTime() < new Date().getTime() - (24 * 60 * 60 * 1000);
    if (passed) {
      isClosed = true;
      statusText = "Completed";
    } else {
      const diff = new Date(activeUpdate.eventDate).getTime() - new Date().getTime();
      const oneDay = 24 * 60 * 60 * 1000;
      if (diff < oneDay) {
        statusText = "Closing Soon";
      }
    }
  }

  // Handle redirects
  const handleAction = () => {
    if (activeUpdate.category.toLowerCase() === "webinar") {
      router.push(`/webinars`);
    } else if (activeUpdate.category.toLowerCase() === "campaign") {
      router.push(`/campaigns`);
    } else if (activeUpdate.category.toLowerCase() === "news") {
      router.push(activeUpdate.externalLink || `/learn/articles`);
    } else if (activeUpdate.category.toLowerCase() === "event") {
      router.push(activeUpdate.registrationLink || `/webinars`);
    } else {
      router.push(activeUpdate.externalLink || `/learn`);
    }
  };

  return (
    <div className="relative overflow-hidden bg-white/10 dark:bg-slate-900/30 backdrop-blur-lg border border-white/20 dark:border-slate-800/40 rounded-3xl p-4 shadow-xl flex flex-col justify-between min-h-[290px] group">

      {/* Purple Accent Line */}
      <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500" />

      <div className="space-y-3">
        {/* Header with tags and arrows */}
        <div className="flex justify-between items-center pb-1.5 border-b border-white/10">
          <span className="text-[10px] font-black uppercase tracking-widest text-pink-300">
            Live Updates Hub
          </span>
          {updates.length > 1 && (
            <div className="flex gap-1.5">
              <button
                onClick={handlePrev}
                className="h-5 w-5 rounded-full bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-white/15 active:scale-90 transition-all cursor-pointer"
              >
                <ChevronLeft className="h-3 w-3" />
              </button>
              <button
                onClick={handleNext}
                className="h-5 w-5 rounded-full bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-white/15 active:scale-90 transition-all cursor-pointer"
              >
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>

        {/* Content box */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeUpdate.id}
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 5 }}
            transition={{ duration: 0.25 }}
            className="space-y-3"
          >
            {/* Category Badges, Live, New indicators */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase border tracking-wide ${getCategoryTagStyle(activeUpdate.category)}`}>
                {activeUpdate.category}
              </span>

              {/* LIVE indicator */}
              {isEventLive(activeUpdate.eventDate) && (
                <span className="bg-red-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider flex items-center gap-0.5 animate-pulse">
                  <Radio className="h-2.5 w-2.5" /> Live
                </span>
              )}

              {/* NEW indicator */}
              {isNewUpdate(activeUpdate.createdAt) && (
                <span className="bg-blue-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">
                  New
                </span>
              )}

              {/* Countdown timer for upcoming items */}
              {activeUpdate.eventDate && !isClosed && !isEventLive(activeUpdate.eventDate) && (
                <LiveCountdownTimer targetDate={activeUpdate.eventDate} />
              )}
            </div>

            {/* Title & Desc */}
            <div className="flex gap-2.5">
              {activeUpdate.imageUrl && (
                <div className="h-14 w-20 rounded-xl overflow-hidden bg-slate-900 border border-white/5 flex-shrink-0">
                  <img src={activeUpdate.imageUrl} alt={activeUpdate.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-1 min-w-0 space-y-0.5">
                <h4 className="font-extrabold text-xs text-white line-clamp-1">
                  {activeUpdate.title}
                </h4>
                <p className="text-[10px] text-white/80 leading-relaxed line-clamp-2">
                  {activeUpdate.shortDescription}
                </p>
              </div>
            </div>

            {/* Venue & Event dates */}
            {(activeUpdate.eventDate || activeUpdate.venue) && (
              <div className="space-y-1 pl-1 text-[9px] text-white/50 font-bold border-l border-white/10">
                {activeUpdate.eventDate && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-pink-400" />
                    <span>
                      {new Date(activeUpdate.eventDate).toLocaleDateString("en-US")}
                      {activeUpdate.eventTime && ` • ${activeUpdate.eventTime}`}
                    </span>
                  </div>
                )}
                {activeUpdate.venue && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-pink-400" />
                    <span className="truncate max-w-[200px]">{activeUpdate.venue}</span>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Button & dots footer */}
      <div className="space-y-2.5 pt-2">
        <div className="flex justify-between items-center">
          {/* Pagination Indicators */}
          <div className="flex gap-1">
            {updates.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`h-1 rounded-full transition-all cursor-pointer ${idx === activeIndex ? 'w-3 bg-pink-500' : 'w-1 bg-white/20'
                  }`}
              />
            ))}
          </div>

          <span className={`text-[8.5px] font-black uppercase px-2 py-0.5 rounded ${statusText === "Completed" ? "bg-slate-800 text-white/50" : "bg-pink-500/10 text-pink-300"
            }`}>
            Status: {statusText}
          </span>
        </div>

        <Button
          onClick={handleAction}
          disabled={isClosed}
          className={`w-full text-[10px] h-7.5 rounded-xl cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-1 font-bold ${isClosed
              ? "bg-slate-800 text-white/40 cursor-not-allowed border border-white/5"
              : "bg-white/15 hover:bg-white/25 text-white border border-white/10"
            }`}
        >
          {isClosed ? "Registration Closed" : activeUpdate.category.toLowerCase() === "webinar" ? "Register Now" : "Explore More"}
          {!isClosed && <ArrowRight className="h-3 w-3" />}
        </Button>
      </div>

    </div>
  );
}

// Main Sidebar stack wrapper
export default function HeroLeftSidebar({ stories, updates }: HeroLeftSidebarProps) {
  return (
    <div className="flex flex-col gap-6 w-full h-full justify-center">
      <StoryPlayerWidget stories={stories} />
      <LiveUpdatesWidget updates={updates} />
    </div>
  );
}
