"use client";

import { useState } from "react";
import { 
  Calendar, Clock, MapPin, Award, Video, 
  Download, Eye, ShieldCheck, Play 
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import WebinarCountdown from "./WebinarCountdown";
import WebinarFeedbackForm from "./WebinarFeedbackForm";

interface DashboardWebinarsProps {
  registrations: any[];
  certificates: any[];
  attendanceLogs: any[];
}

export default function DashboardWebinars({ 
  registrations, 
  certificates, 
  attendanceLogs 
}: DashboardWebinarsProps) {
  const [filter, setFilter] = useState<"upcoming" | "today" | "live" | "completed">("upcoming");
  const now = new Date();

  // Helper to categorize each registration
  const categorized = registrations.map(r => {
    const webinar = r.webinar;
    const start = new Date(webinar.startTime);
    const end = new Date(webinar.endTime);
    
    let status: "live" | "today" | "upcoming" | "completed" = "upcoming";

    const isSameDay = now.toDateString() === start.toDateString();

    if (now >= start && now <= end && webinar.status === "PUBLISHED") {
      status = "live";
    } else if (now > end || webinar.status === "COMPLETED") {
      status = "completed";
    } else if (isSameDay && now < start && webinar.status === "PUBLISHED") {
      status = "today";
    } else {
      status = "upcoming";
    }

    return { ...r, calculatedStatus: status };
  });

  const filteredRegistrations = categorized.filter(r => r.calculatedStatus === filter);

  // Status Style badge mappings
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "live":
        return (
          <span className="bg-red-50 text-red-600 border border-red-100 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider animate-pulse flex items-center gap-1">
            <span className="h-1.5 w-1.5 bg-red-500 rounded-full" /> Live Stream
          </span>
        );
      case "today":
        return (
          <span className="bg-amber-50 text-amber-600 border border-amber-100 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
            Today
          </span>
        );
      case "completed":
        return (
          <span className="bg-slate-100 text-slate-500 border border-slate-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Completed
          </span>
        );
      default:
        return (
          <span className="bg-pink-50 text-primary border border-pink-100 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Upcoming
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Category selector button group */}
      <div className="flex flex-wrap gap-2 p-1 bg-pink-50/50 border border-pink-100/50 rounded-2xl w-fit shadow-inner">
        {(["live", "today", "upcoming", "completed"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              filter === tab
                ? "bg-primary text-white shadow-sm"
                : "text-slate-600 hover:text-primary hover:bg-pink-50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Grid of registered webinars */}
      {filteredRegistrations.length === 0 ? (
        <div className="text-center py-10 bg-white border border-pink-50 rounded-3xl p-8 shadow-xs">
          <p className="text-xs text-slate-500">No registered webinars found under this filter.</p>
          <p className="text-[10px] text-muted-foreground mt-1">
            Browse and sign up for awareness seminars on the <Link href="/webinars" className="text-primary font-bold hover:underline">Webinars listings</Link> page.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRegistrations.map(r => {
            const webinar = r.webinar;
            const start = new Date(webinar.startTime);
            const end = new Date(webinar.endTime);
            const status = r.calculatedStatus;

            // Find matching certificate if generated
            const certificate = certificates.find(c => c.webinarId === webinar.id);
            const attendance = attendanceLogs.find(a => a.webinarId === webinar.id);

            return (
              <Card key={r.id} className="group flex flex-col bg-white border border-pink-50/50 hover:shadow-lg transition-all duration-300 rounded-3xl overflow-hidden relative">
                {/* Banner wrapper */}
                <div className="relative h-32 w-full bg-gradient-to-br from-pink-100 via-pink-50 to-rose-100 flex items-center justify-center overflow-hidden shrink-0">
                  {webinar.bannerImage ? (
                    <img 
                      src={webinar.bannerImage} 
                      alt={webinar.title} 
                      className="object-cover h-full w-full group-hover:scale-105 transition-transform duration-500" 
                    />
                  ) : (
                    <div className="text-center text-primary/30 flex flex-col items-center">
                      <Award className="h-10 w-10 stroke-[1.2] mb-1 text-primary/45" />
                      <span className="text-[8px] uppercase font-bold tracking-widest text-primary/60">Registered Slot</span>
                    </div>
                  )}

                  {/* Top mode badge */}
                  <div className="absolute top-3 left-3">
                    <span className="bg-white/90 backdrop-blur-md border border-pink-100/50 text-[9px] font-black text-primary px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                      {webinar.webinarMode}
                    </span>
                  </div>

                  {/* Right bottom status & countdown */}
                  <div className="absolute bottom-3 right-3 flex flex-col items-end gap-1.5">
                    {getStatusBadge(status)}
                    {(status === "upcoming" || status === "today") && (
                      <WebinarCountdown startTime={webinar.startTime} />
                    )}
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4 text-xs font-semibold text-slate-600">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-pink-100 flex items-center justify-center font-black text-primary overflow-hidden shrink-0">
                        {webinar.speakerImage ? (
                          <img src={webinar.speakerImage} alt={webinar.speakerName} className="object-cover h-full w-full" />
                        ) : (
                          webinar.speakerName.charAt(0)
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 font-bold truncate">Doctor: {webinar.speakerName}</p>
                    </div>

                    <h4 className="font-heading font-black text-slate-800 text-sm line-clamp-1 group-hover:text-primary transition-colors">{webinar.title}</h4>

                    <div className="text-[10px] text-slate-500 space-y-1 pt-1.5 border-t border-pink-50/50">
                      <div className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-primary shrink-0" /> {start.toLocaleDateString("en-US")}</div>
                      <div className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-primary shrink-0" /> {start.toLocaleTimeString("en-US", {hour: "2-digit", minute:"2-digit"})} - {end.toLocaleTimeString("en-US", {hour: "2-digit", minute:"2-digit"})}</div>
                      <div className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-primary shrink-0" /> {webinar.venue || "Online"}</div>
                    </div>
                  </div>

                  {/* Buttons controls */}
                  <div className="space-y-3 pt-3 border-t border-slate-100">
                    <div className="flex justify-between items-center text-[9px] font-black uppercase text-slate-400">
                      <span>RSVP STATUS</span>
                      <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">Confirmed</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Link href={`/webinars/${webinar.id}`} className="w-full">
                        <Button 
                          variant="outline" 
                          className="w-full border-pink-200 text-slate-700 hover:bg-pink-50 rounded-xl text-[10px] font-bold py-2 h-8 flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Eye className="h-3.5 w-3.5" /> Details
                        </Button>
                      </Link>

                      {status === "live" ? (
                        <Link href={`/webinars/${webinar.id}/join`} className="w-full">
                          <Button 
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-bold py-2 h-8 flex items-center justify-center gap-1 animate-pulse cursor-pointer"
                          >
                            <Play className="h-3.5 w-3.5 fill-white text-white" /> Join Meeting
                          </Button>
                        </Link>
                      ) : (
                        <Button 
                          disabled 
                          className="w-full bg-slate-55 border border-slate-100 text-slate-400 rounded-xl text-[10px] font-bold py-2 h-8 cursor-not-allowed"
                        >
                          {status === "completed" ? "Completed" : "Locked"}
                        </Button>
                      )}
                    </div>

                    {/* Certificate download trigger if completed and qualified */}
                    {status === "completed" && (
                      <div className="space-y-2 pt-2 border-t border-dashed border-slate-100">
                        {certificate ? (
                          <Link href={`/api/certificates/${certificate.id}/download`} className="block w-full">
                            <Button 
                              className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-xl text-[10px] py-2 h-8 flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <Download className="h-3.5 w-3.5" /> Download Certificate
                            </Button>
                          </Link>
                        ) : (
                          <div className="text-[10px] text-center font-medium bg-slate-50 p-2 rounded-xl border border-slate-100 text-slate-400">
                            {attendance && attendance.attendancePercentage >= 80 ? (
                              <span className="text-emerald-600">Generating certificate...</span>
                            ) : (
                              <span>Certificate Ineligible (Need &gt;= 80% stay)</span>
                            )}
                          </div>
                        )}

                        {/* Past webinar resources & feedback */}
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          {webinar.recordingUrl ? (
                            <Link href={webinar.recordingUrl} target="_blank" className="w-full">
                              <span className="inline-flex w-full h-8 items-center justify-center gap-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold transition-colors">
                                <Video className="h-3.5 w-3.5" /> Recording
                              </span>
                            </Link>
                          ) : (
                            <span className="text-center text-[9px] text-slate-400 italic bg-slate-50 py-1.5 rounded-xl border border-slate-100 flex items-center justify-center h-8">No video</span>
                          )}

                          {webinar.materialsUrl ? (
                            <Link href={webinar.materialsUrl} target="_blank" className="w-full">
                              <span className="inline-flex w-full h-8 items-center justify-center gap-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold transition-colors">
                                <Download className="h-3.5 w-3.5" /> Materials
                              </span>
                            </Link>
                          ) : (
                            <span className="text-center text-[9px] text-slate-400 italic bg-slate-50 py-1.5 rounded-xl border border-slate-100 flex items-center justify-center h-8">No slides</span>
                          )}
                        </div>

                        <WebinarFeedbackForm
                          webinarId={webinar.id}
                          existingFeedback={r.feedback}
                          existingRating={r.rating}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
