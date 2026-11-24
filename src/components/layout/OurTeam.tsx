
"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

// Team members — name + role + qualification + image
const TEAM = [
  {
    name: "Prof. G. K. Rath",
    qualification: "M.D., Former Head NCI, AIIMS Delhi",
     role: "Patron & Cheif",
    image: "/images/GK.png",
  },
  {
    name: "Vaidya Smt. Nandini Bhojraj",
    role: "Member",
    qualification: "M.D. (Ayurveda)",
    image: "/images/16.png",
  },
  {
    name: "Dr. Meena Mishra, M.D.",
    role: "Member",
    qualification: "Radiation Oncology",
    image: "/images/Dr. Meena.jpeg",
  },
  {
    name: "Saket Mani Trivedi",
    role: "Convener",
    qualification: "Ph.D., Scientist",
    image: "/images/team3.jpg",
  },
  {
    name: "Mukta Sharma",
    role: "",
    qualification: "PG Diploma Biotechnology",
    image: "/images/10.png",
  },
  {
    name: "Kritika Singh",
    role: "Administration",
    qualification: "B.Pharma",
    image: "/images/head.jpg",
  },
  {
    name: "Shivani Yadav",
    role: "Coordinator",
    qualification: "B.Tech",
    image: "/images/shivani.jpg",
  },
  {
    name: "Krishna Mishra",
    role: "Technical Team head",
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
    <section className="relative py-14 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-pink-50/20 to-slate-50 dark:from-slate-900 dark:via-pink-950/5 dark:to-slate-950 overflow-hidden border-t border-slate-100 dark:border-slate-800">

      {/* Ambient decorations */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-pink-200/20 dark:bg-pink-900/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-200/20 dark:bg-blue-900/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto max-w-6xl relative z-10">

        {/* Section Header */}
        <motion.div
          className="text-center mb-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUpVariants}
        >
          <h2 className="font-heading text-3xl sm:text-4xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
            Our{" "}
            <span className="text-pink-600 dark:text-pink-400">Team</span>
          </h2>
        </motion.div>

        {/* Team Grid */}
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
              {/* Image */}
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

              {/* Content */}
              <div className="flex flex-1 flex-col items-center justify-center px-3 py-4 text-center">

                {/* Name */}
                <h3 className="font-heading line-clamp-2 text-sm font-bold leading-snug text-slate-900 dark:text-white">
                  {member.name}
                </h3>

                {/* Role */}
                <p className="mt-2 text-xs font-bold uppercase tracking-wide text-pink-600 dark:text-pink-400">
                  {member.role}
                </p>

                {/* Qualification */}
                <p className="mt-1 line-clamp-2 text-xs font-medium leading-snug text-slate-500 dark:text-slate-400">
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
