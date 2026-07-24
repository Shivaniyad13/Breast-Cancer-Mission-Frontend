"use client";

import { useState } from "react";
import { submitFeedbackAction } from "@/app/actions/webinars";
import { Button } from "@/components/ui/button";
import { Star, CheckCircle, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";

interface WebinarFeedbackFormProps {
  webinarId: string;
  existingFeedback?: string | null;
  existingRating?: number | null;
}

export default function WebinarFeedbackForm({
  webinarId,
  existingFeedback,
  existingRating,
}: WebinarFeedbackFormProps) {
  const router = useRouter();
  const [rating, setRating] = useState<number>(existingRating || 0);
  const [feedback, setFeedback] = useState<string>(existingFeedback || "");
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [success, setSuccess] = useState(!!existingFeedback);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Please select a rating.");
      return;
    }

    setIsPending(true);
    try {
      const res = await submitFeedbackAction(webinarId, feedback, rating);
      if (res.success) {
        setSuccess(true);
        router.refresh();
      }
    } catch (e: any) {
      alert(e.message || "Failed to submit feedback.");
    } finally {
      setIsPending(false);
    }
  };

  if (success) {
    return (
      <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 text-xs flex items-start gap-2.5">
        <CheckCircle className="h-4.5 w-4.5 text-emerald-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-emerald-800">Feedback Submitted</p>
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className={`h-3 w-3 ${s <= rating ? "fill-amber-400 text-amber-400" : "text-slate-300"}`} />
            ))}
          </div>
          {feedback && <p className="text-slate-600 italic">"{feedback}"</p>}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-pink-50/20 border border-pink-100/50 rounded-2xl p-4 space-y-3.5 shadow-sm">
      <div className="flex items-center gap-1 text-xs text-primary font-bold">
        <MessageSquare className="h-3.5 w-3.5" /> Share Your Feedback
      </div>

      {/* Star Selector */}
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Rating:</span>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(null)}
              className="p-0.5 hover:scale-110 transition-transform cursor-pointer"
            >
              <Star
                className={`h-5 w-5 transition-colors ${
                  star <= (hoveredRating !== null ? hoveredRating : rating)
                    ? "fill-amber-400 text-amber-400"
                    : "text-slate-300"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Comments */}
      <textarea
        placeholder="How was the presentation? What did you learn?"
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        rows={2}
        className="w-full text-xs bg-white border border-border/80 rounded-xl px-2.5 py-1.5 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none text-slate-800"
      />

      <Button
        type="submit"
        disabled={isPending || rating === 0}
        className="w-full bg-primary hover:bg-primary/90 text-white font-bold text-[10px] uppercase py-1.5 h-auto rounded-xl"
      >
        {isPending ? "Submitting..." : "Submit Feedback"}
      </Button>
    </form>
  );
}
