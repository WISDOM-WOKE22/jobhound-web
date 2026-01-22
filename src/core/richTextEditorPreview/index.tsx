"use client";

import Editor from "@/components/Editor/Editor";

interface RichTextEditorProps {
  content: string | undefined;
}

export default function RichTextEditorPreview({ content }: RichTextEditorProps) {
  return (
    <Editor
      appearance="plain"
      className="editor-preview"
      content={content}
      editable={false}
      placeholder="Write something you love..."
    />
  );
}
