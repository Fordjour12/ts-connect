import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/3")({
  component: ConceptThree,
});

const ARTIFACTS = [
  { label: "Pattern", value: "Recurring", offset: 0 },
  { label: "Drift", value: "+12.4%", offset: 20 },
  { label: "Velocity", value: "0.8x", offset: 40 },
  { label: "Momentum", value: "Building", offset: 60 },
  { label: "Signal", value: "Clear", offset: 80 },
] as const;

const ENTITIES = [
  { name: "Consciousness", status: "coherent", weight: 73 },
  { name: "Intention", status: "drifting", weight: 54 },
  { name: "Behavior", status: "aligned", weight: 89 },
  { name: "Desire", status: "fluctuating", weight: 41 },
] as const;

function ConceptThree() {
  return (
    <div className="min-h-screen bg-[color:var(--background)] text-[color:var(--foreground)] overflow-x-hidden selection:bg-[color:var(--foreground)] selection:text-[color:var(--background)]">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(transparent_1px,#000_1px),linear-gradient(90deg,transparent_1px,#000_1px)] bg-[length:4rem_4rem] opacity-[0.03]" />
        <div className="absolute right-0 top-0 h-[80vh] w-px bg-gradient-to-b from-transparent via-[color:var(--foreground)] to-transparent opacity-10" />
        <div className="absolute left-0 bottom-0 h-px w-[60vw] bg-gradient-to-r from-[color:var(--foreground)] via-transparent to-transparent opacity-10" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="border-b border-[color:var(--border)] bg-[color:var(--background)]/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="mx-auto flex h-14 items-center justify-between px-6 max-w-screen-2xl">
            <span className="font-mono text-xs tracking-[0.3em] uppercase text-[color:var(--muted-foreground)]">
              Concept 03
            </span>
            <nav className="flex items-center gap-8">
              <a
                href="#"
                className="font-mono text-xs tracking-widest uppercase text-[color:var(--foreground)] hover:opacity-50 transition-opacity"
              >
                Index
              </a>
              <a
                href="#"
                className="font-mono text-xs tracking-widest uppercase text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] transition-colors"
              >
                Log
              </a>
              <a
                href="#"
                className="font-mono text-xs tracking-widest uppercase text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] transition-colors"
              >
                Output
              </a>
            </nav>
          </div>
        </header>

        <main className="flex-1 px-6 py-16 max-w-screen-2xl mx-auto w-full">
          <section className="mb-32">
            <div className="grid lg:grid-cols-12 gap-12">
              <div className="lg:col-span-7">
                <h1 className="text-[length:clamp(3rem,10vw,9rem)] leading-[0.85] tracking-tighter font-bold text-[color:var(--foreground)] mb-8">
                  PATTERN
                  <br />
                  <span className="text-[color:var(--muted-foreground)]">RECOG</span>
                  <br />
                  NITION
                </h1>
                <p className="font-mono text-xs uppercase tracking-widest text-[color:var(--muted-foreground)] mb-12 max-w-md">
                  System v3.4 // Coherence detection algorithm engaged
                </p>

                <div className="space-y-1">
                  {ARTIFACTS.map((item, i) => (
                    <div
                      key={item.label}
                      className="group flex items-baseline justify-between border-b border-[color:var(--border)] py-3 hover:bg-[color:var(--muted)] transition-colors cursor-default"
                      style={{ paddingLeft: `${item.offset}px` }}
                    >
                      <span className="font-mono text-xs uppercase tracking-widest text-[color:var(--muted-foreground)] group-hover:text-[color:var(--foreground)] transition-colors">
                        {item.label}
                      </span>
                      <span className="font-mono text-sm text-[color:var(--foreground)] group-hover:translate-x-2 transition-transform duration-300">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col justify-between">
                <div className="relative">
                  <div className="aspect-square rounded-full border border-[color:var(--foreground)] relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.1)_70%,rgba(0,0,0,0.3)_100%)]" />
                    <svg
                      className="w-full h-full animate-[spin_60s_linear_infinite]"
                      viewBox="0 0 100 100"
                    >
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="0.2"
                        className="text-[color:var(--muted-foreground)]"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="35"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="0.2"
                        className="text-[color:var(--foreground)]"
                        opacity="0.6"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="25"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="0.2"
                        className="text-[color:var(--muted-foreground)]"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="15"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="0.2"
                        className="text-[color:var(--foreground)]"
                        opacity="0.4"
                      />
                      {[...Array(12)].map((_, i) => (
                        <line
                          key={i}
                          x1="50"
                          y1="0"
                          x2="50"
                          y2="8"
                          stroke="currentColor"
                          strokeWidth="0.3"
                          transform={`rotate(${i * 30} 50 50)`}
                          className="text-[color:var(--foreground)]"
                        />
                      ))}
                      {[...Array(60)].map((_, i) => (
                        <line
                          key={i}
                          x1="50"
                          y1="0"
                          x2="50"
                          y2="4"
                          stroke="currentColor"
                          strokeWidth="0.15"
                          transform={`rotate(${i * 6} 50 50)`}
                          className="text-[color:var(--muted-foreground)]"
                        />
                      ))}
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-mono text-2xl tracking-[0.3em] uppercase text-[color:var(--foreground)]">
                        73%
                      </span>
                    </div>
                  </div>
                  <div className="absolute -bottom-4 -right-4 font-mono text-xs tracking-widest text-[color:var(--muted-foreground)]">
                    COHERENCE INDEX
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-32">
            <div className="border-t border-[color:var(--border)] pt-8">
              <div className="grid lg:grid-cols-4 gap-px bg-[color:var(--border)]">
                {ENTITIES.map((entity, i) => (
                  <div
                    key={entity.name}
                    className="bg-[color:var(--background)] p-6 hover:bg-[color:var(--muted)] transition-colors duration-500"
                  >
                    <div className="flex items-baseline justify-between mb-4">
                      <span className="font-mono text-xs uppercase tracking-widest text-[color:var(--muted-foreground)]">
                        0{i + 1}
                      </span>
                      <span
                        className={`font-mono text-[10px] uppercase tracking-widest ${
                          entity.status === "coherent"
                            ? "text-emerald-600"
                            : entity.status === "aligned"
                              ? "text-sky-600"
                              : entity.status === "drifting"
                                ? "text-amber-600"
                                : "text-neutral-500"
                        }`}
                      >
                        {entity.status}
                      </span>
                    </div>
                    <h3 className="text-lg font-medium text-[color:var(--foreground)] mb-4">
                      {entity.name}
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between font-mono text-xs">
                        <span className="text-[color:var(--muted-foreground)]">Weight</span>
                        <span className="text-[color:var(--foreground)]">{entity.weight}/100</span>
                      </div>
                      <div className="h-1 bg-[color:var(--muted)] overflow-hidden">
                        <div
                          className="h-full bg-[color:var(--foreground)] transition-all duration-1000 ease-out"
                          style={{ width: `${entity.weight}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="grid lg:grid-cols-2 gap-12">
            <div className="border border-[color:var(--border)] p-8 relative overflow-hidden group">
              <div className="absolute inset-0 bg-[color:var(--foreground)] opacity-0 group-hover:opacity-[0.02] transition-opacity duration-700" />
              <div className="relative">
                <span className="font-mono text-xs tracking-[0.2em] uppercase text-[color:var(--muted-foreground)] mb-6 block">
                  Input Stream
                </span>
                <div className="space-y-3 font-mono text-sm">
                  <div className="flex gap-3">
                    <span className="text-[color:var(--muted-foreground)]">→</span>
                    <span className="text-[color:var(--foreground)]">
                      Behavioral signature identified
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-[color:var(--muted-foreground)]">→</span>
                    <span className="text-[color:var(--foreground)]">Pattern deviation: 12.4%</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-[color:var(--muted-foreground)]">→</span>
                    <span className="text-[color:var(--foreground)]">
                      Correlation: 0.87 confidence
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-[color:var(--muted-foreground)]">→</span>
                    <span className="text-[color:var(--foreground)]">
                      Prediction: stable trajectory
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-[color:var(--border)] p-8 relative overflow-hidden group">
              <div className="absolute inset-0 bg-[color:var(--foreground)] opacity-0 group-hover:opacity-[0.02] transition-opacity duration-700" />
              <div className="relative">
                <span className="font-mono text-xs tracking-[0.2em] uppercase text-[color:var(--muted-foreground)] mb-6 block">
                  Recommended Action
                </span>
                <p className="text-xl leading-relaxed text-[color:var(--foreground)] mb-6">
                  Maintain current trajectory. Minor adjustment to{" "}
                  <span className="border-b border-[color:var(--foreground)]">
                    intention alignment
                  </span>{" "}
                  will stabilize fluctuations within 7 days.
                </p>
                <button className="font-mono text-xs uppercase tracking-widest bg-[color:var(--foreground)] text-[color:var(--background)] px-6 py-3 hover:opacity-80 transition-opacity">
                  Execute Protocol
                </button>
              </div>
            </div>
          </section>
        </main>

        <footer className="border-t border-[color:var(--border)] py-8 px-6">
          <div className="mx-auto max-w-screen-2xl flex items-center justify-between">
            <span className="font-mono text-xs tracking-widest text-[color:var(--muted-foreground)]">
              REGULATE.SYS / 3.4.0
            </span>
            <Link
              to="/"
              className="font-mono text-xs tracking-widest uppercase text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] transition-colors"
            >
              ← Return
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
