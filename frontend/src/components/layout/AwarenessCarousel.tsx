"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, Pause, ShieldCheck, Heart, Users, Calendar } from "lucide-react";

interface Slide {
  src: string;
  title: string;
  subtitle: string;
  description: string;
  tag: string;
  icon: React.ReactNode;
}

export default function AwarenessCarousel() {
  const slides: Slide[] = [
    {
      src: "/images/awareness_ribbon.png",
      tag: "Hope & Unity",
      title: "The Pink Ribbon Symbol",
      subtitle: "A Beacon of Awareness & Solidarity",
      description: "The universal symbol of hope, courage, and collective support for breast cancer patients, survivors, and their families around the globe.",
      icon: <Heart className="h-4 w-4 text-primary" />
    },
    {
      src: "/images/community_walk.png",
      tag: "Advocacy",
      title: "Community Walk for a Cure",
      subtitle: "Uniting Voices, Spreading Knowledge",
      description: "Every step counts. Raising awareness, removing societal taboos, and organizing physical walkathons to promote early breast screening guidelines.",
      icon: <Users className="h-4 w-4 text-primary" />
    },
    {
      src: "/images/awareness3.png",
      tag: "Early Detection",
      title: "Compassionate Consultations",
      subtitle: "Personalized Support & Expert Guidance",
      description: "Oncologists recommend monthly self-exams and annual clinical check-ups. Our platform connects users to experts for immediate guidance.",
      icon: <ShieldCheck className="h-4 w-4 text-primary" />
    },
    {
      src: "/images/support_group.png",
      tag: "Mental Wellness",
      title: "Empathetic Support Groups",
      subtitle: "No One Walks this Journey Alone",
      description: "Fostering safe spaces where patients, survivors, and advocates share experiences, emotional support, and recovery milestones.",
      icon: <Users className="h-4 w-4 text-primary" />
    },
    {
      src: "/images/mammography_screening.png",
      tag: "Diagnostics",
      title: "Modern Screening Equipment",
      subtitle: "Comfortable, Non-Intimidating Care",
      description: "High-tech mammograms detect anomalies years before symptoms appear. Modern clinics ensure comfortable, supportive diagnostic workflows.",
      icon: <ShieldCheck className="h-4 w-4 text-primary" />
    },
    {
      src: "/images/cancer_research.png",
      tag: "Scientific Innovation",
      title: "Advanced Cancer Research",
      subtitle: "Pioneering the Next Generation of Cures",
      description: "Dedicated oncologists and research scientists analyze genetic patterns to develop highly precise, targeted treatments for individuals.",
      icon: <Heart className="h-4 w-4 text-primary" />
    },
    {
      src: "/images/survivor_strength.png",
      tag: "Hope & Recovery",
      title: "Survivor Stories of Strength",
      subtitle: "Overcoming Adversity with Courage",
      description: "Real-life testaments of resilience and recovery, proving that early diagnosis, timely treatment, and robust support systems can beat cancer.",
      icon: <Heart className="h-4 w-4 text-primary" />
    },
    {
      src: "/images/awareness4.png",
      tag: "Education",
      title: "Medical Webinars & Seminars",
      subtitle: "Spreading Life-Saving Knowledge",
      description: "Listen directly to registered oncologists and doctors outline diagnosis methods, lifestyle shifts, and preventative strategies.",
      icon: <Calendar className="h-4 w-4 text-primary" />
    },
    {
      src: "/images/awareness2.png",
      tag: "FundLife Campaign",
      title: "Verified Crowdfunding Channels",
      subtitle: "Direct Support for Cancer Patient Care",
      description: "Ensuring 100% financial transparency. Donations flow directly to partner hospitals to support active chemotherapy and surgery bills.",
      icon: <Heart className="h-4 w-4 text-primary" />
    },
    {
      src: "/images/preventive_wellness.png",
      tag: "Healthy Living",
      title: "Preventive Care & Wellness",
      subtitle: "Nurturing Your Body and Mind",
      description: "Maintaining healthy diets, physical exercise, and mental peace helps lower breast cancer risk and boosts recovery index.",
      icon: <Heart className="h-4 w-4 text-primary" />
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const SLIDE_DURATION = 5000; // 5 seconds
  const PROGRESS_STEP = 50; // Update progress every 50ms

  // Handle slide changing
  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    setProgress(0);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
    setProgress(0);
  }, [slides.length]);

  const selectSlide = useCallback((index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
    setProgress(0);
  }, [currentIndex]);

  // Timer logic for progress bar and slide switching
  useEffect(() => {
    if (isPlaying) {
      // Setup interval to increment progress bar
      progressIntervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            nextSlide();
            return 0;
          }
          return prev + (PROGRESS_STEP / SLIDE_DURATION) * 100;
        });
      }, PROGRESS_STEP);
    } else {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    }

    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [isPlaying, nextSlide]);

  // Pause on hover handlers
  const handleMouseEnter = () => setIsPlaying(false);
  const handleMouseLeave = () => setIsPlaying(true);

  // Animation variants
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 1.05
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring" as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.4 },
        scale: { duration: 0.5 }
      }
    },
    exit: (dir: number) => ({
      x: dir < 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 0.95,
      transition: {
        x: { type: "spring" as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.3 }
      }
    })
  };

  return (
    <section className="py-12 bg-gradient-to-b from-background to-muted/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        
        {/* Section Header */}
        <div className="text-center space-y-3 mb-10">
          <span className="text-xs font-bold text-primary tracking-widest uppercase bg-primary/10 px-3 py-1 rounded-full inline-flex items-center gap-1.5">
            <Heart className="h-3 w-3 fill-primary text-primary" /> Visual Inspiration
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Empowerment through Awareness & Action
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            Explore the core pillars of our campaign. From clinical diagnosis and cancer research to survivors&apos; recovery journeys and crowdfunding support.
          </p>
        </div>

        {/* Main Carousel Viewport */}
        <div 
          className="relative group rounded-3xl overflow-hidden border border-border shadow-xl bg-card aspect-[16/9] md:aspect-[21/9] min-h-[350px] flex items-stretch"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Slides display */}
          <div className="relative flex-1 w-full h-full overflow-hidden">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0 w-full h-full"
              >
                {/* Background Image */}
                <Image
                  src={slides[currentIndex].src}
                  alt={slides[currentIndex].title}
                  fill
                  priority
                  sizes="(max-width: 1200px) 100vw, 1200px"
                  className="object-cover object-center select-none"
                />

                {/* Dark Vignette/Overlay for Text Legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent md:bg-gradient-to-r md:from-black/90 md:via-black/50 md:to-transparent" />
                
                {/* Slide Text Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 md:top-0 md:bottom-auto md:h-full md:w-3/5 md:flex md:flex-col md:justify-center md:items-start text-white space-y-2 sm:space-y-4">
                  <motion.span 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/25 border border-primary/45 backdrop-blur-md text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-pink-200"
                  >
                    {slides[currentIndex].icon}
                    {slides[currentIndex].tag}
                  </motion.span>
                  
                  <div className="space-y-1 sm:space-y-2">
                    <motion.h3 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight"
                    >
                      {slides[currentIndex].title}
                    </motion.h3>
                    <motion.p 
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-pink-100 font-medium text-xs sm:text-sm md:text-base"
                    >
                      {slides[currentIndex].subtitle}
                    </motion.p>
                  </div>

                  <motion.p 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-white/80 text-[11px] sm:text-xs md:text-sm leading-relaxed max-w-md hidden sm:block font-light"
                  >
                    {slides[currentIndex].description}
                  </motion.p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Autoplay play/pause toggle indicator */}
          <div className="absolute top-4 right-4 z-20 flex gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-white/95 border border-white/10 hover:border-white/20 transition-all hover:scale-105 duration-200 cursor-pointer shadow-md"
              title={isPlaying ? "Pause Slideshow" : "Play Slideshow"}
            >
              {isPlaying ? <Pause className="h-4.5 w-4.5" /> : <Play className="h-4.5 w-4.5 fill-white" />}
            </button>
          </div>

          {/* Navigation Arrows (Large Screen Layout Only) */}
          <div className="absolute inset-y-0 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
            <button
              onClick={prevSlide}
              className="p-3 rounded-full bg-black/30 hover:bg-black/60 backdrop-blur-md text-white hover:text-pink-100 border border-white/5 hover:border-white/20 transition-all hover:-translate-x-1 duration-200 pointer-events-auto cursor-pointer shadow-lg hover:scale-105 opacity-0 group-hover:opacity-100"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={nextSlide}
              className="p-3 rounded-full bg-black/30 hover:bg-black/60 backdrop-blur-md text-white hover:text-pink-100 border border-white/5 hover:border-white/20 transition-all hover:translate-x-1 duration-200 pointer-events-auto cursor-pointer shadow-lg hover:scale-105 opacity-0 group-hover:opacity-100"
              aria-label="Next Slide"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>

          {/* Bottom Progress Bar & Dot indicators */}
          <div className="absolute bottom-0 left-0 right-0 z-20 flex flex-col pointer-events-none">
            {/* Dots + Slide count for Mobile/General */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-t from-black/80 to-transparent sm:hidden pointer-events-auto">
              <span className="text-white/80 text-xs font-semibold">
                {String(currentIndex + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
              </span>
              <div className="flex gap-1.5">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => selectSlide(index)}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      index === currentIndex ? "w-6 bg-primary" : "w-2 bg-white/40"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Slider Progress Bar */}
            <div className="w-full h-1 bg-white/10">
              <motion.div 
                className="h-full bg-gradient-to-r from-primary to-pink-400"
                style={{ width: `${progress}%` }}
                layoutId="progressBar"
                transition={{ duration: 0.05, ease: "linear" }}
              />
            </div>
          </div>
        </div>

        {/* Thumbnail Gallery (Bottom) */}
        <div className="mt-6 flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Slide Gallery ({currentIndex + 1} of {slides.length})
            </span>
            <div className="hidden sm:flex gap-1">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => selectSlide(index)}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    index === currentIndex ? "w-6 bg-primary" : "w-1.5 bg-border hover:bg-muted-foreground/45"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-5 md:grid-cols-10 gap-2 sm:gap-3">
            {slides.map((slide, index) => (
              <button
                key={index}
                onClick={() => selectSlide(index)}
                className={`relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer transition-all duration-300 border-2 hover:scale-[1.03] shadow-sm ${
                  index === currentIndex 
                    ? "border-primary ring-2 ring-primary/20 scale-[1.03] opacity-100 shadow-md" 
                    : "border-transparent opacity-55 hover:opacity-90"
                }`}
                title={slide.title}
              >
                <Image
                  src={slide.src}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  sizes="120px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/10 hover:bg-transparent transition-all" />
              </button>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}