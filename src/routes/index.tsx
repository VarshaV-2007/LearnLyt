import { createFileRoute, Link } from "@tanstack/react-router";
import { BarChart3, Bot, Map, Target, BookOpen, TrendingUp, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import hero from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Learnlyt — Data-Driven Personalized Learning" },
      { name: "description", content: "Find your skill gaps, explore careers, and get an AI-built learning roadmap tailored to you." },
      { property: "og:title", content: "Learnlyt — Data-Driven Personalized Learning" },
      { property: "og:description", content: "AI skill gap analysis and personalized roadmaps for students and fresh graduates." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const features = [
  { icon: Target, title: "Skill assessment", text: "Map your current skills, levels and interests in minutes." },
  { icon: BarChart3, title: "Skill gap analysis", text: "See exactly where you stand against your target career." },
  { icon: Map, title: "AI learning roadmap", text: "Step-by-step milestones with time estimates and projects." },
  { icon: BookOpen, title: "Curated resources", text: "Tutorials, docs, courses and practice projects that fit." },
  { icon: TrendingUp, title: "Progress tracking", text: "Check off topics and watch your readiness grow." },
  { icon: Bot, title: "AI assistant", text: "Ask anything about careers, interviews and learning." },
];

function Landing() {
  return (
    <div className="min-h-screen bg-soft">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Logo />
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost"><Link to="/auth">Sign in</Link></Button>
          <Button asChild variant="hero"><Link to="/dashboard">Get started</Link></Button>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-6 pb-16 pt-8 md:grid-cols-2 md:pt-16">
        <div>
          <span className="inline-flex rounded-full bg-violet-soft px-3 py-1 text-xs font-semibold text-accent-foreground">
            Data-Driven Personalized Learning
          </span>
          <h1 className="mt-5 text-4xl font-bold leading-tight md:text-6xl">
            Turn your skills into a <span className="text-brand">career roadmap</span>
          </h1>
          <p className="mt-5 max-w-lg text-lg text-muted-foreground">
            Learnlyt analyses where you are, compares it to where you want to be, and builds an AI-powered plan to get you there.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="hero" size="lg"><Link to="/skills">Take the assessment <ArrowRight /></Link></Button>
            <Button asChild variant="outline" size="lg" className="rounded-xl"><Link to="/dashboard">Explore the demo</Link></Button>
          </div>
        </div>
        <img src={hero} alt="Learning roadmap illustration" width={1280} height={1024} className="w-full" />
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <h2 className="text-center text-3xl font-bold">Everything you need to grow</h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="rounded-2xl border bg-card p-6 shadow-card">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-violet-soft text-accent-foreground">
                <f.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.text}</p>
            </div>
          ))}
        </div>
      </section>
      <footer className="border-t py-8 text-center text-sm text-muted-foreground">© {new Date().getFullYear()} Learnlyt</footer>
    </div>
  );
}
