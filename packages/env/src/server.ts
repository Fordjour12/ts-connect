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
    DATABASE_URL: z.string().min(1),
    BETTER_AUTH_SECRET: z.string().min(32),
    BETTER_AUTH_URL: z.url(),
    CORS_ORIGIN: z.url(),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    ENABLE_AUTH: boolFromString().default(true),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
