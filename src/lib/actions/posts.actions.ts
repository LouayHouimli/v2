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

const Posts = [
  {
    id: 1,
    title: "Post 1",
    content: "Content 1",
    author: "John Doe",
    category: "fantasy",
    releaseDate: "2024",
  },
  {
    id: 2,
    title: "Post 2",
    content: "Content 2",
    author: "Jane Doe",
    category: "horror",
    releaseDate: "2025",
  },
  {
    id: 3,
    title: "Post 3",
    content: "Content 3",
    author: "John Doe",
    category: "fantasy",
    releaseDate: "2025",
  },
  {
    id: 4,
    title: "Post 4",
    content: "Content 4",
    author: "Jane Doe",
    category: "horror",
    releaseDate: "2024",
  },
];

export const getPosts = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async () => {
    return Posts;
  });
