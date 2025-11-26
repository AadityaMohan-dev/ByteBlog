import Link from "next/link";
import Image from "next/image";
import FollowButton from "@/components/general/FollowButton";
import { getRandomBlogs } from "@/src/action/blog.action";
import { getRandomUser } from "@/src/action/user.action";

interface RightSidebarProps {
  selectedCategory: string;
}

export default async function RightSidebar({
  selectedCategory,
}: RightSidebarProps) {
  const [randomBlogs, authors] = await Promise.all([
    getRandomBlogs(3),
    getRandomUser(3),
  ]);

  const categories = [
    "All",
    "Tech",
    "Lifestyle",
    "Travel",
    "Food",
    "Education",
    "Health",
  ];

  return (
    <aside className="p-4 space-y-8 sticky top-20 h-fit">
      {/* Suggested Authors Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-gray-900">
          Suggested Authors
        </h2>

        {authors.length === 0 ? (
          <p className="text-sm text-gray-500">No authors to suggest yet</p>
        ) : (
          <div className="space-y-4">
            {authors.map((author) => (
              <Link
                key={author.id}
                href={`/author/${author.id}`}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="relative w-12 h-12 shrink-0">
                  <img
                    src={
                      author.avatarUrl ||
                      "https://img.icons8.com/3d-fluency/94/guest-male--v3.png"
                    }
                    width={48}
                    height={48}
                    className="rounded-full object-cover ring-2 ring-gray-100 group-hover:ring-gray-200 transition"
                    alt={`${author.firstName} ${author.lastName}'s profile`}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate group-hover:text-black">
                    {author.firstName} {author.lastName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {author.followers ?? 0} followers
                  </p>
                </div>

                {/* ✅ Client Component used here */}
                <FollowButton authorId={author.id} />
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Category Filter */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-gray-900">
          Filter by Category
        </h2>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/dashboard?category=${cat}`}
              className={`px-3 py-1.5 rounded-full text-sm border-2 transition-all font-medium
                ${
                  selectedCategory === cat
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-700 border-gray-300 hover:border-black"
                }`}
            >
              {cat}
            </Link>
          ))}
        </div>
      </section>

      {/* Suggested Blogs */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-gray-900">
          Suggested Blogs
        </h2>

        {randomBlogs.length === 0 ? (
          <p className="text-sm text-gray-500">No blogs to suggest yet</p>
        ) : (
          <div className="space-y-3">
            {randomBlogs.map((blog) => (
              <Link key={blog.id} href={`/blog/${blog.id}`} className="block group">
                <article className="border-b border-gray-200 pb-3 hover:border-gray-400 transition-colors">
                  <h3 className="font-medium text-gray-900 line-clamp-2 group-hover:text-black leading-snug mb-1">
                    {blog.title}
                  </h3>

                  {blog.description && (
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                      {blog.description}
                    </p>
                  )}

                  {blog.categories?.length > 0 && (
                    <div className="flex gap-2 mt-2">
                      {blog.categories.slice(0, 2).map((cat: string, i: number) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  )}
                </article>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Reading List */}
      <section className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h2 className="text-lg font-semibold mb-2 text-gray-900">
          📚 Reading List
        </h2>
        <p className="text-sm text-gray-600 mb-3">
          Click the bookmark on any story to add it to your reading list.
        </p>
        <Link
          href="/reading-list"
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          View your reading list →
        </Link>
      </section>

      {/* Footer */}
      <footer className="pt-4 border-t border-gray-200">
        <div className="flex flex-wrap gap-x-3 gap-y-2 text-xs text-gray-500">
          <Link href="/about">About</Link>
          <Link href="/help">Help</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/privacy">Privacy</Link>
        </div>
        <p className="text-xs text-gray-400 mt-3">© 2024 ByteBlog</p>
      </footer>
    </aside>
  );
}
