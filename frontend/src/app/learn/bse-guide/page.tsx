"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Ribbon, CheckCircle, Timer, Play, Pause, RotateCcw, 
  ChevronLeft, ChevronRight, Eye, User, Sparkles, ShieldAlert 
} from "lucide-react";
import Link from "next/link";

interface BSEStep {
  id: number;
  title: string;
  shortDesc: string;
  instructions: string[];
  visualTip: string;
}

const STEPS: BSEStep[] = [
  {
    id: 1,
    title: "Visual Inspection (Mirror)",
    shortDesc: "Stand in front of a mirror with shoulders straight and arms on your hips.",
    instructions: [
      "Look at your breasts in the mirror. Check for normal size, shape, and even color.",
      "Inspect if they are evenly shaped without visible distortion, swelling, or asymmetry.",
      "Check for warning signs: skin dimpling, puckering, bulging of the skin, a nipple that has changed position or turned inward, or redness, soreness, rash, or swelling."
    ],
    visualTip: "Tip: Stand under good, natural lighting so skin texture changes are easily visible."
  },
  {
    id: 2,
    title: "Arms Raised Visual Check",
    shortDesc: "Raise your arms high above your head and look for the same signs.",
    instructions: [
      "Look for any skin pulling or dimpling that becomes apparent only when your arms are raised.",
      "Look closely at the lower contour of each breast to ensure there is no bulging.",
      "Check for any nipple discharge. Look for signs of watery, milky, yellow fluid, or blood coming out of one or both nipples."
    ],
    visualTip: "Tip: Turn slowly from side to side in the mirror to inspect the outer contours."
  },
  {
    id: 3,
    title: "Palpation (Lying Down)",
    shortDesc: "Lie down to flatten the breast tissue, making it easier to feel layers.",
    instructions: [
      "Place a small pillow under your right shoulder and put your right arm behind your head.",
      "Use your left hand's finger pads (the index, middle, and ring fingers) to feel your right breast.",
      "Keep fingers flat and together. Move in small circular motions about the size of a quarter.",
      "Follow a systematic pattern (e.g., vertical lines or concentric circles) covering the entire breast area from your collarbone to your ribcage, and armpit to cleavage.",
      "Repeat the process using your right hand to inspect your left breast."
    ],
    visualTip: "Tip: Use three levels of pressure: light (for surface tissue), medium (for middle layers), and firm (for tissue closest to the ribs)."
  },
  {
    id: 4,
    title: "Palpation (Standing/Shower)",
    shortDesc: "Feel your breasts while standing, preferably in the shower.",
    instructions: [
      "Wet, soapy skin makes it much easier to feel changes, nodules, or thickness underneath.",
      "Raise one arm behind your head and use the opposite hand's finger pads to palpate the breast.",
      "Use the same circular quarter-sized motions and pressure levels.",
      "Check the underarm area (axillary lymph nodes) as breast tissue extends into the armpit.",
      "Repeat on the opposite side."
    ],
    visualTip: "Tip: Perform this check immediately after your shower or while applying lotion."
  },
  {
    id: 5,
    title: "Track & Log Changes",
    shortDesc: "Compare your observations monthly and report anomalies.",
    instructions: [
      "Ideally, perform your Breast Self-Exam 3 to 5 days after your period ends, when breasts are least tender or lumpy.",
      "If you are post-menopausal, choose a consistent calendar day each month (e.g., the 1st of the month).",
      "Keep a log of how your breasts feel. Most lumps turn out to be benign cysts, but early detection is vital.",
      "If you feel a hard nodule, deep lump, or notice retraction, contact a doctor immediately."
    ],
    visualTip: "Tip: Do not panic if you feel a lump. Simply schedule a clinical checkup for professional imaging."
  }
];

