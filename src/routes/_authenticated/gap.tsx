import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Card } from "@/components/PageBits";

export const Route = createFileRoute("/_authenticated/gap")({
  head: () => ({ meta: [{ title: "Skill Gap Analysis — Learnlyt" }, { name: "description", content: "Skill Gap Analysis in Learnlyt." }] }),
  component: () => (
    <div>
      <PageHeader title="Skill Gap Analysis" />
      <Card>This section is coming soon.</Card>
    </div>
  ),
});
