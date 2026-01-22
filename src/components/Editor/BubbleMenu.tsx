"use client";

import type { Editor } from "@tiptap/react";
import { BubbleMenu as TiptapBubbleMenu } from "@tiptap/react";
import {
  Link2,
  Strikethrough,
  Underline,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  List,
  ListOrdered,
  Code,
} from "lucide-react";
import { Bold as BoldIcon, Highlighter, Italic as ItalicIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/Button";
import { Icon } from "./ui/Icon";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/Tooltip";

type BubbleMenuProps = {
  editor: Editor | null;
};

export function BubbleMenu({ editor }: BubbleMenuProps) {
  if (!editor || !editor.isEditable) return null;

  const actions = [
    {
      id: "bold",
      label: "Bold",
      icon: BoldIcon,
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: () => editor.isActive("bold"),
    },
    {
      id: "h1",
      label: "Heading 1",
      icon: Heading1,
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: () => editor.isActive("heading", { level: 1 }),
    },
    {
      id: "h2",
      label: "Heading 2",
      icon: Heading2,
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: () => editor.isActive("heading", { level: 2 }),
    },
    {
      id: "h3",
      label: "Heading 3",
      icon: Heading3,
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: () => editor.isActive("heading", { level: 3 }),
    },
    {
      id: "blockquote",
      label: "Blockquote",
      icon: Quote,
      action: () => {
        if (editor.isActive("blockquote")) {
          editor.chain().focus().lift("blockquote").run();
        } else {
          editor.chain().focus().wrapIn("blockquote").run();
        }
      },
      isActive: () => editor.isActive("blockquote"),
    },
    {
      id: "bulletList",
      label: "Bullet List",
      icon: List,
      action: () => {
        if (editor.isActive("bulletList")) {
          editor.chain().focus().lift("bulletList").run();
        } else {
          editor.chain().focus().wrapIn("bulletList").run();
        }
      },
      isActive: () => editor.isActive("bulletList"),
    },
    {
      id: "orderedList",
      label: "Ordered List",
      icon: ListOrdered,
      action: () => {
        if (editor.isActive("orderedList")) {
          editor.chain().focus().lift("orderedList").run();
        } else {
          editor.chain().focus().wrapIn("orderedList").run();
        }
      },
      isActive: () => editor.isActive("orderedList"),
    },
    {
      id: "code",
      label: "Code",
      icon: Code,
      action: () => editor.chain().focus().toggleMark("code").run(),
      isActive: () => editor.isActive("code"),
    },
    {
      id: "italic",
      label: "Italic",
      icon: ItalicIcon,
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: () => editor.isActive("italic"),
    },
    {
      id: "underline",
      label: "Underline",
      icon: Underline,
      action: () => editor.chain().focus().toggleUnderline().run(),
      isActive: () => editor.isActive("underline"),
    },
    {
      id: "strike",
      label: "Strikethrough",
      icon: Strikethrough,
      action: () => editor.chain().focus().toggleStrike().run(),
      isActive: () => editor.isActive("strike"),
    },
    {
      id: "highlight",
      label: "Highlight",
      icon: Highlighter,
      action: () => editor.chain().focus().toggleHighlight().run(),
      isActive: () => editor.isActive("highlight"),
    },
    {
      id: "link",
      label: "Add link",
      icon: Link2,
      action: () => {
        const previousUrl = editor.getAttributes("link").href as string | undefined;
        const url = window.prompt("Paste the URL", previousUrl ?? "https://");

        if (url === null) return;

        if (url === "") {
          editor.chain().focus().unsetLink().run();
          return;
        }

        editor
          .chain()
          .focus()
          .extendMarkRange("link")
          .setLink({ href: url, target: "_blank", rel: "noopener noreferrer" })
          .run();
      },
      isActive: () => editor.isActive("link"),
    },
  ];

  return (
    <TooltipProvider delayDuration={100}>
      <TiptapBubbleMenu
        editor={editor}
        tippyOptions={{
          maxWidth: "auto",
          moveTransition: "transform 0.15s ease",
          placement: "top",
          animation: "scale-subtle",
        }}
        className="bubble-menu bg-transparent"
        shouldShow={({ editor }) => {
          if (!editor.view) return false;
          if (!editor.state.selection || editor.state.selection.empty) return false;
          if (editor.isActive("image") || editor.isActive("codeBlock")) return false;
          return true;
        }}
      >
        <div className="flex items-center gap-1 rounded-full border border-white/20 px-1.5 py-1 shadow-lg bg-white/10 backdrop-blur-md supports-[backdrop-filter]:bg-white/10">
          {actions.map(action => (
            <Tooltip key={action.id}>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant={action.isActive() ? "secondary" : "ghost"}
                  className={cn(
                    "size-8 rounded-full border border-transparent p-0 hover:bg-white/20",
                    action.isActive() && "border-white/30 bg-white/20"
                  )}
                  onClick={action.action}
                  aria-pressed={action.isActive()}
                >
                  <Icon icon={action.icon} className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">{action.label}</TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TiptapBubbleMenu>
    </TooltipProvider>
  );
}
