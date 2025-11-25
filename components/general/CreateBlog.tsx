"use client";

import { toast } from "sonner";
import { useState } from "react";
import { Checkbox } from "@radix-ui/react-checkbox";
import { Button } from "../ui/button";
import { Field, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import Tiptap from "./Tiptap";
import { createBlogAction } from "@/src/action/blog.action";
import { useRouter } from "next/navigation"; 

const TiptapAny = Tiptap as any;

export default function CreateBlog({ user, isAuthenticated }: any) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [contentHtml, setContentHtml] = useState("");
  const [contentJson, setContentJson] = useState({});
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  if (!isAuthenticated) {
    return <div className="p-6 text-lg">Please log in to create a blog post.</div>;
  }

  const toggleCategory = (cat: string) => {
    setCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleImageUpload = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setThumbnail(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createBlogAction({
        title,
        description,
        thumbnail,
        categories,
        contentHtml,
        contentJson,
        authorId: user.id,
      });

      toast.success("Blog created successfully!");

      router.push("/dashboard");
    } catch (error) {
      toast.error("Failed to create blog.");
    } finally {
      setLoading(false);
    }
  };

  return (
     <div className="flex  gap-4 mb-4">
         <div className="mx-auto p-5 space-y-6 md:px-50">
      <h1 className="text-4xl font-bold">Create a New Blog Post</h1>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <Field>
          <FieldLabel htmlFor="title">Title</FieldLabel>
          <Input
            id="title"
            placeholder="Enter title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="desc">Description</FieldLabel>
          <Input
            id="desc"
            placeholder="Enter description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Field>

        <Field>
          <FieldLabel>Thumbnail</FieldLabel>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          {thumbnail && (
            <img
              src={thumbnail}
              alt="preview"
              className="mt-3 w-40 h-40 object-cover rounded-md border"
            />
          )}
        </Field>

        <TiptapAny
          onChange={(html: string, json: any) => {
            setContentHtml(html);
            setContentJson(JSON.parse(JSON.stringify(json)));
          }}
        />

        <div className="flex gap-4 flex-wrap">
          {["Tech", "Lifestyle", "Travel", "Food"].map((cat) => (
            <label
              key={cat}
              className={`flex items-center gap-2 px-3 py-1 rounded-md cursor-pointer border ${
                categories.includes(cat)
                  ? "bg-black text-white"
                  : "hover:bg-black hover:text-white"
              }`}
            >
              <Checkbox
                checked={categories.includes(cat)}
                onCheckedChange={() => toggleCategory(cat)}
              />
              {cat}
            </label>
          ))}
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Post"}
          </Button>

          <Button variant="secondary">Cancel</Button>
        </div>
      </form>
    </div>
      </div>
   
  );
}
