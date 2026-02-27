import { useState, useEffect, useCallback } from "react";
import { Sparkles, ChevronDown, ChevronUp, Check, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import LoadingSpinner from "@/components/LoadingSpinner";
import SkillBadge from "@/components/SkillBadge";
import { useActor } from "@/hooks/useActor";
import { useApiKey } from "@/context/ApiKeyContext";
import { parseGeminiResponse, extractJSONWithFallback } from "@/utils/gemini";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const ROLES = ["Software Engineer", "Frontend Developer", "Data Analyst"];

interface RoadmapDay {
  day: number;
  title: string;
  tasks: string[];
}

interface PrepPlan {
  role: string;
  requiredSkills: string[];
  hiringProcess: string[];
  questionTypes: string[];
  roadmap: RoadmapDay[];
}

const FALLBACK_PREP_PLAN: PrepPlan = {
  role: "Software Engineer",
  requiredSkills: ["Data Structures", "Algorithms", "System Design", "JavaScript/TypeScript", "React", "Node.js", "SQL", "Git"],
  hiringProcess: [
    "Online Application & Resume Screening",
    "Online Assessment (DSA coding test, 60–90 min)",
    "Technical Phone Screen (1 coding problem + background)",
    "Virtual Onsite: 3–4 rounds (2 coding, 1 system design, 1 behavioral)",
    "Offer & Negotiation",
  ],
  questionTypes: [
    "Arrays, strings, and hash maps",
    "Trees and graph traversal (BFS/DFS)",
    "Dynamic programming and recursion",
    "System design (scalability, caching, databases)",
    "Behavioral questions (STAR method)",
    "Object-oriented design",
  ],
  roadmap: [
    { day: 1, title: "Arrays & Strings", tasks: ["Review array operations and complexity", "Solve 3 easy array problems on LeetCode", "Practice sliding window technique", "Review string manipulation methods"] },
    { day: 2, title: "Hash Maps & Sets", tasks: ["Understand hash map internals", "Solve 3 medium hash map problems", "Practice two-pointer technique", "Review set operations"] },
    { day: 3, title: "Linked Lists & Stacks", tasks: ["Implement a linked list from scratch", "Solve reverse linked list variants", "Practice stack/queue problems", "Review monotonic stack pattern"] },
    { day: 4, title: "Trees & Binary Search", tasks: ["Review tree traversal (DFS, BFS)", "Solve binary search tree problems", "Practice level-order traversal", "Understand balanced trees"] },
    { day: 5, title: "Graphs", tasks: ["Review graph representations", "Solve BFS and DFS problems", "Practice topological sort", "Review shortest path algorithms"] },
    { day: 6, title: "Dynamic Programming", tasks: ["Understand memoization vs tabulation", "Solve classic DP problems (knapsack, LCS)", "Practice 1D DP problems", "Review DP on strings"] },
    { day: 7, title: "System Design Basics", tasks: ["Study scalability principles", "Review load balancing and caching", "Understand database sharding", "Practice designing a URL shortener"] },
    { day: 8, title: "Behavioral Prep", tasks: ["Write 5 STAR stories from past experience", "Practice leadership and conflict scenarios", "Review company values", "Prepare questions to ask interviewer"] },
    { day: 9, title: "Mock Interviews", tasks: ["Complete 2 timed mock coding interviews", "Practice explaining thought process aloud", "Review any weak topics identified", "Do a system design mock"] },
    { day: 10, title: "Final Review", tasks: ["Review all major patterns cheat sheet", "Do 5 mixed-difficulty problems", "Review your STAR stories", "Prepare day-of logistics and mindset"] },
  ],
};

interface DayCardProps {
  day: RoadmapDay;
  locked?: boolean;
  onComplete?: (dayNum: number, complete: boolean) => void;
}

function DayCard({ day, locked = false, onComplete }: DayCardProps) {
  const [open, setOpen] = useState(day.day <= 2 && !locked);
  const [checked, setChecked] = useState<Record<number, boolean>>({});

  const allDone = day.tasks.length > 0 && day.tasks.every((_, i) => checked[i]);
  const progress = day.tasks.length > 0
    ? Math.round((Object.values(checked).filter(Boolean).length / day.tasks.length) * 100)
    : 0;

  useEffect(() => {
    onComplete?.(day.day, allDone);
  }, [allDone, day.day, onComplete]);

  const handleToggle = () => {
    if (locked) {
      toast.error(`Complete Day ${day.day - 1} before unlocking this day.`);
      return;
    }
    setOpen((v) => !v);
  };

  return (
    <div className={cn(
      "border rounded-xl overflow-hidden transition-all duration-200",
      allDone ? "border-green-200 bg-green-50/50" : "border-border bg-card",
      locked ? "opacity-60" : ""
    )}>
      <button
        type="button"
        onClick={handleToggle}
        className={cn(
          "w-full flex items-center justify-between px-5 py-4 text-left transition-colors",
          locked ? "cursor-not-allowed" : "hover:bg-muted/40"
        )}
      >
        <div className="flex items-center gap-3">
          <span className={cn(
            "w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0",
            allDone ? "bg-green-500 text-white" : locked ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"
          )}>
            {allDone ? "✓" : locked ? <Lock className="w-4 h-4" /> : day.day}
          </span>
          <div className="min-w-0">
            <p className={cn("font-semibold text-sm", locked ? "text-muted-foreground" : "text-foreground")}>{day.title}</p>
            <p className="text-muted-foreground text-xs">
              {locked ? `Complete Day ${day.day - 1} to unlock` : `${day.tasks.length} tasks · ${progress}% complete`}
            </p>
          </div>
        </div>
        {locked ? (
          <Lock className="w-4 h-4 text-muted-foreground shrink-0" />
        ) : open ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
        )}
      </button>

      {open && !locked && (
        <div className="px-5 pb-4 space-y-2 border-t border-border/50">
          {day.tasks.map((task, ti) => {
            const taskId = `day${day.day}-task${ti}`;
            return (
              <label
                key={`day${day.day}-task${ti}`}
                htmlFor={taskId}
                className={cn(
                  "flex items-start gap-3 py-2 cursor-pointer group",
                  checked[ti] ? "opacity-70" : ""
                )}
              >
                <div className="relative w-5 h-5 shrink-0 mt-0.5">
                  <input
                    type="checkbox"
                    id={taskId}
                    checked={!!checked[ti]}
                    onChange={() => setChecked((prev) => ({ ...prev, [ti]: !prev[ti] }))}
                    className="sr-only"
                  />
                  <div
                    className={cn(
                      "w-5 h-5 rounded border-2 flex items-center justify-center transition-all",
                      checked[ti]
                        ? "bg-green-500 border-green-500"
                        : "border-border group-hover:border-primary"
                    )}
                  >
                    {checked[ti] && <Check className="w-3 h-3 text-white" />}
                  </div>
                </div>
                <span
                  className={cn(
                    "text-sm text-foreground leading-relaxed",
                    checked[ti] ? "line-through text-muted-foreground" : ""
                  )}
                >
                  {task}
                </span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function PrepPage() {
  const { actor, isFetching } = useActor();
  const { apiKey, setShowModal, hasKey } = useApiKey();
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [plan, setPlan] = useState<PrepPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completedDays, setCompletedDays] = useState<Set<number>>(new Set());

  const handleDayComplete = useCallback((dayNum: number, complete: boolean) => {
    setCompletedDays((prev) => {
      const next = new Set(prev);
      if (complete) next.add(dayNum); else next.delete(dayNum);
      return next;
    });
  }, []);

  const handleGenerate = async () => {
    if (!selectedRole) {
      toast.error("Please select a role first.");
      return;
    }
    if (!apiKey) {
      setShowModal(true);
      return;
    }
    if (!actor || isFetching) return;

    setLoading(true);
    setError(null);
    setCompletedDays(new Set());
    try {
      const raw = await actor.generatePrepPlanRaw(apiKey, selectedRole);
      const text = parseGeminiResponse(raw);
      const data = extractJSONWithFallback<PrepPlan>(text, FALLBACK_PREP_PLAN);
      setPlan(data);
    } catch {
      setError("Failed to generate prep plan. Using sample data instead.");
      setPlan(FALLBACK_PREP_PLAN);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl md:text-5xl text-foreground mb-3">
            Internship <span className="gradient-text italic">Prep</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Get a personalized 10-day preparation roadmap powered by AI for your target role.
          </p>
        </div>

        {/* Role selector */}
        <Card className="card-glow mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground mb-2">Select your target role</p>
                <Select onValueChange={setSelectedRole} value={selectedRole}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a role..." />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button
                  onClick={handleGenerate}
                  disabled={loading || isFetching || !selectedRole || !hasKey}
                  className="btn-primary border-0 gap-2 w-full sm:w-auto"
                >
                  {loading ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-pulse" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Generate Plan
                    </>
                  )}
                </Button>
              </div>
            </div>

            {!hasKey && (
              <p className="text-sm text-muted-foreground mt-3">
                <button type="button" className="text-primary hover:underline" onClick={() => setShowModal(true)}>
                  Add your API key
                </button>{" "}
                to generate a prep plan.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Error banner */}
        {error && !loading && (
          <div className="mb-6 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-5 py-4">
            <span className="text-amber-500 text-lg shrink-0" role="img" aria-label="Warning">⚠️</span>
            <p className="text-amber-800 text-sm leading-relaxed">
              Could not connect to AI. Showing sample prep plan.
            </p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <LoadingSpinner
            message="Generating your personalized prep plan… this may take up to 30 seconds."
            size="lg"
          />
        )}

        {/* Plan sections */}
        {plan && !loading && (
          <div className="space-y-8 animate-fade-up">
            {/* Role badge */}
            <div className="flex items-center gap-3 bg-primary/8 border border-primary/15 rounded-xl px-5 py-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-xl" role="img" aria-label="Briefcase">
                <span aria-hidden="true">💼</span>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Prep plan for</p>
                <p className="font-semibold text-foreground">{plan.role}</p>
              </div>
            </div>

            {/* Required Skills */}
            <Card className="card-glow">
              <CardHeader>
                <CardTitle className="font-display text-xl flex items-center gap-2">
                  <span className="text-xl" role="img" aria-label="Skills">⚡</span>
                  Required Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {(plan.requiredSkills ?? []).map((skill) => (
                    <SkillBadge key={skill} skill={skill} />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Hiring Process */}
            <Card className="card-glow">
              <CardHeader>
                <CardTitle className="font-display text-xl flex items-center gap-2">
                  <span className="text-xl" role="img" aria-label="Process">🗺️</span>
                  Hiring Process
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3">
                  {(plan.hiringProcess ?? []).map((step, i) => (
                    <li key={`step-${i}-${step.slice(0, 15)}`} className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span className="text-sm text-foreground leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>

            {/* Question Types */}
            <Card className="card-glow">
              <CardHeader>
                <CardTitle className="font-display text-xl flex items-center gap-2">
                  <span className="text-xl" role="img" aria-label="Questions">❓</span>
                  Common Question Types
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {(plan.questionTypes ?? []).map((qt, i) => (
                    <li key={`qt-${i}-${qt.slice(0, 15)}`} className="flex items-start gap-2 text-sm text-foreground">
                      <span className="text-primary mt-1">›</span>
                      {qt}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* 10-Day Roadmap */}
            <div>
              <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-2">
                <span className="text-2xl" role="img" aria-label="Roadmap">📅</span>
                10-Day Roadmap
              </h2>
              <div className="space-y-3">
                {(plan.roadmap ?? []).map((day) => (
                  <DayCard
                    key={`day-${day.day}`}
                    day={day}
                    locked={day.day > 1 && !completedDays.has(day.day - 1)}
                    onComplete={handleDayComplete}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!plan && !loading && (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-6 text-4xl" role="img" aria-label="Briefcase">
              <span aria-hidden="true">💼</span>
            </div>
            <h3 className="font-display text-2xl text-foreground mb-2">Ready to prepare?</h3>
            <p className="text-muted-foreground">
              Select your target role and click generate to get your personalized roadmap.
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="container mx-auto px-4 mt-16 text-center">
        <p className="text-muted-foreground text-sm">
          © 2026. Built with <span className="text-pink-500">♥</span> using{" "}
          <a href="https://caffeine.ai" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
            caffeine.ai
          </a>
        </p>
      </div>
    </main>
  );
}
