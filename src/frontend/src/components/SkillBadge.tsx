import { cn } from "@/lib/utils";

const SKILL_COLORS: Record<string, string> = {
  JavaScript: "bg-yellow-100 text-yellow-800 border border-yellow-200",
  TypeScript: "bg-blue-100 text-blue-800 border border-blue-200",
  Python: "bg-sky-100 text-sky-800 border border-sky-200",
  React: "bg-cyan-100 text-cyan-800 border border-cyan-200",
  "Machine Learning": "bg-purple-100 text-purple-800 border border-purple-200",
  SQL: "bg-orange-100 text-orange-800 border border-orange-200",
  Cloud: "bg-indigo-100 text-indigo-800 border border-indigo-200",
  DevOps: "bg-slate-100 text-slate-800 border border-slate-200",
  "UI/UX": "bg-pink-100 text-pink-800 border border-pink-200",
  Java: "bg-red-100 text-red-800 border border-red-200",
  "Data Analysis": "bg-teal-100 text-teal-800 border border-teal-200",
  "Data Science": "bg-violet-100 text-violet-800 border border-violet-200",
  "Node.js": "bg-green-100 text-green-800 border border-green-200",
  "Go": "bg-cyan-100 text-cyan-900 border border-cyan-200",
  "Rust": "bg-amber-100 text-amber-900 border border-amber-200",
};

const DEFAULT_COLOR = "bg-primary/10 text-primary border border-primary/20";

interface SkillBadgeProps {
  skill: string;
  className?: string;
}

export default function SkillBadge({ skill, className }: SkillBadgeProps) {
  const colorClass = SKILL_COLORS[skill] ?? DEFAULT_COLOR;

  return (
    <span
      className={cn(
        "inline-block px-2.5 py-0.5 rounded-full text-xs font-medium",
        colorClass,
        className
      )}
    >
      {skill}
    </span>
  );
}
