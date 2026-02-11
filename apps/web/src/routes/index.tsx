import { Link, createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress, ProgressTrack, ProgressIndicator } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

const CAPABILITIES = [
  {
    title: "Smart Tracking",
    description:
      "Connect accounts, categorize transactions, and see your financial picture at a glance.",
    icon: "◎",
    color: "text-info",
  },
  {
    title: "Decline Detection",
    description:
      "Early warnings for spending spikes, savings drops, and patterns that need attention.",
    icon: "●",
    color: "text-warning",
  },
  {
    title: "AI Coach",
    description:
      "Ask questions, get explanations, and receive personalized guidance without judgment.",
    icon: "◈",
    color: "text-success",
  },
] as const;

const PHILOSOPHY = [
  {
    title: "Explanations first",
    subtitle: "Understanding comes before judgment",
  },
  {
    title: "Signal over noise",
    subtitle: "Only what matters, nothing more",
  },
  {
    title: "Calm guidance",
    subtitle: "Support through uncertainty",
  },
] as const;

function HomeComponent() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-success/30">
      <div className="fixed inset-0 pointer-events-none">
        {/* <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(0,0,0,0.03)_0%,transparent_50%)]" /> */}
        {/* <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_60%,rgba(14,165,233,0.03)_0%,transparent_50%)]" /> */}
      </div>

      <main className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24 lg:py-32">
        <section className="mb-24 grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div className="space-y-8">
            <Badge variant="outline" className="gap-2 border-border bg-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
              <span className="tracking-[0.12em] uppercase">AI-Powered Financial Intelligence</span>
            </Badge>

            <h1 className="font-sans text-4xl leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Financial clarity without
              <br />
              <span className="text-muted-foreground">the spreadsheet overwhelm.</span>
              <br />
              <span className="bg-gradient-to-r from-foreground via-muted-foreground to-muted-foreground bg-clip-text text-transparent">
                A coach that actually helps.
              </span>
            </h1>

            <p className="max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
              Track accounts, detect decline early, and get AI-powered guidance that explains what
              changed and suggests your next move — without guilt or pressure.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button render={<Link to="/auth/login" />}>Start your setup</Button>
              <Button variant="outline" render={<Link to="/dashboard" />}>
                View dashboard
              </Button>
            </div>
          </div>

          <Card className="relative rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xl">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-success/5 via-transparent to-info/5" />
            <div className="relative space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs tracking-[0.12em] uppercase text-muted-foreground">
                  Your Financial Health
                </span>
                <span className="text-xs text-muted-foreground">Week 4, Jan</span>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Health Score</span>
                    <span className="text-success">82/100</span>
                  </div>
                  <Progress value={82}>
                    <ProgressTrack>
                      <ProgressIndicator className="bg-success/50" />
                    </ProgressTrack>
                  </Progress>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Savings Rate</span>
                    <span className="text-success">+12% vs baseline</span>
                  </div>
                  <Progress value={66}>
                    <ProgressTrack>
                      <ProgressIndicator className="bg-success/50" />
                    </ProgressTrack>
                  </Progress>
                </div>

                <Card className="rounded-xl border border-border bg-secondary p-4">
                  <p className="text-sm leading-relaxed text-foreground">
                    <span className="text-warning">⚠</span> Spending in Dining up 23% this week.
                    <span className="block mt-1 text-muted-foreground">
                      Your AI Coach has a suggestion.
                    </span>
                  </p>
                </Card>
              </div>
            </div>
          </Card>
        </section>

        <section className="mb-24">
          <div className="mb-8 flex items-center gap-3">
            <Separator className="flex-1 bg-gradient-to-r from-transparent to-[color:var(--border)]" />
            <span className="text-xs tracking-[0.15em] uppercase text-muted-foreground">
              What Regulate Does
            </span>
            <Separator className="flex-1 bg-gradient-to-l from-transparent to-[color:var(--border)]" />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {CAPABILITIES.map((cap) => (
              <Card
                key={cap.title}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:border-[color:var(--accent)]"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-success/3 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative">
                  <span className={`mb-3 block text-xs tracking-widest uppercase ${cap.color}`}>
                    {cap.icon} {cap.title}
                  </span>
                  <p className="text-sm leading-relaxed text-muted-foreground">{cap.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="relative mb-24 overflow-hidden rounded-3xl border border-border/70 bg-card p-6 sm:p-10">
          <div className="absolute inset-0 bg-gradient-to-br from-muted/35 via-transparent to-transparent" />
          <div className="relative mb-8">
            <span className="text-xs tracking-[0.12em] uppercase text-muted-foreground">
              How It Works
            </span>
            <h2 className="mt-3 text-2xl leading-tight text-foreground sm:text-3xl lg:text-4xl">
              From tracking to action,
              <span className="mt-1 block text-muted-foreground">without the overwhelm.</span>
            </h2>
          </div>

          <div className="relative grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12">
            <article className="group relative overflow-hidden rounded-2xl border border-border bg-secondary/35 p-5 shadow-md transition-all duration-300 hover:-translate-y-1 sm:col-span-1 lg:col-span-4">
              <p className="text-lg font-semibold text-foreground">Track</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Connect accounts and log transactions automatically.
              </p>
              <div className="mt-5 rounded-xl border border-border bg-card p-3">
                <div className="mb-3 h-2 w-20 rounded-full bg-muted" />
                <div className="space-y-2">
                  <div className="flex items-center justify-between rounded-md border border-border bg-muted/60 px-2 py-1.5">
                    <span className="text-xs text-muted-foreground">Checking</span>
                    <span className="text-xs font-medium text-foreground">$4,320</span>
                  </div>
                  <div className="flex items-center justify-between rounded-md border border-border bg-muted/60 px-2 py-1.5">
                    <span className="text-xs text-muted-foreground">Savings</span>
                    <span className="text-xs font-medium text-foreground">$9,110</span>
                  </div>
                  <div className="h-16 rounded-md border border-border bg-[linear-gradient(90deg,var(--border)_1px,transparent_1px)] bg-[length:12px_100%]" />
                </div>
              </div>
            </article>

            <article className="group relative overflow-hidden rounded-2xl border border-border bg-secondary/35 p-5 shadow-md transition-all duration-300 hover:-translate-y-1 sm:col-span-1 lg:col-span-4">
              <p className="text-lg font-semibold text-foreground">Detect</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                We spot patterns and early warning signs.
              </p>
              <div className="mt-5 rounded-xl border border-border bg-card p-3">
                <div className="grid min-h-40 grid-cols-5 gap-2">
                  <div className="col-span-3 rounded-lg bg-[repeating-linear-gradient(90deg,var(--border)_0_1px,transparent_1px_10px)]" />
                  <div className="col-span-2 space-y-2">
                    <div className="h-7 rounded-md border border-border bg-muted/60" />
                    <div className="h-7 rounded-md border border-border bg-muted/60" />
                    <div className="h-7 rounded-md border border-border bg-muted/60" />
                  </div>
                </div>
              </div>
            </article>

            <article className="group relative overflow-hidden rounded-2xl border border-border bg-secondary/35 p-5 shadow-md transition-all duration-300 hover:-translate-y-1 sm:col-span-2 lg:col-span-4">
              <p className="text-lg font-semibold text-foreground">Explain</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                AI tells you why your financial picture changed.
              </p>
              <div className="mt-5 rounded-xl border border-border bg-card p-3">
                <div className="space-y-2">
                  <div className="h-7 w-2/3 rounded-md bg-muted" />
                  <div className="h-7 rounded-md border border-border bg-muted/60" />
                  <div className="h-7 rounded-md border border-border bg-muted/60" />
                  <div className="h-7 w-5/6 rounded-md border border-border bg-muted/60" />
                  <div className="h-20 rounded-md border border-border bg-muted/60" />
                </div>
              </div>
            </article>

            <article className="group relative overflow-hidden rounded-2xl border border-border bg-secondary/35 p-5 shadow-md transition-all duration-300 hover:-translate-y-1 sm:col-span-2 lg:col-span-5">
              <p className="text-lg font-semibold text-foreground">Suggest</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Practical, safe recommendations for your next steps.
              </p>
              <div className="relative mt-5 rounded-xl border border-border bg-card p-4">
                <div className="absolute top-3 right-3 rounded-full bg-foreground px-2 py-0.5 text-[10px] tracking-wide text-background uppercase">
                  Safe mode
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-border bg-muted/60 p-3">
                    <p className="text-xs text-muted-foreground">Trim dining budget</p>
                    <div className="mt-2 h-2 w-full rounded-full bg-muted">
                      <div className="h-2 w-2/3 rounded-full bg-foreground" />
                    </div>
                  </div>
                  <div className="rounded-lg border border-border bg-muted/60 p-3">
                    <p className="text-xs text-muted-foreground">Move to emergency fund</p>
                    <div className="mt-2 h-2 w-full rounded-full bg-muted">
                      <div className="h-2 w-1/2 rounded-full bg-muted-foreground/70" />
                    </div>
                  </div>
                </div>
                <div className="mt-3 rounded-md border border-border bg-muted/60 px-3 py-2 text-sm text-muted-foreground">
                  Priority this week: one change, low effort.
                </div>
              </div>
            </article>

            <article className="group relative overflow-hidden rounded-2xl border border-border bg-secondary/35 p-5 shadow-md transition-all duration-300 hover:-translate-y-1 sm:col-span-2 lg:col-span-7">
              <p className="text-lg font-semibold text-foreground">Apply + Adapt</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                One click to act, then the plan adjusts to real life.
              </p>
              <div className="mt-5 rounded-xl border border-border bg-card p-4">
                <div className="flex items-center justify-between rounded-lg border border-border bg-muted/60 px-3 py-2">
                  <span className="text-xs text-muted-foreground">Autopilot suggestion</span>
                  <span className="rounded-full bg-foreground px-2 py-0.5 text-xs text-background">
                    Applied
                  </span>
                </div>
                <div className="mt-3 space-y-2">
                  <div className="h-3 w-full rounded-full bg-muted">
                    <div className="h-3 w-[72%] rounded-full bg-foreground" />
                  </div>
                  <div className="h-3 w-full rounded-full bg-muted">
                    <div className="h-3 w-[48%] rounded-full bg-muted-foreground/70" />
                  </div>
                </div>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  <div className="rounded-md border border-border bg-muted/60 px-3 py-2 text-xs text-muted-foreground">
                    Tough month detected: pressure reduced.
                  </div>
                  <div className="rounded-md border border-border bg-muted/60 px-3 py-2 text-xs text-muted-foreground">
                    Targets rebalanced for consistency.
                  </div>
                </div>
              </div>
            </article>
          </div>
        </section>

        <section className="relative mb-24 overflow-hidden rounded-3xl border border-border bg-card p-8 sm:p-12">
          <div className="absolute inset-0 bg-gradient-to-br from-success/3 via-transparent to-info/3" />
          <div className="relative grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-6">
              <span className="text-xs tracking-[0.12em] uppercase text-muted-foreground">
                The Approach
              </span>
              <h2 className="text-2xl leading-tight text-foreground sm:text-3xl lg:text-4xl">
                Guidance that feels like a
                <span className="block mt-1 text-muted-foreground">thoughtful check-in.</span>
              </h2>
              <p className="max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
                The AI Coach explains why a pattern changed, asks at most one clarifying question,
                then recommends one concrete action for the next 7 days.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {PHILOSOPHY.map((principle, i) => (
                <Card
                  key={principle.title}
                  className="rounded-xl border border-border bg-secondary p-5 transition-all hover:bg-accent"
                  style={{ animationDelay: `${i * 150}ms` }}
                >
                  <span className="text-xs tracking-widest uppercase text-muted-foreground">
                    0{i + 1}
                  </span>
                  <h3 className="mt-2 mb-1 font-medium text-foreground">{principle.title}</h3>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {principle.subtitle}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden rounded-2xl border border-success/20 bg-gradient-to-br from-success/10 via-transparent to-info/10 p-8 sm:p-10">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(34,197,94,0.02)_25%,rgba(34,197,94,0.02)_75%,transparent_75%,transparent)] bg-[length:8px_8px]" />
          <div className="relative flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <span className="mb-2 inline-block text-xs tracking-[0.12em] uppercase text-success/80">
                Built for Real Life
              </span>
              <p className="max-w-xl text-base leading-relaxed text-foreground sm:text-lg">
                Bad months happen. Burnout is real. Regulate adapts to your situation with safety
                modes, reduced-pressure UI, and guidance that meets you where you are.
              </p>
            </div>
            <Button
              render={<Link to="/auth/login" />}
              variant="outline"
              className="shrink-0 bg-success/20 text-success hover:bg-success/30"
            >
              Enter the app
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
