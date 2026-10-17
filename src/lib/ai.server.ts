import { generateResponse, GatewayError } from "@lovable.dev/ai-gateway";

export const MODEL = "openai/gpt-6-astra" as const;

function extractText(res: unknown): string {
  const out = (res as { output?: unknown[] }).output ?? [];
  let text = "";
  for (const item of out) {
    const content = (item as { content?: unknown[] }).content;
    if (!Array.isArray(content)) continue;
    for (const c of content) {
      const part = c as { type?: string; text?: string };
      if (part.type === "output_text" && part.text) text += part.text;
    }
  }
  return text;
}

export async function askModel(
  instructions: string,
  input: { role: "user" | "assistant"; content: string }[],
): Promise<string> {
  try {
    const res = await generateResponse({ model: MODEL, instructions, input });
    return extractText(res);
  } catch (e) {
    if (e instanceof GatewayError) {
      if (e.httpStatus === 429) throw new Error("The AI is busy right now. Please try again in a minute.");
      if (e.httpStatus === 402) throw new Error("AI credits are exhausted. Please add credits to continue.");
      console.error("AI gateway error", e.code, e.ids);
      throw new Error("The AI could not respond. Please try again.");
    }
    throw e;
  }
}

export function parseJson<T>(text: string): T {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end < 0) throw new Error("AI returned an unexpected format. Please try again.");
  return JSON.parse(text.slice(start, end + 1)) as T;
}
