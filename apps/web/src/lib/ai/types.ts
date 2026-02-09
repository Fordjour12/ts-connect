export type AIProvider = "openai" | "anthropic";

export type ChatRole = "system" | "user" | "assistant";

export type ChatMessage = {
  role: ChatRole;
  content: string;
};

export type ChatThread = {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CoachContext = {
  dashboardSnapshot?: boolean;
};

export type CoachGenerateInput = {
  messages: ChatMessage[];
  userId: string;
  context?: CoachContext;
  threadId?: string;
};

export type CoachGenerateOutput = {
  text: string;
  model: string;
  provider: AIProvider;
};

export interface ChatStore {
  listMessagesByThread(input: { userId: string; threadId: string }): Promise<ChatMessage[]>;
  createThread(input: { userId: string }): Promise<ChatThread>;
  appendMessage(input: { userId: string; threadId: string; message: ChatMessage }): Promise<void>;
}
