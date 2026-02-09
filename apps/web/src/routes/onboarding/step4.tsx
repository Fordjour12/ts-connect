import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { useState } from "react";

import { StepIndicator } from "@/components/onboarding/step-indicator";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, 
  Wallet, 
  ArrowRight,
  DollarSign,
  PiggyBank,
  CreditCard,
  TrendingUp
} from "lucide-react";

export const Route = createFileRoute("/onboarding/step4")({
  component: Step5Component,
});

function Step5Component() {
  const accountForm = useForm({
    defaultValues: {
      accountName: "",
      accountType: "",
      initialBalance: "",
    },
    onSubmit: async ({ value }) => {
      if (!value.accountName || !value.accountType) {
        toast.error("Please fill in all account details");
        return;
      }

      try {
        const response = await fetch("/api/accounts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: value.accountName,
            type: value.accountType,
            balance: value.initialBalance ? Number(value.initialBalance) : 0,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to create account");
        }

        toast.success("Account created! Let's add a sample transaction.");
        showTransactionForm();
      } catch (error) {
        toast.error("Failed to create account. Please try again.");
      }
    },
  });

  const transactionForm = useForm({
    defaultValues: {
      description: "",
      amount: "",
      category: "",
      type: "",
    },
    onSubmit: async ({ value }) => {
      if (!value.description || !value.amount || !value.category || !value.type) {
        toast.error("Please fill in all transaction details");
        return;
      }

      try {
        const response = await fetch("/api/transactions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            description: value.description,
            amount: Number(value.amount),
            category: value.category,
            type: value.type,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to create transaction");
        }

        toast.success("Transaction added! You're all set.");
        // Navigate to dashboard preview
        setTimeout(() => {
          window.location.href = "/onboarding/step5";
        }, 1000);
      } catch (error) {
        toast.error("Failed to create transaction. Please try again.");
      }
    },
  });

  const [showTransaction, setShowTransaction] = useState(false);

  const showTransactionForm = () => {
    setShowTransaction(true);
  };

  const accountTypes = [
    { value: "checking", label: "Checking Account", icon: Wallet },
    { value: "savings", label: "Savings Account", icon: PiggyBank },
    { value: "credit", label: "Credit Card", icon: CreditCard },
    { value: "cash", label: "Cash", icon: DollarSign },
    { value: "investment", label: "Investment Account", icon: TrendingUp },
  ];

  const sampleTransactions = [
    {
      description: "Morning coffee",
      amount: "4.50",
      category: "Food & Drink",
      type: "expense",
    },
    {
      description: "Salary deposit",
      amount: "3500.00",
      category: "Income",
      type: "income",
    },
    {
      description: "Grocery shopping",
      amount: "127.84",
      category: "Groceries",
      type: "expense",
    },
  ];

  const fillSampleTransaction = (sample: typeof sampleTransactions[0]) => {
    transactionForm.state.values.description = sample.description;
    transactionForm.state.values.amount = sample.amount;
    transactionForm.state.values.category = sample.category;
    transactionForm.state.values.type = sample.type;
  };

  if (showTransaction) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <StepIndicator currentStep={5} className="mb-8" />

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-3">
              Add Your First Transaction
            </h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              Let's see your account in action by adding a sample transaction. 
              You can always add more later!
            </p>
          </div>

          <Card className="border-2">
            <CardContent className="p-8">
              <div className="mb-6">
                <Label className="text-sm text-muted-foreground mb-3 block">
                  Quick examples to get you started:
                </Label>
                <div className="space-y-2">
                  {sampleTransactions.map((sample, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => fillSampleTransaction(sample)}
                      className="w-full justify-start text-left h-auto p-3"
                    >
                      <div className="flex items-center justify-between w-full">
                        <div>
                          <div className="font-medium">{sample.description}</div>
                          <div className="text-xs text-muted-foreground">{sample.category}</div>
                        </div>
                        <div className={`font-medium ${
                          sample.type === "income" ? "text-success" : "text-foreground"
                        }`}>
                          {sample.type === "income" ? "+" : "-"}${sample.amount}
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  transactionForm.handleSubmit();
                }}
                className="space-y-6"
              >
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Input
                      id="description"
                      placeholder="What was this for?"
                      value={transactionForm.state.values.description}
                      onChange={(e) => (transactionForm.state.values.description = e.target.value)}
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount *</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={transactionForm.state.values.amount}
                      onChange={(e) => (transactionForm.state.values.amount = e.target.value)}
                      className="h-12"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Type *</Label>
                    <Select
                      value={transactionForm.state.values.type || ""}
                      onValueChange={(value) => {
                        if (value) {
                          transactionForm.state.values.type = value;
                        }
                      }}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="income">Income</SelectItem>
                        <SelectItem value="expense">Expense</SelectItem>
                        <SelectItem value="transfer">Transfer</SelectItem>
                        <SelectItem value="savings">Savings</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Input
                      id="category"
                      placeholder="e.g., Food, Transport, Salary"
                      value={transactionForm.state.values.category}
                      onChange={(e) => (transactionForm.state.values.category = e.target.value)}
                      className="h-12"
                    />
                  </div>
                </div>

                <Button type="submit" size="lg" className="w-full h-12 text-base">
                  Complete Setup
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <StepIndicator currentStep={5} className="mb-8" />

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-3">
            Create Your First Account
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Let's set up your primary account so you can start tracking transactions. 
            Don't worry, you can add more accounts anytime.
          </p>
        </div>

        <Card className="border-2">
          <CardContent className="p-8">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                accountForm.handleSubmit();
              }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <Label htmlFor="accountName">Account Name *</Label>
                <Input
                  id="accountName"
                  placeholder="e.g., Main Checking, Savings, etc."
                  value={accountForm.state.values.accountName}
                  onChange={(e) => (accountForm.state.values.accountName = e.target.value)}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="accountType">Account Type *</Label>
                <Select
                  value={accountForm.state.values.accountType || ""}
                  onValueChange={(value) => {
                    if (value) {
                      accountForm.state.values.accountType = value;
                    }
                  }}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="What type of account is this?" />
                  </SelectTrigger>
                  <SelectContent>
                    {accountTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <type.icon className="h-4 w-4" />
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="initialBalance">Current Balance (Optional)</Label>
                <Input
                  id="initialBalance"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={accountForm.state.values.initialBalance}
                  onChange={(e) => (accountForm.state.values.initialBalance = e.target.value)}
                  className="h-12"
                />
                <p className="text-xs text-muted-foreground">
                  Leave as 0 if you want to start fresh, or enter your current balance
                </p>
              </div>

              <Button type="submit" size="lg" className="w-full h-12 text-base">
                Create Account
                <Plus className="h-4 w-4 ml-2" />
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Button
            variant="ghost"
            onClick={() => window.location.href = "/onboarding/step5"}
            className="text-muted-foreground"
          >
            Skip for now
          </Button>
        </div>
      </div>
    </div>
  );
}
