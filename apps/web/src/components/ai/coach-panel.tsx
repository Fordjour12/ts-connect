import { useMemo, useState } from "react";
import { Bot, Send, Sparkles, User } from "lucide-react";

import { aiChat } from "@/functions/ai-chat";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/lib/ai/types";

type CoachPanelProps = {
  className?: string;
};

const STARTER_PROMPTS = [
  "Why is my spending trending up this month?",
  "Give me one action to improve savings this week.",
  "Which category should I cut first based on this dashboard?",
] as const;

export function CoachPanel({ className }: CoachPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [threadId, setThreadId] = useState<string | undefined>();
  const [prompt, setPrompt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(() => prompt.trim().length > 0 && !isSubmitting, [prompt, isSubmitting]);

  const sendPrompt = async (content: string) => {
    const trimmed = content.trim();
    if (!trimmed || isSubmitting) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: trimmed }];

    setPrompt("");
    setError(null);
    setIsSubmitting(true);
    setMessages(nextMessages);

    try {
      const response = await aiChat({
        data: {
          context: { dashboardSnapshot: true },
          messages: nextMessages,
          threadId,
        },
      } as any);

      setThreadId(response.threadId);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response.data.text,
        },
      ]);
    } catch {
      setError("Could not get a response from AI Coach. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="size-4" />
              AI Coach
            </CardTitle>
            <CardDescription>Ask for one practical action based on your current financial state.</CardDescription>
          </div>
          <Badge variant="outline">MVP</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {messages.length === 0 ? (
          <div className="space-y-2">
            <p className="text-xs tracking-[0.12em] text-muted-foreground uppercase">Try one starter</p>
            <div className="flex flex-wrap gap-2">
              {STARTER_PROMPTS.map((starter) => (
                <Button
                  key={starter}
                  size="xs"
                  variant="outline"
                  onClick={() => {
                    void sendPrompt(starter);
                  }}
                >
                  {starter}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-h-72 space-y-2 overflow-y-auto rounded-xl border bg-secondary/40 p-3">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={cn(
                  "rounded-lg border px-3 py-2 text-sm",
                  message.role === "user"
                    ? "ml-8 border-border bg-background"
                    : "mr-8 border-border bg-card",
                )}
              >
                <div className="mb-1 flex items-center gap-1.5 text-[11px] text-muted-foreground uppercase">
                  {message.role === "user" ? <User className="size-3" /> : <Bot className="size-3" />}
                  {message.role}
                </div>
                <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
              </div>
            ))}

            {isSubmitting && (
              <div className="mr-8 rounded-lg border border-border bg-card px-3 py-2 text-sm text-muted-foreground">
                AI Coach is thinking...
              </div>
            )}
          </div>
        )}

        <div className="space-y-2">
          <Textarea
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="Ask AI Coach..."
            rows={3}
            disabled={isSubmitting}
          />
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground">Keeps one thread per active dashboard session.</p>
            <Button
              size="sm"
              onClick={() => {
                void sendPrompt(prompt);
              }}
              disabled={!canSubmit}
            >
              <Send className="size-3.5" />
              Send
            </Button>
          </div>
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
