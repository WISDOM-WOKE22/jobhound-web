"use client";

import type { Editor } from "@tiptap/react";
import {
  Bold as BoldIcon,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  ImagePlus,
  Italic as ItalicIcon,
  List,
  ListOrdered,
  Loader2,
  Quote,
  Sigma,
  Strikethrough,
  Text,
  Underline as UnderlineIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/Button";
import { Icon } from "./ui/Icon";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/Tooltip";

type ToolbarProps = {
  editor: Editor | null;
  className?: string;
  onImageUpload?: () => void;
  imageUploading?: boolean;
};

type ToolbarButton = {
  id: string;
  label: string;
  icon: React.ComponentProps<typeof Icon>["icon"];
  isActive: () => boolean;
  onSelect: () => void;
};

const textStyleActions = (editor: Editor): ToolbarButton[] => [
  {
    id: "paragraph",
    label: "Paragraph",
    icon: Text,
    isActive: () => editor.isActive("paragraph"),
    onSelect: () => editor.chain().focus().setParagraph().run(),
  },
  {
    id: "heading1",
    label: "Heading 1",
    icon: Heading1,
    isActive: () => editor.isActive("heading", { level: 1 }),
    onSelect: () => editor.chain().focus().setHeading({ level: 1 }).run(),
  },
  {
    id: "heading2",
    label: "Heading 2",
    icon: Heading2,
    isActive: () => editor.isActive("heading", { level: 2 }),
    onSelect: () => editor.chain().focus().setHeading({ level: 2 }).run(),
  },
  {
    id: "heading3",
    label: "Heading 3",
    icon: Heading3,
    isActive: () => editor.isActive("heading", { level: 3 }),
    onSelect: () => editor.chain().focus().setHeading({ level: 3 }).run(),
  },
];

const inlineActions = (editor: Editor): ToolbarButton[] => [
  {
    id: "bold",
    label: "Bold ⌘B",
    icon: BoldIcon,
    isActive: () => editor.isActive("bold"),
    onSelect: () => editor.chain().focus().toggleBold().run(),
  },
  {
    id: "italic",
    label: "Italic ⌘I",
    icon: ItalicIcon,
    isActive: () => editor.isActive("italic"),
    onSelect: () => editor.chain().focus().toggleItalic().run(),
  },
  {
    id: "underline",
    label: "Underline ⌘U",
    icon: UnderlineIcon,
    isActive: () => editor.isActive("underline"),
    onSelect: () => editor.chain().focus().toggleUnderline().run(),
  },
  {
    id: "strike",
    label: "Strikethrough",
    icon: Strikethrough,
    isActive: () => editor.isActive("strike"),
    onSelect: () => editor.chain().focus().toggleStrike().run(),
  },
  {
    id: "highlight",
    label: "Highlight",
    icon: Highlighter,
    isActive: () => editor.isActive("highlight"),
    onSelect: () => editor.chain().focus().toggleHighlight().run(),
  },
];

const blockActions = (editor: Editor): ToolbarButton[] => [
  {
    id: "bulletList",
    label: "Bullet list",
    icon: List,
    isActive: () => editor.isActive("bulletList"),
    onSelect: () => editor.chain().focus().toggleBulletList().run(),
  },
  {
    id: "orderedList",
    label: "Numbered list",
    icon: ListOrdered,
    isActive: () => editor.isActive("orderedList"),
    onSelect: () => editor.chain().focus().toggleOrderedList().run(),
  },
  {
    id: "blockquote",
    label: "Blockquote",
    icon: Quote,
    isActive: () => editor.isActive("blockquote"),
    onSelect: () => editor.chain().focus().toggleBlockquote().run(),
  },
  {
    id: "codeBlock",
    label: "Code block",
    icon: Code,
    isActive: () => editor.isActive("codeBlock"),
    onSelect: () => editor.chain().focus().toggleCodeBlock().run(),
  },
];

const mathActions = (editor: Editor): ToolbarButton[] => [
  {
    id: "inlineMath",
    label: "Inline Math",
    icon: Sigma,
    isActive: () => editor.isActive("inlineMath"),
    onSelect: () => {
      const latex = window.prompt("Enter LaTeX math expression:", "");
      if (latex !== null && latex.trim()) {
        editor.chain().focus().insertInlineMath({ latex: latex.trim() }).run();
      }
    },
  },
  {
    id: "blockMath",
    label: "Block Math",
    icon: Sigma,
    isActive: () => editor.isActive("blockMath"),
    onSelect: () => {
      const latex = window.prompt("Enter LaTeX math expression:", "");
      if (latex !== null && latex.trim()) {
        editor.chain().focus().insertBlockMath({ latex: latex.trim() }).run();
      }
    },
  },
];

export function Toolbar({ editor, className, onImageUpload, imageUploading }: ToolbarProps) {
  if (!editor || !editor.isEditable) {
    return null;
  }

  const groups = [
    inlineActions(editor),
    textStyleActions(editor),
    blockActions(editor),
    mathActions(editor),
  ];

  return (
    <TooltipProvider delayDuration={150}>
      <div
        className={cn(
          "flex w-full flex-wrap items-center gap-2 rounded-2xl border border-border bg-background/90 p-2 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/70",
          className
        )}
      >
        {groups.map((actions, index) => (
          <div key={index} className="flex items-center gap-1">
            {actions.map(action => (
              <Tooltip key={action.id}>
                <TooltipTrigger asChild>
                  <Button
                    variant={action.isActive() ? "secondary" : "ghost"}
                    size="sm"
                    className={cn(
                      "h-8 rounded-xl border border-transparent px-2 transition-colors",
                      action.isActive() && "border-border bg-muted text-foreground"
                    )}
                    onClick={action.onSelect}
                    aria-pressed={action.isActive()}
                  >
                    <Icon icon={action.icon} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">{action.label}</TooltipContent>
              </Tooltip>
            ))}
          </div>
        ))}
        {onImageUpload && (
          <div className="flex items-center gap-1 pl-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 rounded-xl border border-transparent px-2"
                  onClick={onImageUpload}
                  disabled={imageUploading}
                >
                  {imageUploading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <ImagePlus className="size-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Insert image</TooltipContent>
            </Tooltip>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
