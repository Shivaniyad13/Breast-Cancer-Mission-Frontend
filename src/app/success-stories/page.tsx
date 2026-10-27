import Link from "next/link";
import { getApprovedSuccessStories } from "@/app/actions/successStories";
import SurvivorStoryCardSection from "@/components/layout/SurvivorStoryCardSection";
import { Button } from "@/components/ui/button";
import { Heart, Sparkles, ArrowLeft, ArrowRight, ShieldCheck, MapPin } from "lucide-react";

export const revalidate = 0; // Dynamic real-time fetch

export default async function SuccessStoriesPage() {
  const result = await getApprovedSuccessStories();
  const stories = result.success && result.stories ? result.stories : [];

  return (
    <div className="min-h-screen bg-slate-50/50 pb-8">
      {/* Header Banner */}
      <section className="bg-gradient-to-b from-pink-50 via-white to-slate-50/50 py-8 border-b border-pink-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 max-w-3xl">
          <Link
            href="/"
            className="inline-flex items-center text-xs sm:text-sm font-semibold text-pink-600 hover:text-pink-700 transition-colors gap-1.5"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>

          <div className="flex justify-center">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-pink-100 text-pink-700 text-xs font-bold ">
              <Sparkles className="h-3.5 w-3.5" />
              Community Triumphs &amp; Courage
            </span>
          </div>

          <h1 className="font-heading font-bold tracking-tight text-slate-900 leading-tight text-3xl sm:text-4xl">
            Cancer Survivor &amp; Fighter Stories
          </h1>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Real journeys from brave fighters and supportive family members who detected early, underwent timely treatment, and overcame breast cancer.
          </p>

          <div className="pt-2">
            <Link href="/success-stories/share">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/95 text-white font-bold rounded-xl shadow-md px-6 sm:px-8 h-12 cursor-pointer"
              >
                Share Your Story <Heart className="ml-2 h-4 w-4 fill-white text-white " />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Story Section (Image 2 style) */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <SurvivorStoryCardSection initialStories={stories} />
      </div>

      {/* All Stories Grid if there are multiple stories */}
      {stories.length > 1 && (
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              All Community Stories
            </h2>
            <p className="text-sm text-slate-500">
              Browse through all survivor journeys shared by patients and families.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story: any) => (
              <div
                key={story.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-600 ">
                      {story.roleType || "Survivor"}
                    </span>
                    <span className="text-slate-400 flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {story.city}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 line-clamp-2">
                    {story.storyTitle}
                  </h3>

                  <p className="text-xs text-slate-500 font-medium">
                    By <strong className="text-slate-800">{story.fullName}</strong>
                    {story.age ? ` (${story.age} Yrs)` : ""}
                  </p>

                  <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                    {story.completeStory}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href={`/success-stories/${story.id}`}
                    className="text-emerald-700 hover:text-emerald-800 font-bold text-xs inline-flex items-center gap-1"
                  >
                    Read full story &gt;
                  </Link>

                  <span className="text-[11px] text-slate-400">
                    Verified Story
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
