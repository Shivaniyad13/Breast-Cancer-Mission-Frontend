import { auth } from "@/auth";
import { getPublicArticlesAction } from "@/app/actions/articles";
import ArticlesClient from "./ArticlesClient";

export const revalidate = 0; // Dynamic rendering to fetch fresh articles & auth state

export default async function ArticlesPage() {
  const session = await auth();
  const articles = await getPublicArticlesAction();

  return (
    <div className="min-h-screen bg-gradient-to-tr from-pink-50 via-white to-rose-50/30 py-16 px-4 sm:px-6 lg:px-8">
      {/* Background blobs */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-pink-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-rose-200/25 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto relative">
        <ArticlesClient initialArticles={articles} user={session?.user || null} />
      </div>
    </div>
  );
}
