import { Link } from "@tanstack/react-router";
import {
  Trophy,
  Brain,
  Briefcase,
  Rocket,
  Star,
  Building2,
  Zap,
  Gift,
} from "lucide-react";

const FEATURES = [
  {
    href: "/contest",
    icon: Trophy,
    emoji: "🏆",
    title: "Weekly Contest",
    description: "Sharpen your skills with AI-generated programming contests every Wednesday and Sunday.",
    color: "from-violet-500 to-purple-600",
    lightColor: "bg-violet-50 text-violet-700",
  },
  {
    href: "/practice",
    icon: Brain,
    emoji: "🧠",
    title: "Daily Practice",
    description: "Take topic-based MCQ quizzes and find out which learning track suits you best.",
    color: "from-pink-500 to-rose-600",
    lightColor: "bg-pink-50 text-pink-700",
  },
  {
    href: "/prep",
    icon: Briefcase,
    emoji: "💼",
    title: "Internship Prep",
    description: "Get a personalized 10-day roadmap with skills, tips, and daily tasks for your dream role.",
    color: "from-fuchsia-500 to-purple-600",
    lightColor: "bg-fuchsia-50 text-fuchsia-700",
  },
  {
    href: "/opportunities",
    icon: Rocket,
    emoji: "🚀",
    title: "Opportunities",
    description: "Browse internships and full-time roles, filtered by your skills and interests.",
    color: "from-purple-500 to-indigo-600",
    lightColor: "bg-purple-50 text-purple-700",
  },
];

const STATS = [
  { icon: Brain, label: "500+ Problems", value: "500+" },
  { icon: Building2, label: "50+ Companies", value: "50+" },
  { icon: Zap, label: "AI-Powered", value: "AI" },
  { icon: Gift, label: "Free to Use", value: "Free" },
];

export default function LandingPage() {
  return (
    <main>
      {/* Hero */}
      <section className="hero-gradient min-h-screen flex items-center relative overflow-hidden pt-16">
        {/* Decorative orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-pink-400/10 blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-1/3 w-64 h-64 rounded-full bg-purple-300/8 blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 py-20 text-center relative z-10">
          {/* Badge */}
          <div className="animate-fade-up inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 rounded-full px-4 py-1.5 text-white/90 text-sm font-medium mb-8">
            <Star className="w-3.5 h-3.5 fill-yellow-300 text-yellow-300" />
            AI-Powered Career Platform for Women in Tech
          </div>

          {/* Title */}
          <h1 className="animate-fade-up-delay-1 font-display text-6xl md:text-8xl font-bold text-white mb-6 leading-tight">
            She<span className="italic">Codes</span>
          </h1>

          {/* Tagline */}
          <p className="animate-fade-up-delay-2 text-xl md:text-2xl text-white/85 max-w-3xl mx-auto mb-4 leading-relaxed font-medium">
            Empowering Women in Tech Through{" "}
            <span className="text-white font-semibold">AI-Driven Learning</span> &{" "}
            <span className="text-white font-semibold">Career Preparation</span>
          </p>

          <p className="animate-fade-up-delay-3 text-white/65 text-base md:text-lg max-w-2xl mx-auto mb-12">
            Practice coding, ace interviews, and land your dream tech role with personalized
            AI assistance tailored for women breaking into the industry.
          </p>

          {/* CTA buttons */}
          <div className="animate-fade-up-delay-4 flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              to="/contest"
              className="bg-white text-purple-700 font-semibold px-8 py-3.5 rounded-xl hover:bg-white/90 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
            >
              Start Practicing
            </Link>
            <Link
              to="/opportunities"
              className="bg-white/15 backdrop-blur-sm border border-white/30 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/25 transition-all duration-200"
            >
              Browse Opportunities
            </Link>
          </div>

          {/* Stats */}
          <div className="animate-fade-up-delay-4 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {STATS.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white text-center"
              >
                <div className="text-2xl font-bold mb-0.5">{value}</div>
                <div className="text-white/70 text-xs flex items-center justify-center gap-1">
                  <Icon className="w-3 h-3" />
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path
              d="M0 80L60 73.3C120 66.7 240 53.3 360 46.7C480 40 600 40 720 46.7C840 53.3 960 66.7 1080 70C1200 73.3 1320 66.7 1380 63.3L1440 60V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0Z"
              fill="oklch(0.975 0.005 285)"
            />
          </svg>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-14">
          <h2 className="font-display text-4xl md:text-5xl text-foreground mb-4">
            Everything you need to{" "}
            <span className="gradient-text italic">succeed</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Four powerful tools built to take you from practice to placement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {FEATURES.map(({ href, emoji, title, description, lightColor }) => (
            <Link
              key={href}
              to={href}
              className="group bg-card rounded-2xl p-8 card-glow transition-all duration-300 cursor-pointer block"
            >
              <div className={`w-14 h-14 rounded-2xl ${lightColor} flex items-center justify-center text-2xl mb-5 transition-transform duration-300 group-hover:scale-110`} role="img" aria-label={title}>
                <span aria-hidden="true">{emoji}</span>
              </div>
              <h3 className="font-display text-2xl text-card-foreground mb-2 group-hover:gradient-text transition-all duration-200">
                {title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {description}
              </p>
              <div className="mt-4 flex items-center gap-1 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                Get started →
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-card border-y border-border py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="font-display text-4xl md:text-5xl text-foreground mb-4">
              How <span className="gradient-text italic">it works</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Three steps to accelerate your career
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: "01",
                title: "Add your API key",
                desc: "Connect your free Gemini API key to unlock AI-powered features.",
                emoji: "🔑",
              },
              {
                step: "02",
                title: "Practice & prepare",
                desc: "Use contests, quizzes, and personalized prep plans tailored to your goals.",
                emoji: "💪",
              },
              {
                step: "03",
                title: "Land your role",
                desc: "Apply directly to curated opportunities matched to your skills.",
                emoji: "🎯",
              },
            ].map(({ step, title, desc, emoji }) => (
              <div key={step} className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4 text-2xl">
                  {emoji}
                </div>
                <div className="text-xs font-bold text-primary/60 tracking-widest mb-2">{step}</div>
                <h3 className="font-display text-xl text-foreground mb-2">{title}</h3>
                <p className="text-muted-foreground text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center">
        <p className="text-muted-foreground text-sm">
          © 2026. Built with{" "}
          <span className="text-pink-500">♥</span>{" "}
          using{" "}
          <a
            href="https://caffeine.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline font-medium"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </main>
  );
}
