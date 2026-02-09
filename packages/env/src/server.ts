import "dotenv/config";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

const boolFromString = () =>
  z
    .string()
    .transform((val) => val.toLowerCase() === "true")
    .pipe(z.boolean());

export const env = createEnv({
  server: {
    AI_MAX_INPUT_CHARS: z.coerce.number().int().positive().default(8000),
    AI_MAX_MESSAGES: z.coerce.number().int().positive().default(24),
    AI_MODEL: z.string().min(1).default("gpt-4o-mini"),
    AI_PROVIDER: z.enum(["openai", "anthropic"]).default("openai"),
    ANTHROPIC_API_KEY: z.string().optional(),
    DATABASE_URL: z.string().min(1),
    BETTER_AUTH_SECRET: z.string().min(32),
    BETTER_AUTH_URL: z.url(),
    CORS_ORIGIN: z.url(),
    ENABLE_AI_COACH: boolFromString().default(false),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    ENABLE_AUTH: boolFromString().default(true),
    OPENAI_API_KEY: z.string().optional(),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
