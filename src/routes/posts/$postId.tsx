import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { getPost } from "~/lib/actions/posts.actions";
import { Card, CardContent, CardHeader, CardTitle } from "~/lib/components/ui/card";

export const Route = createFileRoute("/posts/$postId")({
  component: RouteComponent,
  loader: async ({ params }) => {
    return {
      postId: params.postId as string,
    };
  },
});

function RouteComponent() {
  const { postId } = Route.useParams();
  const { data: post, isFetching } = useQuery({
    queryKey: ["posts", postId],
    queryFn: () => getPost({ data: postId }),
  });

  return (
    <div className="container max-w-4xl mx-auto py-8">
      {isFetching ? (
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="w-10 h-10 animate-spin" />
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold">{post?.title}</CardTitle>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>By {post?.author}</span>
              <span>•</span>
              <span className="capitalize">{post?.category}</span>
              <span>•</span>
              <span>{post?.releaseDate}</span>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-lg leading-relaxed whitespace-pre-wrap">{post?.content}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
