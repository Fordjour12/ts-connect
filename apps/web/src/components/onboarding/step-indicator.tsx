import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  currentStep: 1 | 2;
  className?: string;
}

const steps = [
  { number: 1, label: "Account" },
  { number: 2, label: "Profile" },
] as const;

export function StepIndicator({ currentStep, className }: StepIndicatorProps) {
  return (
    <nav aria-label="Progress" className={cn("w-full", className)}>
      <ol className="flex items-center justify-center gap-2">
        {steps.map((step, index) => {
          const isCompleted = step.number < currentStep;
          const isCurrent = step.number === currentStep;

          return (
            <li key={step.number} className="flex items-center">
              {isCompleted ? (
                <button
                  type="button"
                  onClick={() => {
                    window.location.href = `/onboarding/step${step.number}`;
                  }}
                  className={cn(
                    "group flex h-8 w-8 items-center justify-center rounded-full",
                    "bg-primary text-primary-foreground text-sm font-medium",
                    "transition-all duration-200 cursor-pointer",
                    "hover:scale-105 hover:bg-primary/90",
                  )}
                  aria-label={`Go to step ${step.number}: ${step.label}`}
                >
                  <span className="flex items-center justify-center">
                    <CheckIcon className="h-4 w-4" />
                  </span>
                </button>
              ) : isCurrent ? (
                <span
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full",
                    "bg-primary text-primary-foreground text-sm font-medium",
                    "ring-2 ring-ring ring-offset-2 ring-offset-background",
                  )}
                  aria-current="step"
                >
                  {step.number}
                </span>
              ) : (
                <span
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full",
                    "bg-muted text-muted-foreground text-sm font-medium",
                    "transition-all duration-200",
                  )}
                >
                  {step.number}
                </span>
              )}

              {index < steps.length - 1 && (
                <span
                  className={cn(
                    "mx-2 h-0.5 w-8 transition-colors duration-200",
                    isCompleted ? "bg-primary" : "bg-muted",
                  )}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={3}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}
