import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  message?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function LoadingSpinner({
  message,
  size = "md",
  className,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className={cn("flex flex-col items-center justify-center gap-3 py-12", className)}>
      <div className="relative">
        <div className={cn("rounded-full border-2 border-primary/20", sizeClasses[size])} />
        <Loader2
          className={cn(
            "absolute inset-0 animate-spin text-primary",
            sizeClasses[size]
          )}
        />
      </div>
      {message && (
        <p className="text-sm text-muted-foreground animate-pulse text-center max-w-xs">
          {message}
        </p>
      )}
    </div>
  );
}
