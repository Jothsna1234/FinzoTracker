// "use client"

// import * as React from "react"
// import * as ProgressPrimitive from "@radix-ui/react-progress"

// import { cn } from "@/lib/utils"

// function Progress({
//   className,
//   value,extraStyles,
//   ...props
// }: React.ComponentProps<typeof ProgressPrimitive.Root>) {
//   return (
//     <ProgressPrimitive.Root
//       data-slot="progress"
//       className={cn(
//         "relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
//         className
//       )}
//       {...props}
//     >
//       <ProgressPrimitive.Indicator
//         // data-slot="progress-indicator"
//         className={`h-full w-full flex-1 bg-primary transition-all ${extraStyles}`}
//         style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
//       />
//     </ProgressPrimitive.Root>
//   ));
// Progress.displayName = ProgressPrimitive.Root.displayName;
// export { Progress };
"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

const Progress = React.forwardRef(
  ({ className, value, extraStyles, ...props }, ref) => (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={`h-full w-full flex-1 transition-all ${extraStyles}`}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  )
);
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
