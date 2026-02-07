import { useForm } from "@tanstack/react-form";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import z from "zod";

import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/login")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate({
    from: "/login",
  });
  const [showSignIn, setShowSignIn] = useState(true);
  const { isPending } = authClient.useSession();

  const signInForm = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      await authClient.signIn.email(
        {
          email: value.email,
          password: value.password,
        },
        {
          onSuccess: () => {
            navigate({
              to: "/dashboard",
            });
            toast.success("Sign in successful");
          },
          onError: (error) => {
            toast.error(error.error.message || error.error.statusText);
          },
        },
      );
    },
    validators: {
      onSubmit: z.object({
        email: z.email("Invalid email address"),
        password: z.string().min(8, "Password must be at least 8 characters"),
      }),
    },
  });

  const signUpForm = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      await authClient.signUp.email(
        {
          name: value.name,
          email: value.email,
          password: value.password,
        },
        {
          onSuccess: () => {
            navigate({
              to: "/dashboard",
            });
            toast.success("Sign up successful");
          },
          onError: (error) => {
            toast.error(error.error.message || error.error.statusText);
          },
        },
      );
    },
    validators: {
      onSubmit: z.object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        email: z.email("Invalid email address"),
        password: z.string().min(8, "Password must be at least 8 characters"),
      }),
    },
  });

  if (isPending) {
    return <Loader />;
  }

  return (
    <main className="relative isolate flex min-h-svh items-center justify-center overflow-hidden bg-background p-6">
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(circle_at_50%_15%,color-mix(in_srgb,var(--foreground)_9%,transparent),transparent_45%)]" />
      <div className="pointer-events-none absolute inset-0 [background:linear-gradient(120deg,color-mix(in_srgb,var(--background)_90%,var(--foreground)_10%),var(--background)_35%,color-mix(in_srgb,var(--background)_96%,var(--foreground)_4%))]" />

      <Button
        variant="outline"
        size="sm"
        className="absolute left-6 top-6"
        onClick={() =>
          navigate({
            to: "/",
          })
        }
      >
        Back
      </Button>

      <section className="relative z-10 w-full max-w-sm rounded-3xl border border-border/60 bg-card/70 p-6 shadow-2xl backdrop-blur-xl">
        <div className="mx-auto mb-6 flex size-14 items-center justify-center rounded-2xl border border-border/70 bg-background/70">
          <div className="size-8 rounded-full border border-border bg-foreground/8" />
        </div>

        <header className="mb-6 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">
            {showSignIn ? "Yoo, welcome back!" : "Create your account"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {showSignIn ? "First time here?" : "Already have an account?"}{" "}
            <button
              className="font-medium text-foreground underline decoration-border underline-offset-4"
              onClick={() => setShowSignIn((prev) => !prev)}
              type="button"
            >
              {showSignIn ? "Sign up for free" : "Sign in"}
            </button>
          </p>
        </header>

        {showSignIn ? (
          <form
            className="space-y-3"
            onSubmit={(event) => {
              event.preventDefault();
              event.stopPropagation();
              signInForm.handleSubmit();
            }}
          >
            <signInForm.Field name="email">
              {(field) => (
                <div className="space-y-1.5">
                  <span className="sr-only">Email</span>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="email"
                    placeholder="Your email"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                  />
                  {field.state.meta.errors.map((error, index) => (
                    <p key={`${field.name}-error-${index}`} className="text-sm text-destructive">
                      {error?.message}
                    </p>
                  ))}
                </div>
              )}
            </signInForm.Field>

            <signInForm.Field name="password">
              {(field) => (
                <div className="space-y-1.5">
                  <span className="sr-only">Password</span>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="password"
                    placeholder="Password"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                  />
                  {field.state.meta.errors.map((error, index) => (
                    <p key={`${field.name}-error-${index}`} className="text-sm text-destructive">
                      {error?.message}
                    </p>
                  ))}
                </div>
              )}
            </signInForm.Field>

            <signInForm.Subscribe>
              {(state) => (
                <Button
                  type="submit"
                  disabled={!state.canSubmit || state.isSubmitting}
                  className="mt-2 h-11 w-full rounded-xl bg-foreground text-background hover:bg-foreground/92"
                >
                  {state.isSubmitting ? "Signing in..." : "Sign in"}
                </Button>
              )}
            </signInForm.Subscribe>
          </form>
        ) : (
          <form
            className="space-y-3"
            onSubmit={(event) => {
              event.preventDefault();
              event.stopPropagation();
              signUpForm.handleSubmit();
            }}
          >
            <signUpForm.Field name="name">
              {(field) => (
                <div className="space-y-1.5">
                  <span className="sr-only">Name</span>
                  <Input
                    id={field.name}
                    name={field.name}
                    placeholder="Your name"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                  />
                  {field.state.meta.errors.map((error, index) => (
                    <p key={`${field.name}-error-${index}`} className="text-sm text-destructive">
                      {error?.message}
                    </p>
                  ))}
                </div>
              )}
            </signUpForm.Field>

            <signUpForm.Field name="email">
              {(field) => (
                <div className="space-y-1.5">
                  <span className="sr-only">Email</span>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="email"
                    placeholder="Your email"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                  />
                  {field.state.meta.errors.map((error, index) => (
                    <p key={`${field.name}-error-${index}`} className="text-sm text-destructive">
                      {error?.message}
                    </p>
                  ))}
                </div>
              )}
            </signUpForm.Field>

            <signUpForm.Field name="password">
              {(field) => (
                <div className="space-y-1.5">
                  <span className="sr-only">Password</span>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="password"
                    placeholder="Password"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                  />
                  {field.state.meta.errors.map((error, index) => (
                    <p key={`${field.name}-error-${index}`} className="text-sm text-destructive">
                      {error?.message}
                    </p>
                  ))}
                </div>
              )}
            </signUpForm.Field>

            <signUpForm.Subscribe>
              {(state) => (
                <Button
                  type="submit"
                  disabled={!state.canSubmit || state.isSubmitting}
                  className="mt-2 h-11 w-full rounded-xl bg-foreground text-background hover:bg-foreground/92"
                >
                  {state.isSubmitting ? "Creating account..." : "Sign up"}
                </Button>
              )}
            </signUpForm.Subscribe>
          </form>
        )}
      </section>
    </main>
  );
}
