import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div>
      <div className="flex items-center justify-center">
        <h1 className="text-2xl font-bold">Welcome to the home page</h1>
      </div>
    </div>
  );
}
