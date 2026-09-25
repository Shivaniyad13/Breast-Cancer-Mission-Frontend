"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import ApocanSection from "@/components/apocan-section";
import {
  Ribbon,
  ArrowRight,
  Sparkles,
  Activity,
  HeartHandshake,
  Phone,
  MessageCircle,
  ShieldCheck,
  Leaf,
  CheckCircle2,
  ArrowDown,
  Plus,
  Minus,
} from "lucide-react";

interface SuccessStory {
  id: string;
  orgName: string;
  orgPhoto: string;
  eventImage: string;
  beforeAfter: string;
  screenedCount: string;
  patientsHelped: string;
  eventsCount: string;
  quote: string;
  directorName: string;
}

const successStoriesData: SuccessStory[] = [
  {
    id: "ss-1",
    orgName: "Shagufta Ali's Breast Cancer Journey",
    orgPhoto: "/images/Cancer Patients.jpg",
    eventImage: "/images/Cancer Patients.jpg",
    beforeAfter:
      "Veteran actress Shagufta Ali privately battled Stage 3 breast cancer and underwent nine chemotherapy sessions. While fighting the disease, she also faced severe financial hardship, exhausting her savings and continuing her journey with remarkable courage and resilience.",
    screenedCount: "Stage 3 Diagnosis",
    patientsHelped: "9 Chemotherapy Sessions",
    eventsCount: "Recovered & Inspiring Thousands",
    quote:
      "Cancer tested my strength, but hope and determination kept me moving forward. Every patient deserves timely treatment, dignity, and support.",
    directorName: "Shagufta Ali – Actress & Breast Cancer Survivor",
  },
  {
    id: "ss-2",
    orgName: "AIIMS High-Risk Tumor Surgery Success",
    orgPhoto: "/images/Cancer Patients1.jpg",
    eventImage: "/images/Cancer Patients1.jpg",
    beforeAfter:
      "Doctors at AIIMS successfully performed a rare, high-risk surgery to remove a massive 20 kg tumor from a woman battling cancer. The successful operation gave the patient a new lease on life and highlighted the importance of timely diagnosis, expert surgical care, and access to advanced medical treatment.",
    screenedCount: "20 kg Tumor Removed",
    patientsHelped: "1 Life Saved",
    eventsCount: "High-Risk Surgery",
    quote:
      "This remarkable surgery demonstrates that with timely medical intervention, experienced specialists, and determination, even the most complex cancer cases can have positive outcomes.",
    directorName: "AIIMS Surgical Oncology Team",
  },
  {
    id: "ss-3",
    orgName: "Simran Sethi's Breast Cancer Journey",
    orgPhoto:
      "https://corporate.webassets.siemens-healthineers.com/262160eaeebed9a5/098254bafbc6/v/252df6659aad/siemens-healthineers_breast_cancer_simran_sethi_wall.jpg",
    eventImage:
      "https://corporate.webassets.siemens-healthineers.com/262160eaeebed9a5/098254bafbc6/v/252df6659aad/siemens-healthineers_breast_cancer_simran_sethi_wall.jpg",
    beforeAfter:
      "During the COVID-19 pandemic, Simran Sethi discovered a lump in her right breast. An initial ultrasound did not detect anything serious, delaying her diagnosis. After further testing and a repeat biopsy at AIIMS, she was diagnosed with Stage III invasive breast carcinoma that had already spread to the lymph nodes. Her journey highlights the life-saving importance of early screening, accurate diagnosis, and timely treatment.",
    screenedCount: "Stage III Breast Cancer",
    patientsHelped: "Delayed Diagnosis Identified",
    eventsCount: "Timely Treatment Initiated",
    quote:
      "My experience taught me that listening to your body and seeking timely medical care can make all the difference. Early diagnosis saves lives.",
    directorName: "Simran Sethi – Breast Cancer Survivor",
  },
];

// Horizontal steps for Section 7
const treatmentJourneySteps = [
  { step: "01", label: "Registration", desc: "Patient onboarding and profile setup." },
  { step: "02", label: "Assessment", desc: "Detailed document review & screening." },
  { step: "03", label: "Consultation", desc: "Virtual or clinic oncologist session." },
  { step: "04", label: "Care Planning", desc: "Custom clinical & supportive mapping." },
  { step: "05", label: "Active Monitoring", desc: "Regular follow-ups & dose balancing." },
  { step: "06", label: "Recovery Support", desc: "Post-care strength & rehabilitation." },
];

