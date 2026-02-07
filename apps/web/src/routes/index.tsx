import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

const SIGNALS = [
  {
    title: "Drift detected early",
    description: "Spending moved +12% over your baseline before it became a problem.",
    tone: "text-emerald-400",
    icon: "●",
  },
  {
    title: "Stability improving",
    description: "Essentials stayed consistent for 3 weeks while savings held steady.",
    tone: "text-amber-400",
    icon: "◆",
  },
  {
    title: "Clear next step",
    description: "Shift one category cap by 8% to protect this month's goal.",
    tone: "text-sky-400",
    icon: "▲",
  },
] as const;

const PRINCIPLES = [
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
    <div className="min-h-screen bg-[color:var(--background)] text-[color:var(--foreground)] selection:bg-emerald-500/30">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(34,197,94,0.03)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_60%,rgba(14,165,233,0.03)_0%,transparent_50%)]" />
      </div>

      <header className="relative border-b border-[color:var(--border)]">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 rounded-full bg-gradient-to-br from-emerald-400/60 to-sky-400/60" />
            <span className="text-sm font-medium tracking-wide text-[color:var(--foreground)]">
              Regulate
            </span>
          </div>
          <nav className="flex items-center gap-6">
            <Link
              to="/login"
              className="text-sm text-[color:var(--muted-foreground)] transition-colors hover:text-[color:var(--foreground)]"
            >
              Sign in
            </Link>
            <Link
              to="/login"
              className="rounded-lg bg-[color:var(--primary)] px-4 py-2 text-sm font-medium text-[color:var(--primary-foreground)] transition-all hover:scale-[1.02]"
            >
              Get started
            </Link>
          </nav>
        </div>
      </header>

      <main className="relative mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24 lg:py-32">
        <section className="mb-24 grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--muted)] px-3 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs tracking-[0.12em] uppercase text-[color:var(--muted-foreground)]">
                Financial self-regulation
              </span>
            </div>

            <h1 className="font-sans text-4xl leading-[1.1] tracking-tight text-[color:var(--foreground)] sm:text-5xl lg:text-6xl">
              Someone thoughtful
              <br />
              <span className="text-[color:var(--muted-foreground)]">helping you think</span>
              <br />
              <span className="bg-gradient-to-r from-[color:var(--foreground)] via-[color:var(--muted-foreground)] to-[color:var(--muted-foreground)] bg-clip-text text-transparent">
                clearly about money.
              </span>
            </h1>

            <p className="max-w-lg text-base leading-relaxed text-[color:var(--muted-foreground)] sm:text-lg">
              Not a bank. Not spreadsheets. A calm space that surfaces trends, explains what
              changed, and helps you respond before stress compounds.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/login"
                className="group relative overflow-hidden rounded-xl bg-[color:var(--primary)] px-6 py-2.5 text-sm font-medium text-[color:var(--primary-foreground)] transition-all hover:scale-[1.02]"
              >
                <span className="relative z-10">Start your setup</span>
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/20 to-transparent transition-transform duration-300 group-hover:translate-x-0" />
              </Link>
              <Link
                to="/dashboard"
                className="rounded-xl border border-[color:var(--border)] bg-[color:var(--secondary)] px-6 py-2.5 text-sm font-medium text-[color:var(--secondary-foreground)] transition-all hover:bg-[color:var(--accent)]"
              >
                View dashboard
              </Link>
            </div>
          </div>

          <div className="relative rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-6 sm:p-8 shadow-xl">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/5 via-transparent to-sky-500/5" />
            <div className="relative space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs tracking-[0.12em] uppercase text-[color:var(--muted-foreground)]">
                  This week at a glance
                </span>
                <span className="text-xs text-[color:var(--muted-foreground)]">Week 4, Jan</span>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[color:var(--muted-foreground)]">Spending stability</span>
                    <span className="text-emerald-500">Steady</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-[color:var(--muted)]">
                    <div className="h-full w-[66%] rounded-full bg-emerald-500/50" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[color:var(--muted-foreground)]">Budget pressure</span>
                    <span className="text-amber-500">Moderate</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-[color:var(--muted)]">
                    <div className="h-full w-1/2 rounded-full bg-amber-500/50" />
                  </div>
                </div>

                <div className="rounded-xl border border-[color:var(--border)] bg-[color:var(--secondary)] p-4">
                  <p className="text-sm leading-relaxed text-[color:var(--foreground)]">
                    You are not behind. You are trending.
                    <span className="block mt-1 text-[color:var(--muted-foreground)]">
                      We guide the next move.
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-24">
          <div className="mb-8 flex items-center gap-3">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[color:var(--border)]" />
            <span className="text-xs tracking-[0.15em] uppercase text-[color:var(--muted-foreground)]">
              Intelligent signals
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[color:var(--border)]" />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {SIGNALS.map((signal, i) => (
              <article
                key={signal.title}
                className="group relative overflow-hidden rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-6 transition-all hover:border-[color:var(--accent)]"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/3 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative">
                  <span className={`mb-3 block text-xs tracking-widest uppercase ${signal.tone}`}>
                    {signal.icon} Signal
                  </span>
                  <h3 className="mb-2 text-lg font-medium text-[color:var(--foreground)]">
                    {signal.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[color:var(--muted-foreground)]">
                    {signal.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="relative mb-24 overflow-hidden rounded-3xl border border-[color:var(--border)] bg-[color:var(--card)] p-8 sm:p-12">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/3 via-transparent to-sky-500/3" />
          <div className="relative grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-6">
              <span className="text-xs tracking-[0.12em] uppercase text-[color:var(--muted-foreground)]">
                The approach
              </span>
              <h2 className="text-2xl leading-tight text-[color:var(--foreground)] sm:text-3xl lg:text-4xl">
                Guidance that feels like a
                <span className="block mt-1 text-[color:var(--muted-foreground)]">
                  thoughtful check-in.
                </span>
              </h2>
              <p className="max-w-md text-sm leading-relaxed text-[color:var(--muted-foreground)] sm:text-base">
                The coach explains why a pattern changed, asks at most one clarifying question, then
                recommends one concrete action for the next 7 days.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {PRINCIPLES.map((principle, i) => (
                <div
                  key={principle.title}
                  className="rounded-xl border border-[color:var(--border)] bg-[color:var(--secondary)] p-5 transition-all hover:bg-[color:var(--accent)]"
                  style={{ animationDelay: `${i * 150}ms` }}
                >
                  <span className="text-xs tracking-widest uppercase text-[color:var(--muted-foreground)]">
                    0{i + 1}
                  </span>
                  <h3 className="mt-2 mb-1 font-medium text-[color:var(--foreground)]">
                    {principle.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-[color:var(--muted-foreground)]">
                    {principle.subtitle}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-transparent to-sky-500/10 p-8 sm:p-10">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(34,197,94,0.02)_25%,rgba(34,197,94,0.02)_75%,transparent_75%,transparent)] bg-[length:8px_8px]" />
          <div className="relative flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <span className="mb-2 inline-block text-xs tracking-[0.12em] uppercase text-emerald-500/80">
                Designed for calm control
              </span>
              <p className="max-w-xl text-base leading-relaxed text-[color:var(--foreground)] sm:text-lg">
                Built for young professionals and creatives who want clarity without spreadsheet
                overload or financial shame loops.
              </p>
            </div>
            <Link
              to="/login"
              className="shrink-0 rounded-xl bg-emerald-500/20 px-6 py-2.5 text-sm font-medium text-emerald-500 transition-all hover:bg-emerald-500/30 hover:scale-[1.02]"
            >
              Enter the app
            </Link>
          </div>
        </section>
      </main>

      <footer className="relative border-t border-[color:var(--border)] py-12">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 rounded-full bg-gradient-to-br from-emerald-400/60 to-sky-400/60" />
              <span className="text-sm font-medium tracking-wide text-[color:var(--muted-foreground)]">
                Regulate
              </span>
            </div>
            <p className="text-xs text-[color:var(--muted-foreground)]">
              © 2025 Regulate. Financial self-regulation system.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
