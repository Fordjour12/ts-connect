import type { ChatMessage, ChatStore, ChatThread } from "@/lib/ai/types";

const threads = new Map<string, ChatThread>();
const threadMessages = new Map<string, ChatMessage[]>();

function threadKey(userId: string, threadId: string) {
  return `${userId}:${threadId}`;
}

export const inMemoryChatStore: ChatStore = {
  async listMessagesByThread({ userId, threadId }) {
    return threadMessages.get(threadKey(userId, threadId)) ?? [];
  },

  async createThread({ userId }) {
    const now = new Date();
    const id = `thread_${Math.random().toString(36).slice(2, 11)}`;
    const thread: ChatThread = {
      id,
      userId,
      createdAt: now,
      updatedAt: now,
    };
    threads.set(threadKey(userId, id), thread);
    threadMessages.set(threadKey(userId, id), []);
    return thread;
  },

  async appendMessage({ userId, threadId, message }) {
    const key = threadKey(userId, threadId);
    const current = threadMessages.get(key) ?? [];
    threadMessages.set(key, [...current, message]);

    const thread = threads.get(key);
    if (thread) {
      threads.set(key, { ...thread, updatedAt: new Date() });
    }
  },
};
