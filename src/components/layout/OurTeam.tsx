"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

// Team members — name + qualification + image only
const TEAM = [
  {
    name: "Patrons & chief Prof. G. K. Rath",
    qualification: "M.D.",
    image: "/images/GK.png",
  },
  // {
  //   name: "Dr. Anurag Srivastava",
  //   qualification: "MBBS, MD",
  //   image: "/images/President Khusi.jpg",
  // },
  {
    name: "Vaidya Smt. Nandini Bhojraj",
    qualification: "BAMS, M.D. (Ayurveda)",
    image: "/images/16.png",
  },
  {
    name: "Saket Mani Trivedi",
    qualification: "MD, Fellow CSD & PMR",
    image: "/images/team3.jpg",
  },
  {
    name: "Mukta Sharma",
    qualification: "PG Diploma Biotechnology, PG Diploma in Bioinformatics",
    image: "/images/10.png",
  },
  {
    name: "Kritika Singh",
    qualification: "B.Pharma",
    image: "/images/head.jpg",
  },
  {
    name: "Shivani Yadav",
    qualification: "B.Tech",
    image: "/images/shivani.jpg",
  },
  {
    name: "Krishna Mishra",
    qualification: "B.Tech",
    image: "/images/krishna.jpeg",
  },
];

export default function OurTeam() {
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
      {/* Ambient decorations */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-pink-200/20 dark:bg-pink-900/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-200/20 dark:bg-blue-900/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUpVariants}
        >
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            Our{" "}
            <span className="text-pink-600 dark:text-pink-400">Team</span>
          </h2>
        </motion.div>

        {/* Team Grid — equal height cards, equal size photos */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 items-stretch"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {TEAM.map((member, index) => (
            <motion.article
              key={member.name}
              variants={fadeUpVariants}
              whileHover={{ y: -4 }}
              className="group flex h-full flex-col overflow-hidden rounded-xl border border-slate-200/70 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:border-pink-300/60 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-pink-800/60"
            >
              {/* Image — fixed square, object-cover for uniform visual size */}
              <div className="relative aspect-square w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 22vw"
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  priority={index < 4}
                />
              </div>

              {/* Content — flex-1 so all cards equal height */}
              <div className="flex flex-1 flex-col items-center justify-start px-3 py-3 text-center">
                <h3 className="font-heading line-clamp-2 text-sm font-bold leading-snug text-slate-900 dark:text-white">
                  {member.name}
                </h3>

                <p className="mt-1 line-clamp-2 text-xs font-medium leading-snug text-pink-600 dark:text-pink-400">
                  {member.qualification}
                </p>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}


