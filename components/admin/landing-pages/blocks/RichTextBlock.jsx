"use client";
import dynamic from "next/dynamic";

const TiptapEditor = dynamic(() => import("@/components/admin/shared/TiptapEditor"), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] bg-zinc-50 border border-zinc-200 animate-pulse" />
  ),
});

export default function RichTextBlock({ block, onChange }) {
  return (
    <div>
      <TiptapEditor
        content={block.content || ""}
        onChange={(html) => onChange({ content: html })}
        placeholder="Start writing your content..."
      />
    </div>
  );
}
