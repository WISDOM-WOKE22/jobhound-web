"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import type { ChangeEvent } from "react";
import { EditorContent, type Editor as TiptapEditor } from "@tiptap/react";
import { migrateMathStrings } from "@tiptap/extension-mathematics";
import "tippy.js/themes/light.css";
import "@/styles/editor.css";
import { cn } from "@/lib/utils";
import { useEditorSetup, type UseEditorSetupOptions } from "@/hooks/useEditorSetup";
import type { SlashCommandContext } from "@/utils/constants";
import { BubbleMenu } from "./BubbleMenu";
import { BlockControls } from "./BlockControls";
import { setMathEditorInstance } from "./extensions/maths/index";
import { migrateAllMathFormats } from "./extensions/maths/migration";

const defaultUpload: NonNullable<UseEditorSetupOptions["onUploadImage"]> = file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });

export type EditorProps = {
  className?: string;
  content?: string;
  onChange?: UseEditorSetupOptions["onUpdate"];
  editable?: boolean;
  placeholder?: string;
  storageKey?: string;
  appearance?: "card" | "plain";
  onUploadImage?: UseEditorSetupOptions["onUploadImage"];
  onAddBlock?: (options: { editor: TiptapEditor; pos: number; nodeType: string }) => void;
};

export function Editor({
  className,
  content,
  editable = true,
  onChange,
  placeholder,
  storageKey,
  appearance = "card",
  onUploadImage,
  onAddBlock,
}: EditorProps) {
  const editorRef = useRef<TiptapEditor | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const fileRequestRef = useRef<{
    resolve: (file: File | null) => void;
    reject: (reason?: unknown) => void;
  } | null>(null);
  const cancelDialogFallbackRef = useRef<(() => void) | null>(null);

  const uploadHandler = useMemo(() => onUploadImage ?? defaultUpload, [onUploadImage]);

  const insertImageNode = useCallback((src: string, alt?: string) => {
    const activeEditor = editorRef.current;
    if (!activeEditor) return;

    activeEditor
      .chain()
      .focus()
      .setImage({ src, alt: alt ?? "" })
      .run();
  }, []);

  const insertImageFromUrl = useCallback(
    async (url: string) => {
      const trimmed = url.trim();
      if (!trimmed) return;
      insertImageNode(trimmed);
    },
    [insertImageNode]
  );

  const insertImageFromFile = useCallback(
    async (file: File) => {
      try {
        const src = await uploadHandler(file);
        insertImageNode(src, file.name);
      } catch (error) {
        console.error("Failed to upload image", error);
      } finally {
      }
    },
    [uploadHandler, insertImageNode]
  );

  const requestImageFile = useCallback(() => {
    if (!fileInputRef.current) {
      return Promise.resolve<File | null>(null);
    }

    return new Promise<File | null>((resolve, reject) => {
      const handleFocus = () => {
        cancelDialogFallbackRef.current?.();
        cancelDialogFallbackRef.current = null;
        setTimeout(() => {
          if (fileRequestRef.current) {
            fileRequestRef.current.resolve(null);
            fileRequestRef.current = null;
          }
        }, 150);
      };

      const cleanupFocus = () => {
        window.removeEventListener("focus", handleFocus, true);
      };

      window.addEventListener("focus", handleFocus, true);
      cancelDialogFallbackRef.current = cleanupFocus;

      fileRequestRef.current = {
        resolve: value => {
          cleanupFocus();
          resolve(value);
        },
        reject: reason => {
          cleanupFocus();
          reject(reason);
        },
      };

      fileInputRef.current!.value = "";
      fileInputRef.current!.click();
    });
  }, []);

  const slashContext = useMemo<SlashCommandContext>(
    () => ({
      insertImageFromLibrary: async () => {
        const file = await requestImageFile();
        if (!file) return;
        await insertImageFromFile(file);
      },
      insertImageFromUrl: async ({ url }) => {
        if (!url) return;
        await insertImageFromUrl(url);
      },
    }),
    [insertImageFromFile, insertImageFromUrl, requestImageFile]
  );

  const editor = useEditorSetup({
    content,
    editable,
    placeholder: "Express your ideas through the art of writing",
    storageKey,
    slashContext,
    onUploadImage: uploadHandler,
    onUpdate: onChange,
  });

  if (editorRef.current !== editor) {
    editorRef.current = editor ?? null;
  }

  // Migrate all math formats (including \(...\), \[...\], $$...$$, and $...$)
  // Also set the editor instance for math extension onClick handlers
  useEffect(() => {
    if (!editor) return;

    // Use a small delay to ensure editor is fully initialized
    const timeoutId = setTimeout(() => {
      if (!editor) return;
      
      try {
        // First run TipTap's built-in migration for $...$ format
        // This handles the standard $...$ inline math format
        migrateMathStrings(editor);
        
        // Then run our enhanced migration for \(...\), \[...\], and $$...$$ formats
        // This only processes formats that migrateMathStrings doesn't handle
        migrateAllMathFormats(editor);
        
        setMathEditorInstance(editor);
      } catch (error) {
        console.warn("Error during math migration:", error);
      }
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [editor]);

  const handleFileChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0] ?? null;

      if (fileRequestRef.current) {
        fileRequestRef.current.resolve(file);
        fileRequestRef.current = null;
      }

      cancelDialogFallbackRef.current?.();
      cancelDialogFallbackRef.current = null;

      if (file) {
        await insertImageFromFile(file);
      }
    },
    [insertImageFromFile]
  );

  const containerClass = cn(
    "group/editor relative flex w-full flex-col px-5",
    appearance === "plain" && "p-0",
    className
  );

  return (
    <div className={containerClass}>
      <div className="relative">
        <EditorContent editor={editor} />
        <BubbleMenu editor={editor} />
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      {editable && <BlockControls editor={editor} onAddBlock={onAddBlock} />}
    </div>
  );
}

export default Editor;
