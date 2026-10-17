import { queryOptions, useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getMyData } from "@/lib/learnlyt.functions";
import { DEMO } from "@/lib/careers";

export const myDataKey = ["my-data"] as const;

export function useMyData() {
  const fn = useServerFn(getMyData);
  const q = useQuery(queryOptions({ queryKey: myDataKey, queryFn: () => fn() }));
  const d = q.data;
  const isDemo = !!d && !d.plan;
  const view = d
    ? d.plan
      ? {
          targetRole: d.plan.target_role,
          skills: d.assessment?.skills ?? [],
          plan: d.plan.analysis,
          completed: d.plan.completed,
        }
      : { targetRole: DEMO.targetRole, skills: DEMO.skills, plan: DEMO.plan, completed: DEMO.completed }
    : null;
  return { ...q, isDemo, view };
}

export function progressOf(plan: { milestones: { topics: { id: string }[] }[] }, completed: string[]) {
  const all = plan.milestones.flatMap((m) => m.topics.map((t) => t.id));
  const done = all.filter((id) => completed.includes(id)).length;
  return { done, total: all.length, pct: all.length ? Math.round((done / all.length) * 100) : 0 };
}
