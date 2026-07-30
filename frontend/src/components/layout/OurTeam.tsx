"use client";

import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Stethoscope,
  Beaker,
  Activity,
  HeartHandshake,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from "lucide-react";

// Team categories definition
const CATEGORIES = [

{
  title: "President",
  name: "Puja Kapil Mishra",
  description:
    "Provides strategic leadership, defines the organization's vision, and leads initiatives that strengthen breast cancer awareness, patient support, and community partnerships.",
  image: "/images/President Khusi.png",
  icon: HeartHandshake,
},

{
  title: "CEO",
  name: "Saket Mani Trivedi",
  description:
    "Oversees daily operations, implements organizational strategies, manages programs, and ensures the successful execution of healthcare and awareness initiatives.",
  image: "/team3.jpg",
  icon: Activity,
},

{
  title: "Secretary General",
  name: "Mandvi Kumari",
  description:
    "Coordinates organizational activities, manages official communications, maintains records, and supports the effective implementation of campaigns and partnerships.",
  image: "/team2.jpg",
  icon: Beaker,
},

{
  title: "Executive Director",
  name: "Renu Kulshestha",
  description:
    "Leads program development, supervises healthcare initiatives, collaborates with medical experts, and ensures quality patient care and community outreach services.",
  image: "/team1.jpg",
  icon: Stethoscope,
},

{
  title: "Support & Admin",
  name: "Kritika Singh",
  description:
    "Manages administrative operations, coordinates volunteers, assists beneficiaries, and ensures smooth execution of organizational activities and support services.",
  image: "/images/Kritika mam.jpg",
  icon: ShieldCheck,
},
];

// Gallery items
const GALLERY_ITEMS = [
  { name: "Dr. Sarah Jenkins", dept: "Medical Oncology", img: "/team1.jpg" },
  { name: "Dr. Marcus Vance", dept: "Genetics Lab", img: "/team2.jpg" },
  { name: "Elena Rostova", dept: "Patient Support", img: "/team3.jpg" },
  { name: "David Chen", dept: "Community Outreach", img: "/team4.jpg" },
  { name: "Amina Al-Mansoor", dept: "Operations & HR", img: "/team5.jpg" },
  { name: "Dr. Rajan Patel", dept: "Diagnostic Imaging", img: "/team6.jpg" },
  { name: "Sophie Dubois", dept: "Public Advocacy", img: "/team7.jpg" },
  { name: "Thomas Mueller", dept: "Family Counselling", img: "/team8.jpg" },
  { name: "Dr. Chloe Tanaka", dept: "Molecular Research", img: "/team9.jpg" },
  { name: "Michael Vance", dept: "Campaign Logistics", img: "/team10.jpg" },
];

