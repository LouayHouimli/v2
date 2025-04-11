import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { parseAsString, useQueryState } from "nuqs";
import { createPost } from "~/lib/actions/posts.actions";
import { Button } from "~/lib/components/ui/button";

export const Route = createFileRoute("/posts/new")({
  component: NewPostComponent,
  validateSearch: (search) => ({
    category: (search?.category as "all" | "fantasy" | "horror" | undefined) || undefined,
    releaseDate:
      (search?.releaseDate as "all" | "2024" | "2025" | undefined) || undefined,
  }),
  loader: async ({ context }) => {
    return {
      user: context.user,
    };
  },
});

function NewPostComponent() {
  const { category, releaseDate } = Route.useSearch();
  const [categoryState, setCategory] = useQueryState(
    "",
    parseAsString.withDefault(category || "fantasy"),
  );
  const [titleState, setTitle] = useQueryState("title", {
    defaultValue: "",
  });
  const [contentState, setContent] = useQueryState("content", {
    defaultValue: "",
  });
  const [releaseDateState, setReleaseDate] = useQueryState("releaseDate", {
    defaultValue: releaseDate || "",
  });
  const queryClient = useQueryClient();
  const { user } = Route.useLoaderData();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createPost({
      data: {
        title: titleState,
        content: contentState,
        category: categoryState as "fantasy" | "horror",
        author: user?.name ?? "",
        releaseDate: releaseDateState as "2024" | "2025",
      },
    });
    queryClient.invalidateQueries({ queryKey: ["posts"] });
  };

  return (
    <div className="container max-w-2xl py-8 flex flex-col gap-4  mx-auto">
      <h1 className="text-3xl font-bold mb-8">New Post</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-medium">
            Title
          </label>
          <input
            type="text"
            id="title"
            placeholder="Enter post title"
            className="w-full px-3 py-2 border rounded-md"
            onChange={(e) => setTitle(e.target.value)}
            value={titleState}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="content" className="block text-sm font-medium">
            Content
          </label>
          <textarea
            id="content"
            placeholder="Write your post content"
            className="w-full px-3 py-2 border rounded-md min-h-[200px]"
            onChange={(e) => setContent(e.target.value)}
            value={contentState}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="category" className="block text-sm font-medium">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as "fantasy" | "horror")}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="fantasy">Fantasy</option>
            <option value="horror">Horror</option>
          </select>
        </div>
        <div className="space-y-2">
          <label htmlFor="category" className="block text-sm font-medium">
            Release Date
          </label>
          <select
            id="releaseDate"
            value={releaseDateState}
            onChange={(e) => setReleaseDate(e.target.value as "2024" | "2025")}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="">Select Release Date</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
          </select>
        </div>
        <Button type="submit" className="w-full">
          Create Post
        </Button>
      </form>
    </div>
  );
}
