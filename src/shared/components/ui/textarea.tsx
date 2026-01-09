import * as React from "react"

import { cn } from "@/shared/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "h-11 border border-gray-400/40 focus-visible:border-gray-400 focus-visible:ring-0 bg-gray-500/5 focus:bg-background transition-all px-3 text-base text-foreground"
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
