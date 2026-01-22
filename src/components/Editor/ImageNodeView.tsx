"use client";

/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent, KeyboardEvent } from "react";
import type { NodeViewProps } from "@tiptap/react";
import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";
import { AlignCenter, AlignLeft, AlignRight, Loader2, RefreshCcw, Trash2, Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UploadImageFn } from "@/extensions/Image";

type ImageNodeAttributes = {
  src: string;
  alt?: string;
  title?: string;
  caption?: string;
  width?: number;
  imageWidth?: number | null;
  imageHeight?: number | null;
  align?: "left" | "center" | "right";
};

type ImageNodeViewProps = NodeViewProps & {
  uploadImage?: UploadImageFn;
};

const DEFAULT_UPLOAD: UploadImageFn = file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });

export function ImageNodeView({
  node,
  updateAttributes,
  editor,
  selected,
  getPos,
  uploadImage,
}: ImageNodeViewProps) {
  const attrs = node.attrs as ImageNodeAttributes;
  const containerWidth = Number(attrs.width ?? 100);
  const imageWidth = attrs.imageWidth ? Number(attrs.imageWidth) : null;
  const imageHeight = attrs.imageHeight ? Number(attrs.imageHeight) : null;
  const align = (attrs.align ?? "center") as ImageNodeAttributes["align"];
  const [captionValue, setCaptionValue] = useState(attrs.caption ?? "");
  const [isHovering, setHovering] = useState(false);
  const [isUploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const captionRef = useRef<HTMLDivElement | null>(null);
  
  // Check if editor is in editable mode
  const isEditable = editor?.isEditable ?? false;

  const alignmentClass = useMemo(() => {
    switch (align) {
      case "left":
        return "items-start text-left";
      case "right":
        return "items-end text-right";
      default:
        return "items-center text-center";
    }
  }, [align]);

  useEffect(() => {
    setCaptionValue(attrs.caption ?? "");
  }, [attrs.caption]);

  const handleAlignment = useCallback(
    (nextAlign: ImageNodeAttributes["align"]) => {
      if (!isEditable) return;
      updateAttributes({ align: nextAlign });
      editor.chain().focus().run();
    },
    [editor, updateAttributes, isEditable]
  );

  const handleWidthChange = useCallback(
    (value: number) => {
      if (!isEditable) return;
      updateAttributes({ width: value });
    },
    [updateAttributes, isEditable]
  );

  const handleImageWidthChange = useCallback(
    (value: number) => {
      if (!isEditable) return;
      updateAttributes({ imageWidth: value || null });
    },
    [updateAttributes, isEditable]
  );

  const handleImageHeightChange = useCallback(
    (value: number) => {
      if (!isEditable) return;
      updateAttributes({ imageHeight: value || null });
    },
    [updateAttributes, isEditable]
  );

  const handleResetSize = useCallback(() => {
    if (!isEditable) return;
    updateAttributes({ imageWidth: null, imageHeight: null });
  }, [updateAttributes, isEditable]);

  const removeNode = useCallback(() => {
    if (!isEditable) return;
    const pos = getPos?.();
    if (typeof pos !== "number") {
      editor.commands.deleteSelection();
      return;
    }

    const tr = editor.state.tr.delete(pos, pos + node.nodeSize);
    editor.view.dispatch(tr);
  }, [editor, getPos, node.nodeSize, isEditable]);

  const openFileDialog = useCallback(() => {
    if (!isEditable || !fileInputRef.current) return;
    fileInputRef.current.value = "";
    fileInputRef.current.click();
  }, [isEditable]);

  const handleReplace = useCallback(
    async (file: File) => {
      if (!isEditable) return;
      const uploader = uploadImage ?? DEFAULT_UPLOAD;
      try {
        setUploading(true);
        setUploadProgress(15);
        const src = await uploader(file);
        setUploadProgress(90);
        updateAttributes({ src, alt: file.name });
      } catch (error) {
        console.error("Image upload failed", error);
      } finally {
        setUploadProgress(100);
        setTimeout(() => {
          setUploading(false);
          setUploadProgress(0);
        }, 300);
      }
    },
    [uploadImage, updateAttributes, isEditable]
  );

  const handleFileInputChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      await handleReplace(file);
    },
    [handleReplace]
  );

  const handleCaptionBlur = useCallback(() => {
    if (!isEditable) return;
    updateAttributes({ caption: captionValue });
  }, [captionValue, updateAttributes, isEditable]);

  const handleCaptionKeydown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (!isEditable) {
        event.preventDefault();
        return;
      }
      if (event.key === "Enter") {
        event.preventDefault();
        handleCaptionBlur();
        editor.commands.focus();
      }
    },
    [editor, handleCaptionBlur, isEditable]
  );

  return (
    <NodeViewWrapper
      className={cn(
        "editor-image group relative flex flex-col gap-2",
        alignmentClass,
        selected && "ring-2 ring-primary"
      )}
      data-drag-handle={isEditable ? true : undefined}
      data-node-type={node.type.name}
      onMouseEnter={() => isEditable && setHovering(true)}
      onMouseLeave={() => isEditable && setHovering(false)}
    >
      <figure
        className={cn(
          "relative flex w-full flex-col gap-2",
          align === "left" && "items-start",
          align === "center" && "items-center",
          align === "right" && "items-end"
        )}
        style={{ width: `${containerWidth}%` }}
      >
        <div 
          className={cn(
            "relative overflow-hidden rounded-2xl border border-border/60 bg-muted/40",
            "inline-flex items-center justify-center",
            !imageWidth && !imageHeight && "w-full"
          )}
          style={{
            ...(imageWidth && { width: `${imageWidth}px`, maxWidth: `${imageWidth}px` }),
            ...(imageHeight && { height: `${imageHeight}px`, maxHeight: `${imageHeight}px` }),
          }}
        >
          <img
            src={attrs.src}
            alt={attrs.alt ?? ""}
            className={cn(
              "block select-none",
              imageWidth || imageHeight 
                ? "h-full w-full object-contain" 
                : "h-auto w-full object-contain"
            )}
            style={{
              ...(imageWidth && { width: `${imageWidth}px`, maxWidth: `${imageWidth}px` }),
              ...(imageHeight && { height: `${imageHeight}px`, maxHeight: `${imageHeight}px` }),
              ...(!imageWidth && !imageHeight && { maxHeight: "600px", maxWidth: "100%" }),
            }}
            draggable={false}
            onDoubleClick={isEditable ? openFileDialog : undefined}
          />

          {isEditable && (selected || isHovering) && !isUploading && (
            <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-b from-background/40 via-transparent to-background/40 p-3 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  className="rounded-full bg-background/80 p-2 shadow-sm hover:bg-background"
                  title="Replace image"
                  onClick={openFileDialog}
                >
                  <RefreshCcw className="size-4" />
                </button>
                <button
                  type="button"
                  className="rounded-full bg-background/80 p-2 shadow-sm hover:bg-destructive/90 hover:text-destructive-foreground"
                  title="Remove image"
                  onClick={removeNode}
                >
                  <Trash2 className="size-4" />
                </button>
              </div>

              <div className="flex flex-col gap-2 rounded-full bg-background/80 px-3 py-2 shadow-sm">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      className={cn(
                        "rounded-full p-1.5 hover:bg-muted",
                        align === "left" && "bg-primary/10 text-primary"
                      )}
                      onClick={() => handleAlignment("left")}
                      title="Align left"
                    >
                      <AlignLeft className="size-4" />
                    </button>
                    <button
                      type="button"
                      className={cn(
                        "rounded-full p-1.5 hover:bg-muted",
                        align === "center" && "bg-primary/10 text-primary"
                      )}
                      onClick={() => handleAlignment("center")}
                      title="Align center"
                    >
                      <AlignCenter className="size-4" />
                    </button>
                    <button
                      type="button"
                      className={cn(
                        "rounded-full p-1.5 hover:bg-muted",
                        align === "right" && "bg-primary/10 text-primary"
                      )}
                      onClick={() => handleAlignment("right")}
                      title="Align right"
                    >
                      <AlignRight className="size-4" />
                    </button>
                  </div>

                  <label className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="min-w-[35px]">{Math.round(containerWidth)}%</span>
                    <input
                      type="range"
                      min={30}
                      max={100}
                      value={containerWidth}
                      onChange={event => handleWidthChange(Number(event.target.value))}
                      className="h-1 w-20 cursor-pointer appearance-none rounded-full bg-muted accent-primary"
                    />
                  </label>
                </div>

                <div className="flex items-center gap-2 border-t border-border/40 pt-2">
                  <div className="flex items-center gap-1.5 flex-1">
                    <span className="text-xs text-muted-foreground min-w-[50px]">Width:</span>
                    <input
                      type="number"
                      min={50}
                      max={2000}
                      value={imageWidth ?? ""}
                      onChange={event => handleImageWidthChange(Number(event.target.value) || 0)}
                      placeholder="Auto"
                      className="h-7 w-20 rounded-md border border-border bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <span className="text-xs text-muted-foreground">px</span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-1">
                    <span className="text-xs text-muted-foreground min-w-[50px]">Height:</span>
                    <input
                      type="number"
                      min={50}
                      max={2000}
                      value={imageHeight ?? ""}
                      onChange={event => handleImageHeightChange(Number(event.target.value) || 0)}
                      placeholder="Auto"
                      className="h-7 w-20 rounded-md border border-border bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <span className="text-xs text-muted-foreground">px</span>
                  </div>
                  {(imageWidth || imageHeight) && (
                    <button
                      type="button"
                      className="rounded-md p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground"
                      onClick={handleResetSize}
                      title="Reset to auto size"
                    >
                      <Minimize2 className="size-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {isUploading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/80 text-sm font-medium">
              <Loader2 className="size-5 animate-spin" />
              <span>{uploadProgress < 100 ? "Uploading…" : "Processing…"}</span>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileInputChange}
          />
        </div>

        <figcaption className="w-full text-sm text-muted-foreground">
          <div
            ref={captionRef}
            className={cn(
              "rounded-xl bg-transparent px-3 py-2 text-center outline-none",
              isEditable && "focus:bg-muted/40"
            )}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={handleCaptionBlur}
            onInput={isEditable ? (event) => setCaptionValue((event.target as HTMLDivElement).innerText) : undefined}
            onKeyDown={handleCaptionKeydown}
            onFocus={isEditable ? (event) => {
              if (!captionValue) {
                event.currentTarget.innerText = "";
              }
            } : undefined}
            role="textbox"
            aria-label="Image caption"
          >
            {captionValue || (isEditable ? "Write a caption" : "")}
          </div>
        </figcaption>
      </figure>

      <NodeViewContent as="div" className="hidden" />
    </NodeViewWrapper>
  );
}

export default ImageNodeView;
