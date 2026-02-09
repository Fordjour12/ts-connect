import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StepIndicator } from "@/components/onboarding/step-indicator";
import { 
  TrendingUp, 
  Shield, 
  Target, 
  Brain,
  Clock,
  CheckCircle
} from "lucide-react";

export const Route = createFileRoute("/onboarding/welcome")({
  component: WelcomeComponent,
});

function WelcomeComponent() {
  const features = [
    {
      icon: TrendingUp,
      title: "Track Every Dollar",
      description: "Manual tracking builds awareness and control over your spending patterns"
    },
    {
      icon: Target,
      title: "Smart Budgets",
      description: "Set realistic budgets and get alerts before you overspend"
    },
    {
      icon: Brain,
      title: "Financial Insights",
      description: "Understand your money habits with personalized analysis and trends"
    },
    {
      icon: Shield,
      title: "Privacy First",
      description: "Your data stays private. No bank connections required for core features"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <StepIndicator currentStep={1} className="mb-12" />

        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Take Control of Your
            <span className="text-primary block">Financial Future</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Build a personal financial system that helps you track spending, 
            stick to budgets, and achieve your money goals—all with complete privacy.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="border-2 hover:border-primary/20 transition-all duration-300 hover:shadow-lg group"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-2 border-primary/10 bg-primary/5">
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-primary" />
              <span className="font-semibold">Quick Setup</span>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Get started in under 2 minutes. We'll guide you through a simple setup 
              to personalize your experience and show you how to track your first transaction.
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>No credit card</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>Private by default</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-12">
          <Button 
            size="lg" 
            className="px-12 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-200"
            onClick={() => window.location.href = "/onboarding/step2"}
          >
            Let's Get Started
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
