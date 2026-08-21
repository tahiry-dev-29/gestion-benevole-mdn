import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const progressVariants = cva(
  "relative h-2 w-full overflow-hidden rounded-full bg-secondary",
  {
    variants: {
      variant: {
        default: "bg-secondary",
        destructive: "bg-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface ProgressProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof progressVariants> {
  value: number;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(progressVariants({ className }), props)}
      {...props}
    >
      <div
        className="h-full w-full flex-1 bg-primary text-xs font-medium text-primary-foreground transition-all duration-500"
        style={{ transform: `translateX(${100 - (value || 0)}%)` }}
      />
    </div>
  ),
);
Progress.displayName = "Progress";

export { Progress, progressVariants };
