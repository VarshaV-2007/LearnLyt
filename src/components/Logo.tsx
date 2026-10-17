import { Link } from "@tanstack/react-router";
import { Compass } from "lucide-react";

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand text-primary-foreground shadow-glow">
        <Compass className="h-4 w-4" />
      </span>
      <span className="font-display text-lg font-bold tracking-tight">Learnlyt</span>
    </Link>
  );
}
