import { ExternalLink } from "lucide-react";
import type { WebinarLiveLink } from "@/lib/webinarLiveLinks";

interface WebinarLivePlatformLinksProps {
  links: WebinarLiveLink[];
  className?: string;
  compact?: boolean;
}

export default function WebinarLivePlatformLinks({
  links,
  className = "",
  compact = false,
}: WebinarLivePlatformLinksProps) {
  if (!links.length) return null;

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {links.map(({ platform, url }) => (
        <a
          key={platform}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary font-bold text-white transition-colors hover:bg-primary/90 ${
            compact ? "min-w-0 flex-1 px-2 py-2 text-[10px]" : "px-4 py-2.5 text-sm"
          }`}
        >
          {platform === "YouTube Live" ? "Watch on YouTube" : `Join ${platform}`}
          <ExternalLink className="h-3.5 w-3.5 shrink-0" />
        </a>
      ))}
    </div>
  );
}
