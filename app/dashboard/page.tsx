import BlogSearch from "@/components/general/BlogSearch";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { getBlogByLimit } from "@/src/action/blog.action";
import { auth, currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import RightSidebar from "./RightSidebar";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    return (
      <div className="p-10 text-center text-gray-600">
        Please log in to view your dashboard.
      </div>
    );
  }

  const categoryRaw = searchParams?.category;
  const category = Array.isArray(categoryRaw) ? categoryRaw[0] : categoryRaw || "All";

  const blogs = await getBlogByLimit(6);

  return (
    <div className="px-4  sm:px-6 lg:px-10 py-6 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 lg:gap-12">
      {/* LEFT COLUMN */}
      <div className="space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome, <span className="text-gray-800">{user.fullName}</span>
            </h1>
            <p className="text-gray-500 mt-1">
              Discover stories, thinking, and expertise
            </p>
          </div>

           <div className="hidden md:block">
            <Image alt="" src="/img4.png" width={100} height={50}/>
        </div>
        </div>
        {/* Search */}
        <BlogSearch />

        

        {/* Latest Blogs Title */}
        <div className="flex items-center justify-between bg-gray-200 w-fit p-2 rounded-2xl border">
          <h2 className="text-sm font-semibold">Latest Blog</h2>
        </div>

        {/* Blog List - Medium Style */}
        <div className="space-y-8">
          {blogs.length === 0 && (
            <p className="text-gray-500 text-center">No blogs found.</p>
          )}

          {blogs.map((blog) => (
            <Link key={blog.id} href={`/blog/${blog.id}`}>
              <article className="flex py-6 flex-col  sm:flex-row gap-4 sm:gap-6 group border-b  sm:px-0 hover:bg-gray-50 transition">
                {/* Text Content */}
                <div className="flex-1 space-y-2">
                  <CardTitle className="text-xl font-semibold leading-snug group-hover:underline">
                    {blog.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 line-clamp-2">
                    {blog.description}
                  </CardDescription>

                  <div className="flex items-center gap-3 text-sm text-gray-500 mt-3">
                    <span>By {blog.author?.firstName + " " + blog.author?.lastName || "Anonymous"}</span>
                    <span>•</span>
                    <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Thumbnail */}
                <div className="relative w-full sm:w-40 h-48 sm:h-28 shrink-0 rounded-lg overflow-hidden">
                  {blog.thumbnail ? (
                    <Image
                      src={blog.thumbnail}
                      alt={blog.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="h-full w-full bg-gray-200 flex items-center justify-center text-sm text-gray-500">
                      No Image
                    </div>
                  )}
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <RightSidebar selectedCategory={category} />
    </div>
  );
}
