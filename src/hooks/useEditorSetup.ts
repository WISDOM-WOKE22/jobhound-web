import { useEffect, useMemo } from "react";
import { useEditor, type EditorOptions } from "@tiptap/react";
import { createExtensions, type UploadImageFn } from "@/extensions";
import type { SlashCommandContext, SlashCommandItem } from "@/utils/constants";
import { preprocessMathContent } from "@/components/Editor/extensions/maths/migration";

export type UseEditorSetupOptions = {
  content?: string;
  placeholder?: string;
  editable?: boolean;
  autofocus?: EditorOptions["autofocus"];
  storageKey?: string;
  onUpdate?: (payload: { html: string; text: string }) => void;
  onUploadImage?: UploadImageFn;
  slashItems?: SlashCommandItem[];
  slashContext?: SlashCommandContext;
};

/**
 * Centralised editor factory hook.
 * Keeps extension wiring, persistence, and lifecycle
 * concerns hidden from the UI components.
 */
export const useEditorSetup = ({
  content,
  placeholder,
  editable = true,
  autofocus = "end",
  storageKey,
  onUpdate,
  onUploadImage,
  slashItems,
  slashContext,
}: UseEditorSetupOptions) => {
  const extensions = useMemo(
    () =>
      createExtensions({
        // placeholder: placeholder ?? "Start writing your next idea…",
        uploadImage: onUploadImage,
        slashItems,
        // placeholder: "Write something…",
        placeholder: placeholder ?? "Write something…s",
        slashContext,
        
      }),
    [placeholder, onUploadImage, slashItems, slashContext]
  );

  const initialContent = useMemo(() => {
    let rawContent: string | undefined;
    
    if (typeof window === "undefined" || !storageKey) {
      rawContent = content;
    } else {
      const stored = window.localStorage.getItem(storageKey);
      rawContent = stored ?? content;
    }

    // Only preprocess if content is a string and not already processed
    // Don't preprocess stored content as it's already in the correct format
    if (rawContent && typeof rawContent === "string" && !storageKey) {
      // Only preprocess the initial content prop, not stored content
      return preprocessMathContent(rawContent);
    }
    
    return rawContent;
  }, [content, storageKey]);

  const editor = useEditor(
    {
      
      extensions,
      content: initialContent,
      autofocus,
      editable,
      editorProps: {
        attributes: {
          class:
            "tiptap prose prose-base dark:prose-invert max-w-none focus:outline-none selection:bg-primary/20 selection:text-primary-foreground",
        },
      },
      onUpdate: ({ editor }) => {
        const html = editor.getHTML();
        const text = editor.getText();

        if (storageKey && typeof window !== "undefined") {
          window.localStorage.setItem(storageKey, html);
        }

        onUpdate?.({ html, text });
      },
    },
    [extensions, editable, autofocus, onUpdate, storageKey]
  );

  useEffect(() => {
    if (!editor || content === undefined) {
      return;
    }

    const current = editor.getHTML();
    // Only update if content actually changed
    if (content !== current) {
      // Check if content is already processed (contains math nodes)
      // If it does, use it as-is. Otherwise, preprocess it.
      const needsPreprocessing = 
        !content.includes('data-type="inline-math"') && 
        !content.includes('data-type="block-math"') &&
        (content.includes('\\(') || content.includes('\\[') || content.match(/\$\$[^$]+\$\$/));
      
      const contentToSet = needsPreprocessing ? preprocessMathContent(content) : content;
      
      // Only set if different to avoid unnecessary updates
      if (contentToSet !== current) {
        editor.commands.setContent(contentToSet, { emitUpdate: false });
      }
    }
  }, [editor, content]);

  return editor;
};
