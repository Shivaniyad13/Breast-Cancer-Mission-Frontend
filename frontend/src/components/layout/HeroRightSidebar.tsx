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
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Interfaces
interface SponsorBanner {
  id: string;
  logoUrl: string | null;
  imageUrl: string | null;
  title: string;
  description: string;
  destinationLink: string | null;
}

interface CelebrityTestimonial {
  id: string;
  videoUrl: string;
  thumbnailUrl: string | null;
  name: string;
  profession: string;
  duration: string | null;
  quote: string;
  description: string | null;
}

interface HeroRightSidebarProps {
  banners: SponsorBanner[];
  testimonials: CelebrityTestimonial[];
}

export default function HeroRightSidebar({ banners, testimonials }: HeroRightSidebarProps) {
  const router = useRouter();
  
  // States for Banners
  const [activeBannerIdx, setActiveBannerIdx] = useState(0);
  
  // States for Testimonials
  const [activeTestimonialIdx, setActiveTestimonialIdx] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const activeBanner = banners[activeBannerIdx];
  const activeTestimonial = testimonials[activeTestimonialIdx];

  // 1. Banner Auto-Rotation (6 seconds)
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setActiveBannerIdx((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [banners.length]);

  // 2. Testimonial Video Logic: Autoplay, Load on swap, Transition to next on end
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
  }, [activeTestimonialIdx]);

  const handleVideoEnded = () => {
    if (testimonials.length > 1) {
      setActiveTestimonialIdx((prev) => (prev + 1) % testimonials.length);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Navigations for Banners
  const prevBanner = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveBannerIdx((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const nextBanner = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveBannerIdx((prev) => (prev + 1) % banners.length);
  };

  return (
    <div className="flex flex-col gap-6 w-full h-full justify-center">
      
      {/* ====================================================
          1. TOP WIDGET: Sponsor Spotlight
          ==================================================== */}
      {activeBanner && (
        <div className="relative overflow-hidden bg-white/10 dark:bg-slate-900/30 backdrop-blur-lg border border-white/20 dark:border-slate-800/40 rounded-3xl p-4 shadow-xl flex flex-col justify-between min-h-[220px] group">
          {/* Top colored accent line */}
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-pink-500 to-rose-400" />
          
          <div className="space-y-3">
            {/* Logo and title */}
            <div className="flex justify-between items-center pb-1.5 border-b border-white/10">
              <div className="flex items-center gap-1.5 min-w-0">
                {activeBanner.logoUrl && (
                  <div className="h-6 w-6 rounded-full overflow-hidden bg-white/80 border border-white/10 flex-shrink-0 flex items-center justify-center">
                    <img src={activeBanner.logoUrl} alt="sponsor logo" className="h-full w-full object-cover" />
                  </div>
                )}
                <span className="text-[10px] font-black uppercase tracking-widest text-pink-300 truncate">
                  Sponsor Spotlight
                </span>
              </div>

              {/* Prev / Next arrows */}
              {banners.length > 1 && (
                <div className="flex gap-1.5">
                  <button
                    onClick={prevBanner}
                    className="h-5 w-5 rounded-full bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-white/15 active:scale-90 transition-all cursor-pointer"
                  >
                    <ChevronLeft className="h-3 w-3" />
                  </button>
                  <button
                    onClick={nextBanner}
                    className="h-5 w-5 rounded-full bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-white/15 active:scale-90 transition-all cursor-pointer"
                  >
                    <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>

            {/* Slider view container */}
            <div className="flex gap-3">
              {/* Optional Banner Image */}
              {activeBanner.imageUrl && (
                <div className="h-16 w-24 rounded-xl overflow-hidden bg-slate-900 border border-white/5 flex-shrink-0">
                  <img src={activeBanner.imageUrl} alt={activeBanner.title} className="h-full w-full object-cover" />
                </div>
              )}

              {/* Title & Info */}
              <div className="flex-1 min-w-0 space-y-1">
                <h4 className="font-extrabold text-xs text-white line-clamp-1">
                  {activeBanner.title}
                </h4>
                <p className="text-[11px] text-white/80 leading-relaxed line-clamp-2">
                  {activeBanner.description}
                </p>
              </div>
            </div>
          </div>

          {/* Learn More link button & pagination dots */}
          <div className="flex justify-between items-center pt-2">
            
            {/* Banners pagination indicators */}
            <div className="flex gap-1">
              {banners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveBannerIdx(idx)}
                  className={`h-1 rounded-full transition-all cursor-pointer ${
                    idx === activeBannerIdx ? 'w-3 bg-pink-500' : 'w-1 bg-white/20'
                  }`}
                />
              ))}
            </div>

            <Button
              onClick={() => {
                if (activeBanner.destinationLink) {
                  if (activeBanner.destinationLink.startsWith("http")) {
                    window.open(activeBanner.destinationLink, "_blank");
                  } else {
                    router.push(activeBanner.destinationLink);
                  }
                }
              }}
              className="bg-white/15 hover:bg-white/25 text-white border border-white/10 rounded-xl text-[10px] h-7 px-3 cursor-pointer transition-all active:scale-95 flex items-center gap-1 font-extrabold"
            >
              Learn More
              <ArrowRight className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}

      {/* ====================================================
          2. BOTTOM WIDGET: Celebrity Testimonials
          ==================================================== */}
      {activeTestimonial && (
        <div className="relative overflow-hidden bg-white/10 dark:bg-slate-900/30 backdrop-blur-lg border border-white/20 dark:border-slate-800/40 rounded-3xl p-4 shadow-xl flex flex-col justify-between min-h-[260px] group">
          {/* Top colored accent line */}
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-400" />

          <div className="space-y-3">
            
            {/* Header info */}
            <div className="flex justify-between items-center pb-1.5 border-b border-white/10">
              <span className="text-[10px] font-black uppercase tracking-widest text-pink-300 flex items-center gap-1">
                <Star className="h-3 w-3 fill-pink-300" /> Celebrity Testimonial
              </span>
              {activeTestimonial.duration && (
                <span className="text-[9px] text-white/50 font-bold">{activeTestimonial.duration}</span>
              )}
            </div>

            {/* Video player box */}
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-950/80 border border-white/10 shadow-inner group/player">
              <video
                ref={videoRef}
                src={activeTestimonial.videoUrl}
                onEnded={handleVideoEnded}
                autoPlay
                muted={isMuted}
                playsInline
                className="w-full h-full object-cover"
              />

              {/* Volume indicator overlay */}
              <button
                onClick={toggleMute}
                className="absolute bottom-2 right-2 h-7 w-7 rounded-full bg-black/45 backdrop-blur text-white flex items-center justify-center hover:bg-black/60 active:scale-95 transition-all cursor-pointer z-10 opacity-0 group-hover/player:opacity-100 transition-opacity duration-200"
              >
                {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
              </button>
            </div>

            {/* Metadata information details */}
            <div className="space-y-1 text-white/95">
              <div className="flex items-baseline gap-1.5">
                <h4 className="font-extrabold text-xs text-pink-200">{activeTestimonial.name}</h4>
                <span className="text-[9px] text-white/70 truncate">{activeTestimonial.profession}</span>
              </div>
              <p className="text-[10px] italic leading-relaxed text-white/80 line-clamp-2 pl-3 border-l border-white/10 relative">
                <Quote className="h-2 w-2 text-pink-400 absolute left-0 top-0.5 opacity-55 rotate-180" />
                "{activeTestimonial.quote}"
              </p>
            </div>

          </div>

          {/* Testimonial playlist selector thumbnails */}
          {testimonials.length > 1 && (
            <div className="pt-2 border-t border-white/5 space-y-1.5">
              <span className="text-[8px] font-black text-white/40 uppercase tracking-widest block">More Testimonials</span>
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {testimonials.map((t, idx) => {
                  const isActive = idx === activeTestimonialIdx;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setActiveTestimonialIdx(idx)}
                      className={`relative flex-shrink-0 h-8 w-12 rounded overflow-hidden border transition-all cursor-pointer ${
                        isActive ? 'border-pink-500 scale-105' : 'border-white/10 opacity-55 hover:opacity-85'
                      }`}
                    >
                      {t.thumbnailUrl ? (
                        <img src={t.thumbnailUrl} alt="thumbnail" className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full bg-slate-800 flex items-center justify-center text-white text-[8px]">
                          <Video className="h-3 w-3" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
