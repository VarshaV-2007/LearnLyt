import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Reset password — Learnlyt" }, { name: "description", content: "Set a new Learnlyt password." }] }),
  component: Reset,
});

function Reset() {
  const [pw, setPw] = useState("");
  const navigate = useNavigate();
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (pw.length < 8) { toast.error("Password must be at least 8 characters."); return; }
    const { error } = await supabase.auth.updateUser({ password: pw });
    if (error) { toast.error(error.message); return; }
    toast.success("Password updated");
    navigate({ to: "/dashboard" });
  }
  return (
    <div className="grid min-h-screen place-items-center bg-soft px-4">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 rounded-3xl border bg-card p-8 shadow-card">
        <h1 className="text-xl font-bold">Choose a new password</h1>
        <Input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="New password" required />
        <Button type="submit" variant="hero" className="w-full">Update password</Button>
      </form>
    </div>
  );
}
