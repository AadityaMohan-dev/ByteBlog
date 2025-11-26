// components/general/RelatedBlogs.tsx

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Author {
  id: string;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
}

interface Blog {
  id: string;
  title: string;
  description: string | null;
  thumbnail: string | null;
  categories: string[];
  createdAt: Date;
  author: Author;
}

interface RelatedBlogsProps {
  blogs: Blog[];
  currentBlogId: string;
}

export default function RelatedBlogs({ blogs, currentBlogId }: RelatedBlogsProps) {
  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = 3;

  if (!blogs || blogs.length === 0) return null;

  const canScrollLeft = startIndex > 0;
  const canScrollRight = startIndex + itemsPerPage < blogs.length;

  const handlePrevious = () => {
    setStartIndex(Math.max(0, startIndex - itemsPerPage));
  };

  const handleNext = () => {
    setStartIndex(
      Math.min(blogs.length - itemsPerPage, startIndex + itemsPerPage)
    );
  };

  const visibleBlogs = blogs.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section className="container mx-auto px-16 py-12 bg-gray-50 rounded-lg">
      {/* Header */}
      <div className="flex items-center  justify-between mb-8">
        <div className="flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-green-700" />
          <h2 className="text-xl md:text-3xl font-bold">You Might Also Like</h2>
        </div>

        {/* Navigation Buttons */}
        {blogs.length > itemsPerPage && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrevious}
              disabled={!canScrollLeft}
              className="rounded-full"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              disabled={!canScrollRight}
              className="rounded-full"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleBlogs.map((blog) => (
          <Link
            key={blog.id}
            href={`/blog/${blog.id}`}
            className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            {/* Thumbnail */}
            <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
              {blog.thumbnail ? (
                <Image
                  src={blog.thumbnail}
                  alt={blog.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-green-100 via-blue-100 to-purple-100">
                  <BookOpen className="w-16 h-16 text-gray-300" />
                </div>
              )}
              
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </div>

            {/* Content */}
            <div className="p-5">
              {/* Categories */}
              {blog.categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {blog.categories.slice(0, 2).map((category, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 text-xs font-medium rounded-full bg-green-50 text-green-700 border border-green-200"
                    >
                      {category}
                    </span>
                  ))}
                  {blog.categories.length > 2 && (
                    <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                      +{blog.categories.length - 2} more
                    </span>
                  )}
                </div>
              )}

              {/* Title */}
              <h3 className="font-bold  mb-2 line-clamp-1 group-hover:text-green-700 transition-colors">
                {blog.title}
              </h3>

              {/* Description */}
              {blog.description && (
                <p className="text-gray-600 text-xs line-clamp-1 mb-4 leading-relaxed">
                  {blog.description}
                </p>
              )}

              {/* Author & Date */}
              <div className="flex items-center gap-3 pt-2 border-t">
                <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-gray-100">
                  <img
                    src={blog.author.avatarUrl || "/img3.png"}
                    alt={`${blog.author.firstName}'s avatar`}
                 
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">
                    {blog.author.firstName} {blog.author.lastName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(blog.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination Dots */}
      {blogs.length > itemsPerPage && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({
            length: Math.ceil(blogs.length / itemsPerPage),
          }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setStartIndex(idx * itemsPerPage)}
              className={`h-2 rounded-full transition-all ${
                Math.floor(startIndex / itemsPerPage) === idx
                  ? "w-8 bg-green-700"
                  : "w-2 bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to page ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}