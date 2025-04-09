import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    if (!context.user) {
      throw redirect({
        to: "/signin",
      });
    }
  },
});

function RouteComponent() {
  return (
    <div>
      <p>This is a protected route</p>
      <Outlet />
    </div>
  );
}
