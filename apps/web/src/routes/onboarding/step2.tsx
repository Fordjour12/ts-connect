import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";

import { StepIndicator } from "@/components/onboarding/step-indicator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

const currencies = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "MXN", name: "Mexican Peso", symbol: "MX$" },
  { code: "BRL", name: "Brazilian Real", symbol: "R$" },
  { code: "KRW", name: "South Korean Won", symbol: "₩" },
] as const;

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;
const currentMonthStr = currentMonth.toString().padStart(2, "0");

export const Route = createFileRoute("/onboarding/step2")({
  component: Step2Component,
});

function Step2Component() {
  const form = useForm({
    defaultValues: {
      currency: "" as string,
      financialStartDate: `${currentYear}-${currentMonthStr}-01`,
      monthlyIncomeMin: "",
      monthlyIncomeMax: "",
      privacyOptIn: false,
    },
    onSubmit: async ({ value }) => {
      if (!value.currency) {
        toast.error("Please select your currency");
        return;
      }

      const payload = {
        currency: value.currency,
        financialStartDate: value.financialStartDate,
        monthlyIncomeMin: value.monthlyIncomeMin ? Number(value.monthlyIncomeMin) : null,
        monthlyIncomeMax: value.monthlyIncomeMax ? Number(value.monthlyIncomeMax) : null,
        privacyOptIn: value.privacyOptIn,
      };

      try {
        const response = await fetch("/api/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to save profile");
        }

        toast.success("Foundation setup complete!");
        window.location.href = "/onboarding/step3";
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        }
      }
    },
  });

  const currencySymbol =
    currencies.find((c) => c.code === form.state.values.currency)?.symbol || "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <StepIndicator currentStep={3} className="mb-8" />

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-3">
            Let's Set Your Foundation
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            We'll personalize your experience with a few basic preferences. 
            Don't worry, you can change these anytime.
          </p>
        </div>

        <Card className="border-2">
          <CardContent className="p-8">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
              className="space-y-8"
            >
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="currency" className="text-base font-medium">
                    Primary Currency *
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Choose the currency you'll use for tracking expenses and budgets
                  </p>
                  <select
                    id="currency"
                    name="currency"
                    value={form.state.values.currency}
                    onChange={(e) => (form.state.values.currency = e.target.value)}
                    className={cn(
                      "flex h-12 w-full rounded-md border-2 border-input bg-background px-3 py-2",
                      "text-base ring-offset-background focus-visible:outline-none",
                      "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                      !form.state.values.currency && "text-muted-foreground"
                    )}
                  >
                    <option value="">Select your currency</option>
                    {currencies.map((currency) => (
                      <option key={currency.code} value={currency.code}>
                        {currency.symbol} {currency.code} — {currency.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="financialStartDate" className="text-base font-medium">
                    Financial Start Date *
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    When did you start tracking your finances seriously? This helps calculate savings and trends.
                  </p>
                  <Input
                    id="financialStartDate"
                    name="financialStartDate"
                    type="date"
                    max={new Date().toISOString().split("T")[0]}
                    value={form.state.values.financialStartDate}
                    onChange={(e) => (form.state.values.financialStartDate = e.target.value)}
                    className="h-12 text-base"
                  />
                </div>
              </div>

              <div className="space-y-4 p-6 bg-muted/30 rounded-lg border">
                <div className="space-y-2">
                  <Label className="text-base font-medium">Monthly Income Range (Optional)</Label>
                  <p className="text-sm text-muted-foreground">
                    This helps us provide more accurate budget recommendations and insights
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="monthlyIncomeMin" className="text-sm font-medium">
                        Minimum
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                          {currencySymbol || "$"}
                        </span>
                        <Input
                          id="monthlyIncomeMin"
                          name="monthlyIncomeMin"
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                          value={form.state.values.monthlyIncomeMin}
                          onChange={(e) => (form.state.values.monthlyIncomeMin = e.target.value)}
                          className="pl-7 h-12"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="monthlyIncomeMax" className="text-sm font-medium">
                        Maximum
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                          {currencySymbol || "$"}
                        </span>
                        <Input
                          id="monthlyIncomeMax"
                          name="monthlyIncomeMax"
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                          value={form.state.values.monthlyIncomeMax}
                          onChange={(e) => (form.state.values.monthlyIncomeMax = e.target.value)}
                          className="pl-7 h-12"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 p-4 bg-primary/5 rounded-lg border border-primary/10">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="privacyOptIn"
                    checked={form.state.values.privacyOptIn}
                    onCheckedChange={(checked) => 
                      (form.state.values.privacyOptIn = Boolean(checked))
                    }
                    className="mt-1"
                  />
                  <div className="space-y-1">
                    <Label htmlFor="privacyOptIn" className="text-sm font-medium cursor-pointer">
                      Help improve financial insights
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Share anonymized spending patterns to get better budget recommendations. 
                      You can opt out anytime. We never share your personal data.
                    </p>
                  </div>
                </div>
              </div>

              <Button type="submit" size="lg" className="w-full h-12 text-base">
                Continue to Goals
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
