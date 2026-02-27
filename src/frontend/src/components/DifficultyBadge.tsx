import { cn } from "@/lib/utils";

type Difficulty = "Easy" | "Medium" | "Hard";

interface DifficultyBadgeProps {
  difficulty: Difficulty;
  className?: string;
}

const STYLES: Record<Difficulty, string> = {
  Easy: "bg-green-100 text-green-700 border border-green-200",
  Medium: "bg-amber-100 text-amber-700 border border-amber-200",
  Hard: "bg-red-100 text-red-700 border border-red-200",
};

const DOTS: Record<Difficulty, string> = {
  Easy: "bg-green-500",
  Medium: "bg-amber-500",
  Hard: "bg-red-500",
};

export default function DifficultyBadge({ difficulty, className }: DifficultyBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold",
        STYLES[difficulty],
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full", DOTS[difficulty])} />
      {difficulty}
    </span>
  );
}
