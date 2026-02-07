import { createFileRoute } from "@tanstack/react-router";

import { Signup } from "@/components/sign-up";

export const Route = createFileRoute("/signup")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex min-h-svh items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Signup />
      </div>
    </div>
  );
}
