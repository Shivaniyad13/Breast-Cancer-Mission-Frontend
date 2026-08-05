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
    } else {
      setIsPlaying(false);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      }
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
        <div className="relative overflow-hidden bg-slate-900/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-700/60 dark:border-slate-800 rounded-3xl p-4 shadow-xl flex flex-col justify-between min-h-[220px] group text-white">
          {/* Top colored accent line */}
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-pink-500 to-rose-400" />
          
          <div className="space-y-3">
            {/* Logo and title */}
            <div className="flex justify-between items-center pb-1.5 border-b border-slate-800">
              <div className="flex items-center gap-1.5 min-w-0">
                {activeBanner.logoUrl && (
                  <div className="h-6 w-6 rounded-full overflow-hidden bg-white border border-slate-700 flex-shrink-0 flex items-center justify-center">
                    <img src={activeBanner.logoUrl} alt="sponsor logo" className="h-full w-full object-cover" />
                  </div>
                )}
                <span className="text-[10px] font-black uppercase tracking-widest text-pink-400 truncate">
                  Sponsor Spotlight
                </span>
              </div>

              {/* Prev / Next arrows */}
              {banners.length > 1 && (
                <div className="flex gap-1.5">
                  <button
                    onClick={prevBanner}
                    className="h-5 w-5 rounded-full bg-slate-800 border border-slate-700 text-white flex items-center justify-center hover:bg-slate-700 active:scale-90 transition-all cursor-pointer"
                  >
                    <ChevronLeft className="h-3 w-3" />
                  </button>
                  <button
                    onClick={nextBanner}
                    className="h-5 w-5 rounded-full bg-slate-800 border border-slate-700 text-white flex items-center justify-center hover:bg-slate-700 active:scale-90 transition-all cursor-pointer"
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
                <div className="h-16 w-24 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex-shrink-0">
                  <img src={activeBanner.imageUrl} alt={activeBanner.title} className="h-full w-full object-cover" />
                </div>
              )}

              {/* Title & Info */}
              <div className="flex-1 min-w-0 space-y-1">
                <h4 className="font-extrabold text-xs text-white line-clamp-1">
                  {activeBanner.title}
                </h4>
                <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-2">
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
                    idx === activeBannerIdx ? 'w-3 bg-pink-500' : 'w-1 bg-slate-700'
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
              className="bg-pink-600 hover:bg-pink-700 text-white font-extrabold rounded-xl text-[10px] h-7 px-3 border-none shadow-md shadow-pink-600/30 cursor-pointer transition-all active:scale-95 flex items-center gap-1"
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
        <div className="relative overflow-hidden bg-slate-900/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-700/60 dark:border-slate-800 rounded-3xl p-4 shadow-xl flex flex-col justify-between min-h-[260px] group text-white">
          {/* Top colored accent line */}
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-400" />

          <div className="space-y-3">
            
            {/* Header info */}
            <div className="flex justify-between items-center pb-1.5 border-b border-slate-800">
              <span className="text-[10px] font-black uppercase tracking-widest text-pink-400 flex items-center gap-1">
                <Star className="h-3 w-3 fill-pink-400 text-pink-400" /> Celebrity Testimonial
              </span>
              {activeTestimonial.duration && (
                <span className="text-[9px] text-slate-400 font-bold">{activeTestimonial.duration}</span>
              )}
            </div>

            {/* Video player box (Centered & Non-Cropping) */}
            <div 
              onClick={togglePlay}
              className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-950/90 border border-slate-800/80 shadow-inner group/player flex items-center justify-center cursor-pointer p-0.5"
            >
              <video
                ref={videoRef}
                src={activeTestimonial.videoUrl}
                onEnded={handleVideoEnded}
                autoPlay
                muted={isMuted}
                playsInline
                className="w-full h-full object-contain mx-auto rounded-xl"
              />

              {/* Centered Play/Pause Button Overlay */}
              <div
                className={`absolute inset-0 m-auto h-10 w-10 rounded-full bg-pink-600/90 hover:bg-pink-500 text-white flex items-center justify-center backdrop-blur-md shadow-lg shadow-pink-600/40 cursor-pointer z-10 transition-all active:scale-90 ${
                  !isPlaying ? 'opacity-100 scale-100' : 'opacity-0 group-hover/player:opacity-100 scale-95 hover:scale-100'
                }`}
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4 fill-white" />
                ) : (
                  <Play className="h-4 w-4 fill-white ml-0.5" />
                )}
              </div>

              {/* Volume indicator overlay */}
              <button
                onClick={toggleMute}
                aria-label={isMuted ? "Unmute video" : "Mute video"}
                className="absolute bottom-2 right-2 h-7 w-7 rounded-full bg-black/70 backdrop-blur text-white flex items-center justify-center hover:bg-black/90 active:scale-95 transition-all cursor-pointer z-10 opacity-0 group-hover/player:opacity-100 transition-opacity duration-200"
              >
                {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
              </button>
            </div>

            {/* Metadata information details */}
            <div className="space-y-1">
              <div className="flex items-baseline gap-1.5">
                <h4 className="font-extrabold text-xs text-white">{activeTestimonial.name}</h4>
                <span className="text-[9px] text-pink-300 font-semibold truncate">{activeTestimonial.profession}</span>
              </div>
              <p className="text-[10px] italic leading-relaxed text-slate-300 line-clamp-2 pl-3 border-l border-slate-800 relative">
                <Quote className="h-2 w-2 text-pink-400 absolute left-0 top-0.5 opacity-70 rotate-180" />
                "{activeTestimonial.quote}"
              </p>
            </div>

          </div>

          {/* Testimonial playlist selector thumbnails */}
          {testimonials.length > 1 && (
            <div className="pt-2 border-t border-slate-800 space-y-1.5">
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">More Testimonials</span>
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {testimonials.map((t, idx) => {
                  const isActive = idx === activeTestimonialIdx;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setActiveTestimonialIdx(idx)}
                      className={`relative flex-shrink-0 h-8 w-12 rounded overflow-hidden border transition-all cursor-pointer ${
                        isActive ? 'border-pink-500 scale-105 shadow-md shadow-pink-500/30' : 'border-slate-700 opacity-60 hover:opacity-100'
                      }`}
                    >
                      {t.thumbnailUrl ? (
                        <img src={t.thumbnailUrl} alt="thumbnail" className="h-full w-full object-contain bg-slate-950 p-0.5" />
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
