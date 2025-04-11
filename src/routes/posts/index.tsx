import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Loader2, Plus } from "lucide-react";
import { useQueryState } from "nuqs";
import { getPosts } from "~/lib/actions/posts.actions";
import { Button } from "~/lib/components/ui/button";

export const Route = createFileRoute("/posts/")({
  component: RouteComponent,

  beforeLoad: async ({ search }) => {
    return {
      category: search?.category ?? undefined,
      releaseDate: search?.releaseDate ?? undefined,
    };
  },
});

function RouteComponent() {
  const { category, releaseDate } = Route.useSearch();

  const [categoryState, setCategory] = useQueryState("category");
  const [releaseDateState, setReleaseDate] = useQueryState("releaseDate");
  const { data: posts, isFetching } = useQuery({
    queryKey: ["posts"],
    queryFn: () => getPosts(),
    staleTime: 1000 * 60 * 5,
  });

  const filteredPosts = posts?.filter((post) => {
    const matchesCategory = categoryState === "all" || post.category === categoryState;
    const matchesReleaseDate =
      releaseDateState === "all" || post.releaseDate === releaseDateState;
    return matchesCategory && matchesReleaseDate;
  });

  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Posts</h1>
        <Button
          onClick={() =>
            router.navigate({
              to: "/posts/new",
              search: { category: undefined, releaseDate: undefined },
            })
          }
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Post
        </Button>
      </div>

      <div className="flex gap-4 mb-8">
        <select
          name="category"
          id="category"
          onChange={(e) => setCategory(e.target.value)}
          value={category}
          className="px-4 py-2 border rounded-md"
        >
          <option value="all">All Categories</option>
          <option value="fantasy">Fantasy</option>
          <option value="horror">Horror</option>
        </select>
        <select
          name="releaseDate"
          id="releaseDate"
          onChange={(e) => setReleaseDate(e.target.value)}
          value={releaseDate}
          className="px-4 py-2 border rounded-md"
        >
          <option value="all">All Years</option>
          <option value="2024">2024</option>
          <option value="2025">2025</option>
        </select>
      </div>

      {isFetching ? (
        <div className="flex justify-center">
          <Loader2 className="w-10 h-10 animate-spin" />
        </div>
      ) : filteredPosts && filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="border rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-2">
                {post.title} By {post.author}
              </h2>
              <p className="text-gray-600 mb-4 line-clamp-3">{post.content}</p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span className="capitalize">{post.category}</span>
                <span>{post.releaseDate}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">No posts found</div>
      )}
    </div>
  );
}
