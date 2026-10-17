import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Card } from "@/components/PageBits";

export const Route = createFileRoute("/_authenticated/assistant")({
  head: () => ({ meta: [{ title: "AI Assistant — Learnlyt" }, { name: "description", content: "AI Assistant in Learnlyt." }] }),
  component: () => (
    <div>
      <PageHeader title="AI Assistant" />
      <Card>This section is coming soon.</Card>
    </div>
  ),
});