export default function BSEGuidePage() {
  const [activeStep, setActiveStep] = useState(0);
  
  // Timer States
  const [seconds, setSeconds] = useState(120); // 2-minute exam timer
  const [isTimerActive, setIsTimerActive] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isTimerActive && seconds > 0) {
      timerRef.current = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsTimerActive(false);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerActive, seconds]);

  const handleTimerToggle = () => {
    setIsTimerActive(!isTimerActive);
  };

  const handleTimerReset = () => {
    setIsTimerActive(false);
    setSeconds(120);
  };

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleNext = () => {
    if (activeStep < STEPS.length - 1) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-pink-50 via-white to-rose-50/30 py-16 px-4 sm:px-6 lg:px-8">
      {/* Decorative background blur blobs */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-pink-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-rose-200/25 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto space-y-10 relative">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 border border-pink-200 text-pink-700 text-xs font-bold uppercase tracking-wider">
            <Ribbon className="h-4 w-4 text-primary" />
            Interactive Guide
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-black text-slate-800">
            Breast Self-Examination <span className="text-primary">BSE Guide</span>
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm max-w-2xl mx-auto">
            A step-by-step clinical walkthrough to build body familiarity. Timers are included to help you perform a thorough, slow examination.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* LEFT: Step Navigator */}
          <div className="md:col-span-1 space-y-3">
            <div className="bg-white/80 backdrop-blur-md border border-pink-100 rounded-3xl p-5 shadow-sm space-y-4">
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Exam Steps</h4>
              <div className="flex flex-col gap-2">
                {STEPS.map((step, idx) => {
                  const isActive = activeStep === idx;
                  return (
                    <button
                      key={step.id}
                      onClick={() => setActiveStep(idx)}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs font-semibold transition-all flex items-center gap-3 ${
                        isActive 
                          ? "border-primary bg-pink-50/20 text-primary" 
                          : "border-slate-100 hover:bg-pink-50/10 text-slate-600 bg-white/40"
                      }`}
                    >
                      <span className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        isActive ? "bg-primary text-white" : "bg-slate-100 text-slate-400"
                      }`}>
                        {step.id}
                      </span>
                      <span>{step.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Built-in Exam Pacing Timer */}
            <div className="bg-white/85 backdrop-blur-md border border-pink-100 rounded-3xl p-5 shadow-sm text-center space-y-4">
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center justify-center gap-1.5">
                <Timer className="h-4.5 w-4.5 text-primary" /> Exam Timer
              </h4>
              
              <div className="text-3xl font-extrabold text-slate-800 font-heading tracking-tight">
                {formatTime(seconds)}
              </div>
              
              <p className="text-[10px] text-muted-foreground leading-relaxed px-2">
                Use this timer to pace your palpation steps. Each side should be felt for at least 60 seconds.
              </p>

              <div className="flex gap-2 justify-center">
                <Button 
                  size="sm" 
                  onClick={handleTimerToggle}
                  className={`rounded-lg py-1.5 h-auto text-[10px] uppercase font-bold px-3 shadow-xs flex items-center gap-1 ${
                    isTimerActive ? "bg-amber-600 hover:bg-amber-700" : "bg-primary hover:bg-primary/95"
                  }`}
                >
                  {isTimerActive ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                  {isTimerActive ? "Pause" : "Start"}
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={handleTimerReset}
                  className="border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg py-1.5 h-auto text-[10px] uppercase font-bold px-3"
                >
                  <RotateCcw className="h-3 w-3" /> Reset
                </Button>
              </div>
            </div>
          </div>

          {/* RIGHT: Active Step Content */}
          <div className="md:col-span-2 space-y-6">
            <Card className="bg-white/80 backdrop-blur-md border border-pink-100 shadow-xl rounded-3xl overflow-hidden min-h-[400px] flex flex-col justify-between">
              
              {/* Card Header */}
              <CardHeader className="p-6 pb-0 border-b border-pink-50/50 bg-white/40">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase text-primary tracking-widest bg-pink-100/50 px-3 py-1 rounded-full">
                    Step {STEPS[activeStep].id} of {STEPS.length}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-semibold">
                    <Eye className="h-3.5 w-3.5 text-primary" /> Visual Guide
                  </div>
                </div>
                <CardTitle className="font-heading text-2xl font-black text-slate-800 mt-3">
                  {STEPS[activeStep].title}
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 font-semibold mt-1">
                  {STEPS[activeStep].shortDesc}
                </CardDescription>
              </CardHeader>

              {/* Instructions List */}
              <CardContent className="p-6 sm:p-8 flex-1 space-y-6">
                <ul className="space-y-3.5">
                  {STEPS[activeStep].instructions.map((inst, index) => (
                    <li key={index} className="flex gap-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                      <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{inst}</span>
                    </li>
                  ))}
                </ul>

                {/* Visual / Rationale Tip */}
                <div className="p-4 rounded-2xl bg-pink-50/15 border border-pink-100/30 text-xs text-slate-500 flex gap-2.5 items-start">
                  <Sparkles className="h-4.5 w-4.5 text-primary shrink-0 mt-0.5 animate-pulse" />
                  <p className="leading-relaxed font-medium">{STEPS[activeStep].visualTip}</p>
                </div>
              </CardContent>

              {/* Footer controls */}
              <div className="p-6 border-t border-slate-100 flex justify-between">
                <Button
                  variant="outline"
                  disabled={activeStep === 0}
                  onClick={handlePrev}
                  className="border-pink-200 text-slate-700 hover:bg-pink-50 rounded-xl text-xs py-2 h-auto px-4 flex items-center gap-1"
                >
                  <ChevronLeft className="h-4 w-4" /> Previous Step
                </Button>

                {activeStep < STEPS.length - 1 ? (
                  <Button
                    onClick={handleNext}
                    className="bg-primary hover:bg-primary/95 text-white font-bold rounded-xl shadow-md text-xs py-2 h-auto px-5 flex items-center gap-1"
                  >
                    Next Step <ChevronRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Link href="/learn/quiz">
                    <Button
                      className="bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-md text-xs py-2 h-auto px-5 flex items-center gap-1"
                    >
                      Take Quiz Check <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                )}
              </div>

            </Card>
          </div>

        </div>

        {/* Clinical Safety & Limitations disclaimer */}
        <div className="bg-slate-50 border border-slate-200/50 rounded-3xl p-6 md:p-8 flex gap-4 text-xs text-slate-500 leading-relaxed max-w-4xl mx-auto">
          <ShieldAlert className="h-6 w-6 text-emerald-600 shrink-0" />
          <div className="space-y-1.5">
            <h5 className="font-bold text-slate-800">Critical Medical Information</h5>
            <p>
              Performing regular Breast Self-Examinations is a helpful way to become familiar with the usual state of your breasts and detect abnormalities early. However, BSE is <strong>not a replacement</strong> for regular clinical breast exams by a doctor or screening mammography.
            </p>
            <p>
              Most clinical guides recommend annual mammograms starting at age 40 for average-risk women. If you notice any concerning changes (such as a hard lump, thick tissue, nipple discharge, or skin dimpling), please consult a healthcare professional.
            </p>
          </div>
        </div>

        <div className="text-center pt-2">
          <Link href="/learn" className="text-xs text-muted-foreground hover:text-primary transition-colors hover:underline">
            ← Return to Awareness Hub
          </Link>
        </div>

      </div>
    </div>
  );
}
