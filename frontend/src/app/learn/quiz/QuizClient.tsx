"use client";

import { useState } from "react";
import { generateQuizCertificateAction } from "@/app/actions/quiz";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Award, Ribbon, CheckCircle2, XCircle, ChevronRight, RotateCcw, 
  Download, ExternalLink, ShieldCheck, HeartHandshake, Loader2 
} from "lucide-react";
import Link from "next/link";

interface QuizClientProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    role?: string | null;
  };
}

interface Question {
  id: number;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "What is the recommended age for average-risk women to begin annual screening mammograms?",
    options: ["25 years old", "30 years old", "40 years old", "65 years old"],
    correctIndex: 2,
    explanation: "Major clinical guidelines, including the American College of Radiology and American Cancer Society, recommend average-risk women start annual mammograms at age 40 to detect breast cancer early when it is most treatable."
  },
  {
    id: 2,
    text: "Which of the following is a common myth about breast cancer?",
    options: [
      "Men cannot get breast cancer", 
      "Finding a lump always means you have cancer", 
      "Only women with a family history get it", 
      "All of the above are myths"
    ],
    correctIndex: 3,
    explanation: "Men can get breast cancer (about 1% of cases), most lumps are benign (not cancer), and over 75% of women diagnosed have no family history."
  },
  {
    id: 3,
    text: "What is a 'Breast Self-Examination' (BSE) primarily used for?",
    options: [
      "Replacing a clinical mammogram", 
      "Becoming familiar with normal breast feel to spot changes", 
      "Testing for inherited gene mutations", 
      "Treating active physical symptoms"
    ],
    correctIndex: 1,
    explanation: "BSE helps women learn the normal structure of their breasts, making it easier to notice any unusual changes like lumps, thickness, or nipple discharge, which should be reported to a doctor immediately."
  },
  {
    id: 4,
    text: "Which gene mutations are most commonly associated with a significantly higher risk of hereditary breast and ovarian cancer?",
    options: ["BRCA1 and BRCA2", "TP53 only", "HER2 only", "EGFR and KRAS"],
    correctIndex: 0,
    explanation: "Mutations in BRCA1 and BRCA2 genes significantly increase the lifetime risk of developing breast and ovarian cancer. HER2 is a protein receptor expression, not a hereditary gene mutation."
  },
  {
    id: 5,
    text: "Which of the following lifestyle factors is associated with a LOWER risk of developing breast cancer?",
    options: [
      "High alcohol intake", 
      "Sedentary lifestyle", 
      "Maintaining a healthy weight and regular exercise", 
      "Active smoking"
    ],
    correctIndex: 2,
    explanation: "Research shows that regular physical activity and maintaining a healthy weight (especially post-menopause) help lower breast cancer risk."
  },
  {
    id: 6,
    text: "What does the 'HER2' status of a breast cancer tumor indicate?",
    options: [
      "The size of the tumor in centimeters", 
      "Whether the tumor has a protein receptor that promotes cancer growth", 
      "The clinical stage of the cancer", 
      "How many lymph nodes are affected"
    ],
    correctIndex: 1,
    explanation: "HER2 (Human Epidermal Growth Factor Receptor 2) is a protein that promotes the growth of cancer cells. Knowing HER2 status helps oncologists select targeted treatments like Trastuzumab (Herceptin)."
  },
  {
    id: 7,
    text: "True or False: Breast cancer is always painful in its early stages.",
    options: ["True", "False"],
    correctIndex: 1,
    explanation: "Early-stage breast cancer is usually painless. Waiting for a lump to hurt before seeking medical advice can delay critical diagnosis and treatment."
  },
  {
    id: 8,
    text: "What does 'Stage 0' breast cancer represent?",
    options: [
      "Metastatic cancer that has spread", 
      "Non-invasive cancer (e.g., Ductal Carcinoma in Situ - DCIS)", 
      "A benign cystic tumor", 
      "Inflammatory breast cancer"
    ],
    correctIndex: 1,
    explanation: "Stage 0 denotes non-invasive breast cancer, meaning the abnormal cells are confined to the ducts and have not invaded surrounding healthy breast tissue."
  },
  {
    id: 9,
    text: "If you find a new, persistent lump or change in your breast, what is the best first step?",
    options: [
      "Wait 6 months to see if it goes away", 
      "Start taking antibiotics", 
      "Schedule an appointment with a healthcare professional", 
      "Assume it is just a cyst"
    ],
    correctIndex: 2,
    explanation: "Any new, unexplained change in the breast should be evaluated by a healthcare professional as soon as possible for proper clinical breast examination and imaging."
  },
  {
    id: 10,
    text: "Which of the following is NOT a potential warning symptom of breast cancer?",
    options: [
      "Nipple discharge (especially bloody)", 
      "Dimpling or puckering of the breast skin", 
      "Changes in the size or shape of the breast", 
      "A temporary mild muscle ache after exercise"
    ],
    correctIndex: 3,
    explanation: "Temporary muscle soreness is normal after physical activity. Nipple retraction, discharge, skin dimpling (peau d'orange), and lumps are warning signs that require clinical evaluation."
  }
];