// Trust items for Section 6
const trustPillars = [
  { title: "Research Focus", desc: "Continuous research in Ayurvedic oncology formulations.", icon: ShieldCheck },
  { title: "Traditional Knowledge", desc: "Authentic formulations rooted in text-based herbology.", icon: Leaf },
  { title: "Quality Manufacturing", desc: "State-of-the-art GMP certified facilities.", icon: CheckCircle2 },
  { title: "Patient Support", desc: "Dedicated counselor lines and doctor connects.", icon: HeartHandshake },
  { title: "Natural Ingredients", desc: "Organically grown, pure herbs tested for heavy metals.", icon: Sparkles },
  { title: "Continuous Innovation", desc: "Evolving products for enhanced cellular absorption.", icon: Activity },
];

export default function TreatmentPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [activeStoryIdx, setActiveStoryIdx] = useState(0);

  const toggleFaq = (idx: number) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  useEffect(() => {
    const storyInterval = setInterval(() => {
      setActiveStoryIdx((prev) => (prev + 1) % successStoriesData.length);
    }, 9000);

    return () => {
      clearInterval(storyInterval);
    };
  }, []);

  return (
    <div className="flex-1 w-full bg-white text-slate-800 font-sans selection:bg-pink-100 selection:text-pink-700 overflow-x-hidden relative">

      {/* Decorative background blur blobs */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-pink-100/40 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse duration-[8000ms]" />
      <div className="absolute top-1/3 left-5 w-80 h-80 bg-rose-50/50 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-5 w-96 h-96 bg-pink-50/40 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* ================================================
          SECTION 1 - HERO (Clean Background)
         ================================================ */}
      <section className="relative min-h-[70vh] flex items-center bg-gradient-to-b from-rose-50/50 via-white to-white py-16 md:py-24 overflow-hidden border-b border-rose-100/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl relative z-10">
          <div className="space-y-6 text-center">

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-100/60 border border-pink-200/50 text-pink-700 text-xs font-bold uppercase tracking-wider shadow-sm"
            >
              <Ribbon className="h-3.5 w-3.5 text-primary animate-pulse" />
              Integrative Healthcare
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-800 leading-[1.1]"
            >
              Every Life Deserves <br />
              <span className="bg-gradient-to-r from-primary via-rose-500 to-pink-600 bg-clip-text text-transparent">
                Hope.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl mx-auto font-medium"
            >
              We believe every patient deserves compassionate care, advanced research, and continuous support throughout the treatment journey.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="pt-4 flex flex-wrap justify-center gap-4"
            >
              <a href="#treatment-overview">
                <Button className="bg-primary hover:bg-primary/95 text-white font-bold rounded-full shadow-md shadow-pink-100 hover:shadow-lg hover:shadow-pink-200/50 px-8 py-6 active:scale-95 transition-all text-sm tracking-wide cursor-pointer">
                  Learn About Treatment
                  <ArrowRight className="h-4 w-4 ml-1.5" />
                </Button>
              </a>
              <a href="#contact-specialist">
                <Button
                  variant="outline"
                  className="border-pink-200 text-primary hover:bg-pink-50/60 font-bold rounded-full px-8 py-6 active:scale-95 transition-all text-sm tracking-wide cursor-pointer"
                >
                  Talk to Our Expert
                </Button>
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================================================
          SECTION 4 - APOCAN TREATMENT SHOWCASE
         ================================================ */}
      <div id="treatment-overview">
        <ApocanSection />
      </div>

      {/* ================================================
          SECTION 6 - WHY PATIENTS TRUST US
         ================================================ */}
      <section className="py-20 md:py-28 bg-white border-t border-rose-100/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center space-y-3 max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-pink-100/60 text-primary text-xs font-bold uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" />
              Our Core Pillars
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight leading-tight">
              Why Patients Trust Us
            </h2>
            <p className="text-slate-500 text-sm sm:text-base font-medium">
              We stand for certified clinical rigor, safe manufacturing standards, and compassionate counselor availability.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trustPillars.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="p-6 rounded-3xl border border-pink-100/60 bg-gradient-to-br from-pink-500/5 to-rose-500/5 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="h-11 w-11 rounded-xl bg-white text-pink-500 flex items-center justify-center mb-4 shadow-sm border border-pink-100/40">
                    <Icon className="h-5.5 w-5.5" />
                  </div>
                  <h4 className="text-base font-extrabold text-slate-800 mb-2 font-heading">
                    {item.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================================================
          SECTION 7 - TREATMENT JOURNEY
         ================================================ */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-white to-rose-50/30 border-t border-rose-100/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl overflow-hidden">
          <div className="text-center space-y-3 max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-purple-50 text-purple-700 text-xs font-bold uppercase tracking-wider border border-purple-100/60">
              <Activity className="h-3.5 w-3.5" />
              Workflow Steps
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight leading-tight">
              Patient Journey Workflow
            </h2>
            <p className="text-slate-500 text-sm sm:text-base font-medium">
              Our structured step-by-step care timeline designed to keep patients informed and monitored throughout.
            </p>
          </div>

          {/* Horizontal Step Timeline on Desktop, stacked on Mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 relative">

            {/* Desktop Connective Line */}
            <div className="hidden lg:block absolute top-7 left-12 right-12 h-0.5 bg-pink-100 -z-10" />

            {treatmentJourneySteps.map((item, idx) => (
              <div
                key={idx}
                className="bg-white border border-pink-100/60 p-5 rounded-2xl flex flex-col justify-between space-y-4 hover:border-pink-200 hover:shadow-md transition-all shadow-sm"
              >
                <div className="flex justify-between items-center">
                  <span className="h-7 w-7 rounded-lg bg-primary text-white text-xs font-bold flex items-center justify-center">
                    {item.step}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest">
                    Step {idx + 1}
                  </span>
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-800 text-sm font-heading">
                    {item.label}
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================
          SECTION 7.5 - PATIENTS SUCCESS STORIES
         ================================================ */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-slate-900 to-purple-950 text-white relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-black/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl relative z-10">
          <div className="text-center space-y-3 max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-pink-500/10 text-pink-400 text-xs font-bold uppercase tracking-wider border border-pink-500/20">
              <HeartHandshake className="h-3.5 w-3.5" />
              Collaboration Impact
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Patients Success Stories
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-medium">
              Explore real-life patient success stories that showcase the impact of early detection, advanced medical treatment, and compassionate care. These journeys inspire hope, encourage regular screenings, and remind us that every life saved begins with awareness.
            </p>
          </div>

          {/* Autoplay Slider */}
          <div className="relative bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 md:p-12 pb-16 sm:pb-8 md:pb-12 backdrop-blur-lg shadow-2xl overflow-hidden min-h-[480px] flex items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStoryIdx}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full"
              >
                {/* Event Image */}
                <div className="lg:col-span-5 flex justify-center">
                  <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden border-3 border-pink-500/30 shadow-2xl group">
                    <img
                      src={successStoriesData[activeStoryIdx].eventImage}
                      alt={successStoriesData[activeStoryIdx].orgName}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                    <span className="absolute bottom-4 left-4 bg-pink-600 text-white font-bold text-xs uppercase px-3 py-1 rounded-md tracking-wider shadow-md font-heading">
                      Featured Impact
                    </span>
                  </div>
                </div>

                {/* Info & Quote */}
                <div className="lg:col-span-7 space-y-6 text-left">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-pink-400 uppercase tracking-widest font-heading">
                      Alliance Success
                    </p>
                    <h3 className="font-heading text-2xl font-extrabold text-white">
                      {successStoriesData[activeStoryIdx].orgName}
                    </h3>
                  </div>

                  <p className="text-slate-300 text-sm leading-relaxed font-medium">
                    {successStoriesData[activeStoryIdx].beforeAfter}
                  </p>

                  {/* Impact Badges */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                      {successStoriesData[activeStoryIdx].screenedCount}
                    </span>
                    <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-lg">
                      {successStoriesData[activeStoryIdx].patientsHelped}
                    </span>
                    <span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 rounded-lg">
                      {successStoriesData[activeStoryIdx].eventsCount}
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-pink-500/10 border-l-4 border-pink-500 italic">
                    <p className="text-pink-300 font-serif text-sm leading-relaxed">
                      &ldquo;{successStoriesData[activeStoryIdx].quote}&rdquo;
                    </p>
                    <p className="text-slate-400 text-xs font-bold font-heading mt-2 uppercase tracking-wide">
                      — {successStoriesData[activeStoryIdx].directorName}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Selector dots */}
            <div className="absolute bottom-6 right-6 md:right-12 flex items-center gap-2 z-20">
              {successStoriesData.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveStoryIdx(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    activeStoryIdx === idx ? "w-6 bg-pink-500" : "w-2 bg-white/30 hover:bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================
          SECTION 8 - FREQUENTLY ASKED QUESTIONS
         ================================================ */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <div className="text-center space-y-3 max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-pink-100/60 text-primary text-xs font-bold uppercase tracking-wider">
              <MessageCircle className="h-3.5 w-3.5" />
              Common Inquiries
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight leading-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-500 text-sm sm:text-base font-medium">
              Find instant answers to common patient queries about our treatment approach and products.
            </p>
          </div>

          {/* Custom Accordion */}
          <div className="bg-white/80 border border-pink-100/60 rounded-3xl p-5 sm:p-8 shadow-sm space-y-4">
            {[
              {
                q: "Who should consult before taking this product?",
                a: "Any patient diagnosed with breast cancer or undergoing active clinical medical treatments (chemotherapy, radiation therapy, immunotherapy) must consult their oncologist before integrating Advance Apocan.",
              },
              {
                q: "Can it be taken alongside conventional medical treatment?",
                a: "Advanced Apocan is designed as a supportive wellness formulation. However, we advise patients to share our ingredient sheet with their licensed physician to structure appropriate dosage timing and avoid potential metabolic cross-reactions.",
              },
              {
                q: "How should it be used?",
                a: "Usage must be strictly guided by a registered Ayurvedic practitioner or physician. Standard support dosages typically involve taking the designated tablets/liquids post-meals with warm water twice a day, or as indicated on the prescription.",
              },
              {
                q: "What are the storage instructions?",
                a: "Store the products in a dry, cool environment away from direct exposure to solar heat or humidity. Secure the containers tightly after opening, and store safely out of reach of children.",
              },
              {
                q: "What are the important precautions?",
                a: "If you observe any discomfort, nausea, skin rashes, or metabolic changes upon intake, immediately halt use and report details to a medical specialist. Do not exceed the advised daily intake thresholds.",
              },
            ].map((item, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="border-b border-slate-100 last:border-0 pb-4 last:pb-0 pt-3 first:pt-0"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex justify-between items-center text-left py-2 font-heading font-bold text-sm sm:text-base text-slate-800 hover:text-primary transition-colors cursor-pointer select-none outline-none"
                  >
                    <span>{item.q}</span>
                    <span className="text-slate-400 shrink-0 ml-4">
                      {isOpen ? (
                        <div className="p-1 rounded-full bg-pink-100 text-pink-600">
                          <Minus className="h-4 w-4" />
                        </div>
                      ) : (
                        <div className="p-1 rounded-full bg-white text-slate-400 border border-slate-200">
                          <Plus className="h-4 w-4" />
                        </div>
                      )}
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed pt-2.5 pr-6 font-medium">
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================================================
          SECONDARY PAGES FOOTER LINKS
         ================================================ */}
      <section className="bg-gradient-to-b from-white to-rose-50/30 py-12 border-t border-rose-100/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Ribbon className="h-5 w-5 text-pink-500 animate-pulse" />
            <span className="font-heading font-bold text-sm text-slate-800">
              Healthcare Core Values:
            </span>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-xs font-semibold text-slate-500">
            <span className="hover:text-pink-600 transition-colors cursor-pointer">Hope</span>
            <span>&bull;</span>
            <span className="hover:text-pink-600 transition-colors cursor-pointer">Research</span>
            <span>&bull;</span>
            <span className="hover:text-pink-600 transition-colors cursor-pointer">Compassion</span>
            <span>&bull;</span>
            <span className="hover:text-pink-600 transition-colors cursor-pointer">Innovation</span>
            <span>&bull;</span>
            <span className="hover:text-pink-600 transition-colors cursor-pointer">Patient Care</span>
          </div>
        </div>
      </section>

    </div>
  );
}