"use client";

import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

export default function PrintButton() {
  return (
    <Button
      onClick={() => window.print()}
      className="no-print bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-full px-5 py-2.5 text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md active:scale-95 transition-all"
    >
      <Printer className="h-4 w-4" /> Print / Save as PDF
    </Button>
  );
}
