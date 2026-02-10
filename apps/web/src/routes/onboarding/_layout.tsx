import { createFileRoute, Outlet } from "@tanstack/react-router";

import { getUser } from "@/functions/get-user";
import { redirect } from "@tanstack/react-router";
import { StepIndicator } from "@/components/onboarding/step-indicator";

function getStepFromPath(path: string): 1 | 2 | 3 | 4 | 5 {
  if (path.includes("/step2")) return 2;
  if (path.includes("/step3")) return 3;
  if (path.includes("/step4")) return 4;
  if (path.includes("/step5")) return 5;
  return 1;
}

export const Route = createFileRoute("/onboarding/_layout")({
  loader: async () => {
    const session = await getUser();
    if (session) {
      throw redirect({ to: "/dashboard" });
    }
    return null;
  },
  component: OnboardingLayout,
});

function OnboardingLayout() {
  const currentStep = getStepFromPath(window.location.pathname);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="container mx-auto max-w-3xl px-4 py-8">
        <StepIndicator currentStep={currentStep} className="mb-8" />
        <Outlet />
      </div>
    </div>
  );
}
