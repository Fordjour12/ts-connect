import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";

import { StepIndicator } from "@/components/onboarding/step-indicator";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  TrendingUp, 
  CreditCard, 
  PiggyBank,
  BarChart3,
  CheckCircle,
  Clock,
  Zap
} from "lucide-react";

export const Route = createFileRoute("/onboarding/step3")({
  component: Step4Component,
});

function Step4Component() {
  const form = useForm({
    defaultValues: {
      goals: [] as string[],
      experience: "",
      dashboardPreference: "",
    },
    onSubmit: async ({ value }) => {
      if (value.goals.length === 0) {
        toast.error("Please select at least one financial goal");
        return;
      }
      if (!value.experience) {
        toast.error("Please select your experience level");
        return;
      }
      if (!value.dashboardPreference) {
        toast.error("Please choose your dashboard preference");
        return;
      }

      try {
        const response = await fetch("/api/onboarding/goals", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(value),
        });

        if (!response.ok) {
          throw new Error("Failed to save preferences");
        }

        toast.success("Goals saved! Let's get you started.");
        window.location.href = "/onboarding/step4";
      } catch (error) {
        toast.error("Failed to save preferences. Please try again.");
      }
    },
  });

  const goals = [
    {
      id: "budgeting",
      title: "Stick to a Budget",
      description: "Track spending and stay within limits",
      icon: BarChart3,
    },
    {
      id: "savings",
      title: "Build Savings",
      description: "Grow your emergency fund and savings",
      icon: PiggyBank,
    },
    {
      id: "debt",
      title: "Pay Off Debt",
      description: "Create a plan to eliminate debt",
      icon: CreditCard,
    },
    {
      id: "awareness",
      title: "Track Expenses",
      description: "Understand where your money goes",
      icon: TrendingUp,
    },
  ];

  const experienceLevels = [
    {
      id: "beginner",
      title: "New to tracking",
      description: "This will be my first time tracking expenses seriously",
    },
    {
      id: "intermediate",
      title: "Some experience",
      description: "I've tried tracking before but didn't stick with it",
    },
    {
      id: "advanced",
      title: "Experienced",
      description: "I've used other financial apps and know what works",
    },
  ];

  const dashboardPreferences = [
    {
      id: "simple",
      title: "Simple Overview",
      description: "Just the basics - balances, recent transactions, and simple alerts",
      icon: Clock,
    },
    {
      id: "detailed",
      title: "Detailed Insights",
      description: "Full analysis - trends, categories, forecasts, and detailed reports",
      icon: Zap,
    },
  ];

  const toggleGoal = (goalId: string) => {
    const currentGoals = form.state.values.goals;
    const updatedGoals = currentGoals.includes(goalId)
      ? currentGoals.filter(id => id !== goalId)
      : [...currentGoals, goalId];
    form.state.values.goals = updatedGoals;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <StepIndicator currentStep={4} className="mb-8" />

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-3">
            What Are Your Financial Goals?
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Help us personalize your experience by telling us what you want to achieve. 
            We'll tailor your dashboard and recommendations accordingly.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-8"
        >
          <Card className="border-2">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div>
                  <Label className="text-base font-semibold mb-4 block">
                    What do you want to accomplish? (Select all that apply)
                  </Label>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {goals.map((goal) => (
                      <div
                        key={goal.id}
                        onClick={() => toggleGoal(goal.id)}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:border-primary/50 ${
                          form.state.values.goals.includes(goal.id)
                            ? "border-primary bg-primary/5"
                            : "border-border"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${
                            form.state.values.goals.includes(goal.id)
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}>
                            <goal.icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium mb-1">{goal.title}</h3>
                            <p className="text-sm text-muted-foreground">{goal.description}</p>
                          </div>
                          {form.state.values.goals.includes(goal.id) && (
                            <CheckCircle className="h-5 w-5 text-primary" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div>
                  <Label className="text-base font-semibold mb-4 block">
                    How would you describe your experience with financial tracking?
                  </Label>
                  <RadioGroup
                    value={form.state.values.experience}
                    onValueChange={(value) => (form.state.values.experience = value)}
                    className="space-y-3"
                  >
                    {experienceLevels.map((level) => (
                      <div
                        key={level.id}
                        className={`flex items-start space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all hover:border-primary/50 ${
                          form.state.values.experience === level.id
                            ? "border-primary bg-primary/5"
                            : "border-border"
                        }`}
                        onClick={() => (form.state.values.experience = level.id)}
                      >
                        <RadioGroupItem
                          value={level.id}
                          id={level.id}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <Label htmlFor={level.id} className="font-medium cursor-pointer">
                            {level.title}
                          </Label>
                          <p className="text-sm text-muted-foreground">{level.description}</p>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div>
                  <Label className="text-base font-semibold mb-4 block">
                    What level of detail do you prefer in your dashboard?
                  </Label>
                  <div className="space-y-3">
                    {dashboardPreferences.map((pref) => (
                      <div
                        key={pref.id}
                        onClick={() => (form.state.values.dashboardPreference = pref.id)}
                        className={`flex items-start space-x-4 p-4 rounded-lg border-2 cursor-pointer transition-all hover:border-primary/50 ${
                          form.state.values.dashboardPreference === pref.id
                            ? "border-primary bg-primary/5"
                            : "border-border"
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${
                          form.state.values.dashboardPreference === pref.id
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}>
                          <pref.icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium mb-1">{pref.title}</h3>
                          <p className="text-sm text-muted-foreground">{pref.description}</p>
                        </div>
                        {form.state.values.dashboardPreference === pref.id && (
                          <CheckCircle className="h-5 w-5 text-primary" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button type="submit" size="lg" className="w-full h-12 text-base">
            Continue to Quick Start
          </Button>
        </form>
      </div>
    </div>
  );
}
