import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Learnlyt" },
      { name: "description", content: "Sign in or create your Learnlyt account." },
      { property: "og:title", content: "Sign in — Learnlyt" },
      { property: "og:description", content: "Access your personalized learning roadmap." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/dashboard" });
      } else if (mode === "signup") {
        if (password.length < 8) throw new Error("Password must be at least 8 characters.");
        const { error } = await supabase.auth.signUp({
          email, password, options: { emailRedirectTo: window.location.origin + "/dashboard", data: { full_name: name } },
        });
        if (error) throw error;
        toast.success("Check your email to confirm your account.");
        setMode("signin");
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + "/reset-password" });
        if (error) throw error;
        toast.success("Password reset link sent.");
        setMode("signin");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function google() {
    const res = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/auth" });
    if (res.error) return toast.error("Google sign-in failed");
    if (res.redirected) return;
    navigate({ to: "/dashboard" });
  }

  return (
    <div className="grid min-h-screen place-items-center bg-soft px-4">
      <div className="w-full max-w-md rounded-3xl border bg-card p-8 shadow-card">
        <Logo />
        <h1 className="mt-6 text-2xl font-bold">
          {mode === "signin" ? "Welcome back" : mode === "signup" ? "Create your account" : "Reset password"}
        </h1>
        <form onSubmit={submit} className="mt-6 space-y-4">
          {mode === "signup" && (
            <div className="space-y-1.5"><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} required /></div>
          )}
          <div className="space-y-1.5"><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
          {mode !== "forgot" && (
            <div className="space-y-1.5"><Label>Password</Label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
          )}
          <Button type="submit" variant="hero" className="w-full" disabled={loading}>
            {loading ? "Please wait…" : mode === "signin" ? "Sign in" : mode === "signup" ? "Create account" : "Send reset link"}
          </Button>
        </form>
        {mode !== "forgot" && (
          <>
            <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground"><div className="h-px flex-1 bg-border" />or<div className="h-px flex-1 bg-border" /></div>
            <Button variant="outline" className="w-full rounded-xl" onClick={google}>Continue with Google</Button>
          </>
        )}
        <div className="mt-6 flex justify-between text-sm">
          <button className="text-primary hover:underline" onClick={() => setMode(mode === "signup" ? "signin" : "signup")}>
            {mode === "signup" ? "Have an account? Sign in" : "New here? Create account"}
          </button>
          {mode === "signin" && <button className="text-muted-foreground hover:underline" onClick={() => setMode("forgot")}>Forgot password?</button>}
        </div>
      </div>
    </div>
  );
}
