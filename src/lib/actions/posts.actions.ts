import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "../middleware/auth-guard";

const postSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  content: z.string().min(1, { message: "Content is required" }),
});
type Post = z.infer<typeof postSchema>;

export const createPost = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: Post) => {
    return postSchema.parse(data);
  })
  .handler(async (ctx) => {
    return `Hello, ${ctx.data.title}! You are ${ctx.data.content}.`;
  });

export const getPosts = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async () => {
    return `Hello, test from getPosts.`;
  });
