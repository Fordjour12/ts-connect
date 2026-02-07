import { createFileRoute, redirect } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";

import { StepIndicator } from "@/components/onboarding/step-indicator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    },
    onSubmit: async ({ value }) => {
      const payload = {
        currency: value.currency,
        financialStartDate: value.financialStartDate,
        monthlyIncomeMin: value.monthlyIncomeMin ? Number(value.monthlyIncomeMin) : null,
        monthlyIncomeMax: value.monthlyIncomeMax ? Number(value.monthlyIncomeMax) : null,
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

        toast.success("Profile saved successfully");
        throw redirect({ to: "/dashboard" });
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
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4 py-8">
      <StepIndicator currentStep={2} className="mb-8" />

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">Set up your profile</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Step 2 of 2 — Customize your experience
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-6"
        >
          <div className="space-y-2">
            <Label htmlFor="currency">Currency *</Label>
            <select
              id="currency"
              name="currency"
              value={form.state.values.currency}
              onChange={(e) => (form.state.values.currency = e.target.value)}
              className={cn(
                "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2",
                "text-sm ring-offset-background focus-visible:outline-none",
                "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              )}
            >
              <option value="">Select a currency</option>
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.symbol} {currency.code} — {currency.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="financialStartDate">Financial Start Date *</Label>
            <Input
              id="financialStartDate"
              name="financialStartDate"
              type="date"
              max={new Date().toISOString().split("T")[0]}
              value={form.state.values.financialStartDate}
              onChange={(e) => (form.state.values.financialStartDate = e.target.value)}
            />
          </div>

          <div className="space-y-3 pt-4 border-t">
            <Label className="text-sm text-muted-foreground">Monthly Income Range (Optional)</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="monthlyIncomeMin" className="text-xs">
                  Minimum
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                    {currencySymbol}
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
                    className="pl-7"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="monthlyIncomeMax" className="text-xs">
                  Maximum
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                    {currencySymbol}
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
                    className="pl-7"
                  />
                </div>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full">
            Continue to Dashboard
          </Button>
        </form>
      </div>
    </div>
  );
}
