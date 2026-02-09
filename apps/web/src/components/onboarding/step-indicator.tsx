import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  currentStep: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
}

const steps = [
  { number: 1, label: "Welcome" },
  { number: 2, label: "Account" },
  { number: 3, label: "Setup" },
  { number: 4, label: "Goals" },
  { number: 5, label: "Quick Start" },
  { number: 6, label: "Dashboard" },
] as const;

export function StepIndicator({ currentStep, className }: StepIndicatorProps) {
  return (
    <nav aria-label="Progress" className={cn("w-full", className)}>
      <ol className="flex items-center justify-center gap-1 md:gap-2">
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
                    "group flex items-center justify-center rounded-full",
                    "transition-all duration-200 cursor-pointer",
                    "hover:scale-105",
                    isCurrent
                      ? "h-8 w-8 bg-primary text-primary-foreground shadow-sm"
                      : "h-6 w-6 bg-primary/80 text-primary-foreground/80 hover:bg-primary hover:text-primary-foreground"
                  )}
                  aria-label={`Go to step ${step.number}: ${step.label}`}
                >
                  <span className="flex items-center justify-center">
                    <CheckIcon className={cn("stroke-2", isCurrent ? "h-4 w-4" : "h-3 w-3")} />
                  </span>
                </button>
              ) : isCurrent ? (
                <div className="flex flex-col items-center gap-1">
                  <span
                    className={cn(
                      "flex items-center justify-center rounded-full",
                      "bg-primary text-primary-foreground shadow-sm",
                      "h-8 w-8 ring-2 ring-ring ring-offset-2 ring-offset-background",
                      "text-sm font-medium"
                    )}
                    aria-current="step"
                  >
                    {step.number}
                  </span>
                  <span className="text-xs font-medium text-foreground hidden sm:block">
                    {step.label}
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1">
                  <span
                    className={cn(
                      "flex items-center justify-center rounded-full",
                      "bg-muted text-muted-foreground border border-border/50",
                      "h-6 w-6 text-xs font-medium transition-all duration-200",
                    )}
                  >
                    {step.number}
                  </span>
                  <span className="text-xs text-muted-foreground hidden sm:block">
                    {step.label}
                  </span>
                </div>
              )}

              {index < steps.length - 1 && (
                <span
                  className={cn(
                    "mx-1 md:mx-2 transition-colors duration-200",
                    isCompleted ? "bg-primary h-0.5 w-4 md:w-8" : "bg-border h-0.5 w-4 md:w-8"
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
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}
