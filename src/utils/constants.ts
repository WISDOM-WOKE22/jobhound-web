import type { Range } from "@tiptap/core";
import type { Editor } from "@tiptap/react";
import type { LucideIcon } from "lucide-react";
import {
  CheckSquare2,
  Code2,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  Image as ImageIcon,
  List,
  ListOrdered,
  Quote,
  Sigma,
  Text,
} from "lucide-react";

export type SlashCommandHandler = (props: { editor: Editor; range: Range }) => void | Promise<void>;

export type SlashCommandItem = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  keywords: string[];
  perform: SlashCommandHandler;
};

export type SlashCommandContext = {
  insertImageFromLibrary: (props: { editor: Editor }) => Promise<void> | void;
  insertImageFromUrl: (props: { editor: Editor; url?: string | null }) => Promise<void> | void;
};

const baseTextCommands: SlashCommandItem[] = [
  {
    id: "text",
    title: "Text",
    description: "Start with plain paragraphs.",
    icon: Text,
    keywords: ["paragraph", "text", "plain"],
    perform: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode("paragraph").run();
    },
  },
  {
    id: "heading1",
    title: "Heading 1",
    description: "Large section heading.",
    icon: Heading1,
    keywords: ["heading", "title", "h1"],
    perform: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode("heading", { level: 1 }).run();
    },
  },
  {
    id: "heading2",
    title: "Heading 2",
    description: "Medium section heading.",
    icon: Heading2,
    keywords: ["heading", "subtitle", "h2"],
    perform: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode("heading", { level: 2 }).run();
    },
  },
  {
    id: "heading3",
    title: "Heading 3",
    description: "Small section heading.",
    icon: Heading3,
    keywords: ["heading", "subtitle", "h3"],
    perform: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode("heading", { level: 3 }).run();
    },
  },
  {
    id: "bulletList",
    title: "Bulleted List",
    description: "Create a bulleted list.",
    icon: List,
    keywords: ["list", "bullet", "unordered"],
    perform: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).wrapIn("bulletList").run();
    },
  },
  {
    id: "orderedList",
    title: "Numbered List",
    description: "Create a numbered list.",
    icon: ListOrdered,
    keywords: ["list", "ordered", "numbered"],
    perform: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode("paragraph").wrapIn("orderedList").run();
    },
  },
  {
    id: "taskList",
    title: "To-do List",
    description: "Track tasks with checkboxes.",
    icon: CheckSquare2,
    keywords: ["todo", "task", "list"],
    perform: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleTaskList().run();
    },
  },
  {
    id: "blockquote",
    title: "Quote",
    description: "Capture a quote.",
    icon: Quote,
    keywords: ["quote", "blockquote"],
    perform: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode("paragraph").wrapIn("blockquote").run();
    },
  },
  {
    id: "codeBlock",
    title: "Code Block",
    description: "Show code snippets.",
    icon: Code2,
    keywords: ["code", "snippet", "block"],
    perform: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleCodeBlock().run();
    },
  },
  {
    id: "highlight",
    title: "Highlight",
    description: "Emphasize text with color.",
    icon: Highlighter,
    keywords: ["highlight", "color"],
    perform: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setMark("highlight").run();
    },
  },
  {
    id: "inlineMath",
    title: "Inline Math",
    description: "Insert math expression inline (e.g., $x^2 + y^2$).",
    icon: Sigma,
    keywords: ["math", "latex", "formula", "equation", "inline"],
    perform: ({ editor, range }) => {
      const latex = window.prompt("Enter LaTeX math expression:", "");
      if (latex !== null && latex.trim()) {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .insertInlineMath({ latex: latex.trim() })
          .run();
      }
    },
  },
  {
    id: "blockMath",
    title: "Block Math",
    description: "Insert math expression as a block (centered).",
    icon: Sigma,
    keywords: ["math", "latex", "formula", "equation", "block", "display"],
    perform: ({ editor, range }) => {
      const latex = window.prompt("Enter LaTeX math expression:", "");
      if (latex !== null && latex.trim()) {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .insertBlockMath({ latex: latex.trim() })
          .run();
      }
    },
  },
];

export const buildSlashCommandItems = (context: SlashCommandContext): SlashCommandItem[] => [
  {
    id: "image",
    title: "Image",
    description: "Upload or paste an image.",
    icon: ImageIcon,
    keywords: ["image", "photo", "picture", "upload"],
    perform: async ({ editor, range }) => {
      await editor.chain().focus().deleteRange(range).run();
      await context.insertImageFromLibrary({ editor });
    },
  },
  {
    id: "image-url",
    title: "Image from URL",
    description: "Paste a link to an image.",
    icon: ImageIcon,
    keywords: ["image", "photo", "url", "link"],
    perform: async ({ editor, range }) => {
      const url = window.prompt("Paste the image URL", "https://");
      await editor.chain().focus().deleteRange(range).run();
      if (!url) return;
      await context.insertImageFromUrl({ editor, url });
    },
  },
  ...baseTextCommands,
];

export const BUBBLE_MENU_ACTIONS = ["bold", "italic", "underline", "strike", "link"] as const;

export type BubbleMenuAction = (typeof BUBBLE_MENU_ACTIONS)[number];
