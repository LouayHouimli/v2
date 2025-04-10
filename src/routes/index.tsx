import { createFileRoute, useRouter } from "@tanstack/react-router";
import { User } from "better-auth";
import Navbar from "~/lib/components/Navbar";
export const Route = createFileRoute("/")({
  component: Home,
  loader: ({ context }) => {
    return { user: context.user };
  },
});

function Home() {
  const { queryClient } = Route.useRouteContext();
  const { user } = Route.useLoaderData();
  const router = useRouter();

  return (
    <div>
      <Navbar user={user as User} />
      <div className="text-4xl font-bold flex items-center justify-center h-screen">
        Welcome {user ? user.name.split(" ")[0] + " to louli.tech" : "to louli.tech"}
      </div>
    </div>
  );
}
