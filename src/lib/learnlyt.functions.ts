import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Plan, SkillEntry } from "./careers";

export type MyData = {
  displayName: string | null;
  assessment: { target_role: string; skills: SkillEntry[]; interests: string } | null;
  plan: { target_role: string; analysis: Plan; completed: string[]; created_at: string } | null;
};

export const getMyData = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<MyData> => {
    const { supabase, userId } = context;
    const [p, a, pl] = await Promise.all([
      supabase.from("profiles").select("display_name").eq("id", userId).maybeSingle(),
      supabase.from("assessments").select("target_role, skills, interests").eq("user_id", userId).maybeSingle(),
      supabase.from("plans").select("target_role, analysis, completed, created_at").eq("user_id", userId).maybeSingle(),
    ]);
    if (a.error) throw new Error(a.error.message);
    if (pl.error) throw new Error(pl.error.message);
    return {
      displayName: p.data?.display_name ?? null,
      assessment: a.data ? { ...a.data, skills: a.data.skills as unknown as SkillEntry[] } : null,
      plan: pl.data ? { ...pl.data, analysis: pl.data.analysis as unknown as Plan } : null,
    };
  });

type AssessmentInput = { targetRole: string; skills: SkillEntry[]; interests: string };

function validateAssessment(d: AssessmentInput): AssessmentInput {
  const targetRole = String(d.targetRole ?? "").trim().slice(0, 100);
  if (!targetRole) throw new Error("Please choose a target career role.");
  const skills = (Array.isArray(d.skills) ? d.skills : [])
    .map((s) => ({ name: String(s.name ?? "").trim().slice(0, 60), level: Math.min(5, Math.max(1, Math.round(Number(s.level) || 1))) }))
    .filter((s) => s.name)
    .slice(0, 40);
  if (skills.length === 0) throw new Error("Add at least one skill.");
  return { targetRole, skills, interests: String(d.interests ?? "").slice(0, 1000) };
}

export const saveAssessmentAndGenerate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(validateAssessment)
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase.from("assessments").upsert({
      user_id: userId, target_role: data.targetRole, skills: data.skills, interests: data.interests, updated_at: new Date().toISOString(),
    });
    if (error) throw new Error(error.message);

    const { askModel, parseJson } = await import("./ai.server");
    const { findCareer } = await import("./careers");
    const career = findCareer(data.targetRole);
    const instructions = `You are Learnlyt, a career and learning advisor for college students and fresh graduates.
Analyse the student's skills against the requirements of their target role and build a personalised roadmap.
Return ONLY valid JSON (no markdown) with this exact shape:
{"summary": string (2 sentences), "readiness": integer 0-100,
"strengths": string[],
"gaps": [{"skill": string, "current": integer 0-5, "required": integer 1-5, "priority": "high"|"medium"|"low", "note": string}],
"milestones": [{"id": "m1", "title": string, "weeks": integer, "description": string, "topics": [{"id": "m1-t1", "title": string, "hours": integer}], "project": string}],
"resources": [{"title": string, "type": "course"|"tutorial"|"docs"|"project"|"video", "url": string (real, well-known free resource URL), "skill": string}],
"careerPaths": [{"title": string, "match": integer 0-100, "reason": string}]}
Include every required skill in gaps (current 0 if missing). 4-6 milestones ordered by priority, 3-5 topics each. 8-12 resources. 3 career paths including the target.`;
    const user = `Target role: ${data.targetRole}
${career ? `Typical required skills (name: level 1-5): ${career.requiredSkills.map((s) => `${s.name}: ${s.level}`).join(", ")}` : "Infer the required skills for this role."}
My skills (1=beginner, 5=expert): ${data.skills.map((s) => `${s.name}: ${s.level}`).join(", ")}
Interests / goals: ${data.interests || "not specified"}`;
    const text = await askModel(instructions, [{ role: "user", content: user }]);
    const plan = parseJson<Plan>(text);
    if (!Array.isArray(plan.milestones) || !Array.isArray(plan.gaps)) throw new Error("AI returned an incomplete plan. Please try again.");

    const { error: e2 } = await supabase.from("plans").upsert({
      user_id: userId, target_role: data.targetRole, analysis: plan as never, completed: [], created_at: new Date().toISOString(),
    });
    if (e2) throw new Error(e2.message);
    return { ok: true };
  });

export const setCompleted = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { completed: string[] }) => ({ completed: (d.completed ?? []).map(String).slice(0, 200) }))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("plans").update({ completed: data.completed }).eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const updateSkillLevel = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { skills: SkillEntry[] }) => d)
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("assessments").update({ skills: data.skills, updated_at: new Date().toISOString() }).eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------- Chat ----------
export const listThreads = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase.from("chat_threads").select("id, title, updated_at").order("updated_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  });

export const createThread = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase.from("chat_threads").insert({ user_id: context.userId }).select("id").single();
    if (error) throw new Error(error.message);
    return data;
  });

export const deleteThread = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => d)
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("chat_threads").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const getThreadMessages = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { threadId: string }) => d)
  .handler(async ({ data, context }) => {
    const { data: t } = await context.supabase.from("chat_threads").select("id, title").eq("id", data.threadId).maybeSingle();
    if (!t) return null;
    const { data: msgs, error } = await context.supabase.from("chat_messages").select("id, role, content").eq("thread_id", data.threadId).order("created_at");
    if (error) throw new Error(error.message);
    return { thread: t, messages: msgs as { id: string; role: "user" | "assistant"; content: string }[] };
  });

export const sendChat = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { threadId: string; content: string }) => {
    const content = String(d.content ?? "").trim().slice(0, 4000);
    if (!content) throw new Error("Message is empty.");
    return { threadId: String(d.threadId), content };
  })
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: thread } = await supabase.from("chat_threads").select("id, title").eq("id", data.threadId).maybeSingle();
    if (!thread) throw new Error("Conversation not found.");
    const { error: e1 } = await supabase.from("chat_messages").insert({ thread_id: data.threadId, user_id: userId, role: "user", content: data.content });
    if (e1) throw new Error(e1.message);

    const [{ data: history }, { data: a }, { data: pl }] = await Promise.all([
      supabase.from("chat_messages").select("role, content").eq("thread_id", data.threadId).order("created_at"),
      supabase.from("assessments").select("target_role, skills").eq("user_id", userId).maybeSingle(),
      supabase.from("plans").select("analysis").eq("user_id", userId).maybeSingle(),
    ]);
    const { askModel } = await import("./ai.server");
    const profile = a
      ? `Student target role: ${a.target_role}. Skills: ${(a.skills as unknown as SkillEntry[]).map((s) => `${s.name} (${s.level}/5)`).join(", ")}.${pl ? ` Current roadmap summary: ${(pl.analysis as unknown as Plan).summary}` : ""}`
      : "The student has not completed a skill assessment yet; suggest doing one when useful.";
    const reply = await askModel(
      `You are Learnlyt's AI learning assistant for college students and fresh graduates. Give practical, encouraging, concise advice on career preparation, skills and learning resources. Use markdown with short lists. ${profile}`,
      (history ?? []).map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
    );
    const { error: e2 } = await supabase.from("chat_messages").insert({ thread_id: data.threadId, user_id: userId, role: "assistant", content: reply });
    if (e2) throw new Error(e2.message);
    const title = thread.title === "New conversation" ? data.content.slice(0, 50) : thread.title;
    await supabase.from("chat_threads").update({ title, updated_at: new Date().toISOString() }).eq("id", data.threadId);
    return { reply };
  });
