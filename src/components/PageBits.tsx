import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Info, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl border bg-card p-5 shadow-card ${className}`}>{children}</div>;
}

export function DemoBanner() {
  return (
    <div className="mb-6 flex flex-wrap items-center gap-3 rounded-2xl border border-violet/30 bg-violet-soft p-4 text-sm text-accent-foreground">
      <Info className="h-4 w-4 shrink-0" />
      <span className="flex-1">You're viewing <b>sample demo data</b>. Complete your skill assessment to get your own AI-generated plan.</span>
      <Button asChild size="sm" variant="hero"><Link to="/skills">Start assessment</Link></Button>
    </div>
  );
}

export function Loading() {
  return <div className="grid h-64 place-items-center text-muted-foreground"><Loader2 className="h-6 w-6 animate-spin" /></div>;
}

export function ErrorBox({ message }: { message: string }) {
  return <div className="rounded-2xl border border-destructive/30 bg-card p-5 text-destructive">{message}</div>;
}
