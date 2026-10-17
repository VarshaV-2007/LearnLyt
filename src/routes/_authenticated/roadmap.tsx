import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Card } from "@/components/PageBits";

export const Route = createFileRoute("/_authenticated/roadmap")({
  head: () => ({ meta: [{ title: "Learning Roadmap — Learnlyt" }, { name: "description", content: "Learning Roadmap in Learnlyt." }] }),
  component: () => (
    <div>
      <PageHeader title="Learning Roadmap" />
      <Card>This section is coming soon.</Card>
    </div>
  ),
});
