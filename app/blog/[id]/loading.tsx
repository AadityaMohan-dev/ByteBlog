import BlogSkeleton from "@/components/general/BlogSkeleton";

export default function Loading() {
  return (
    <div className="flex justify-center p-10">
      <div className="max-w-3xl w-full">
        <BlogSkeleton />
      </div>
    </div>
  );
}