import Link from "next/link";
import { suggestedAuthors } from "@/src/data/suggestedAuthors"; 
import { getRandomBlogs } from "@/src/action/blog.action";
import { getRandomUser } from "@/src/action/user.action";

export default async function RightSidebar({ selectedCategory }: { selectedCategory: string }) {
  const filtered = selectedCategory === "All"
    ? suggestedAuthors
    : suggestedAuthors.filter(a => a.category === selectedCategory);

    const randomBlogs = await getRandomBlogs();
    const author = await getRandomUser();

  return (
    <div className=" p-4 space-y-6 hidden lg:block w-80 ">
       
        <div>
        <div className="">
            <h2 className="text-xl font-semibold mb-3 ">Suggested Authors</h2>

        <div className="space-y-4">
          {author.map((author) => (
            <div key={author.id} className="flex items-center gap-3">
              <img
                src={author.avatarUrl || "https://img.icons8.com/3d-fluency/94/guest-male--v3.png"}
                width={45}
                height={45}
                className="rounded-full"
                alt="something"
              />
              <div>
                <p className="font-medium">{author.firstName + " " + author?.lastName}</p>
                <p className="text-xs text-gray-500">followers : {author.followers}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Category Filter */}
      <div>
        <h2 className="text-xl mt-5 font-semibold mb-3">Filter by Category</h2>
        <div className="flex flex-wrap gap-2">
          {["All", "Technology", "Lifestyle", "Food", "Education"].map((cat) => (
            <Link
              key={cat}
              href={`?category=${cat}`}
              className={`px-3 py-1 rounded-full text-sm border 
                ${selectedCategory === cat ? "bg-black text-white" : "bg-white"}
              `}
            >
              {cat}
            </Link>
          ))}
        </div>
        <h2 className="text-xl mt-5 font-semibold mb-3">Suggested Blogs</h2>
         <div className="space-y-4">
          {randomBlogs.map((blog) => (
            <div key={blog.id} className="flex items-center gap-3">
              
              <div className="border-b space-y-2 p-2">
                <p className="font-medium line-clamp-2">{blog.title}</p>
                <p className="text-xs text-gray-500 line-clamp-1  ">{blog.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
        </div>
    </div>
  );
}
