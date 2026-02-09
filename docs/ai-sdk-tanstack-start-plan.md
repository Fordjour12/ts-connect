# TanStack Start AI SDK Plan: Provider-Agnostic Dashboard AI Coach (Hybrid History)

## Summary
Integrate Vercel AI SDK into this TanStack Start app with a first feature: an authenticated AI Coach panel on `/dashboard` with streaming responses.
Implementation will be provider-agnostic at the app layer, while starting with one concrete adapter and a clean path to add more.
Chat history will be hybrid: MVP runs without hard DB dependency, but we define persistence contracts and migration path now.

## Scope

### In scope
- AI Coach UI embedded in `apps/web/src/routes/dashboard.tsx`
- Streaming chat endpoint via TanStack Start route handler
- Provider abstraction + runtime selection
- Auth-scoped context usage (`session.user.id`)
- Hybrid chat state design (ephemeral runtime now + persistence contract)

### Out of scope
- Tool calling, RAG/vector search, long-term memory retrieval
- Multi-turn financial action automation
- Background summarization jobs

## Architecture (TanStack Start specific)

### 1) Server-side AI endpoint
- Add route: `apps/web/src/routes/api/ai/chat.ts`
- Implement `POST` handler using TanStack Start server handlers.
- Flow:
  1. Validate request body (messages, optional metadata) with `zod`.
  2. Resolve auth session (reuse existing auth middleware/session retrieval pattern).
  3. Build system prompt + user-scoped context envelope.
  4. Call provider adapter through common interface.
  5. Return streamed response (SSE/streaming response compatible with AI SDK UI consumption).
- Enforce:
  - Reject unauthenticated requests (`401`).
  - Reject cross-user payload identifiers.
  - Basic request size/message count limits.

### 2) Provider abstraction layer
- Add package-level module (web-local first):
  - `apps/web/src/lib/ai/provider.ts`
  - `apps/web/src/lib/ai/types.ts`
- Interface:
  - `generateCoachResponse({ messages, userId, context, modelConfig }) -> stream`
- Adapter strategy:
  - `provider=openai|anthropic` from env
  - `switch` to concrete provider adapter
- Add first adapter implementation file(s):
  - `apps/web/src/lib/ai/providers/openai.ts`
  - `apps/web/src/lib/ai/providers/anthropic.ts` (stub or minimal implementation)
- App code never imports provider SDKs directly; only the abstraction.

### 3) Dashboard UI integration
- Update `apps/web/src/routes/dashboard.tsx`:
  - Add right-side (or lower) `AI Coach` card/panel consistent with current 4-b aesthetic.
  - Chat transcript list + input + send action + streaming assistant bubble.
  - Loading/streaming states and retry CTA.
  - Empty state prompt suggestions (`Why did spending rise this month?`, etc.).
- New component(s):
  - `apps/web/src/components/ai/coach-panel.tsx`
  - Optional: `apps/web/src/components/ai/chat-message.tsx`

### 4) Hybrid history design
- Immediate MVP behavior:
  - Client/session-ephemeral messages (React state).
- Define persistence contract now:
  - Types and repository interface:
    - `ChatThread`, `ChatMessage`, `ChatStore`
  - File:
    - `apps/web/src/lib/ai/chat-store.ts` (interface + in-memory impl)
- Future DB-ready contract (no mutation in MVP implementation):
  - `ai_threads(id, user_id, created_at, updated_at)`
  - `ai_messages(id, thread_id, role, content, model, created_at, metadata_json)`
- Endpoint request supports optional `threadId` now so persistence can be enabled without UI redesign.

## Public Interfaces / API Changes

### HTTP
- `POST /api/ai/chat`
  - Request:
    - `messages: Array<{ role: "user" | "assistant" | "system"; content: string }>`
    - `threadId?: string`
    - `context?: { dashboardSnapshot?: boolean }`
  - Response:
    - Streaming text response (AI SDK stream)
  - Errors:
    - `400` invalid payload
    - `401` unauthenticated
    - `429` rate-limited
    - `500` provider/internal error

### Environment
- Update `packages/env/src/server.ts` and `.env.example`:
  - `AI_PROVIDER` (`openai` | `anthropic`)
  - `AI_MODEL` (string)
  - `OPENAI_API_KEY` (optional depending on provider)
  - `ANTHROPIC_API_KEY` (optional depending on provider)
  - `AI_MAX_INPUT_CHARS` (defaulted)
  - `AI_MAX_MESSAGES` (defaulted)
- Validation rules:
  - Provider-specific API key required depending on `AI_PROVIDER`.

### Dependencies
- `apps/web` add:
  - `ai`
  - provider packages matching chosen adapters (at minimum one concrete + optional second)
- Keep all integration in TanStack Start runtime, no Next.js-specific utilities.

## Prompting and Safety
- Add system prompt template file:
  - `apps/web/src/lib/ai/prompts/coach-system.ts`
- Include constraints:
  - Financial guidance is informational, not regulated advice.
  - Ask one clarifying question when context is insufficient.
  - Return one practical action with rationale.
- Add guardrails:
  - Strip secrets/PII fields from injected context.
  - Avoid logging raw message bodies.

## Testing Plan

### Unit
- Provider selection logic:
  - Chooses adapter by `AI_PROVIDER`
  - Throws clear error on misconfiguration
- Payload validation:
  - invalid role/content rejected
  - over-limit size rejected
- Prompt builder:
  - includes user context and instruction headers

### Integration
- `/api/ai/chat`:
  - `401` when no session
  - streams on valid request
  - handles provider error into normalized response
- Dashboard panel:
  - render empty state
  - send message updates transcript
  - streaming state shown and finalized message committed

### Manual acceptance scenarios
1. Authenticated user opens `/dashboard`, sees AI Coach panel.
2. User sends prompt, receives streamed reply token-by-token.
3. Provider switch via env works without UI code change.
4. Unauthenticated access to `/api/ai/chat` returns `401`.
5. Large payload gracefully rejected with useful error message.

## Rollout
- Feature flag:
  - `ENABLE_AI_COACH` (default false in non-dev if needed)
- Phase rollout:
  1. Dev-only with ephemeral history
  2. Internal testing for prompt quality and latency
  3. Enable for selected users
  4. Persistence implementation against predefined store contract

## Assumptions and Defaults
- Framework target is TanStack Start only.
- First UX surface is `/dashboard` AI Coach.
- Provider strategy is provider-agnostic interface with runtime selection.
- Chat history is hybrid: ephemeral behavior now, persistence contract defined now.
- No DB schema migration is executed in this first integration phase.
