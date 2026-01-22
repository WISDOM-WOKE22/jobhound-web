import { mergeAttributes } from "@tiptap/core";
import Heading from "@tiptap/extension-heading";
import type { Level } from "@tiptap/extension-heading";

const levelClassMap: Record<number, string> = {
  1: "text-3xl font-bold tracking-tight",
  2: "text-2xl font-semibold tracking-tight",
  3: "text-xl font-semibold tracking-tight",
};

export const HeadingExtension = Heading.extend({
  addOptions() {
    return {
      ...this.parent?.(),
      // Restrict heading levels to h1-h3; ensure mutable array of the correct Level[] type
      levels: [1, 2, 3] as Level[],
      HTMLAttributes: {
        class: "",
      },
    };
  },

  renderHTML({ node, HTMLAttributes }) {
    const level = this.options.levels.includes(node.attrs.level)
      ? node.attrs.level
      : this.options.levels[0];
    const className = levelClassMap[level] ?? levelClassMap[1];

    return [
      `h${level}`,
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        class: className,
      }),
      0,
    ];
  },
});

export default HeadingExtension;