export default function QuizClient({ user }: QuizClientProps) {
  const [screen, setScreen] = useState<"start" | "quiz" | "result">("start");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Certificate generation states
  const [isGenerating, setIsGenerating] = useState(false);
  const [certResult, setCertResult] = useState<{
    success: boolean;
    certificateId?: string;
    certificateNumber?: string;
    error?: string;
    message?: string;
  } | null>(null);

  const currentQuestion = QUESTIONS[currentIdx];
  const totalQuestions = QUESTIONS.length;
  const percentage = (score / totalQuestions) * 100;
  const isPassed = percentage >= 80;

  const handleStart = () => {
    setScreen("quiz");
    setCurrentIdx(0);
    setSelectedOpt(null);
    setIsSubmitted(false);
    setScore(0);
    setCertResult(null);
  };

  const handleSubmitAnswer = () => {
    if (selectedOpt === null) return;
    setIsSubmitted(true);
    if (selectedOpt === currentQuestion.correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 < totalQuestions) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOpt(null);
      setIsSubmitted(false);
    } else {
      setScreen("result");
    }
  };

  const handleClaimCertificate = async () => {
    if (!isPassed) return;
    setIsGenerating(true);
    setCertResult(null);
    try {
      const res = await generateQuizCertificateAction(score);
      setCertResult(res);
    } catch (e: any) {
      setCertResult({ success: false, error: e.message || "An unexpected error occurred." });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-gradient-to-tr from-pink-50 via-white to-rose-50/30 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background blobs */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-pink-300/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-64 h-64 bg-rose-300/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-2xl w-full relative">
        
        {/* START SCREEN */}
        {screen === "start" && (
          <Card className="bg-white/80 backdrop-blur-md border border-pink-100 shadow-2xl rounded-3xl overflow-hidden">
            <CardHeader className="p-8 text-center space-y-4">
              <div className="h-14 w-14 bg-pink-50 text-primary rounded-2xl flex items-center justify-center border border-pink-100 mx-auto">
                <Award className="h-8 w-8" />
              </div>
              <div className="space-y-1">
                <CardTitle className="font-heading text-3xl font-black text-slate-800">
                  Breast Cancer Awareness Quiz
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground uppercase font-black tracking-widest text-primary/80 pt-1">
                  Certified Knowledge Check
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="px-8 pb-8 space-y-6">
              <div className="text-sm text-slate-600 space-y-4 leading-relaxed">
                <p>
                  Welcome to the Breast Cancer Awareness Quiz. This knowledge check is designed to test your understanding of risk reduction, early screening clinical guidelines, staging, and common breast cancer myths.
                </p>
                
                <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Quiz Rules & Guidelines:</h5>
                <ul className="list-disc pl-5 space-y-2 text-xs text-muted-foreground">
                  <li>Total Questions: <strong>10 Multiple Choice Questions</strong>.</li>
                  <li>No time limit per question—read and evaluate carefully.</li>
                  <li>Passing Grade: <strong>80% (at least 8 correct answers)</strong>.</li>
                  <li>Reward: Access to a downloadable, QR-verified <strong>Certificate of Quiz Excellence</strong> securely signed by GRS & partners.</li>
                </ul>
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <Button 
                  onClick={handleStart} 
                  className="w-full bg-primary hover:bg-primary/95 text-white font-bold rounded-xl shadow-md py-3.5 h-auto text-sm transition-all duration-200 active:scale-[0.98]"
                >
                  Start Quiz Now
                </Button>
                <Link href="/learn" className="text-center text-xs text-muted-foreground hover:text-primary transition-colors hover:underline">
                  ← Return to Learning Hub
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ACTIVE QUIZ SCREEN */}
        {screen === "quiz" && (
          <Card className="bg-white/80 backdrop-blur-md border border-pink-100 shadow-2xl rounded-3xl overflow-hidden flex flex-col justify-between min-h-[480px]">
            {/* Header / Progress */}
            <div className="p-6 border-b border-pink-50 bg-white/40 flex justify-between items-center text-xs">
              <div className="font-bold text-slate-500 uppercase tracking-wider">
                Question {currentIdx + 1} of {totalQuestions}
              </div>
              <div className="font-bold text-primary bg-pink-50 border border-pink-100 px-2.5 py-0.5 rounded-full">
                Score: {score}
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-1 bg-pink-100/50">
              <div 
                className="h-full bg-primary transition-all duration-300" 
                style={{ width: `${((currentIdx) / totalQuestions) * 100}%` }}
              />
            </div>

            {/* Body */}
            <CardContent className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <h3 className="font-heading text-lg sm:text-xl font-bold text-slate-800 leading-snug">
                  {currentQuestion.text}
                </h3>

                {/* Options List */}
                <div className="space-y-3 pt-2">
                  {currentQuestion.options.map((option, idx) => {
                    const isSelected = selectedOpt === idx;
                    const showCorrect = isSubmitted && idx === currentQuestion.correctIndex;
                    const showIncorrect = isSubmitted && isSelected && idx !== currentQuestion.correctIndex;

                    let btnClass = "border-slate-200 text-slate-700 bg-white/40 hover:bg-pink-50/20 hover:border-pink-200";
                    if (isSelected) btnClass = "border-primary bg-pink-50/20 text-primary";
                    if (showCorrect) btnClass = "border-emerald-500 bg-emerald-50/30 text-emerald-800 font-semibold";
                    if (showIncorrect) btnClass = "border-rose-500 bg-rose-50/30 text-rose-800 font-semibold";

                    return (
                      <button
                        key={idx}
                        disabled={isSubmitted}
                        onClick={() => setSelectedOpt(idx)}
                        className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm transition-all flex justify-between items-center ${btnClass} ${isSubmitted ? "cursor-default" : "cursor-pointer active:scale-[0.99]"}`}
                      >
                        <span>{option}</span>
                        {showCorrect && <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 ml-2" />}
                        {showIncorrect && <XCircle className="h-5 w-5 text-rose-600 shrink-0 ml-2" />}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation Block */}
                {isSubmitted && (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs sm:text-sm space-y-1.5 animate-fadeIn">
                    <p className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">Medical Explanation:</p>
                    <p className="text-slate-600 leading-relaxed">{currentQuestion.explanation}</p>
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="pt-4 border-t border-slate-100 flex justify-end">
                {!isSubmitted ? (
                  <Button
                    onClick={handleSubmitAnswer}
                    disabled={selectedOpt === null}
                    className="bg-primary hover:bg-primary/95 text-white font-bold rounded-xl shadow-sm px-6 py-2 h-auto text-xs sm:text-sm transition-all"
                  >
                    Submit Answer
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-sm px-6 py-2 h-auto text-xs sm:text-sm transition-all flex items-center gap-1"
                  >
                    {currentIdx + 1 === totalQuestions ? "Finish Quiz" : "Next Question"} <ChevronRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* RESULTS SCREEN */}
        {screen === "result" && (
          <Card className="bg-white/80 backdrop-blur-md border border-pink-100 shadow-2xl rounded-3xl overflow-hidden">
            <div className="p-8 text-center space-y-6">
              
              {/* Graphic Icon */}
              <div className="flex justify-center">
                {isPassed ? (
                  <div className="h-20 w-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center border border-emerald-100 animate-bounce">
                    <ShieldCheck className="h-12 w-12" />
                  </div>
                ) : (
                  <div className="h-20 w-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center border border-rose-100">
                    <RotateCcw className="h-10 w-10 text-rose-500 animate-spin-slow" />
                  </div>
                )}
              </div>

              {/* Header details */}
              <div className="space-y-2">
                <h1 className="font-heading text-3xl font-black text-slate-800">
                  {isPassed ? "Congratulations!" : "Keep Learning!"}
                </h1>
                <p className="text-xs text-muted-foreground uppercase font-black tracking-widest text-primary/80">
                  Quiz Completion Report
                </p>
              </div>

              {/* Score breakdown card */}
              <div className="max-w-sm mx-auto p-6 rounded-2xl bg-white border border-pink-50 shadow-xs space-y-3">
                <div className="text-xs font-semibold text-slate-400">YOUR TOTAL SCORE</div>
                <div className="text-4xl font-extrabold text-slate-800 font-heading">
                  {score} <span className="text-lg text-slate-400 font-normal">/ {totalQuestions}</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-2">
                  <div 
                    className={`h-full transition-all duration-500 ${isPassed ? "bg-emerald-500" : "bg-rose-500"}`} 
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className={`text-xs font-bold pt-1 ${isPassed ? "text-emerald-600" : "text-rose-600"}`}>
                  {isPassed ? "PASSED WITH DISTINCTION (≥ 80%)" : "FAILED (Requires score ≥ 80% to pass)"}
                </div>
              </div>

              {/* Action area */}
              <div className="space-y-4 pt-4 max-w-md mx-auto">
                {isPassed ? (
                  <div className="space-y-4">
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Amazing! You have demonstrated exceptional knowledge about breast cancer awareness and prevention guidelines. Claim your certified PDF credential below.
                    </p>

                    {/* Claim Button & Result */}
                    {!certResult ? (
                      <Button
                        onClick={handleClaimCertificate}
                        disabled={isGenerating}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md py-3.5 h-auto text-sm transition-all flex items-center justify-center gap-2"
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" /> Generating Certificate...
                          </>
                        ) : (
                          <>
                            <Award className="h-5 w-5" /> Claim Quiz Certificate
                          </>
                        )}
                      </Button>
                    ) : certResult.success ? (
                      <div className="space-y-3 p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100 text-left animate-fadeIn">
                        <div className="flex gap-2">
                          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <h4 className="text-sm font-bold text-slate-800">Certificate Issued Successfully!</h4>
                            <p className="text-[11px] text-slate-500 mt-0.5">Verification ID: <strong>{certResult.certificateNumber}</strong></p>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2 pt-2">
                          <Link href={`/api/certificates/${certResult.certificateId}/download`} className="flex-1">
                            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg py-2 h-auto flex items-center justify-center gap-1 shadow-sm">
                              <Download className="h-4 w-4" /> Download PDF
                            </Button>
                          </Link>
                          <Link href={`/verify/${certResult.certificateNumber}`} target="_blank" className="flex-1">
                            <Button variant="outline" className="w-full border-emerald-200 text-slate-700 hover:bg-emerald-50 text-xs font-semibold rounded-lg py-2 h-auto flex items-center justify-center gap-1">
                              <ExternalLink className="h-4 w-4" /> Verify Online
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 text-xs text-rose-800 text-left">
                        <strong>Error:</strong> {certResult.error}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-xs text-slate-500 leading-relaxed">
                      You did not meet the 80% correct threshold to qualify for a certificate. Re-read the explanations and try again to improve your score!
                    </p>
                    <Button 
                      onClick={handleStart}
                      className="w-full bg-primary hover:bg-primary/95 text-white font-bold rounded-xl shadow-md py-3.5 h-auto text-sm transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                      <RotateCcw className="h-4 w-4" /> Retake Quiz
                    </Button>
                  </div>
                )}

                <div className="flex justify-between items-center pt-6 border-t border-slate-100 text-xs text-muted-foreground font-semibold">
                  <Link href="/dashboard" className="hover:text-primary transition-colors hover:underline">
                    Go to Dashboard
                  </Link>
                  <Link href="/learn" className="hover:text-primary transition-colors hover:underline flex items-center gap-1">
                    <HeartHandshake className="h-4.5 w-4.5 text-primary shrink-0" /> Learning Hub
                  </Link>
                </div>

              </div>

            </div>
          </Card>
        )}

      </div>
    </div>
  );
}
