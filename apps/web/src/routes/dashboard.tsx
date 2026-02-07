import { createFileRoute } from "@tanstack/react-router";

import { getUser } from "@/functions/get-user";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
  loader: async () => {
    const session = await getUser();
    return { session };
  },
});

function RouteComponent() {
  const data = Route.useLoaderData();

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome {data.session?.user.name}</p>
    </div>
  );
}
