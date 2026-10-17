import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Card } from "@/components/PageBits";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Overview — Learnlyt" }, { name: "description", content: "Overview in Learnlyt." }] }),
  component: () => (
    <div>
      <PageHeader title="Overview" />
      <Card>This section is coming soon.</Card>
    </div>
  ),
});
