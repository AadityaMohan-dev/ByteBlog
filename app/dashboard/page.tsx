import BlogSearch from "@/components/general/BlogSearch";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { getBlogByLimit } from "@/src/action/blog.action";
import { auth, currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import RightSidebar from "./RightSidebar";
import { redirect } from "next/navigation";
import { Suspense } from "react";

// Loading skeleton component
function BlogListSkeleton() {
  return (
    <div className="space-y-8">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex py-6 flex-col sm:flex-row gap-4 sm:gap-6 border-b animate-pulse"
        >
          <div className="flex-1 space-y-3">
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="flex gap-3 mt-3">
              <div className="h-3 bg-gray-200 rounded w-24"></div>
              <div className="h-3 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
          <div className="w-full sm:w-40 h-48 sm:h-28 bg-gray-200 rounded-lg"></div>
        </div>
      ))}
    </div>
  );
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const { userId } = await auth();
  const user = await currentUser();

  // Redirect to sign-in if not authenticated
  if (!userId || !user) {
    redirect("/sign-in");
  }

  const categoryRaw = searchParams?.category;
  const category = Array.isArray(categoryRaw)
    ? categoryRaw[0]
    : categoryRaw || "All";

  const blogs = await getBlogByLimit(6);

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-6 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 lg:gap-12">
      {/* LEFT COLUMN */}
      <div className="space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Welcome,{" "}
              <span className="text-gray-800">
                {user.firstName || user.fullName}
              </span>
            </h1>
            <p className="text-gray-500 mt-2 text-sm sm:text-base">
              Discover stories, thinking, and expertise from writers on any topic
            </p>
          </div>

          <div className="hidden md:block shrink-0">
            <Image
              src="/img4.png"
              alt="Dashboard illustration"
              width={100}
              height={50}
              priority
            />
          </div>
        </div>

        {/* Search */}
        <Suspense
          fallback={
            <div className="w-full h-10 bg-gray-200 rounded-md animate-pulse"></div>
          }
        >
          <BlogSearch />
        </Suspense>

        {/* Latest Blogs Title */}
        <div className="flex items-center justify-between">
          <div className="bg-gray-200 w-fit px-4 py-2 rounded-2xl border">
            <h2 className="text-sm font-semibold">Latest Blogs</h2>
          </div>
          <Link
            href="/blog/create"
            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Create Blog
          </Link>
        </div>

        {/* Blog List - Medium Style */}
        <Suspense fallback={<BlogListSkeleton />}>
          <div className="space-y-8">
            {blogs.length === 0 ? (
              <div className="text-center py-12">
                <div className="mb-4">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                  No blogs yet
                </h3>
                <p className="text-gray-500 mt-2">
                  Be the first to share your story!
                </p>
                <Link
                  href="/blog/create"
                  className="mt-4 inline-block px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Create Your First Blog
                </Link>
              </div>
            ) : (
              blogs.map((blog, index) => (
                <Link key={blog.id} href={`/blog/${blog.id}`}>
                  <article className="flex py-6 flex-col sm:flex-row gap-4 sm:gap-6 group border-b sm:px-0 hover:bg-gray-50 transition-all rounded-lg sm:p-4">
                    {/* Text Content */}
                    <div className="flex-1 space-y-2">
                      <CardTitle className="text-xl font-semibold leading-snug group-hover:underline line-clamp-2">
                        {blog.title}
                      </CardTitle>
                      <CardDescription className="text-gray-600 line-clamp-2">
                        {blog.description}
                      </CardDescription>

                      {/* Categories */}
                      {blog.categories && blog.categories.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {blog.categories.slice(0, 3).map((cat, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded-full"
                            >
                              {cat}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Author & Date */}
                      <div className="flex items-center gap-3 text-sm text-gray-500 mt-3">
                        <span className="font-medium">
                          By{" "}
                          {blog.author?.firstName && blog.author?.lastName
                            ? `${blog.author.firstName} ${blog.author.lastName}`
                            : "Anonymous"}
                        </span>
                        <span>•</span>
                       <time dateTime={blog.createdAt.toISOString()}>
                          {new Date(blog.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </time>
                      </div>
                    </div>

                    {/* Thumbnail */}
                    <div className="relative w-full sm:w-40 h-48 sm:h-32 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                      {blog.thumbnail ? (
                        <Image
                          src={blog.thumbnail}
                          alt={blog.title}
                          fill
                          sizes="(max-width: 640px) 100vw, 160px"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          priority={index < 2}
                        />
                      ) : (
                        <div className="h-full w-full bg-gray-200 flex flex-col items-center justify-center text-gray-400">
                          <svg
                            className="h-12 w-12 mb-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <span className="text-xs">No Image</span>
                        </div>
                      )}
                    </div>
                  </article>
                </Link>
              ))
            )}
          </div>
        </Suspense>

        {/* Load More Button */}
        {blogs.length >= 6 && (
          <div className="text-center pt-4">
            <Link
              href="/blogs"
              className="inline-block px-6 py-3 border-2 border-gray-300 rounded-lg hover:border-black hover:bg-black hover:text-white transition-all font-medium"
            >
              View All Blogs
            </Link>
          </div>
        )}
      </div>

      {/* RIGHT COLUMN */}
      <aside className="hidden lg:block">
        <Suspense
          fallback={
            <div className="w-full h-96 bg-gray-200 rounded-lg animate-pulse"></div>
          }
        >
          <RightSidebar selectedCategory={category} />
        </Suspense>
      </aside>

      {/* Mobile Create Button */}
      <Link
        href="/blog/create"
        className="sm:hidden fixed bottom-6 right-6 w-14 h-14 bg-black text-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-800 transition-colors z-50"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
            clipRule="evenodd"
          />
        </svg>
      </Link>
    </div>
  );
}