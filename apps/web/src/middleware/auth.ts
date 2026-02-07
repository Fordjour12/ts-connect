import { createMiddleware } from "@tanstack/react-start";
import { auth } from "@ts-connnect/auth";
import { env } from "@ts-connnect/env/server";

export const authMiddleware = createMiddleware().server(async ({ next, request }) => {
  if (!env.ENABLE_AUTH) {
    return next({
      context: {
        session: {
          user: {
            id: "demo-user",
            name: "Demo User",
            email: "demo@example.com",
            image: null,
            emailVerified: false,
          },
          session: {
            id: "demo-session",
            userId: "demo-user",
            createdAt: new Date(),
            updatedAt: new Date(),
            expiresAt: new Date(),
            token: "demo-token",
          },
        },
      },
    }) as ReturnType<typeof next>;
  }

  const session = await auth.api.getSession({
    headers: request.headers,
  });
  return next({
    context: { session },
  });
});
