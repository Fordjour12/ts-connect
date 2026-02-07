import { createFileRoute } from "@tanstack/react-router";

import { StepIndicator } from "@/components/onboarding/step-indicator";
import SignInForm from "@/components/sign-in-form";
import SignUpForm from "@/components/sign-up-form";
import { useState } from "react";

export const Route = createFileRoute("/onboarding/step1")({
  component: Step1Component,
});

function Step1Component() {
  const [showSignIn, setShowSignIn] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4">
      <StepIndicator currentStep={1} className="mb-8" />

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">
            {showSignIn ? "Welcome back" : "Create your account"}
          </h1>
          <p className="text-sm text-muted-foreground mt-2">Step 1 of 2 — Sign in to continue</p>
        </div>

        {showSignIn ? (
          <SignInForm onSwitchToSignUp={() => setShowSignIn(false)} />
        ) : (
          <SignUpForm onSwitchToSignIn={() => setShowSignIn(true)} />
        )}
      </div>
    </div>
  );
}
