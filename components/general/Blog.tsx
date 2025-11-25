import Image from "next/image";
import { Button } from "../ui/button";

interface BlogType {
  title: string;
  description: string;
  categories: string[];
  createdAt: string;
  thumbnail?: string;
  contentHtml?: string;
  author?: {
    name: string;
    avatarUrl?: string;
  };
}

export default function Blog({ blog }: { blog?: BlogType }) {
  if (!blog) return null; 

  const avatar =
    blog.author?.avatarUrl?.startsWith("http")
      ? blog.author.avatarUrl
      : "/img3.png";

  const postedDate = blog.createdAt
    ? new Date(blog.createdAt).toLocaleDateString()
    : "Unknown date";

  return (
    <div className="flex justify-center p-10">
      <div className="max-w-3xl w-full">

        {/* Title */}
        <h1 className="text-4xl font-bold mb-2">{blog.title}</h1>
        <p className="text-xl text-gray-600">{blog.description}</p>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mt-4">
          {blog.categories?.map((cat, i) => (
            <span
              key={i}
              className="px-3 py-1 text-sm rounded-full bg-gray-200 text-gray-700"
            >
              {cat}
            </span>
          ))}
        </div>

        {/* Author Section */}
        <div className="flex flex-wrap items-center justify-between mt-6 gap-4">
          <div className="flex items-center gap-3">
            <Image
              src={avatar}
              alt="Author"
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
            <span className="font-medium">
              {blog.author?.name || "Unknown"}
            </span>
            <Button variant="outline" size="sm">Follow</Button>
          </div>

          <span className="text-gray-500">Posted on {postedDate}</span>
        </div>

        <hr className="my-6" />

        {/* Thumbnail */}
        {blog.thumbnail && (
          <Image
            src={blog.thumbnail}
            alt="Thumbnail"
            width={800}
            height={450}
            className="rounded-lg my-6 object-cover"
          />
        )}

        {/* Blog Content */}
        <div
          className="prose prose-lg max-w-none mt-6"
          dangerouslySetInnerHTML={{
            __html: blog.contentHtml || "",
          }}
        />
      </div>
    </div>
  );
}
