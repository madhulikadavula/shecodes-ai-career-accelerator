import { useState, useCallback } from "react";
import { RefreshCw, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import LoadingSpinner from "@/components/LoadingSpinner";
import DifficultyBadge from "@/components/DifficultyBadge";
import { useActor } from "@/hooks/useActor";
import { useApiKey } from "@/context/ApiKeyContext";
import { parseGeminiResponse, extractJSONWithFallback } from "@/utils/gemini";
import { toast } from "sonner";

interface Problem {
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
}

interface Contest {
  wednesday: Problem[];
  sunday: Problem[];
}

const FALLBACK_CONTEST: Contest = {
  wednesday: [
    { title: "Two Sum", difficulty: "Easy", description: "Given an array of integers nums and an integer target, return indices of the two numbers that add up to target." },
    { title: "Valid Parentheses", difficulty: "Easy", description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid." },
    { title: "Longest Substring Without Repeating Characters", difficulty: "Medium", description: "Given a string s, find the length of the longest substring without repeating characters." },
    { title: "Container With Most Water", difficulty: "Medium", description: "Given n non-negative integers representing heights, find two lines that together with the x-axis form a container that holds the most water." },
    { title: "Merge K Sorted Lists", difficulty: "Hard", description: "You are given an array of k linked-lists, each sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it." },
  ],
  sunday: [
    { title: "Palindrome Number", difficulty: "Easy", description: "Given an integer x, return true if x is a palindrome, and false otherwise." },
    { title: "Climbing Stairs", difficulty: "Easy", description: "You are climbing a staircase. It takes n steps to reach the top. Each time you can climb 1 or 2 steps. How many distinct ways can you climb to the top?" },
    { title: "Product of Array Except Self", difficulty: "Medium", description: "Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i]." },
    { title: "Word Search", difficulty: "Medium", description: "Given an m x n grid of characters board and a string word, return true if word exists in the grid." },
    { title: "Trapping Rain Water", difficulty: "Hard", description: "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining." },
  ],
};

interface ProblemCardProps {
  problem: Problem;
  index: number;
}

function ProblemCard({ problem, index }: ProblemCardProps) {
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loadingExplanation, setLoadingExplanation] = useState(false);
  const [localExpanded, setLocalExpanded] = useState(false);
  const { actor, isFetching } = useActor();
  const { apiKey, setShowModal } = useApiKey();

  const handleLocalExplain = async () => {
    if (explanation) {
      setLocalExpanded((v) => !v);
      return;
    }
    if (!apiKey) {
      setShowModal(true);
      return;
    }
    if (!actor || isFetching) return;

    setLoadingExplanation(true);
    try {
      const raw = await actor.askAIRaw(apiKey, problem.title, problem.description);
      const text = parseGeminiResponse(raw);
      setExplanation(text);
      setLocalExpanded(true);
    } catch {
      toast.error("Failed to get explanation. Please check your API key.");
    } finally {
      setLoadingExplanation(false);
    }
  };

  return (
    <Card className="card-glow transition-all duration-300 overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <span className="shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center mt-0.5">
              {index + 1}
            </span>
            <h3 className="font-semibold text-card-foreground text-sm leading-snug">
              {problem.title}
            </h3>
          </div>
          <DifficultyBadge difficulty={problem.difficulty} />
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-3">
        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
          {problem.description}
        </p>

        <Button
          size="sm"
          onClick={handleLocalExplain}
          disabled={loadingExplanation || isFetching}
          className="w-full btn-primary border-0 text-xs gap-1.5"
        >
          {loadingExplanation ? (
            <>
              <RefreshCw className="w-3 h-3 animate-spin" />
              Getting explanation...
            </>
          ) : explanation ? (
            <>
              {localExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              {localExpanded ? "Hide" : "Show"} AI Explanation
            </>
          ) : (
            <>
              <Sparkles className="w-3 h-3" />
              Get AI Explanation
            </>
          )}
        </Button>

        {explanation && localExpanded && (
          <div className="bg-primary/5 border border-primary/10 rounded-xl p-4">
            <div className="flex items-center gap-1.5 text-primary text-xs font-semibold mb-2">
              <Sparkles className="w-3 h-3" />
              AI Explanation
            </div>
            <p className="text-foreground text-xs leading-relaxed whitespace-pre-wrap">
              {explanation}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface ContestSectionProps {
  title: string;
  emoji: string;
  problems: Problem[];
  color: string;
}

function ContestSection({ title, emoji, problems, color }: ContestSectionProps) {
  if (!problems || problems.length === 0) {
    return (
      <div>
        <div className={`flex items-center gap-3 mb-5 px-4 py-3 rounded-xl ${color}`}>
          <span className="text-2xl" role="img" aria-label={title}>{emoji}</span>
          <div>
            <h2 className="font-display text-xl text-foreground">{title}</h2>
            <p className="text-muted-foreground text-xs">No problems available</p>
          </div>
        </div>
        <div className="text-center py-8 text-muted-foreground text-sm">
          No problems available for this contest session.
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className={`flex items-center gap-3 mb-5 px-4 py-3 rounded-xl ${color}`}>
        <span className="text-2xl" role="img" aria-label={title}>{emoji}</span>
        <div>
          <h2 className="font-display text-xl text-foreground">{title}</h2>
          <p className="text-muted-foreground text-xs">{problems.length} problems</p>
        </div>
      </div>

      <div className="space-y-4">
        {(problems ?? []).map((problem, i) => (
          <ProblemCard
            key={`${problem.title}-${i}`}
            problem={problem}
            index={i}
          />
        ))}
      </div>
    </div>
  );
}

export default function ContestPage() {
  const { actor, isFetching } = useActor();
  const { apiKey, setShowModal, hasKey } = useApiKey();
  const [contest, setContest] = useState<Contest | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateContest = useCallback(async () => {
    if (!apiKey) {
      setShowModal(true);
      return;
    }
    if (!actor || isFetching) return;

    setLoading(true);
    setError(null);
    try {
      const raw = await actor.generateContestRaw(apiKey);
      const text = parseGeminiResponse(raw);
      const data = extractJSONWithFallback<Contest>(text, FALLBACK_CONTEST);
      setContest(data);
    } catch {
      setError("Failed to generate contest. Please check your API key and try again.");
    } finally {
      setLoading(false);
    }
  }, [actor, isFetching, apiKey, setShowModal]);

  return (
    <main className="pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl md:text-5xl text-foreground mb-3">
            Weekly <span className="gradient-text italic">Contest</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            AI-generated programming challenges refreshed every week — sharpen your skills at every level.
          </p>
        </div>

        {/* Generate button */}
        <div className="flex justify-center mb-10">
          <Button
            onClick={generateContest}
            disabled={loading || isFetching || !hasKey}
            className="btn-primary border-0 px-8 py-3 text-base gap-2"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Generating Problems...
              </>
            ) : contest ? (
              <>
                <RefreshCw className="w-4 h-4" />
                Regenerate Contest
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate This Week's Contest
              </>
            )}
          </Button>
        </div>

        {/* No key warning */}
        {!hasKey && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 text-3xl" role="img" aria-label="API key">
              <span aria-hidden="true">🔑</span>
            </div>
            <p className="text-muted-foreground mb-4">
              Add your Gemini API key to generate contest problems.
            </p>
            <Button onClick={() => setShowModal(true)} className="btn-primary border-0">
              Add API Key
            </Button>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <LoadingSpinner
            message="Generating fresh programming problems with AI… this may take up to 30 seconds."
            size="lg"
          />
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-6 text-center">
            <p className="text-destructive font-medium mb-3">{error}</p>
            <Button variant="outline" onClick={generateContest} size="sm">
              Try Again
            </Button>
          </div>
        )}

        {/* Contest columns */}
        {contest && !loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ContestSection
              title="Wednesday Contest"
              emoji="📅"
              problems={contest.wednesday}
              color="bg-violet-50 border border-violet-100"
            />
            <ContestSection
              title="Sunday Contest"
              emoji="🌟"
              problems={contest.sunday}
              color="bg-pink-50 border border-pink-100"
            />
          </div>
        )}

        {/* Empty — no contest yet */}
        {!contest && !loading && !error && hasKey && (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-6 text-4xl" role="img" aria-label="Trophy">
              <span aria-hidden="true">🏆</span>
            </div>
            <h3 className="font-display text-2xl text-foreground mb-2">Ready to compete?</h3>
            <p className="text-muted-foreground">
              Click the button above to generate this week's contest problems.
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
