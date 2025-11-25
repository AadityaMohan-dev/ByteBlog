"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/* -----------------------------------------------------
   CREATE BLOG
----------------------------------------------------- */
export async function createBlogAction(payload: any) {
  const { userId: clerkId } = await auth();

  if (!clerkId) throw new Error("Unauthorized");

  const dbUser = await prisma.user.findUnique({
    where: { clerkId },
    select: { id: true },
  });

  if (!dbUser) throw new Error("User not found in DB");

  await prisma.blog.create({
    data: {
      title: payload.title,
      description: payload.description,
      thumbnail: payload.thumbnail,
      categories: payload.categories,
      contentHtml: payload.contentHtml,
      contentJson: payload.contentJson,
      authorId: dbUser.id,
    },
  });

  revalidatePath("/blog");
  return { success: true, message: "Blog created successfully" };
}

/* -----------------------------------------------------
   SINGLE BLOG BY ID (Corrected & with author)
----------------------------------------------------- */
export async function getBlogById(blogId: string) {
  if (!blogId) return null;

  return prisma.blog.findUnique({
    where: { id: blogId },
    include: {
      author: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avtarUrl: true,
          email: true,
        },
      },
    },
  });
}

/* -----------------------------------------------------
   ALL BLOGS
----------------------------------------------------- */
export async function getAllBlogs() {
  return prisma.blog.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: true,
    },
  });
}

/* -----------------------------------------------------
   BLOGS BY LIMIT
----------------------------------------------------- */
export async function getBlogByLimit(limit: number) {
  return prisma.blog.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      author: true,
    },
  });
}

/* -----------------------------------------------------
   MOST RECENT BLOG
----------------------------------------------------- */
export async function getRecentBlogAdded() {
  return prisma.blog.findMany({
    orderBy: { createdAt: "desc" },
    take: 1,
    include: { author: true },
  });
}

/* -----------------------------------------------------
   BLOGS BY TITLE
----------------------------------------------------- */
export async function getBlogByName(name: string) {
  return prisma.blog.findMany({
    where: { title: { contains: name, mode: "insensitive" } },
    orderBy: { createdAt: "desc" },
    take: 6,
    include: { author: true },
  });
}
export async function getPaginatedBlogs(page: number, limit: number) {
  const skip = (page - 1) * limit;

  const blogs = await prisma.blog.findMany({
    skip,
    take: limit,
    orderBy: { createdAt: "desc" },
  });

  const total = await prisma.blog.count();

  return { blogs, total };
}
export async function getUserBlogs(userId: string) {
  return prisma.blog.findMany({
    where: { authorId: userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getRandomBlogs(): Promise<any[]> {
  const total = await prisma.blog.count();

  if (total === 0) return []; 

  const limit = 4;
  const skip = Math.floor(Math.random() * Math.max(1, total - limit));

  const blogs = await prisma.blog.findMany({
    take: limit,
    skip,
  });

  return blogs; 
}
