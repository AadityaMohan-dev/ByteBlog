"use client";

import { toast } from "sonner";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "../ui/button";
import { Field, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import Tiptap from "./Tiptap";
import { createBlogAction } from "@/src/action/blog.action";
import { useRouter } from "next/navigation";
import Image from "next/image";

const TiptapAny = Tiptap as any;

interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  imageUrl?: string;
}

interface CreateBlogProps {
  user: User | null;
  isAuthenticated: boolean;
}

export default function CreateBlog({ user, isAuthenticated }: CreateBlogProps) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [contentHtml, setContentHtml] = useState("");
  const [contentJson, setContentJson] = useState({});
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
    content?: string;
  }>({});

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Authentication Required
          </h2>
          <p className="text-gray-600">
            Please log in to create a blog post.
          </p>
          <Button onClick={() => router.push("/sign-in")}>Sign In</Button>
        </div>
      </div>
    );
  }

  const toggleCategory = (cat: string) => {
    setCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setThumbnail(reader.result as string);
    reader.onerror = () => toast.error("Failed to read image");
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!title.trim()) {
      newErrors.title = "Title is required";
    } else if (title.length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }

    if (!description.trim()) {
      newErrors.description = "Description is required";
    } else if (description.length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    if (!contentHtml.trim() || contentHtml === "<p></p>") {
      newErrors.content = "Content is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const result = await createBlogAction({
        title: title.trim(),
        description: description.trim(),
        thumbnail,
        categories,
        contentHtml,
        contentJson,
      });

      if (result.success) {
        toast.success("Blog created successfully!");
        router.push("/dashboard");
      } else {
        toast.error("Failed to create blog");
      }
    } catch (error) {
      console.error("Error creating blog:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create blog"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (title || description || contentHtml) {
      if (
        confirm(
          "You have unsaved changes. Are you sure you want to leave?"
        )
      ) {
        router.push("/dashboard");
      }
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-10">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Create a New Blog Post
        </h1>
        <p className="text-gray-600">
          Share your thoughts and ideas with the community
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Title */}
        <Field>
          <FieldLabel htmlFor="title">
            Title <span className="text-red-500">*</span>
          </FieldLabel>
          <Input
            id="title"
            placeholder="Enter an engaging title..."
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title) setErrors({ ...errors, title: undefined });
            }}
            className={errors.title ? "border-red-500" : ""}
            disabled={loading}
            maxLength={200}
          />
          {errors.title && (
            <p className="text-sm text-red-500 mt-1">{errors.title}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            {title.length}/200 characters
          </p>
        </Field>

        {/* Description */}
        <Field>
          <FieldLabel htmlFor="desc">
            Description <span className="text-red-500">*</span>
          </FieldLabel>
          <Input
            id="desc"
            placeholder="Brief description of your blog..."
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (errors.description)
                setErrors({ ...errors, description: undefined });
            }}
            className={errors.description ? "border-red-500" : ""}
            disabled={loading}
            maxLength={500}
          />
          {errors.description && (
            <p className="text-sm text-red-500 mt-1">{errors.description}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            {description.length}/500 characters
          </p>
        </Field>

        {/* Thumbnail */}
        <Field>
          <FieldLabel>Thumbnail Image</FieldLabel>
          <div className="space-y-3">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={loading}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800 cursor-pointer"
            />
            {thumbnail && (
              <div className="relative w-full max-w-md">
                <div className="relative h-48 w-full rounded-lg overflow-hidden border">
                  <Image
                    src={thumbnail}
                    alt="Thumbnail preview"
                    fill
                    className="object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setThumbnail("")}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                  disabled={loading}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            )}
            <p className="text-xs text-gray-500">
              Recommended: 1200x630px, Max size: 5MB
            </p>
          </div>
        </Field>

        {/* Content Editor */}
        <Field>
          <FieldLabel>
            Content <span className="text-red-500">*</span>
          </FieldLabel>
          <TiptapAny
            onChange={(html: string, json: any) => {
              setContentHtml(html);
              setContentJson(JSON.parse(JSON.stringify(json)));
              if (errors.content) setErrors({ ...errors, content: undefined });
            }}
          />
          {errors.content && (
            <p className="text-sm text-red-500 mt-1">{errors.content}</p>
          )}
        </Field>

        {/* Categories */}
        <Field>
          <FieldLabel>
            Categories{" "}
            <span className="text-sm text-gray-500 font-normal">
              (Select at least one)
            </span>
          </FieldLabel>
          <div className="flex gap-3 flex-wrap">
            {["Tech", "Lifestyle", "Travel", "Food", "Education", "Health"].map(
              (cat) => (
                <label
                  key={cat}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer border-2 transition-all ${
                    categories.includes(cat)
                      ? "bg-black text-white border-black"
                      : "bg-white text-gray-700 border-gray-300 hover:border-black"
                  } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <Checkbox
                    checked={categories.includes(cat)}
                    onCheckedChange={() => !loading && toggleCategory(cat)}
                    disabled={loading}
                  />
                  <span className="font-medium">{cat}</span>
                </label>
              )
            )}
          </div>
          {categories.length > 0 && (
            <p className="text-xs text-gray-500 mt-2">
              Selected: {categories.join(", ")}
            </p>
          )}
        </Field>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4 border-t">
          <Button
            type="submit"
            disabled={loading}
            className="min-w-[120px]"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creating...
              </>
            ) : (
              "Create Post"
            )}
          </Button>

          <Button
            type="button"
            variant="secondary"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </Button>

          {/* Draft Save (Optional Feature) */}
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              localStorage.setItem(
                "blog-draft",
                JSON.stringify({
                  title,
                  description,
                  thumbnail,
                  categories,
                  contentHtml,
                  contentJson,
                  savedAt: new Date().toISOString(),
                })
              );
              toast.success("Draft saved locally!");
            }}
            disabled={loading}
            className="ml-auto"
          >
            💾 Save Draft
          </Button>
        </div>
      </form>
    </div>
  );
}