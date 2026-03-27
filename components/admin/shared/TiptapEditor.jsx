"use client";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import {
  Bold,
  Heading1,
  Heading2,
  Italic,
  List,
  ListOrdered,
  Quote,
  Redo,
  Undo,
  Link as LinkIcon,
  Image as ImageIcon,
  Type,
} from "lucide-react";
import { useCallback, useEffect } from "react";

// Move MenuButton outside to avoid "Cannot create components during render"
const MenuButton = ({ onClick, isActive, children, title }) => (
  <button
    type="button"
    onClick={onClick}
    className={`p-2 rounded-md transition-all ${
      isActive
        ? "bg-black text-white"
        : "text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900"
    }`}
    title={title}
  >
    {children}
  </button>
);

export default function TiptapEditor({
  content,
  onChange,
  placeholder = "Start typing...",
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        allowBase64: true,
        HTMLAttributes: {
          class: "rounded-lg border border-zinc-200 shadow-sm max-w-full h-auto my-8",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-black underline underline-offset-4 decoration-zinc-300 font-bold hover:decoration-black transition-all",
        },
      }),
    ],
    content: content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-zinc max-w-none focus:outline-none min-h-[300px] p-8 text-zinc-900 font-montserrat leading-relaxed",
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const addImage = useCallback(() => {
    const url = window.prompt("Enter image URL");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter destination URL", previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    // update link
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="border border-zinc-200 overflow-hidden bg-white hover:border-zinc-400 transition-colors duration-300 group">
      <div className="flex flex-wrap items-center gap-1 p-2 bg-zinc-50/50 border-b border-zinc-100">
        <MenuButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          title="Bold"
        >
          <Bold size={16} />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          title="Italic"
        >
          <Italic size={16} />
        </MenuButton>
        
        <div className="w-px h-4 bg-zinc-200 mx-1" />
        
        <MenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive("heading", { level: 1 })}
          title="Heading 1"
        >
          <Heading1 size={16} />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive("heading", { level: 2 })}
          title="Heading 2"
        >
          <Heading2 size={16} />
        </MenuButton>
        <MenuButton
            onClick={() => editor.chain().focus().setParagraph().run()}
            isActive={editor.isActive("paragraph")}
            title="Normal Text"
        >
            <Type size={16} />
        </MenuButton>

        <div className="w-px h-4 bg-zinc-200 mx-1" />

        <MenuButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          title="Bullet List"
        >
          <List size={16} />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          title="Ordered List"
        >
          <ListOrdered size={16} />
        </MenuButton>
        
        <div className="w-px h-4 bg-zinc-200 mx-1" />

        <MenuButton
          onClick={setLink}
          isActive={editor.isActive("link")}
          title="Insert Link"
        >
          <LinkIcon size={16} />
        </MenuButton>
        <MenuButton
          onClick={addImage}
          title="Insert Image"
        >
          <ImageIcon size={16} />
        </MenuButton>

        <div className="w-px h-4 bg-zinc-200 mx-1" />

        <MenuButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive("blockquote")}
          title="Quote"
        >
          <Quote size={16} />
        </MenuButton>

        <div className="flex-1" />

        <div className="flex items-center gap-1 pr-2 opacity-40 group-hover:opacity-100 transition-opacity">
            <MenuButton
            onClick={() => editor.chain().focus().undo().run()}
            title="Undo"
            >
            <Undo size={14} />
            </MenuButton>
            <MenuButton
            onClick={() => editor.chain().focus().redo().run()}
            title="Redo"
            >
            <Redo size={14} />
            </MenuButton>
        </div>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
