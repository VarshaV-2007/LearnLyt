import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Card } from "@/components/PageBits";

export const Route = createFileRoute("/_authenticated/resources")({
  head: () => ({ meta: [{ title: "Resources — Learnlyt" }, { name: "description", content: "Resources in Learnlyt." }] }),
  component: () => (
    <div>
      <PageHeader title="Resources" />
      <Card>This section is coming soon.</Card>
    </div>
  ),
});
