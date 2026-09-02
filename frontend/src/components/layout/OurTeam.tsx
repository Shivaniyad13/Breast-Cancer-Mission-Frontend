"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Stethoscope,
  Beaker,
  Activity,
  HeartHandshake,
  ShieldCheck,
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
    name: "Dr. Renu Kulshrestha (Ph.D)",
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
  image: "/head.jpg",
  icon: ShieldCheck,
},
];

export default function OurTeam() {
  // Motion animation presets
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" as const },
    },
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

        {/* Team Categories Grid (5 Static Cards) */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {CATEGORIES.map((card) => {
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
                    priority={true}
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

      </div>
    </section>
  );
}