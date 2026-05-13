import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        "h-12 w-full rounded-full border border-stone bg-white/60 px-4 text-sm text-ink shadow-soft transition placeholder:text-ink/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8C9A84] focus-visible:ring-offset-2",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

export { Input };
