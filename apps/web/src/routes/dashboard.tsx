import { createFileRoute } from "@tanstack/react-router";
import { CreditCard, Gauge, Mail, Search, Settings } from "lucide-react";

import { getUser } from "@/functions/get-user";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
  loader: async () => {
    const session = await getUser();
    return { session };
  },
});

function RouteComponent() {
  const { session } = Route.useLoaderData();
  const firstName = session?.user.name?.split(" ")[0] ?? "there";

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-2xl border bg-card">
        <div className="grid lg:grid-cols-[260px_1fr]">
          <aside className="border-r p-4">
            <div className="mb-4 rounded-xl border bg-secondary p-3">
              <p className="text-xs text-muted-foreground uppercase">Agency</p>
              <p className="font-semibold">Spark Pixel Team</p>
            </div>

            <MenuGroup
              title="Main Menu"
              items={["Dashboard", "Products", "Transactions", "Reports", "Messages", "Team"]}
            />
            <MenuGroup title="Customers" items={["Customer List", "Channels", "Order Management"]} />
            <MenuGroup title="Management" items={["Roles", "Billing", "Integrations"]} />
          </aside>

          <div className="p-4">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-secondary px-3 py-2">
              <p className="text-sm text-muted-foreground">
                Dashboard <span className="mx-1">›</span>{" "}
                <span className="font-medium text-foreground">Overview</span>
              </p>
              <div className="relative w-full sm:w-64">
                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input className="pl-9" placeholder="Search..." />
              </div>
            </div>

            <h1 className="mb-4 text-4xl font-semibold tracking-tight [font-family:'IBM_Plex_Mono',monospace]">
              Welcome back, {firstName}
            </h1>

            <div className="mb-4 grid gap-3 md:grid-cols-3">
              <KpiCard title="TOTAL REVENUE" value="$20,320" note="+0.94 last year" />
              <KpiCard title="TOTAL ORDERS" value="10,320" note="+0.94 last year" />
              <KpiCard title="NEW CUSTOMERS" value="4,305" note="+0.94 last year" />
            </div>

            <Card>
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle className="text-sm tracking-[0.14em] text-muted-foreground uppercase">
                  Sales Trend
                </CardTitle>
                <Button variant="ghost" size="sm">
                  <Settings className="size-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm text-muted-foreground">
                    Total Revenue:{" "}
                    <span className="text-4xl font-semibold text-foreground [font-family:'IBM_Plex_Mono',monospace]">
                      $20,320
                    </span>
                  </p>
                  <div className="flex items-center gap-2 rounded-full border bg-secondary p-1 text-xs">
                    <Button size="xs" variant="ghost">
                      Weekly
                    </Button>
                    <Button size="xs" variant="secondary">
                      Monthly
                    </Button>
                    <Button size="xs" variant="ghost">
                      Yearly
                    </Button>
                  </div>
                </div>

                <div className="rounded-xl border bg-secondary/40 p-3">
                  <div className="grid grid-cols-12 gap-1 sm:gap-1.5">
                    {Array.from({ length: 12 }).map((_, month) => (
                      <div key={month} className="space-y-1">
                        {Array.from({ length: 18 }).map((__, row) => {
                          const level = (month * 7 + row * 3) % 10;
                          const active = level > 4;
                          return (
                            <div
                              key={`${month}-${row}`}
                              className={
                                active ? "h-2 rounded-[3px] bg-foreground" : "h-2 rounded-[3px] bg-border"
                              }
                            />
                          );
                        })}
                      </div>
                    ))}
                  </div>
                  <Separator className="my-3" />
                  <div className="grid grid-cols-12 text-center text-[10px] tracking-widest text-muted-foreground uppercase sm:text-xs">
                    {[
                      "Jan",
                      "Feb",
                      "Mar",
                      "Apr",
                      "May",
                      "Jun",
                      "Jul",
                      "Aug",
                      "Sep",
                      "Oct",
                      "Nov",
                      "Dec",
                    ].map((m) => (
                      <span key={m}>{m}</span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}

function MenuGroup({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mb-4">
      <p className="mb-2 text-sm font-medium">{title}</p>
      <div className="space-y-1">
        {items.map((item, index) => (
          <div
            key={item}
            className={
              index === 0 && title === "Main Menu"
                ? "flex items-center gap-2 rounded-lg border bg-secondary px-2 py-1.5 text-sm"
                : "flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-muted-foreground"
            }
          >
            {title === "Main Menu" && <Gauge className="size-3.5" />}
            {title === "Customers" && <CreditCard className="size-3.5" />}
            {title === "Management" && <Mail className="size-3.5" />}
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function KpiCard({ title, value, note }: { title: string; value: string; note: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription className="text-xs tracking-[0.14em] uppercase">{title}</CardDescription>
        <CardTitle className="text-4xl [font-family:'IBM_Plex_Mono',monospace]">{value}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-success">{note}</p>
      </CardContent>
    </Card>
  );
}
