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
    <div className="px-10 py-5 grid grid-cols-1 lg:grid-cols-[1fr_200px] gap-10">
      
      {/* LEFT COLUMN */}
      <div className="space-y-6 ">

        {/* Header */}
       <div className="flex justify-between items-center">
        <div className="space-y-3">
          <h1 className="text-3xl">
            Welcome, <span>{user.fullName}</span>
          </h1>
          <p className="text-gray-500">
            Start exploring the latest blogs tailored for you.
          </p>
        </div>

        {/* Create Blog Button */}
        <Link
          href="/blog/create"
          className="bg-black text-white rounded-lg px-4 py-2 h-fit inline-block hover:bg-green-700"
        >
          ✍️ Create Blog
        </Link>
        </div> 

        {/* Search Bar */}
        <BlogSearch />

        {/* Latest Blogs */}
        <h1 className="text-2xl mt-6">Latest Blogs</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogs.length === 0 && (
            <p className="text-gray-500 col-span-3 text-center">No blogs found.</p>
          )}

          {blogs.map((blog) => (
            <Link key={blog.id} href={`/blog/${blog.id}`}>
              <div className="hover:shadow-lg transition-shadow border rounded-lg">
                <div className="relative h-48 w-full">
                  {blog.thumbnail ? (
                    <Image src={blog.thumbnail} alt={blog.title} fill className="object-cover rounded-t-lg" />
                  ) : (
                    <div className="h-full w-full bg-gray-200 flex items-center justify-center rounded-t-lg">No Image</div>
                  )}
                </div>

                <div className="p-4 space-y-2 ">
                  <CardTitle className="line-clamp-1">{blog.title}</CardTitle>
                  <CardDescription className="line-clamp-1">{blog.description}</CardDescription>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <RightSidebar selectedCategory={category} />

    </div>
  );
}
