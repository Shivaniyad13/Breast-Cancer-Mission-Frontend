"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Calendar, 
  Heart, 
  Award, 
  ShieldCheck, 
  Megaphone,
  ChevronLeft, 
  ChevronRight, 
  ArrowRight,
  Sparkles,
  MapPin,
  Newspaper,
  BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Interfaces
export interface SuccessStory {
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

export interface UpdateItem {
  id: string;
  type: "WEBINAR" | "CAMPAIGN" | "NEWS" | "ANNOUNCEMENT" | "EVENT" | "TIP" | "RESEARCH";
  title: string;
  description: string;
  date: string;
  link: string;
  imageUrl?: string | null;
}

// ----------------------------------------------------
// LEFT PANEL: Patient Success Story Loop
// ----------------------------------------------------
export function HeroLeftPanel({ stories }: { stories: SuccessStory[] }) {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const activeStory = stories[activeIndex];

  // Auto-slide trigger for stories
  useEffect(() => {
    if (stories.length <= 1) return;
    
    // Auto switch every 7 seconds
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % stories.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [stories.length]);

  // Load and play new video when index changes
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
    <div className="w-full bg-white/10 dark:bg-slate-900/30 backdrop-blur-lg border border-white/20 dark:border-slate-800/40 rounded-3xl p-4 shadow-2xl relative overflow-hidden group">
      
      {/* Pink Top Accent Glow */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-pink-500 to-purple-600" />
      
      <div className="space-y-4">
        
        {/* Title */}
        <div className="flex items-center gap-1.5 text-pink-300">
          <Sparkles className="h-4 w-4 animate-pulse fill-pink-300" />
          <span className="text-xs font-black uppercase tracking-widest text-white/95">Survivor Story</span>
        </div>

        {/* Small Video Box */}
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-950/80 border border-white/10 shadow-inner">
          <AnimatePresence mode="wait">
            {activeStory.videoUrl ? (
              <motion.video
                key={activeStory.id}
                ref={videoRef}
                src={activeStory.videoUrl}
                autoPlay
                muted={isMuted}
                playsInline
                loop
                className="w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-pink-500/20 to-purple-600/20 flex items-center justify-center">
                <Heart className="h-8 w-8 text-pink-400 fill-pink-500/10" />
              </div>
            )}
          </AnimatePresence>

          {/* Mute toggle overlay */}
          {activeStory.videoUrl && (
            <button
              onClick={toggleMute}
              className="absolute bottom-2 right-2 h-7 w-7 rounded-full bg-black/45 backdrop-blur text-white flex items-center justify-center hover:bg-black/60 active:scale-95 transition-all cursor-pointer z-10"
            >
              {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
            </button>
          )}
        </div>

        {/* Metadata & Quote */}
        <div className="space-y-2 text-white/90">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-sm text-pink-200 truncate">
              {activeStory.fullName}
            </h4>
            <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-white/80 border border-white/5 font-semibold">
              {activeStory.roleType === "Patient" ? "Survivor" : "Family"}
            </span>
          </div>

          <div className="flex items-center gap-0.5 text-[10px] text-pink-100/70">
            <MapPin className="h-3 w-3 text-pink-400" />
            <span>{activeStory.city}, {activeStory.state}</span>
          </div>

          <p className="text-xs text-white/80 line-clamp-3 italic leading-relaxed pt-1 border-t border-white/10">
            "{activeStory.completeStory.split(/[.!?]/)[0]}."
          </p>
        </div>

        {/* Button */}
        <Button
          onClick={() => router.push(`/success-stories/${activeStory.id}`)}
          className="w-full bg-white/10 hover:bg-white/20 text-white hover:text-white border border-white/15 rounded-xl text-xs py-4.5 cursor-pointer transition-all active:scale-98 shadow-sm flex items-center justify-center gap-1.5 font-bold"
        >
          View Story
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>

      </div>
    </div>
  );
}

// Helper to resolve icon components based on update type
function getUpdateIcon(type: string) {
  switch (type) {
    case "WEBINAR":
      return <Calendar className="h-4 w-4 text-emerald-300" />;
    case "CAMPAIGN":
      return <Heart className="h-4 w-4 text-rose-300 fill-rose-300/10" />;
    case "NEWS":
      return <Newspaper className="h-4 w-4 text-sky-300" />;
    case "ANNOUNCEMENT":
      return <Megaphone className="h-4 w-4 text-amber-300" />;
    case "TIP":
      return <ShieldCheck className="h-4 w-4 text-teal-300" />;
    case "RESEARCH":
      return <BookOpen className="h-4 w-4 text-indigo-300" />;
    default:
      return <Award className="h-4 w-4 text-pink-300" />;
  }
}

// Helper to resolve tag styles based on update type
function getUpdateTagStyle(type: string) {
  switch (type) {
    case "WEBINAR":
      return "bg-emerald-500/20 text-emerald-200 border-emerald-500/20";
    case "CAMPAIGN":
      return "bg-rose-500/20 text-rose-200 border-rose-500/20";
    case "NEWS":
      return "bg-sky-500/20 text-sky-200 border-sky-500/20";
    case "TIP":
      return "bg-teal-500/20 text-teal-200 border-teal-500/20";
    case "RESEARCH":
      return "bg-indigo-500/20 text-indigo-200 border-indigo-500/20";
    default:
      return "bg-pink-500/20 text-pink-200 border-pink-500/20";
  }
}

// ----------------------------------------------------
// RIGHT PANEL: Dynamic Updates Auto-Slider
// ----------------------------------------------------
export function HeroRightPanel({ updates }: { updates: UpdateItem[] }) {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto switch updates every 6 seconds
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

  return (
    <div className="w-full bg-white/10 dark:bg-slate-900/30 backdrop-blur-lg border border-white/20 dark:border-slate-800/40 rounded-3xl p-4 shadow-2xl relative overflow-hidden flex flex-col justify-between h-full min-h-[380px] group">
      
      {/* Pink/Purple Top Accent Glow */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500" />

      {/* Header controls */}
      <div className="flex justify-between items-center pb-2 border-b border-white/10">
        <span className="text-xs font-black uppercase tracking-widest text-white/95">Dynamic Updates</span>
        
        {/* Next/Prev buttons */}
        <div className="flex gap-1">
          <button
            onClick={handlePrev}
            className="h-6 w-6 rounded-full bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-white/15 active:scale-90 transition-all cursor-pointer"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={handleNext}
            className="h-6 w-6 rounded-full bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-white/15 active:scale-90 transition-all cursor-pointer"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Sliding Update Content */}
      <div className="flex-1 py-3 flex flex-col justify-between">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeUpdate.id}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-3"
          >
            {/* Tag / Type badge */}
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide border ${getUpdateTagStyle(activeUpdate.type)}`}>
                {getUpdateIcon(activeUpdate.type)}
                {activeUpdate.type}
              </span>
            </div>

            {/* Thumbnail Image */}
            {activeUpdate.imageUrl && (
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 border border-white/10 shadow-inner">
                <img
                  src={activeUpdate.imageUrl}
                  alt={activeUpdate.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Title & Description */}
            <div className="space-y-1">
              <h4 className="font-extrabold text-sm text-pink-200 line-clamp-1 leading-snug">
                {activeUpdate.title}
              </h4>
              <p className="text-xs text-white/80 leading-relaxed line-clamp-3">
                {activeUpdate.description}
              </p>
            </div>

            {/* Date line */}
            <span className="text-[10px] text-white/50 block font-medium">
              {activeUpdate.date}
            </span>
          </motion.div>
        </AnimatePresence>

        {/* Explore More button */}
        <div className="pt-2">
          <Button
            onClick={() => router.push(activeUpdate.link)}
            className="w-full bg-white/10 hover:bg-white/20 text-white hover:text-white border border-white/15 rounded-xl text-xs py-4.5 cursor-pointer transition-all active:scale-98 shadow-sm flex items-center justify-center gap-1.5 font-bold"
          >
            Explore More
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Indicator dots */}
      <div className="flex justify-center gap-1 pt-1">
        {updates.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`h-1.5 rounded-full transition-all cursor-pointer ${idx === activeIndex ? 'w-4 bg-pink-500' : 'w-1.5 bg-white/20'}`}
          />
        ))}
      </div>

    </div>
  );
}
