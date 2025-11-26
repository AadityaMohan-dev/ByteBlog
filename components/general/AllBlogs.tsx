import { getUserBlogs } from "@/src/action/blog.action";
import Blog from "./Blog";
import { Suspense } from "react";

// Match the actual database schema
interface BlogType {
  id: string;
  title: string;
  description: string | null;
  thumbnail: string | null;
  categories: string[];
  createdAt: Date;
  contentHtml?: string;
  author: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    avatarUrl: string | null;
  };
}

// Transform function to convert DB blog to component-compatible format
function transformBlog(blog: BlogType) {
  const authorName = [blog.author.firstName, blog.author.lastName]
    .filter(Boolean)
    .join(" ") || "Unknown";

  return {
    id: blog.id,
    title: blog.title,
    description: blog.description || "",
    thumbnail: blog.thumbnail || undefined,
    categories: blog.categories,
    createdAt: blog.createdAt.toISOString(),
    contentHtml: blog.contentHtml,
    author: {
      id: blog.author.id,
      name: authorName,
      avatarUrl: blog.author.avatarUrl || undefined,
    },
  };
}

async function BlogsList({ userId }: { userId: string }) {
  try {
    const blogs = await getUserBlogs(userId);

    if (!blogs || blogs.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <svg
            className="w-16 h-16 text-gray-300 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-center text-gray-500 text-lg font-medium">
            No blogs found
          </p>
          <p className="text-center text-gray-400 text-sm mt-2">
            Start creating your first blog post!
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-8 py-6">
        {blogs.map((blog) => (
          <Blog key={blog.id} blog={transformBlog(blog)} />
        ))}
      </div>
    );
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-center text-red-500 text-lg">
          Failed to load blogs
        </p>
        <p className="text-center text-gray-400 text-sm mt-2">
          Please try again later
        </p>
      </div>
    );
  }
}

function BlogsLoading() {
  return (
    <div className="space-y-8 py-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>
  );
}

export default function AllBlogs({ userId }: { userId: string }) {
  return (
    <Suspense fallback={<BlogsLoading />}>
      <BlogsList userId={userId} />
    </Suspense>
  );
}