export default function OurTeam() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const dragStartX = useRef(0);
  const dragStartScrollLeft = useRef(0);
  const autoScrollTimer = useRef<number | null>(null);
  const isHovered = useRef(false);

  // Triple the gallery items to make the scrolling infinite and seamless
  const tripledGallery = [...GALLERY_ITEMS, ...GALLERY_ITEMS, ...GALLERY_ITEMS];

  // Set initial scroll to middle loop
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      // Set to middle section once images are loaded
      const singleSetWidth = scrollContainer.scrollWidth / 3;
      scrollContainer.scrollLeft = singleSetWidth;
    }
  }, []);

  // Handle continuous auto-scroll loop
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const startAutoScroll = () => {
      if (autoScrollTimer.current) return;
      
      const scrollSpeed = 0.8; // pixels per frame
      const animateScroll = () => {
        if (!scrollContainer) return;

        if (!isHovered.current && !isDragActive) {
          scrollContainer.scrollLeft += scrollSpeed;
          
          const singleSetWidth = scrollContainer.scrollWidth / 3;
          // Loop seamlessly
          if (scrollContainer.scrollLeft >= singleSetWidth * 2) {
            scrollContainer.scrollLeft -= singleSetWidth;
          } else if (scrollContainer.scrollLeft <= 0) {
            scrollContainer.scrollLeft += singleSetWidth;
          }
        }
        autoScrollTimer.current = requestAnimationFrame(animateScroll);
      };
      autoScrollTimer.current = requestAnimationFrame(animateScroll);
    };

    const stopAutoScroll = () => {
      if (autoScrollTimer.current) {
        cancelAnimationFrame(autoScrollTimer.current);
        autoScrollTimer.current = null;
      }
    };

    startAutoScroll();

    return () => {
      stopAutoScroll();
    };
  }, [isDragActive]);

  // Drag handlers for desktop mouse interaction
  const handleMouseDown = (e: React.MouseEvent) => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;
    setIsDragActive(true);
    dragStartX.current = e.pageX - scrollContainer.offsetLeft;
    dragStartScrollLeft.current = scrollContainer.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragActive) return;
    e.preventDefault();
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;
    const x = e.pageX - scrollContainer.offsetLeft;
    const walk = (x - dragStartX.current) * 1.5; // Scroll speed multiplier
    scrollContainer.scrollLeft = dragStartScrollLeft.current - walk;

    // Boundary check for infinite scroll during drag
    const singleSetWidth = scrollContainer.scrollWidth / 3;
    if (scrollContainer.scrollLeft >= singleSetWidth * 2) {
      scrollContainer.scrollLeft -= singleSetWidth;
      dragStartScrollLeft.current -= singleSetWidth;
      dragStartX.current = x; // Reset start position
    } else if (scrollContainer.scrollLeft <= 0) {
      scrollContainer.scrollLeft += singleSetWidth;
      dragStartScrollLeft.current += singleSetWidth;
      dragStartX.current = x; // Reset start position
    }
  };

  const handleMouseUpOrLeave = () => {
    setIsDragActive(false);
  };

  // Navigational Arrows scroll
  const handleScrollPrev = () => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;
    const itemWidth = 320; // approximate width of item + gap
    scrollContainer.scrollTo({
      left: scrollContainer.scrollLeft - itemWidth,
      behavior: "smooth"
    });
  };

  const handleScrollNext = () => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;
    const itemWidth = 320;
    scrollContainer.scrollTo({
      left: scrollContainer.scrollLeft + itemWidth,
      behavior: "smooth"
    });
  };

  // Motion animation presets
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" as const }
    }
  };

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-pink-50/20 to-slate-50 dark:from-slate-900 dark:via-pink-950/5 dark:to-slate-950 overflow-hidden border-t border-slate-100 dark:border-slate-800">
      
      {/* Premium ambient decorative shapes in background */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-pink-200/20 dark:bg-pink-900/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-200/20 dark:bg-blue-900/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto max-w-7xl relative z-10">
        
        {/* Section Header */}
        <motion.div 
          className="text-center space-y-4 mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUpVariants}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 text-xs font-semibold tracking-wider uppercase">
            <Sparkles className="h-3.5 w-3.5" />
            MEET OUR EXPERTS
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            Our Team Behind <span className="text-pink-600 dark:text-pink-400">Every Life</span> We Touch
          </h2>
          <p className="text-slate-650 dark:text-slate-300 max-w-3xl mx-auto text-sm sm:text-base leading-relaxed">
            A dedicated team of doctors, researchers, healthcare professionals, volunteers, and support staff working together to provide hope, care, awareness, and innovation in the fight against breast cancer.
          </p>
        </motion.div>

        {/* Section 1 - Team Categories (5 Static Cards) */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-24"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {CATEGORIES.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                variants={fadeUpVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative flex flex-col items-center text-center p-6 bg-white/70 dark:bg-slate-900/65 backdrop-blur-md border border-slate-205/50 dark:border-slate-800/40 rounded-2xl shadow-md hover:shadow-xl hover:border-pink-300/60 dark:hover:border-pink-850/60 transition-all duration-300"
              >
                {/* Background soft hover glow */}
                <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/0 via-pink-500/0 to-pink-500/5 dark:to-pink-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
                {/* Category Image */}
                <div className="relative w-24 h-24 mb-6 rounded-full overflow-hidden border-2 border-white dark:border-slate-800 shadow-md group-hover:border-pink-550 transition-colors duration-300">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    sizes="(max-width: 768px) 96px, 96px"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    priority={idx < 3}
                  />
                </div>

                {/* Small Category Icon */}
                <div className="w-10 h-10 rounded-xl bg-pink-50 dark:bg-pink-950/30 text-pink-650 dark:text-pink-400 flex items-center justify-center mb-4 border border-pink-100/50 dark:border-pink-900/20 group-hover:bg-pink-600 group-hover:text-white transition-all duration-300 shadow-sm">
                  <Icon className="h-5 w-5" />
                </div>

                {/* Title */}
                <h3 className="font-heading text-base font-bold text-slate-800 dark:text-slate-100 mb-2">
                  {card.title}
                </h3>
                {/* Member Name */}
<p className="text-pink-600 dark:text-pink-400 text-sm font-semibold mt-1">
  {card.name}
</p>

                {/* Description */}
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {card.description}
                </p>

                
              </motion.div>
            );
          })}
        </motion.div>

        {/* Section 2 - Team Gallery Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div className="space-y-2">
            <span className="inline-block px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-black uppercase tracking-widest">
              Gallery & Action
            </span>
            <h3 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Our Team in Action
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl">
              Meet the passionate individuals working tirelessly to create hope, awareness, and better healthcare for every patient.
            </p>
          </div>

          {/* Slider controls */}
          <div className="flex gap-2 self-start md:self-end">
            <button
              onClick={handleScrollPrev}
              className="p-2.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900 hover:bg-pink-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-pink-600 dark:hover:text-pink-400 transition-colors shadow-sm cursor-pointer"
              aria-label="Previous team members"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={handleScrollNext}
              className="p-2.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900 hover:bg-pink-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-pink-600 dark:hover:text-pink-400 transition-colors shadow-sm cursor-pointer"
              aria-label="Next team members"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Section 2 - Team Gallery Horizontal Auto-Scroll (Manual Drag + Native Swipe Supported) */}
        <div className="relative overflow-hidden -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          {/* Subtle left & right fades */}
          <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white dark:from-slate-900 to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-slate-50 dark:from-slate-950 to-transparent z-10 pointer-events-none" />

          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-none select-none cursor-grab active:cursor-grabbing pb-8 scroll-smooth"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={() => {
              handleMouseUpOrLeave();
              isHovered.current = false;
            }}
            onMouseEnter={() => {
              isHovered.current = true;
            }}
          >
            {tripledGallery.map((item, index) => (
              <div
                key={`${item.name}-${index}`}
                className="flex-shrink-0 w-72 h-[340px] relative rounded-2xl overflow-hidden group shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                {/* Lazy-loaded Image */}
                <Image
                  src={item.img}
                  alt={item.name}
                  fill
                  sizes="288px"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                  draggable={false}
                />
                
                {/* Premium Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/5 group-hover:via-black/50 transition-colors duration-300" />
                
                {/* Card Title & Department Info */}
                <div className="absolute bottom-0 inset-x-0 p-5 text-white flex flex-col justify-end">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-pink-400 mb-1">
                    {item.dept}
                  </span>
                  <h4 className="font-heading text-lg font-bold group-hover:text-pink-100 transition-colors">
                    {item.name}
                  </h4>
                  
                  {/* Subtle hover detail line */}
                  <div className="w-0 group-hover:w-16 h-0.5 bg-pink-500 mt-2 transition-all duration-300 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
