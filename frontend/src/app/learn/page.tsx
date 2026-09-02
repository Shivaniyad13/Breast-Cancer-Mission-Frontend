import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, BookOpen, Heart, Ribbon, Timer, ChevronRight, HelpCircle, ShieldCheck } from "lucide-react";

export default function AwarenessHubPage() {
  return (
    <div className="min-h-screen bg-gradient-to-tr from-pink-50 via-white to-rose-50/30 py-16 px-4 sm:px-6 lg:px-8">
      {/* Decorative background blur blobs */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-pink-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-[40%] left-5 w-60 h-60 bg-rose-200/25 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-16 relative">
        {/* Hero Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 border border-pink-200 text-pink-700 text-xs font-bold uppercase tracking-wider">
            <Ribbon className="h-4 w-4 animate-pulse" />
            Knowledge is Power
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl font-black text-slate-800 leading-tight">
            Breast Cancer <span className="text-primary">Awareness Hub</span>
          </h1>
          <p className="text-slate-600 text-base sm:text-lg">
            Access certified resources, take our medical knowledge quiz, learn systematic breast self-examination methods, and register for live specialist webinars.
          </p>
        </div>

        {/* Module Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: BSE Guide */}
          <Card className="group bg-white/70 backdrop-blur-md border border-pink-100/50 hover:border-pink-200 hover:shadow-xl transition-all duration-300 rounded-3xl overflow-hidden flex flex-col justify-between">
            <CardHeader className="p-6 pb-0">
              <div className="h-12 w-12 rounded-2xl bg-pink-50 text-primary flex items-center justify-center border border-pink-100 group-hover:scale-110 transition-transform duration-300">
                <Timer className="h-6 w-6" />
              </div>
              <CardTitle className="font-heading text-xl font-bold mt-4 text-slate-800">
                Self Examination Guide
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-1">
                Interactive BSE step-by-step visual timers.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                Learn the clinical steps for performing a Breast Self-Examination (BSE) at home. Familiarize yourself with normal breast tissue layout and check for warning signs.
              </p>
              <Link href="/learn/bse-guide" className="block w-full">
                <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs py-2 h-auto flex items-center justify-center gap-1.5 shadow-sm group-hover:-translate-y-0.5 transition-all">
                  Launch BSE Guide <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Card 2: Quiz Engine */}
          <Card className="group bg-white/70 backdrop-blur-md border border-pink-200 hover:border-pink-300 hover:shadow-xl transition-all duration-300 rounded-3xl overflow-hidden flex flex-col justify-between ring-1 ring-pink-100">
            <CardHeader className="p-6 pb-0">
              <div className="h-12 w-12 rounded-2xl bg-pink-100 text-primary flex items-center justify-center border border-pink-200 group-hover:scale-110 transition-transform duration-300 relative">
                <Award className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 h-3.5 w-3.5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center" />
              </div>
              <CardTitle className="font-heading text-xl font-bold mt-4 text-slate-800 flex items-center gap-2">
                Awareness Quiz Engine
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-1">
                Test your knowledge & earn verified certificates.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                Answer 10 clinically reviewed questions on breast cancer staging, risk factors, screening, and prevention. Score 80% or more to unlock a QR-verified downloadable PDF certificate.
              </p>
              <Link href="/learn/quiz" className="block w-full">
                <Button className="w-full bg-primary hover:bg-primary/95 text-white rounded-xl text-xs py-2 h-auto flex items-center justify-center gap-1.5 shadow-md group-hover:-translate-y-0.5 transition-all">
                  Start Quiz Engine <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Card 3: Webinars */}
          <Card className="group bg-white/70 backdrop-blur-md border border-pink-100/50 hover:border-pink-200 hover:shadow-xl transition-all duration-300 rounded-3xl overflow-hidden flex flex-col justify-between">
            <CardHeader className="p-6 pb-0">
              <div className="h-12 w-12 rounded-2xl bg-pink-50 text-primary flex items-center justify-center border border-pink-100 group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="h-6 w-6" />
              </div>
              <CardTitle className="font-heading text-xl font-bold mt-4 text-slate-800">
                Live Webinars
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-1">
                Virtual panels with oncologists & advisors.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                Participate in live digital webinars organized by strategic partners and NGOs. Learn from oncology experts and ask questions in real-time.
              </p>
              <Link href="/webinars" className="block w-full">
                <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs py-2 h-auto flex items-center justify-center gap-1.5 shadow-sm group-hover:-translate-y-0.5 transition-all">
                  Browse Webinars <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

        </div>

        {/* Myth Busters Accordion / Cards */}
        <div className="bg-white/80 backdrop-blur-md border border-pink-100 rounded-3xl p-8 md:p-12 shadow-sm space-y-8">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <h2 className="font-heading text-2xl md:text-3xl font-black text-slate-800">
              Myth vs. Fact Database
            </h2>
            <p className="text-xs text-muted-foreground">
              Debunking common misconceptions with verified oncology data guidelines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            
            {/* Myth 1 */}
            <div className="p-5 bg-rose-50/20 border border-pink-100/30 rounded-2xl space-y-2">
              <div className="flex items-start gap-2.5">
                <HelpCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Myth: Finding a lump means I have breast cancer.</h4>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    <strong className="text-emerald-600">Fact:</strong> Most breast lumps (about 80% to 85%) are benign, meaning they are non-cancerous cysts or fibroadenomas. However, any persistent new lump should be clinically evaluated immediately.
                  </p>
                </div>
              </div>
            </div>

            {/* Myth 2 */}
            <div className="p-5 bg-rose-50/20 border border-pink-100/30 rounded-2xl space-y-2">
              <div className="flex items-start gap-2.5">
                <HelpCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Myth: Only women with a family history get breast cancer.</h4>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    <strong className="text-emerald-600">Fact:</strong> Over 75% of breast cancer patients have no family history or known genetic mutations. Regular screening is critical for all women starting from age 40.
                  </p>
                </div>
              </div>
            </div>

            {/* Myth 3 */}
            <div className="p-5 bg-rose-50/20 border border-pink-100/30 rounded-2xl space-y-2">
              <div className="flex items-start gap-2.5">
                <HelpCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Myth: Men cannot develop breast cancer.</h4>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    <strong className="text-emerald-600">Fact:</strong> Men have breast tissue and can develop breast cancer, accounting for roughly 1% of all cases. Symptoms like lumps or skin changes in men require immediate review.
                  </p>
                </div>
              </div>
            </div>

            {/* Myth 4 */}
            <div className="p-5 bg-rose-50/20 border border-pink-100/30 rounded-2xl space-y-2">
              <div className="flex items-start gap-2.5">
                <HelpCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Myth: Mammograms cause breast cancer to spread.</h4>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    <strong className="text-emerald-600">Fact:</strong> A mammogram requires compression which is harmless. The low-dose radiation involved does not cause cancer to spread. Mammograms remain the gold standard for early cancer detection.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Clinical Disclaimer */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/50 flex gap-3 text-xs text-slate-500 max-w-4xl mx-auto leading-relaxed">
          <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
          <p>
            <strong>Medical Disclaimer:</strong> The information provided on this platform is for educational and campaign purposes only. It should not be used as a substitute for professional clinical advice, diagnosis, or treatment. Always consult with a licensed physician or oncologist regarding health concerns.
          </p>
        </div>
      </div>
    </div>
  );
}
