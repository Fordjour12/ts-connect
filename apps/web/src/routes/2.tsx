import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/2")({
  component: LandingTwo,
});

const READOUT = [
  { label: "Budget Pressure", value: "MODERATE", color: "text-[#f8c25b]" },
  { label: "Savings Velocity", value: "STABLE", color: "text-[#6cf7d8]" },
  { label: "Risk Horizon", value: "CLEAR", color: "text-[#8ce4ff]" },
] as const;

function LandingTwo() {
  return (
    <main
      className="relative min-h-full overflow-hidden bg-background text-[#dcf7ff]"
      style={{
        fontFamily: '"IBM Plex Mono", "SFMono-Regular", Menlo, monospace',
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(38,179,255,0.2),transparent_50%),radial-gradient(circle_at_80%_0%,rgba(109,255,163,0.22),transparent_40%),linear-gradient(to_bottom,rgba(7,11,16,0.6),#070b10)]"
      />
      <div aria-hidden className="scanline absolute inset-0 opacity-35" />

      <section className="relative mx-auto grid max-w-6xl gap-8 px-6 py-10 lg:grid-cols-[1fr_1fr] lg:py-14">
        <div className="space-y-7">
          <p className="inline-flex border border-[#2f4d5b] bg-[#0f1720] px-3 py-1 text-[11px] tracking-[0.16em] uppercase">
            Concept 02 / Orbital Console
          </p>

          <h1 className="max-w-xl text-4xl leading-tight text-balance sm:text-5xl">
            Your finance co-pilot for high-signal decision windows.
          </h1>

          <p className="max-w-xl text-sm leading-relaxed text-[#99c4cf] sm:text-base">
            This layout mimics a mission control display. Inputs stay minimal. Explanations stay
            explicit. The interface asks one precise question before recommending one next move.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/dashboard"
              className="border border-[#6cf7d8] bg-[#0d1a19] px-4 py-2 text-sm text-[#6cf7d8] transition-colors hover:bg-[#132826]"
            >
              Open Dashboard
            </Link>
            <Link
              to="/3"
              className="border border-[#355666] bg-[#0d1a22] px-4 py-2 text-sm text-[#b6e3f1] transition-colors hover:bg-[#123145]"
            >
              Next Concept
            </Link>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="rounded-2xl border border-[#26404b] bg-[#0b141b]/90 p-5 shadow-[0_0_35px_rgba(67,202,245,0.16)]">
            <p className="mb-4 text-[11px] tracking-[0.18em] text-[#72c8dc] uppercase">
              Live Readout
            </p>
            <div className="space-y-3">
              {READOUT.map((line) => {
                return (
                  <div
                    key={line.label}
                    className="grid grid-cols-[1fr_auto] gap-2 border-b border-[#1e313a] pb-2 text-sm"
                  >
                    <span className="text-[#93b8c4]">{line.label}</span>
                    <span className={line.color}>{line.value}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-[#26404b] bg-[#0b141b]/90 p-5">
            <p className="text-[11px] tracking-[0.18em] text-[#72c8dc] uppercase">Pilot Prompt</p>
            <p className="mt-3 text-sm leading-relaxed text-[#b8d5df]">
              "Unexpected weekend expense detected. Do you want to rebalance dining cap or reduce
              travel this week?"
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
