import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/posts")({
  component: RouteComponent,
  validateSearch: (search) => ({
    category: (search?.category as "all" | "fantasy" | "horror" | undefined) || undefined,
    releaseDate:
      (search?.releaseDate as "all" | "2024" | "2025" | undefined) || undefined,
  }),
  beforeLoad: async ({ context, search }) => {
    if (!context.user) {
      const returnTo = `/posts?category=${search?.category || "all"}&releaseDate=${search?.releaseDate || "all"}`;
      throw redirect({
        to: "/signin",
        search: {
          returnTo,
        },
      });
    }
  },
});

function RouteComponent() {
  return (
    <div>
      <Outlet />
    </div>
  );
}
