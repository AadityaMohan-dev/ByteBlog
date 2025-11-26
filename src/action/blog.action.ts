"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/* -----------------------------------------------------
   TYPES
----------------------------------------------------- */
interface CreateBlogPayload {
  title: string;
  description: string;
  thumbnail?: string;
  categories: string[];
  contentHtml: string;
  contentJson: any;
}

interface PaginatedBlogsResult {
  blogs: any[];
  total: number;
  totalPages: number;
  currentPage: number;
}

/* -----------------------------------------------------
   CREATE BLOG
----------------------------------------------------- */
export async function createBlogAction(payload: CreateBlogPayload) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      throw new Error("Unauthorized: Please sign in to create a blog");
    }

    // Validate required fields
    if (!payload.title || !payload.contentHtml) {
      throw new Error("Title and content are required");
    }

    // Get database user
    const dbUser = await prisma.user.findUnique({
      where: { clerkId },
      select: { id: true },
    });

    if (!dbUser) {
      throw new Error("User not found in database");
    }

    // Create blog
    const blog = await prisma.blog.create({
      data: {
        title: payload.title,
        description: payload.description,
        thumbnail: payload.thumbnail,
        categories: payload.categories || [],
        contentHtml: payload.contentHtml,
        contentJson: payload.contentJson,
        authorId: dbUser.id,
      },
    });

    // Revalidate relevant paths
    revalidatePath("/blog");
    revalidatePath("/dashboard");
    revalidatePath(`/blog/${blog.id}`);

    return { success: true, message: "Blog created successfully", blogId: blog.id };
  } catch (error) {
    console.error("Error creating blog:", error);
    throw new Error(
      "Failed to create blog: " +
        (error instanceof Error ? error.message : "Unknown error")
    );
  }
}

