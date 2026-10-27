import * as React from "react"
import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "flex min-h-[96px] w-full rounded-lg border border-input bg-white px-3 py-2.5 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-pink-400 focus-visible:ring-3 focus-visible:ring-pink-200/60 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
