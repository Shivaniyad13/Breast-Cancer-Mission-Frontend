"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, Clock, MapPin, Users, Award, ShieldCheck, 
  Video, Globe, BookOpen, Languages, Landmark 
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import WebinarRegisterButton from "./WebinarRegisterButton";

interface Webinar {
  id: string;
  title: string;
  description: string;
  bannerImage: string | null;
  speakerName: string;
  speakerImage: string | null;
  speakerBio: string | null;
  speakerQualification: string | null;
  speakerSpecialization: string | null;
  speakerHospital: string | null;
  date: Date;
  startTime: Date;
  endTime: Date;
  venue: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  webinarMode: string;
  meetingLink: string;
  maxSeats: number;
  category: string;
  status: string;
  language: string | null;
  meetingPlatform: string | null;
  registrations: any[];
}

interface WebinarsGridProps {
  webinars: Webinar[];
  currentUser: any;
}

export default function WebinarsGrid({ webinars, currentUser }: WebinarsGridProps) {
  const [activeTab, setActiveTab] = useState<"live" | "upcoming" | "completed">("upcoming");
  const now = new Date();

  // Segregate webinars dynamically
  const liveWebinars = webinars.filter(w => {
    const start = new Date(w.startTime);
    const end = new Date(w.endTime);
    return now >= start && now <= end && w.status === "PUBLISHED";
  });

  const upcomingWebinars = webinars.filter(w => {
    const start = new Date(w.startTime);
    return now < start && w.status === "PUBLISHED";
  });

  const completedWebinars = webinars.filter(w => {
    const end = new Date(w.endTime);
    return now > end || w.status === "COMPLETED";
  });

  const getFilteredList = () => {
    if (activeTab === "live") return liveWebinars;
    if (activeTab === "completed") return completedWebinars;
    return upcomingWebinars;
  };

  const currentList = getFilteredList();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100 } }
  };

  return (
    <div className="space-y-8">
      {/* Visual Header Tabs */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 border-b border-pink-100 pb-4">
        <div className="flex gap-2 p-1 bg-pink-50/50 border border-pink-100/50 rounded-2xl shadow-sm">
          <button
            onClick={() => setActiveTab("live")}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "live"
                ? "bg-primary text-white shadow-md scale-105"
                : "text-slate-655 hover:text-primary hover:bg-pink-50"
            }`}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            Live Now ({liveWebinars.length})
          </button>

          <button
            onClick={() => setActiveTab("upcoming")}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "upcoming"
                ? "bg-primary text-white shadow-md scale-105"
                : "text-slate-655 hover:text-primary hover:bg-pink-50"
            }`}
          >
            <Calendar className="h-4 w-4" />
            Upcoming ({upcomingWebinars.length})
          </button>

          <button
            onClick={() => setActiveTab("completed")}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "completed"
                ? "bg-primary text-white shadow-md scale-105"
                : "text-slate-655 hover:text-primary hover:bg-pink-50"
            }`}
          >
            <Award className="h-4 w-4" />
            Completed ({completedWebinars.length})
          </button>
        </div>
      </div>

      {/* Grid Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          variants={containerVariants}
          initial="hidden"
          animate="show"
          exit="hidden"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {currentList.length === 0 ? (
            <motion.div 
              variants={itemVariants} 
              className="col-span-full text-center bg-white border border-pink-100 rounded-3xl p-16 shadow-sm space-y-4 max-w-lg mx-auto"
            >
              <div className="text-pink-300 flex justify-center">
                <Video className="h-14 w-14 stroke-[1.5]" />
              </div>
              <h3 className="font-heading text-lg font-bold text-slate-700">No Webinars Available</h3>
              <p className="text-muted-foreground text-xs leading-relaxed">
                There are currently no webinars in this category. Search with other filters or check back later!
              </p>
            </motion.div>
          ) : (
            currentList.map((webinar) => {
              const isRegistered = webinar.registrations.some(r => r.userId === currentUser?.id);
              const remainingSeats = Math.max(webinar.maxSeats - webinar.registrations.length, 0);
              const seatsFilledPercent = Math.min((webinar.registrations.length / webinar.maxSeats) * 100, 100);

              // Date Formats
              const dateStr = new Date(webinar.date).toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric"
              });
              const startTimeStr = new Date(webinar.startTime).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit"
              });
              const endTimeStr = new Date(webinar.endTime).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit"
              });

              // Duration calculation
              const durationMin = Math.max(
                (new Date(webinar.endTime).getTime() - new Date(webinar.startTime).getTime()) / 60000,
                30
              );

              return (
                <motion.div
                  key={webinar.id}
                  variants={itemVariants}
                  whileHover={{ y: -6 }}
                  className="flex"
                >
                  <Card className="group flex flex-col bg-white hover:shadow-xl transition-all duration-300 rounded-3xl border border-pink-50/50 overflow-hidden relative w-full justify-between">
                    
                    {/* Header Banner */}
                    <div className="relative h-44 w-full bg-gradient-to-br from-pink-100 via-pink-50 to-rose-100 flex items-center justify-center overflow-hidden shrink-0">
                      {webinar.bannerImage ? (
                        <img
                          src={webinar.bannerImage}
                          alt={webinar.title}
                          className="object-cover h-full w-full group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="text-center text-primary/30 flex flex-col items-center">
                          <Award className="h-14 w-14 stroke-[1.2] mb-1 text-primary/45" />
                          <span className="text-[9px] uppercase font-extrabold tracking-widest text-primary/60">Awareness Module</span>
                        </div>
                      )}

                      {/* Mode Badge & Platform */}
                      <div className="absolute top-4 left-4 flex gap-1.5 items-center">
                        <span className="bg-white/90 backdrop-blur-md border border-pink-100/50 text-[9px] font-black text-primary px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs flex items-center gap-1">
                          <Globe className="h-3 w-3" /> {webinar.webinarMode}
                        </span>
                        {webinar.meetingPlatform && (
                          <span className="bg-slate-900/80 backdrop-blur-md text-white text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs flex items-center gap-1">
                            <Video className="h-3 w-3 text-pink-300" /> {webinar.meetingPlatform}
                          </span>
                        )}
                      </div>

                      <div className="absolute top-4 right-4">
                        <span className="bg-primary/95 text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs">
                          {webinar.category}
                        </span>
                      </div>
                    </div>

                    {/* Card Description */}
                    <CardHeader className="p-5 pb-3">
                      <div className="flex items-center gap-1.5 text-xs text-primary font-bold">
                        <Calendar className="h-3.5 w-3.5" /> {dateStr}
                        <span className="text-slate-300">|</span>
                        <Clock className="h-3.5 w-3.5" /> {startTimeStr} - {endTimeStr}
                      </div>

                      <CardTitle className="text-lg font-black text-slate-800 line-clamp-1 group-hover:text-primary transition-colors mt-2">
                        {webinar.title}
                      </CardTitle>

                      <CardDescription className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed font-medium">
                        {webinar.description}
                      </CardDescription>
                    </CardHeader>

                    {/* Card Content Details */}
                    <CardContent className="p-5 pt-0 flex-1 flex flex-col justify-between space-y-4">
                      {/* Doctor Profile block */}
                      <div className="space-y-3.5 border-y border-pink-50/50 py-3.5 text-xs text-slate-655 font-semibold">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-pink-100 flex items-center justify-center font-black text-primary overflow-hidden shrink-0 border border-pink-200">
                            {webinar.speakerImage ? (
                              <img src={webinar.speakerImage} alt={webinar.speakerName} className="object-cover h-full w-full" />
                            ) : (
                              webinar.speakerName.charAt(0)
                            )}
                          </div>
                          <div>
                            <p className="font-extrabold text-slate-800 leading-tight">{webinar.speakerName}</p>
                            <p className="text-[10px] text-primary mt-0.5 uppercase tracking-wide font-black">
                              {webinar.speakerQualification || "MD / Oncologist"}
                            </p>
                          </div>
                        </div>

                        {/* Specialization & Hospital */}
                        <div className="grid grid-cols-2 gap-2 text-[10px] bg-slate-50/55 rounded-xl p-2.5 border border-slate-100/50">
                          <div>
                            <span className="block text-slate-400 font-bold uppercase text-[8px]">Specialization</span>
                            <span className="text-slate-700 truncate block mt-0.5">{webinar.speakerSpecialization || "Cancer Specialist"}</span>
                          </div>
                          <div>
                            <span className="block text-slate-400 font-bold uppercase text-[8px]">Affiliation</span>
                            <span className="text-slate-700 truncate block mt-0.5">{webinar.speakerHospital || "GRS Healthcare"}</span>
                          </div>
                        </div>

                        {/* Duration & Language info */}
                        <div className="flex gap-4 text-[10px] font-bold text-slate-500 pt-0.5">
                          <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-primary shrink-0" /> {durationMin} Mins</span>
                          <span className="flex items-center gap-1"><Languages className="h-3.5 w-3.5 text-primary shrink-0" /> {webinar.language || "English"}</span>
                        </div>
                      </div>

                      {/* Action trigger & Seats remaining */}
                      <div className="space-y-3 pt-2">
                        {/* Seats Capacity bar */}
                        {activeTab !== "completed" && (
                          <div className="space-y-1.5 text-[10px] font-bold text-slate-500">
                            <div className="flex justify-between">
                              <span>Seats remaining: <strong className="text-slate-850">{remainingSeats}</strong> / {webinar.maxSeats}</span>
                              <span>{seatsFilledPercent.toFixed(0)}% filled</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                style={{ width: `${seatsFilledPercent}%` }}
                                className="h-full bg-primary rounded-full transition-all duration-500"
                              />
                            </div>
                          </div>
                        )}

                        <div className="flex justify-between gap-2.5 pt-1">
                          <Link href={`/webinars/${webinar.id}`} className="flex-1">
                            <Button 
                              variant="outline" 
                              className="w-full border-pink-200 text-slate-755 hover:bg-pink-50 rounded-xl text-xs font-bold py-2.5 h-auto cursor-pointer"
                            >
                              View Details
                            </Button>
                          </Link>

                          {activeTab === "completed" ? (
                            <span className="inline-flex items-center justify-center gap-1 px-4 py-2 bg-slate-100 text-slate-500 border border-slate-200 font-bold rounded-xl text-xs select-none flex-1 text-center">
                              Ended
                            </span>
                          ) : isRegistered ? (
                            <Link href={activeTab === "live" ? `/webinars/${webinar.id}/join` : `/dashboard`} className="flex-1">
                              <Button 
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold py-2.5 h-auto"
                              >
                                {activeTab === "live" ? "Join Stream" : "Reserved ✓"}
                              </Button>
                            </Link>
                          ) : (
                            <WebinarRegisterButton
                              webinarId={webinar.id}
                              webinarTitle={webinar.title}
                              currentUser={currentUser}
                              buttonText={activeTab === "live" ? "Register & Join" : "Register Now"}
                              className="flex-1 bg-primary hover:bg-primary/95 text-white font-bold rounded-xl text-xs py-2.5 h-auto shadow-sm"
                            />
                          )}
                        </div>
                      </div>

                    </CardContent>
                  </Card>
                </motion.div>
              );
            })
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
