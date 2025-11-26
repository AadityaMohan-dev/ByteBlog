import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <FileQuestion className="w-24 h-24 text-gray-300 mb-6" />
      
      <h1 className="text-4xl font-bold mb-2">Blog Not Found</h1>
      
      <p className="text-gray-600 text-center max-w-md mb-8">
        The blog post you're looking for doesn't exist or has been removed.
      </p>
      
      <div className="flex gap-4">
        <Link href="/">
          <Button variant="default">Go Home</Button>
        </Link>
        <Link href="/blogs">
          <Button variant="outline">Browse Blogs</Button>
        </Link>
      </div>
    </div>
  );
}