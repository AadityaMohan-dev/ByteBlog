"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
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

export default function Tiptap({ value = "", onChange }: any) {
  const [mounted, setMounted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const router = useRouter();

  useEffect(() => setMounted(true), []);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      Heading.configure({ levels: [1, 2, 3] }),
      Image,
      Underline,
      TextStyle,
      Color,
      Highlight,
      CodeBlock,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({ placeholder: "Start writing..." }),
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

  if (!mounted || !editor) return null;

  // Upload Image
  const handleFileSelect = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      editor.chain().focus().setImage({ src: reader.result as string }).run();
    };
    reader.readAsDataURL(file);
  };

  const EMOJIS = ["😀", "😂", "😍", "🔥", "👍", "✨", "🎉", "🤔", "😎", "❤️"];

  return (
    <div className="w-full relative">

      {/* Top Heading + Back Button */}
      

      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 bg-white border shadow-md p-2 rounded-xl mb-3">

        <button title="Bold" type="button" className="tb-btn" onClick={() => editor.chain().focus().toggleBold().run()}>
          <b>B</b>
        </button>

        <button title="Italic" type="button" className="tb-btn" onClick={() => editor.chain().focus().toggleItalic().run()}>
          <i>I</i>
        </button>

        <button title="Underline" type="button" className="tb-btn" onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <u>U</u>
        </button>

        <button title="Strikethrough" type="button" className="tb-btn" onClick={() => editor.chain().focus().toggleStrike().run()}>
          <s>S</s>
        </button>

        <button title="Highlight Text" type="button" className="tb-btn" onClick={() => editor.chain().focus().toggleHighlight().run()}>
          ✦
        </button>

        {/* Color Picker */}
        <input
          title="Text Color"
          type="color"
          className="w-8 h-8 rounded tb-btn"
          onInput={(e: any) => editor.chain().focus().setColor(e.target.value).run()}
        />

        {/* Headings */}
        <button title="Heading 1" type="button" className="tb-btn" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
          H1
        </button>

        <button title="Heading 2" type="button" className="tb-btn" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          H2
        </button>

        <button title="Heading 3" type="button" className="tb-btn" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          H3
        </button>

        {/* Lists */}
        <button title="Bullet List" type="button" className="tb-btn" onClick={() => editor.chain().focus().toggleBulletList().run()}>
          •
        </button>

        <button title="Numbered List" type="button" className="tb-btn" onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          1.
        </button>

        {/* Alignment */}
        <button title="Align Left" type="button" className="tb-btn" onClick={() => editor.chain().focus().setTextAlign("left").run()}>
          ⬅
        </button>

        <button title="Align Center" type="button" className="tb-btn" onClick={() => editor.chain().focus().setTextAlign("center").run()}>
          ⬍
        </button>

        <button title="Align Right" type="button" className="tb-btn" onClick={() => editor.chain().focus().setTextAlign("right").run()}>
          ➡
        </button>

        <button title="Justify" type="button" className="tb-btn" onClick={() => editor.chain().focus().setTextAlign("justify").run()}>
          ☰
        </button>

        {/* Code Block */}
        <button title="Code Block" type="button" className="tb-btn" onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
          {"</>"}
        </button>

        {/* Image Upload */}
        <button title="Upload Image" type="button" className="tb-btn" onClick={() => fileInputRef.current?.click()}>
          🖼 Upload
        </button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Emoji Picker */}
        <button title="Emoji Picker" type="button" className="tb-btn" onClick={() => setShowEmoji(!showEmoji)}>
          😊 Emoji
        </button>
      </div>

      {/* Emoji Popup */}
      {showEmoji && (
        <div className="absolute bg-white border p-2 rounded shadow-md grid grid-cols-5 gap-2 z-50 top-32">
          {EMOJIS.map((emoji) => (
            <button
              type="button"
              key={emoji}
              className="text-xl hover:bg-gray-200 p-1 rounded"
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

      {/* Editor */}
      <div className="border rounded-xl shadow-sm bg-white hover:shadow-md transition">
        <EditorContent editor={editor} />
      </div>

      <style jsx>{`
        .tb-btn {
          padding: 6px 10px;
          border-radius: 6px;
          border: 1px solid #ddd;
          background: #f8f8f8;
          transition: 0.2s;
        }
        .tb-btn:hover {
          background: #eaeaea;
        }
      `}</style>
    </div>
  );
}
