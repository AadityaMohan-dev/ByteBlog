"use client";

import { useEffect, useState, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import CodeBlock from "@tiptap/extension-code-block";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import { toast } from "sonner";

interface TiptapProps {
  value?: string;
  onChange?: (html: string, json: any) => void;
}

export default function Tiptap({ value = "", onChange }: TiptapProps) {
  const [mounted, setMounted] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const emojiRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => setMounted(true), []);

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiRef.current &&
        !emojiRef.current.contains(event.target as Node)
      ) {
        setShowEmoji(false);
      }
    };

    if (showEmoji) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmoji]);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        heading: false,
      }),
      Heading.configure({
        levels: [1, 2, 3],
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline hover:text-blue-800",
        },
      }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      CodeBlock.configure({
        HTMLAttributes: {
          class: "bg-gray-900 text-white p-4 rounded-lg my-4",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder: "Start writing your blog content here...",
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          "prose prose-lg dark:prose-invert max-w-none min-h-[400px] px-6 py-6 focus:outline-none",
      },
    },
    onUpdate({ editor }) {
      onChange?.(editor.getHTML(), editor.getJSON());
    },
  });

  if (!mounted || !editor) {
    return (
      <div className="w-full border rounded-xl p-6 bg-gray-100 animate-pulse">
        <div className="h-8 bg-gray-300 rounded mb-4"></div>
        <div className="h-64 bg-gray-300 rounded"></div>
      </div>
    );
  }

  // Handle image upload with validation
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 2MB for editor images)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size must be less than 2MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        editor.chain().focus().setImage({ src: reader.result as string }).run();
        toast.success("Image inserted!");
      }
    };
    reader.onerror = () => {
      toast.error("Failed to read image file");
    };
    reader.readAsDataURL(file);

    // Reset input
    e.target.value = "";
  };

  // Handle link insertion
  const handleInsertLink = () => {
    if (linkUrl) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: linkUrl })
        .run();
      setLinkUrl("");
      setShowLinkInput(false);
      toast.success("Link added!");
    }
  };

  // Remove link
  const handleRemoveLink = () => {
    editor.chain().focus().unsetLink().run();
    toast.success("Link removed!");
  };

  const EMOJIS = [
    "😀",
    "😂",
    "😍",
    "🔥",
    "👍",
    "✨",
    "🎉",
    "🤔",
    "😎",
    "❤️",
    "👏",
    "🚀",
    "💡",
    "📝",
    "✅",
    "⭐",
  ];

  const isActive = (type: string, opts?: any) => {
    return editor.isActive(type, opts);
  };

  return (
    <div className="w-full relative">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 bg-white border shadow-md p-3 rounded-xl mb-3">
        {/* Text Formatting */}
        <div className="flex gap-1 border-r pr-2">
          <button
            title="Bold"
            type="button"
            className={`tb-btn ${isActive("bold") ? "bg-gray-300" : ""}`}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <b>B</b>
          </button>

          <button
            title="Italic"
            type="button"
            className={`tb-btn ${isActive("italic") ? "bg-gray-300" : ""}`}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <i>I</i>
          </button>

          <button
            title="Underline"
            type="button"
            className={`tb-btn ${isActive("underline") ? "bg-gray-300" : ""}`}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            <u>U</u>
          </button>

          <button
            title="Strikethrough"
            type="button"
            className={`tb-btn ${isActive("strike") ? "bg-gray-300" : ""}`}
            onClick={() => editor.chain().focus().toggleStrike().run()}
          >
            <s>S</s>
          </button>
        </div>

        {/* Highlight & Color */}
        <div className="flex gap-1 border-r pr-2">
          <button
            title="Highlight Text"
            type="button"
            className={`tb-btn ${isActive("highlight") ? "bg-yellow-200" : ""}`}
            onClick={() => editor.chain().focus().toggleHighlight().run()}
          >
            ✦
          </button>

          <input
            title="Text Color"
            type="color"
            className="w-8 h-8 rounded tb-btn cursor-pointer"
            onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
              editor.chain().focus().setColor(e.target.value).run()
            }
          />
        </div>

        {/* Headings */}
        <div className="flex gap-1 border-r pr-2">
          <button
            title="Heading 1"
            type="button"
            className={`tb-btn ${
              isActive("heading", { level: 1 }) ? "bg-gray-300" : ""
            }`}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
          >
            H1
          </button>

          <button
            title="Heading 2"
            type="button"
            className={`tb-btn ${
              isActive("heading", { level: 2 }) ? "bg-gray-300" : ""
            }`}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
          >
            H2
          </button>

          <button
            title="Heading 3"
            type="button"
            className={`tb-btn ${
              isActive("heading", { level: 3 }) ? "bg-gray-300" : ""
            }`}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
          >
            H3
          </button>
        </div>

        {/* Lists */}
        <div className="flex gap-1 border-r pr-2">
          <button
            title="Bullet List"
            type="button"
            className={`tb-btn ${isActive("bulletList") ? "bg-gray-300" : ""}`}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <span className="text-lg">•</span>
          </button>

          <button
            title="Numbered List"
            type="button"
            className={`tb-btn ${isActive("orderedList") ? "bg-gray-300" : ""}`}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            1.
          </button>
        </div>

        {/* Alignment */}
        <div className="flex gap-1 border-r pr-2">
          <button
            title="Align Left"
            type="button"
            className={`tb-btn ${
              editor.isActive({ textAlign: "left" }) ? "bg-gray-300" : ""
            }`}
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
          >
            ⬅
          </button>

          <button
            title="Align Center"
            type="button"
            className={`tb-btn ${
              editor.isActive("textAlign", "center") ? "bg-gray-300" : ""
            }`}
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
          >
            ⬍
          </button>

          <button
            title="Align Right"
            type="button"
            className={`tb-btn ${
              editor.isActive({ textAlign: "right" }) ? "bg-gray-300" : ""
            }`}
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
          >
            ➡
          </button>

          <button
            title="Justify"
            type="button"
            className={`tb-btn ${
              editor.isActive({ textAlign: "justify" }) ? "bg-gray-300" : ""
            }`}
            onClick={() =>
              editor.chain().focus().setTextAlign("justify").run()
            }
          >
            ☰
          </button>
        </div>

        {/* Code & Special */}
        <div className="flex gap-1 border-r pr-2">
          <button
            title="Code Block"
            type="button"
            className={`tb-btn ${isActive("codeBlock") ? "bg-gray-300" : ""}`}
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          >
            {"</>"}
          </button>

          <button
            title="Horizontal Line"
            type="button"
            className="tb-btn"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
          >
            ─
          </button>
        </div>

        {/* Media & Extras */}
        <div className="flex gap-1">
          <button
            title="Upload Image"
            type="button"
            className="tb-btn"
            onClick={() => fileInputRef.current?.click()}
          >
            🖼️
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
          />

          <button
            title={isActive("link") ? "Remove Link" : "Add Link"}
            type="button"
            className={`tb-btn ${isActive("link") ? "bg-blue-200" : ""}`}
            onClick={() => {
              if (isActive("link")) {
                handleRemoveLink();
              } else {
                setShowLinkInput(!showLinkInput);
              }
            }}
          >
            🔗
          </button>

          <div className="relative">
            <button
              title="Emoji Picker"
              type="button"
              className="tb-btn"
              onClick={() => setShowEmoji(!showEmoji)}
            >
              😊
            </button>

            {showEmoji && (
              <div
                ref={emojiRef}
                className="absolute bg-white border p-3 rounded-lg shadow-lg grid grid-cols-4 gap-2 z-50 top-12 right-0 w-48"
              >
                {EMOJIS.map((emoji) => (
                  <button
                    type="button"
                    key={emoji}
                    className="text-2xl hover:bg-gray-200 p-2 rounded transition"
                    onClick={() => {
                      editor.chain().focus().insertContent(emoji).run();
                      setShowEmoji(false);
                    }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Undo/Redo */}
        <div className="flex gap-1 ml-auto">
          <button
            title="Undo"
            type="button"
            className="tb-btn"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
          >
            ↶
          </button>

          <button
            title="Redo"
            type="button"
            className="tb-btn"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
          >
            ↷
          </button>
        </div>
      </div>

      {/* Link Input */}
      {showLinkInput && (
        <div className="bg-white border p-3 rounded-lg shadow-md mb-3 flex gap-2">
          <input
            type="url"
            placeholder="https://example.com"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleInsertLink();
              }
              if (e.key === "Escape") {
                setShowLinkInput(false);
                setLinkUrl("");
              }
            }}
            className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          <button
            type="button"
            onClick={handleInsertLink}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Add
          </button>
          <button
            type="button"
            onClick={() => {
              setShowLinkInput(false);
              setLinkUrl("");
            }}
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Editor */}
      <div className="border rounded-xl shadow-sm bg-white hover:shadow-md transition overflow-hidden">
        <EditorContent editor={editor} />
      </div>

      {/* Character Count */}
      <div className="text-xs text-gray-500 mt-2 text-right">
        {editor.storage.characterCount?.characters() || 0} characters
      </div>

      <style jsx>{`
        .tb-btn {
          padding: 6px 10px;
          border-radius: 6px;
          border: 1px solid #ddd;
          background: #f8f8f8;
          transition: all 0.2s;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
        }
        .tb-btn:hover:not(:disabled) {
          background: #e5e5e5;
          border-color: #bbb;
        }
        .tb-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}