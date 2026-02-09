import { env } from "@ts-connnect/env/server";

import type { CoachGenerateInput, CoachGenerateOutput } from "@/lib/ai/types";

export async function generateWithOpenAI(input: CoachGenerateInput): Promise<CoachGenerateOutput> {
  if (!env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const latestUserPrompt = [...input.messages].reverse().find((m) => m.role === "user")?.content;

  return {
    text: `OpenAI adapter scaffold is wired. Latest prompt: ${latestUserPrompt ?? "(none)"}`,
    model: env.AI_MODEL,
    provider: "openai",
  };
}
