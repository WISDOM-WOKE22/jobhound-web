import Placeholder from "@tiptap/extension-placeholder";
import Strike from "@tiptap/extension-strike";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import type { AnyExtension } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import BoldExtension from "./Bold";
import HighlightExtension from "./Highlight";
import ItalicExtension from "./Italic";
import HeadingExtension from "./Heading";
import SlashCommands from "./SlashCommands";
import EnhancedImage, { type UploadImageFn } from "./Image";
import { MathsExtension } from "@/components/Editor/extensions/maths";
import { CodeExtension } from "@/components/Editor/extensions/code/code";
import {
  buildSlashCommandItems,
  type SlashCommandContext,
  type SlashCommandItem,
} from "@/utils/constants";

export type CreateExtensionsOptions = {
  placeholder?: string;
  uploadImage?: UploadImageFn;
  slashItems?: SlashCommandItem[];
  slashContext?: SlashCommandContext;
};

export const createExtensions = ({
  placeholder,
  uploadImage,
  slashItems,
  slashContext,
}: CreateExtensionsOptions = {}): AnyExtension[] => [
  StarterKit.configure({
    bold: false,
    italic: false,
    heading: false,
    codeBlock: false, // Disable default codeBlock, use enhanced CodeExtension instead
    blockquote: {
      HTMLAttributes: {
        class: "border-l-4 border-border pl-4 italic text-muted-foreground",
      },
    },
    bulletList: {
      HTMLAttributes: {
        class: "list-disc list-outside pl-6 leading-relaxed space-y-1",
      },
    },
    orderedList: {
      HTMLAttributes: {
        class: "list-decimal list-outside pl-6 leading-relaxed space-y-1",
      },
    },
  }) as unknown as AnyExtension,
  Table.configure({
    resizable: true,
    allowTableNodeSelection: true,
    HTMLAttributes: {
      class:
        "w-full overflow-hidden rounded-xl border border-border/80 bg-mute text-sm shadow-sm mt-4",
    },
  }),
  TableRow.configure({
    HTMLAttributes: {
      class: "border-b border-border/60 last:border-b-0",
    },
  }),
  TableHeader.configure({
    HTMLAttributes: {
      class:
        "bg-muted/60 text-muted-foreground font-medium uppercase tracking-wide text-xs border-b border-border/80",
    },
  }),
  TableCell.configure({
    HTMLAttributes: {
      class: "p-3 align-top border-r border-border/40 last:border-r-0",
    },
  }),
  BoldExtension,
  ItalicExtension,
  HeadingExtension,
  HighlightExtension,
  EnhancedImage.configure({
    uploadImage,
  }),
  Underline,
  Strike,
  Link.configure({
    openOnClick: false,
    HTMLAttributes: {
      class: "text-primary underline decoration-primary/50 underline-offset-[3px]",
      rel: "noopener noreferrer",
      target: "_blank",
    },
  }),
  TaskList.configure({
    HTMLAttributes: {
      class: "notion-task-list space-y-2",
    },
  }),
  TaskItem.configure({
    nested: true,
    HTMLAttributes: {
      class: "flex items-start gap-2",
    },
  }),
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
  CodeExtension, // Enhanced code block with full language support
  MathsExtension, // LaTeX/Math rendering (separate from code blocks)
  Placeholder.configure({
    placeholder: placeholder ?? "Type '/' for commands or start typing…",
    includeChildren: true,
    showOnlyCurrent: true,
  }),
  SlashCommands.configure({
    char: "/",
    items:
      slashItems ??
      buildSlashCommandItems(
        slashContext ?? {
          insertImageFromLibrary: async ({ editor }) => {
            const url = window.prompt("Paste the image URL", "https://");
            if (!url) return;
            editor.chain().focus().setImage({ src: url }).run();
          },
          insertImageFromUrl: async ({ editor, url }) => {
            if (!url) return;
            editor.chain().focus().setImage({ src: url }).run();
          },
        }
      ),
  }),
];

export type { UploadImageFn } from "./Image";
