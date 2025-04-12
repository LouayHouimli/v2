import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { authMiddleware } from "../middleware/auth-guard";
import { db } from "../server/db";
import { posts } from "../server/schema/auth.schema";

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

const postSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  content: z.string().min(1, { message: "Content is required" }),
  category: z.enum(["fantasy", "horror"]),
  releaseDate: z.enum(["2024", "2025"]),
  author: z.string().min(1, { message: "Author is required" }),
});
type Post = z.infer<typeof postSchema>;

export const getPosts = createServerFn({ method: "GET" }).handler(async () => {
  const posts = await db.query.posts.findMany();
  return posts;
});

export const getPost = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((data: string) => {
    return z.string().min(1, { message: "Post ID is required" }).parse(data);
  })
  .handler(async (ctx) => {
    const post = await db.query.posts.findFirst({
      where: eq(posts.id, ctx.data),
    });
    return post;
  });

export const createPost = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: Post) => {
    return postSchema.parse(data);
  })
  .handler(async (ctx) => {
    try {
      const post = await db
        .insert(posts)
        .values({
          id: crypto.randomUUID(),
          title: ctx.data?.title,
          content: ctx.data?.content,
          category: ctx.data?.category,
          releaseDate: ctx.data?.releaseDate,
          author: ctx.data?.author,
        })
        .returning();

      if (!post) {
        return {
          success: false,
          message: "Failed to create post",
        };
      } else {
        return {
          success: true,
          message: "Post created successfully",
        };
      }
    } catch (error) {
      return {
        success: false,
        message: "Failed to create post",
      };
    }
  });
