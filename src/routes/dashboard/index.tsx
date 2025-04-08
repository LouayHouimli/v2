import { createFileRoute } from "@tanstack/react-router";
import { createPost } from "~/lib/actions/posts.actions";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardIndex,
});

function DashboardIndex() {
  // const posts = getPosts();
  return (
    <div className="flex flex-col gap-1">
      Dashboard index page
      <pre className="rounded-md border bg-card p-1 text-card-foreground">
        routes/dashboard/index.tsx
      </pre>
      <form
        action={(formData) => {
          createPost({
            data: {
              title: formData.get("title") as string,
              content: formData.get("content") as string,
            },
          });
        }}
        className="flex flex-col gap-1  p-1 justify-center items-center"
      >
        <input type="text" name="title" className="border p-1" />
        <input type="text" name="content" className="border p-1" />
        <button type="submit" className="border p-1">
          Create Post
        </button>
      </form>
    </div>
  );
}
