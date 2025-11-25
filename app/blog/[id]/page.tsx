// app/blog/[id]/page.tsx

import Blog from "@/components/general/Blog";
import { getBlogById } from "@/src/action/blog.action";

// Force dynamic because blogs are fetched per-request
export const dynamic = "force-dynamic";

export default async function BlogPage({
  params,
}: {
   params: { id: string };
}) {
  const { id } = await params;

  const blog = await getBlogById(id);

  if (!blog) {
    return <div className="p-6">Blog not found</div>;
  }

  const cleanBlog = {
    id: blog.id,
    title: blog.title ?? "",
    description: blog.description ?? "",
    thumbnail: blog.thumbnail ?? "",
    categories: blog.categories ?? [],
    contentHtml: blog.contentHtml ?? "",
    contentJson: blog.contentJson ?? null,
    createdAt: blog.createdAt ? blog.createdAt.toISOString() : "",
    updatedAt: blog.updatedAt ? blog.updatedAt.toISOString() : "",
    author: {
      id: blog.author?.id ?? "",
      firstName: blog.author?.firstName ?? "",
      lastName: blog.author?.lastName ?? "",
      avatarUrl: blog.author?.avtarUrl ?? "",
      email: blog.author?.email ?? "",
      name: `${blog.author?.firstName ?? ""} ${
        blog.author?.lastName ?? ""
      }`.trim(),
    },
  };

  return <Blog blog={cleanBlog} />;
}
