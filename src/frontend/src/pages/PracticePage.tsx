import { useState } from "react";
import { Sparkles, CheckCircle, XCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useActor } from "@/hooks/useActor";
import { useApiKey } from "@/context/ApiKeyContext";
import { parseGeminiResponse, extractJSON } from "@/utils/gemini";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const PRESET_TOPICS = [
  "Arrays",
  "Strings",
  "Trees",
  "Dynamic Programming",
  "JavaScript",
  "Python",
  "SQL",
  "React",
  "Algorithms",
  "Data Structures",
];

interface MCQQuestion {
  question: string;
  options: string[];
  correct: number;
}

interface QuizData {
  questions: MCQQuestion[];
}

type QuizState = "topic" | "quiz" | "result";

export default function PracticePage() {
  const { actor, isFetching } = useActor();
  const { apiKey, setShowModal, hasKey } = useApiKey();

  const [quizState, setQuizState] = useState<QuizState>("topic");
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [customTopic, setCustomTopic] = useState("");
  const [questions, setQuestions] = useState<MCQQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(0);

  const activeTopic = customTopic.trim() || selectedTopic;

  const handleGenerate = async () => {
    if (!activeTopic) {
      toast.error("Please select or enter a topic first.");
      return;
    }
    if (!apiKey) {
      setShowModal(true);
      return;
    }
    if (!actor || isFetching) return;

    setLoading(true);
    try {
      const raw = await actor.generatePracticeRaw(apiKey, activeTopic);
      const text = parseGeminiResponse(raw);
      const data = extractJSON<QuizData>(text);
      setQuestions(data.questions);
      setAnswers({});
      setQuizState("quiz");
    } catch {
      toast.error("Failed to generate questions. Please check your API key and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length < questions.length) {
      toast.error("Please answer all questions before submitting.");
      return;
    }
    let correct = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.correct) correct++;
    });
    setScore(Math.round((correct / questions.length) * 100));
    setQuizState("result");
  };

  const handleReset = () => {
    setQuizState("topic");
    setAnswers({});
    setQuestions([]);
    setScore(0);
    setCustomTopic("");
  };

  const isEligible = score >= 75;

  return (
    <main className="pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl md:text-5xl text-foreground mb-3">
            Daily <span className="gradient-text italic">Practice</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Test your knowledge with AI-generated quizzes and find your ideal learning track.
          </p>
        </div>

        {/* Topic selection */}
        {quizState === "topic" && (
          <div className="space-y-6">
            <Card className="card-glow">
              <CardHeader>
                <CardTitle className="font-display text-xl">Choose a Topic</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Preset chips */}
                <div>
                  <p className="text-sm text-muted-foreground mb-3">Popular topics</p>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_TOPICS.map((topic) => (
                      <button
                        type="button"
                        key={topic}
                        onClick={() => {
                          setSelectedTopic(topic);
                          setCustomTopic("");
                        }}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border",
                          selectedTopic === topic && !customTopic
                            ? "btn-primary border-transparent"
                            : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                        )}
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom topic */}
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Or enter a custom topic</p>
                  <Input
                    placeholder="e.g., Binary Search, CSS Grid, REST APIs..."
                    value={customTopic}
                    onChange={(e) => {
                      setCustomTopic(e.target.value);
                      if (e.target.value) setSelectedTopic("");
                    }}
                    className="max-w-sm"
                  />
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={loading || isFetching || !activeTopic || !hasKey}
                  className="btn-primary border-0 gap-2 w-full sm:w-auto"
                >
                  {loading ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-pulse" />
                      Generating Questions...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Generate 5 Questions
                    </>
                  )}
                </Button>

                {!hasKey && (
                  <p className="text-sm text-muted-foreground">
                    <button type="button" className="text-primary hover:underline" onClick={() => setShowModal(true)}>
                      Add your API key
                    </button>{" "}
                    to generate questions.
                  </p>
                )}
              </CardContent>
            </Card>

            {loading && (
              <LoadingSpinner message="Crafting personalized questions on your topic…" size="md" />
            )}
          </div>
        )}

        {/* Quiz */}
        {quizState === "quiz" && (
          <div className="space-y-5">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-sm font-medium text-muted-foreground">Topic: </span>
                <span className="text-sm font-semibold text-primary">{activeTopic}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {Object.keys(answers).length}/{questions.length} answered
              </span>
            </div>

            {questions.map((q, qi) => (
              <Card key={`q-${qi}-${q.question.slice(0, 20)}`} className="card-glow">
                <CardContent className="pt-6">
                  <p className="font-semibold text-card-foreground mb-4 leading-snug">
                    <span className="text-primary font-bold mr-2">Q{qi + 1}.</span>
                    {q.question}
                  </p>
                  <RadioGroup
                    value={answers[qi]?.toString() ?? ""}
                    onValueChange={(val) =>
                      setAnswers((prev) => ({ ...prev, [qi]: parseInt(val) }))
                    }
                    className="space-y-2"
                  >
                    {q.options.map((opt, oi) => (
                      <div
                        key={`q${qi}-o${oi}-${opt.slice(0, 10)}`}
                        className={cn(
                          "flex items-start gap-3 px-4 py-3 rounded-xl border transition-all duration-200 cursor-pointer",
                          answers[qi] === oi
                            ? "bg-primary/8 border-primary/30"
                            : "bg-muted/40 border-border hover:border-primary/20"
                        )}
                      >
                        <RadioGroupItem
                          value={oi.toString()}
                          id={`q${qi}-o${oi}`}
                          className="mt-0.5"
                        />
                        <Label
                          htmlFor={`q${qi}-o${oi}`}
                          className="text-sm leading-relaxed cursor-pointer"
                        >
                          {opt}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>
            ))}

            <div className="flex gap-3 pt-2">
              <Button
                onClick={handleSubmit}
                className="btn-primary border-0 flex-1 py-3 text-base"
              >
                Submit Quiz
              </Button>
              <Button variant="outline" onClick={handleReset}>
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Results */}
        {quizState === "result" && (
          <div className="space-y-6">
            {/* Score card */}
            <Card className={cn("card-glow border-2", isEligible ? "border-green-200" : "border-amber-200")}>
              <CardContent className="pt-8 pb-8 text-center">
                <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold bg-gradient-to-br from-primary to-accent text-white">
                  {score}%
                </div>
                <h2 className="font-display text-2xl text-foreground mb-2">
                  {score >= 90 ? "Outstanding!" : score >= 75 ? "Great Job!" : score >= 50 ? "Keep Going!" : "Keep Practicing!"}
                </h2>
                <p className="text-muted-foreground text-sm mb-5">
                  You scored {score}% on {activeTopic}
                </p>
                <span
                  className={cn(
                    "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border",
                    isEligible
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  )}
                >
                  {isEligible ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Eligible for Advanced Track ✓
                    </>
                  ) : (
                    <>
                      <span className="w-4 h-4 text-base leading-none">📚</span>
                      Suggested: Intermediate Track
                    </>
                  )}
                </span>
              </CardContent>
            </Card>

            {/* Answers review */}
            <div className="space-y-4">
              <h3 className="font-display text-xl text-foreground">Review Answers</h3>
              {questions.map((q, qi) => {
                const userAnswer = answers[qi];
                const isCorrect = userAnswer === q.correct;

                return (
                  <Card key={`result-${qi}-${q.question.slice(0, 20)}`} className={cn("overflow-hidden", isCorrect ? "border-green-200" : "border-red-200")}>
                    <CardContent className="pt-5">
                      <div className="flex items-start gap-2 mb-3">
                        {isCorrect ? (
                          <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                        )}
                        <p className="font-medium text-card-foreground text-sm leading-snug">
                          {q.question}
                        </p>
                      </div>

                      <div className="space-y-1.5 pl-6">
                        {q.options.map((opt, oi) => (
                          <div
                            key={`result-q${qi}-o${oi}-${opt.slice(0, 10)}`}
                            className={cn(
                              "px-3 py-2 rounded-lg text-xs",
                              oi === q.correct
                                ? "bg-green-50 text-green-800 font-medium border border-green-200"
                                : oi === userAnswer && !isCorrect
                                  ? "bg-red-50 text-red-700 border border-red-200"
                                  : "text-muted-foreground"
                            )}
                          >
                            {oi === q.correct && "✓ "}
                            {oi === userAnswer && !isCorrect && "✗ "}
                            {opt}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Button onClick={handleReset} variant="outline" className="w-full gap-2">
              <RotateCcw className="w-4 h-4" />
              Try Another Topic
            </Button>
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
