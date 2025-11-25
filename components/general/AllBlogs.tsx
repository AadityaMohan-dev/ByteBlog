import { getUserBlogs } from "@/src/action/blog.action";
import Blog from "./Blog";

export default async function AllBlogs({ userId }: { userId: string }) {
  const blogs = await getUserBlogs(userId);

  if (!blogs || blogs.length === 0) {
    return <p className="text-center text-gray-500">No blogs found</p>;
  }

  return (
    <div className="space-y-8">
      {blogs.map((blog: any) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );
}
