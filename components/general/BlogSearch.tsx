"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "../ui/card";
import { getBlogByName } from "@/src/action/blog.action";
import { Search, Loader2 } from "lucide-react";

interface Blog {
  id: string;
  title: string;
  image?: string | null;
  categories?: string[];
}

export default function BlogSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setError(null);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await getBlogByName(query);
        const data = (res ?? []).map((b: any) => ({
          id: b.id,
          title: b.title,
          image: b.thumbnail ?? null,
          categories: b.categories ?? [],
        }));

        setResults(data);
      } catch (err) {
        console.error("Search error:", err);
        setError("Failed to search blogs. Please try again.");
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search blogs by title..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 animate-spin" />
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-red-500 text-center py-4">
          {error}
        </div>
      )}

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* No Results */}
        {!loading && !error && results.length === 0 && query.trim() && (
          <div className="text-gray-400 w-full text-center col-span-full py-8">
            <div className="relative w-64 h-64 mx-auto mb-4">
              <Image
                src="/notfound.jpg"
                alt="No Results"
                fill
                className="object-contain"
              />
            </div>
            <p className="text-xl">No blogs found for "{query}"</p>
            <p className="text-sm text-gray-500 mt-2">
              Try searching with different keywords
            </p>
          </div>
        )}

        {/* Blog Cards */}
        {results.map((blog) => (
          <Link key={blog.id} href={`/blog/${blog.id}`}>
            <Card className="hover:cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all duration-200 h-full">
              <CardContent className="relative h-48 w-full p-0">
                <Image
                  src={blog.image || "/placeholder.png"}
                  alt={blog.title}
                  fill
                  className="object-cover rounded-t-lg"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </CardContent>

              <CardFooter className="grid gap-2 p-4">
                <CardTitle className="text-lg line-clamp-2">
                  {blog.title}
                </CardTitle>
                <CardDescription className="line-clamp-1">
                  {blog.categories && blog.categories.length > 0
                    ? blog.categories.join(", ")
                    : "No categories"}
                </CardDescription>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>

      {/* Results Count */}
      {!loading && results.length > 0 && (
        <p className="text-sm text-gray-500 text-center">
          Found {results.length} {results.length === 1 ? "blog" : "blogs"}
        </p>
      )}
    </div>
  );
}