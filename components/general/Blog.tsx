import Image from "next/image";
import FollowButton from "./FollowButton";

interface BlogType {
  id: string;
  title: string;
  description: string;
  categories: string[];
  createdAt: string;
  thumbnail?: string;
  contentHtml?: string;
  author: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  isFollowing?: boolean;
}

export default function Blog({ blog }: { blog: BlogType }) {
  const avatar = blog.author.avatarUrl?.startsWith("http")
    ? blog.author.avatarUrl
    : "/img3.png";

  const postedDate = blog.createdAt
    ? new Date(blog.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown date";

  return (
    <article className="flex justify-center p-6 md:p-10">
      <div className="max-w-3xl w-full">
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold mb-3">{blog.title}</h1>
        <p className="text-lg md:text-xl text-gray-600 mb-6">
          {blog.description}
        </p>

        {/* Categories */}
        {blog.categories?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {blog.categories.map((cat, i) => (
              <span
                key={i}
                className="px-3 py-1 text-sm rounded-full bg-gray-200 text-gray-700"
              >
                {cat}
              </span>
            ))}
          </div>
        )}

        {/* Author Section */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <img
              src={avatar}
              alt={blog.author.name || "Author"}
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
            <span className="font-medium">{blog.author.name || "Unknown"}</span>
            <FollowButton
              authorId={blog.author.id}
              initialIsFollowing={blog.isFollowing}
            />
          </div>

          <time
            dateTime={blog.createdAt}
            className="text-gray-500 text-sm md:text-base"
          >
            {postedDate}
          </time>
        </div>

        <hr className="my-6" />

        {/* Thumbnail */}
        {blog.thumbnail && (
          <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden my-6">
            <Image
              src={blog.thumbnail}
              alt={blog.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Blog Content */}
        {blog.contentHtml && (
          <div
            className="prose prose-lg max-w-none mt-6"
            dangerouslySetInnerHTML={{
              __html: blog.contentHtml,
            }}
          />
        )}
      </div>
    </article>
  );
}