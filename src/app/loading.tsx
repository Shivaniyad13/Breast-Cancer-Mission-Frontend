import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <main aria-busy="true" className="flex min-h-[45vh] flex-1 items-center justify-center px-4">
      <div role="status" className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
        <span>Loading page...</span>
      </div>
    </main>
  );
}