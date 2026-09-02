import { auth } from "@/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Ribbon, ShieldAlert } from "lucide-react";
import QuizClient from "./QuizClient";

export const revalidate = 0; // Dynamic rendering to fetch fresh auth state

export default async function QuizPage() {
  const session = await auth();

  if (!session?.user) {
    return (
      <div className="min-h-[85vh] bg-gradient-to-tr from-pink-50 via-white to-rose-50/30 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/80 backdrop-blur-md rounded-3xl border border-pink-100 shadow-2xl p-8 text-center space-y-6">
          <div className="h-16 w-16 bg-pink-50 text-primary rounded-2xl flex items-center justify-center border border-pink-100 mx-auto animate-pulse">
            <Ribbon className="h-10 w-10" />
          </div>
          <div className="space-y-2">
            <h1 className="font-heading text-2xl font-black text-slate-800">
              Quiz Authentication Required
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed">
              To earn a verifiably signed, QR-coded certificate of excellence, you must be logged in as a volunteer or supporter on the campaign network.
            </p>
          </div>
          
          <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-100/50 text-amber-800 text-xs flex gap-2 text-left">
            <ShieldAlert className="h-5 w-5 shrink-0 text-amber-600" />
            <p>
              Your certificate will be cryptographically linked to your registered profile so it can be verified by employers or organizations.
            </p>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <Link href={`/login?callbackUrl=${encodeURIComponent("/learn/quiz")}`} className="w-full">
              <Button className="w-full bg-primary hover:bg-primary/95 text-white font-bold rounded-xl shadow-md py-2 h-auto text-sm transition-transform active:scale-[0.98]">
                Login to Continue
              </Button>
            </Link>
            <Link href="/register" className="w-full">
              <Button variant="outline" className="w-full border-pink-200 text-slate-700 hover:bg-pink-50 font-bold rounded-xl py-2 h-auto text-sm">
                Create an Account
              </Button>
            </Link>
            <Link href="/learn" className="text-xs text-muted-foreground hover:text-primary transition-colors hover:underline pt-2">
              ← Go back to Awareness Hub
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <QuizClient user={session.user} />;
}
