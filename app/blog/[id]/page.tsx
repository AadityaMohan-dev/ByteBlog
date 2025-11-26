// app/blog/[id]/page.tsx

import Blog from "@/components/general/Blog";
import RelatedBlogs from "@/components/general/RelatedBlogs";
import { getBlogById, getRelatedBlogs } from "@/src/action/blog.action";
import { checkIsFollowing } from "@/src/action/follow.action";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const { id } = await params;
  const blog = await getBlogById(id);

  if (!blog) {
    return { title: "Blog Not Found" };
  }

  return {
    title: blog.title || "Byte Blog",
    description: blog.description || "Read this blog post on Byte Blog",
    openGraph: {
      title: blog.title || "Byte Blog",
      description: blog.description || "Read this blog post on Byte Blog",
      images: blog.thumbnail ? [blog.thumbnail] : [],
      type: "article",
      publishedTime: blog.createdAt?.toISOString(),
      authors: [
        `${blog.author?.firstName || ""} ${blog.author?.lastName || ""}`.trim(),
      ],
    },
  };
}

export default async function BlogPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  const [blog, relatedBlogs] = await Promise.all([
    getBlogById(id),
    getRelatedBlogs(id, 3), // Get 3 related blogs
  ]);

  if (!blog) {
    notFound();
  }

  const isFollowing = blog.author?.id
    ? await checkIsFollowing(blog.author.id)
    : false;

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
      avatarUrl: blog.author?.avatarUrl ?? "",
      email: blog.author?.email ?? "",
      name: `${blog.author?.firstName ?? ""} ${
        blog.author?.lastName ?? ""
      }`.trim(),
    },
    isFollowing,
  };

  return (
    <div className="space-y-12">
      <Blog blog={cleanBlog} />
      
      {relatedBlogs && relatedBlogs.length > 0 && (
        <RelatedBlogs blogs={relatedBlogs} currentBlogId={id} />
      )}
    </div>
  );
}