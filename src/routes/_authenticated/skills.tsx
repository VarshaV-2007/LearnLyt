import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Card } from "@/components/PageBits";

export const Route = createFileRoute("/_authenticated/skills")({
  head: () => ({ meta: [{ title: "My Skills — Learnlyt" }, { name: "description", content: "My Skills in Learnlyt." }] }),
  component: () => (
    <div>
      <PageHeader title="My Skills" />
      <Card>This section is coming soon.</Card>
    </div>
  ),
});
