import { getArticleBySlugAction } from "@/app/actions/articles";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  BookOpen, Calendar, Clock, User, Stethoscope, 
  Building2, ShieldCheck, ArrowLeft, Bookmark 
} from "lucide-react";
import SingleArticleClient from "./SingleArticleClient";

export const revalidate = 0;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function SingleArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticleBySlugAction(slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-pink-50 via-white to-rose-50/30 py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8 relative">
        
        {/* Navigation back */}
        <Link href="/learn/articles">
          <Button variant="ghost" className="text-xs font-bold text-slate-600 hover:text-primary gap-1.5 p-0">
            <ArrowLeft className="h-4 w-4" /> Back to Awareness Articles
          </Button>
        </Link>

        <SingleArticleClient article={article} />

      </div>
    </div>
  );
}
