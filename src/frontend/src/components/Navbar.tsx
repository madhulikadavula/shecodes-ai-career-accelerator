import { Link, useRouterState } from "@tanstack/react-router";
import { Settings, Sparkles } from "lucide-react";
import { useApiKey } from "@/context/ApiKeyContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/contest" as const, label: "Weekly Contest" },
  { href: "/practice" as const, label: "Daily Practice" },
  { href: "/prep" as const, label: "Internship Prep" },
  { href: "/opportunities" as const, label: "Opportunities" },
];

export default function Navbar() {
  const { location } = useRouterState();
  const { setShowModal } = useApiKey();
  const currentPath = location.pathname;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-md border-b border-border shadow-xs">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg btn-primary flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-display text-xl font-bold gradient-text">SheCodes</span>
        </Link>

        {/* Nav links — desktop */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200",
                currentPath === link.href
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Settings */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowModal(true)}
          className="text-muted-foreground hover:text-foreground"
          title="Configure API Key"
        >
          <Settings className="w-5 h-5" />
        </Button>
      </div>

      {/* Mobile nav */}
      <div className="md:hidden border-t border-border bg-card/90 backdrop-blur-md">
        <nav className="container mx-auto flex overflow-x-auto gap-1 px-4 py-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 shrink-0",
                currentPath === link.href
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
