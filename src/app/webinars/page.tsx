import { auth } from "@/auth";
import { getWebinars, getWebinarFilterMetadata } from "@/app/actions/webinars";
import WebinarFilters from "@/components/webinars/WebinarFilters";
import WebinarsGrid from "@/components/webinars/WebinarsGrid";
import { Video } from "lucide-react";

export const revalidate = 0; // Fresh listing every visit

interface WebinarsPageProps {
  searchParams: Promise<{
    search?: string;
    city?: string;
    category?: string;
    date?: string;
    mode?: "upcoming" | "past";
  }>;
}

export default async function WebinarsPage({ searchParams }: WebinarsPageProps) {
  const session = await auth();

  const resolvedParams = await searchParams;
  const filters = {
    search: resolvedParams.search || "",
    city: resolvedParams.city || "all",
    category: resolvedParams.category || "all",
    date: resolvedParams.date || "",
  };

  // Fetch webinars and filter options (fetch all public webinars so client can segregate tabs)
  const webinars = await getWebinars({ ...filters, mode: undefined } as any);
  const { cities, categories } = await getWebinarFilterMetadata();

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8 min-h-screen">
      {/* Page Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-pink-100 text-primary border border-pink-200 uppercase tracking-widest">
          <Video className="h-3 w-3 animate-pulse" /> Certified Learning & Events
        </span>
        <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-slate-805 tracking-tight">
          Breast Cancer Awareness <span className="text-primary bg-gradient-to-r from-primary to-rose-400 bg-clip-text text-transparent">Webinars</span>
        </h1>
        <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
          Join leading medical professionals, oncologists, and volunteers in live sessions. Attend at least 80% of any certified webinar to receive a verifiably signed attendance certificate.
        </p>
      </div>

      {/* Filter Control Box */}
      <WebinarFilters cities={cities} categories={categories} />

      {/* Animated Webinars Grid */}
      <WebinarsGrid webinars={webinars as any} currentUser={session?.user} />
    </div>
  );
}
