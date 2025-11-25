"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "../ui/card";
import { getBlogByName } from "@/src/action/blog.action";

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

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);

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
      <Input
        placeholder="Search blogs..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {/* Loading */}
      {loading && (
        <p className="text-gray-500">Searching...</p>
      )}

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 ">

        {/* No Results */}
        {!loading && results.length === 0 && query && (
          <div className="text-gray-300 w-full text-xl md:text-xl text-center col-span-full">
            <Image
              src="/notfound.jpg"
              alt="No Results"
              width={250}
              height={500}
              className="mx-auto mb-4"
            />
            No blogs found for "{query}"
          </div>
        )}

        {/* Blog Cards */}
        {results.map((blog) => (
          <Card
            key={blog.id}
            className="hover:cursor-pointer hover:shadow-lg transition-shadow"
          >
            <CardContent className="relative h-48 w-full">
              <Image
                src={blog.image || "/placeholder.png"}
                alt={blog.title}
                fill
                className="object-cover rounded-t-lg" 
              />
            </CardContent>

            <CardFooter className="grid gap-1">
              <CardTitle className="text-lg">{blog.title}</CardTitle>
              <CardDescription>
                {blog.categories?.join(", ") || "No categories"}
              </CardDescription>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
