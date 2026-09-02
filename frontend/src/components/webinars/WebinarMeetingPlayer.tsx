"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { joinWebinarAction, leaveWebinarAction } from "@/app/actions/webinars";
import { Button } from "@/components/ui/button";
import { 
  Video, VideoOff, Mic, MicOff, PhoneOff, MessageSquare, Users, 
  Settings, Award, Loader2, Sparkles, Send, ShieldCheck, ExternalLink, AlertTriangle 
} from "lucide-react";

interface WebinarMeetingPlayerProps {
  webinarId: string;
  webinarTitle: string;
  speakerName: string;
  meetingLink: string;
}

export default function WebinarMeetingPlayer({
  webinarId,
  webinarTitle,
  speakerName,
  meetingLink,
}: WebinarMeetingPlayerProps) {
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [micActive, setMicActive] = useState(false);
  const [videoActive, setVideoActive] = useState(true);
  const [showChat, setShowChat] = useState(true);
  const [chatMessages, setChatMessages] = useState<{ sender: string; text: string; role?: string }[]>([
    { sender: "System", text: "Welcome to the Live Stream room.", role: "SYSTEM" },
    { sender: speakerName, text: "Welcome everyone, we will begin the staging guidelines shortly.", role: "SPEAKER" },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [secondsStayed, setSecondsStayed] = useState(0);
  const [attendanceSaved, setAttendanceSaved] = useState(false);
  const [certReadyModal, setCertReadyModal] = useState<{ number: string; id: string } | null>(null);

  const trackerInterval = useRef<NodeJS.Timeout | null>(null);

  // Auto-join on load
  useEffect(() => {
    const handleJoin = async () => {
      try {
        await joinWebinarAction(webinarId);
        setLoading(false);

        // Start local stay duration tracking
        trackerInterval.current = setInterval(() => {
          setSecondsStayed((prev) => prev + 1);
        }, 1000);
      } catch (e: any) {
        alert(e.message || "Could not log joining details.");
        router.push(`/webinars/${webinarId}`);
      }
    };

    handleJoin();

    return () => {
      if (trackerInterval.current) {
        clearInterval(trackerInterval.current);
      }
    };
  }, [webinarId]);

  // Simulated live audience chats
  useEffect(() => {
    if (loading) return;

    const mockAudience = ["Sita Sharma", "Anjali Rao", "Vikram Sen", "Dr. Amit Patel", "Priya K."];
    const mockTexts = [
      "Hello doctor! Thank you for hosting this.",
      "How frequently should self-breast examinations be performed?",
      "Can we do self checks during pregnancy?",
      "Very clear explanation of early diagnostic staging.",
      "Are GRS certificates verifiably signed?",
      "Excellent initiative for volunteer teams!",
    ];

    const chatInterval = setInterval(() => {
      const randomAudience = mockAudience[Math.floor(Math.random() * mockAudience.length)];
      const randomText = mockTexts[Math.floor(Math.random() * mockTexts.length)];
      
      setChatMessages((prev) => [...prev, { sender: randomAudience, text: randomText }]);
    }, 8000);

    return () => clearInterval(chatInterval);
  }, [loading]);

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    setChatMessages((prev) => [...prev, { sender: "You", text: chatInput, role: "USER" }]);
    setChatInput("");
  };

  const handleLeave = async () => {
    if (trackerInterval.current) {
      clearInterval(trackerInterval.current);
    }
    setLoading(true);
    try {
      // Record attendance and calculate percentage
      const res = await leaveWebinarAction(webinarId, secondsStayed);
      if (res.success) {
        setAttendanceSaved(true);
        if (res.certificateGenerated && res.certificateId) {
          setCertReadyModal({ number: res.certificateId, id: res.certificateId });
        } else {
          router.push("/dashboard");
        }
      }
    } catch (e: any) {
      alert("Error leaving meeting: " + e.message);
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  // Developer Bypass: Simulate stay long enough (e.g. 1 hour/80%) to generate certificate instantly
  const handleSimulate80Stay = async () => {
    if (trackerInterval.current) {
      clearInterval(trackerInterval.current);
    }
    setLoading(true);
    try {
      // Simulate staying for 3600 seconds (60 mins) to satisfy 80% requirement
      const res = await leaveWebinarAction(webinarId, 3600);
      if (res.success) {
        setAttendanceSaved(true);
        if (res.certificateGenerated && res.certificateId) {
          setCertReadyModal({ number: res.certificateId, id: res.certificateId });
        } else {
          alert("Simulation completed. Attendance recorded, but certificate criteria not met (need >= 80% or status Completed). Check dashboard logs!");
          router.push("/dashboard");
        }
      }
    } catch (e: any) {
      alert("Simulation error: " + e.message);
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Helper to extract YouTube video ID
  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const youtubeId = getYouTubeId(meetingLink);

  const handleLaunchExternal = () => {
    window.open(meetingLink, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white space-y-4">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
        <p className="text-sm font-semibold tracking-wider uppercase text-slate-400">Connecting to secure stream server...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col text-white relative">
      
      {/* Header bar */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between z-10 shrink-0">
        <div>
          <span className="bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[9px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider animate-pulse inline-flex items-center gap-1">
            <Sparkles className="h-2.5 w-2.5" /> Live Stream
          </span>
          <h1 className="font-heading text-base md:text-lg font-bold truncate max-w-md mt-1">{webinarTitle}</h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Stay Timer indicator */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
            <span className="font-mono font-bold">Stayed: {formatTimer(secondsStayed)}</span>
          </div>

          {/* Dev Simulate 80% Button */}
          <Button
            onClick={handleSimulate80Stay}
            className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-bold text-xs rounded-xl shadow-md px-4 py-1.5 h-auto transition-transform active:scale-95 cursor-pointer"
          >
            Dev Bypass: Simulate 80% Stay
          </Button>
        </div>
      </header>

      {/* Main meeting area */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        
        {/* Left Side: Video Stream Screen */}
        <div className="flex-1 bg-slate-950 p-6 flex flex-col justify-center items-center relative group">
          
          <div className="w-full max-w-4xl aspect-video bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden relative shadow-2xl flex items-center justify-center">
            {videoActive ? (
              youtubeId ? (
                // YouTube embed
                <iframe
                  className="w-full h-full border-0"
                  src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=0`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                // Zoom or Google Meet landing launcher
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 space-y-6 text-center bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">
                  <div className="relative h-20 w-20 flex items-center justify-center bg-pink-500/10 border border-pink-500/30 rounded-2xl animate-pulse">
                    <Video className="h-10 w-10 text-primary" />
                  </div>

                  <div className="space-y-2.5 max-w-md">
                    <h3 className="text-xl font-bold text-white uppercase tracking-wider">Launch External Stream</h3>
                    <p className="text-xs text-slate-400 leading-relaxed font-medium">
                      This webinar meeting is conducted via <strong className="text-pink-300 uppercase">{meetingLink.includes("zoom") ? "Zoom" : meetingLink.includes("meet.google") ? "Google Meet" : "External Platform"}</strong>. Click below to launch the video room.
                    </p>
                  </div>

                  {/* Warning banner */}
                  <div className="flex items-start gap-2 text-left bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 max-w-md text-[11px] text-amber-400">
                    <AlertTriangle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                    <p className="leading-tight font-medium">
                      <strong>Important:</strong> Keep this browser tab open in the background! Closing this page will pause your stay duration tracking, affecting your certificate eligibility.
                    </p>
                  </div>

                  <Button
                    onClick={handleLaunchExternal}
                    className="bg-primary hover:bg-primary/95 text-white font-bold rounded-2xl shadow-lg px-8 py-3.5 h-auto text-sm transition-transform active:scale-95 flex items-center gap-1.5 cursor-pointer"
                  >
                    Launch Meeting Room
                    <ExternalLink className="h-4.5 w-4.5" />
                  </Button>
                </div>
              )
            ) : (
              <div className="text-center space-y-2">
                <VideoOff className="h-16 w-16 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400 font-semibold">Your video is disabled</p>
              </div>
            )}

            {/* Float speaker metadata label */}
            <div className="absolute bottom-4 left-4 bg-slate-950/80 backdrop-blur-sm border border-slate-800 rounded-xl px-3 py-1.5 text-[10px] font-bold text-slate-300 flex items-center gap-1.5 z-10">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> Presenter: {speakerName} (Oncologist)
            </div>
          </div>
        </div>

        {/* Right Side: Live Chat Feed */}
        {showChat && (
          <div className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col shrink-0">
            <div className="px-4 py-3.5 border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <MessageSquare className="h-4 w-4" /> Live Chat Box
              </span>
              <span className="bg-slate-850 px-2 py-0.5 rounded text-[10px] text-slate-400 font-mono font-bold">
                Online: {chatMessages.length + 12}
              </span>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
              {chatMessages.map((msg, i) => {
                const isSystem = msg.role === "SYSTEM";
                const isSpeaker = msg.role === "SPEAKER";
                return (
                  <div key={i} className={`space-y-0.5 ${isSystem ? "text-center py-1.5" : ""}`}>
                    {isSystem ? (
                      <span className="bg-slate-800 text-slate-400 px-2.5 py-1 rounded text-[9px] font-semibold border border-slate-700/50">
                        {msg.text}
                      </span>
                    ) : (
                      <>
                        <div className="flex items-center gap-1">
                          <span className={`font-bold ${isSpeaker ? "text-primary" : "text-slate-300"}`}>
                            {msg.sender}
                          </span>
                          {isSpeaker && (
                            <span className="bg-primary/25 text-primary text-[8px] font-black uppercase px-1 rounded tracking-wider">
                              Speaker
                            </span>
                          )}
                          {msg.sender === "You" && (
                            <span className="bg-blue-500/20 text-blue-400 text-[8px] font-black uppercase px-1 rounded tracking-wider">
                              You
                            </span>
                          )}
                        </div>
                        <p className="text-slate-400 leading-relaxed bg-slate-850 p-2 rounded-xl border border-slate-800/20">
                          {msg.text}
                        </p>
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Chat Form Input */}
            <form onSubmit={handleSendChat} className="p-3 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                placeholder="Send message to room..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary/50"
              />
              <button type="submit" className="bg-primary hover:bg-primary/95 text-white p-2 rounded-xl shrink-0 transition-all cursor-pointer">
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Control bar bottom */}
      <footer className="bg-slate-900 border-t border-slate-800 px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex gap-2">
          {/* Mic */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMicActive(!micActive)}
            className={`rounded-xl px-3.5 cursor-pointer ${micActive ? "bg-slate-800 text-white border-slate-700" : "bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20"}`}
          >
            {micActive ? <Mic className="h-4.5 w-4.5" /> : <MicOff className="h-4.5 w-4.5" />}
          </Button>

          {/* Video */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setVideoActive(!videoActive)}
            className={`rounded-xl px-3.5 cursor-pointer ${videoActive ? "bg-slate-800 text-white border-slate-700" : "bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20"}`}
          >
            {videoActive ? <Video className="h-4.5 w-4.5" /> : <VideoOff className="h-4.5 w-4.5" />}
          </Button>
        </div>

        {/* Center: Leave button */}
        <Button
          onClick={handleLeave}
          className="bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold flex items-center gap-1.5 px-6 cursor-pointer"
        >
          <PhoneOff className="h-4 w-4" /> Leave Webinar
        </Button>

        {/* Right controls toggle */}
        <div className="flex gap-2 text-slate-400">
          <Button
            variant="ghost"
            onClick={() => setShowChat(!showChat)}
            className={`rounded-xl px-3 hover:text-white cursor-pointer ${showChat ? "text-primary bg-slate-800/40" : ""}`}
          >
            <MessageSquare className="h-4.5 w-4.5" />
          </Button>
          <Button variant="ghost" className="rounded-xl px-3 hover:text-white cursor-pointer">
            <Users className="h-4.5 w-4.5" />
          </Button>
          <Button variant="ghost" className="rounded-xl px-3 hover:text-white cursor-pointer">
            <Settings className="h-4.5 w-4.5" />
          </Button>
        </div>
      </footer>

      {/* Certificate Ready Modal Alert */}
      {certReadyModal && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white text-slate-800 rounded-3xl border border-pink-100 p-8 max-w-md w-full text-center space-y-6 shadow-2xl relative">
            <div className="absolute top-4 right-4 flex items-center gap-1 opacity-5">
              <Award className="h-24 w-24 text-rose-600" />
            </div>

            <div className="h-16 w-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center border border-emerald-100 mx-auto">
              <ShieldCheck className="h-10 w-10" />
            </div>

            <div className="space-y-2">
              <h3 className="font-heading text-xl md:text-2xl font-black text-slate-800">Certificate Generated!</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Congratulations! You successfully maintained a stay duration over 80% during the live webinar. Your cryptographic QR certificate has been issued and stored.
              </p>
            </div>

            <div className="bg-pink-50/50 border border-pink-100 rounded-2xl p-4 text-xs space-y-1.5 text-left text-slate-700">
              <p><span className="font-bold text-slate-655">Webinar:</span> {webinarTitle}</p>
              <p><span className="font-bold text-slate-655">Instructor:</span> {speakerName}</p>
              <p><span className="font-bold text-slate-655">System Log:</span> PRESENT (100% attendance credits)</p>
            </div>

            <div className="flex gap-2.5">
              <button
                onClick={() => router.push(`/api/certificates/${certReadyModal.id}/download`)}
                className="flex-1 bg-primary hover:bg-primary/95 text-white font-bold text-sm py-3 rounded-2xl shadow-md transition-all active:scale-95 cursor-pointer"
              >
                Download PDF
              </button>
              <button
                onClick={() => router.push("/dashboard")}
                className="flex-1 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-semibold text-sm py-3 rounded-2xl cursor-pointer"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
