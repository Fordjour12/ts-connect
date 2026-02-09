import { createFileRoute } from "@tanstack/react-router";

import { StepIndicator } from "@/components/onboarding/step-indicator";
import SignInForm from "@/components/sign-in-form";
import SignUpForm from "@/components/sign-up-form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Shield, Clock } from "lucide-react";

export const Route = createFileRoute("/onboarding/step1")({
  component: Step1Component,
});

function Step1Component() {
  const [showSignIn, setShowSignIn] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <StepIndicator currentStep={2} className="mb-8" />

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-3">
            {showSignIn ? "Welcome back" : "Create Your Account"}
          </h1>
          <p className="text-muted-foreground">
            {showSignIn 
              ? "Sign in to continue your financial journey" 
              : "Join thousands taking control of their finances"
            }
          </p>
        </div>

        <Card className="border-2">
          <CardContent className="p-8">
            {showSignIn ? (
              <SignInForm onSwitchToSignUp={() => setShowSignIn(false)} />
            ) : (
              <SignUpForm onSwitchToSignIn={() => setShowSignIn(true)} />
            )}
          </CardContent>
        </Card>

        <div className="flex items-center justify-between mt-6 text-sm text-muted-foreground">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.location.href = "/onboarding/welcome"}
            className="p-0 h-auto font-normal"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to welcome
          </Button>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Shield className="h-4 w-4 text-success" />
              <span>Secure</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-info" />
              <span>2 min setup</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
