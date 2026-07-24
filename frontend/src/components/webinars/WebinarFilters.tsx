"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Calendar, BookOpen, Clock } from "lucide-react";

interface WebinarFiltersProps {
  cities: string[];
  categories: string[];
}

export default function WebinarFilters({ cities, categories }: WebinarFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [city, setCity] = useState(searchParams.get("city") || "all");
  const [category, setCategory] = useState(searchParams.get("category") || "all");
  const [date, setDate] = useState(searchParams.get("date") || "");
  const [mode, setMode] = useState(searchParams.get("mode") || "upcoming");

  const applyFilters = (newParams?: { mode?: string }) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (search) params.set("search", search);
    else params.delete("search");

    if (city && city !== "all") params.set("city", city);
    else params.delete("city");

    if (category && category !== "all") params.set("category", category);
    else params.delete("category");

    if (date) params.set("date", date);
    else params.delete("date");

    const currentMode = newParams?.mode || mode;
    params.set("mode", currentMode);

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleClear = () => {
    setSearch("");
    setCity("all");
    setCategory("all");
    setDate("");
    setMode("upcoming");
    router.push(pathname);
  };

  const handleModeToggle = (selectedMode: string) => {
    setMode(selectedMode);
    applyFilters({ mode: selectedMode });
  };

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-pink-100 p-6 shadow-md space-y-6">
      {/* Toggle View Mode */}
      <div className="flex justify-between items-center border-b border-pink-50 pb-4">
        <div className="flex gap-2 p-1 bg-pink-50/50 border border-pink-100/50 rounded-xl">
          <button
            onClick={() => handleModeToggle("upcoming")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all uppercase tracking-wider ${
              mode === "upcoming"
                ? "bg-primary text-white shadow-sm"
                : "text-muted-foreground hover:text-primary"
            }`}
          >
            Upcoming Webinars
          </button>
          <button
            onClick={() => handleModeToggle("past")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all uppercase tracking-wider ${
              mode === "past"
                ? "bg-primary text-white shadow-sm"
                : "text-muted-foreground hover:text-primary"
            }`}
          >
            Past Library
          </button>
        </div>

        {isPending && (
          <span className="text-xs text-primary animate-pulse font-medium">Updating results...</span>
        )}
      </div>

      {/* Filter Inputs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Search className="h-3.5 w-3.5" /> Search
          </label>
          <input
            type="text"
            placeholder="Search title, speaker..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyFilters()}
            className="w-full text-sm bg-pink-50/20 border border-border/80 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 rounded-xl px-3 py-2 outline-none transition-all text-slate-800"
          />
        </div>

        {/* Category */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen className="h-3.5 w-3.5" /> Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full text-sm bg-pink-50/20 border border-border/80 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 rounded-xl px-3 py-2 outline-none transition-all text-slate-800"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* City */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" /> City
          </label>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full text-sm bg-pink-50/20 border border-border/80 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 rounded-xl px-3 py-2 outline-none transition-all text-slate-800"
          >
            <option value="all">All Cities</option>
            {cities.map((ct) => (
              <option key={ct} value={ct}>
                {ct}
              </option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" /> Specific Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full text-sm bg-pink-50/20 border border-border/80 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 rounded-xl px-3 py-2 outline-none transition-all text-slate-800"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2 pt-2">
        <Button
          variant="outline"
          onClick={handleClear}
          size="sm"
          className="border-pink-200 text-slate-700 hover:bg-pink-50 rounded-xl"
        >
          Reset Filters
        </Button>
        <Button
          onClick={() => applyFilters()}
          size="sm"
          className="bg-primary text-white hover:bg-primary/90 rounded-xl px-6"
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );
}
