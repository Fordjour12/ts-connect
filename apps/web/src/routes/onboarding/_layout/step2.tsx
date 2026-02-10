import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { CircleAlertIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { FrameFooter } from "@/components/ui/frame";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Select, SelectItem, SelectPopup, SelectTrigger, SelectValue } from "@/components/ui/select";

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

export const Route = createFileRoute("/onboarding/_layout/step2")({
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
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-6 container mx-auto max-w-3xl">
      <div className="text-center">
        <h1 className="mb-3 text-3xl font-bold tracking-tight">Let's Set Your Foundation</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          We'll personalize your experience with a few basic preferences. Don't worry, you can
          change these anytime.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="font-semibold text-lg mb-2">Financial preferences</h2>
          <p className="text-muted-foreground text-sm">
            Set your base currency, start date, and optional income range for tailored
            recommendations.
          </p>
        </div>
      </div>

      <Form
        className="gap-6"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <Field>
          <FieldLabel htmlFor="currency">Primary Currency *</FieldLabel>
          <FieldDescription>Choose the currency you'll use for tracking expenses and budgets.</FieldDescription>
          <Select
            name="currency"
            value={form.state.values.currency}
            onValueChange={(value) => {
              form.state.values.currency = value || "";
            }}
          >
            <SelectTrigger id="currency" className="h-12">
              <SelectValue placeholder="Select your currency" />
            </SelectTrigger>
            <SelectPopup>
              {currencies.map((currency) => (
                <SelectItem key={currency.code} value={currency.code}>
                  {currency.symbol} {currency.code} - {currency.name}
                </SelectItem>
              ))}
            </SelectPopup>
          </Select>
        </Field>

        <Field>
          <FieldLabel htmlFor="financialStartDate">Financial Start Date *</FieldLabel>
          <FieldDescription>This helps calculate savings trends and performance over time.</FieldDescription>
          <InputGroup className="h-12">
            <InputGroupAddon align="inline-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-muted-foreground"
              >
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                <line x1="16" x2="16" y1="2" y2="6" />
                <line x1="8" x2="8" y1="2" y2="6" />
                <line x1="3" x2="21" y1="10" y2="10" />
              </svg>
            </InputGroupAddon>
            <InputGroupInput
              id="financialStartDate"
              name="financialStartDate"
              type="date"
              max={today}
              value={form.state.values.financialStartDate}
              onChange={(e) => {
                form.state.values.financialStartDate = e.target.value;
              }}
            />
          </InputGroup>
        </Field>

        <div className="rounded-xl border bg-muted/30 p-4 sm:p-5">
          <div className="mb-4">
            <h3 className="font-medium text-sm sm:text-base">Monthly Income Range (Optional)</h3>
            <p className="mt-1 text-muted-foreground text-xs sm:text-sm">
              Add an estimate to improve budget and planning suggestions.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="monthlyIncomeMin">Minimum</FieldLabel>
              <InputGroup className="h-12">
                <InputGroupAddon align="inline-start">
                  <span className="text-muted-foreground text-sm font-medium">
                    {currencySymbol || "$"}
                  </span>
                </InputGroupAddon>
                <InputGroupInput
                  id="monthlyIncomeMin"
                  name="monthlyIncomeMin"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={form.state.values.monthlyIncomeMin}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    form.state.values.monthlyIncomeMin = e.target.value;
                  }}
                />
              </InputGroup>
            </Field>

            <Field>
              <FieldLabel htmlFor="monthlyIncomeMax">Maximum</FieldLabel>
              <InputGroup className="h-12">
                <InputGroupAddon align="inline-start">
                  <span className="text-muted-foreground text-sm font-medium">
                    {currencySymbol || "$"}
                  </span>
                </InputGroupAddon>
                <InputGroupInput
                  id="monthlyIncomeMax"
                  name="monthlyIncomeMax"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={form.state.values.monthlyIncomeMax}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    form.state.values.monthlyIncomeMax = e.target.value;
                  }}
                />
              </InputGroup>
            </Field>
          </div>
        </div>

        <Label className="flex cursor-pointer items-start gap-2 rounded-lg border p-3 hover:bg-accent/50 has-data-checked:border-primary/48 has-data-checked:bg-accent/50">
          <Checkbox
            checked={form.state.values.privacyOptIn}
            onCheckedChange={(checked) => {
              form.state.values.privacyOptIn = Boolean(checked);
            }}
          />
          <div className="space-y-1">
            <p className="font-medium text-sm text-foreground">Help improve financial insights</p>
            <p className="text-muted-foreground text-xs">
              Share anonymized spending patterns to improve recommendations. You can opt out
              anytime.
            </p>
          </div>
        </Label>

        <Button type="submit" size="lg" className="h-12 w-full text-base">
          Continue to Goals
        </Button>
      </Form>

      <FrameFooter>
        <div className="flex gap-2 text-muted-foreground text-xs">
          <CircleAlertIcon className="mt-0.5 size-3.5 shrink-0" />
          <p>Your settings are private and can be updated later in account preferences.</p>
        </div>
      </FrameFooter>
    </div>
  );
}
