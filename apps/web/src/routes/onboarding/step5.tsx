import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StepIndicator } from "@/components/onboarding/step-indicator";
import { 
  TrendingUp, 
  Target, 
  Wallet,
  Plus,
  ArrowRight,
  CheckCircle,
  Sparkles,
  BarChart3,
  Calendar,
  PiggyBank
} from "lucide-react";

export const Route = createFileRoute("/onboarding/step5")({
  component: Step6Component,
});

function Step6Component() {
  const features = [
    {
      icon: BarChart3,
      title: "Track Expenses",
      description: "Log transactions and see where your money goes"
    },
    {
      icon: Target,
      title: "Budgets",
      description: "Set spending limits and get alerts when you exceed them"
    },
    {
      icon: PiggyBank,
      title: "Goals",
      description: "Save for emergencies, trips, or big purchases"
    },
    {
      icon: TrendingUp,
      title: "Insights",
      description: "Understand patterns and improve your financial health"
    }
  ];

  const nextSteps = [
    {
      icon: Plus,
      title: "Add Transactions",
      description: "Log your daily expenses and income to build a complete picture"
    },
    {
      icon: Target,
      title: "Create Your First Budget",
      description: "Set spending limits for your top expense categories"
    },
    {
      icon: PiggyBank,
      title: "Set a Savings Goal",
      description: "Choose something meaningful to work towards"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <StepIndicator currentStep={6} className="mb-8" />

        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <CheckCircle className="h-4 w-4" />
            <span>Setup Complete!</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Welcome to Your Financial Dashboard
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            You're all set! Here's a preview of what you can do next. 
            Your dashboard is personalized based on your goals and preferences.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="border-2 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-primary">
                  <Sparkles className="h-6 w-6 text-primary-foreground" />
                </div>
                <h2 className="text-2xl font-bold">Your Dashboard</h2>
              </div>
              
              <div className="space-y-4">
                <div className="bg-background/80 backdrop-blur rounded-lg p-4 border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-muted-foreground">Total Balance</span>
                    <Wallet className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="text-2xl font-bold">$0.00</div>
                </div>
                
                <div className="bg-background/80 backdrop-blur rounded-lg p-4 border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-muted-foreground">This Month</span>
                    <TrendingUp className="h-4 w-4 text-success" />
                  </div>
                  <div className="text-lg">
                    <span className="text-success font-medium">+$0.00</span>
                    <span className="text-muted-foreground text-sm ml-2">income</span>
                  </div>
                  <div className="text-lg">
                    <span className="text-foreground">-$0.00</span>
                    <span className="text-muted-foreground text-sm ml-2">expenses</span>
                  </div>
                </div>
                
                <div className="bg-background/80 backdrop-blur rounded-lg p-4 border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-muted-foreground">Savings Goal</span>
                    <Target className="h-4 w-4 text-primary" />
                  </div>
                  <div className="text-lg font-medium">No goals yet</div>
                  <div className="text-sm text-muted-foreground">Create your first goal to start tracking</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-2">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold mb-4">Available Features</h3>
                <div className="space-y-4">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <feature.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{feature.title}</h4>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-success/20 bg-success/5">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="h-5 w-5 text-success" />
                  <h3 className="font-semibold">Quick Start Checklist</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Follow these steps to get the most out of your financial tracking:
                </p>
                <div className="space-y-3">
                  {nextSteps.map((step, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center mt-0.5">
                        <span className="text-xs font-semibold text-success">{index + 1}</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">{step.title}</h4>
                        <p className="text-xs text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="text-center space-y-6">
          <div className="space-y-4">
            <Button 
              size="lg" 
              className="px-12 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-200"
              onClick={() => window.location.href = "/dashboard"}
            >
              Go to Dashboard
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              You can revisit onboarding or customize your experience anytime in settings.
            </p>
          </div>

          <div className="flex items-center justify-center gap-8 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-3 w-3 text-success" />
              <span>Setup completed</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-3 w-3 text-success" />
              <span>Preferences saved</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-3 w-3 text-success" />
              <span>Account created</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
