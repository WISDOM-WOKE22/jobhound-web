import { Extension } from "@tiptap/core";
import Suggestion from "@tiptap/suggestion";
import { ReactRenderer } from "@tiptap/react";
import tippy, { type Instance as TippyInstance } from "tippy.js";
import {
  SlashMenu,
  type SlashMenuHandle,
  type SlashMenuProps,
} from "@/components/Editor/SlashMenu";
import type { SlashCommandItem } from "@/utils/constants";

export interface SlashCommandsOptions {
  char: string;
  items: SlashCommandItem[];
}

const filterItems = (query: string, items: SlashCommandItem[]) => {
  if (!query) return items.slice(0, 8);

  const lowerQuery = query.toLowerCase();
  return items
    .filter(item => {
      if (item.title.toLowerCase().includes(lowerQuery)) return true;
      return item.keywords.some(keyword => keyword.toLowerCase().includes(lowerQuery));
    })
    .slice(0, 8);
};

export const SlashCommands = Extension.create<SlashCommandsOptions>({
  name: "slash-commands",

  addOptions() {
    return {
      char: "/",
      items: [] satisfies SlashCommandItem[],
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion<SlashCommandItem>({
        editor: this.editor,
        char: this.options.char,
        allow: ({ state, range }) => {
          const $from = state.doc.resolve(range.from);
          const parent = $from.parent;

          if (parent.type.spec.code) {
            return false;
          }

          return true;
        },
        items: ({ query }) => filterItems(query, this.options.items),
        command: ({ editor, range, props }) => {
          Promise.resolve(props.perform({ editor, range })).catch(error => {
            console.error("Slash command execution failed", error);
          });
        },
        render: () => {
          let component: ReactRenderer<SlashMenuHandle, SlashMenuProps>;
          let popup: TippyInstance | undefined;

          return {
            onStart: props => {
              component = new ReactRenderer(SlashMenu, {
                editor: props.editor,
                props: {
                  ...props,
                  items: props.items,
                },
              });

              if (!props.clientRect) {
                return;
              }

              popup = tippy(document.body, {
                getReferenceClientRect: () => props.clientRect?.() as DOMRect,
                appendTo: () => document.body,
                content: component.element,
                showOnCreate: true,
                interactive: true,
                trigger: "manual",
                placement: "bottom-start",
                maxWidth: "none",
                offset: [0, 8],
                theme: "slash-menu",
                animation: "scale-subtle",
              });
            },
            onUpdate: props => {
              component.updateProps({
                ...props,
                items: props.items,
              });

              if (!props.clientRect) {
                return;
              }

              popup?.setProps({
                getReferenceClientRect: () => props.clientRect?.() as DOMRect,
              });
            },
            onKeyDown: props => {
              if (props.event.key === "Escape") {
                popup?.hide();
                return true;
              }

              if (component.ref?.onKeyDown({ event: props.event })) {
                return true;
              }

              return false;
            },
            onExit: () => {
              popup?.destroy();
              component.destroy();
            },
          };
        },
      }),
    ];
  },
});

export default SlashCommands;
