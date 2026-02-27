import { useMemo, useState } from "react";
import { ExternalLink, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LoadingSpinner from "@/components/LoadingSpinner";
import SkillBadge from "@/components/SkillBadge";
import { useActor } from "@/hooks/useActor";
import { JobType, type Opportunity } from "@/backend";
import { cn } from "@/lib/utils";

const SKILL_FILTERS = [
  "All",
  "JavaScript",
  "Python",
  "React",
  "Machine Learning",
  "SQL",
  "Cloud",
  "DevOps",
  "UI/UX",
  "Java",
];

type TypeFilter = "All" | "Internship" | "Full-time";

export default function OpportunitiesPage() {
  const { actor, isFetching } = useActor();

  const [skillFilter, setSkillFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("All");
  const [search, setSearch] = useState("");

  const { data: opportunities, isLoading, isError } = useQuery<Opportunity[]>({
    queryKey: ["opportunities"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getOpportunities();
    },
    enabled: !!actor && !isFetching,
    staleTime: 5 * 60 * 1000,
  });

  const filtered = useMemo(() => {
    if (!opportunities) return [];
    return opportunities.filter((opp) => {
      const matchSkill =
        skillFilter === "All" ||
        opp.skill.toLowerCase().includes(skillFilter.toLowerCase());
      const matchType =
        typeFilter === "All" ||
        (typeFilter === "Internship" && opp.jobType === JobType.internship) ||
        (typeFilter === "Full-time" && opp.jobType === JobType.fullTime);
      const matchSearch =
        !search ||
        opp.title.toLowerCase().includes(search.toLowerCase()) ||
        opp.company.toLowerCase().includes(search.toLowerCase()) ||
        opp.skill.toLowerCase().includes(search.toLowerCase());
      return matchSkill && matchType && matchSearch;
    });
  }, [opportunities, skillFilter, typeFilter, search]);

  return (
    <main className="pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl md:text-5xl text-foreground mb-3">
            <span className="gradient-text italic">Opportunities</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Curated internships and full-time roles in tech — filter by your skills and start applying.
          </p>
        </div>

        {/* Filters */}
        <div className="space-y-4 mb-8">
          {/* Search */}
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search by title, company, or skill..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Skill filter */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Filter by Skill</p>
            <div className="flex flex-wrap gap-2">
              {SKILL_FILTERS.map((skill) => (
                <button
                  type="button"
                  key={skill}
                  onClick={() => setSkillFilter(skill)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border",
                    skillFilter === skill
                      ? "btn-primary border-transparent"
                      : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                  )}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          {/* Type filter */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Type</p>
            <div className="flex gap-2">
              {(["All", "Internship", "Full-time"] as TypeFilter[]).map((type) => (
                <button
                  type="button"
                  key={type}
                  onClick={() => setTypeFilter(type)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border",
                    typeFilter === type
                      ? type === "Internship"
                        ? "bg-violet-600 text-white border-violet-600"
                        : type === "Full-time"
                          ? "bg-blue-600 text-white border-blue-600"
                          : "btn-primary border-transparent"
                      : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                  )}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Count */}
        {!isLoading && !isError && (
          <p className="text-sm text-muted-foreground mb-5">
            <span className="font-semibold text-foreground">{filtered.length}</span>{" "}
            {filtered.length === 1 ? "opportunity" : "opportunities"} found
          </p>
        )}

        {/* Loading */}
        {(isLoading || isFetching) && (
          <LoadingSpinner message="Loading opportunities..." size="md" />
        )}

        {/* Error */}
        {isError && !isLoading && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-6 text-center">
            <p className="text-destructive font-medium">Failed to load opportunities. Please try again.</p>
          </div>
        )}

        {/* Grid */}
        {!isLoading && !isError && (
          <>
            {filtered.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4 text-3xl" role="img" aria-label="Search">
                  <span aria-hidden="true">🔍</span>
                </div>
                <h3 className="font-display text-xl text-foreground mb-2">No matches found</h3>
                <p className="text-muted-foreground text-sm">
                  Try adjusting your filters or search query.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map((opp) => {
                  const isInternship = opp.jobType === JobType.internship;
                  return (
                    <Card
                      key={Number(opp.id)}
                      className="card-glow transition-all duration-300 flex flex-col"
                    >
                      <CardContent className="pt-5 flex flex-col h-full">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-lg shrink-0">
                            {opp.company.charAt(0)}
                          </div>
                          <span
                            className={cn(
                              "text-xs font-semibold px-2 py-0.5 rounded-full border",
                              isInternship
                                ? "bg-violet-50 text-violet-700 border-violet-200"
                                : "bg-blue-50 text-blue-700 border-blue-200"
                            )}
                          >
                            {isInternship ? "Internship" : "Full-time"}
                          </span>
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-muted-foreground mb-0.5">
                            {opp.company}
                          </p>
                          <h3 className="font-semibold text-card-foreground text-sm mb-3 leading-snug">
                            {opp.title}
                          </h3>
                          <SkillBadge skill={opp.skill} />
                        </div>

                        {/* Apply button */}
                        <div className="mt-4 pt-4 border-t border-border">
                          <a
                            href={opp.applicationLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full"
                          >
                            <Button
                              size="sm"
                              className="w-full btn-primary border-0 gap-1.5 text-xs"
                            >
                              Apply Now
                              <ExternalLink className="w-3 h-3" />
                            </Button>
                          </a>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </>
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
