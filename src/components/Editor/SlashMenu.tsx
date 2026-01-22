"use client";

import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from "react";
import type { SuggestionProps } from "@tiptap/suggestion";
import type { SlashCommandItem } from "@/utils/constants";
import { Button } from "./ui/Button";
import { Icon } from "./ui/Icon";

export type SlashMenuHandle = {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean;
};

export type SlashMenuProps = SuggestionProps<SlashCommandItem> & {
  items: SlashCommandItem[];
};

export const SlashMenu = forwardRef<SlashMenuHandle, SlashMenuProps>(({ items, command }, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    setSelectedIndex(0);
  }, [items]);

  const selectItem = useCallback(
    (index: number) => {
      const item = items[index];
      if (!item) return;
      command(item);
    },
    [items, command]
  );

  const moveSelection = useCallback(
    (direction: number) => {
      const itemCount = items.length;
      if (itemCount === 0) return;
      setSelectedIndex(current => {
        const next = (current + direction + itemCount) % itemCount;
        return next;
      });
    },
    [items.length]
  );

  useImperativeHandle(
    ref,
    () => ({
      onKeyDown: ({ event }) => {
        if (event.key === "ArrowUp") {
          event.preventDefault();
          moveSelection(-1);
          return true;
        }

        if (event.key === "ArrowDown") {
          event.preventDefault();
          moveSelection(1);
          return true;
        }

        if (event.key === "Enter") {
          event.preventDefault();
          selectItem(selectedIndex);
          return true;
        }

        if (event.key === "Tab") {
          event.preventDefault();
          selectItem(selectedIndex);
          return true;
        }

        return false;
      },
    }),
    [moveSelection, selectItem, selectedIndex]
  );

  if (items.length === 0) {
    return (
      <div className="min-w-[260px] rounded-2xl border border-border bg-background/95 p-2 text-sm shadow-xl">
        <p className="px-2 py-3 text-muted-foreground">No matches. Try a different search.</p>
      </div>
    );
  }

  return (
    <div className="min-w-[260px] rounded-2xl border border-border bg-background/95 p-2 text-sm shadow-xl">
      {items.map((item, index) => {
        const isActive = index === selectedIndex;
        return (
          <Button
            key={item.id}
            variant={isActive ? "secondary" : "ghost"}
            className="mb-1 flex h-12 w-full items-center justify-start gap-3 rounded-xl px-2 py-3 last:mb-0 text-gray-700 dark:text-gray-300"
            onMouseEnter={() => setSelectedIndex(index)}
            onMouseDown={event => {
              event.preventDefault();
              selectItem(index);
            }}
          >
            <span className="flex size-9 items-center justify-center rounded-xl bg-muted">
              <Icon icon={item.icon} className="size-4" />
            </span>
            <span className="flex flex-col items-start text-left">
              <span className="text-sm font-medium">{item.title}</span>
              <span className="text-xs text-muted-foreground">{item.description}</span>
            </span>
          </Button>
        );
      })}
    </div>
  );
});

SlashMenu.displayName = "SlashMenu";
