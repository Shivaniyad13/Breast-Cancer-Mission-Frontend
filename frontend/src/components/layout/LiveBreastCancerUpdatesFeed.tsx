"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Radio, Newspaper, ArrowRight, ChevronUp, ChevronDown } from "lucide-react";
import { getLiveBreastCancerFeed, FeedItem } from "@/app/actions/breastCancerNews";

export default function LiveBreastCancerUpdatesFeed() {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Load feed items dynamically
  useEffect(() => {
    let isMounted = true;
    async function loadFeed() {
      const res = await getLiveBreastCancerFeed();
      if (res.success && res.items.length > 0 && isMounted) {
        setItems(res.items);
      }
    }
    loadFeed();
    return () => {
      isMounted = false;
    };
  }, []);

  // Continuous auto-scroll timer every 4.5 seconds
  useEffect(() => {
    if (items.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [items.length, isPaused]);

  if (items.length === 0) {
    return (
      <div className="py-6 text-center text-sm font-semibold text-pink-300 animate-pulse">
        Loading Live Breast Cancer Feed...
      </div>
    );
  }

  const currentItem = items[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  // Extract headlines for breaking ticker
  const tickerHeadlines = items.map((it) => it.title).join("  •  ");

  return (
    <div 
      className="w-full flex flex-col gap-3 py-1.5 text-white font-sans transition-all"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* 1. Header with Blinking LIVE indicator */}
      <div className="flex items-center justify-between border-b border-pink-500/25 pb-2.5">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-80"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 shadow-sm shadow-red-500/50"></span>
          </span>
          <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-pink-300 flex items-center gap-2">
            <Radio className="h-4 w-4 text-pink-400 animate-pulse" />
            LIVE BREAST CANCER UPDATES
          </h3>
        </div>

        {/* Up / Down manual feed controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handlePrev}
            aria-label="Previous item"
            className="h-6 w-6 rounded-md bg-slate-800/90 hover:bg-pink-600/90 text-pink-200 flex items-center justify-center transition-all active:scale-90 cursor-pointer shadow-sm"
          >
            <ChevronUp className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={handleNext}
            aria-label="Next item"
            className="h-6 w-6 rounded-md bg-slate-800/90 hover:bg-pink-600/90 text-pink-200 flex items-center justify-center transition-all active:scale-90 cursor-pointer shadow-sm"
          >
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Thin Animated "Breaking Updates" Ticker */}
      <div className="relative overflow-hidden bg-pink-950/50 border border-pink-500/25 rounded-xl py-1.5 px-3 text-xs text-pink-100 flex items-center gap-2.5 backdrop-blur-md shadow-inner">
        <span className="bg-pink-600 text-white font-extrabold text-[9px] uppercase px-2 py-0.5 rounded-md shrink-0 tracking-widest shadow-sm">
          BREAKING
        </span>
        <div className="overflow-hidden whitespace-nowrap w-full">
          <motion.div
            className="inline-block whitespace-nowrap font-semibold text-slate-100 text-[11px]"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: 25,
            }}
          >
            <span className="pr-10">{tickerHeadlines}</span>
            <span className="pr-10">{tickerHeadlines}</span>
          </motion.div>
        </div>
      </div>

      {/* 3. Larger Vertically Animated Feed Item */}
      <div className="relative min-h-[135px] flex items-center overflow-hidden pt-1">
        <AnimatePresence mode="wait">
          <motion.a
            key={currentItem.id + "-" + currentIndex}
            href={currentItem.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -22 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="group w-full flex items-center gap-3.5 p-3 rounded-2xl bg-gradient-to-r from-slate-900/85 via-slate-900/60 to-pink-950/40 hover:from-slate-900 hover:to-pink-900/50 border border-pink-500/20 hover:border-pink-500/50 transition-all duration-300 cursor-pointer shadow-xl backdrop-blur-xl"
          >
            {/* Larger Thumbnail with overlay icon */}
            <div className="relative h-20 w-28 sm:h-22 sm:w-32 rounded-xl overflow-hidden bg-slate-950 border border-slate-700/80 shrink-0 shadow-md">
              <img
                src={currentItem.thumbnailUrl}
                alt={currentItem.title}
                className="h-full w-full object-cover group-hover:scale-108 transition-transform duration-500"
              />
              {currentItem.type === "video" ? (
                <div className="absolute inset-0 bg-black/45 flex items-center justify-center">
                  <div className="h-8 w-8 rounded-full bg-pink-600/90 group-hover:bg-pink-500 text-white flex items-center justify-center shadow-lg shadow-pink-600/40 transition-transform group-hover:scale-110">
                    <Play className="h-4 w-4 fill-white ml-0.5" />
                  </div>
                </div>
              ) : (
                <div className="absolute top-1.5 left-1.5 bg-black/70 backdrop-blur text-[9px] text-pink-300 font-bold px-1.5 py-0.5 rounded-md flex items-center gap-1">
                  <Newspaper className="h-2.5 w-2.5" />
                  News
                </div>
              )}
            </div>

            {/* Title & Metadata */}
            <div className="flex-1 min-w-0 space-y-1.5">
              {/* Category & Source Row */}
              <div className="flex items-center justify-between text-[10px] sm:text-xs text-pink-400 font-bold">
                <span className="truncate max-w-[140px] sm:max-w-[160px]">{currentItem.source}</span>
                <span className="text-slate-400 font-medium text-[10px]">{currentItem.publishedTime}</span>
              </div>

              {/* Title (1-2 lines, larger readable font) */}
              <h4 className="font-extrabold text-xs sm:text-sm text-slate-100 group-hover:text-pink-300 transition-colors line-clamp-2 leading-snug">
                {currentItem.title}
              </h4>

              {/* Action link */}
              <div className="pt-0.5 flex items-center gap-1.5 text-xs font-black text-pink-400 group-hover:text-pink-300 transition-colors">
                <span>{currentItem.type === "video" ? "Watch Video" : "Read Article"}</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </motion.a>
        </AnimatePresence>
      </div>

      {/* Feed Indicators (Bottom Dots) */}
      <div className="flex items-center justify-between px-1 pt-1">
        <div className="flex items-center gap-1.5">
          {items.slice(0, 8).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                idx === currentIndex % 8 ? "w-5 bg-pink-500" : "w-1.5 bg-slate-700 hover:bg-slate-500"
              }`}
            />
          ))}
        </div>
        <span className="text-[10px] text-slate-400 font-semibold">
          {currentIndex + 1} / {items.length}
        </span>
      </div>
    </div>
  );
}