/* -----------------------------------------------------
   SINGLE BLOG BY ID (with author) ✅ FIXED
----------------------------------------------------- */
export async function getBlogById(blogId: string) {
  try {
    if (!blogId) {
      throw new Error("Blog ID is required");
    }

    return await prisma.blog.findUnique({
      where: { id: blogId },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true, // ✅ FIXED: was avtarUrl
            email: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("Error fetching blog by ID:", error);
    return null;
  }
}

/* -----------------------------------------------------
   ALL BLOGS (Optimized with select)
----------------------------------------------------- */
export async function getAllBlogs() {
  try {
    return await prisma.blog.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        description: true,
        thumbnail: true,
        categories: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("Error fetching all blogs:", error);
    return [];
  }
}

/* -----------------------------------------------------
   BLOGS BY LIMIT (Optimized)
----------------------------------------------------- */
export async function getBlogByLimit(limit: number = 6) {
  try {
    if (limit < 1) {
      throw new Error("Limit must be at least 1");
    }

    return await prisma.blog.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      select: {
        id: true,
        title: true,
        description: true,
        thumbnail: true,
        categories: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("Error fetching blogs by limit:", error);
    return [];
  }
}

/* -----------------------------------------------------
   MOST RECENT BLOG
----------------------------------------------------- */
export async function getRecentBlogAdded() {
  try {
    return await prisma.blog.findMany({
      orderBy: { createdAt: "desc" },
      take: 1,
      select: {
        id: true,
        title: true,
        description: true,
        thumbnail: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("Error fetching recent blog:", error);
    return [];
  }
}

/* -----------------------------------------------------
   SEARCH BLOGS BY TITLE
----------------------------------------------------- */
export async function getBlogByName(name: string) {
  try {
    if (!name || name.trim().length < 2) {
      return [];
    }

    return await prisma.blog.findMany({
      where: {
        OR: [
          { title: { contains: name, mode: "insensitive" } },
          { description: { contains: name, mode: "insensitive" } },
        ],
      },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        title: true,
        description: true,
        thumbnail: true,
        categories: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("Error searching blogs:", error);
    return [];
  }
}

/* -----------------------------------------------------
   PAGINATED BLOGS
----------------------------------------------------- */
export async function getPaginatedBlogs(
  page: number = 1,
  limit: number = 10
): Promise<PaginatedBlogsResult> {
  try {
    if (page < 1) page = 1;
    if (limit < 1) limit = 10;

    const skip = (page - 1) * limit;

    const [blogs, total] = await Promise.all([
      prisma.blog.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          description: true,
          thumbnail: true,
          categories: true,
          createdAt: true,
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatarUrl: true,
            },
          },
        },
      }),
      prisma.blog.count(),
    ]);

    return {
      blogs,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    };
  } catch (error) {
    console.error("Error fetching paginated blogs:", error);
    return {
      blogs: [],
      total: 0,
      totalPages: 0,
      currentPage: page,
    };
  }
}

/* -----------------------------------------------------
   USER'S BLOGS
----------------------------------------------------- */
export async function getUserBlogs(userId: string) {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }

    return await prisma.blog.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        description: true,
        thumbnail: true,
        categories: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("Error fetching user blogs:", error);
    return [];
  }
}

/* -----------------------------------------------------
   RANDOM BLOGS (for suggestions)
----------------------------------------------------- */
export async function getRandomBlogs(limit: number = 4): Promise<any[]> {
  try {
    const total = await prisma.blog.count();

    if (total === 0) {
      return [];
    }

    const actualLimit = Math.min(limit, total);
    const skip = Math.floor(Math.random() * Math.max(1, total - actualLimit));

    const blogs = await prisma.blog.findMany({
      take: actualLimit,
      skip,
      select: {
        id: true,
        title: true,
        description: true,
        thumbnail: true,
        categories: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return blogs;
  } catch (error) {
    console.error("Error fetching random blogs:", error);
    return [];
  }
}

/* -----------------------------------------------------
   UPDATE BLOG
----------------------------------------------------- */
export async function updateBlog(
  blogId: string,
  payload: Partial<CreateBlogPayload>
) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      throw new Error("Unauthorized");
    }

    // Verify ownership
    const blog = await prisma.blog.findUnique({
      where: { id: blogId },
      include: {
        author: {
          select: { clerkId: true },
        },
      },
    });

    if (!blog) {
      throw new Error("Blog not found");
    }

    if (blog.author.clerkId !== clerkId) {
      throw new Error("Unauthorized: You can only edit your own blogs");
    }

    // Update blog
    const updatedBlog = await prisma.blog.update({
      where: { id: blogId },
      data: {
        ...(payload.title && { title: payload.title }),
        ...(payload.description !== undefined && {
          description: payload.description,
        }),
        ...(payload.thumbnail !== undefined && { thumbnail: payload.thumbnail }),
        ...(payload.categories && { categories: payload.categories }),
        ...(payload.contentHtml && { contentHtml: payload.contentHtml }),
        ...(payload.contentJson && { contentJson: payload.contentJson }),
      },
    });

    revalidatePath(`/blog/${blogId}`);
    revalidatePath("/dashboard");

    return { success: true, message: "Blog updated successfully" };
  } catch (error) {
    console.error("Error updating blog:", error);
    throw new Error(
      "Failed to update blog: " +
        (error instanceof Error ? error.message : "Unknown error")
    );
  }
}

/* -----------------------------------------------------
   DELETE BLOG
----------------------------------------------------- */
export async function deleteBlog(blogId: string) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      throw new Error("Unauthorized");
    }

    // Verify ownership
    const blog = await prisma.blog.findUnique({
      where: { id: blogId },
      include: {
        author: {
          select: { clerkId: true },
        },
      },
    });

    if (!blog) {
      throw new Error("Blog not found");
    }

    if (blog.author.clerkId !== clerkId) {
      throw new Error("Unauthorized: You can only delete your own blogs");
    }

    // Delete blog
    await prisma.blog.delete({
      where: { id: blogId },
    });

    revalidatePath("/dashboard");
    revalidatePath("/blog");

    return { success: true, message: "Blog deleted successfully" };
  } catch (error) {
    console.error("Error deleting blog:", error);
    throw new Error(
      "Failed to delete blog: " +
        (error instanceof Error ? error.message : "Unknown error")
    );
  }
}

/* -----------------------------------------------------
   GET BLOGS BY CATEGORY
----------------------------------------------------- */
export async function getBlogsByCategory(category: string, limit: number = 10) {
  try {
    if (!category) {
      return [];
    }

    return await prisma.blog.findMany({
      where: {
        categories: {
          has: category,
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      select: {
        id: true,
        title: true,
        description: true,
        thumbnail: true,
        categories: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("Error fetching blogs by category:", error);
    return [];
  }
}

export async function getRelatedBlogs(blogId: string, limit: number = 3) {
  try {
    const currentBlog = await prisma.blog.findUnique({
      where: { id: blogId },
      select: { categories: true, authorId: true },
    });

    if (!currentBlog) return [];

    // Find blogs with similar categories or same author
    const relatedBlogs = await prisma.blog.findMany({
      where: {
        id: { not: blogId },
        OR: [
          { categories: { hasSome: currentBlog.categories } },
          { authorId: currentBlog.authorId },
        ],
      },
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
    });

    return relatedBlogs;
  } catch (error) {
    console.error("Error getting related blogs:", error);
    return [];
  }
}