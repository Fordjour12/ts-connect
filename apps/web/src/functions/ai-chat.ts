import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { inMemoryChatStore } from "@/lib/ai/chat-store";
import { generateCoachResponse } from "@/lib/ai/provider";
import { buildCoachSystemPrompt } from "@/lib/ai/prompts/coach-system";
import { authMiddleware } from "@/middleware/auth";

const chatInputSchema = z.object({
  context: z
    .object({
      dashboardSnapshot: z.boolean().optional(),
    })
    .optional(),
  messages: z
    .array(
      z.object({
        content: z.string().min(1).max(8000),
        role: z.enum(["system", "user", "assistant"]),
      }),
    )
    .min(1)
    .max(24),
  threadId: z.string().min(1).optional(),
});

export const aiChat = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data) => chatInputSchema.parse(data))
  .handler(async ({ context = {} as any, data }) => {
    const session = context.session;
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const userId = session.user.id;

    const thread = data.threadId
      ? { id: data.threadId }
      : await inMemoryChatStore.createThread({ userId });

    for (const message of data.messages) {
      await inMemoryChatStore.appendMessage({
        userId,
        threadId: thread.id,
        message,
      });
    }

    const completion = await generateCoachResponse({
      context: data.context,
      messages: [
        { content: buildCoachSystemPrompt(), role: "system" },
        ...data.messages.filter((message) => message.role !== "system"),
      ],
      threadId: thread.id,
      userId,
    });

    await inMemoryChatStore.appendMessage({
      userId,
      threadId: thread.id,
      message: {
        content: completion.text,
        role: "assistant",
      },
    });

    return {
      data: completion,
      success: true,
      threadId: thread.id,
    };
  });
