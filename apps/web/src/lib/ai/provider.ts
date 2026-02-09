import { env } from "@ts-connnect/env/server";

import { generateWithAnthropic } from "@/lib/ai/providers/anthropic";
import { generateWithOpenAI } from "@/lib/ai/providers/openai";
import type { CoachGenerateInput, CoachGenerateOutput } from "@/lib/ai/types";

export async function generateCoachResponse(
  input: CoachGenerateInput,
): Promise<CoachGenerateOutput> {
  if (env.AI_PROVIDER === "anthropic") {
    return generateWithAnthropic(input);
  }

  return generateWithOpenAI(input);
}
