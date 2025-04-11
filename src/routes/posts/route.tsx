import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/posts")({
  component: RouteComponent,
  validateSearch: (search) =>
    search as {
      category: "all" | "fantasy" | "horror";
      releaseDate: "all" | "2024" | "2025";
    },

  beforeLoad: async ({ context, search }) => {
    if (!context.user) {
      throw redirect({
        to: "/signin",

        search: {
          returnTo: `/posts?category=${search.category || "all"}&releaseDate=${search.releaseDate || "all"}`,
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
