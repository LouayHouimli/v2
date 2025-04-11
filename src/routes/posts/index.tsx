import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useQueryState } from "nuqs";
import { getPosts } from "~/lib/actions/posts.actions";
export const Route = createFileRoute("/posts/")({
  component: RouteComponent,
  validateSearch: (search) => ({
    category: (search?.category as "all" | "fantasy" | "horror") || "all",
    releaseDate: (search?.releaseDate as "all" | "2024" | "2025") || "all",
  }),

  beforeLoad: async ({ search }) => {
    return {
      category: search?.category || "all",
      releaseDate: search?.releaseDate || "all",
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

  return (
    <div className="flex flex-col gap-4  items-center justify-center">
      <h1>Posts</h1>
      <div>
        <select
          name="category"
          id="category"
          onChange={(e) => setCategory(e.target.value)}
          value={category}
        >
          <option value="all">All</option>
          <option value="fantasy">Fantasy</option>
          <option value="horror">Horror</option>
        </select>
        <select
          name="releaseDate"
          id="releaseDate"
          onChange={(e) => setReleaseDate(e.target.value)}
          value={releaseDate}
        >
          <option value="all">All</option>
          <option value="2024">2024</option>
          <option value="2025">2025</option>
        </select>
      </div>
      <div className="flex flex-col gap-4">
        {isFetching ? (
          <Loader2 className="w-10 h-10 animate-spin" />
        ) : filteredPosts && filteredPosts.length > 0 ? (
          filteredPosts?.map((post) => <div key={post.id}>{post.title}</div>)
        ) : (
          <div>No posts found</div>
        )}
      </div>
    </div>
  );
}
