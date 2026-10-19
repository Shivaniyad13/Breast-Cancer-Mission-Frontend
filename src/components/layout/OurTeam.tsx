"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

// Team members — name + qualification + image only
const TEAM = [

  {
    name: " Patrons & chief  Prof. G. K. Rath ",
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
    qualification: "PG Diploma Biotechnology , PG Diploma in Bioinformatics",
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
    qualification: "B.tech",
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

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
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

        {/* Team Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {TEAM.map((member, index) => (
            <motion.article
              key={member.name}
              variants={fadeUpVariants}
              whileHover={{ y: -6 }}
              className="group overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:border-pink-300/60 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-pink-800/60"
            >
              {/* Professional Image */}
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  priority={index < 2}
                />

                {/* Subtle hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/25 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>

              {/* Minimal Content */}
              <div className="px-4 py-5 text-center">
                <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white">
                  {member.name}
                </h3>

                <p className="mt-1 text-sm font-medium text-pink-600 dark:text-pink-400">
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